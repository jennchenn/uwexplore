import { Card, CardContent, IconButton, Stack, Tooltip } from "@mui/material";
import "../styles/CourseCard.css";

//MUI icon imports
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";

import { Props } from "../App";

interface PastCourseCardProps extends Props {
  courseCode: string;
  completedTerm: string;
  handleCeabPlanChange: any;
  handleRemove: (code: string) => void;
}

export default function PastCourseCard({
  ...PastCourseCardProps
}: PastCourseCardProps) {
  return (
    <Card
      className={`course-card-container ${PastCourseCardProps.className}`}
      style={PastCourseCardProps.style}
      elevation={2}
      key={PastCourseCardProps.courseCode}
      sx={{
        "& .MuiCardContent-root": {
          padding: "10px",
        },
        borderRadius: "var(--border-radius)",
        backgroundColor: "var(--bg-3)",
      }}
    >
      <CardContent>
        <Stack
          direction="row"
          style={{
            display: "flex",
            alignItems: "center",
          }}
        >
          <Tooltip title={PastCourseCardProps.courseCode} arrow>
            <div
              className="heading-3"
              style={{
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {PastCourseCardProps.courseCode}
            </div>
          </Tooltip>
          <Tooltip
            title={`COMPLETED ${PastCourseCardProps.completedTerm
              .split("_")[1]
              .toUpperCase()}`}
            arrow
          >
            <div
              className="heading-4"
              style={{
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                marginRight: "0px",
                marginLeft: "auto",
                color: "var(--black-3)",
                fontWeight: "var(--font-weight-regular)",
              }}
            >
              COMPLETED{" "}
              {PastCourseCardProps.completedTerm.split("_")[1].toUpperCase()}
            </div>
          </Tooltip>
          <Tooltip title="Delete from past courses" arrow>
            <IconButton
              sx={{ marginLeft: "5px", marginRight: "0px", padding: "4px" }}
              onClick={() => {
                PastCourseCardProps.handleRemove(
                  PastCourseCardProps.courseCode,
                );
                PastCourseCardProps.handleCeabPlanChange();
              }}
            >
              <DeleteOutlineIcon
                sx={{
                  backgroundColor: "var(--alerts-warning-1)",
                  borderRadius: "50%",
                  padding: "4px",
                  color: "white",
                  fontSize: "17px",
                  marginRight: "1px",
                }}
              />
            </IconButton>
          </Tooltip>
        </Stack>
      </CardContent>
    </Card>
  );
}
