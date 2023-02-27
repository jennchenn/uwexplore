import { Box, Modal } from "@mui/material";
import "../styles/LoginModal.css";
import TextInput from "./TextInput";

type LoginModalProps = {
  modalTitle: string;
  modalInfo: string;
  modalOpen: boolean;
  setModalOpen: (modalOpen: boolean) => any;
  courseColors: any;
  availableBackgroundColors: string[];
};

export default function LoginModal({ modalOpen = true, ...LoginModalProps }) {
  const inputStyles = { width: "-webkit-fill-available", margin: "8px 72px" };

  return (
    <Modal
      open={modalOpen}
      onClose={LoginModalProps.handleClose}
      aria-labelledby="login-modal-title"
      aria-describedby="login-modal-description"
    >
      <Box className="login-modal">
        <div className="login-modal-title heading-1">
          {LoginModalProps.modalTitle} THIS
        </div>
        <div className="login-modal-description heading-6">
          {LoginModalProps.modalInfo} lorel
        </div>
        <TextInput placeholder="Email" styles={inputStyles} type="email" />
        <TextInput
          placeholder="Password"
          styles={inputStyles}
          type="password"
        />
      </Box>
    </Modal>
  );
}
