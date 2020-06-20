import { Fragment } from "react";
import { RefreshCw } from "@zeit-ui/react-icons";
import { Button, Tooltip } from "@zeit-ui/react";

export default function RefreshUserButton(props) {
  const { status, refreshUser, loading } = props;
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
        <Button
          auto
          ghost
          type="success"
          icon={<RefreshCw />}
          loading={loading}
          disabled={status === "Pending"}
          onClick={refreshUser}
        >
          Refresh
        </Button>
      </Tooltip>
    </Fragment>
  );
}
