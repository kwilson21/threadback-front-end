import { Tabs, Container, Spacer } from "@zeit-ui/react";
import Router from "next/router";
import useWindowSize from "../hooks/useWindowSize";

export default function NavBar() {
  const window = useWindowSize();
  return (
    <Container
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        height: window.width > 1125 ? "65px" : "85px",
        zIndex: 999,
        backgroundColor: "rgb(255, 255, 255)",
        boxShadow: "rgba(0, 0, 0, 0.1) 0px 0px 15px 0px",
      }}
    >
      <Tabs
        initialValue="1"
        style={{
          maxWidth: "750pt",
          display: "flex",
          alignItems: "flex-end",
          zIndex: "900",
          padding: "0px 16pt",
          overflow: "auto",
          width: "100%",
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
