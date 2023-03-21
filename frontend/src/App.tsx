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
import userClients, { UserObject, TokenObject } from "./APIClients/UserClient";
import courseClients from "./APIClients/CourseClient";

const user: UserObject = {
  auth_id: "auth_id",
  name: "name",
  email: "email",
  grad_year: "grad_year",
  program: "program",
  schedule: { term: "term", courses: [] },
  role: "role",
  saved_courses: ["course1", "course2"],
  past_courses: {
    term_1a: [],
    term_1b: [],
    term_2a: [],
    term_2b: [],
    term_3a: [],
    term_3b: [],
    term_4a: ["SYDE123", "SYDE321"],
    term_4b: [],
    term_other: [],
  },
};

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

  const [token, setToken] = useState<TokenObject>();

  const [coursesOnSchedule, setCoursesOnSchedule] = useState([]);

  const [pastCourses, setPastCourses] = useState(user.past_courses);
  // todo: useState for scheduleId when accounts are integrated
  // const [scheduleId, setScheduleId] = useState("6406bb27bb90bab16078f4ac");
  const scheduleId = "64127ede93deee8bdc7a9121";
  const email = "";

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

  const handleCeabPlanChange = () => {};

  useEffect(() => {
    courseClients.getCoursesByScheduleId(scheduleId).then((value: any) => {
      if (value.length !== 0) {
        setCoursesOnSchedule(value);
      }
    });
    console.log(token);
      console.log(value2);
      if (value2.length !== 0) {
        setPastCourses(value2.past_courses);
      }
    });
  }, []);

  return (
    <Box>
      <Navbar token={token} setToken={setToken} />

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
                  coursesOnSchedule={coursesOnSchedule}
                  setCoursesOnSchedule={setCoursesOnSchedule}
                  scheduleId={scheduleId}
                  handleCeabPlanChange={handleCeabPlanChange}
                  pastCourses={pastCourses}
                  setPastCourses={setPastCourses}
                />
              )}
            </PerfectScrollbar>
            <CalendarTray
              setCourseHovered={setCourseHovered}
              addedCourses={coursesOnSchedule}
              setAddedCourses={setCoursesOnSchedule}
              handleCeabPlanChange={handleCeabPlanChange}
              pastCourses={pastCourses}
              setPastCourses={setPastCourses}
              scheduleId={scheduleId}
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
                <Ceab
                  handleCeabPlanChange={handleCeabPlanChange}
                  pastCourses={pastCourses}
                  setPastCourses={setPastCourses}
                />
              </Stack>
            </PerfectScrollbar>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}

export default App;
