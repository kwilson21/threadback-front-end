import { User, Text } from "@zeit-ui/react";
import { useRouter } from "next/router";

export default function UserHead(props) {
  const { user } = props;
  const router = useRouter();

  return (
    <User src={user.profilePhoto} name={user.username}>
      <User.Link
        onClick={(e) => {
          e.preventDefault();
          router.push(`/user/${user.username}`);
        }}
      >
        @{user.username}
      </User.Link>
      {user.bio && (
        <Text small i>
          {user.bio}
        </Text>
      )}
    </User>
  );
}
