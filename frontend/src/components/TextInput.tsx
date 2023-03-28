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
import "../styles/Typography.css";
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
  checkReg?: boolean;
  setValue: (value: string) => void;
  onBlur?: (event: any) => void;
  onKeyDown?: (event: React.KeyboardEvent<HTMLDivElement>) => void;
}

export const regEmail = new RegExp(
  // eslint-disable-next-line
  /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
);

export const regPassword = new RegExp(/^.{6,}$/);

export const TextInput = React.forwardRef(
  (
    {
      value = "",
      required = false,
      type = "text",
      show = type === "password" ? false : true,
      error = false,
      success = false,
      checkReg = false,
      onBlur = () => {},
      onKeyDown = () => {},
      ...TextInputProps
    }: TextInputProps,
    ref,
  ) => {
    const [showPassword, setShowPassword] = useState(show);
    const [inputValue, setInputValue] = useState(value);
    const [verified, setVerified] = useState(false);

    const handleClickShow = () =>
      setShowPassword((showPassword: any) => !showPassword);

    const handleOnChange = (event: any) => {
      TextInputProps.setValue(event.target.value);
      setInputValue(event.target.value);
      if (!checkReg) {
        setVerified(false);
      } else if (type === "password" && regPassword.test(inputValue)) {
        setVerified(true);
      } else if (type === "email" && regEmail.test(inputValue)) {
        setVerified(true);
      } else {
        setVerified(false);
      }
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
            onBlur={(event: any) => {
              onBlur(event);
              handleOnChange(event);
            }}
            onKeyDown={(event: any) => {
              onKeyDown(event);
              handleOnChange(event);
            }}
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
          <FormHelperText error className="error-helper-text heading-6">
            {TextInputProps.errorText}
          </FormHelperText>
        )}
        {success && (
          <FormHelperText className="success-helper-text heading-6">
            {TextInputProps.successText}
          </FormHelperText>
        )}
      </>
    );
  },
);
