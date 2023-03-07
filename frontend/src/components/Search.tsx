import { useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import InputAdornment from "@mui/material/InputAdornment";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";

import FilterAltIcon from "@mui/icons-material/FilterAlt";
import InfoIcon from "@mui/icons-material/Info";
import SearchIcon from "@mui/icons-material/Search";

import FilteringMenu from "./FilteringMenu";
import SearchCards from "./SearchCards";

interface courseHoverProps {
  setCourseHovered: any;
}

export default function Search({ setCourseHovered }: courseHoverProps) {
  const [showFilterMenu, setShowFilterMenu] = useState(false);

  const handleShowFilterMenu = () => {
    setShowFilterMenu(!showFilterMenu);
  };

  return (
    <div>
      <Box sx={{ m: 2 }}>
        <Stack direction="column" spacing={1}>
          <Stack direction="column" alignItems="flex-end" spacing={1}>
            <TextField
              fullWidth
              id="outlined-search"
              label="Search Courses"
              type="search"
              style={{ background: "#f7f7f7", borderRadius: "4px" }}
              sx={{ ":hover": { boxShadow: "0 4px 8px rgba(0, 0, 0, .20)" } }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
            <Button
              variant="text"
              size="small"
              startIcon={<FilterAltIcon />}
              onClick={handleShowFilterMenu}
            >
              Filter
            </Button>
          </Stack>
          {showFilterMenu && (
            <FilteringMenu setShowFilterMenu={setShowFilterMenu} />
          )}
          {/* todo: conditionally show welcome card */}
          <Card sx={{ minWidth: 100 }}>
            <CardContent>
              <InfoIcon sx={{ display: "inline" }} />
              <Typography sx={{ display: "inline" }} variant="h5">
                Hello!
              </Typography>
              <Typography variant="body2">
                UW Cal will help you through your course selection process
                through our interactive scheduler.
                <br />
                <br />
                {"Create a new schedule now to start!"}
              </Typography>
            </CardContent>
          </Card>
          <SearchCards setCourseHovered={setCourseHovered} />
        </Stack>
      </Box>
    </div>
  );
}
