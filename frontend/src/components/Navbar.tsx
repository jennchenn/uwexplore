import { useState } from "react";
import "../styles/Navbar.css";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import LoginModal from "./LoginModal";
import CustomButton from "./CustomButton";
import SignUp from "./SignUpModal";

// import IconButton from "@mui/material/IconButton";
// import MenuIcon from "@mui/icons-material/Menu";

// todo: customize menu
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
