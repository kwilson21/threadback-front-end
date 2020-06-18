import Head from "next/head";
import UserHead from "../../components/UserHead";
import { useQuery } from "graphql-hooks";
import { getAThreadQuery } from "../../queries/getAThreadQuery";
import {
  Grid,
  Col,
  Spacer,
  Container,
  Divider,
  useToasts,
  Spinner,
  Row,
} from "@zeit-ui/react";
import Error from "next/error";

import { useRouter } from "next/router";
import TweetGroup from "../../components/TweetGroup";
import RefreshUserButton from "../../components/RefreshUserButton";
import { Fragment } from "react";
import SearchBox from "../../components/SearchBox";

export default function Thread() {
  const router = useRouter();
  const { cid } = router.query;

  const [toasts, setToast] = useToasts();

  const { loading, error, data } = useQuery(getAThreadQuery, {
    variables: { offset: 0, limit: 1, conversationIds: [cid] },
  });

  if (error) {
    setToast({
      text: "An error has occured while fetching data",
      type: "error",
    });
  }

  if (loading && !data) {
    return (
      <Container style={{ padding: 20 }} justify="center">
        <Spacer x={8} />
        <Spinner size="large" />
        <Spacer x={8} />
      </Container>
    );
  } else if (!data) {
    return (
      <Container style={{ padding: 20 }} justify="center">
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
      {data === undefined && !error ? (
        <Error statusCode={404} />
      ) : (
        <Container style={{ padding: 20 }}>
          <Spacer x={8} />

          <Head>
            <title>ThreadBack | Thread by @{thread.user}</title>
            <link rel="icon" href="/favicon.ico" />
          </Head>

          <Col span={13} style={{ margin: "0 auto", width: "100%" }}>
            <Grid.Container gap={2} justify="center">
              <Fragment>
                <Grid xs={24}>
                  <Container justify="center">
                    <Row
                      style={{
                        position: "fixed",
                        top: 0,
                        zIndex: 999,
                        height: "40px",
                      }}
                    >
                      <Container style={{ marginTop: 31 }}>
                        <UserHead user={thread.user} />
                      </Container>
                      <Container style={{ marginTop: 15 }}>
                        <RefreshUserButton
                          username={thread.user.username}
                          status={thread.user.status}
                        />
                      </Container>
                      <Spacer x={1} />
                      <Container style={{ marginTop: 4 }}>
                        <SearchBox />
                      </Container>
                    </Row>
                  </Container>
                </Grid>
                <TweetGroup tweets={thread.tweets} />
              </Fragment>
            </Grid.Container>
          </Col>
          <Spacer x={8} />
        </Container>
      )}
    </Fragment>
  );
}
