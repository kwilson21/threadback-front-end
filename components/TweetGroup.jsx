import { Fragment } from "react";
import getUrls from "get-urls";
import { Tweet } from "react-twitter-widgets";
import YouTube from "react-youtube";

import { Grid, Text, Image, Link, Display } from "@zeit-ui/react";

import LazyLoad from "react-lazyload";

import map from "lodash/map";
import forEach from "lodash/forEach";
import orderBy from "lodash/orderBy";
import JsxParser from "react-jsx-parser";

const formatTweet = (tweet, size) => {
  const { text, mentions, urls, photos } = tweet;

  let jsx = text;

  const extractedUrlSet = getUrls(text, {
    requireSchemeOrWww: false,
    normalizeProtocol: false,
    stripProtocol: true,
  });

  const extractedUrls = [...extractedUrlSet];

  if (mentions.length > 0) {
    forEach(mentions, (mention) => {
      jsx = jsx.replace(
        new RegExp(`@${mention}`, "gi"),
        `<Link color href="https://twitter.com/${mention}">$&</Link>`
      );
    });
  }

  if (urls.length > 0) {
    forEach(urls, (url) => {
      if (url.includes("status") && url.includes("twitter")) {
        const tweetId = url.split("/").slice(-1);
        jsx = jsx.replace(
          url,
          `<LazyLoad><Tweet tweetId="${tweetId}"/></LazyLoad>`
        );
      } else if (url.includes("youtube") || url.includes("youtu.be")) {
        const videoId = url.split("watch?v=").slice(-1);
        jsx = jsx.replace(
          url,
          `<LazyLoad><YouTube videoId="${videoId}"/></LazyLoad>`
        );
      } else {
        jsx = jsx.replace(url, `<Link color href="${url}">${url}</Link>`);
      }
    });
  }

  if (extractedUrls.length > 0) {
    forEach(extractedUrls, (extractedUrl) => {
      const jsxUrl = `<Link color href="${extractedUrl}">${extractedUrl}</Link>`;
      if (extractedUrl.includes("pic.twitter")) {
        let imageStr = "";
        forEach(
          photos,
          (url) =>
            (imageStr =
              imageStr +
              `<Display><LazyLoad><Image src="${url}"></Image></LazyLoad></Display>`)
        );
        jsx = jsx.replace(extractedUrl, imageStr);
      } else if (
        !jsx.includes(jsxUrl) &&
        !urls.some((url) =>
          jsx.includes(`<Link color href="${url}">${url}</Link>`)
        )
      ) {
        jsx = jsx.replace(extractedUrl, jsxUrl);
      }
    });
  }

  jsx = `<Text ${size} style={{whiteSpace: "pre-wrap"}} span>${jsx}</Text>`;

  return (
    <JsxParser
      components={{ Image, Link, Tweet, Text, YouTube, Display, LazyLoad }}
      jsx={jsx}
    />
  );
};

export default function TweetGroup(props) {
  const { tweets, size } = props;

  const sortedTweets = orderBy(tweets, "tweetId");

  return (
    <Fragment>
      {map(sortedTweets, (tweet, idx) => {
        return (
          <Grid xs={24} key={idx}>
            {formatTweet(tweet, size ? size : 'size="1.5rem"')}
          </Grid>
        );
      })}
    </Fragment>
  );
}
