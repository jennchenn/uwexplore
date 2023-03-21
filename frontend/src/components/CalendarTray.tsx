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

interface CalendarTrayProps extends Props {
  setCourseHovered: any;
  handleCeabPlanChange: any;
  pastCourses: { [key: string]: string[] };
  setPastCourses: (value: { [term: string]: string[] }) => void;
  addedCourses?: CourseObject[];
}

export default function CalendarTrayCalendar({
  addedCourses = [],
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
                {addedCourses.map((course, index) => (
                  <CourseCard
                    key={`calendar-tray-cards-${index}`}
                    course={course}
                    expandedCard={expandedCard}
                    bookmarkedCourses={bookmarkedCourses}
                    setExpandedCard={setExpandedCard}
                    setBookmarkedCourses={setBookmarkedCourses}
                    setCourseHovered={CalendarTrayProps.setCourseHovered}
                    pastCourses={CalendarTrayProps.pastCourses}
                    setPastCourses={CalendarTrayProps.setPastCourses}
                    handleCeabPlanChange={
                      CalendarTrayProps.handleCeabPlanChange
                    }
                    type="added"
                  />
                ))}
                {!addedCourses.length && (
                  <Card className="empty-tray-card heading-2">
                    Added courses will appear here!
                  </Card>
                )}
              </Stack>
            </PerfectScrollbar>
          </Collapse>
        </CardContent>
      </Card>
    </Grid>
  );
}
