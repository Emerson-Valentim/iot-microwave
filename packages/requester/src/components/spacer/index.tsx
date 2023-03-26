import React from "react";

const Spacer: React.FC<{
  variant:
    | "inline_xsmall"
    | "inline_small"
    | "inline_medium"
    | "stack_small"
    | "stack_medium";
}> = ({ variant }) => {
  const style = {
    inline_xsmall: {
      width: "4px",
    },
    inline_small: {
      width: "8px",
    },
    inline_medium: {
      width: "16px",
    },
    stack_small: {
      height: "8px",
    },
    stack_medium: {
      height: "16px",
    },
  }[variant];

  return <div style={style} />;
};

export { Spacer };
