import { useMemo } from "react";
import Box from "@mui/material/Box";
import moment from "moment";
import "./CalendarBase.scss";

const ReactBigCalendar = require("react-big-calendar");
const { Calendar, momentLocalizer } = ReactBigCalendar;

export default function CalendarBase() {
  const localizer = momentLocalizer(moment);

  const { defaultDate, formats, views } = useMemo(
    () => ({
      // arbitrary starting date
      defaultDate: new Date(2023, 0, 2),
      formats: {
        dayFormat: (date: Date) => localizer.format(date, "ddd"),
      },
      views: ["work_week"],
    }),
    [],
  );

  return (
    <Box className="box-style">
      <div className="calendar-height">
        <Calendar
          localizer={localizer}
          defaultDate={defaultDate}
          defaultView={views}
          views={views}
          toolbar={false}
          formats={formats}
          min={new Date(0, 0, 0, 8, 0, 0)}
          max={new Date(0, 0, 0, 22, 0, 0)}
        ></Calendar>
      </div>
    </Box>
  );
}
