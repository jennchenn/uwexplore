import { useState } from "react";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";

import CustomButton from "./CustomButton";
import FilteringMenu from "./FilteringMenu";
import SearchCards from "./SearchCards";
import TextInput from "./TextInput";

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
              size="small"
              placeholder="Search Courses"
              sx={{
                "& .MuiInputBase-root": {
                  borderRadius: "50px",
                  backgroundColor: "var(--bg-2)",
                  border: "none",
                  "& input": {
                    padding: "12px 24px",
                  },
                  "& fieldset": {
                    border: "none",
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
            <FilteringMenu setShowFilterMenu={setShowFilterMenu} />
          )}
          {/* todo: conditionally show welcome card */}
          {/* <Card sx={{ minWidth: 100 }}>
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
          </Card> */}
          <SearchCards setCourseHovered={setCourseHovered} />
        </Stack>
      </Box>
    </div>
  );
}
