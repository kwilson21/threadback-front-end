import Head from "next/head";

import { Grid, Col, Container, Divider, Text, Spacer } from "@zeit-ui/react";

import ThreadCardGroup from "../components/ThreadCardGroup";
import SearchBox from "../components/SearchBox";
import useScrollPast from "../hooks/useScrollPast";

export default function Home() {
  const scroll = useScrollPast(115);

  return (
    <Container style={{ padding: 20, margin: "0 auto", marginTop: 80 }}>
      <Head>
        <title>Threadback | Home</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Col style={{ margin: "0 auto" }}>
        <Grid.Container gap={2}>
          <Spacer y={2} />
          <Grid xs={24}>
            <Text h2>Search</Text>
          </Grid>

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
          <Container style={{ visibility: scroll ? "hidden" : "visible" }}>
            <SearchBox />
          </Container>
        </Grid.Container>
        <Divider align="center" />

        <Grid.Container gap={2}>
          <Grid xs={24}>
            <Text h2>Recent</Text>
          </Grid>

          <ThreadCardGroup scroll={scroll} />
        </Grid.Container>
      </Col>
    </Container>
  );
}
