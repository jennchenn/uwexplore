import { useState } from "react";
import { Visibility, VisibilityOff, Check } from "@mui/icons-material";
import {
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  styled,
} from "@mui/material";
import "../styles/TextInput.css";
import { Props } from "../App";

interface TextInputProps extends Props {
  id: string;
  placeholder?: string;
  value?: string;
  required?: boolean;
  focused?: boolean;
  type?: React.HTMLInputTypeAttribute;
  show?: boolean;
  [key: string]: unknown;
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
  const [verified, setverified] = useState(false);

  const handleClickShow = () =>
    setShowPassword((showPassword: any) => !showPassword);

  const handleOnChange = (event: any) => {
    setInputValue(event.target.value);
    if (type === "password") setverified(true);
  };

  const StyledTextInput = styled(OutlinedInput)({
    "& input": {
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

  return (
    <>
      <FormControl
        style={{ margin: "8px 72px", ...TextInputProps.style }}
        variant="outlined"
        className={`form-control-text-input ${TextInputProps.className}`}
      >
        <InputLabel
          htmlFor={`input-${TextInputProps.id}`}
          className="input-label-text-input"
        >
          {TextInputProps.placeholder}
        </InputLabel>
        <StyledTextInput
          id={`input-${TextInputProps.id}`}
          required={required}
          type={
            type === "password" ? (showPassword ? "text" : "password") : type
          }
          className="styled-text-input heading-4"
          placeholder={TextInputProps.placeholder}
          label={TextInputProps.placeholder}
          value={inputValue}
          onChange={handleOnChange}
          autoFocus
          endAdornment={
            <InputAdornment position="end">
              {type === "password" && (
                <IconButton
                  aria-label="toggle visibility"
                  onClick={handleClickShow}
                  edge="end"
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              )}
              {verified && <Check className="verify-check" />}
            </InputAdornment>
          }
        />
      </FormControl>
    </>
  );
}
