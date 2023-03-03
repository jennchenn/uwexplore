import { useState } from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Grid from "@mui/material/Unstable_Grid2";
import Typography from "@mui/material/Typography";
import Collapse from "@mui/material/Collapse";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";

import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

export default function CoursesOnCalendar() {
  const [expanded, setExpanded] = useState(false);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  return (
    <Grid xs={5}>
      <Card
        sx={{
          backgroundColor: "var(--primary)",
          position: "fixed",
          left: "0",
          bottom: "0",
          width: "inherit",
          //   below to try to mitigate some scrollbar overlap
          //   width: `${(5 / 12) * 100 - 1}%`,
          borderTopLeftRadius: "1em",
          borderTopRightRadius: "1em",
          borderBottomLeftRadius: "0px",
          borderBottomRightRadius: "0px",
        }}
      >
        <CardContent sx={{ marginBottom: "-16px" }}>
          <Stack
            direction="row"
            sx={{ display: "flex", justifyContent: "space-between" }}
          >
            <Typography
              variant="h6"
              style={{ fontWeight: "bold", color: "white" }}
            >
              Added Courses
            </Typography>
            <Box>
              <IconButton
                aria-label="expand more"
                onClick={() => handleExpandClick()}
                sx={{ align: "right" }}
              >
                {expanded ? <ExpandMoreIcon /> : <ExpandLessIcon />}
              </IconButton>
            </Box>
          </Stack>
          <Collapse in={expanded}>
            <Stack spacing={1}>
              <Card>
                <CardContent>
                  <Typography variant="h6" style={{ fontWeight: "bold" }}>
                    SYDE 123
                  </Typography>
                </CardContent>
              </Card>
              <Card>
                <CardContent>
                  <Typography variant="h6" style={{ fontWeight: "bold" }}>
                    SYDE 123
                  </Typography>
                </CardContent>
              </Card>
              <Card>
                <CardContent>
                  <Typography variant="h6" style={{ fontWeight: "bold" }}>
                    SYDE 123
                  </Typography>
                </CardContent>
              </Card>
            </Stack>
          </Collapse>
        </CardContent>
      </Card>
    </Grid>
  );
}
