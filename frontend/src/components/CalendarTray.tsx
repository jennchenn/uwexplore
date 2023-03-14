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

interface CalendarTrayProps extends Props {
  setCourseHovered: any;
}

export default function CalendarTrayCalendar({
  ...CalendarTrayProps
}: CalendarTrayProps) {
  const [expanded, setExpanded] = useState(false);
  const [expandedCard, setExpandedCard] = useState("");
  const [bookmarkedCourses, setBookmarkedCourses] = useState<
    Record<string, any>
  >({});

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const course: CourseObject = {
    id: "id",
    antirequisites: ["1", "2"],
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
    prerequisites: ["8", "9"],
    sections: [{ day: ["TH", "M"], type: "sfdjk" }],
    tags: ["10", "11"],
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
          <Collapse in={expanded}>
            <Stack className="tray-contents" spacing={1}>
              <CourseCard
                course={course}
                expandedCard={expandedCard}
                bookmarkedCourses={bookmarkedCourses}
                setExpandedCard={setExpandedCard}
                setBookmarkedCourses={setBookmarkedCourses}
                setCourseHovered={CalendarTrayProps.setCourseHovered}
                type="added"
              />
              <CourseCard
                course={course}
                expandedCard={expandedCard}
                bookmarkedCourses={bookmarkedCourses}
                setExpandedCard={setExpandedCard}
                setBookmarkedCourses={setBookmarkedCourses}
                setCourseHovered={CalendarTrayProps.setCourseHovered}
                type="added"
              />
            </Stack>
          </Collapse>
        </CardContent>
      </Card>
    </Grid>
  );
}
