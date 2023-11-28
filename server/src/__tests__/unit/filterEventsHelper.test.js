const { filterEventsByDate } = require("../../helpers/filterEventsHelper");
const Event = require("../../models/Event");

jest.mock("../../models/Event");

describe("filterEventsHelper Service", () => {
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

    // describe("given a valid param is passed", () => {
    //   it("should return the filtered array of events", async () => {
    //     //Event

    //     // const expectedEventsArray = expect.any(Array<String>)
    //     const expectedEventsArray = ["1", "2", "3"];
    //     const mockFn = Event.find.mockReturnValue({
    //       lean: jest.fn().mockReturnThis(),
    //       exec: jest.fn().mockReturnThis(),
    //       then: jest.fn().mockReturnThis(),
    //       then: jest.fn().mockResolvedValue(expectedEventsArray),
    //     });

    //     const val = "2023-12-12";
    //     await expect(() => filterEventsByDate(val).resolves.toBe(""));

    //     // expect(mockFn).toHaveBeenCalledTimes(1);
    //   });
    // });
  });
});
