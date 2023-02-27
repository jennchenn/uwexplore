import { Box, Modal, Typography } from "@mui/material";
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
        <Typography id="login-modal-title" variant="h5">
          {LoginModalProps.modalTitle} THIS
        </Typography>
        <Typography id="login-modal-description">
          {LoginModalProps.modalInfo} lorel
        </Typography>
      </Box>
    </Modal>
  );
}
