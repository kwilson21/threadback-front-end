import Head from "next/head";
import UserHead from "../../components/UserHead";
import {
  Grid,
  Spacer,
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
      <Container style={{ padding: 20, margin: "0 auto" }} justify="center">
        <Spacer x={8} />
        <Spinner size="large" />
        <Spacer x={8} />
      </Container>
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
        <Page>
          <Container style={{ margin: "0 auto" }}>
            <Head>
              <title>ThreadBack | @{username}'s threads</title>
              <link rel="icon" href="/favicon.ico" />
              <meta property="og:title" content={`@${username}'s threads`} />
              <meta property="og:image" content={user.profilePhoto} />
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
                                res.data.threads.items[currentThread].tweets[0]
                                  .date
                              )
                              .fromNow()}
                          </Text>
                        </Grid>
                        <Grid xs={12}>
                          <Text size="1rem" style={{ float: "right" }}>
                            {`${currentThread + 1} of ${
                              res.data.threads.count
                            }`}
                          </Text>
                        </Grid>
                        <Col justify="center">
                          {isMobile && (
                            <Swipeable
                              onSwipedRight={() => {
                                if (currentThread > 0) {
                                  setCurrentThread(currentThread - 1);
                                }
                              }}
                              onSwipedLeft={() => {
                                if (currentThread < res.data.threads.count) {
                                  if (currentThread === offsetCount) {
                                    setOffsetCount(offsetCount + limit);
                                  }
                                  setCurrentThread(currentThread + 1);
                                }
                              }}
                            >
                              <TweetGroup
                                tweets={
                                  res.data.threads.items[currentThread].tweets
                                }
                              />
                            </Swipeable>
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
                                      }
                                    }}
                                  >
                                    <ArrowLeft />
                                  </a>
                                </Sticky>
                              </Col>
                              <Col span={22}>
                                <TweetGroup
                                  tweets={
                                    res.data.threads.items[currentThread].tweets
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
                {res.loading && (
                  <Col align="center">
                    <Spinner size="large" />
                  </Col>
                )}
              </Grid.Container>
            </Page.Content>
          </Container>
        </Page>
      )}
    </Fragment>
  );
}
