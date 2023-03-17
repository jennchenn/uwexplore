import moment from "moment";
import {
  Card,
  CardContent,
  Collapse,
  IconButton,
  Stack,
  Table,
  TableContainer,
  TableHead,
  TableBody,
  TableRow,
  Tooltip,
  TableCell,
  Paper,
  tableCellClasses,
  styled,
  FormControlLabel,
  Checkbox,
  Modal,
  Box,
  InputLabel,
  MenuItem,
  Select,
  FormControl,
  SelectChangeEvent,
  FormHelperText,
} from "@mui/material";
import PerfectScrollbar from "react-perfect-scrollbar";
import "../styles/CourseCard.css";

//MUI icon imports
import AddCircleIcon from "@mui/icons-material/AddCircle";
import RemoveCircleOutlinedIcon from "@mui/icons-material/RemoveCircleOutlined";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import { Props } from "../App";
import { CourseObject } from "../APIClients/CourseClient";
import { useEffect, useState } from "react";
import CustomButton from "./CustomButton";

interface CourseCardProps extends Props {
  course: CourseObject;
  pastCourses: { [term: string]: string[] };
  setPastCourses: (value: { [term: string]: string[] }) => void;
  expandedCard: string;
  setExpandedCard: (value: string) => void;
  bookmarkedCourses: Record<string, any>;
  setBookmarkedCourses: (value: any) => void;
  setCourseHovered?: any;
  type?: "search" | "added";
}

