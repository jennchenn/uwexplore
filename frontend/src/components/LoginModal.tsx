import { useState } from "react";
import { Box, Link, Modal } from "@mui/material";
import { Props } from "../App";
import "../styles/LoginModal.css";
import CustomButton from "./CustomButton";
import TextInput from "./TextInput";

interface LoginModalProps extends Props {
  modalTitle?: string;
  modalInfo?: string;
  open?: boolean;
  setOpen: (open: boolean) => any;
  buttonText?: string;
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
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Box className="login-modal">
        <div className="login-modal-title heading-1">
          {LoginModalProps.modalTitle}
        </div>
        <div className="login-modal-description heading-6">
          {LoginModalProps.modalInfo}
        </div>
        {!validate && alert !== "" && (
          <div className="login-modal-alert heading-4">{alert}</div>
        )}
        <TextInput
          className="modal-input-text"
          id="login-email"
          placeholder="Email"
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
        />
      </Box>
    </Modal>
  );
}
