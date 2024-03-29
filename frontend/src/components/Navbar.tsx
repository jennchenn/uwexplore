import { useEffect, useState } from "react";
import "../styles/Navbar.css";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import CustomButton from "./CustomButton";
import SignUp from "./SignUpModal";
import logo from "../images/logo.png";
import LoginModal from "./LoginModal";
import { TokenObject } from "../APIClients/UserClient";

interface NavbarProps {
  token: TokenObject | undefined;
  setToken: (value: TokenObject) => void;
  setScheduleId: (value: string) => void;
  showIsErrorSnack: (open: boolean) => void;
}

export default function Navbar({
  token,
  setToken,
  setScheduleId,
  showIsErrorSnack,
}: NavbarProps) {
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [signUpModalOpen, setSignUpModalOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(
    token?.id_token ? true : false,
  );

  useEffect(() => {
    if (token && token.id_token) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  }, [token]);

  const handleCreateModalOpen = () => {
    setSignUpModalOpen(true);
    setLoginModalOpen(false);
  };

  const handleLoginModalOpen = () => {
    setLoginModalOpen(true);
    setSignUpModalOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("scheduleId");
    window.location.reload();
  };

  return (
    <>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="fixed" elevation={0}>
          <Toolbar className="customize-toolbar" sx={{ height: "3vh" }}>
            <div className="title-container">
              <div
                className="logo-container"
                onClick={() => {
                  window.location.reload();
                }}
              >
                <img src={logo} alt="uwexplore logo" className="logo-styles" />
                <div>
                  <h2 className="title">uw</h2>
                  <h2 className="title font-light">explore</h2>
                </div>
              </div>
              <div className="login-signup-nav-button-container">
                {isLoggedIn ? (
                  <CustomButton
                    type="secondary"
                    className="login-signup-nav-button"
                    onClick={handleLogout}
                    text="Logout"
                  />
                ) : (
                  <CustomButton
                    type="secondary"
                    className="login-signup-nav-button"
                    onClick={() => setLoginModalOpen(true)}
                    text="Login/Signup"
                  />
                )}
              </div>
            </div>
          </Toolbar>
        </AppBar>
      </Box>
      <LoginModal
        open={loginModalOpen}
        setOpen={setLoginModalOpen}
        linkOpen={handleCreateModalOpen}
        setToken={setToken}
        showIsErrorSnack={showIsErrorSnack}
      />
      <SignUp
        open={signUpModalOpen}
        setOpen={setSignUpModalOpen}
        linkOpen={handleLoginModalOpen}
        setToken={setToken}
        showIsErrorSnack={showIsErrorSnack}
      />
    </>
  );
}
