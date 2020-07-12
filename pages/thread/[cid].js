import UserHead from "../../components/UserHead";
import { useMutation } from "graphql-hooks";
import { getAThreadQuery } from "../../queries/getAThreadQuery";
import {
  Grid,
  Container,
  useToasts,
  Page,
  Divider,
  Text,
} from "@zeit-ui/react";
import Error from "next/error";

import TweetGroup from "../../components/TweetGroup";
import RefreshUserButton from "../../components/RefreshUserButton";
import { Fragment } from "react";
import SearchBox from "../../components/SearchBox";
import { refreshThreadsMutation } from "../../queries/refreshThreadsMutation";
import Sticky from "react-stickynode";
import useWindowLocation from "../../hooks/useWindowLocation";
import { request } from "graphql-request";
import { NextSeo } from "next-seo";

function Thread({ data, error, cid }) {
  const [toasts, setToast] = useToasts();
  const windowLocation = useWindowLocation();

  const [refreshUser, refreshRes] = useMutation(refreshThreadsMutation, {
    variables: {
      username:
        data && data.threads ? data.threads.items[0].user.username : null,
    },
  });

  if (error) {
    setToast({
      text: "An error has occured while fetching data",
      type: "error",
    });
  }

  const { items } = data.threads;

  const thread = items[0];

  const tweetText = `${thread.tweets[0].text}...`;

  const description = `Thread by @${thread.user.username}: ${tweetText}`;

  return (
    <Fragment>
      {!data && !error ? (
        <Error statusCode={404} />
      ) : (
        <Fragment>
          <NextSeo
            description={description}
            title={`ThreadBack | ${description}`}
            keywords="twitter, twitter replies, twitter mentions, twitter thread"
            openGraph={{
              title: description,
              images: [
                {
                  url: thread.user.profilePhoto,
                  width: 400,
                  height: 400,
                  alt: "User profile photo",
                },
              ],
              url: windowLocation,
              description: description,
              type: "article",
              article: {
                authors: [thread.user.link],
              },
            }}
            twitter={{
              handle: `@${thread.user.username}`,
            }}
          />
          <Page>
            <Container style={{ margin: "0 auto" }}>
              <Page.Content>
                <Grid.Container gap={2}>
                  <Grid xs={24}>
                    <Container justify="center">
                      <UserHead user={thread.user} />
                      <RefreshUserButton
                        loading={refreshRes.loading}
                        refreshUser={refreshUser}
                        status={
                          refreshRes.data
                            ? refreshRes.data.refresh.status
                            : thread.user.status
                        }
                      />
                    </Container>
                  </Grid>
                </Grid.Container>

                <Divider align="center" />
                <Grid.Container gap={2}>
                  <Grid xs={24}>
                    <Text h2>Search</Text>
                  </Grid>
                  <Grid xs>
                    <Sticky innerZ={999}>
                      <SearchBox />
                    </Sticky>
                  </Grid>
                </Grid.Container>
                <Divider align="center" />

                <Grid.Container gap={2}>
                  <TweetGroup tweets={thread.tweets} />
                </Grid.Container>
              </Page.Content>
            </Container>
          </Page>
        </Fragment>
      )}
    </Fragment>
  );
}

export async function getServerSideProps(context) {
  try {
    const res = await request(
      process.env.NEXT_PUBLIC_GRAPHQL_URL,
      getAThreadQuery,
      { offset: 0, limit: 1, conversationIds: [context.params.cid] }
    );
    return {
      props: { data: res, cid: context.params.cid },
    };
  } catch (err) {
    return {
      props: { data: null, error: err, cid: context.params.cid },
    };
  }
}

export default Thread;
