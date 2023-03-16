import { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";

import CustomButton from "./CustomButton";
import FilteringMenu from "./FilteringMenu";
import SearchCards from "./SearchCards";
import clients from "../APIClients/CourseClient";

interface courseHoverProps {
  setCourseHovered: any;
}

export default function Search({ setCourseHovered }: courseHoverProps) {
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
      const results = clients.getCourses(
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
                  },
                  "& fieldset": {
                    border: "none",
                  },
                  ":hover": { boxShadow: "0 4px 8px rgba(0, 0, 0, .20)" },
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
          />
        </Stack>
      </Box>
    </div>
  );
}
