// Date(year, month, day, hour, minute)
// Calendar currently set to the week of Jan 02(Mon)-06(Fri)

const events = [
  {
    id: 0,
    title: "Sample Class 1",
    location: "E7 4000",
    instructor: "N.H. Bobby",
    start: new Date(2023, 0, 2, 9, 30),
    end: new Date(2023, 0, 2, 12),
  },
  {
    id: 1,
    title: "Sample Class 2",
    location: "E5 6004",
    instructor: "Sean Speziale",
    start: new Date(2023, 0, 3, 12),
    end: new Date(2023, 0, 3, 15),
  },
  {
    id: 2,
    title: "Sample Class 3",
    location: "E5 6004",
    instructor: "Sean Speziale",
    start: new Date(2023, 0, 3, 14),
    end: new Date(2023, 0, 3, 16, 30),
  },
  {
    id: 3,
    title: "Sample Class 2",
    location: "E5 6004",
    instructor: "Sean Speziale",
    start: new Date(2023, 0, 2, 15),
    end: new Date(2023, 0, 2, 17),
  },
  {
    id: 5,
    title: "Sample Class 4",
    location: "E5 6004",
    instructor: "",
    start: new Date(2023, 0, 2, 15),
    end: new Date(2023, 0, 2, 17),
  },
  {
    id: 6,
    title: "Sample Class 1",
    location: "",
    instructor: "Sean Speziale",
    start: new Date(2023, 0, 5, 10, 30),
    end: new Date(2023, 0, 5, 14, 20),
  },
];

export default events;
