import React, { useEffect, useState } from "react";
import {
  Box,
  Checkbox,
  FormControlLabel,
  FormHelperText,
  Link,
  Modal,
} from "@mui/material";
import { Props } from "../App";
import { TextInput } from "./TextInput";
import "../styles/LoginSignUpModal.css";
import CustomButton from "./CustomButton";
import { TokenObject } from "../APIClients/UserClient";

interface SignUpModalProps extends Props {
  open: boolean;
  setOpen: (open: boolean) => any;
  linkOpen: () => void;
  setToken: (token: TokenObject) => void;
}

export default function SignUp({
  open = false,
  ...SignUpModalProps
}: SignUpModalProps) {
  const [email, setEmail] = useState("");
  const [emailUsed, setEmailUsed] = useState(false);

  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState<boolean>();

  const [repeatPassword, setRepeatPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState<boolean>();

  const [checkbox, setCheckbox] = useState<boolean>();

  const emailRef = React.createRef<HTMLElement>();
  const passwordRef = React.createRef<HTMLElement>();
  const repeatRef = React.createRef<HTMLElement>();

  /* to do: make a utils file to house reused code */
  const regEmail = new RegExp(
    // eslint-disable-next-line
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
  );

  const regPassword = new RegExp(/^.{6,8}$/);

  const handleConfirmPassword = () => {
    if (password === repeatPassword) {
      setConfirmPassword(true);
    } else {
      setConfirmPassword(false);
    }
  };

  const handleClose = () => {
    setEmail("");
    setPassword("");
    setRepeatPassword("");
    setConfirmPassword(false);
    setCheckbox(false);
    setEmailUsed(false);
    setPasswordError(false);
    SignUpModalProps.setOpen(false);
  };

  const handleSubmit = (event: any) => {
    if (
      !email ||
      !regEmail.test(email) ||
      !password ||
      !regPassword.test(password) ||
      !confirmPassword ||
      !checkbox
    ) {
      event.preventDefault();
    } else {
      // to do: debug this
      // clients
      //   .createUser(email, password)
      //   .then((value: any) => {
      //     console.log(value);
      //     SignUpModalProps.setToken(value);
      //     handleClose();
      //   })
      //   .catch(() => {
      //     setEmailUsed(true);
      //   });
    }
  };

  useEffect(() => {
    if (emailRef.current && emailRef.current.firstChild)
      (emailRef.current.firstChild as HTMLElement).focus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [email]);

  useEffect(() => {
    if (passwordRef.current && passwordRef.current.firstChild)
      (passwordRef.current.firstChild as HTMLElement).focus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [password]);

  useEffect(() => {
    if (repeatRef.current && repeatRef.current.firstChild)
      (repeatRef.current.firstChild as HTMLElement).focus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [repeatPassword]);

  return (
    <Modal
      id={SignUpModalProps.id}
      className={SignUpModalProps.className}
      open={open}
      onClose={handleClose}
      style={SignUpModalProps.style}
    >
      <Box className="sign-up-modal">
        <div className="sign-up-modal-title heading-1">CREATE AN ACCOUNT</div>
        <div className="sign-up-modal-description heading-6">
          Keep track of your planned courses on the UWExplore interactive
          planner. Sign up to get started!
        </div>
        <TextInput
          ref={emailRef}
          className="modal-input-text"
          id="sign-up-email"
          placeholder="Email"
          type="email"
          value={email}
          setValue={setEmail}
          checkReg
          required
          error={email && emailUsed}
          errorText="Email is already in use."
        />
        <TextInput
          ref={passwordRef}
          className="modal-input-text"
          id="sign-up-password"
          placeholder="Password"
          type="password"
          value={password}
          setValue={setPassword}
          checkReg
          required
          error={password && passwordError}
          errorText="Password must be between 6-8 characters."
          success={password && !passwordError && regPassword.test(password)}
          successText="Your password is good!"
          onBlur={() => {
            setPasswordError(!regPassword.test(password));
            handleConfirmPassword();
          }}
        />
        <TextInput
          ref={repeatRef}
          className="modal-input-text"
          id="sign-up-password-confirm"
          placeholder="Confirm Password"
          type="password"
          value={repeatPassword}
          setValue={setRepeatPassword}
          checkReg
          required
          error={password && repeatPassword && !confirmPassword}
          errorText="Your password does not match."
          success={
            password && repeatPassword && confirmPassword && !passwordError
          }
          successText="Thanks for confirming your password!"
          onBlur={handleConfirmPassword}
        />
        <FormControlLabel
          className="terms-conditions-check"
          control={
            <Checkbox
              checked={checkbox}
              onChange={() => {
                setCheckbox(!checkbox);
              }}
            />
          }
          label={
            <div className="modal-checkbox-text">
              I agree with the{" "}
              <Link href="#" color="inherit">
                Terms and Conditions
              </Link>
            </div>
          }
        />
        {checkbox === false && (
          <FormHelperText error className="error-helper-text heading-6">
            **Please read and agree with the Terms and Conditions.
          </FormHelperText>
        )}
        <CustomButton
          className="modal-input-button"
          text="create account"
          type="CTA"
          onClick={(event: any) => {
            handleSubmit(event);
            handleConfirmPassword();
          }}
        />
        <CustomButton
          className="modal-input-button"
          text="already have an account? login"
          type="tertiary"
          style={{ paddingBottom: "0" }}
          onClick={SignUpModalProps.linkOpen}
        />
      </Box>
    </Modal>
  );
}
