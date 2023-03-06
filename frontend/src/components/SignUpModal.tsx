import { useState } from "react";
import { Box, Modal } from "@mui/material";
import { Props } from "../App";
import TextInput from "./TextInput";
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

  const [email] = useState("");
  const [password] = useState("");
  const [confirmPassword] = useState("");

  const inputStyles = { width: "-webkit-fill-available", margin: "8px 72px" };

  return (
    <Modal
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
          id="sign-up-email"
          placeholder="Email"
          type="email"
          value={email}
          required
        />
        <TextInput
          id="sign-up-password"
          placeholder="Password"
          type="password"
          value={password}
          required
        />
        <TextInput
          id="sign-up-password-confirm"
          placeholder="Confirm Password"
          type="password"
          value={confirmPassword}
          required
        />
        <CustomButton text="create account" type="CTA" style={inputStyles} />
        <CustomButton
          text="already have an account? login"
          type="tertiary"
          style={{ paddingBottom: "0", ...inputStyles }}
          onClick={SignUpModalProps.linkOpen}
        />
      </Box>
    </Modal>
  );
}
