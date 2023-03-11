import { useState } from "react";
import "../styles/CalendarModal.css";
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
      <Box className="modal-style">
        <h1 className="modal-title">{modalTitle}</h1>
        <h4 className="modal-info">{modalInfo}</h4>
        {modalRadioButtons()}
        <h5 className="conflict-info">
          {modalConflicts === undefined ? (
            <></>
          ) : (
            `This course conflicts with: ${modalConflicts.join(", ")}`
          )}
        </h5>
      </Box>
    </Modal>
  );
}
