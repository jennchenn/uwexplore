import Snackbar from "@mui/material/Snackbar";
import { Props } from "../App";

interface SnackbarProps extends Props {
  message: string;
  setShowSnackbar: (open: boolean) => void;
  showSnackbar: boolean;
  type: "success" | "alert";
  anchorVertical?: "top" | "bottom";
  anchorHorizontal?: "left" | "right";
}

export default function CustomSnackbar({
  anchorVertical = "top",
  anchorHorizontal = "right",
  type = "success",
  ...SnackbarProps
}: SnackbarProps) {
  const color =
    type == "success" ? "var(--alerts-success-1)" : "var(--black-3)";
  const backgroundColor =
    type === "success" ? "var(--alerts-success-7)" : "var(--alerts-conflict-5)";
  return (
    <Snackbar
      anchorOrigin={{ vertical: anchorVertical, horizontal: anchorHorizontal }}
      open={SnackbarProps.showSnackbar}
      autoHideDuration={2000}
      onClose={() => SnackbarProps.setShowSnackbar(false)}
      message={SnackbarProps.message}
      sx={{
        "& .MuiSnackbarContent-root": {
          backgroundColor: backgroundColor,
          color: color,
          minWidth: "150px",
          marginTop: "64px",
        },
      }}
    />
  );
}
