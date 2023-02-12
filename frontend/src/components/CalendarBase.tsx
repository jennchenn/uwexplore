import { useMemo, useCallback, useState } from "react";
import Box from "@mui/material/Box";
import moment from "moment";
import "./CalendarBase.scss";
import events from "../APIClients/events";
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

  const eventStyleGetter = (event: HTMLTextAreaElement) => {
    let style = {
      backgroundColor: courseColors[event.title],
      border: "0px",
    };
    return {
      style: style,
    };
  };

  // colour options for courses on calendar
  const availableColors = useMemo(() => {
    const availableBackgroundColors = [
      "#ff6961",
      "#ffb480",
      "#e5d54a",
      "#42d6a4",
      "#08cad1",
      "#59adf6",
      "#9d94ff",
      "#c780e8",
    ];
    return availableBackgroundColors;
  }, []);

  const courseColors = useMemo(() => {
    const results: any = {};
    let colorMap = new Map();
    let colorIndex = 0;
    for (let event of events) {
      let title = event.title;
      if (!colorMap.has(title)) {
        // Get a unique hex color for this title
        colorMap.set(
          title,
          availableColors[colorIndex++ % availableColors.length],
        );
      }
      results[event.title] = colorMap.get(title);
    }
    return results;
  }, [availableColors]);

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
          eventPropGetter={eventStyleGetter}
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
          courseColors={courseColors}
          availableBackgroundColors={availableColors}
        ></CalendarModal>
      </div>
    </Box>
  );
}
