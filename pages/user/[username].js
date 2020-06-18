import Head from "next/head";
import UserHead from "../../components/UserHead";
import {
  Grid,
  Col,
  Spacer,
  Container,
  Divider,
  useToasts,
  Spinner,
  useModal,
  Row,
  Text,
} from "@zeit-ui/react";
import { useRouter } from "next/router";
import ThreadCardGroup from "../../components/ThreadCardGroup";
import RefreshUserButton from "../../components/RefreshUserButton";
import { getAUserQuery } from "../../queries/getAUserQuery";
import { useQuery } from "graphql-hooks";
import { Fragment } from "react";
import Error from "next/error";
import UserMissingModal from "../../components/UserMissingModal";
import SearchBox from "../../components/SearchBox";
import { useEffect, useState } from "react";

export default function User() {
  const router = useRouter();
  const { username } = router.query;

  const [toasts, setToast] = useToasts();
  const { visible, setVisible, bindings } = useModal(true);
  const { loading, error, data } = useQuery(getAUserQuery, {
    variables: { offset: 0, limit: 1, usernames: [username] },
  });

  if (error) {
    setToast({
      text: "An error has occured while fetching data",
      type: "error",
    });
  }

  const [scroll, setScrolling] = useState(false);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
  }, []);

  const handleScroll = (e) => {
    if (window.pageYOffset > 95) {
      setScrolling(true);
    } else {
      setScrolling(false);
    }
  };

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

  const { items } = data.users;

  const user = items[0];

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
        <Container style={{ padding: 20 }}>
          <Spacer x={8} />
          <Head>
            <title>ThreadBack | @{username}'s threads</title>
            <link rel="icon" href="/favicon.ico" />
          </Head>

          <Col span={13} style={{ margin: "0 auto", width: "100%" }}>
            <Grid.Container gap={2} justify="center">
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
                      <UserHead user={user} />
                    </Container>
                    <Container style={{ marginTop: 15 }}>
                      <RefreshUserButton
                        username={username}
                        status={user.status}
                      />
                    </Container>
                    <Spacer x={1} />
                    <Container style={{ marginTop: 4 }}>
                      <SearchBox />
                    </Container>
                  </Row>
                </Container>
              </Grid>
            </Grid.Container>
            <Grid.Container gap={2}>
              <ThreadCardGroup username={username} />
            </Grid.Container>
          </Col>
          <Spacer x={8} />
        </Container>
      )}
    </Fragment>
  );
}
