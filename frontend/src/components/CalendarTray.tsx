import { useState } from "react";

import "../styles/CalendarTray.css";

import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Grid from "@mui/material/Unstable_Grid2";
import Collapse from "@mui/material/Collapse";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";

import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import CourseCard from "./CourseCard";
import { CourseObject } from "../APIClients/CourseClient";
import { Props } from "../App";

import PerfectScrollbar from "react-perfect-scrollbar";
import { UserObject } from "../APIClients/UserClient";

const course: CourseObject = {
  id: "id",
  full_code: "full",
  requisites: "res",
  ceab_eng_design: 3,
  ceab_eng_sci: 4,
  ceab_math: 5,
  ceab_sci: 6,
  code: "code",
  course_id: "course id",
  cse_weight: 7,
  department: "department",
  description_abbreviated: "description abbreviated",
  description: "description",
  name: "name",
  sections: [{ day: ["TH", "M"], type: "sfdjk" }],
  tags: ["10", "11"],
};

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
    term_4a: ["syde 123", "syde 321"],
    term_4b: [],
    term_other: [],
  },
};

interface CalendarTrayProps extends Props {
  setCourseHovered: any;
  addedCourses?: CourseObject[];
}

export default function CalendarTrayCalendar({
  addedCourses = [],
  ...CalendarTrayProps
}: CalendarTrayProps) {
  const [pastCourses, setPastCourses] = useState(user.past_courses);

  const [expanded, setExpanded] = useState(false);
  const [expandedCard, setExpandedCard] = useState("");
  const [bookmarkedCourses, setBookmarkedCourses] = useState<
    Record<string, any>
  >({});

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  return (
    <Grid
      xs={5}
      className={CalendarTrayProps.className}
      style={CalendarTrayProps.style}
    >
      <Card className="retractable-tray">
        <CardContent sx={{ marginBottom: "-16px" }}>
          <Stack
            className="heading-background"
            direction="row"
            onClick={() => handleExpandClick()}
          >
            <div className="calendar-tray-heading heading-1">Added Courses</div>
            <Box>
              <IconButton
                aria-label="expand more"
                onClick={() => handleExpandClick()}
              >
                {expanded ? (
                  <ExpandMoreIcon className="expand-more-icon" />
                ) : (
                  <ExpandLessIcon className="expand-less-icon" />
                )}
              </IconButton>
            </Box>
          </Stack>
          <Collapse in={expanded} className="tray-contents-container">
            <PerfectScrollbar>
              <Stack className="tray-contents" spacing={1}>
                {/* {addedCourses.map(key)} */}
                <CourseCard
                  course={course}
                  expandedCard={expandedCard}
                  bookmarkedCourses={bookmarkedCourses}
                  setExpandedCard={setExpandedCard}
                  setBookmarkedCourses={setBookmarkedCourses}
                  setCourseHovered={CalendarTrayProps.setCourseHovered}
                  pastCourses={pastCourses}
                  setPastCourses={setPastCourses}
                  type="added"
                />
                <CourseCard
                  course={course}
                  expandedCard={expandedCard}
                  bookmarkedCourses={bookmarkedCourses}
                  setExpandedCard={setExpandedCard}
                  setBookmarkedCourses={setBookmarkedCourses}
                  setCourseHovered={CalendarTrayProps.setCourseHovered}
                  pastCourses={pastCourses}
                  setPastCourses={setPastCourses}
                  type="added"
                />
                <CourseCard
                  course={course}
                  expandedCard={expandedCard}
                  bookmarkedCourses={bookmarkedCourses}
                  setExpandedCard={setExpandedCard}
                  setBookmarkedCourses={setBookmarkedCourses}
                  setCourseHovered={CalendarTrayProps.setCourseHovered}
                  pastCourses={pastCourses}
                  setPastCourses={setPastCourses}
                  type="added"
                />
                <CourseCard
                  course={course}
                  expandedCard={expandedCard}
                  bookmarkedCourses={bookmarkedCourses}
                  setExpandedCard={setExpandedCard}
                  setBookmarkedCourses={setBookmarkedCourses}
                  setCourseHovered={CalendarTrayProps.setCourseHovered}
                  pastCourses={pastCourses}
                  setPastCourses={setPastCourses}
                  type="added"
                />
                <CourseCard
                  course={course}
                  expandedCard={expandedCard}
                  bookmarkedCourses={bookmarkedCourses}
                  setExpandedCard={setExpandedCard}
                  setBookmarkedCourses={setBookmarkedCourses}
                  setCourseHovered={CalendarTrayProps.setCourseHovered}
                  pastCourses={pastCourses}
                  setPastCourses={setPastCourses}
                  type="added"
                />
                <CourseCard
                  course={course}
                  expandedCard={expandedCard}
                  bookmarkedCourses={bookmarkedCourses}
                  setExpandedCard={setExpandedCard}
                  setBookmarkedCourses={setBookmarkedCourses}
                  setCourseHovered={CalendarTrayProps.setCourseHovered}
                  pastCourses={pastCourses}
                  setPastCourses={setPastCourses}
                  type="added"
                />
              </Stack>
            </PerfectScrollbar>
          </Collapse>
        </CardContent>
      </Card>
    </Grid>
  );
}
