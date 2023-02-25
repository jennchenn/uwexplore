import { useState } from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import courses from "../APIClients/courses.js";
import IconButton from "@mui/material/IconButton";
import moment from "moment";
import Collapse from "@mui/material/Collapse";
import Tooltip from "@mui/material/Tooltip";

import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

import AddCircleIcon from "@mui/icons-material/AddCircle";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
// import StarBorderIcon from "@mui/icons-material/StarBorder";
// import StarIcon from "@mui/icons-material/Star";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import BookmarkIcon from "@mui/icons-material/Bookmark";
// TODO: add button, figure out how to pin :(

const StyledTableCell = styled(TableCell)(({ theme }) => ({
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

  return (
    <Box>
      {courses.map((course, i) => (
        <Card style={{ marginTop: "20px" }} elevation={2} key={i}>
          <CardContent>
            <Stack
              direction="row"
              style={{
                display: "flex",
                alignItems: "center",
                flexWrap: "wrap",
              }}
            >
              <Tooltip title="Pin Course to Search Results" arrow>
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
              <Typography variant="h6">{course.name}</Typography>
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
            <Collapse in={expandedCard === course.id ? true : false}>
              <Typography variant="body2">
                {course.department} {course.code} - {course.description}
              </Typography>
              <br />
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
                    {course.sections.map((section) => {
                      let days = "";
                      for (let i = 0; i < section.day.length; i++) {
                        if (section.day[i].slice(0, 1) == "T") {
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
                            {moment
                              .utc()
                              .startOf("day")
                              .add(section.start_time, "minutes")
                              .format("hh:mm A")}
                            {" - "}
                            {moment
                              .utc()
                              .startOf("day")
                              .add(section.end_time, "minutes")
                              .format("hh:mm A")}
                          </StyledTableCell>
                          <StyledTableCell>{days}</StyledTableCell>
                          <StyledTableCell>{section.location}</StyledTableCell>
                          <StyledTableCell>N/A</StyledTableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
            </Collapse>
          </CardContent>
        </Card>
      ))}
    </Box>
  );
}
