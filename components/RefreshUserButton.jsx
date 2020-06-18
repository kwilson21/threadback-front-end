import { useMutation } from "graphql-hooks";
import { Fragment } from "react";
import { refreshThreadsMutation } from "../queries/refreshThreadsMutation";
import { Button, Tooltip } from "@zeit-ui/react";

export default function RefreshUserButton(props) {
  const { username, status } = props;
  const [refreshUser, { loading, error, data }] = useMutation(
    refreshThreadsMutation,
    {
      variables: { username: username },
    }
  );

  if (error) {
    setToast({
      text: "An error has occured while fetching data",
      type: "error",
    });
  }

  let userStatus = "None";

  if (status) {
    userStatus = status;
  } else if (data) {
    userStatus = data.refresh.status;
  }

  return (
    <Fragment>
      <Tooltip
        text={
          userStatus === "Pending"
            ? "User threads are currently being refreshed"
            : "Update user's threads and tweets"
        }
        type="dark"
        placement="bottomStart"
        style={{ float: "right" }}
      >
        <Button auto disabled={userStatus === "Pending"} onClick={refreshUser}>
          Update
        </Button>
      </Tooltip>
    </Fragment>
  );
}
