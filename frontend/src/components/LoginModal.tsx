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

  const inputStyles = { width: "-webkit-fill-available", margin: "8px 72px" };
  const linkStyles = {
    color: "#6C63FF",
    opacity: "0.6",
    alignSelf: "flex-start",
    margin: "8px 104px",
    fontSize: "12px",
    fontWeight: "700",
  };

  return (
    <Modal
      className={LoginModalProps.className}
      open={open}
      onClose={handleClose}
      style={LoginModalProps.style}
    >
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
          id="login-email"
          placeholder="Email"
          value={email}
          required
        />
        <TextInput
          id="login-password"
          placeholder="Password"
          type="password"
          value={password}
          required
        />
        <Link href="#" style={linkStyles}>
          Forgot Password?
        </Link>
        <CustomButton text="login" type="CTA" style={inputStyles} />
        <CustomButton
          text="create account"
          type="tertiary"
          style={{ paddingBottom: "0", ...inputStyles }}
        />
      </Box>
    </Modal>
  );
}
