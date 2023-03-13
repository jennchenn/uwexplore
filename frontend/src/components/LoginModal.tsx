import React, { useEffect, useState } from "react";
import { Box, Link, Modal } from "@mui/material";
import { Props } from "../App";

import "../styles/LoginSignUpModal.css";

import CustomButton from "./CustomButton";
import { TextInput } from "./TextInput";

interface LoginModalProps extends Props {
  open: boolean;
  setOpen: (open: boolean) => void;
  linkOpen: () => void;
}

export default function LoginModal({
  open = true,
  ...LoginModalProps
}: LoginModalProps) {
  const [alert] = useState("");
  const [validate] = useState(true);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const emailRef = React.createRef<HTMLElement>();

  useEffect(() => {
    if (emailRef.current && emailRef.current.firstChild)
      (emailRef.current.firstChild as HTMLElement).focus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [email]);

  const handleClose = () => {
    LoginModalProps.setOpen(false);
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
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla
          sollicitudin dapibus nisi, quis eleifend felis pharetra vel. Mauris ac
          iaculis mauris.
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
        />
        <TextInput
          className="modal-input-text"
          id="login-password"
          placeholder="Password"
          type="password"
          value={password}
          setValue={setPassword}
          required
        />
        <Link href="#" style={linkStyles}>
          Forgot Password?
        </Link>
        <CustomButton className="modal-input-button" text="login" type="CTA" />
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
