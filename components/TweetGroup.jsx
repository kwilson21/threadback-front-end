import { Fragment } from "react";
import getUrls from "get-urls";
import { Tweet } from "react-twitter-widgets";
import YouTube from "react-youtube";

import { Grid, Text, Image, Link, Display } from "@zeit-ui/react";

import JsxParser from "react-jsx-parser";

const youtubeOpts = {
  height: "390",
  width: "640",
  playerVards: {
    autoplay: 0,
  },
};

const formatTweet = (tweet, size) => {
  const { text, mentions, urls, photos } = tweet;

  let jsx = text;

  const urls_set = getUrls(text, {
    requireSchemeOrWww: false,
    normalizeProtocol: false,
    stripProtocol: true,
  });

  const _urls = [...urls_set];

  if (_urls.length > 0 && photos.length > 0) {
    for (let i = 0; i < _urls.length; i++) {
      if (_urls[i].includes("pic.twitter")) {
        let imageStr = "";
        photos.forEach(
          (url) =>
            (imageStr =
              imageStr + `<Display><Image src="${url}"></Image></Display>`)
        );
        jsx = jsx.replace(_urls[i], imageStr);
      }
    }
  }

  if (mentions.length > 0) {
    mentions.forEach((mention) => {
      let splitTweet = jsx.split(" ");
      jsx = splitTweet
        .map((str) => {
          const word = str.toLowerCase();
          if (word.startsWith("@") && word === mention) {
            return `<Link color href="https://twitter.com/${mention}">${str}</Link>`;
          } else if (word.startsWith("@") && word.includes(mention)) {
            let splitWord = word.split(`@${mention}`);
            splitWord[0] = `<Link color href="https://twitter.com/${mention}">@${mention}</Link>`;
            return splitWord.join("");
          } else {
            return str;
          }
        })
        .join(" ");
    });
  }

  if (urls.length > 0) {
    urls.forEach((url) => {
      if (url.includes("status") && url.includes("twitter")) {
        const tweetId = url.split("/").slice(-1);
        jsx = jsx.replace(url, `<Tweet tweetId="${tweetId}"/>`);
      } else if (url.includes("youtube")) {
        const videoId = url.split("watch?v=").slice(-1);
        jsx = jsx.replace(
          url,
          `<YouTube style={{marginLeft: "auto", marginRight: "auto"}} videoId="${videoId}"/>`
        );
      } else {
        jsx = jsx.replace(url, `<Link color href="${url}">${url}</Link>`);
      }
    });
  }

  jsx = `<Text ${size} span>${jsx}</Text>`;

  return (
    <JsxParser
      components={{ Image, Link, Tweet, Text, YouTube, Display }}
      jsx={jsx}
    />
  );
};

export default function TweetGroup(props) {
  const { tweets, size } = props;

  let tweetSize = size;

  if (size === undefined) {
    tweetSize = "h3";
  }
  return (
    <Fragment>
      {tweets.map((tweet, idx) => {
        return (
          <Grid xs={24} key={idx}>
            {formatTweet(tweet, tweetSize)}
          </Grid>
        );
      })}
    </Fragment>
  );
}
