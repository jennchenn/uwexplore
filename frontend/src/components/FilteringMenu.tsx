import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import Grid from "@mui/material/Unstable_Grid2";
import Stack from "@mui/material/Stack";

import CustomButton from "./CustomButton";
import "../styles/FilteringMenu.css";

interface FilteringMenuProps {
  setShowFilterMenu: (showFilterMenu: boolean) => void;
  setResultsLoading: (resultsLoading: boolean) => void;
  setFilteringQuery: (filteringQuery: string) => void;
}

export default function FilteringMenu({
  setShowFilterMenu,
  setResultsLoading,
  setFilteringQuery,
}: FilteringMenuProps) {
  const checkboxStyle = {
    "& .MuiSvgIcon-root": { fontSize: 16 },
    "& .MuiFormControlLabel-label": {
      fontSize: "0.9rem",
    },
    height: "24px",
    boxSizing: "border-box",
  };

  const handleSubmit = async (event: any) => {
    event.preventDefault();
    // returns a query string that looks like: term=F&term=W&code=3&code=4&capacity=free
    const queryString = new URLSearchParams(
      new FormData(event.currentTarget) as any,
    ).toString();

    setResultsLoading(true);
    setFilteringQuery(queryString);
  };

  const handleCancel = () => {
    setShowFilterMenu(false);
    // setResultsLoading(true);
    // setFilteringQuery("");
  };

  return (
    <Box>
      <Card
        sx={{
          "& .MuiCardContent-root": {
            padding: "0px 24px 24px",
          },
          borderRadius: "var(--border-radius)",
          backgroundColor: "var(--bg-3)",
          marginBottom: "24px",
        }}
        elevation={2}
      >
        <CardContent>
          <form onSubmit={handleSubmit}>
            <Grid container>
              <Grid xs={6} md={4}>
                {/* todo: change name/value of the checkboxes to match backend */}
                <h3 className="filter-headings">Offered In</h3>
                <FormControlLabel
                  sx={checkboxStyle}
                  control={<Checkbox name="term" value="F" disabled />}
                  label="Fall 2022"
                />
                <FormControlLabel
                  sx={checkboxStyle}
                  control={<Checkbox name="term" value="W" disabled />}
                  label="Winter 2023"
                />
                <FormControlLabel
                  sx={checkboxStyle}
                  control={<Checkbox name="term" value="S" disabled />}
                  label="Spring 2023"
                />
              </Grid>
              <Grid xs={6} md={5}>
                <h3 className="filter-headings">Course Code</h3>
                <Grid container>
                  <Grid xs={6}>
                    <FormControlLabel
                      sx={checkboxStyle}
                      control={<Checkbox name="code" value="1" />}
                      label="1XX"
                    />
                    <FormControlLabel
                      sx={checkboxStyle}
                      control={<Checkbox name="code" value="2" />}
                      label="2XX"
                    />
                    <FormControlLabel
                      sx={checkboxStyle}
                      control={<Checkbox name="code" value="3" />}
                      label="3XX"
                    />
                  </Grid>
                  <Grid xs={6}>
                    <FormControlLabel
                      sx={checkboxStyle}
                      control={<Checkbox name="code" value="4" />}
                      label="4XX"
                    />
                    <FormControlLabel
                      sx={checkboxStyle}
                      control={<Checkbox name="code" value="5" />}
                      label="5XX+"
                    />
                  </Grid>
                </Grid>
              </Grid>
              <Grid xs={6} md={3}>
                {/* todo: change name/value of the checkboxes to match backend */}
                <h3 className="filter-headings">Prerequisites</h3>
                <FormControlLabel
                  sx={checkboxStyle}
                  control={<Checkbox name="prereq" value="none" disabled />}
                  label="None"
                />
                <FormControlLabel
                  sx={checkboxStyle}
                  control={<Checkbox name="prereq" value="required" disabled />}
                  label="Required"
                />
              </Grid>
              <Grid xs={6} md={4}>
                {/* todo: change name/value of the checkboxes to match backend */}
                <h3 className="filter-headings">Capacity</h3>
                <Stack direction="column">
                  <FormControlLabel
                    sx={checkboxStyle}
                    control={<Checkbox name="capacity" value="full" disabled />}
                    label="Full"
                  />
                  <FormControlLabel
                    sx={checkboxStyle}
                    control={<Checkbox name="capacity" value="free" disabled />}
                    label="Not Full"
                  />
                </Stack>
              </Grid>
              <Grid xs={12} md={8}>
                {/* todo: change name/value of the checkboxes to match backend */}
                <h3 className="filter-headings">Time</h3>
                <FormControlLabel
                  sx={checkboxStyle}
                  control={<Checkbox name="time" value="day" disabled />}
                  label="Day (Starts before 5PM)"
                />
                <FormControlLabel
                  sx={checkboxStyle}
                  control={<Checkbox name="time" value="night" disabled />}
                  label="Night (Starts after 5PM)"
                />
              </Grid>
              {/* todo: implement when moving forward with options */}
              {/* <Grid xs={6} md={4}>
              <Typography variant="h6">Options</Typography>
              <FormGroup>
                <FormControlLabel
                  control={<Checkbox sx={checkboxStyle} />}
                  label="Course required for option"
                />
              </FormGroup>
            </Grid> */}
            </Grid>
            <Stack
              direction="row"
              display={"flex"}
              justifyContent={"center"}
              spacing={4}
              marginTop={"24px"}
            >
              <CustomButton
                type="submit"
                text="Apply"
                className="custom-button-CTA"
              ></CustomButton>
              <CustomButton
                type="tertiary"
                text="Cancel"
                onClick={() => handleCancel()}
              ></CustomButton>
            </Stack>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
}
