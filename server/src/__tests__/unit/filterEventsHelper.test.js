const {
  filterEventsByDate,
  filterEventsByVenue,
  filterEventsOpen,
  filterEventsUpcomingShifts,
  filteredTagsSort,
} = require("../../helpers/filterEventsHelper");

const convertLocalDateString = require("../../helpers/convertLocalDateString");
const hourMinFormat = require("../../helpers/hourMinFormat");
const sortUpcomingEventsDates = require("../../helpers/sortUpcomingEventsDates");
const Event = require("../../models/Event");

jest.mock("../../models/Event");
jest.mock("../../helpers/sortUpcomingEventsDates");
jest.mock("../../helpers/hourMinFormat");
jest.mock("../../helpers/convertLocalDateString");

describe("filterEventsHelper Service", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  describe("filterEventsByDate", () => {
    describe("given the param is NOT a string with the regex format", () => {
      it("should rejects with an error", async () => {
        const invalidDateStrings = [
          //   "2021-13-01", // Month greater than 12
          //   "2021-12-32", // Day greater than 31

          "202-12-01", // Year with 3 digits
          "20212-12-01", // Year with 5 digits
          "2021/12/01", // Wrong separator
          "2021-12-1", // Day with 1 digit
          "2021-1-01", // Month with 1 digit
          "2021-12", // Missing day
          "12-01", // Missing year and day
          "2021-12-01-01", // Extra numbers
          "abcd-ef-gh", // Non-numeric characters
          "", // Empty string
        ];

        const testPromises = invalidDateStrings.map(async (val) => {
          // console.log(val);
          await expect(() => filterEventsByDate(val)).rejects.toThrow(
            new Error(
              "date string must be in format yyyy-MM-dd - filterEventsByDate"
            )
          );
        });

        await Promise.all(testPromises);
      });
    });

    describe("given a valid date string is passed", () => {
      it("should return the filtered string array of event ids", async () => {
        const unfilteredEvents = [
          { _id: "1", localEventDates: ["2022-12-31 00:00:00 EDT"] },
          { _id: "2", localEventDates: ["2022-12-31 00:00:00 EDT"] },
          { _id: "3", localEventDates: ["2022-12-30 00:00:00 EDT"] },
        ];

        Event.find.mockReturnValue({
          lean: jest.fn().mockReturnThis(),
          exec: jest.fn().mockResolvedValue(unfilteredEvents),
        });

        hourMinFormat.mockReturnValue("T00:00");
        convertLocalDateString.mockReturnValue("2022-12-31 00:00:00 EDT");

        const result = await filterEventsByDate("2022-12-31");

        expect(result).toEqual(["1", "2"]);
        expect(Event.find).toHaveBeenCalled();
        expect(hourMinFormat).toHaveBeenCalledTimes(1);
        expect(convertLocalDateString).toHaveBeenCalledTimes(1);
        
      });
    });
  });

  describe("filterEventsByVenue", () => {
    describe("given a valid venue string param is passed", () => {
      it("should return the filtered string array of event ids", async () => {
        const filteredEvents = [
          {
            _id: "1",
            localEventDates: ["2022-12-31 00:00:00 EDT"],
            eventVenue: "Casa Loma",
          },
          {
            _id: "3",
            localEventDates: ["2022-12-31 00:00:00 EDT"],
            eventVenue: "Casa Loma",
          },
        ];
        Event.find.mockReturnValue({
          lean: jest.fn().mockReturnThis(),
          exec: jest.fn().mockResolvedValue(filteredEvents),
        });

        const mockVenueStr = "Casa Loma";

        const result = await filterEventsByVenue(mockVenueStr);

        expect(result).toEqual(["1", "3"]);
        expect(Event.find).toHaveBeenCalledWith({
          eventVenue: { $eq: mockVenueStr },
        });
      });
    });
  });

  describe("filterEventsOpen", () => {
    describe("given false is passed as param", () => {
      it("should return a resolved empty array", async () => {
        const result = await filterEventsOpen(false);

        // await expect(filterEventsOpen(false)).resolves.toEqual([])

        expect(result).toEqual([]);
      });
    });
    describe("given true is passed as param", () => {
      it("should return a filtered string array of event ids", async () => {
        const filteredEvents = [
          {
            _id: "4",
            localEventDates: ["2022-12-31 00:00:00 EDT"],
            openPositions: 5,
          },
          {
            _id: "5",
            localEventDates: ["2022-12-31 00:00:00 EDT"],
            openPositions: 4,
          },
        ];

        Event.find.mockReturnValue({
          lean: jest.fn().mockReturnValue({
            exec: jest.fn().mockResolvedValue(filteredEvents),
          }),
        });

        const result = await filterEventsOpen(true);

        expect(result).toEqual(["4", "5"]);
        expect(Event.find).toHaveBeenCalledWith({ openPositions: { $gt: 0 } });
      });
    });
  });

  describe("filterEventsUpcomingShifts", () => {
    describe("given false is passed as param", () => {
      it("should return a resolved empty array", async () => {
        const result = await filterEventsUpcomingShifts(false);
        expect(result).toEqual([]);
      });
    });
    describe("given true is passed as param", () => {
      it("should return a filtered string array of event ids", async () => {
        const unfilteredEvents = [
          {
            _id: "4",
            eventDates: [new Date("2023-12-01T05:00")],
          },
          {
            _id: "5",
            eventDates: [new Date("2023-12-02T05:00")],
          },
          {
            _id: "6",
            eventDates: [new Date("2023-12-02T05:00")],
          },
        ];

        const sortedEvents = [
          {
            eventId: "5",
            eventName: "five",
            eventDate: new Date("2023-12-02T05:00"),
          },
          {
            eventId: "6",
            eventName: "six",
            eventDate: new Date("2023-12-02T05:00"),
          },
        ];

        // const sortUpcomingEventsDates = jest.fn()
        sortUpcomingEventsDates.mockReturnValue(sortedEvents);

        Event.find.mockReturnValue({
          lean: jest.fn().mockReturnValue({
            exec: jest.fn().mockResolvedValue(unfilteredEvents),
          }),
        });

        const result = await filterEventsUpcomingShifts(true);

        expect(result).toEqual(["5", "6"]);
        expect(Event.find).toHaveBeenCalled();
        expect(sortUpcomingEventsDates).toHaveBeenCalledWith(unfilteredEvents);
      });
    });
  });

  describe("filteredTagsSort", () => {
    describe("given param is NOT an array", () => {
      it("should throw an error", () => {});
    });

    describe("given param is an array", () => {
      it("should return", () => {
        const unsortedEvents = [
          { eventId: "1", filterTags: ["venue", "isUpcoming"] },
          { eventId: "2", filterTags: ["venue"] },
          { eventId: "3", filterTags: ["venue", "isUpcoming", "isOpen"] },
        ];

        const sortedEvents = [
          { eventId: "3", filterTags: ["venue", "isUpcoming", "isOpen"] },
          { eventId: "1", filterTags: ["venue", "isUpcoming"] },
          { eventId: "2", filterTags: ["venue"] },
        ];
        const result = filteredTagsSort(unsortedEvents);

        expect(result).toEqual(sortedEvents);
      });
    });
  });
});
