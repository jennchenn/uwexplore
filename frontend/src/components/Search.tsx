import { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";

import CustomButton from "./CustomButton";
import FilteringMenu from "./FilteringMenu";
import SearchCards from "./SearchCards";
import courseClients from "../APIClients/CourseClient";

interface courseHoverProps {
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
}

export default function Search({
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
}: courseHoverProps) {
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [resultsLoading, setResultsLoading] = useState(false);
  const [filteringQuery, setFilteringQuery] = useState("");

  const handleShowFilterMenu = () => {
    setShowFilterMenu(!showFilterMenu);
    setResultsLoading(false);
    setFilteringQuery("");
  };

  useEffect(() => {
    if (searchQuery === "") {
      setSearchResults([]);
      setResultsLoading(false);
    } else {
      const results = courseClients.getCourses(
        `?query=${searchQuery}&${filteringQuery}`,
      );

      results.then((value) => {
        setResultsLoading(false);
        setSearchResults(value as any);
      });
    }
  }, [searchQuery, filteringQuery]);

  return (
    <div>
      <Box sx={{ m: 2 }}>
        <Stack direction="column" spacing={1}>
          <Stack direction="column" alignItems="flex-end" spacing={1}>
            <TextField
              fullWidth
              size="small"
              placeholder="Search Courses"
              onKeyDown={(e) => {
                if (
                  e.key === "Enter" &&
                  searchQuery.toUpperCase() !==
                    (e.target as HTMLTextAreaElement).value.toUpperCase()
                ) {
                  setResultsLoading(true);
                  setSearchQuery((e.target as HTMLTextAreaElement).value);
                  e.preventDefault();
                }
              }}
              sx={{
                "& .MuiInputBase-root": {
                  borderRadius: "50px",
                  backgroundColor: "var(--bg-3)",
                  border: "none",
                  "& input": {
                    padding: "12px 24px",
                    ":focus": {
                      boxShadow: "0 4px 8px rgba(0, 0, 0, .20)",
                      borderRadius: "50px",
                    },
                  },
                  "& fieldset": {
                    border: "none",
                  },
                  ":hover": {
                    boxShadow: "0 4px 8px rgba(0, 0, 0, .20)",
                  },
                },
              }}
            ></TextField>
            <CustomButton
              text="Filters"
              type="tertiary"
              onClick={handleShowFilterMenu}
              style={{ padding: "0px", margin: "12px 0px" }}
            ></CustomButton>
          </Stack>
          {showFilterMenu && (
            <FilteringMenu
              setShowFilterMenu={setShowFilterMenu}
              setResultsLoading={setResultsLoading}
              setFilteringQuery={setFilteringQuery}
            />
          )}
          <SearchCards
            resultsLoading={resultsLoading}
            searchResults={searchResults}
            searchQuery={searchQuery}
            setCourseHovered={setCourseHovered}
            coursesOnSchedule={coursesOnSchedule}
            setCoursesOnSchedule={setCoursesOnSchedule}
            scheduleId={scheduleId}
            handleCeabPlanChange={handleCeabPlanChange}
            pastCourses={pastCourses}
            setPastCourses={setPastCourses}
            tokenId={tokenId}
            showCourseAddedSnack={showCourseAddedSnack}
            showNothingToAddSnack={showNothingToAddSnack}
            showCourseDeletedSnack={showCourseDeletedSnack}
          />
        </Stack>
      </Box>
    </div>
  );
}
