import { Box, Modal, TextField, Typography } from "@mui/material";
import "../styles/LoginModal.css";

type LoginModalProps = {
  modalTitle: string;
  modalInfo: string;
  modalOpen: boolean;
  setModalOpen: (modalOpen: boolean) => any;
  courseColors: any;
  availableBackgroundColors: string[];
};

export default function LoginModal({ modalOpen = true, ...LoginModalProps }) {
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
        <TextField id="filled-basic" label="Filled" variant="filled" />
      </Box>
    </Modal>
  );
}
