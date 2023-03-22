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
} from "@mui/material";
import PerfectScrollbar from "react-perfect-scrollbar";

//MUI icon imports
import AddCircleIcon from "@mui/icons-material/AddCircle";
import RemoveCircleOutlinedIcon from "@mui/icons-material/RemoveCircleOutlined";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import { Props } from "../App";
import { CourseObject } from "../APIClients/CourseClient";

interface CourseCardProps extends Props {
  course: CourseObject;
  expandedCard: string;
  setExpandedCard: (value: string) => void;
  bookmarkedCourses?: Record<string, any>;
  setBookmarkedCourses?: (input: any) => void;
  setCourseHovered?: any;
  type?: "search" | "added";
}

export default function CourseCard({
  type = "search",
  ...CourseCardProps
}: CourseCardProps) {
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

  // currently only allowing one card to be expanded at a time
  const handleExpandClick = (courseToExpand: any) => {
    if (CourseCardProps.expandedCard === courseToExpand.id) {
      CourseCardProps.setExpandedCard("");
    } else {
      CourseCardProps.setExpandedCard(courseToExpand.id);
    }
  };

  const handleBookmarkClick = (courseToBookmark: any) => {
    if (
      CourseCardProps.bookmarkedCourses &&
      CourseCardProps.setBookmarkedCourses
    )
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

  return (
    <Card
      className={CourseCardProps.className}
      style={{ marginTop: "16px", ...CourseCardProps.style }}
      elevation={2}
      key={CourseCardProps.course.id}
      sx={{
        paddingLeft: "12px",
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
          {CourseCardProps.bookmarkedCourses && (
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
                aria-label="pin course"
                style={{
                  padding: "0px",
                  marginRight: "6px",
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
          )}
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
                    {CourseCardProps.course.sections.length === 0 ? (
                      <></>
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
                      })
                    )}
                  </TableBody>
                </Table>
              </PerfectScrollbar>
            </div>
          </TableContainer>

          {/* todo: add prereq and antireq info */}
        </Collapse>
      </CardContent>
    </Card>
  );
}
