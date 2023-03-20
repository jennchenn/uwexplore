import { useState } from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import FormControl from "@mui/material/FormControl";
import Grid from "@mui/material/Unstable_Grid2";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Paper from "@mui/material/Paper";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import Stack from "@mui/material/Stack";
import ProgressBar from "./ProgressBar";
import "../styles/CustomButton.css";

const CeabRequirements = [
  { label: "LIST A", requirement: 1 },
  { label: "LIST B", requirement: 1 },
  { label: "LIST C", requirement: 2 },
  { label: "CSE ALL", requirement: 6 },
  { label: "TE", requirement: 6 },
  { label: "TE & CSE", requirement: 13 },
  { label: "PD COMP", requirement: 2 },
  { label: "PD ELEC", requirement: 3 },
  { label: "MATH", requirement: 195 },
  { label: "SCI", requirement: 195 },
  { label: "ENG SCI", requirement: 225 },
  { label: "ENG DES", requirement: 225 },
  { label: "MATH & SCI", requirement: 420 },
  { label: "ENG SCI & ENG DES", requirement: 900 },
  { label: "CSE WEIGHT", requirement: 225 },
];

export default function CeabBase() {
  const [term, setTerm] = useState("");

  const handleChange = (event: SelectChangeEvent) => {
    setTerm(event.target.value);
  };

  return (
    <Grid sx={{ m: "0px 30px 30px", display: "grid" }} container>
      <Stack direction="row" spacing={2}>
        {/* LHS: CEAB REQUIREMENTS */}
        <Grid xs={6}>
          <Card
            elevation={2}
            sx={{
              borderRadius: "var(--border-radius)",
            }}
          >
            <CardContent>
              <h3
                style={{
                  display: "inline",
                  color: "var(--black-3)",
                }}
              >
                CEAB Requirements
              </h3>
              <Stack direction="column" spacing={1} sx={{ marginTop: "12px" }}>
                {CeabRequirements.map((requirement, i) => (
                  <ProgressBar
                    label={requirement.label}
                    // todo: get user's ceab vals from taken courses and map properly
                    completed="50"
                    total={requirement.requirement}
                    key={i}
                  ></ProgressBar>
                ))}
              </Stack>
            </CardContent>
          </Card>
        </Grid>
        {/* RHS: PAST COURSES */}
        <Grid xs={6}>
          <Card
            elevation={2}
            sx={{
              backgroundColor: "var(--bg-3)",
              height: "100%",
              display: "flex",
              flexDirection: "column",

              "& .MuiCardContent-root": {
                padding: "0px 16px 24px",
              },
              borderRadius: "var(--border-radius)",
            }}
          >
            <CardContent
              sx={{ height: "100%", display: "flex", flexDirection: "column" }}
            >
              <Stack
                direction="row"
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-around",
                }}
              >
                <h3 style={{ flexGrow: "1", color: "var(--black-3)" }}>
                  Past Courses
                </h3>
                <FormControl
                  sx={{
                    m: 1,
                    minWidth: 80,

                    "& .MuiOutlinedInput-notchedOutline": {
                      border: "0px",
                    },
                    "& .MuiFormLabel-root": {
                      color: "white",
                    },
                    "& .MuiSvgIcon-root": {
                      color: "var(--main-purple-5)",
                    },

                    boxShadow: "none",
                  }}
                  size="small"
                  className="custom-button-primary"
                >
                  <InputLabel id="demo-select-small">Term</InputLabel>
                  <Select
                    labelId="demo-select-small"
                    id="demo-select-small"
                    value={term}
                    onChange={handleChange}
                    sx={{
                      "& .MuiSelect-select": {
                        color: "white",
                      },
                    }}
                  >
                    <MenuItem value="">
                      <em>None</em>
                    </MenuItem>
                    {/* todo: can map these once I know how they'll be used */}
                    <MenuItem value={1}>1A</MenuItem>
                    <MenuItem value={2}>1B</MenuItem>
                    <MenuItem value={3}>2A</MenuItem>
                    <MenuItem value={4}>2B</MenuItem>
                    <MenuItem value={5}>3A</MenuItem>
                    <MenuItem value={6}>3B</MenuItem>
                    <MenuItem value={7}>4A</MenuItem>
                    <MenuItem value={8}>4B</MenuItem>
                    <MenuItem value={9}>Other</MenuItem>
                  </Select>
                </FormControl>
              </Stack>
              <Box sx={{ display: "flex", height: "100%", flex: 1 }}>
                <Paper
                  elevation={0}
                  sx={{
                    padding: 2,
                    width: "100%",
                    borderRadius: "var(--border-radius)",
                  }}
                >
                  <Paper
                    elevation={0}
                    sx={{
                      backgroundColor: "var(--bg-3)",
                      p: 2,
                      borderRadius: "var(--border-radius)",
                      textAlign: "center",
                    }}
                  >
                    <h5 style={{ margin: "0px", color: "var(--black-4)" }}>
                      <em>Added past courses will appear here</em>
                    </h5>
                  </Paper>
                </Paper>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Stack>
    </Grid>
  );
}
