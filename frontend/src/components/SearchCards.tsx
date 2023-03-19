import { useState, useCallback } from "react";
import moment from "moment";
import PerfectScrollbar from "react-perfect-scrollbar";
import clients, { CourseObject } from "../APIClients/CourseClient";

// MUI component imports
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CircularProgress from "@mui/material/CircularProgress";
import Collapse from "@mui/material/Collapse";
import FormControl from "@mui/material/FormControl";
import IconButton from "@mui/material/IconButton";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Portal from "@mui/material/Portal";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import Stack from "@mui/material/Stack";
import Snackbar from "@mui/material/Snackbar";
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
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
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
  coursesOnSchedule: any;
  setCoursesOnSchedule: any;
  scheduleId: string;
}

export default function SearchCards({
  resultsLoading,
  searchResults,
  searchQuery,
  setCourseHovered,
  coursesOnSchedule,
  setCoursesOnSchedule,
  scheduleId,
}: searchProps) {
  const [expandedCard, setExpandedCard] = useState("");
  const [bookmarkedCourses, setBookmarkedCourses] = useState<
    Record<string, any>
  >({});
  const [courseAddedSnack, showCourseAddedSnack] = useState(false);

  const [sectionsToAdd, setSectionsToAdd] = useState({} as any);
  const [coursesForCall, setCoursesForCall] = useState([] as any);

  const handleClose = () => {
    showCourseAddedSnack(false);
  };

  const handleSectionChange = (
    event: SelectChangeEvent,
    type: string,
    sectionsByTypeAndNumber: any,
  ) => {
    setSectionsToAdd({ ...sectionsToAdd, [type]: event.target.value });

    const classIds: any = [];
    const extractIdsArray = sectionsByTypeAndNumber[type][event.target.value];
    for (let i = 0; i < extractIdsArray.length; i++) {
      classIds.push(extractIdsArray[i].id);
    }
    setCoursesForCall((prevState: any) => ({
      ...prevState,
      [type]: classIds,
    }));
  };

  // section_id -> an object that looks like { LEC: ["id1", "id2"], TUT: ["id1"]}
  const addCourseToSchedule = (course_id: string, section_id: any) => {
    Object.keys(section_id).forEach((key) => {
      // TODO: replace with batch call to add courses
      for (let i = 0; i < section_id[key].length; i++) {
        console.log(`adding section w id: ${section_id[key][i]}`);
        clients
          // todo: don't set default colour to black?
          .addCoursesByScheduleId(
            scheduleId,
            course_id,
            section_id[key][i],
            "#000000",
          )
          .then((value: any) => {
            if (value.length !== 0) {
              setCoursesOnSchedule(value);
              showCourseAddedSnack(true);
            }
          });
      }
    });
  };

  const deleteCourseFromSchedule = (id: string) => {
    // todo: passing in wrong id for some reason... uid?
    console.log(searchResults);
    clients.deleteCoursesByScheduleId(scheduleId, id).then((value: any) => {
      if (value.length !== 0) {
        setCoursesOnSchedule(value);
      }
    });
  };

  const coursesOnSchedulesIds = useCallback(() => {
    let coursesOnScheduleIds = [];
    for (let i = 0; i < coursesOnSchedule.length; i++) {
      coursesOnScheduleIds.push(coursesOnSchedule[i].id);
    }
    return coursesOnScheduleIds;
  }, [coursesOnSchedule]);

  // currently only allowing one card to be expanded at a time
  const handleExpandClick = (courseToExpand: any) => {
    if (expandedCard === courseToExpand.id) {
      setSectionsToAdd({});
      setCoursesForCall([]);
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

  const createSectionDropdowns = (course: any) => {
    const sectionsByTypeAndNumber = {};

    for (const section of course.sections) {
      if (!(sectionsByTypeAndNumber as any)[section.type]) {
        (sectionsByTypeAndNumber as any)[section.type] = {};
      }
      if (!(sectionsByTypeAndNumber as any)[section.type][section.number]) {
        (sectionsByTypeAndNumber as any)[section.type][section.number] = [];
      }
      (sectionsByTypeAndNumber as any)[section.type][section.number].push(
        section,
      );
    }

    if (Object.keys(sectionsByTypeAndNumber).length !== 0) {
      return (
        <div
          style={{
            marginLeft: "auto",
            marginRight: "0px",
          }}
        >
          {Object.keys(sectionsByTypeAndNumber).map((type, i) => (
            <FormControl
              sx={{
                m: 1,
                minWidth: 90,
              }}
              size="small"
              key={i}
            >
              <InputLabel
                id="demo-select-small"
                sx={{
                  color: "var(--main-purple-2)",
                  fontWeight: "var(--font-weight-regular)",
                }}
              >
                {type}
              </InputLabel>
              <Select
                labelId="demo-select-small"
                id="demo-select-small"
                defaultValue=""
                value={sectionsToAdd[type]}
                label={type}
                onChange={(e) =>
                  handleSectionChange(e, type, sectionsByTypeAndNumber)
                }
                onMouseOver={() => {
                  if (sectionsToAdd[type] !== undefined) {
                    setCourseHovered(
                      (sectionsByTypeAndNumber as any)[type][
                        sectionsToAdd[type]
                      ],
                    );
                  }
                }}
                onMouseLeave={() => {
                  setCourseHovered({});
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    border: "red",
                    borderRadius: "8px",
                  },
                  "& .MuiSelect-select": {
                    color: "var(--main-purple-1)",
                    fontWeight: "var(--font-weight-regular)",
                  },
                  borderRadius: "10px",
                  backgroundColor: "white",
                }}
              >
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>
                {Object.keys((sectionsByTypeAndNumber as any)[type]).map(
                  (sectionNum, i) => {
                    return (
                      <MenuItem
                        defaultValue=""
                        value={sectionNum}
                        key={i}
                        onMouseOver={() => {
                          setCourseHovered(
                            (sectionsByTypeAndNumber as any)[type][sectionNum],
                          );
                        }}
                        onMouseLeave={() => {
                          setCourseHovered({});
                        }}
                      >
                        {sectionNum}
                      </MenuItem>
                    );
                  },
                )}
              </Select>
            </FormControl>
          ))}
        </div>
      );
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
                flexGrow: 1,
              }}
            >
              {course.department}&nbsp;
              {course.code} - {course.name}
            </h3>
            {expandedCard === course.id
              ? createSectionDropdowns(course)
              : false}
            <Tooltip
              title={
                coursesOnSchedulesIds().includes(course.id)
                  ? "Delete Course from Schedule"
                  : expandedCard === course.id
                  ? "Add Classes to Schedule"
                  : "Expand Card to Add Classes"
              }
              arrow
            >
              <IconButton
                aria-label="add course"
                onClick={() => {
                  if (coursesOnSchedulesIds().includes(course.id)) {
                    deleteCourseFromSchedule(course.id);
                  } else if (expandedCard === course.id) {
                    addCourseToSchedule(course.id, coursesForCall);
                  } else {
                    handleExpandClick(course);
                  }
                }}
                sx={{
                  marginLeft: "auto",
                  marginRight: "0px",
                  padding: "4px",
                  color: "var(--main-purple-1)",
                }}
                disabled={course.sections.length === 0 ? true : false}
              >
                {coursesOnSchedulesIds().includes(course.id) ? (
                  <DeleteOutlineIcon
                    sx={{
                      backgroundColor: "var(--alerts-warning-1)",
                      borderRadius: "50%",
                      padding: "4px",
                      color: "white",
                      fontSize: "17px",
                      marginRight: "1px",
                    }}
                  />
                ) : (
                  <AddCircleIcon
                    sx={{
                      fontSize: "28px",
                    }}
                  />
                )}
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
            onMouseOver={() => {
              setCourseHovered({});
            }}
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
            <h5 style={{ margin: "0px 6px 16px" }}>
              <em>{course.requisites}</em>
            </h5>
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
        .map((course) => createCourseCard(course))}
      {renderResultsDisplayedCard()}
      <Portal>
        <Snackbar
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
          open={courseAddedSnack}
          autoHideDuration={2000}
          onClose={handleClose}
          message="Success! Course added to schedule."
          sx={{
            "& .MuiSnackbarContent-root": {
              backgroundColor: "var(--alerts-success-7)",
              color: "var(--alerts-success-1)",
              minWidth: "150px",
              marginTop: "64px",
            },
          }}
        />
      </Portal>
    </Box>
  );
}
