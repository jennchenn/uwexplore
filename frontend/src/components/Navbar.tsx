import { useState } from "react";
import "../styles/Navbar.css";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import CustomButton from "./CustomButton";
import SignUp from "./SignUpModal";
import logo from "../images/logo.png";
import LoginModal from "./LoginModal";

export default function Navbar() {
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [signUpModalOpen, setSignUpModalOpen] = useState(false);

  const handleCreateModalOpen = () => {
    setSignUpModalOpen(true);
    setLoginModalOpen(false);
  };

  const handleLoginModalOpen = () => {
    setLoginModalOpen(true);
    setSignUpModalOpen(false);
  };

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
            <CustomButton
              type="secondary"
              className="login-signup-nav-button"
              onClick={() => setLoginModalOpen(true)}
              text="Login/Signup"
            />
          </Toolbar>
        </AppBar>
      </Box>
      <LoginModal
        open={loginModalOpen}
        setOpen={setLoginModalOpen}
        linkOpen={handleCreateModalOpen}
      />
      <SignUp
        open={signUpModalOpen}
        setOpen={setSignUpModalOpen}
        linkOpen={handleLoginModalOpen}
      />
    </>
  );
}
