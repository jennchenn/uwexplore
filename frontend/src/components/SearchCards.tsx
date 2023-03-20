import { useState } from "react";
import { CourseObject } from "../APIClients/CourseClient";

// MUI component imports
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import Portal from "@mui/material/Portal";
import Snackbar from "@mui/material/Snackbar";

// MUI table imports
import Paper from "@mui/material/Paper";

//MUI icon imports
import CourseCard from "./CourseCard";

interface searchProps {
  resultsLoading: boolean;
  searchResults: CourseObject[];
  searchQuery: string;
  setCourseHovered: any;
  setCoursesOnSchedule: any;
  scheduleId: string;
}

export default function SearchCards({
  resultsLoading,
  searchResults,
  searchQuery,
  setCourseHovered,
  setCoursesOnSchedule,
  scheduleId,
}: searchProps) {
  const [expandedCard, setExpandedCard] = useState("");
  const [bookmarkedCourses, setBookmarkedCourses] = useState<
    Record<string, any>
  >({});
  const [courseAddedSnack, showCourseAddedSnack] = useState(false);

  const handleClose = () => {
    showCourseAddedSnack(false);
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
              return (
                <CourseCard
                  course={course}
                  expandedCard={expandedCard}
                  bookmarkedCourses={bookmarkedCourses}
                  setExpandedCard={setExpandedCard}
                  setBookmarkedCourses={setBookmarkedCourses}
                  setCourseHovered={setCourseHovered}
                />
              );
            })}
          </>
          <br />
        </>
      );
    } else {
      return false;
    }
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
        .map((course, i) => (
          <CourseCard
            course={course}
            expandedCard={expandedCard}
            bookmarkedCourses={bookmarkedCourses}
            setExpandedCard={setExpandedCard}
            setBookmarkedCourses={setBookmarkedCourses}
            setCourseHovered={setCourseHovered}
          />
        ))}
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
