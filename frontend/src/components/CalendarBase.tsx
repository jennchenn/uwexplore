import { useMemo, useCallback, useState } from "react";
import Box from "@mui/material/Box";
import moment from "moment";
import "./CalendarBase.scss";
import events from "../events";
import CalendarModal from "./CalendarModal";

const ReactBigCalendar = require("react-big-calendar");
const { Calendar, momentLocalizer } = ReactBigCalendar;

export default function CalendarBase() {
  // localizer is required
  const localizer = momentLocalizer(moment);

  // for popup modal when clicking a course on the calendar
  const [modalOpen, setModalOpen] = useState(false);
  const [modalTitle, setmodalTitle] = useState("placeholder title");
  const [modalInfo, setmodalInfo] = useState("placeholder info");

  const handleCourseSelectEvent = useCallback((event: HTMLTextAreaElement) => {
    setmodalTitle(event.title);
    setmodalInfo(event.value);
    setModalOpen(true);
  }, []);

  const { defaultDate, formats, views } = useMemo(
    () => ({
      // arbitrary starting date set to Jan, 1, 2023 - has an effect on dates used to set events
      defaultDate: new Date(2023, 0, 1),
      formats: {
        dayFormat: (date: Date) => localizer.format(date, "ddd"),
      },
      views: ["work_week"],
    }),
    [localizer],
  );

  return (
    <Box className="box-style">
      <div className="calendar-height">
        <Calendar
          defaultDate={defaultDate}
          defaultView={views}
          events={events}
          formats={formats}
          localizer={localizer}
          // shows time from 8AM to 10PM
          min={new Date(0, 0, 0, 8, 0, 0)}
          max={new Date(0, 0, 0, 22, 0, 0)}
          onSelectEvent={handleCourseSelectEvent}
          toolbar={false}
          views={views}
        ></Calendar>
        <CalendarModal
          modalTitle={modalTitle}
          modalInfo={modalInfo}
          modalOpen={modalOpen}
          setModalOpen={setModalOpen}
        ></CalendarModal>
      </div>
    </Box>
  );
}
