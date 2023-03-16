import { useMemo, useCallback, useState, useEffect } from "react";
import "../styles/CalendarBase.scss";
import backgroundColors from "../styles/calendarCourseBackgroundColors";
import moment from "moment";

import Box from "@mui/material/Box";

import CalendarModal from "./CalendarModal";
import warningImg from "../images/warning.png";

const ReactBigCalendar = require("react-big-calendar");
const { Calendar, momentLocalizer } = ReactBigCalendar;

interface courseHoverProps {
  courseHovered: any;
  coursesOnSchedule: any;
  setCoursesOnSchedule: any;
  scheduleId: string;
}

export default function CalendarBase({
  courseHovered,
  coursesOnSchedule,
  setCoursesOnSchedule,
  scheduleId,
}: courseHoverProps) {
  // localizer is required
  const localizer = momentLocalizer(moment);

  // for popup modal when clicking a course on the calendar
  const [modalOpen, setModalOpen] = useState(false);
  const [modalInfo, setModalInfo] = useState("placeholder info");
  const [modalConflicts, setModalConflicts] = useState([] as any);
  const [modalClass, setModalClass] = useState({} as any);

  const [classes, setClasses] = useState([] as any);

  /* returns an array that contains an object for each individual class event
      ex: a SYDE TUT on both T and TH will have an entry for each */
  const getEachClass = useCallback((allCourses: any) => {
    /* weekdays in milliseconds corresponding to default dates set on cal
     Calendar is currently set to the week of Jan 02(Mon)-06(Fri), 2023 */
    const unixWeekdays: any = {
      MONDAY: 1672635600000,
      TUESDAY: 1672722000000,
      WEDNESDAY: 1672808400000,
      THURSDAY: 1672894800000,
      FRIDAY: 1672981200000,
    };
    let colorIndex = 0;
    return allCourses.flatMap((course: any) => {
      if (course.sections !== null) {
        return course.sections.flatMap((section: any) => {
          // new title property that appears on the event (ex. "SYDE 411 - LEC")
          const courseTitle = `${course.department} ${course.code} - ${section.type}`;
          // this mapping splits up the day array to make individual entries
          return section.day.map((day: any) => ({
            ...section,
            // add in the parent course ID for colour assignment
            courseId: course.id,
            color: [
              course.color === "#000000"
                ? backgroundColors[colorIndex++ % backgroundColors.length]
                : course.color,
            ],
            // create a unique id for this specific class section
            uniqueClassId: `${day} ${section.id}`,
            uid: course.uid,
            day,
            title: courseTitle,
            // times are created from the UNIX weekday + section time, both in ms)
            start_time: new Date(unixWeekdays[day] + section.start_time),
            end_time: new Date(unixWeekdays[day] + section.end_time),
          }));
        });
      } else {
        return [];
      }
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

  useEffect(() => {
    setClasses(getEachClass(coursesOnSchedule));
  }, [coursesOnSchedule]);

  const overlaps = findOverlappingClasses(classes);

  let hoverEvents = (hovered: any) => {
    let course = [hovered];
    if ("sections" in hovered) {
      let hoverSections = getEachClass(course);
      return hoverSections.map((section: any) => ({
        ...section,
        background: true,
      }));
    } else {
      return course;
    }
  };

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
      let eventDetails = `${
        eventTime === ("" || undefined) ? "N/A" : eventTime
      } ${
        event.location === ("" || undefined) ? "N/A" : "\n" + event.location
      } ${
        event.instructor === ("" || undefined) ? "N/A" : "\n" + event.instructor
      }`;

      setModalClass(event);
      setModalInfo(eventDetails);
      setModalConflicts(overlaps[event.uniqueClassId]);
      setModalOpen(true);
    },
    [localizer, overlaps],
  );

  const eventStyleGetter = (event: any) => {
    let style = {
      // some checks to see if the course is being hovered
      backgroundColor: event.background ? "var(--main-purple-4)" : event.color,
      zIndex: event.background ? "10" : "",
      opacity: event.background ? 0.9 : 1,
      border: "0px",
      // styles below are for course conflicts
      backgroundImage:
        event.uniqueClassId in overlaps && event.background !== true
          ? `url(${warningImg})`
          : "",
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
        dayFormat: (date: Date) => localizer.format(date, "ddd").toUpperCase(),
      },
      views: ["work_week"],
    }),
    [localizer],
  );

  return (
    <Box className="box-style">
      <div className="calendar-height">
        <Calendar
          backgroundEvents={hoverEvents(courseHovered)}
          dayLayoutAlgorithm={"no-overlap"}
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
          modalClass={modalClass}
          modalInfo={modalInfo}
          modalOpen={modalOpen}
          modalConflicts={modalConflicts}
          setModalOpen={setModalOpen}
          availableBackgroundColors={backgroundColors}
          setCoursesOnSchedule={setCoursesOnSchedule}
          scheduleId={scheduleId}
        ></CalendarModal>
      </div>
    </Box>
  );
}
