import { useState } from "react";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import Typography from "@mui/material/Typography";

type Props = {
  modalTitle: string;
  modalId: string;
  modalInfo: string;
  modalOpen: boolean;
  modalConflicts: string[];
  setModalOpen: (modalOpen: boolean) => any;
  courseColors: any;
  availableBackgroundColors: string[];
};

export default function CalendarModal({
  modalId,
  modalInfo,
  modalTitle,
  modalOpen,
  modalConflicts,
  setModalOpen,
  courseColors,
  availableBackgroundColors,
}: Props) {
  // todo: change default styles from MUI
  const modalStyle = {
    position: "absolute" as "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    borderRadius: "12px",
    boxShadow: 24,
    p: 4,
  };

  const [selectedValue, setSelectedValue] = useState(" ");
  const handleClose = () => {
    setSelectedValue(" ");
    setModalOpen(false);
  };
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    courseColors[modalId] = event.currentTarget.value;
    setSelectedValue(event.target.value);
    // todo: add feedback that colour did change?
  };

  const modalRadioButtons = () => {
    return (
      <RadioGroup
        row
        onChange={handleChange}
        value={courseColors[modalId] || selectedValue}
        style={{ marginLeft: "-12px" }}
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

  return (
    <Modal
      open={modalOpen}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={modalStyle}>
        <h1 style={{ margin: "0px", color: "var(--black-3)" }}>{modalTitle}</h1>
        <h4
          style={{
            margin: "10px 0px",
            whiteSpace: "pre-line",
            color: "var(--black-3)",
            lineHeight: "1.5em",
          }}
        >
          {modalInfo}
        </h4>
        {modalRadioButtons()}
        <Typography color="FireBrick" fontSize="0.8em">
          {modalConflicts === undefined ? (
            <></>
          ) : (
            `This course conflicts with ${modalConflicts.join(", ")}`
          )}
        </Typography>
      </Box>
    </Modal>
  );
}
