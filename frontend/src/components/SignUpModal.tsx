import { useState } from "react";
import { Box, Modal } from "@mui/material";
import { Props } from "../App";
import "../styles/SignUpModal.css";

interface SignUpModalProps extends Props {
  modalTitle?: string;
  modalInfo?: string;
  open?: boolean;
  buttonText?: string;
}

export default function SignUp({
  open = true,
  ...SignUpModalProps
}: SignUpModalProps) {
  const [modalOpen, setModalOpen] = useState(open);

  const handleClose = () => {
    setModalOpen(false);
  };

  return (
    <Modal open={modalOpen} onClose={handleClose}>
      <Box className="sign-up-modal"></Box>
    </Modal>
  );
}
