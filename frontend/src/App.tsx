import { useState, useEffect } from "react";
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
import CalendarTray from "./components/CalendarTray";
import clients from "./APIClients/CourseClient";

export interface Props {
  id?: string;
  className?: string;
  ref?: any;
  style?: Object;
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

  const [coursesOnSchedule, setCoursesOnSchedule] = useState([]);
  // todo: useState for scheduleId when accounts are integrated
  // const [scheduleId, setScheduleId] = useState("6406bb27bb90bab16078f4ac");
  const scheduleId = "64127ede93deee8bdc7a9121";

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

  useEffect(() => {
    clients.getCoursesByScheduleId(scheduleId).then((value: any) => {
      setCoursesOnSchedule(value);
    });
  }, []);

  return (
    <Box>
      <Navbar></Navbar>

      <Grid container>
        {/* LHS SEARCH */}
        <Grid xs={searchWidth} className="search-base">
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
                <Search
                  setCourseHovered={setCourseHovered}
                  setCoursesOnSchedule={setCoursesOnSchedule}
                  scheduleId={scheduleId}
                />
              )}
            </PerfectScrollbar>
            <CalendarTray
              setCourseHovered={setCourseHovered}
              addedCourses={coursesOnSchedule}
            />
          </Box>
        </Grid>
        {/* RHS CALENDAR */}
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
                <Calendar
                  courseHovered={courseHovered}
                  coursesOnSchedule={coursesOnSchedule}
                  setCoursesOnSchedule={setCoursesOnSchedule}
                  scheduleId={scheduleId}
                />
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
