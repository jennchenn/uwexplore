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
  const handleClose = () => {
    SignUpModalProps.setOpen(false);
  };

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState(false);

  const emailRef = React.createRef<HTMLElement>();
  const passwordRef = React.createRef<HTMLElement>();

  const handleConfirmPassword = () => {
    if (password === repeatPassword) {
      setConfirmPassword(true);
    } else {
      setConfirmPassword(false);
    }
  };

  useEffect(() => {
    if (emailRef.current && emailRef.current.firstChild)
      (emailRef.current.firstChild as HTMLElement).focus();
  }, [email]);

  useEffect(() => {
    if (passwordRef.current && passwordRef.current.firstChild)
      (passwordRef.current.firstChild as HTMLElement).focus();
  }, [password]);

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
        <TextInput
          ref={emailRef}
          className="modal-input-text"
          id="sign-up-email"
          placeholder="Email"
          type="email"
          value={email}
          setValue={setEmail}
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
          required
        />
        <TextInput
          className="modal-input-text"
          id="sign-up-password-confirm"
          placeholder="Confirm Password"
          type="password"
          value={repeatPassword}
          setValue={setRepeatPassword}
          required
          error={!confirmPassword}
          errorText="Your password does not match"
          success={repeatPassword !== "" && confirmPassword}
          successText="Thanks for confirming your password!"
          onBlur={handleConfirmPassword}
        />
        <FormControlLabel
          control={<Checkbox />}
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
