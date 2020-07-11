import Head from "next/head";
import UserHead from "../../components/UserHead";
import {
  Grid,
  Container,
  useToasts,
  Spinner,
  useModal,
  Divider,
  Text,
  Page,
  Select,
  Col,
} from "@zeit-ui/react";
import { useRouter } from "next/router";
import ThreadCardGroup from "../../components/ThreadCardGroup";
import RefreshUserButton from "../../components/RefreshUserButton";
import { getAUserQuery } from "../../queries/getAUserQuery";
import { getUserThreadsQuery } from "../../queries/getUserThreadsQuery";
import { allThreadsQuery } from "../../queries/allThreadsQuery";
import { useQuery, useMutation } from "graphql-hooks";
import { Fragment } from "react";
import Error from "next/error";
import UserMissingModal from "../../components/UserMissingModal";
import SearchBox from "../../components/SearchBox";
import { refreshThreadsMutation } from "../../queries/refreshThreadsMutation";
import Sticky from "react-stickynode";
import { useState } from "react";
import { Swipeable } from "react-swipeable";
import TweetGroup from "../../components/TweetGroup";
import moment from "moment-timezone";
import { isMobile, isBrowser } from "react-device-detect";
import { ArrowLeft, ArrowRight } from "@zeit-ui/react-icons";
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

export default function User() {
  const router = useRouter();
  const { username } = router.query;

  const [threadView, setThreadView] = useState("multiple");
  const [toasts, setToast] = useToasts();
  const { visible, setVisible, bindings } = useModal(true);
  const [offsetCount, setOffsetCount] = useState(0);
  const [currentThread, setCurrentThread] = useState(0);

  const scroller = Scroll.scroller;
  const Element = Scroll.Element;

  const { loading, error, data } = useQuery(getAUserQuery, {
    variables: { offset: 0, limit: 1, usernames: [username] },
  });

  let res;
  const limit = 15;

  if (!username) {
    res = useQuery(allThreadsQuery, {
      variables: { offset: offsetCount, limit },
      updateData,
    });
  } else {
    res = useQuery(getUserThreadsQuery, {
      variables: {
        offset: offsetCount,
        limit,
        usernames: [username],
      },
      updateData,
    });
  }

  const [refreshUser, refreshRes] = useMutation(refreshThreadsMutation, {
    variables: { username: username },
  });

  if (error || refreshRes.error) {
    setToast({
      text: "An error has occured while fetching data",
      type: "error",
    });
  }

  if (loading) {
    return (
      <Fragment>
        {/* <Head>
          <title>ThreadBack | @{username}'s threads</title>
          <link rel="icon" href="/favicon.ico" />
          <meta name="og:title" content={`@${username}'s threads`} />
          <meta
            name="og:description"
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
        </Head> */}
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

  const { items } = data.users;

  const user = items[0];

  let hasMoreThreads = false;
  if (res.data) {
    hasMoreThreads = res.data.threads.items.length < res.data.threads.count;
  }

  return (
    <Fragment>
      {items.length === 0 && !error ? (
        <Fragment>
          <Error statusCode={404} />
          <UserMissingModal
            visible={visible}
            setVisible={setVisible}
            bindings={bindings}
            username={username}
          />
        </Fragment>
      ) : (
        <Fragment>
          <NextSeo
            title={`ThreadBack | @${username}'s threads`}
            keywords="twitter, twitter replies, twitter mentions, twitter thread"
            openGraph={{
              title: `@${username}'s threads`,
              images: [
                {
                  url: user.profilePhoto,
                  width: 400,
                  height: 400,
                  alt: "User profile photo",
                },
              ],
            }}
            twitter={{
              handle: `@${username}`,
            }}
          />
          <Page>
            <Container style={{ margin: "0 auto" }}>
              <Page.Content>
                <Grid.Container gap={2}>
                  <Grid xs={24}>
                    <Container justify="center">
                      <UserHead user={user} />
                      <RefreshUserButton
                        loading={refreshRes.loading}
                        refreshUser={refreshUser}
                        status={
                          refreshRes.data
                            ? refreshRes.data.refresh.status
                            : user.status
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
                  {res.data && threadView === "multiple" ? (
                    <ThreadCardGroup
                      data={res.data}
                      hasMoreThreads={hasMoreThreads}
                      setOffsetCount={setOffsetCount}
                      offsetCount={offsetCount}
                      limit={limit}
                    />
                  ) : (
                    <Fragment>
                      {res.data && (
                        <Fragment>
                          <Grid xs={12}>
                            <Text size="1rem" style={{ float: "left" }}>
                              {moment
                                .utc(
                                  res.data.threads.items[currentThread]
                                    .tweets[0].date
                                )
                                .fromNow()}
                            </Text>
                          </Grid>
                          <Grid xs={12}>
                            <Text size="1rem" style={{ float: "right" }}>
                              {`${res.data.threads.count - currentThread} of ${
                                res.data.threads.count
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
                                      currentThread === 0
                                        ? "hidden"
                                        : "visible",
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
                                            offset: -150,
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
                                          offset: -150,
                                        });
                                      }
                                    }}
                                    onSwipedLeft={() => {
                                      if (
                                        currentThread < res.data.threads.count
                                      ) {
                                        if (currentThread === offsetCount) {
                                          setOffsetCount(offsetCount + limit);
                                        }
                                        setCurrentThread(currentThread + 1);
                                        scroller.scrollTo("tweetGroup", {
                                          smooth: "easeOutQuad",
                                          delay: 2,
                                          duration: 500,
                                          offset: -150,
                                        });
                                      }
                                    }}
                                  >
                                    <Element name="tweetGroup" />
                                    <TweetGroup
                                      tweets={
                                        res.data.threads.items[currentThread]
                                          .tweets
                                      }
                                    />
                                  </Swipeable>
                                </Col>
                                <Col span={1}>
                                  <Sticky top={window.innerHeight / 2}>
                                    <a
                                      onClick={() => {
                                        if (
                                          currentThread < res.data.threads.count
                                        ) {
                                          if (currentThread === offsetCount) {
                                            setOffsetCount(offsetCount + limit);
                                          }
                                          setCurrentThread(currentThread + 1);
                                          scroller.scrollTo("tweetGroup", {
                                            smooth: "easeOutQuad",
                                            delay: 2,
                                            duration: 500,
                                            offset: -150,
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
                                      currentThread === 0
                                        ? "hidden"
                                        : "visible",
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
                                            offset: -150,
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
                                      res.data.threads.items[currentThread]
                                        .tweets
                                    }
                                  />
                                </Col>
                                <Col span={1}>
                                  <Sticky top={window.innerHeight / 2}>
                                    <a
                                      onClick={() => {
                                        if (
                                          currentThread < res.data.threads.count
                                        ) {
                                          if (currentThread === offsetCount) {
                                            setOffsetCount(offsetCount + limit);
                                          }
                                          setCurrentThread(currentThread + 1);
                                          scroller.scrollTo("tweetGroup", {
                                            smooth: "easeOutQuad",
                                            delay: 2,
                                            duration: 500,
                                            offset: -150,
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
                  {res.loading && res.data && (
                    <Col align="center">
                      <Spinner size="large" />
                    </Col>
                  )}
                </Grid.Container>
              </Page.Content>
            </Container>
          </Page>
        </Fragment>
      )}
    </Fragment>
  );
}
