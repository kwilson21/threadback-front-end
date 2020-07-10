import { Fragment } from "react";
import ThreadCard from "../components/ThreadCard";
import { Grid, Col, Text } from "@zeit-ui/react";
import map from "lodash/map";
import InfiniteLoader from "react-infinite-loader";

export default function ThreadCardGroup(props) {
  const { data, hasMoreThreads, setOffsetCount, offsetCount, limit } = props;

  return (
    <Fragment>
      {data.threads.items.length === 0 ? (
        <Col align="center" style={{ marginTop: 20, marginBottom: 20 }}>
          <Text>No threads</Text>
        </Col>
      ) : (
        <Fragment>
          <Grid xs={24}>
            <Text size="1rem" style={{ float: "right" }}>
              {data.threads.count.toLocaleString()} threads
            </Text>
          </Grid>
          {data &&
            map(data.threads.items, (thread) => (
              <Grid xs={24} sm={12} lg={8} key={thread.conversationId}>
                <ThreadCard thread={thread} />
              </Grid>
            ))}
          {hasMoreThreads && (
            <InfiniteLoader
              onVisited={() => setOffsetCount(offsetCount + limit)}
            />
          )}
        </Fragment>
      )}
    </Fragment>
  );
}
