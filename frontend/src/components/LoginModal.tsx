import { Box, Modal, Typography } from "@mui/material";

type LoginModalProps = {
  modalTitle: string;
  modalInfo: string;
  modalOpen: boolean;
  setModalOpen: (modalOpen: boolean) => any;
  courseColors: any;
  availableBackgroundColors: string[];
};

export default function LoginModal({ modalOpen = true, ...LoginModalProps }) {
  const modalStyle = {
    position: "absolute" as "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    border: "2px solid #000",
    borderRadius: "12px",
    boxShadow: 24,
    p: 4,
  };

  return (
    <Modal
      open={modalOpen}
      onClose={LoginModalProps.handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={modalStyle}>
        <Typography id="modal-modal-title" variant="h6" component="h2">
          {LoginModalProps.modalTitle}
        </Typography>
        <Typography
          style={{ whiteSpace: "pre-line" }}
          id="modal-modal-description"
          sx={{ mt: 2 }}
        >
          {LoginModalProps.modalInfo}
        </Typography>
      </Box>
    </Modal>
  );
}
