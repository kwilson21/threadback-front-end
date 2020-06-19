import Head from "next/head";
import UserHead from "../../components/UserHead";
import {
  Grid,
  Col,
  Spacer,
  Container,
  useToasts,
  Spinner,
  useModal,
  Row,
} from "@zeit-ui/react";
import { useRouter } from "next/router";
import ThreadCardGroup from "../../components/ThreadCardGroup";
import RefreshUserButton from "../../components/RefreshUserButton";
import { getAUserQuery } from "../../queries/getAUserQuery";
import { useQuery, useMutation } from "graphql-hooks";
import { Fragment } from "react";
import Error from "next/error";
import UserMissingModal from "../../components/UserMissingModal";
import SearchBox from "../../components/SearchBox";
import { refreshThreadsMutation } from "../../queries/refreshThreadsMutation";

export default function User() {
  const router = useRouter();
  const { username } = router.query;

  const [toasts, setToast] = useToasts();
  const { visible, setVisible, bindings } = useModal(true);
  const { loading, error, data } = useQuery(getAUserQuery, {
    variables: { offset: 0, limit: 1, usernames: [username] },
  });

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
        <Container style={{ padding: 20, margin: "0 auto", marginTop: 80 }}>
          <Head>
            <title>ThreadBack | @{username}'s threads</title>
            <link rel="icon" href="/favicon.ico" />
          </Head>

          <Col>
            <Grid.Container gap={2} justify="center">
              <Grid xs={24}>
                <Container>
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
                        loading={refreshRes.loading}
                        refreshUser={refreshUser}
                        status={
                          refreshRes.data
                            ? refreshRes.data.refresh.status
                            : user.status
                        }
                      />
                    </Container>

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
        </Container>
      )}
    </Fragment>
  );
}
