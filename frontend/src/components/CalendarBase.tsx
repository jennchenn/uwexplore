import { useMemo, useCallback, useState } from "react";
import Box from "@mui/material/Box";
import moment from "moment";
import "../styles/CalendarBase.scss";
import backgroundColors from "../styles/calendarCourseBackgroundColors";
import courses from "../APIClients/courses";
import CalendarModal from "./CalendarModal";

const ReactBigCalendar = require("react-big-calendar");
const { Calendar, momentLocalizer } = ReactBigCalendar;

// todo: remove once we have a more permanent solution
const warningImg =
  "https://static.vecteezy.com/system/resources/previews/012/042/292/original/warning-sign-icon-transparent-background-free-png.png";

export default function CalendarBase() {
  // localizer is required
  const localizer = momentLocalizer(moment);

  // for popup modal when clicking a course on the calendar
  const [modalOpen, setModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState("placeholder title");
  const [modalId, setModalId] = useState("placeholder id");
  const [modalInfo, setModalInfo] = useState("placeholder info");
  const [modalConflicts, setModalConflicts] = useState([] as any);

  /* returns an array that contains an object for each individual class event
      ex: a SYDE TUT on both T and TH will have an entry for each */
  const getEachClass = useCallback((allCourses: any) => {
    /* weekdays in milliseconds corresponding to default dates set on cal
     Calendar is currently set to the week of Jan 02(Mon)-06(Fri) */
    const unixWeekdays: any = {
      MONDAY: 1672635600000,
      TUESDAY: 1672722000000,
      WEDNESDAY: 1672808400000,
      THURSDAY: 1672894800000,
      FRIDAY: 1672981200000,
    };
    return allCourses.flatMap((course: any) => {
      return course.sections.flatMap((section: any) => {
        // new title property that appears on the event (ex. "SYDE 411 - LEC")
        const courseTitle = `${course.department} ${
          course.code
        } - ${section.type.slice(0, 3)}`;
        // this mapping splits up the day array to make individual entries
        return section.day.map((day: any) => ({
          ...section,
          // add in the parent course ID for colour assignment
          courseId: course.id,
          // create a unique id for this specific class section
          uniqueClassId: `${courseTitle} ${day} ${new Date(
            unixWeekdays[day] + section.start_time,
          )}`,
          day,
          title: courseTitle,
          // times are created from the UNIX weekday + section time, both in ms)
          start_time: new Date(unixWeekdays[day] + section.start_time),
          end_time: new Date(unixWeekdays[day] + section.end_time),
        }));
      });
    });
  }, []);

  const findOverlappingClasses = (classes: any) => {
    let overlaps = [];
    for (let i = 0; i < classes.length; i++) {
      for (let j = i + 1; j < classes.length; j++) {
        if (
          classes[i].end_time > classes[j].start_time &&
          classes[j].end_time > classes[i].start_time
        ) {
          if (classes[i].uniqueClassId in overlaps) {
            overlaps[classes[i].uniqueClassId].push(classes[j].title);
          } else {
            overlaps[classes[i].uniqueClassId] = [classes[j].title];
          }

          if (classes[j].uniqueClassId in overlaps) {
            overlaps[classes[j].uniqueClassId].push(classes[i].title);
          } else {
            overlaps[classes[j].uniqueClassId] = [classes[i].title];
          }
          // todo: may need to get the start/end time of the overlap if
          // we want to limit the number of courses we all to conflict at once
        }
      }
    }
    return overlaps;
  };

  // classes = the events that appear on the calendar
  const classes = getEachClass(courses);
  const overlaps = findOverlappingClasses(classes);

  const handleCourseSelectEvent = useCallback(
    (event: any) => {
      // assemble course time from start and end times
      let eventTime = "";
      if (event.start_time) {
        eventTime = `${localizer.format(
          event.start_time,
          "h:mm a",
        )} - ${localizer.format(event.end_time, "h:mm a")}`.toUpperCase();
      }

      // assemble course details with checks for empty fields
      let eventDetails = `${eventTime === ("" || undefined) ? "" : eventTime} ${
        event.location === ("" || undefined) ? "" : "\n" + event.location
      } ${
        event.instructor === ("" || undefined) ? "" : "\n" + event.instructor
      }`;

      setModalTitle(event.title);
      setModalId(event.courseId);
      setModalInfo(eventDetails);
      setModalConflicts(overlaps[event.uniqueClassId]);
      setModalOpen(true);
    },
    [localizer, overlaps],
  );

  const eventStyleGetter = (event: any) => {
    let style = {
      backgroundColor: courseColors[event.courseId],
      border: "0px",
      // styles below are for course conflicts
      backgroundImage:
        event.uniqueClassId in overlaps ? `url(${warningImg})` : "",
      backgroundPosition: "left bottom",
      backgroundRepeat: "no-repeat",
      backgroundSize: "1em",
    };
    return {
      style: style,
    };
  };

  const courseColors = useMemo(() => {
    const results: any = {};
    let colorMap = new Map();
    let colorIndex = 0;
    for (let event of classes) {
      let courseId = event.courseId;
      if (!colorMap.has(courseId)) {
        // Get a unique hex color for a course
        colorMap.set(
          courseId,
          // using mod so colours repeat after end of list is reached
          backgroundColors[colorIndex++ % backgroundColors.length],
        );
      }
      results[event.courseId] = colorMap.get(courseId);
    }
    return results;
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
          events={classes}
          endAccessor={(classes: any) => {
            return classes.end_time;
          }}
          startAccessor={(classes: any) => {
            return classes.start_time;
          }}
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
          modalId={modalId}
          modalInfo={modalInfo}
          modalOpen={modalOpen}
          modalConflicts={modalConflicts}
          setModalOpen={setModalOpen}
          courseColors={courseColors}
          availableBackgroundColors={backgroundColors}
        ></CalendarModal>
      </div>
    </Box>
  );
}
