import { Fragment, useState } from "react";
import { useQuery } from "graphql-hooks";
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
  Text,
} from "@zeit-ui/react";
import map from "lodash/map";
import orderBy from "lodash/orderBy";
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
  const [orderDir, setOrderDir] = useState("desc");
  const [toasts, setToast] = useToasts();

  let res;

  const handleOrderDir = (e) => {
    e.preventDefault();
    switch (orderDir) {
      case "desc":
        setOrderDir("asc");
        break;
      case "asc":
        setOrderDir("desc");
        break;
    }
  };

  if (!username) {
    res = useQuery(allThreadsQuery, {
      variables: { offset: offsetCount, limit: 15 },
      updateData,
    });
  } else {
    res = useQuery(getUserThreadsQuery, {
      variables: {
        offset: offsetCount,
        limit: 15,
        usernames: [username],
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
      <Container style={{ padding: 20, margin: "0 auto" }} justify="center">
        <Spacer x={8} />
        <Spinner size="large" />
        <Spacer x={8} />
      </Container>
    );

  const hasMoreThreads = data.threads.items.length < data.threads.count;
  console.log(data, loading);
  return (
    <Fragment>
      {data.threads.items.length === 0 && !loading ? (
        <Col align="center" style={{ marginTop: 20, marginBottom: 20 }}>
          <Text>No threads</Text>
        </Col>
      ) : (
        <Fragment>
          <Grid xs={24}>
            {orderDir === "desc" ? (
              <Link onClick={handleOrderDir}>
                <ChevronDown />
              </Link>
            ) : (
              <Link onClick={handleOrderDir}>
                <ChevronUp />
              </Link>
            )}
          </Grid>
          {data &&
            map(
              orderBy(data.threads.items, "conversationId", orderDir),
              (thread) => (
                <Grid xs={24} sm={12} lg={8} key={thread.conversationId}>
                  <ThreadCard thread={thread} />
                </Grid>
              )
            )}
          <Col align="center" style={{ marginTop: 20, marginBottom: 20 }}>
            {hasMoreThreads && (
              <Button
                ghost
                type="success"
                loading={loading}
                auto
                onClick={() => setOffsetCount(offsetCount + 1)}
              >
                Show more
              </Button>
            )}
          </Col>
        </Fragment>
      )}
    </Fragment>
  );
}
