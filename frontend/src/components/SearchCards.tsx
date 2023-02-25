// import { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import InputAdornment from "@mui/material/InputAdornment";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import courses from "../APIClients/courses.js";
import IconButton from "@mui/material/IconButton";

import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

import AddCircleIcon from "@mui/icons-material/AddCircle";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import StarIcon from "@mui/icons-material/Star";
// TODO: add button, favourites button, collapse func. ~ask about obtaining instructor?

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    // backgroundColor: theme.palette.common.black,
    // color: theme.palette.common.white,
    fontSize: 12,
    padding: "2px",
    fontWeight: "bold",
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: "0.8rem",
    padding: "2px",
  },
}));

export default function SearchCards() {
  return (
    <Box>
      {courses.map((course, i) => (
        <Card style={{ marginTop: "20px" }} elevation={2} key={i}>
          <CardContent>
            {/* todo: possibly get rid of stack and just use a div or smtn, 
            so i can align the add button all the way right */}
            <Stack
              direction="row"
              style={{
                display: "flex",
                alignItems: "center",
                flexWrap: "wrap",
              }}
            >
              {/* https://stackoverflow.com/questions/58257228/how-to-switch-materialui-icon-when-clicked */}
              <IconButton
                aria-label="expand more"
                style={{ paddingLeft: "0px" }}
              >
                <StarBorderIcon />
              </IconButton>
              <Typography variant="h6">{course.name}</Typography>
              <IconButton aria-label="add course">
                <AddCircleIcon />
              </IconButton>
              <IconButton aria-label="expand more">
                <ExpandLessIcon />
              </IconButton>
            </Stack>
            <Typography variant="body2">
              {course.department} {course.code} - {course.description}
            </Typography>
            <br />
            <TableContainer component={Paper}>
              <Table aria-label="simple table" size="small">
                <TableHead>
                  <TableRow>
                    <StyledTableCell>Section</StyledTableCell>
                    <StyledTableCell>Class</StyledTableCell>
                    <StyledTableCell>Enrolled</StyledTableCell>
                    <StyledTableCell>Time</StyledTableCell>
                    <StyledTableCell>Date</StyledTableCell>
                    <StyledTableCell>Location</StyledTableCell>
                    <StyledTableCell>Instructor</StyledTableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {course.sections.map((section) => (
                    <TableRow
                      key={section.class_number}
                      sx={{
                        "&:last-child td, &:last-child th": { border: 0 },
                      }}
                    >
                      <StyledTableCell component="th" scope="row">
                        {section.type.slice(0, 3)} {section.number}
                      </StyledTableCell>
                      <StyledTableCell>{section.class_number}</StyledTableCell>
                      <StyledTableCell>
                        {section.enrolled_number}/{section.capacity}
                      </StyledTableCell>
                      <StyledTableCell>
                        {/* there's gotta be an easier way LOL - find some library */}
                        {/* if doing it like this, use 24hr time to save some space... */}
                        {Math.floor(section.start_time / 60) > 12
                          ? Math.floor(section.start_time / 60) - 12
                          : Math.floor(section.start_time / 60)}
                        :
                        {section.start_time % 60 === 0
                          ? "00"
                          : section.start_time % 60}{" "}
                        {Math.floor(section.start_time / 60) > 12 ? "PM" : "AM"}
                        {" - "}
                        {Math.floor(section.end_time / 60) > 12
                          ? Math.floor(section.end_time / 60) - 12
                          : Math.floor(section.end_time / 60)}
                        :
                        {section.end_time % 60 === 0
                          ? "00"
                          : section.end_time % 60}{" "}
                        {Math.floor(section.end_time / 60) > 12 ? "PM" : "AM"}
                      </StyledTableCell>
                      <StyledTableCell>
                        {/* todo: fix this issue! */}
                        {section.day.toString().slice(0, 1)}
                      </StyledTableCell>
                      <StyledTableCell>{section.location}</StyledTableCell>
                      <StyledTableCell>N/A</StyledTableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      ))}
    </Box>
  );
}
