// import { useState, useEffect } from "react";
import "../styles/Navbar.css";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Button from "@mui/material/Button";
import logo from "../images/logo.png";

// todo: customize menu
export default function Navbar() {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="fixed" elevation={0}>
        <Toolbar className="customize-toolbar">
          <img src={logo} alt="uwexplore logo" className="logo-styles" />
          <h2 className="title-styles">uwexplore</h2>
          <Button color="inherit">Login</Button>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
