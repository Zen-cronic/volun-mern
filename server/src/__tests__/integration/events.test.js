const supertest = require("supertest");
const { createServer } = require("../../config/createServer");
const { SORT_OBJECT } = require("../../config/sortOptions");
const Event = require("../../models/Event");
const sortUpcomingEventsDates = require("../../helpers/sortUpcomingEventsDates");

jest.mock("../../models/Event");
jest.mock("../../helpers/sortUpcomingEventsDates");

const app = createServer();

describe("/events route", () => {
  describe("/sort", () => {
    describe("given the sort option is SOONEST", () => {
      it("should return sorted events based on eventDate", async () => {
        const events = [
          {
            _id: "1",
            eventName: "Event 1",
            eventDates: [new Date("2023-01-01"), new Date("2023-02-01")],
          },
          {
            _id: "2",
            eventName: "Event 2",
            eventDates: [new Date("2023-03-01"), new Date("2023-04-01")],
          },
          {
            _id: "3",
            eventName: "Event 3",
            eventDates: [new Date("2024-01-01"), new Date("2024-02-01")],
          },
          {
            _id: "4",
            eventName: "Event 4",
            eventDates: [new Date("2024-03-01"), new Date("2024-04-01")],
          },
        ];

        Event.find.mockReturnValue({
          lean: jest.fn().mockReturnValue(events)
        });

        const sortedEvents = [
          {
            eventId: "4",
            eventName: "Event 4",
            eventDate: new Date("2024-03-01"),
          },
          {
            eventId: "3",
            eventName: "Event 3",
            eventDate: new Date("2024-01-01"),
          },
        ];

        sortUpcomingEventsDates.mockReturnValue(sortedEvents);

        const reqObj = { [SORT_OBJECT.SOONEST.sortOption]: true };
        console.log(reqObj);
        const { statusCode, body } = await supertest(app)
          .post("/events/sort")
          .send({ [SORT_OBJECT.SOONEST.sortOption]: true });

        console.log("body: ", body);
        expect(statusCode).toBe(200);

        expect(Event.find).toHaveBeenCalledTimes(1);
        expect(sortUpcomingEventsDates).toHaveBeenCalledWith(events);

        expect(sortUpcomingEventsDates).toHaveReturnedWith(
          expect.arrayContaining([
            expect.objectContaining({
              eventId: "4",
              eventName: "Event 4",
              eventDate: new Date("2024-03-01"),
            }),
            expect.objectContaining({
              eventId: "3",
              eventName: "Event 3",
              eventDate: new Date("2024-01-01"),
            }),
          ])
        );

        expect(body).toHaveProperty("sortedUpcomingEventsDates", [
          {
            eventId: "4",
            eventName: "Event 4",
            eventDate: "2024-03-01T00:00:00.000Z",
          },
          {
            eventId: "3",
            eventName: "Event 3",
            eventDate: "2024-01-01T00:00:00.000Z",
          },
        ]);

      
      });
    });
    describe("given the sort option is EVENT_AZ", () => {
      it("should return sorted events based on eventDate", () => {});
    });
  });
});
