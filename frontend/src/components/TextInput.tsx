import { useState } from "react";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import {
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  styled,
} from "@mui/material";
import { Props } from "../App";

interface TextInputProps extends Props {
  id: string;
  placeholder?: string;
  value?: string;
  required?: boolean;
  focused?: boolean;
  type?: React.HTMLInputTypeAttribute;
  show?: boolean;
}

export default function TextInput({
  value = "",
  required = false,
  type = "text",
  show = type === "password" ? false : true,
  ...TextInputProps
}: TextInputProps) {
  const [showPassword, setShowPassword] = useState(show);
  const [inputValue, setInputValue] = useState(value);

  const handleClickShow = () =>
    setShowPassword((showPassword) => !showPassword);

  const handleOnChange = (event: any) => {
    setInputValue(event.target.value);
  };

  const StyledTextInput = styled(OutlinedInput)({
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
    },
    "& fieldset": {
      border: "none",
    },
  });

  const labelStyle = {
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
  };

  return (
    <>
      <FormControl
        style={{
          margin: "8px 72px",
          width: "-webkit-fill-available",
          backgroundColor: "#F7F7F7",
          borderRadius: "10px",
        }}
        variant="outlined"
      >
        <InputLabel htmlFor={`input-${TextInputProps.id}`} style={labelStyle}>
          {TextInputProps.placeholder}
        </InputLabel>
        <StyledTextInput
          id={`input-${TextInputProps.id}`}
          required={required}
          type={showPassword ? "text" : "password"}
          className="styled-text-input heading-4"
          placeholder={TextInputProps.placeholder}
          label={TextInputProps.placeholder}
          value={inputValue}
          onChange={handleOnChange}
          autoFocus
          endAdornment={
            type === "password" && (
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle visibility"
                  onClick={handleClickShow}
                  edge="end"
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            )
          }
        />
      </FormControl>
    </>
  );
}
