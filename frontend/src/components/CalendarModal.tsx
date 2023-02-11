import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Typography from "@mui/material/Typography";

type Props = {
  modalTitle: string;
  modalInfo: string;
  modalOpen: boolean;
  setModalOpen: (modalOpen: boolean) => any;
};

export default function CalendarModal({
  modalInfo,
  modalTitle,
  modalOpen,
  setModalOpen,
}: Props) {
  // todo: change default styles from MUI
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

  const handleClose = () => setModalOpen(false);

  return (
    <Modal
      open={modalOpen}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={modalStyle}>
        <Typography id="modal-modal-title" variant="h6" component="h2">
          {modalTitle}
        </Typography>
        <Typography
          style={{ whiteSpace: "pre-line" }}
          id="modal-modal-description"
          sx={{ mt: 2 }}
        >
          {modalInfo}
        </Typography>
      </Box>
    </Modal>
  );
}
