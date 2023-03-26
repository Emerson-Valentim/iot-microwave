import { Divider } from "@chakra-ui/react";
import { useState } from "react";
import "./App.css";
import { Form, Header, List } from "./screens";

function App() {
  const [isModalOpen, setModalOpen] = useState(false);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        height: "100vh",
        margin: "12px",
      }}
    >
      <Header onNewRequest={() => setModalOpen(true)} />
      <Divider />
      <List />
      <Form isOpen={isModalOpen} onClose={() => setModalOpen(false)} />
    </div>
  );
}

export default App;
