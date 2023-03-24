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
  CircularProgress,
} from "@mui/material";
import PerfectScrollbar from "react-perfect-scrollbar";
import "../styles/CourseCard.css";
import backgroundColors from "../styles/calendarCourseBackgroundColors";

//MUI icon imports
import AddCircleIcon from "@mui/icons-material/AddCircle";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import { Props } from "../App";
import courseClients, { CourseObject } from "../APIClients/CourseClient";
import { useCallback, useEffect, useState } from "react";
import CustomButton from "./CustomButton";

interface CourseCardProps extends Props {
  course: CourseObject;
  pastCourses: { [term: string]: string[] };
  setPastCourses: (value: { [term: string]: string[] }) => void;
  expandedCard: string;
  setExpandedCard: (value: string) => void;
  bookmarkedCourses?: Record<string, any>;
  setBookmarkedCourses?: (value: any) => void;
  handleCeabPlanChange: any;
  setDeleteModalOpen: (value: boolean) => void;
  coursesOnSchedule: any;
  setCoursesOnSchedule: any;
  setCourseToDelete: any;
  scheduleId: string;
  showCourseAddedSnack?: (value: boolean) => void;
  showNothingToAddSnack?: (value: boolean) => void;
  setCourseHovered?: any;
  type?: "search" | "added";
  tokenId?: string | null;
}

