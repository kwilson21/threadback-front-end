import { Fragment } from "react";
import { Grid, Button, Input } from "@zeit-ui/react";
import { useState } from "react";
import Router from "next/router";

export default function SearchBox() {
  const [username, setUsername] = useState("");

  const handleChange = (e) => {
    setUsername(e.target.value);
  };

  const handleClear = () => {
    setUsername("");
  };

  const handleEnter = (e) => {
    if (username && e.key === "Enter") {
      Router.push(`/user/${username}`);
    }
  };

  return (
    <Fragment>
      <Grid xs={24}>
        <Input
          clearable
          style={{ minWidth: "250px" }}
          size="large"
          placeholder="Username"
          onChange={handleChange}
          onClearClick={handleClear}
          onKeyPress={handleEnter}
        />
      </Grid>
      <Grid>
        <Button auto ghost onClick={() => Router.push(`/user/${username}`)}>
          Find
        </Button>
      </Grid>
    </Fragment>
  );
}
