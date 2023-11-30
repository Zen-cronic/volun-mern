const sortUpcomingEventsDates = require("../../helpers/sortUpcomingEventsDates");
const { closestTo, isAfter, isEqual } = require("date-fns");

jest.mock("date-fns");

describe("sortUpcomingEventsDates function", () => {
  describe("given that a non-array value is passed as param", () => {
    it("should thron an error", () => {});
  });

  describe("given that NOT all of element in the array param is an Object", () => {
    it("should throw an error", () => {});
  });

  describe("given that a valid array is passed as param", () => {
    it("should return", () => {
      const unsortedEvents = [
        {
          eventName: "Event 1",
          _id: "1",
          eventDates: [new Date("2024-12-30"), new Date("2024-12-29")],
        },
        {
          eventName: "Event 2",
          _id: "2",
          eventDates: [new Date("2023-11-02"), new Date("2023-11-03")],
        },
        {
          eventName: "Event 3",
          _id: "3",
          eventDates: [new Date("2023-11-04"), new Date("2024-12-01")],
        },
      ];

      const sortedEvents = [
        {
          eventName: "Event 1",
          eventId: "1",
          eventDate:  new Date("2024-12-29"),
        },
        {
          eventName: "Event 3",
          eventId: "3",
          eventDate:  new Date("2024-12-01"),
        },
      ];

  

      closestTo
        .mockReturnValueOnce(new Date("2024-12-29"))
        .mockReturnValueOnce(new Date("2023-11-02"))
        .mockReturnValueOnce(new Date("2023-11-03"))
        .mockReturnValueOnce(undefined)
        .mockReturnValueOnce(new Date("2023-11-04"))
        .mockReturnValueOnce(new Date("2024-12-01"))
        
      isAfter
        .mockReturnValueOnce(true)
        .mockReturnValueOnce(false)
        .mockReturnValueOnce(false)
        .mockReturnValueOnce(false)
        .mockReturnValueOnce(true);

      // isEqual
      // .mockReturnValue(false)

      const result = sortUpcomingEventsDates(unsortedEvents);

      expect(result).toEqual(sortedEvents);
    });
  });
});
