import { useState } from "react";
import "../styles/Navbar.css";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import LoginModal from "./LoginModal";
// import IconButton from "@mui/material/IconButton";
// import MenuIcon from "@mui/icons-material/Menu";

// todo: customize menu
export default function Navbar() {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="fixed" elevation={0}>
          <Toolbar className="customize-toolbar" sx={{ height: "3vh" }}>
            {/* <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton> */}
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              UWChoose
            </Typography>
            <Button color="inherit" onClick={() => setModalOpen(true)}>
              Login
            </Button>
          </Toolbar>
        </AppBar>
      </Box>
      <LoginModal
        modalTitle="LOGIN"
        modalInfo="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla sollicitudin dapibus nisi, quis eleifend felis pharetra vel. Mauris ac iaculis mauris."
        open={modalOpen}
        setOpen={setModalOpen}
      />
    </>
  );
}
