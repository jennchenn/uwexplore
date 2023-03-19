import clients from "../APIClients/CourseClient";
import CustomButton from "./CustomButton";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Stack from "@mui/material/Stack";

interface searchDeleteModalProps {
  courseToDelete: any;
  setCourseToDelete: any;
  setCoursesOnSchedule: any;
  deleteModalOpen: boolean;
  setDeleteModalOpen: any;
  scheduleId: string;
}

export default function SearchDeleteModal({
  courseToDelete,
  setCourseToDelete,
  setCoursesOnSchedule,
  deleteModalOpen,
  setDeleteModalOpen,
  scheduleId,
}: searchDeleteModalProps) {
  const modalStyles = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "450px",
    backgroundColor: "white",
    borderRadius: "12px",
    boxShadow: "0 0 24px rgba(0, 0, 0, 0.3)",
    padding: "32px",
    textAlign: "center",
  };

  const deleteCourseFromSchedule = (id: string) => {
    clients
      .deleteCoursesByScheduleId(scheduleId, id)
      .then((value: any) => {
        if (value.length !== 0) {
          setCoursesOnSchedule(value);
        }
      })
      .then(() => setDeleteModalOpen(false));
  };

  const handleClose = () => {
    setDeleteModalOpen(false);
    setCourseToDelete({});
  };

  return (
    <Modal
      open={deleteModalOpen}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={modalStyles}>
        <h4 style={{ color: "var(--black-3)" }}>
          Are you sure you want to delete <b>{courseToDelete.title}</b> from
          your schedule?
        </h4>
        <Stack
          direction="row"
          display={"flex"}
          justifyContent={"center"}
          spacing={4}
          marginTop={"24px"}
        >
          <CustomButton
            type="primary"
            text="Delete"
            onClick={() => deleteCourseFromSchedule(courseToDelete.id)}
          ></CustomButton>
          <CustomButton
            type="tertiary"
            text="Cancel"
            onClick={() => handleClose()}
          ></CustomButton>
        </Stack>
      </Box>
    </Modal>
  );
}