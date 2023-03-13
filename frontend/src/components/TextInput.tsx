import React, { useState } from "react";
import { Visibility, VisibilityOff, Check } from "@mui/icons-material";
import {
  FormControl,
  FormHelperText,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  styled,
} from "@mui/material";
import "../styles/TextInput.css";
import { Props } from "../App";

interface TextInputProps extends Props {
  placeholder?: string;
  value?: string;
  required?: boolean;
  focused?: boolean;
  type?: React.HTMLInputTypeAttribute;
  show?: boolean;
  [key: string]: unknown;
  error?: boolean;
  errorText?: string;
  success?: boolean;
  successText?: string;
  setValue: (value: string) => void;
  onBlur?: (event: any) => void;
}

export const TextInput = React.forwardRef(
  (
    {
      value = "",
      required = false,
      type = "text",
      show = type === "password" ? false : true,
      error = false,
      success = false,
      ...TextInputProps
    }: TextInputProps,
    ref,
  ) => {
    const [showPassword, setShowPassword] = useState(show);
    const [inputValue, setInputValue] = useState(value);
    const [verified, setverified] = useState(false);

    const handleClickShow = () =>
      setShowPassword((showPassword: any) => !showPassword);

    const handleOnChange = (event: any) => {
      TextInputProps.setValue(event.target.value);
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
          id={TextInputProps.id}
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
            key={TextInputProps.id}
            ref={ref}
            required={required}
            type={
              type === "password" ? (showPassword ? "text" : "password") : type
            }
            className="styled-text-input heading-4"
            placeholder={TextInputProps.placeholder}
            label={TextInputProps.placeholder}
            value={inputValue}
            onChange={handleOnChange}
            onBlur={TextInputProps.onBlur}
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
        {error && (
          <FormHelperText error className="error-helper-text">
            {TextInputProps.errorText}
          </FormHelperText>
        )}
        {success && (
          <FormHelperText className="success-helper-text">
            {TextInputProps.successText}
          </FormHelperText>
        )}
      </>
    );
  },
);
