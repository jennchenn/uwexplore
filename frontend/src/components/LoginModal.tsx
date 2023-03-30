import React, { useEffect, useState } from "react";
import { Box, Link, Modal } from "@mui/material";
import { Props } from "../App";

import "../styles/LoginSignUpModal.css";

import CustomButton from "./CustomButton";
import { TextInput, regEmail } from "./TextInput";
import userClient, { TokenObject } from "../APIClients/UserClient";
import { APIError } from "../APIClients/APIClient";

interface LoginModalProps extends Props {
  open: boolean;
  setOpen: (open: boolean) => void;
  linkOpen: () => void;
  setToken: (token: TokenObject) => void;
  showIsErrorSnack: (open: boolean) => void;
}

export default function LoginModal({
  open = true,
  ...LoginModalProps
}: LoginModalProps) {
  const [alert, setAlert] = useState("");
  const [validate, setValidate] = useState(true);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const emailRef = React.createRef<HTMLElement>();
  const passwordRef = React.createRef<HTMLElement>();

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

  const handleClose = () => {
    setEmail("");
    setPassword("");
    setAlert("");
    setValidate(true);
    LoginModalProps.setOpen(false);
  };

  const handleSubmit = () => {
    if (!email || !regEmail.test(email) || !password) {
      setValidate(false);
      setAlert("Please input a valid email/password.");
    } else if (email && regEmail.test(email) && password) {
      userClient.login(email, password).then((value: any) => {
        if (value instanceof APIError) {
          setValidate(false);
          handleClose();
          LoginModalProps.showIsErrorSnack(true);
        } else {
          LoginModalProps.setToken(value);
          setValidate(true);
          setAlert("");
          handleClose();
        }
      });
    }
  };

  const linkStyles = {
    color: "#6C63FF",
    opacity: "0.6",
    alignSelf: "flex-start",
    margin: "8px 104px",
    fontSize: "12px",
    fontWeight: "700",

    cursor: "pointer",
  };

  return (
    <Modal
      id={LoginModalProps.id}
      className={LoginModalProps.className}
      open={open}
      onClose={handleClose}
      style={LoginModalProps.style}
    >
      <Box className="login-modal">
        <div className="login-modal-title heading-1">LOGIN</div>
        <div className="login-modal-description heading-6">
          Welcome to your interactive planner. Plan your term and keep track of
          your courses with uwexplore.
        </div>
        {!validate && alert !== "" && (
          <div className="login-modal-alert heading-4">{alert}</div>
        )}
        <TextInput
          className="modal-input-text"
          id="login-email"
          placeholder="Email"
          type="email"
          value={email}
          setValue={setEmail}
          ref={emailRef}
          required
          onKeyDown={(e: React.KeyboardEvent<HTMLDivElement>) => {
            if (e.key === "Enter") {
              handleSubmit();
            }
          }}
        />
        <TextInput
          className="modal-input-text"
          id="login-password"
          placeholder="Password"
          type="password"
          value={password}
          setValue={setPassword}
          ref={passwordRef}
          required
          onKeyDown={(e: React.KeyboardEvent<HTMLDivElement>) => {
            if (e.key === "Enter") {
              handleSubmit();
            }
          }}
        />
        <Link href="#" style={linkStyles}>
          Forgot Password?
        </Link>
        <CustomButton
          className="modal-input-button"
          text="login"
          type="CTA"
          onClick={handleSubmit}
        />
        <CustomButton
          className="modal-input-button"
          text="create account"
          type="tertiary"
          style={{ paddingBottom: "0" }}
          onClick={LoginModalProps.linkOpen}
        />
      </Box>
    </Modal>
  );
}
