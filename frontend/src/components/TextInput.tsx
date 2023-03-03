import { styled, TextField } from "@mui/material";
import { Props } from "../App";

interface TextInputProps extends Props {
  placeholder?: string;
  value?: string;
  required?: boolean;
  focused?: boolean;
}

export default function TextInput({
  required = false,
  ...TextInputProps
}: TextInputProps) {
  const StyledTextInput = styled(TextField)({
    width: "-webkit-fill-available",
    margin: "8px 72px",
    "& .MuiOutlinedInput-root": {
      "& fieldset": {
        border: "none",
        backgroundColor: "none",
      },
      "& input": {
        fontFamily: "'Inter'",
        fontStyle: "normal",
        fontWeight: "400",
        fontSize: "16px",
        lineHeight: "19px",
        letterSpacing: "-0.03em",
        padding: "19px 32px",
        height: "19px",
        color: "rgba(0, 0, 0, 0.8)",
        borderRadius: "10px",
        backgroundColor: "#F7F7F7",
      },
    },
    "& .MuiFormLabel-root": {
      fontSize: "16px",
      lineHeight: "19px",
      fontFamily: "'Inter'",
      fontStyle: "normal",
      letterSpacing: "-0.03em",
      padding: "0",
      left: "17px",
      top: "2px",
      color: "#000000",
      opacity: "0.6",
    },
  });

  return (
    <StyledTextInput
      required={required}
      type="outlined"
      className="styled-text-input heading-4"
      label={TextInputProps.placeholder}
      defaultValue={TextInputProps.value}
    />
  );
}
