import { useState } from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Paper from "@mui/material/Paper";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import ProgressBar from "./ProgressBar";

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
    <Box sx={{ m: 2 }}>
      <Stack direction="row" spacing={2}>
        {/* LHS: CEAB REQUIREMENTS */}
        <Box sx={{ width: "50%" }}>
          <Card elevation={2}>
            <CardContent>
              <Typography sx={{ display: "inline" }} variant="h6">
                CEAB Requirements
              </Typography>
              <Stack direction="column" spacing={1}>
                {CeabRequirements.map((requirement, i) => (
                  <ProgressBar
                    label={requirement.label}
                    // todo: get user's ceab vals from taken courses
                    completed="50"
                    total={requirement.requirement}
                    key={i}
                  ></ProgressBar>
                ))}
              </Stack>
            </CardContent>
          </Card>
        </Box>
        {/* RHS: PAST COURSES */}
        <Box sx={{ width: "50%" }}>
          <Card elevation={2} sx={{ backgroundColor: "#F7F7F7" }}>
            <CardContent>
              <Stack direction="row">
                <Typography sx={{ display: "inline" }} variant="h6">
                  Past Courses
                </Typography>
                <FormControl sx={{ m: 1, minWidth: 80 }} size="small">
                  <InputLabel id="demo-select-small">Term</InputLabel>
                  <Select
                    labelId="demo-select-small"
                    id="demo-select-small"
                    value={term}
                    label="Term"
                    onChange={handleChange}
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
              <Paper elevation={0} sx={{ padding: 2 }}>
                <Paper elevation={0} sx={{ backgroundColor: "#F7F7F7", p: 2 }}>
                  Added past courses will appear here
                </Paper>
              </Paper>
            </CardContent>
          </Card>
        </Box>
      </Stack>
    </Box>
  );
}
