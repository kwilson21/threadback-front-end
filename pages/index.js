import {
  Grid,
  Container,
  Divider,
  Text,
  Page,
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
import Scroll from "react-scroll";
import { NextSeo } from "next-seo";

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

  const scroller = Scroll.scroller;
  const Element = Scroll.Element;

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

  if (loading && !data) {
    return (
      <Fragment>
        <Page>
          <Container style={{ left: "50%" }}>
            <Page.Content>
              <Spinner size="large" />
            </Page.Content>
          </Container>
        </Page>
      </Fragment>
    );
  }

  const hasMoreThreads = data.threads.items.length < data.threads.count;

  return (
    <Fragment>
      <NextSeo
        title="Threadback | Home"
        openGraph={{
          title: "Threadback | Home",
        }}
      />

      <Page>
        <Container style={{ margin: "0 auto" }}>
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
                            .utc(
                              data.threads.items[currentThread].tweets[0].date
                            )
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
                                      scroller.scrollTo("tweetGroup", {
                                        smooth: "easeOutQuad",
                                        delay: 2,
                                        duration: 500,
                                        offset: -220,
                                      });
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
                                    scroller.scrollTo("tweetGroup", {
                                      smooth: "easeOutQuad",
                                      delay: 2,
                                      duration: 500,
                                      offset: -220,
                                    });
                                  }
                                }}
                                onSwipedLeft={() => {
                                  if (currentThread < data.threads.count) {
                                    if (currentThread === offsetCount) {
                                      setOffsetCount(offsetCount + limit);
                                    }
                                    setCurrentThread(currentThread + 1);
                                    scroller.scrollTo("tweetGroup", {
                                      smooth: "easeOutQuad",
                                      delay: 2,
                                      duration: 500,
                                      offset: -220,
                                    });
                                  }
                                }}
                              >
                                <Element name="tweetGroup" />
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
                                      scroller.scrollTo("tweetGroup", {
                                        smooth: "easeOutQuad",
                                        delay: 2,
                                        duration: 500,
                                        offset: -220,
                                      });
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
                                      scroller.scrollTo("tweetGroup", {
                                        smooth: "easeOutQuad",
                                        delay: 2,
                                        duration: 500,
                                        offset: -220,
                                      });
                                    }
                                  }}
                                >
                                  <ArrowLeft />
                                </a>
                              </Sticky>
                            </Col>
                            <Col span={22}>
                              <Element name="tweetGroup" />
                              <TweetGroup
                                tweets={
                                  data.threads.items[currentThread].tweets
                                }
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
                                      scroller.scrollTo("tweetGroup", {
                                        smooth: "easeOutQuad",
                                        delay: 2,
                                        duration: 500,
                                        offset: -220,
                                      });
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
              {loading && data && (
                <Col align="center">
                  <Spinner size="large" />
                </Col>
              )}
            </Grid.Container>
          </Page.Content>
        </Container>
      </Page>
    </Fragment>
  );
}
