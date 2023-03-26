import { Input as CInput } from "@chakra-ui/react";
import React from "react";
import { Text } from "../text";

const Input: React.FC<{
  label: string;
  placeholder: string;
  type: string;
  onChange: (value: any) => void;
  required: boolean;
  value?: any;
  helperText?: any;
}> = ({ onChange, placeholder, required, type, value, label, helperText }) => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        padding: "0px",
        gap: "2px",
        width: "100%",
      }}
    >
      <Text variant="body.sml_bold" color="text.main.default">
        {label}
      </Text>
      <CInput
        width="-webkit-fill-available"
        padding="8px"
        border="1px #E2E8F0 solid"
        focusBorderColor=""
        onChange={onChange}
        required={required}
        value={value}
        placeholder={placeholder}
        type={type}
      ></CInput>
      {helperText ? (
        <div style={{ alignSelf: "flex-end" }}>
          <Text variant="body.sml_regular" color="text.main.default">
            {helperText}
          </Text>
        </div>
      ) : (
        <></>
      )}
    </div>
  );
};

export { Input };
