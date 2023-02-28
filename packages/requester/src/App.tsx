import { Container, Divider } from "@chakra-ui/react";
import React from "react";
import "./App.css";
import { Queue, Auth, Form } from "./components";

function App() {
  return (
    <Container
      display="flex"
      flexDirection="column"
      alignItems="center"
      margin="10"
      height="100vh"
    >
      <Auth />
      <Queue />
      <Divider size="l" />
      <Form />
    </Container>
  );
}

export default App;
