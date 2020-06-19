import { Fragment } from "react";
import { Grid, Button, Input } from "@zeit-ui/react";
import { useState } from "react";
import Router from "next/router";
import { Search } from "@zeit-ui/react-icons";

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
          icon={<Search />}
          width="100%"
          clearable
          size="large"
          placeholder="Enter a username"
          onChange={handleChange}
          onClearClick={handleClear}
          onKeyPress={handleEnter}
        />
      </Grid>
      <Grid>
        <Button
          auto
          type="success-light"
          onClick={() => Router.push(`/user/${username}`)}
        >
          Find
        </Button>
      </Grid>
    </Fragment>
  );
}
