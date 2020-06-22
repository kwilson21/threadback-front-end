import Head from "next/head";

import { Grid, Container, Divider, Text, Page } from "@zeit-ui/react";

import ThreadCardGroup from "../components/ThreadCardGroup";
import SearchBox from "../components/SearchBox";
import Sticky from "react-stickynode";

export default function Home() {
  return (
    <Page>
      <Container style={{ margin: "0 auto" }}>
        <Head>
          <title>Threadback | Home</title>
          <link rel="icon" href="/favicon.ico" />
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
            <ThreadCardGroup />
          </Grid.Container>
        </Page.Content>
      </Container>
    </Page>
  );
}
