import { useEffect, useState } from "react";
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
import PastCourseCard from "./PastCourseCard";
import courseClients from "../APIClients/CourseClient";

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

interface CeabBaseProps {
  handleCeabPlanChange: any;
  pastCourses: { [key: string]: string[] };
  setPastCourses: (value: { [term: string]: string[] }) => void;
  ceabCounts: any;
  ceabOnSchedule: any;
  tokenId: string | null;
}

export default function CeabBase({
  handleCeabPlanChange,
  pastCourses,
  setPastCourses,
  ceabCounts,
  ceabOnSchedule,
  tokenId,
}: CeabBaseProps) {
  const [term, setTerm] = useState("all");
  const [courseList, setCourseList] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    let newList: { [key: string]: string } = {};
    if (term === "all") {
      for (let term in pastCourses) {
        for (let course of pastCourses[term]) {
          newList[course] = term;
        }
      }
    } else {
      for (let course of pastCourses[term]) newList[course] = term;
    }
    setCourseList(newList);
  }, [term, pastCourses]);

  const handlePastCourseRemoval = (courseCode: string) => {
    courseClients.getCourses(`?query=${courseCode}`).then((value: any) => {
      if (value.length !== 0) {
        const courseId = value[0].id;
        courseClients
          .deletePastCourses(tokenId, courseId)
          .then((value) => setPastCourses(value));
      }
    });

    let tempDict = courseList;
    delete tempDict[courseCode];
    setCourseList(tempDict);
  };

  const handleTermChange = (event: SelectChangeEvent) => {
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
                {CeabRequirements.map((requirement: any, index) => (
                  <ProgressBar
                    label={requirement.label}
                    // todo: get user's ceab vals from taken courses and map properly
                    completed={
                      ceabCounts &&
                      ceabOnSchedule &&
                      ceabCounts[requirement.label] &&
                      ceabOnSchedule[requirement.label]
                        ? ceabCounts[requirement.label].completed +
                          ceabOnSchedule[requirement.label].completed
                        : ceabOnSchedule && ceabOnSchedule[requirement.label]
                        ? ceabOnSchedule[requirement.label].completed
                        : 0
                    }
                    total={requirement.requirement}
                    key={index}
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
                  Course Planning
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
                  <InputLabel id="term-select-small">TERM</InputLabel>
                  <Select
                    labelId="term-select-small"
                    value={term}
                    onChange={handleTermChange}
                    label="TERM"
                    sx={{
                      "& .MuiSelect-select": {
                        color: "white",
                      },
                    }}
                  >
                    <MenuItem value="all">ALL</MenuItem>
                    <MenuItem value="term_1a">1A</MenuItem>
                    <MenuItem value="term_1b">1B</MenuItem>
                    <MenuItem value="term_2a">2A</MenuItem>
                    <MenuItem value="term_2b">2B</MenuItem>
                    <MenuItem value="term_3a">3A</MenuItem>
                    <MenuItem value="term_3b">3B</MenuItem>
                    <MenuItem value="term_4a">4A</MenuItem>
                    <MenuItem value="term_4b">4B</MenuItem>
                    <MenuItem value="term_other">Other</MenuItem>
                  </Select>
                </FormControl>
              </Stack>
              <Box sx={{ display: "flex", height: "100%", flex: 1 }}>
                <Paper
                  elevation={0}
                  sx={{
                    paddingRight: 2,
                    paddingLeft: 2,
                    paddingBottom: 2,
                    width: "100%",
                    height: "433px",
                    overflowY: "auto",
                    borderRadius: "var(--border-radius)",
                  }}
                >
                  {!Object.keys(courseList).length ? (
                    <Paper
                      elevation={0}
                      sx={{
                        backgroundColor: "var(--bg-3)",
                        p: 2,
                        borderRadius: "var(--border-radius)",
                        textAlign: "center",
                        marginTop: "16px",
                      }}
                    >
                      <h5 style={{ margin: "0px", color: "var(--black-4)" }}>
                        <em>
                          Added courses to your course plan will appear here
                        </em>
                      </h5>
                    </Paper>
                  ) : (
                    Object.keys(courseList).map((courseCode, index) => (
                      <PastCourseCard
                        key={`past-courses-cards-${index}`}
                        courseCode={courseCode}
                        completedTerm={courseList[courseCode]}
                        handleRemove={handlePastCourseRemoval}
                        handleCeabPlanChange={handleCeabPlanChange}
                      />
                    ))
                  )}
                </Paper>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Stack>
    </Grid>
  );
}
