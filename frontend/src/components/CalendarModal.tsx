import { useState } from "react";
import "../styles/CalendarModal.css";
import backgroundColors from "../styles/calendarCourseBackgroundColors";
import Box from "@mui/material/Box";
import FormControl from "@mui/material/FormControl";
import IconButton from "@mui/material/IconButton";
import InputLabel from "@mui/material/InputLabel";
import Modal from "@mui/material/Modal";
import MenuItem from "@mui/material/MenuItem";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import Select from "@mui/material/Select";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import clients from "../APIClients/CourseClient";

type Props = {
  modalClass: any;
  modalInfo: string;
  modalOpen: boolean;
  modalConflicts: string[];
  setModalOpen: (modalOpen: boolean) => any;
  setCoursesOnSchedule: any;
  scheduleId: string;
};

export default function CalendarModal({
  modalClass,
  modalInfo,
  modalOpen,
  modalConflicts,
  setModalOpen,
  setCoursesOnSchedule,
  scheduleId,
}: Props) {
  const [selectedValue, setSelectedValue] = useState(" ");
  const [colorChanged, setColorChanged] = useState(false);
  const [applyColourTo, setApplyColorTo] = useState("section");

  const handleClose = () => {
    if (selectedValue !== " ") {
      if (applyColourTo === "section") {
        clients
          .updateSectionColorByScheduleId(
            scheduleId,
            modalClass.uid,
            selectedValue,
          )
          .then((value: any) => {
            setCoursesOnSchedule(value);
          })
          .then(() => {
            setSelectedValue(" ");
            setModalOpen(false);
            setColorChanged(false);
          });
      } else {
        clients
          .updateCourseColorByScheduleId(
            scheduleId,
            modalClass.courseId,
            selectedValue,
          )
          .then((value: any) => {
            setCoursesOnSchedule(value);
          })
          .then(() => {
            setSelectedValue(" ");
            setModalOpen(false);
            setColorChanged(false);
          });
      }
    } else {
      setModalOpen(false);
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedValue(event.target.value);
    setColorChanged(true);
  };

  const handleDeleteCourse = (id: string) => {
    clients
      .deleteSingleCourseByScheduleId(scheduleId, id)
      .then((value: any) => {
        if (value.length !== 0) {
          setCoursesOnSchedule(value);
        }
        setModalOpen(false);
      });
  };

  const handleColorDropdownChange = (e: any) => {
    setApplyColorTo(e.target.value);
  };

  const modalRadioButtons = () => {
    return (
      <RadioGroup
        row
        onChange={handleChange}
        value={selectedValue === " " ? modalClass.color : selectedValue}
        style={{ marginLeft: "-12px" }}
      >
        {backgroundColors.map((color, i) => (
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
        <h1 className="modal-title">{modalClass.title}</h1>
        <h4 className="modal-info">{modalInfo}</h4>
        {modalRadioButtons()}
        <FormControl
          sx={{
            m: 1,
            minWidth: 120,
            marginLeft: "-6px",
          }}
          size="small"
        >
          <InputLabel
            id="demo-select-small"
            sx={{
              color: "var(--main-purple-2)",
              fontWeight: "var(--font-weight-regular)",
            }}
          >
            Apply Color To
          </InputLabel>
          <Select
            labelId="demo-select-small"
            id="demo-select-small"
            defaultValue="section"
            value={applyColourTo || ""}
            label="Apply Color To"
            onChange={(e) => handleColorDropdownChange(e)}
            sx={{
              "& .MuiOutlinedInput-root": {
                border: "red",
                borderRadius: "8px",
              },
              "& .MuiSelect-select": {
                color: "var(--main-purple-1)",
                fontWeight: "var(--font-weight-regular)",
              },
              borderRadius: "10px",
              backgroundColor: "white",
            }}
          >
            <MenuItem value="section">Section</MenuItem>
            <MenuItem value="course">Course</MenuItem>
          </Select>
        </FormControl>
        <h5 className="conflict-info">
          {modalConflicts === undefined ? (
            <></>
          ) : (
            `This course conflicts with: ${modalConflicts.join(", ")}`
          )}
        </h5>
        <IconButton
          aria-label="delete course"
          onClick={() => handleDeleteCourse(modalClass.uid)}
          sx={{
            marginLeft: "-8px",
            "&:hover": {
              borderRadius: "30px",
            },
          }}
        >
          <DeleteOutlineIcon
            fontSize="small"
            sx={{
              backgroundColor: "var(--alerts-warning-1)",
              borderRadius: "50%",
              padding: "6px",
              color: "white",
            }}
          />
          <h5 style={{ margin: "0px" }}>Delete Course</h5>
        </IconButton>
        {colorChanged ? (
          <h5 className="modal-info">Close popup to see colour changes!</h5>
        ) : (
          <></>
        )}
      </Box>
    </Modal>
  );
}
