import { Button as CButton } from "@chakra-ui/react";
import React from "react";
import { Text } from "../text";
import { tokens } from "../tokens";

const { colors } = tokens;

const Button: React.FC<{
  children: React.ReactNode;
  onClick: () => void;
  disabled: boolean;
  loading: boolean;
}> = ({ children, onClick, disabled, loading }) => {
  return (
    <CButton
      borderColor="transparent"
      onClick={onClick}
      disabled={disabled}
      isLoading={loading}
      _loading={{ backgroundColor: colors.action.primary.disabled }}
      _hover={
        disabled
          ? undefined
          : { backgroundColor: colors.action.primary.pressed }
      }
      backgroundColor={
        disabled
          ? colors.action.primary.disabled
          : colors.action.primary.default
      }
      padding="12px 16px"
      gap="8px"
      alignItems="center"
      justifyContent="center"
      display="flex"
      flexDirection="row"
      borderRadius="4px"
      height="48px"
    >
      <Text variant="interactive.button" color="text.main.button">
        {children}
      </Text>
    </CButton>
  );
};

export { Button };
