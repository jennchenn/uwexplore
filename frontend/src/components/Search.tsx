import { useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
// import Card from "@mui/material/Card";
// import CardContent from "@mui/material/CardContent";
import InputAdornment from "@mui/material/InputAdornment";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
// import Typography from "@mui/material/Typography";

// import FilterAltIcon from "@mui/icons-material/FilterAlt";
// import InfoIcon from "@mui/icons-material/Info";
import SearchIcon from "@mui/icons-material/Search";

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
            <TextInput
              fullWidth
              placeholder="Search Courses"
              sx={{
                "& .MuiOutlinedInput-root": {
                  "& input": { borderRadius: "50px" },
                },
                margin: "0px;",
              }}
            ></TextInput>
            <CustomButton
              text="Filters"
              type="tertiary"
              onClick={handleShowFilterMenu}
              style={{ padding: "0px" }}
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
