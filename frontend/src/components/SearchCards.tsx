import { useState } from "react";
import moment from "moment";
import PerfectScrollbar from "react-perfect-scrollbar";
import { CourseObject } from "../APIClients/CourseClient";

// MUI component imports
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CircularProgress from "@mui/material/CircularProgress";
import Collapse from "@mui/material/Collapse";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import Tooltip from "@mui/material/Tooltip";

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
    fontSize: "0.8rem",
    padding: "6px",
    fontWeight: "bold",
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: "0.8rem",
    padding: "6px",
    overflow: "hidden",
    textOverflow: "ellipses",
    whiteSpace: "nowrap",
  },
}));

interface searchProps {
  resultsLoading: boolean;
  searchResults: CourseObject[];
  searchQuery: string;
  setCourseHovered: any;
}

export default function SearchCards({
  resultsLoading,
  searchResults,
  searchQuery,
  setCourseHovered,
}: searchProps) {
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

  const renderSearchResultsFoundMessage = () => {
    if (!resultsLoading) {
      let message = `${searchResults.length} Search results found for "${searchQuery}"`;
      if (searchQuery === "") {
        // todo: change this message?
        message = "Search Results";
      }
      return (
        <h4
          style={{
            color: "var(--black-3)",
            margin: "0px",
          }}
        >
          {message}
        </h4>
      );
    }
  };

  const renderResultsDisplayedCard = () => {
    const message0 = `Searched courses will appear here!`;
    const message30 = `30 search results displayed. Didn’t find the course you were
   looking for? Be more specific or apply some filters!`;

    if (searchResults.length === 30 || searchResults.length === 0) {
      return (
        <Paper
          elevation={0}
          sx={{
            backgroundColor: "var(--bg-3)",
            padding: "24px",
            borderRadius: "var(--border-radius)",
            textAlign: "center",
            margin: "24px 0px",
          }}
        >
          <h5 style={{ margin: "0px", color: "var(--black-4)" }}>
            <em>{searchResults.length === 0 ? message0 : message30}</em>
          </h5>
        </Paper>
      );
    }
  };

  const renderRequisiteInfo = (course: any) => {
    const prereqLength = course.prerequisites.length;
    const antireqLength = course.antirequisites.length;

    const prereqMsg = `Prerequisites: ${course.prerequisites.join(", ")}`;
    const antireqMsg = `Antirequisites: ${course.antirequisites.join(", ")}`;

    if (prereqLength === 0 && antireqLength === 0) {
      return <></>;
    } else if (prereqLength === 0 || antireqLength === 0) {
      let message = prereqMsg;
      if (antireqLength > 0) {
        let message = antireqMsg;
      }
      return (
        <h5 style={{ margin: "0px 6px 16px" }}>
          <em>{message}</em>
        </h5>
      );
    } else {
      return (
        <div>
          <h5 style={{ margin: "0px 6px 6px" }}>
            <em>{prereqMsg}</em>
          </h5>
          <h5 style={{ margin: "0px 6px 16px" }}>
            <em>{antireqMsg}</em>
          </h5>
        </div>
      );
    }
  };

  const renderBookmarkedCourses = () => {
    if (Object.keys(bookmarkedCourses).length !== 0) {
      return (
        <>
          <h4
            style={{
              color: "var(--black-3)",
              margin: "0px",
            }}
          >
            Saved Courses
          </h4>
          <>
            {Object.values(bookmarkedCourses).map((course, i) => {
              return createCourseCard(course);
            })}
          </>
          <br />
        </>
      );
    } else {
      return false;
    }
  };

  const createCourseCard = (course: any) => {
    return (
      <Card
        style={{ marginTop: "16px" }}
        elevation={2}
        key={course.id}
        sx={{
          "& .MuiCardContent-root": {
            padding: "2px",
          },
          borderRadius: "var(--border-radius)",
          backgroundColor: "var(--bg-3)",
          "& :last-child": {
            padding: "0px !important",
          },
        }}
      >
        <CardContent>
          {/* TOP BAR (CONDENSED INFO) */}
          <Stack
            direction="row"
            style={{
              display: "flex",
              alignItems: "center",
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
                  margin: "0px 6px",
                }}
                onClick={() => handleBookmarkClick(course)}
              >
                {course.id in bookmarkedCourses ? (
                  <BookmarkIcon sx={{ color: "var(--main-purple-1)" }} />
                ) : (
                  <BookmarkBorderIcon sx={{ color: "var(--main-purple-4)" }} />
                )}
              </IconButton>
            </Tooltip>
            <h3
              style={{
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {course.department}&nbsp;
              {course.code} - {course.name}
            </h3>
            <Tooltip title="Add Course to Calendar" arrow>
              <IconButton
                aria-label="add course"
                // show ghost course on cal on hover
                onMouseOver={() => {
                  setCourseHovered(course);
                }}
                onMouseLeave={() => {
                  setCourseHovered({});
                }}
                sx={{ marginLeft: "auto", marginRight: "0px", padding: "4px" }}
              >
                <AddCircleIcon
                  sx={{
                    color: "var(--main-purple-1)",
                    fontSize: "28px",
                  }}
                />
              </IconButton>
            </Tooltip>
            <IconButton
              aria-label="expand more"
              onClick={() => handleExpandClick(course)}
              sx={{ padding: "6px", marginRight: "6px" }}
            >
              {expandedCard === course.id ? (
                <ExpandLessIcon sx={{ color: "var(--main-purple-1)" }} />
              ) : (
                <ExpandMoreIcon sx={{ color: "var(--main-purple-1)" }} />
              )}
            </IconButton>
          </Stack>
          {/* BODY CONTENT (EXPANDED INFO) */}
          <Collapse
            in={expandedCard === course.id ? true : false}
            sx={{ margin: "0px 10px" }}
          >
            <h5
              style={{
                margin: "0px 6px",
                fontWeight: "var(--font-weight-regular)",
              }}
            >
              <em>{course.name}</em>
            </h5>
            <h5 style={{ margin: "10px 6px 16px" }}>{course.description}</h5>
            {/* COURSE INFO TABLE */}
            <TableContainer
              component={Paper}
              sx={{
                marginBottom: "16px",
                borderRadius: "var(--border-radius)",
              }}
            >
              <div
                style={{
                  width: "inherit",
                  overflow: "hidden",
                }}
              >
                <PerfectScrollbar>
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
                      {course.sections.length === 0 ? (
                        <TableRow
                          sx={{
                            "&:last-child td, &:last-child th": {
                              border: 0,
                            },
                          }}
                        >
                          <StyledTableCell
                            component="th"
                            scope="row"
                            colSpan={7}
                            align="center"
                          >
                            Information is not available for this class
                          </StyledTableCell>
                        </TableRow>
                      ) : (
                        course.sections.map((section: any) => {
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
                              key={section.id}
                              sx={{
                                "&:last-child td, &:last-child th": {
                                  border: 0,
                                },
                              }}
                            >
                              <StyledTableCell component="th" scope="row">
                                {section.type} {section.number}
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
                              <StyledTableCell>
                                {section.location}
                              </StyledTableCell>
                              <StyledTableCell>
                                {section.instructor}
                              </StyledTableCell>
                            </TableRow>
                          );
                        })
                      )}
                    </TableBody>
                  </Table>
                </PerfectScrollbar>
              </div>
            </TableContainer>
            {renderRequisiteInfo(course)}
          </Collapse>
        </CardContent>
      </Card>
    );
  };

  return (
    <Box>
      {/* todo: clean up styles */}
      {renderBookmarkedCourses()}
      {renderSearchResultsFoundMessage()}
      {resultsLoading ? (
        <CircularProgress size={30} sx={{ color: "var(--main-purple-2)" }} />
      ) : (
        <></>
      )}
      {searchResults
        .filter((course) => (course.id in bookmarkedCourses ? false : true))
        .map((course, i) => createCourseCard(course))}
      {renderResultsDisplayedCard()}
    </Box>
  );
}
