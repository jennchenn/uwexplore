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
import userClient, { TokenObject } from "./APIClients/UserClient";
import courseClients from "./APIClients/CourseClient";
import ceabClients from "./APIClients/CeabClient";

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
  const [pastCourses, setPastCourses] = useState({});
  const [ceabOnSchedule, setCeabOnSchedule] = useState({});
  const [ceabCounts, setCeabCounts] = useState({});
  const [scheduleId, setScheduleId] = useState("");

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
    const scheduleId = localStorage.getItem("scheduleId");
    const parsedId = scheduleId ? JSON.parse(scheduleId) : null;
    setScheduleId(parsedId);
    const lsToken = localStorage.getItem("token");
    if (!lsToken) return;
    // refresh the token
    const oldToken = JSON.parse(lsToken);
    userClient.refresh(oldToken.refresh_token).then((value: any) => {
      setToken(value);
    });
  }, []);

  useEffect(() => {
    const lsScheduleId = localStorage.getItem("scheduleId");

    if (token) {
      localStorage.setItem("token", JSON.stringify(token));
      courseClients.getScheduleId(token.id_token).then((value: any) => {
        setScheduleId(value.schedule_id);
        localStorage.setItem("scheduleId", JSON.stringify(value.schedule_id));
      });
      ceabClients.getCeabByUser(token?.id_token || "").then((value: any) => {
        if (value.length !== 0) {
          setCeabCounts(value);
        }
      });
      courseClients.getPastCourses(token?.id_token || "").then((value: any) => {
        if (value.length !== 0) {
          setPastCourses(value);
        }
      });
    } else if (lsScheduleId && lsScheduleId !== "null") {
      const scheduleId = JSON.parse(lsScheduleId);
      setScheduleId(scheduleId);
    } else {
      courseClients.createSchedule().then((value: any) => {
        setScheduleId(value.schedule_id);
        localStorage.setItem("scheduleId", JSON.stringify(value.schedule_id));
      });
    }
  }, [token]);

  useEffect(() => {
    if (scheduleId) {
      courseClients.getCoursesByScheduleId(scheduleId).then((value: any) => {
        if (value.length !== 0) {
          setCoursesOnSchedule(value);
        }
      });
      ceabClients.getCeabBySchedule(scheduleId).then((value: any) => {
        if (value.length !== 0) {
          setCeabOnSchedule(value);
        }
      });
    }
  }, [scheduleId]);

  return (
    <Box>
      <Navbar token={token} setToken={setToken} setScheduleId={setScheduleId} />

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
                  tokenId={token?.id_token || null}
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
              tokenId={token?.id_token || null}
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
                  ceabOnSchedule={ceabOnSchedule}
                  ceabCounts={ceabCounts}
                  tokenId={token?.id_token || null}
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
