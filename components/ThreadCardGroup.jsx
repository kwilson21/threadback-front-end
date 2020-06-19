import { Fragment, useState } from "react";
import { useQuery, useManualQuery } from "graphql-hooks";
import { allThreadsQuery } from "../queries/allThreadsQuery";
import { getUserThreadsQuery } from "../queries/getUserThreadsQuery";
import ThreadCard from "../components/ThreadCard";
import {
  Spinner,
  Grid,
  Col,
  Spacer,
  Container,
  Button,
  useToasts,
  Link,
} from "@zeit-ui/react";
import { ChevronUp, ChevronDown } from "@zeit-ui/react-icons";

// use options.updateData to append the new page of posts to our current list of posts
const updateData = (prevData, data) => {
  return {
    threads: {
      items: [...prevData.threads.items, ...data.threads.items],
      count: prevData.threads.count + data.threads.count,
    },
  };
};

export default function ThreadCardGroup(props) {
  const { username, scroll } = props;

  const [offsetCount, setOffsetCount] = useState(0);
  const [orderDir, setOrderDir] = useState("DESC");
  const [toasts, setToast] = useToasts();

  let res;

  const handleOrderDir = (e) => {
    e.preventDefault();
    switch (orderDir) {
      case "DESC":
        setOrderDir("ASC");
        break;
      case "ASC":
        setOrderDir("DESC");
        break;
    }
  };

  if (!username) {
    res = useQuery(allThreadsQuery, {
      variables: { offset: offsetCount, limit: 16, direction: orderDir },
      updateData,
    });
  } else {
    res = useQuery(getUserThreadsQuery, {
      variables: {
        offset: offsetCount,
        limit: 16,
        usernames: [username],
        direction: orderDir,
      },
      updateData,
    });
  }

  const { loading, error, data } = res;

  if (error) {
    setToast({
      text: "An error has occured while fetching data",
      type: "error",
    });
  }

  if (loading && !data)
    return (
      <Container style={{ padding: 20 }} justify="center">
        <Spacer x={8} />
        <Spinner size="large" />
        <Spacer x={8} />
      </Container>
    );

  const hasMoreThreads = data.threads.items.length < data.threads.count;

  return (
    <Fragment>
      {/* <Grid xs={24}>
        <Container
          align="center"
          style={
            scroll
              ? {
                  position: "fixed",
                  top: 0,
                  zIndex: 999,
                  marginBottom: 10,
                  marginTop: 23,
                  marginLeft: 420,
                  float: "none",
                }
              : {}
          }
        >
          {data && data.threads.items.length > 0 ? (
            orderDir === "DESC" ? (
              <Link onClick={handleOrderDir}>
                <ChevronDown />
              </Link>
            ) : (
              <Link onClick={handleOrderDir}>
                <ChevronUp />
              </Link>
            )
          ) : null}
        </Container>
      </Grid> */}
      {data &&
        data.threads.items.map((thread) => (
          <Grid xs={24} sm={12} lg={6} key={thread.conversationId}>
            <ThreadCard thread={thread} />
          </Grid>
        ))}
      <Col align="center" style={{ marginTop: 20, marginBottom: 20 }}>
        {hasMoreThreads && (
          <Button
            loading={loading}
            auto
            onClick={() => setOffsetCount(offsetCount + 1)}
          >
            Show more
          </Button>
        )}
      </Col>
    </Fragment>
  );
}
