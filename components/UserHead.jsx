import { User, Container } from "@zeit-ui/react";
import { useRouter } from "next/router";

export default function UserHead(props) {
  const { user, showBio } = props;
  const router = useRouter();

  return (
    <Container
      style={{
        overflow: "hidden",
        textOverflow: "ellipsis",
        wordWrap: "break-word",
        display: "block",
        lineHeight: "1em",
        width: "100%",
      }}
    >
      <User src={user.profilePhoto} name={user.username}>
        <User.Link
          onClick={(e) => {
            e.preventDefault();
            router.push(`/user/${user.username}`);
          }}
        >
          @{user.username}
        </User.Link>
        {showBio ? user.bio : null}
      </User>
    </Container>
  );
}
