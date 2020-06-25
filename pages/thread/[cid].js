import Head from "next/head";
import UserHead from "../../components/UserHead";
import { useQuery, useMutation } from "graphql-hooks";
import { getAThreadQuery } from "../../queries/getAThreadQuery";
import {
  Grid,
  Spacer,
  Container,
  useToasts,
  Spinner,
  Page,
  Divider,
  Text,
} from "@zeit-ui/react";
import Error from "next/error";

import { useRouter } from "next/router";
import TweetGroup from "../../components/TweetGroup";
import RefreshUserButton from "../../components/RefreshUserButton";
import { Fragment } from "react";
import SearchBox from "../../components/SearchBox";
import { refreshThreadsMutation } from "../../queries/refreshThreadsMutation";
import Sticky from "react-stickynode";
import useWindowLocation from "../../hooks/useWindowLocation";

export default function Thread() {
  const router = useRouter();
  const { cid } = router.query;

  const [toasts, setToast] = useToasts();
  const windowLocation = useWindowLocation();

  const { loading, error, data } = useQuery(getAThreadQuery, {
    variables: { offset: 0, limit: 1, conversationIds: [cid] },
  });

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

  if (loading) {
    return (
      <Container style={{ padding: 20, margin: "0 auto" }} justify="center">
        <Spacer x={8} />
        <Spinner size="large" />
        <Spacer x={8} />
      </Container>
    );
  }

  const { items } = data.threads;

  const thread = items[0];

  const tweetText = `${thread.tweets[0].text.slice(0, 120)}...`;

  const description = `Thread by @${thread.user.username}: ${tweetText}`;

  return (
    <Fragment>
      {!data && !error ? (
        <Error statusCode={404} />
      ) : (
        <Page>
          <Container style={{ margin: "0 auto" }}>
            <Head>
              <title>ThreadBack | {description}</title>
              <link rel="icon" href="/favicon.ico" />
              <meta property="og:title" content={description} />
              <meta
                property="og:image:secure"
                content={thread.user.profilePhoto}
              />
              <meta property="og:url" content={windowLocation} />
              <meta property="og:description" content={description} />
              <meta property="article:author" content={thread.user.username} />
              <meta property="og:type" content="article" />
            </Head>
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
      )}
    </Fragment>
  );
}
