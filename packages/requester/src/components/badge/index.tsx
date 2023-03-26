import { Badge as CBadge } from "@chakra-ui/react";
import React from "react";
import { tokens } from "../tokens";
import { Text } from "../text";
import { TimeIcon } from "@chakra-ui/icons";
import { Spacer } from "../spacer";

const { colors } = tokens;

const Badge: React.FC<{
  children: React.ReactNode;
  variant: "pending" | "active";
}> = ({ children, variant }) => {
  const { backgroundColor, textColor, Icon } = {
    pending: {
      backgroundColor: colors.surface.warning.default,
      textColor: "text.main.warning",
      Icon: () => <TimeIcon />,
    },
    active: {
      backgroundColor: colors.surface.highlight.default,
      textColor: "text.main.highLight",
      Icon: () => <TimeIcon />,
    },
  }[variant];

  return (
    <CBadge
      backgroundColor={backgroundColor}
      padding="4px 8px"
      gap="4px"
      borderRadius="4px"
      display="flex"
      flexDirection="row"
      width="fit-content"
      alignSelf="flex-end"
    >
      <Text variant="body.sml_regular" color={textColor}>
        <Icon />
        <Spacer variant="inline_xsmall" />
        {children}
      </Text>
    </CBadge>
  );
};

export { Badge };
