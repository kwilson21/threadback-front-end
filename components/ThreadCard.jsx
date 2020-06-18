import UserHead from "../components/UserHead";
import {
  ZeitProvider,
  CssBaseline,
  Grid,
  Card,
  Col,
  Spacer,
  Container,
  Divider,
  Text,
  Button,
  Link,
  Tooltip,
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
    <Card
      shadow
      hoverable
      width="320px"
      style={{
        overflow: "hidden",
      }}
    >
      <Card.Content>
        <UserHead user={thread.user} />
      </Card.Content>
      <Divider y={0}>{moment(thread.tweets[0].date).tz(moment.tz.guess()).fromNow()}</Divider>
      <Card.Content style={{ maxHeight: "190px", overflow: "hidden" }}>
        <TweetGroup tweets={thread.tweets.slice(0, 2)} size={"h4"} />
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
  );
}
