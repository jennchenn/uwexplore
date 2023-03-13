import React, { useEffect, useState } from "react";
import { Box, Checkbox, FormControlLabel, Link, Modal } from "@mui/material";
import { Props } from "../App";
import { TextInput } from "./TextInput";
import "../styles/LoginSignUpModal.css";
import CustomButton from "./CustomButton";

interface SignUpModalProps extends Props {
  open: boolean;
  setOpen: (open: boolean) => any;
  linkOpen: () => void;
}

export default function SignUp({
  open = false,
  ...SignUpModalProps
}: SignUpModalProps) {
  const [alert, setAlert] = useState("");
  const [validate, setValidate] = useState(true);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState(false);
  const [checkbox, setCheckbox] = useState(false);

  const emailRef = React.createRef<HTMLElement>();
  const passwordRef = React.createRef<HTMLElement>();
  const repeatRef = React.createRef<HTMLElement>();

  /* to do: make a utils file to house reused code */
  const regEmail = new RegExp(
    // eslint-disable-next-line
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
  );

  const regPassword = new RegExp(
    // eslint-disable-next-line
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
  );

  const handleConfirmPassword = () => {
    if (password === repeatPassword) {
      setConfirmPassword(true);
    } else {
      setConfirmPassword(false);
    }
  };

  const handleSubmit = () => {
    if (
      !email ||
      !regEmail.test(email) ||
      !password ||
      !regPassword.test(password) ||
      !checkbox ||
      !confirmPassword
    ) {
      setValidate(false);
      setAlert("Please input a valid email/password or agree to terms.");
    } else {
      /* to do: make the call the sign up
      // on error:
      setValidate(false);
      setAlert("Network error. Try again later.");
      // on success:
      setValidate(true);
      setAlert("");
      // save returned to var to be included in all other api calls
      */
    }
  };

  const handleClose = () => {
    setEmail("");
    setPassword("");
    setRepeatPassword("");
    setConfirmPassword(false);
    setCheckbox(false);
    setAlert("");
    setValidate(true);
    SignUpModalProps.setOpen(false);
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
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla
          sollicitudin dapibus nisi, quis eleifend felis pharetra vel. Mauris ac
          iaculis mauris.
        </div>
        {!validate && alert !== "" && (
          <div className="sign-up-modal-alert heading-4">{alert}</div>
        )}
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
          errorText="Your password does not match"
          success={repeatPassword !== "" && confirmPassword}
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
        <CustomButton
          className="modal-input-button"
          text="create account"
          type="CTA"
          onClick={handleSubmit}
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
