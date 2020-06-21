import { User, Container, Text, Row } from "@zeit-ui/react";
import { useRouter } from "next/router";

export default function UserHead(props) {
  const { user } = props;
  const router = useRouter();

  return (
    <Container
      style={{
        overflow: "auto",
        textOverflow: "ellipsis",
        wordWrap: "break-word",
        display: "block",
        lineHeight: "1em",
        width: "100%",
      }}
    >
      <Row>
        <User src={user.profilePhoto} name={user.username}>
          <User.Link
            onClick={(e) => {
              e.preventDefault();
              router.push(`/user/${user.username}`);
            }}
          >
            @{user.username}
          </User.Link>
        </User>
      </Row>
      <Row>
        <Text small i>
          {user.bio ? user.bio : null}
        </Text>
      </Row>
    </Container>
  );
}
