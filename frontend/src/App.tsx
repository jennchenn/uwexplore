import { useState } from "react";
import "./styles/App.css";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Unstable_Grid2";
import PerfectScrollbar from "react-perfect-scrollbar";
import Stack from "@mui/material/Stack";

import KeyboardDoubleArrowRightIcon from "@mui/icons-material/KeyboardDoubleArrowRight";
import KeyboardDoubleArrowLeftIcon from "@mui/icons-material/KeyboardDoubleArrowLeft";

import Navbar from "./components/Navbar";
import Search from "./components/Search";
import Calendar from "./components/CalendarBase";
import Ceab from "./components/CeabBase";

export interface Props {
  className?: string;
  style?: Object;
  name?: string;
}

const sectionSizes = {
  default: { search: 5, calendar: 7 },
  allCal: { search: 0, calendar: 12 },
};

function App() {
  const [searchWidth, setSearchWidth] = useState(sectionSizes.default.search);
  const [calendarWidth, setCalendarWidth] = useState(
    sectionSizes.default.calendar,
  );
  const [sectionInView, setSectionInView] = useState("both");

  // state to see a ghost course time on cal when hovering on search card
  const [courseHovered, setCourseHovered] = useState({});

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
        <Grid xs={searchWidth} className="search-base">
          {/* styles: define these in var somewhere? since same thing is used in both boxes */}
          <Box
            style={{
              height: "calc(100% - 64px)",
              overflow: "auto",
              position: "sticky",
              top: "64px",
            }}
          >
            <PerfectScrollbar>
              <KeyboardDoubleArrowLeftIcon
                className="search-collapse-icon"
                onClick={collapseSearch}
              ></KeyboardDoubleArrowLeftIcon>
              {/* todo: will this keep results? something better than empty tag? optimized? */}
              {sectionInView === "calendar" ? (
                <></>
              ) : (
                <Search setCourseHovered={setCourseHovered} />
              )}
            </PerfectScrollbar>
          </Box>
        </Grid>
        <Grid xs={calendarWidth} className="calendar-base">
          <Box
            style={{
              height: "calc(100% - 64px)",
              overflow: "auto",
              position: "sticky",
              top: "64px",
            }}
          >
            <PerfectScrollbar>
              <Stack direction="column">
                <KeyboardDoubleArrowRightIcon
                  style={{
                    display: sectionInView === "both" ? "none" : "inline-block",
                  }}
                  className="cal-collapse-icon"
                  onClick={expandSearch}
                ></KeyboardDoubleArrowRightIcon>
                <Calendar courseHovered={courseHovered} />
                <Ceab />
              </Stack>
            </PerfectScrollbar>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}

export default App;
