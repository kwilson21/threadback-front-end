import UserHead from "../components/UserHead";
import {
  Card,
  Container,
  Divider,
  Text,
  Button,
  Link,
  Col,
} from "@zeit-ui/react";
import Router from "next/router";
import TweetGroup from "./TweetGroup";
import moment from "moment-timezone";

export default function ThreadCard(props) {
  const { thread } = props;

  thread.tweets = thread.tweets
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .reverse();

  return (
    // <Link onClick={() => Router.push(`/thread/${thread.conversationId}`)}>
    <Card shadow hoverable>
      <Card.Content>
        <Container>
          <Col style={{ marginTop: 3 }}>
            <UserHead user={thread.user} />
          </Col>
          <Col>
            <Text h6>
              {moment
                .utc(thread.tweets[0].date)
                .format("MMMM Do YYYY, h:mma z")}
            </Text>
          </Col>
        </Container>
      </Card.Content>
      <Divider y={0}></Divider>
      <Card.Content style={{ height: "300px", overflow: "hidden" }}>
        <TweetGroup tweets={thread.tweets.slice(0, 3)} size={'size="1.1rem"'} />
      </Card.Content>
      <Divider y={0} />
      <Card.Content style={{ marginLeft: "auto", marginRight: "auto" }}>
        <Button
          auto
          onClick={() => Router.push(`/thread/${thread.conversationId}`)}
        >
          Read
        </Button>
      </Card.Content>
    </Card>
    // </Link>
  );
}
