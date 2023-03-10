import { useState } from "react";
import { Box, Checkbox, FormControlLabel, Link, Modal } from "@mui/material";
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
          className="modal-input-text"
          id="sign-up-email"
          placeholder="Email"
          type="email"
          value={email}
          required
        />
        <TextInput
          className="modal-input-text"
          id="sign-up-password"
          placeholder="Password"
          type="password"
          value={password}
          required
        />
        <TextInput
          className="modal-input-text"
          id="sign-up-password-confirm"
          placeholder="Confirm Password"
          type="password"
          value={confirmPassword}
          required
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
