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
import SearchDeleteModal from "./SearchDeleteModal";

interface CalendarTrayProps extends Props {
  setCourseHovered: any;
  handleCeabPlanChange: any;
  pastCourses: { [key: string]: string[] };
  setPastCourses: (value: { [term: string]: string[] }) => void;
  addedCourses: CourseObject[];
  setAddedCourses: (value: any) => void;
  scheduleId: string;
  tokenId: string | null;
  showCourseDeletedSnack: (open: boolean) => void;
}

export default function CalendarTray({
  addedCourses = [],
  tokenId = "",
  ...CalendarTrayProps
}: CalendarTrayProps) {
  const [expanded, setExpanded] = useState(false);
  const [expandedCard, setExpandedCard] = useState("");
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [courseToDelete, setCourseToDelete] = useState({} as any);

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
            <div className="calendar-tray-heading heading-2">Added Courses</div>
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
            <Stack className="tray-contents" spacing={1}>
              {addedCourses.map((course, index) => (
                <CourseCard
                  key={`calendar-tray-course-card-${index}`}
                  course={course}
                  expandedCard={expandedCard}
                  setExpandedCard={setExpandedCard}
                  setCourseHovered={CalendarTrayProps.setCourseHovered}
                  pastCourses={CalendarTrayProps.pastCourses}
                  setPastCourses={CalendarTrayProps.setPastCourses}
                  handleCeabPlanChange={CalendarTrayProps.handleCeabPlanChange}
                  setDeleteModalOpen={setDeleteModalOpen}
                  coursesOnSchedule={addedCourses}
                  setCoursesOnSchedule={CalendarTrayProps.setAddedCourses}
                  setCourseToDelete={setCourseToDelete}
                  scheduleId={CalendarTrayProps.scheduleId}
                  type="added"
                  tokenId={tokenId}
                />
              ))}
              {!addedCourses.length && (
                <Card className="empty-tray-card heading-2">
                  Added courses will appear here!
                </Card>
              )}
            </Stack>
          </Collapse>
        </CardContent>
      </Card>
      <SearchDeleteModal
        courseToDelete={courseToDelete}
        setCourseToDelete={setCourseToDelete}
        setCoursesOnSchedule={CalendarTrayProps.setAddedCourses}
        deleteModalOpen={deleteModalOpen}
        setDeleteModalOpen={setDeleteModalOpen}
        scheduleId={CalendarTrayProps.scheduleId}
        showCourseDeletedSnack={CalendarTrayProps.showCourseDeletedSnack}
      />
    </Grid>
  );
}
