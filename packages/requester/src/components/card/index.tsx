import React from "react";
import { Card as CCard } from "@chakra-ui/react";
import { tokens } from "../tokens";

const {
  colors: { layout },
} = tokens;

const Card: React.FC<{ children: React.ReactNode; width?: string }> = ({
  children,
  width,
}) => {
  return (
    <CCard
      width={width ?? "-webkit-fill-available%"}
      backgroundColor={layout.paper}
      padding="16px"
      display="flex"
      flexDirection="column"
      gap="16px"
      alignItems="center"
      justifyContent="center"
      borderRadius="16px"
    >
      {children}
    </CCard>
  );
};

export { Card };
