import { useState } from "react";
import { Box, Link, Modal } from "@mui/material";
import { Props } from "../App";
import "../styles/LoginSignUpModal.css";
import CustomButton from "./CustomButton";
import TextInput from "./TextInput";

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

  const [email] = useState("");
  const [password] = useState("");

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
          required
        />
        <TextInput
          className="modal-input-text"
          id="login-password"
          placeholder="Password"
          type="password"
          value={password}
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
