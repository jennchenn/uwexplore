import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import Grid from "@mui/material/Unstable_Grid2";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

interface FilteringMenuProps {
  setShowFilterMenu: (showFilterMenu: boolean) => void;
}

export default function FilteringMenu({
  setShowFilterMenu,
}: FilteringMenuProps) {
  const checkboxStyle = {
    "& .MuiSvgIcon-root": { fontSize: 14 },
  };

  const handleSubmit = async (event: any) => {
    event.preventDefault();
    // returns a query string that looks like: term=F&term=W&code=3&code=4&capacity=free
    const queryString = new URLSearchParams(
      new FormData(event.currentTarget) as any,
    ).toString();

    // todo: remove console.log after further implementation
    console.log(queryString);

    // todo: implement fetch
    // todo: pass in props to update state?
  };

  return (
    <Box>
      <Card>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <Grid container>
              <Grid xs={6} md={4}>
                {/* todo: change name/value of the checkboxes to match backend */}
                <Typography variant="h6">Offered In</Typography>
                <FormControlLabel
                  control={
                    <Checkbox name="term" value="F" sx={checkboxStyle} />
                  }
                  label="Fall 2022"
                />
                <FormControlLabel
                  control={
                    <Checkbox name="term" value="W" sx={checkboxStyle} />
                  }
                  label="Winter 2023"
                />
                <FormControlLabel
                  control={
                    <Checkbox name="term" value="S" sx={checkboxStyle} />
                  }
                  label="Spring 2023"
                />
              </Grid>
              <Grid xs={6} md={4}>
                <Typography variant="h6">Course Code</Typography>
                <Grid container>
                  <Grid xs={6}>
                    <FormControlLabel
                      control={
                        <Checkbox name="code" value="1" sx={checkboxStyle} />
                      }
                      label="1XX"
                    />
                    <FormControlLabel
                      control={
                        <Checkbox name="code" value="2" sx={checkboxStyle} />
                      }
                      label="2XX"
                    />
                    <FormControlLabel
                      control={
                        <Checkbox name="code" value="3" sx={checkboxStyle} />
                      }
                      label="3XX"
                    />
                  </Grid>
                  <Grid xs={6}>
                    <FormControlLabel
                      control={
                        <Checkbox name="code" value="4" sx={checkboxStyle} />
                      }
                      label="4XX"
                    />
                    <FormControlLabel
                      control={
                        <Checkbox name="code" value="5" sx={checkboxStyle} />
                      }
                      label="5XX+"
                    />
                  </Grid>
                </Grid>
              </Grid>
              <Grid xs={6} md={4}>
                {/* todo: change name/value of the checkboxes to match backend */}
                <Typography variant="h6">Prerequisites</Typography>
                <FormControlLabel
                  control={
                    <Checkbox name="prereq" value="none" sx={checkboxStyle} />
                  }
                  label="None"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      name="prereq"
                      value="required"
                      sx={checkboxStyle}
                    />
                  }
                  label="Required"
                />
              </Grid>
              <Grid xs={6} md={4}>
                {/* todo: change name/value of the checkboxes to match backend */}
                <Typography variant="h6">Capacity</Typography>
                <FormControlLabel
                  control={
                    <Checkbox name="capacity" value="full" sx={checkboxStyle} />
                  }
                  label="Full"
                />
                <FormControlLabel
                  control={
                    <Checkbox name="capacity" value="free" sx={checkboxStyle} />
                  }
                  label="Not Full"
                />
              </Grid>
              <Grid xs={6} md={8}>
                {/* todo: change name/value of the checkboxes to match backend */}
                <Typography variant="h6">Time</Typography>
                <FormControlLabel
                  control={
                    <Checkbox name="time" value="day" sx={checkboxStyle} />
                  }
                  label="Day (Starts before 5PM)"
                />
                <FormControlLabel
                  control={
                    <Checkbox name="time" value="night" sx={checkboxStyle} />
                  }
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
            >
              <Button type="submit" variant="contained">
                Apply
              </Button>
              <Button variant="text" onClick={() => setShowFilterMenu(false)}>
                Cancel
              </Button>
            </Stack>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
}
