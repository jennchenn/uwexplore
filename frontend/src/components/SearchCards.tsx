import { useState, useCallback } from "react";
import moment from "moment";
import PerfectScrollbar from "react-perfect-scrollbar";
import clients, { CourseObject } from "../APIClients/CourseClient";
import SearchDeleteModal from "./SearchDeleteModal";

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

  // snackbars
  const [courseAddedSnack, showCourseAddedSnack] = useState(false);
  const [nothingToAddSnack, showNothingToAddSnack] = useState(false);

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [courseToDelete, setCourseToDelete] = useState({} as any);

  // loading state while waiting for courses to be added
  const [addLoading, setAddLoading] = useState(false);

  // corresponds to the value of the section dropdowns
  const [sectionsToAdd, setSectionsToAdd] = useState({} as any);
  // corresponds to the api call to add courses
  const [coursesForCall, setCoursesForCall] = useState([] as any);
  const [sectionDropdownOpen, setSectionDropdownOpen] = useState(false);

  const handleCloseAddedSnack = () => {
    showCourseAddedSnack(false);
  };

  const handleCloseNothingSnack = () => {
    showNothingToAddSnack(false);
  };

  const handleSectionChange = (
    event: SelectChangeEvent,
    type: string,
    sectionsByTypeAndNumber: any,
  ) => {
    if (event.target.value) {
      setSectionsToAdd({ ...sectionsToAdd, [type]: event.target.value });

      // classIds -> an object that looks like { LEC: ["id1", "id2"], TUT: ["id1"]}
      const classIds: any = [];
      const extractIdsArray = sectionsByTypeAndNumber[type][event.target.value];
      for (let i = 0; i < extractIdsArray.length; i++) {
        classIds.push(extractIdsArray[i].id);
      }
      setCoursesForCall((prevState: any) => ({
        ...prevState,
        [type]: classIds,
      }));
    }
  };

  const addCourseToSchedule = (course_id: string, section_ids: any) => {
    if (Object.keys(section_ids).length !== 0) {
      setAddLoading(true);
      let formattedArray: any = [];

      Object.keys(section_ids).forEach((key) => {
        for (let i = 0; i < section_ids[key].length; i++) {
          formattedArray.push({
            course_id: course_id,
            section_id: section_ids[key][i],
            color: "#000000",
          });
        }
        clients
          // todo: don't set default colour to black?
          .addCoursesByScheduleId(scheduleId, formattedArray)
          .then((value: any) => {
            if (value.length !== 0) {
              setCoursesOnSchedule(value);
              showCourseAddedSnack(true);
              setAddLoading(false);
            }
          });
      });
    }
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
    setSectionsToAdd({});
    setCoursesForCall([]);
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
    // organize course obj by type and number
    // format: { LEC: { 001: [course obj], 002: [course obj] }, TUT: { 101: [course obj]} }
    const sectionsByTypeAndNumber = {};
    for (const section of course.sections) {
      if (!(sectionsByTypeAndNumber as any)[section.type]) {
        (sectionsByTypeAndNumber as any)[section.type] = {};
      }
      if (!(sectionsByTypeAndNumber as any)[section.type][section.number]) {
        (sectionsByTypeAndNumber as any)[section.type][section.number] = [];
      }
      (sectionsByTypeAndNumber as any)[section.type][section.number].push({
        full_code: `${course.department} ${course.code}`,
        ...section,
      });
    }

    // create selection dropdowns for adding sections
    if (Object.keys(sectionsByTypeAndNumber).length !== 0) {
      return (
        <Stack
          direction="row"
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
                value={sectionsToAdd[type] || ""}
                label={type}
                onChange={(e) =>
                  handleSectionChange(e, type, sectionsByTypeAndNumber)
                }
                onOpen={() => setSectionDropdownOpen(true)}
                onClose={() => setSectionDropdownOpen(false)}
                onMouseOver={() => {
                  if (
                    sectionsToAdd[type] !== undefined &&
                    !sectionDropdownOpen
                  ) {
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
        </Stack>
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
                course.sections.length === 0
                  ? ""
                  : coursesOnSchedulesIds().includes(course.id)
                  ? "Delete Course from Schedule"
                  : expandedCard === course.id
                  ? "Add Classes to Calendar"
                  : "Expand Card to Add Classes"
              }
              arrow
            >
              <div>
                <IconButton
                  aria-label="add course"
                  onClick={() => {
                    if (coursesOnSchedulesIds().includes(course.id)) {
                      setDeleteModalOpen(true);
                      setCourseToDelete({
                        title: `${course.department} 
                      ${course.code}`,
                        id: course.id,
                      });
                    } else if (expandedCard === course.id) {
                      if (coursesForCall.length === 0) {
                        // show snack
                        showNothingToAddSnack(true);
                      } else {
                        addCourseToSchedule(course.id, coursesForCall);
                      }
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
                  ) : addLoading && expandedCard === course.id ? (
                    <CircularProgress
                      size={24}
                      sx={{ color: "var(--main-purple-2)" }}
                    />
                  ) : (
                    <AddCircleIcon
                      sx={{
                        fontSize: "28px",
                      }}
                    />
                  )}
                </IconButton>
              </div>
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
      <SearchDeleteModal
        courseToDelete={courseToDelete}
        setCourseToDelete={setCourseToDelete}
        setCoursesOnSchedule={setCoursesOnSchedule}
        deleteModalOpen={deleteModalOpen}
        setDeleteModalOpen={setDeleteModalOpen}
        scheduleId={scheduleId}
      ></SearchDeleteModal>
      <Portal>
        <Snackbar
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
          open={courseAddedSnack}
          autoHideDuration={2000}
          onClose={handleCloseAddedSnack}
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
        <Snackbar
          open={nothingToAddSnack}
          autoHideDuration={2000}
          onClose={handleCloseNothingSnack}
          message="Please select at least one section to add."
          sx={{
            "& .MuiSnackbarContent-root": {
              backgroundColor: "var(--alerts-conflict-5)",
              color: "var(--black-3)",
              minWidth: "150px",
              marginTop: "64px",
            },
          }}
        />
      </Portal>
    </Box>
  );
}
