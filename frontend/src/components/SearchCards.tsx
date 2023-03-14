import { useState } from "react";
import { CourseObject } from "../APIClients/CourseClient";

// MUI component imports
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";

// MUI table imports
import Paper from "@mui/material/Paper";

//MUI icon imports
import CourseCard from "./CourseCard";

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

  const renderSearchResultsFoundMessage = () => {
    if (!resultsLoading) {
      let message = `${searchResults.length} Search results found for "${searchQuery}"`;
      if (searchQuery === "") {
        // todo: change this message?
        message = "Search for courses above";
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

  const renderMaxResultsDisplayedCard = () => {
    if (searchResults.length === 30) {
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
            <em>
              30 search results displayed. Didn’t find the course you were
              looking for? Be more specific or apply some filters!
            </em>
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
      {renderMaxResultsDisplayedCard()}
    </Box>
  );
}