export default function CourseCard({
  type = "search",
  bookmarkedCourses = {},
  setBookmarkedCourses = () => {},
  tokenId = "",
  ...CourseCardProps
}: CourseCardProps) {
  const [isPastCourse, setIsPastCourse] = useState(false);
  const [openTermSelect, setOpenTermSelect] = useState(false);
  const [term, setTerm] = useState("");
  const [showSelectError, setShowSelectError] = useState(false);

  // loading state while waiting for courses to be added
  const [addLoading, setAddLoading] = useState(false);

  // corresponds to the value of the section dropdowns
  const [sectionsToAdd, setSectionsToAdd] = useState({} as any);

  // corresponds to the api call to add courses
  const [coursesForCall, setCoursesForCall] = useState([] as any);

  const [sectionDropdownOpen, setSectionDropdownOpen] = useState(false);

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
    setSectionsToAdd({});
    setCoursesForCall([]);
    if (CourseCardProps.expandedCard === courseToExpand.id) {
      CourseCardProps.setExpandedCard("");
    } else {
      CourseCardProps.setExpandedCard(courseToExpand.id);
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

  const getRevisedPastCourses = (term: string, courseCode: string) => {
    let revisedObject = CourseCardProps.pastCourses;
    let revisedArray: string[] = [];
    if (term === "remove") {
      courseClients.getCourses(`?query=${courseCode}`).then((value: any) => {
        if (value.length !== 0) {
          const courseId = value[0].id;
          courseClients
            .deletePastCourses(tokenId, courseId)
            .then((value) => CourseCardProps.setPastCourses(value));
        }
      });
    } else {
      revisedArray.push(courseCode);
      courseClients.getCourses(`?query=${courseCode}`).then((value: any) => {
        if (value.length !== 0) {
          const courseId = value[0].id;
          courseClients
            .addPastCourses(tokenId, courseId, term)
            .then((value) => CourseCardProps.setPastCourses(value));
        }
      });
    }
    revisedObject[term] = revisedArray;

    return revisedObject;
  };

  const handleClose = () => {
    setShowSelectError(false);
    setOpenTermSelect(false);
  };

  const coursesOnSchedulesIds = useCallback(() => {
    let coursesOnScheduleIds = [];
    for (let i = 0; i < CourseCardProps.coursesOnSchedule.length; i++) {
      coursesOnScheduleIds.push(CourseCardProps.coursesOnSchedule[i].id);
    }
    return coursesOnScheduleIds;
  }, [CourseCardProps.coursesOnSchedule]);

  const handleSectionChange = (
    event: SelectChangeEvent,
    type: string,
    sectionsByTypeAndNumber: any,
  ) => {
    setSectionsToAdd({ ...sectionsToAdd, [type]: event.target.value });
    if (event.target.value) {
      const classIds: any = [];
      const extractIdsArray = sectionsByTypeAndNumber[type][event.target.value];
      for (let i = 0; i < extractIdsArray.length; i++) {
        classIds.push(extractIdsArray[i].id);
      }
      setCoursesForCall((prevState: any) => ({
        ...prevState,
        [type]: classIds,
      }));
    } else {
      setCoursesForCall((prevState: any) => {
        const copy = { ...prevState };
        delete copy[type];
        return copy;
      });
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
                  if (sectionsToAdd[type] && !sectionDropdownOpen) {
                    CourseCardProps.setCourseHovered(
                      (sectionsByTypeAndNumber as any)[type][
                        sectionsToAdd[type]
                      ],
                    );
                  }
                }}
                onMouseLeave={() => {
                  CourseCardProps.setCourseHovered({});
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
                          CourseCardProps.setCourseHovered(
                            (sectionsByTypeAndNumber as any)[type][sectionNum],
                          );
                        }}
                        onMouseLeave={() => {
                          CourseCardProps.setCourseHovered({});
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

  const addCourseToSchedule = (course_id: string, section_ids: any) => {
    if (Object.keys(section_ids).length !== 0) {
      setAddLoading(true);
      let formattedArray: any = [];

      Object.keys(section_ids).forEach((key) => {
        for (let i = 0; i < section_ids[key].length; i++) {
          formattedArray.push({
            course_id: course_id,
            section_id: section_ids[key][i],
            color:
              backgroundColors[
                Math.floor(Math.random() * backgroundColors.length + 1)
              ],
          });
        }
        courseClients
          // todo: don't set default colour to black?
          .addCoursesByScheduleId(CourseCardProps.scheduleId, formattedArray)
          .then((value: any) => {
            if (value.length !== 0 && CourseCardProps.showCourseAddedSnack) {
              CourseCardProps.setCoursesOnSchedule(value);
              CourseCardProps.showCourseAddedSnack(true);
              setAddLoading(false);
            }
          });
      });
    }
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
            {type === "search" && (
              <Tooltip
                title={
                  CourseCardProps.course.id in bookmarkedCourses
                    ? "Unpin Course"
                    : "Pin Course to Search Results"
                }
                enterNextDelay={1000}
                arrow
              >
                <IconButton
                  aria-label="pin course"
                  style={{
                    padding: "0px",
                    marginRight: "6px",
                  }}
                  onClick={() => handleBookmarkClick(CourseCardProps.course)}
                >
                  {CourseCardProps.course.id in bookmarkedCourses ? (
                    <BookmarkIcon sx={{ color: "var(--main-purple-1)" }} />
                  ) : (
                    <BookmarkBorderIcon
                      sx={{ color: "var(--main-purple-4)" }}
                    />
                  )}
                </IconButton>
              </Tooltip>
            )}
            <h3
              style={{
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                flexGrow: 1,
              }}
            >
              {CourseCardProps.course.department}&nbsp;
              {CourseCardProps.course.code} - {CourseCardProps.course.name}
            </h3>
            {CourseCardProps.expandedCard === CourseCardProps.course.id
              ? createSectionDropdowns(CourseCardProps.course)
              : false}
            <Tooltip
              title={
                CourseCardProps.course.sections.length === 0
                  ? ""
                  : coursesOnSchedulesIds().includes(CourseCardProps.course.id)
                  ? "Delete Course from Schedule"
                  : CourseCardProps.expandedCard === CourseCardProps.course.id
                  ? "Add Classes to Calendar"
                  : "Expand Card to Add Classes"
              }
              arrow
            >
              <div>
                <IconButton
                  aria-label="add course"
                  onClick={() => {
                    if (
                      coursesOnSchedulesIds().includes(
                        CourseCardProps.course.id,
                      )
                    ) {
                      CourseCardProps.setDeleteModalOpen(true);
                      CourseCardProps.setCourseToDelete({
                        title: `${CourseCardProps.course.department} 
                      ${CourseCardProps.course.code}`,
                        id: CourseCardProps.course.id,
                      });
                    } else if (
                      CourseCardProps.expandedCard === CourseCardProps.course.id
                    ) {
                      if (
                        Object.keys(coursesForCall).length === 0 &&
                        CourseCardProps.showNothingToAddSnack
                      ) {
                        CourseCardProps.showNothingToAddSnack(true);
                      } else {
                        addCourseToSchedule(
                          CourseCardProps.course.id,
                          coursesForCall,
                        );
                      }
                    } else {
                      handleExpandClick(CourseCardProps.course);
                    }
                  }}
                  sx={{
                    marginLeft: "auto",
                    marginRight: "0px",
                    padding: "4px",
                    color: "var(--main-purple-1)",
                  }}
                  disabled={
                    CourseCardProps.course.sections.length === 0 ? true : false
                  }
                >
                  {coursesOnSchedulesIds().includes(
                    CourseCardProps.course.id,
                  ) ? (
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
                  ) : addLoading &&
                    CourseCardProps.expandedCard ===
                      CourseCardProps.course.id ? (
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
            onMouseOver={() => {
              CourseCardProps.setCourseHovered({});
            }}
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
                      {CourseCardProps.course.sections.length === 0 ? (
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
                        CourseCardProps.course.sections.map((section: any) => {
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
                        })
                      )}
                    </TableBody>
                  </Table>
                </PerfectScrollbar>
              </div>
            </TableContainer>

            <h5 style={{ margin: "0px 6px 16px" }}>
              <em>{CourseCardProps.course.requisites}</em>
            </h5>
            <FormControlLabel
              className="past-course-check"
              control={
                <Checkbox
                  checked={isPastCourse}
                  onChange={(e: any) => {
                    if (isPastCourse) {
                      setIsPastCourse(false);
                      CourseCardProps.setPastCourses(
                        getRevisedPastCourses(
                          "remove",
                          CourseCardProps.course.full_code,
                        ),
                      );
                      CourseCardProps.handleCeabPlanChange();
                    }
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
                      CourseCardProps.course.full_code,
                    ),
                  );
                  CourseCardProps.handleCeabPlanChange();
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
