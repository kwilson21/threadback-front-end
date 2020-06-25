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
import Sticky from "react-stickynode";

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
      <Container style={{ padding: 20, margin: "0 auto" }} justify="center">
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
        <Page>
          <Container style={{ margin: "0 auto" }}>
            <Head>
              <title>ThreadBack | @{username}'s threads</title>
              <link rel="icon" href="/favicon.ico" />
              <meta property="og:title" content={`@${username}'s threads`} />
              <meta property="og:image:url" content={user.profilePhoto} />
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
                <ThreadCardGroup username={username} />
              </Grid.Container>
            </Page.Content>
          </Container>
        </Page>
      )}
    </Fragment>
  );
}