export default function CourseCard({
  type = "search",
  ...CourseCardProps
}: CourseCardProps) {
  const [isPastCourse, setIsPastCourse] = useState(false);
  const [openTermSelect, setOpenTermSelect] = useState(false);
  const [term, setTerm] = useState("");
  const [showSelectError, setShowSelectError] = useState(false);

  const handleTermChange = (event: SelectChangeEvent) => {
    if (event.target.value) {
      setShowSelectError(false);
      setTerm(event.target.value);
    }
  };

  useEffect(() => {
    for (let term in CourseCardProps.pastCourses) {
      if (
        CourseCardProps.pastCourses[term].includes(
          `${CourseCardProps.course.department} ${CourseCardProps.course.code}`,
        )
      ) {
        setIsPastCourse(true);
        return;
      }
    }
    setIsPastCourse(false);
    // eslint-disable-next-line
  }, []);

  // styles for table cells, format taken from MUI docs
  const StyledTableCell: any = styled(TableCell)(() => ({
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

  // currently only allowing one card to be expanded at a time
  const handleExpandClick = (courseToExpand: any) => {
    if (CourseCardProps.expandedCard === courseToExpand.id) {
      CourseCardProps.setExpandedCard("");
    } else {
      CourseCardProps.setExpandedCard(courseToExpand.id);
    }
  };

  const handleBookmarkClick = (courseToBookmark: any) => {
    if (courseToBookmark.id in CourseCardProps.bookmarkedCourses) {
      const newBookmarks = { ...CourseCardProps.bookmarkedCourses };
      delete newBookmarks[courseToBookmark.id];
      CourseCardProps.setBookmarkedCourses(newBookmarks);
    } else {
      CourseCardProps.setBookmarkedCourses({
        ...CourseCardProps.bookmarkedCourses,
        [courseToBookmark.id]: courseToBookmark,
      });
    }
  };

  const getRevisedPastCourses = (term: string, courseCode: string) => {
    let revisedObject = CourseCardProps.pastCourses;
    let revisedArray = revisedObject[term];
    if (revisedArray.includes(courseCode)) {
      revisedArray = revisedArray.filter((obj) => obj !== courseCode);
    } else {
      revisedArray.push(courseCode);
    }
    revisedObject[term] = revisedArray;
    return revisedObject;
  };

  const handleClose = () => {
    // if (selectedTerm !== " ") {
    //   clients
    //     .updateCourseColorByScheduleId(scheduleId, modalClass.uid, selectedTerm)
    //     .then((value: any) => {
    //       setCoursesOnSchedule(value);
    //     })
    //     .then(() => {
    //       setSelectedTerm(" ");
    //     });
    // }
    setShowSelectError(false);
    setOpenTermSelect(false);
  };

  return (
    <>
      <Card
        className={`course-card-container ${CourseCardProps.className}`}
        style={CourseCardProps.style}
        elevation={2}
        key={CourseCardProps.course.id}
        sx={{
          "& .MuiCardContent-root": {
            padding: "2px",
            paddingBottom: "28px",
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
                CourseCardProps.course.id in CourseCardProps.bookmarkedCourses
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
                onClick={() => handleBookmarkClick(CourseCardProps.course)}
              >
                {CourseCardProps.course.id in
                CourseCardProps.bookmarkedCourses ? (
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
              {CourseCardProps.course.department}&nbsp;
              {CourseCardProps.course.code} - {CourseCardProps.course.name}
            </h3>
            <Tooltip
              title={`${type === "added" ? "Delete" : "Add"} Course ${
                type === "added" ? "from" : "to"
              } Calendar`}
              arrow
            >
              <IconButton
                // show ghost course on cal on hover
                onMouseOver={() => {
                  CourseCardProps.setCourseHovered(CourseCardProps.course);
                }}
                onMouseLeave={() => {
                  CourseCardProps.setCourseHovered({});
                }}
                sx={{ marginLeft: "auto", marginRight: "0px", padding: "4px" }}
              >
                {type === "search" ? (
                  <AddCircleIcon
                    sx={{
                      color: "var(--main-purple-1)",
                      fontSize: "28px",
                    }}
                  />
                ) : (
                  <RemoveCircleOutlinedIcon
                    sx={{
                      color: "var(--alerts-warning-1)",
                      fontSize: "28px",
                    }}
                  />
                )}
              </IconButton>
            </Tooltip>
            <IconButton
              aria-label="expand more"
              onClick={() => handleExpandClick(CourseCardProps.course)}
              sx={{ padding: "6px", marginRight: "6px" }}
            >
              {CourseCardProps.expandedCard === CourseCardProps.course.id ? (
                <ExpandLessIcon sx={{ color: "var(--main-purple-1)" }} />
              ) : (
                <ExpandMoreIcon sx={{ color: "var(--main-purple-1)" }} />
              )}
            </IconButton>
          </Stack>
          {/* BODY CONTENT (EXPANDED INFO) */}
          <Collapse
            in={
              CourseCardProps.expandedCard === CourseCardProps.course.id
                ? true
                : false
            }
            sx={{ margin: "0px 10px" }}
          >
            <h5
              style={{
                margin: "0px 6px",
                fontWeight: "var(--font-weight-regular)",
              }}
            >
              <em>{CourseCardProps.course.name}</em>
            </h5>
            <h5 style={{ margin: "10px 6px 16px" }}>
              {CourseCardProps.course.description}
            </h5>
            {/* COURSE INFO TABLE */}
            <TableContainer
              component={Paper}
              sx={{
                marginBottom: "10px",
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
                      {CourseCardProps.course.sections.map((section: any) => {
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
                            <StyledTableCell>
                              {section.location}
                            </StyledTableCell>
                            <StyledTableCell>
                              {section.instructor}
                            </StyledTableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </PerfectScrollbar>
              </div>
            </TableContainer>

            {/* todo: add prereq and antireq info */}
            <FormControlLabel
              className="past-course-check"
              control={
                <Checkbox
                  checked={isPastCourse}
                  onChange={(e: any) => {
                    if (isPastCourse) setIsPastCourse(false);
                    setOpenTermSelect(e.target.checked);
                  }}
                />
              }
              label={
                <div className="past-course-checkbox-text">
                  I have completed this course
                </div>
              }
            />
          </Collapse>
        </CardContent>
      </Card>
      <Modal
        open={openTermSelect}
        onClose={handleClose}
        aria-labelledby="past-modal-title"
        aria-describedby="past-modal-description"
      >
        <Box className="modal-style">
          <h4 className="past-modal-info">
            When did you complete this course?
          </h4>
          <FormControl className="term-select-root">
            <InputLabel className="term-select-label heading-5">
              SELECT TERM
            </InputLabel>
            <Select
              className="term-select"
              value={term}
              onChange={handleTermChange}
              required
              label="SELECT TERM"
            >
              <MenuItem value="term_1a">1A</MenuItem>
              <MenuItem value="term_1b">1B</MenuItem>
              <MenuItem value="term_2a">2A</MenuItem>
              <MenuItem value="term_2b">2B</MenuItem>
              <MenuItem value="term_3a">3A</MenuItem>
              <MenuItem value="term_3b">3B</MenuItem>
              <MenuItem value="term_4a">4A</MenuItem>
              <MenuItem value="term_4b">4B</MenuItem>
              <MenuItem value="term_other">Other</MenuItem>
            </Select>
            {showSelectError && (
              <FormHelperText className="select-error-message">
                Please select a term
              </FormHelperText>
            )}
          </FormControl>
          <div className="modal-past-term-button-container">
            <CustomButton
              className="modal-past-term-confirm-button"
              text="confirm"
              type="primary"
              onClick={() => {
                if (!term) {
                  setShowSelectError(true);
                } else {
                  CourseCardProps.setPastCourses(
                    getRevisedPastCourses(
                      term,
                      `${CourseCardProps.course.full_code}`,
                    ),
                  );
                  setIsPastCourse(true);
                  handleClose();
                }
              }}
            />
            <CustomButton
              className="modal-past-term-cancel-button"
              text="cancel"
              type="secondary"
              onClick={handleClose}
            />
          </div>
        </Box>
      </Modal>
    </>
  );
}
