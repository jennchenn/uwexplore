import React from "react";
import "./App.css";

import Box from "@mui/material/Box";
import Grid from "@mui/material/Unstable_Grid2";
import Stack from "@mui/material/Stack";
import Navbar from "./components/Navbar";

function App() {
  return (
    <Box>
      <Navbar></Navbar>
      <Grid container>
        <Grid xs={4} style={{ background: "purple", height: "95vh" }}>
          Search
        </Grid>
        <Grid xs={8} style={{ background: "pink", height: "95vh" }}>
          <Stack>
            <div style={{ background: "blue" }}>Calendar</div>
            <div
              style={{
                background: "green",
                position: "fixed",
                bottom: "0",
                width: "100%",
              }}
            >
              Ceab
            </div>
          </Stack>
        </Grid>
      </Grid>
    </Box>
  );
}

export default App;
