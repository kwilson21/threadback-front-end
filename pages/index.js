import Head from "next/head";

import {
  Grid,
  Col,
  Spacer,
  Container,
  Divider,
  Text,
  Link,
} from "@zeit-ui/react";

import ThreadCardGroup from "../components/ThreadCardGroup";
import SearchBox from "../components/SearchBox";
import { useEffect, useState } from "react";

export default function Home() {
  const [scroll, setScrolling] = useState(false);

  const handleScroll = (e) => {
    if (window.pageYOffset > 95) {
      setScrolling(true);
    } else {
      setScrolling(false);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
  }, [handleScroll]);

  return (
    <Container style={{ padding: 20 }}>
      <Spacer x={8} />

      <Head>
        <title>Threadback | Home</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Col span={13} style={{ margin: "0 auto" }}>
        <Grid.Container gap={2}>
          <Grid xs={24}>
            <Text h2>Search</Text>
          </Grid>
          <Container
            style={
              scroll
                ? {
                    position: "fixed",
                    top: 0,
                    zIndex: 999,
                    marginBottom: 10,
                    marginTop: 5,
                  }
                : {}
            }
          >
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
      <Spacer x={8} />
    </Container>
  );
}
