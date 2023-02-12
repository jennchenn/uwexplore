import { useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import DeleteIcon from "@mui/icons-material/Delete";
import Modal from "@mui/material/Modal";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

type Props = {
  modalTitle: string;
  modalInfo: string;
  modalOpen: boolean;
  setModalOpen: (modalOpen: boolean) => any;
  courseColors: any;
  availableBackgroundColors: string[];
  handleCourseDeletion: any;
};

export default function CalendarModal({
  modalInfo,
  modalTitle,
  modalOpen,
  setModalOpen,
  courseColors,
  availableBackgroundColors,
  handleCourseDeletion,
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

  // todo: define array w different modal states??
  const [modalView, setModalView] = useState("details");
  const [selectedValue, setSelectedValue] = useState(" ");
  const handleClose = () => {
    setSelectedValue(" ");
    setModalOpen(false);
    if (modalView !== "details") {
      setModalView("details");
    }
  };
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    courseColors[modalTitle] = event.target.value;
    setSelectedValue(event.target.value);
    // todo: add feedback that colour did change?
  };

  const modalRadioButtons = () => {
    return (
      <RadioGroup
        row
        onChange={handleChange}
        value={courseColors[modalTitle] || selectedValue}
      >
        {availableBackgroundColors.map((color, i) => (
          <Radio
            value={color}
            sx={{
              color: { color },
              "&.Mui-checked": {
                color: { color },
              },
            }}
            key={i}
          ></Radio>
        ))}
      </RadioGroup>
    );
  };

  const detailsView = () => {
    return (
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
        {modalRadioButtons()}
        <Button
          variant="outlined"
          startIcon={<DeleteIcon />}
          onClick={() => setModalView("singleDelete")}
        >
          Delete course
        </Button>
      </Box>
    );
  };

  const deleteSingleCourseView = () => {
    return (
      <Box sx={modalStyle}>
        <Typography id="modal-modal-title" variant="h6" component="h2">
          Confirm Course Deletion
        </Typography>
        <Typography
          style={{ whiteSpace: "pre-line" }}
          id="modal-modal-description"
          sx={{ mt: 2 }}
        >
          Are you sure you want to delete {modalTitle} from your schedule?
        </Typography>
        <Stack
          direction="row"
          spacing={4}
          sx={{
            justifyContent: "center",
            alignItems: "center",
            marginTop: "20px",
          }}
        >
          <Button variant="contained" onClick={() => handleCourseDeletion()}>
            Delete
          </Button>
          <Button variant="outlined" onClick={handleClose} disableRipple>
            Cancel
          </Button>
        </Stack>
      </Box>
    );
  };

  return (
    <Modal
      open={modalOpen}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      {modalView === "details" ? detailsView() : deleteSingleCourseView()}
    </Modal>
  );
}
