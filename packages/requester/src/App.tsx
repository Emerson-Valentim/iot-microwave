import {
  Container,
  Divider,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/react";
import { useState } from "react";
import "./App.css";
import { Form, Header, List } from "./screens";

function App() {
  const [isModalOpen, setModalOpen] = useState(true);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        height: "100vh",
        padding: "12px",
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
