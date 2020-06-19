import { Tabs, Container, Spacer } from "@zeit-ui/react";
import Router from "next/router";

export default function NavBar() {
  return (
    <Container>
      <Tabs
        initialValue="1"
        style={{
          paddingTop: 40,
          zIndex: 999,
          position: "fixed",
          width: "100%",
          background: "#FFFFFF",
        }}
        onChange={() => {
          Router.push("/");
        }}
      >
        <Tabs.Item label="Home" value="1" />
      </Tabs>
      <Spacer y={4} />
    </Container>
  );
}
