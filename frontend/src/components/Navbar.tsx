import { useState } from "react";
import "../styles/Navbar.css";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Button from "@mui/material/Button";
import logo from "../images/logo.png";
import LoginModal from "./LoginModal";

export default function Navbar() {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="fixed" elevation={0}>
          <Toolbar className="customize-toolbar" sx={{ height: "3vh" }}>
            <img src={logo} alt="uwexplore logo" className="logo-styles" />
            <div className="title-container">
              <h2 className="title">uw</h2>
              <h2 className="title font-light">explore</h2>
            </div>
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
