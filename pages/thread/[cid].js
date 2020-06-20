import Head from "next/head";
import UserHead from "../../components/UserHead";
import { useQuery, useMutation } from "graphql-hooks";
import { getAThreadQuery } from "../../queries/getAThreadQuery";
import {
  Grid,
  Col,
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
import useWindowSize from "../../hooks/useWindowSize";
import useScrollPast from "../../hooks/useScrollPast";

export default function Thread() {
  const router = useRouter();
  const { cid } = router.query;

  const size = useWindowSize();
  const scroll = useScrollPast(325);
  const [toasts, setToast] = useToasts();

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

  return (
    <Fragment>
      {!data && !error ? (
        <Error statusCode={404} />
      ) : (
        <Page>
          <Container style={{ margin: "0 auto", marginTop: 10 }}>
            <Head>
              <title>ThreadBack | Thread by @{thread.user.username}</title>
              <link rel="icon" href="/favicon.ico" />
            </Head>
            <Page.Content>
              <Grid.Container gap={2}>
                <Grid xs={24}>
                  <Container
                    style={{
                      position: "fixed",
                      top: 0,
                      zIndex: 999,
                      marginBottom: 10,
                      marginTop: 5,
                      visibility: scroll ? "visible" : "hidden",
                      margin: "0 auto",
                    }}
                  >
                    <SearchBox />
                  </Container>
                </Grid>
                <Grid xs={24}>
                  <Container
                    justify="center"
                    style={{ visibility: scroll ? "hidden" : "visible" }}
                  >
                    <UserHead
                      user={thread.user}
                      showBio={size.width > 967 ? true : false}
                    />
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
              <Container
                justify="center"
                style={{ visibility: scroll ? "hidden" : "visible" }}
              >
                <Grid.Container gap={2}>
                  <Grid xs={24}>
                    <Text h2>Search</Text>
                  </Grid>

                  <SearchBox />
                </Grid.Container>
              </Container>
              <Divider align="center" />

              <Grid.Container gap={2}>
                <Grid xs>
                  <TweetGroup tweets={thread.tweets} />
                </Grid>
              </Grid.Container>
            </Page.Content>
          </Container>
        </Page>
      )}
    </Fragment>
  );
}
