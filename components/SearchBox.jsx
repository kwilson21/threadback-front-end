import { Fragment, useEffect } from "react";
import {
  Grid,
  Button,
  Container,
  Spacer,
  AutoComplete,
  Spinner,
} from "@zeit-ui/react";
import { useState } from "react";
import Router from "next/router";
import { Search } from "@zeit-ui/react-icons";
import { useQuery } from "graphql-hooks";
import { getAllUsersQuery } from "../queries/getAllUsersQuery";
import map from "lodash/map";
import filter from "lodash/filter";

export default function SearchBox() {
  const [username, setUsername] = useState("");
  const [allOptions, setAllOptions] = useState([]);
  const [options, setOptions] = useState([]);

  const { loading, error, data } = useQuery(getAllUsersQuery);

  const handleChange = (currentValue) => {
    if (currentValue) setUsername(currentValue);
  };

  const handleClear = () => {
    setUsername("");
  };

  useEffect(() => {
    if (data)
      setAllOptions(
        map(data.users.items, (user) => {
          return { label: user.username, value: user.username };
        })
      );
  }, [options]);

  const searchHandler = (currentValue) => {
    if (!currentValue) return setOptions([]);
    setOptions(
      filter(allOptions, (item) =>
        item.value.toLowerCase().includes(currentValue.toLowerCase())
      )
    );
  };

  const handleEnter = (e) => {
    if (username && e.key === "Enter") {
      Router.push(`/user/${username}`);
    }
  };

  if (error) {
    setToast({
      text: "An error has occured while fetching data",
      type: "error",
    });
  }

  if (loading)
    return (
      <Container style={{ padding: 20, margin: "0 auto" }} justify="center">
        <Spacer x={8} />
        <Spinner size="large" />
        <Spacer x={8} />
      </Container>
    );

  return (
    <Fragment>
      <Grid xs={24}>
        <AutoComplete
          icon={<Search />}
          width="100%"
          clearable
          size="large"
          placeholder="Enter a username"
          onChange={handleChange}
          onClearClick={handleClear}
          options={options}
          onKeyPress={handleEnter}
          onSearch={searchHandler}
          onSelect={(v) => Router.push(`/user/${v}`)}
        >
          <AutoComplete.Empty>
            <span>No users...</span>
          </AutoComplete.Empty>
        </AutoComplete>
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
