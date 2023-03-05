import { useState } from "react";
import courses from "../APIClients/courses.js";
import moment from "moment";

// MUI component imports
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Collapse from "@mui/material/Collapse";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";

// MUI table imports
import Paper from "@mui/material/Paper";
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";

//MUI icon imports
import AddCircleIcon from "@mui/icons-material/AddCircle";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

// styles for table cells, format taken from MUI docs
const StyledTableCell = styled(TableCell)(() => ({
  [`&.${tableCellClasses.head}`]: {
    fontSize: 12,
    padding: "2px",
    fontWeight: "bold",
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: "0.8rem",
    padding: "2px",
  },
}));

export default function SearchCards() {
  const [expandedCard, setExpandedCard] = useState("");
  const [bookmarkedCourses, setBookmarkedCourses] = useState<
    Record<string, any>
  >({});

  // currently only allowing one card to be expanded at a time
  const handleExpandClick = (courseToExpand: any) => {
    if (expandedCard === courseToExpand.id) {
      setExpandedCard("");
    } else {
      setExpandedCard(courseToExpand.id);
    }
  };

  const handleBookmarkClick = (courseToBookmark: any) => {
    if (courseToBookmark.id in bookmarkedCourses) {
      const newBookmarks = { ...bookmarkedCourses };
      delete newBookmarks[courseToBookmark.id];
      setBookmarkedCourses(newBookmarks);
    } else {
      setBookmarkedCourses({
        ...bookmarkedCourses,
        [courseToBookmark.id]: courseToBookmark,
      });
    }
  };

  const renderBookmarkedCourses = () => {
    if (Object.keys(bookmarkedCourses).length !== 0) {
      return (
        <div>
          <Typography>Saved Courses</Typography>
          <>
            {Object.values(bookmarkedCourses).map((course, i) => {
              return createCourseCard(course, i);
            })}
          </>
        </div>
      );
    } else {
      return false;
    }
  };

  const createCourseCard = (course: any, i: number) => {
    return (
      <Card style={{ marginTop: "20px" }} elevation={2} key={i}>
        <CardContent>
          {/* TOP BAR (CONDENSED INFO) */}
          <Stack
            direction="row"
            style={{
              display: "flex",
              alignItems: "center",
              flexWrap: "wrap",
            }}
          >
            <Tooltip
              title={
                course.id in bookmarkedCourses
                  ? "Unpin Course"
                  : "Pin Course to Search Results"
              }
              enterNextDelay={1000}
              arrow
            >
              <IconButton
                aria-label="expand more"
                style={{
                  padding: "0px",
                  margin: "0px 8px 0px 0px",
                }}
                onClick={() => handleBookmarkClick(course)}
              >
                {course.id in bookmarkedCourses ? (
                  <BookmarkIcon />
                ) : (
                  <BookmarkBorderIcon />
                )}
              </IconButton>
            </Tooltip>
            {/* todo: conditional styling for very long course names ex. CS 146*/}
            <Typography variant="subtitle1" style={{ fontWeight: "bold" }}>
              {course.department}
              {course.code} - {course.name}
            </Typography>
            <div style={{ marginLeft: "auto", marginRight: "0px" }}>
              <Tooltip title="Add Course to Calendar" arrow>
                <IconButton aria-label="add course">
                  <AddCircleIcon />
                </IconButton>
              </Tooltip>
              <IconButton
                aria-label="expand more"
                onClick={() => handleExpandClick(course)}
              >
                {expandedCard === course.id ? (
                  <ExpandLessIcon />
                ) : (
                  <ExpandMoreIcon />
                )}
              </IconButton>
            </div>
          </Stack>
          {/* BODY CONTENT (EXPANDED INFO) */}
          <Collapse in={expandedCard === course.id ? true : false}>
            <Typography variant="body2">{course.description}</Typography>
            <br />
            {/* COURSE INFO TABLE */}
            <TableContainer component={Paper}>
              <Table aria-label="simple table" size="small">
                <TableHead>
                  <TableRow>
                    <StyledTableCell>Section</StyledTableCell>
                    <StyledTableCell>Class</StyledTableCell>
                    <StyledTableCell>Enrolled</StyledTableCell>
                    <StyledTableCell>Time</StyledTableCell>
                    <StyledTableCell>Date</StyledTableCell>
                    <StyledTableCell>Location</StyledTableCell>
                    <StyledTableCell>Instructor</StyledTableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {course.sections.map((section: any) => {
                    // Format days of the week courses are held (TUESDAY, THURSDAY, FRIDAY -> T, TH, F)
                    let days = "";
                    for (let i = 0; i < section.day.length; i++) {
                      if (section.day[i].slice(0, 2) === "TH") {
                        days = days.concat(section.day[i].slice(0, 2));
                      } else {
                        days = days.concat(section.day[i].slice(0, 1));
                      }
                      if (i < section.day.length - 1) {
                        days = days.concat(", ");
                      }
                    }
                    return (
                      <TableRow
                        key={section.class_number}
                        sx={{
                          "&:last-child td, &:last-child th": { border: 0 },
                        }}
                      >
                        <StyledTableCell component="th" scope="row">
                          {section.type.slice(0, 3)} {section.number}
                        </StyledTableCell>
                        <StyledTableCell>
                          {section.class_number}
                        </StyledTableCell>
                        <StyledTableCell>
                          {section.enrolled_number}/{section.capacity}
                        </StyledTableCell>
                        <StyledTableCell>
                          {moment()
                            .startOf("day")
                            .add(section.start_time, "milliseconds")
                            .format("hh:mm A")}
                          {" - "}
                          {moment()
                            .startOf("day")
                            .add(section.end_time, "milliseconds")
                            .format("hh:mm A")}
                        </StyledTableCell>
                        <StyledTableCell>{days}</StyledTableCell>
                        <StyledTableCell>{section.location}</StyledTableCell>
                        {/* todo: add instructor info */}
                        <StyledTableCell>N/A</StyledTableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
            {/* todo: add prereq and antireq info */}
          </Collapse>
        </CardContent>
      </Card>
    );
  };

  return (
    <Box>
      {/* todo: clean up styles */}
      {/* todo: proper call to get courses */}
      {renderBookmarkedCourses()}
      <Typography>Search Results</Typography>
      {courses
        .filter((course) => (course.id in bookmarkedCourses ? false : true))
        .map((course, i) => createCourseCard(course, i))}
    </Box>
  );
}
