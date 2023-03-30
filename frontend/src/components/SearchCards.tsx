import { Box, CircularProgress, Paper } from "@mui/material";
import { useState } from "react";
import { CourseObject } from "../APIClients/CourseClient";
import CourseCard from "./CourseCard";
import SearchDeleteModal from "./SearchDeleteModal";

interface searchProps {
  resultsLoading: boolean;
  searchResults: CourseObject[];
  searchQuery: string;
  setCourseHovered: any;
  coursesOnSchedule: any;
  setCoursesOnSchedule: any;
  scheduleId: string;
  handleCeabPlanChange: any;
  pastCourses: { [key: string]: string[] };
  setPastCourses: (value: { [term: string]: string[] }) => void;
  tokenId?: string | null;
  showCourseAddedSnack: (open: boolean) => void;
  showNothingToAddSnack: (open: boolean) => void;
  showCourseDeletedSnack: (open: boolean) => void;
  showIsErrorSnack: (open: boolean) => void;
}

export default function SearchCards({
  resultsLoading,
  searchResults,
  searchQuery,
  setCourseHovered,
  coursesOnSchedule,
  setCoursesOnSchedule,
  scheduleId,
  handleCeabPlanChange,
  pastCourses,
  setPastCourses,
  tokenId,
  showCourseAddedSnack,
  showNothingToAddSnack,
  showCourseDeletedSnack,
  showIsErrorSnack,
}: searchProps) {
  const [expandedCard, setExpandedCard] = useState("");
  const [bookmarkedCourses, setBookmarkedCourses] = useState<
    Record<string, any>
  >({});

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [courseToDelete, setCourseToDelete] = useState({} as any);

  const renderSearchResultsFoundMessage = () => {
    if (!resultsLoading) {
      let message = `${searchResults.length} Search results found for "${searchQuery}"`;
      if (searchQuery === "") {
        return <></>;
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
            margin: "24px 0px -5px",
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
                  pastCourses={pastCourses}
                  setPastCourses={setPastCourses}
                  setDeleteModalOpen={setDeleteModalOpen}
                  handleCeabPlanChange={handleCeabPlanChange}
                  setCoursesOnSchedule={setCoursesOnSchedule}
                  coursesOnSchedule={coursesOnSchedule}
                  setCourseToDelete={setCourseToDelete}
                  scheduleId={scheduleId}
                  showCourseAddedSnack={showCourseAddedSnack}
                  showNothingToAddSnack={showNothingToAddSnack}
                  tokenId={tokenId}
                  showIsErrorSnack={showIsErrorSnack}
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
        .map((course, index) => (
          <CourseCard
            key={`search-card-course-card-${index}`}
            course={course}
            expandedCard={expandedCard}
            bookmarkedCourses={bookmarkedCourses}
            setExpandedCard={setExpandedCard}
            setBookmarkedCourses={setBookmarkedCourses}
            setCourseHovered={setCourseHovered}
            pastCourses={pastCourses}
            handleCeabPlanChange={handleCeabPlanChange}
            setPastCourses={setPastCourses}
            setDeleteModalOpen={setDeleteModalOpen}
            coursesOnSchedule={coursesOnSchedule}
            setCoursesOnSchedule={setCoursesOnSchedule}
            setCourseToDelete={setCourseToDelete}
            scheduleId={scheduleId}
            showCourseAddedSnack={showCourseAddedSnack}
            showNothingToAddSnack={showNothingToAddSnack}
            tokenId={tokenId}
            showIsErrorSnack={showIsErrorSnack}
          />
        ))}

      {renderResultsDisplayedCard()}
      <SearchDeleteModal
        handleCeabPlanChange={handleCeabPlanChange}
        courseToDelete={courseToDelete}
        setCourseToDelete={setCourseToDelete}
        setCoursesOnSchedule={setCoursesOnSchedule}
        deleteModalOpen={deleteModalOpen}
        setDeleteModalOpen={setDeleteModalOpen}
        scheduleId={scheduleId}
        showCourseDeletedSnack={showCourseDeletedSnack}
        showIsErrorSnack={showIsErrorSnack}
      ></SearchDeleteModal>
    </Box>
  );
}
