import "./App.css";
import { useState } from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Unstable_Grid2";
import Stack from "@mui/material/Stack";
import KeyboardDoubleArrowRightIcon from "@mui/icons-material/KeyboardDoubleArrowRight";
import KeyboardDoubleArrowLeftIcon from "@mui/icons-material/KeyboardDoubleArrowLeft";

import Navbar from "./components/Navbar";

const sectionSizes = {
  default: { search: 4, calendar: 8 },
  allCal: { search: 0, calendar: 12 },
};

function App() {
  const [searchWidth, setSearchWidth] = useState(sectionSizes.default.search);
  const [calendarWidth, setCalendarWidth] = useState(
    sectionSizes.default.calendar,
  );
  const [sectionInView, setSectionInView] = useState("both");

  const collapseSearch = () => {
    setSearchWidth(sectionSizes.allCal.search);
    setCalendarWidth(sectionSizes.allCal.calendar);
    setSectionInView("calendar");
  };

  const expandSearch = () => {
    setSearchWidth(sectionSizes.default.search);
    setCalendarWidth(sectionSizes.default.calendar);
    setSectionInView("both");
  };

  return (
    <Box>
      <Navbar></Navbar>
      <Grid container>
        <Grid xs={searchWidth}>
          <Box
            style={{
              maxHeight: "92vh",
              overflow: "auto",
              position: "sticky",
              top: "8vh",
            }}
          >
            Search
            <KeyboardDoubleArrowLeftIcon
              className="search-collapse-icon"
              onClick={collapseSearch}
            ></KeyboardDoubleArrowLeftIcon>
          </Box>
        </Grid>
        <Grid xs={calendarWidth} className="calendar-base">
          <Box
            style={{
              maxHeight: "92vh",
              overflow: "auto",
              position: "sticky",
              top: "8vh",
            }}
          >
            <Stack direction="column">
              <div>
                Calendar
                <KeyboardDoubleArrowRightIcon
                  style={{
                    display: sectionInView === "both" ? "none" : "inline-block",
                  }}
                  className="cal-collapse-icon"
                  onClick={expandSearch}
                ></KeyboardDoubleArrowRightIcon>
              </div>
            </Stack>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}

export default App;
