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
  useToasts,
} from "@zeit-ui/react";

import ThreadCardGroup from "../components/ThreadCardGroup";
import SearchBox from "../components/SearchBox";
import Sticky from "react-stickynode";
import { useState } from "react";
import { useQuery } from "graphql-hooks";
import { allThreadsQuery } from "../queries/allThreadsQuery";

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
              <Text h2>Recent</Text>
            </Grid>
            <ThreadCardGroup
              data={data}
              hasMoreThreads={hasMoreThreads}
              setOffsetCount={setOffsetCount}
              offsetCount={offsetCount}
              limit={limit}
            />
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
