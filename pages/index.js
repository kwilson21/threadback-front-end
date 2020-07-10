import Head from "next/head";

import {
  Grid,
  Container,
  Divider,
  Text,
  Page,
  Spacer,
  Spinner,
  Col,
  Select,
  useToasts,
} from "@zeit-ui/react";

import ThreadCardGroup from "../components/ThreadCardGroup";
import SearchBox from "../components/SearchBox";
import Sticky from "react-stickynode";
import { useState, Fragment } from "react";
import { useQuery } from "graphql-hooks";
import { allThreadsQuery } from "../queries/allThreadsQuery";
import moment from "moment-timezone";
import TweetGroup from "../components/TweetGroup";
import { isMobile, isBrowser } from "react-device-detect";
import { ArrowLeft, ArrowRight } from "@zeit-ui/react-icons";
import UserHead from "../components/UserHead";
import { Swipeable } from "react-swipeable";

const updateData = (prevData, data) => {
  return {
    threads: {
      items: [...prevData.threads.items, ...data.threads.items],
      count: data.threads.count,
    },
  };
};

export default function Home() {
  const limit = 15;

  const [offsetCount, setOffsetCount] = useState(0);
  const [threadView, setThreadView] = useState("multiple");
  const [currentThread, setCurrentThread] = useState(0);
  const [toasts, setToast] = useToasts();

  const { loading, error, data } = useQuery(allThreadsQuery, {
    variables: { offset: offsetCount, limit },
    updateData,
  });

  if (error) {
    setToast({
      text: "An error has occured while fetching data",
      type: "error",
    });
  }

  if (loading && !data)
    return (
      <Container style={{ padding: 20, margin: "0 auto" }} justify="center">
        <Spacer x={8} />
        <Spinner size="large" />
        <Spacer x={8} />
      </Container>
    );

  const hasMoreThreads = data.threads.items.length < data.threads.count;

  return (
    <Page>
      <Container style={{ margin: "0 auto" }}>
        <Head>
          <title>Threadback | Home</title>
          <link rel="icon" href="/favicon.ico" />
          <meta
            property="og:description"
            content="Catch up on all of your favorite twitter user's threads with ThreadBack"
          />
          <meta
            name="description"
            content="Catch up on all of your favorite twitter user's threads with ThreadBack"
          />
          <meta
            name="keywords"
            content="twitter, twitter replies, twitter mentions, twitter thread"
          />
        </Head>

        <Page.Content>
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
            <Grid xs={24}>
              <Text h2>View type</Text>
            </Grid>
            <Grid xs>
              <Select
                value={threadView}
                initialValue={threadView}
                placeholder={threadView}
                onChange={(v) => setThreadView(v)}
                size="large"
              >
                <Select.Option value="single">Single</Select.Option>
                <Select.Option value="multiple">Multiple</Select.Option>
              </Select>
            </Grid>
          </Grid.Container>
          <Divider align="center" />
          <Grid.Container gap={2}>
            <Grid xs={24}>
              <Text h2>Recent</Text>
            </Grid>

            {data && threadView === "multiple" ? (
              <ThreadCardGroup
                data={data}
                hasMoreThreads={hasMoreThreads}
                setOffsetCount={setOffsetCount}
                offsetCount={offsetCount}
                limit={limit}
              />
            ) : (
              <Fragment>
                {data && (
                  <Fragment>
                    <UserHead user={data.threads.items[currentThread].user} />
                    <Grid xs={12}>
                      <Text size="1rem" style={{ float: "left" }}>
                        {moment
                          .utc(data.threads.items[currentThread].tweets[0].date)
                          .fromNow()}
                      </Text>
                    </Grid>
                    <Grid xs={12}>
                      <Text size="1rem" style={{ float: "right" }}>
                        {`${data.threads.count - currentThread} of ${
                          data.threads.count
                        }`}
                      </Text>
                    </Grid>
                    <Col justify="center">
                      {isMobile && (
                        <Fragment>
                          <Col
                            span={1}
                            style={{
                              visibility:
                                currentThread === 0 ? "hidden" : "visible",
                            }}
                          >
                            <Sticky top={window.innerHeight / 2}>
                              <a
                                onClick={() => {
                                  if (currentThread > 0) {
                                    setCurrentThread(currentThread - 1);
                                    window.scrollTo(0, 425);
                                  }
                                }}
                              >
                                <ArrowLeft />
                              </a>
                            </Sticky>
                          </Col>
                          <Col span={22}>
                            <Swipeable
                              onSwipedRight={() => {
                                if (currentThread > 0) {
                                  setCurrentThread(currentThread - 1);
                                  window.scrollTo(0, 425);
                                }
                              }}
                              onSwipedLeft={() => {
                                if (currentThread < data.threads.count) {
                                  if (currentThread === offsetCount) {
                                    setOffsetCount(offsetCount + limit);
                                  }
                                  setCurrentThread(currentThread + 1);
                                  window.scrollTo(0, 425);
                                }
                              }}
                            >
                              <TweetGroup
                                tweets={
                                  data.threads.items[currentThread].tweets
                                }
                              />
                            </Swipeable>
                          </Col>
                          <Col span={1}>
                            <Sticky top={window.innerHeight / 2}>
                              <a
                                onClick={() => {
                                  if (currentThread < data.threads.count) {
                                    if (currentThread === offsetCount) {
                                      setOffsetCount(offsetCount + limit);
                                    }
                                    setCurrentThread(currentThread + 1);
                                    window.scrollTo(0, 425);
                                  }
                                }}
                              >
                                <ArrowRight />
                              </a>
                            </Sticky>
                          </Col>
                        </Fragment>
                      )}
                      {isBrowser && (
                        <Fragment>
                          <Col
                            span={1}
                            style={{
                              visibility:
                                currentThread === 0 ? "hidden" : "visible",
                            }}
                          >
                            <Sticky top={window.innerHeight / 2}>
                              <a
                                onClick={() => {
                                  if (currentThread > 0) {
                                    setCurrentThread(currentThread - 1);
                                    window.scrollTo(0, 425);
                                  }
                                }}
                              >
                                <ArrowLeft />
                              </a>
                            </Sticky>
                          </Col>
                          <Col span={22}>
                            <TweetGroup
                              tweets={data.threads.items[currentThread].tweets}
                            />
                          </Col>
                          <Col span={1}>
                            <Sticky top={window.innerHeight / 2}>
                              <a
                                onClick={() => {
                                  if (currentThread < data.threads.count) {
                                    if (currentThread === offsetCount) {
                                      setOffsetCount(offsetCount + limit);
                                    }
                                    setCurrentThread(currentThread + 1);
                                    window.scrollTo(0, 425);
                                  }
                                }}
                              >
                                <ArrowRight />
                              </a>
                            </Sticky>
                          </Col>
                        </Fragment>
                      )}
                    </Col>
                  </Fragment>
                )}
              </Fragment>
            )}
            {loading && (
              <Col align="center">
                <Spinner size="large" />
              </Col>
            )}
          </Grid.Container>
        </Page.Content>
      </Container>
    </Page>
  );
}
