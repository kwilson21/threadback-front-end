import { Fragment } from "react";

import { Button, Tooltip } from "@zeit-ui/react";

export default function RefreshUserButton(props) {
  const { status, refreshUser } = props;
  return (
    <Fragment>
      <Tooltip
        text={
          status === "Pending"
            ? "User threads are currently being refreshed"
            : "Update user's threads and tweets"
        }
        type="dark"
        placement="bottomStart"
        style={{ float: "right" }}
      >
        <Button auto disabled={status === "Pending"} onClick={refreshUser}>
          Update
        </Button>
      </Tooltip>
    </Fragment>
  );
}
