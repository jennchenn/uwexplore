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

import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    // backgroundColor: theme.palette.common.black,
    // color: theme.palette.common.white,
    fontSize: 12,
    padding: "2px",
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 10,
    padding: "2px",
  },
}));

export default function SearchCards() {
  return (
    <Box>
      {courses.map((course, i) => (
        <Card style={{ marginTop: "20px" }} elevation={2}>
          <CardContent>
            <Typography variant="h5">{course.name}</Typography>
            <Typography variant="body2">
              {course.department} {course.code} - {course.description}
            </Typography>
            <TableContainer component={Paper}>
              <Table aria-label="simple table" size="small">
                <TableHead>
                  <TableRow>
                    <StyledTableCell>Section</StyledTableCell>
                    <StyledTableCell align="right">Class</StyledTableCell>
                    <StyledTableCell align="right">Enrolled</StyledTableCell>
                    <StyledTableCell align="right">Time</StyledTableCell>
                    <StyledTableCell align="right">Date</StyledTableCell>
                    <StyledTableCell align="right">Location</StyledTableCell>
                    <StyledTableCell align="right">Instructor</StyledTableCell>
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
                      <StyledTableCell align="right">
                        {section.class_number}
                      </StyledTableCell>
                      <StyledTableCell align="right">
                        {section.enrolled_number}/{section.capacity}
                      </StyledTableCell>
                      <StyledTableCell align="right">
                        {/* there's gotta be an easier way LOL - find some library */}
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
                      <StyledTableCell align="right">
                        {/* todo: fix this issue! */}
                        {section.day.toString().slice(0, 1)}
                      </StyledTableCell>
                      <StyledTableCell align="right">
                        {section.location}
                      </StyledTableCell>
                      <StyledTableCell align="right">N/A</StyledTableCell>
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
