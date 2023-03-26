import React from "react";
import { tokens } from "../tokens";

const { colors, typography } = tokens;

const Text: React.FC<{
  children: React.ReactNode;
  variant: string;
  color: string;
}> = ({ children, variant, color }) => {
  const [text_key_1, text_key_2] = variant.split(".");
  const [color_key_1, color_key_2, color_key_3] = color.split(".");

  // @ts-expect-error this should be better typed
  const currentColor = colors[color_key_1][color_key_2][color_key_3];
  // @ts-expect-error this should be better typed
  const currentFont = typography[text_key_1][text_key_2];

  return (
    <p
      style={{
        display: "flex",
        alignItems: "center",
        color: currentColor,
        margin: "0px",
        wordWrap: "break-word",
        overflowWrap: "break-word",
        ...currentFont,
      }}
    >
      {children}
    </p>
  );
};

export { Text };
