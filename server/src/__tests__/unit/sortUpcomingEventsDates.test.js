const sortUpcomingEventsDates = require("../../helpers/sortUpcomingEventsDates");
const { closestTo, isAfter, isEqual } = require("date-fns");

jest.mock("date-fns");

describe("sortUpcomingEventsDates function", () => {
  describe("given that a non-array value is passed as param", () => {
    it("should throw an error", () => {
      const nonArrayValues = [
        1,
        "string",
        true,
        null,
        undefined,
        { key: "value" },
        new Date(),
        function () {},
      ];

      nonArrayValues.forEach(val => {

        expect(() => sortUpcomingEventsDates(val)).toThrow(new Error("Must be an array - sortUpcomingEventsDates"))
      })
    });
  });

  describe("given that NOT all of element in the array param is an Object", () => {
    it("should throw an error", () => {

      const events = [
        { _id: '1', eventName: 'Event 1', eventDates: [new Date(2022, 0, 1), new Date(2022, 0, 2)] },
        { _id: '2', eventName: 'Event 2', eventDates: [new Date(2022, 0, 3), new Date(2022, 0, 4)] },
        "not an object",
        // { _id: '3', eventName: 'Event 3', eventDates: [new Date(2022, 0, 5), new Date(2022, 0, 6)] }
      ];

      expect(() => sortUpcomingEventsDates(events)).toThrow( new Error("Must be an array of objects - sortUpcomingEventsDates"));
      
    });
  });

  describe("given that a valid array is passed as param", () => {
    it("should return", () => {
      const today = new Date(Date.now());

      const pastDate1 = new Date(today);
      pastDate1.setDate(pastDate1.getDate() - 1);

      const pastDate2 = new Date(today);
      pastDate2.setDate(pastDate2.getDate() - 2);

      const futureDate1 = new Date(today);
      futureDate1.setDate(futureDate1.getDate() + 1);

      const futureDate2 = new Date(today);
      futureDate2.setDate(futureDate2.getDate() + 2);

      // const a= [pastDate1, pastDate2	, today, futureDate1, futureDate2].map(date => console.log(date.getDate()))

      const unsortedEvents = [
        {
          eventName: "Event 1",
          _id: "1",
          // eventDates: [new Date("2024-12-30"), new Date("2024-12-29")],
          eventDates: [futureDate2, futureDate1],
        },
        {
          eventName: "Event 2",
          _id: "2",
          // eventDates: [new Date("2023-11-02"), new Date("2023-11-03")],
          eventDates: [pastDate1, pastDate2],
        },
        {
          eventName: "Event 3",
          _id: "3",
          // eventDates: [new Date("2023-11-04"), new Date("2024-12-01")],
          eventDates: [pastDate2, futureDate2],
        },
      ];

      const sortedEvents = [
        {
          eventName: "Event 1",
          eventId: "1",
          // eventDate:  new Date("2024-12-29"),
          eventDate: futureDate1,
        },
        {
          eventName: "Event 3",
          eventId: "3",
          // eventDate:  new Date("2024-12-01"),
          eventDate: futureDate2,
        },
      ];

      closestTo
        // .mockReturnValueOnce(new Date("2024-12-29"))
        .mockReturnValueOnce(futureDate1)

        // .mockReturnValueOnce(new Date("2023-11-02"))
        .mockReturnValueOnce(pastDate1)

        // .mockReturnValueOnce(new Date("2023-11-03"))
        .mockReturnValueOnce(pastDate2)

        .mockReturnValueOnce(undefined)

        // .mockReturnValueOnce(new Date("2023-11-04"))
        .mockReturnValueOnce(pastDate2)

        // .mockReturnValueOnce(new Date("2024-12-01"))
        .mockReturnValueOnce(futureDate2);

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
