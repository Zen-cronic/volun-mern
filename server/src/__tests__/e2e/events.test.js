const { MongoMemoryServer } = require("mongodb-memory-server");
const mongoose = require("mongoose");
const Event = require("../../models/Event");
const { SORT_OBJECT } = require("../../config/sortOptions");
const supertest = require("supertest");
const { createServer } = require("../../config/createServer");
const { getAllEvents } = require("../../service/eventsService");
const { FILTER_OPTIONS } = require("../../config/filterOptions");

// jest.mock("../../helpers/sortUpcomingEventsDates");
const app = createServer();

describe("/events route", () => {
  const request = supertest(app);

  const events = [
    {
      eventName: "Event 1",
      eventDescription: "Description 1",
      eventDates: [new Date("2023-01-01T00:00")],
      shifts: [
        {
          shiftStart: new Date("2023-01-01T09:00:00"),
          shiftEnd: new Date("2023-01-01T17:00:00"),
          shiftPositions: 5,
        },
      ],

      eventVenue: "Venue 1",
    },

    {
      eventName: "Event 3",
      eventDescription: "Description 3",
      eventDates: [new Date("2024-06-01T00:00"), new Date("2024-07-02T00:00")],
      shifts: [
        {
          shiftStart: new Date("2024-06-01T09:00:00"),
          shiftEnd: new Date("2024-06-01T17:00:00"),
          shiftPositions: 5,
        },
        {
          shiftStart: new Date("2024-07-02T09:00:00"),
          shiftEnd: new Date("2024-07-02T17:00:00"),
          shiftPositions: 5,
        },
      ],
      // openPositions: 10,
      eventVenue: "Venue 3",
    },

    {
      eventName: "Event 2",
      eventDescription: "Description 2",
      eventDates: [new Date("2024-02-01T00:00"), new Date("2024-02-02T00:00")],
      shifts: [
        {
          shiftStart: new Date("2024-02-01T09:00:00"),
          shiftEnd: new Date("2024-02-01T17:00:00"),
          shiftPositions: 10,
        },
        {
          shiftStart: new Date("2024-02-02T09:00:00"),
          shiftEnd: new Date("2024-02-02T17:00:00"),
          shiftPositions: 4,
        },
      ],
      // openPositions: 10,
      eventVenue: "Venue 2",
    },
  ];

  beforeAll(async () => {
    const mongoServer = await MongoMemoryServer.create();
    const mongoServerUri = mongoServer.getUri();
    console.log(mongoServerUri);
    await mongoose.connect(mongoServerUri, { dbName: "events" });

    // Create an array of event objects

    // const createdEvents = await Promise.all(
    //   events.map(async (event) => await Event.create(event))
    // );
    const createdEvents = await Event.create(events);
    // console.log("createdEvents: ", createdEvents);
  }, 10000);

  afterAll(async () => {
    await Event.deleteMany();
    await mongoose.disconnect();
    await mongoose.connection.close();
  });

  describe("/events/sort", () => {
    // const sortRequest = () => request.post("/event/sort")

    describe("given that sort option is SOONEST", () => {
      it("should return an array of sorted events based on eventDate", async () => {
        const allEvents = await getAllEvents();

        const { statusCode, body } = await request
          .post("/events/sort")
          .send({ [SORT_OBJECT.SOONEST.sortOption]: true });

        // console.log(" :: ", body);
        expect(statusCode).toBe(200);
        expect(body).toHaveProperty("sortedEvents");
        expect(body).toHaveProperty("sortedUpcomingEventsDates");

        // console.log("body.sortedUpcomingEventsDate: ", body.sortedUpcomingEventsDates);
        // console.log("body.sortedEvents: ", body.sortedEvents);
        // console.log("allEvents: ", allEvents);

        await Promise.all(
          allEvents.map(async (event) => {
            const matchedEvent = await Event.find({
              eventName: event.eventName,
            });

            expect(matchedEvent).toHaveLength(1);
            expect(matchedEvent[0]).not.toBeUndefined();
          })
        );

        for (let i = 0; i < body.sortedEvents.length - 1; i++) {
          const leftDate = new Date(body.sortedEvents[i].eventDate);
          const rightDate = new Date(body.sortedEvents[i + 1].eventDate);

          expect(leftDate.getTime()).toBeLessThanOrEqual(rightDate.getTime());
        }
      });
    });

    describe("given that sort option is EVENT_AZ", () => {
      it("should return the alphabetically sorted events", async () => {
        const { status, body } = await request
          .post("/events/sort")
          .send({ [SORT_OBJECT.EVENT_AZ.sortOption]: true });

        expect(status).toBe(200);
        expect(body).toHaveProperty("sortedEvents");

        // console.log("body.sortedEvents: ", body.sortedEvents);
        for (let i = 0; i < body.sortedEvents.length - 1; i++) {
          const leftEventName = body.sortedEvents[i].eventName;
          const rightEventName = body.sortedEvents[i + 1].eventName;

          expect(leftEventName.localeCompare(rightEventName)).toBe(-1);
          // expect(leftEventName.localeCompare(rightEventName)).toBeLessThanOrEqual(0);
        }
      });
    });

    describe("given that sort option is OPENPOSITIONS", () => {
      //desc - false
      it("should return the sorted events with open positions in descending order", async () => {
        const { status, body } = await request
          .post("/events/sort")
          .send({ [SORT_OBJECT.OPENPOSITIONS.sortOption]: false });

        expect(status).toBe(200);
        expect(body).toHaveProperty("sortedEvents");

        // console.log("body.sortedEvents: ", body.sortedEvents);
        for (let i = 0; i < body.sortedEvents.length - 1; i++) {
          const leftEventId = body.sortedEvents[i].eventId;
          const rightEventId = body.sortedEvents[i + 1].eventId;

          const leftEvent = await Event.findById(leftEventId);
          const rightEvent = await Event.findById(rightEventId);

          expect(leftEvent.openPositions).toBeGreaterThanOrEqual(
            rightEvent.openPositions
          );
        }
      });
    });
  });

  describe("/event/search", () => {
    const testSearchEvent = async (
      searchTerm,
      expectedMatchingEventsLength
    ) => {
      const { statusCode, body } = await request
        .post("/events/search")
        .query({ q: searchTerm });

      expect(statusCode).toBe(200);

      expect(body).toHaveProperty(
        "matchingEvents.length",
        expectedMatchingEventsLength
      );

      expect(body).toHaveProperty("searchTerm", searchTerm);

      console.log("body searchTerm: ", body);
      // Received value: {"matchingEvents": [{"eventId": "656bad85d4f31b1a54935615"}], "searchTerm": "3"}
    };

    describe("given that search term belongs to one event only", () => {
      it("should return an array of one event", async () => {
        await testSearchEvent("3", 1);
      });
    });
    describe("given that search term belongs to more than one event", () => {
      it("should return an array of events", async () => {
        await testSearchEvent("event", events.length);
      });
    });
  });

  describe("/events/filter", () => {
    describe("given valid VENUE filter argument is provided", () => {
      it("should return the filtered array of events", async () => {
        const eventWithFilteredVenue = {
          eventName: "Event 4",
          eventDescription: "Description 4",
          eventDates: [new Date("2023-04-01T00:00")],
          shifts: [
            {
              shiftStart: new Date("2023-04-01T09:00:00"),
              shiftEnd: new Date("2023-04-01T17:00:00"),
              shiftPositions: 5,
            },
          ],
          eventVenue: "Casa Loma",
        };
        await Event.create(eventWithFilteredVenue);

        const filterKeysObj = { [FILTER_OPTIONS.VENUE]: "Casa Loma" };

        const { status, body } = await request
          .post("/events/filter")
          .send(filterKeysObj);

        expect(status).toBe(200);

        expect(body).toHaveProperty("sortedIdsWithTags");

        body.sortedIdsWithTags.forEach((sortedObj) => {
          expect(sortedObj).toEqual({
            eventId: expect.any(String),
            filterTags: [{ venue: filterKeysObj.venue }],
          });
        });
      });
    });
    describe("given valid IS_OPEN filter argument is provided", () => {
      it("should return the filtered array of events", async () => {
        const eventWithFilteredIsOpen = {
          eventName: "Event 5",
          eventDescription: "Description 4",
          eventDates: [new Date("2023-04-01T00:00")],
          shifts: [
            {
              shiftStart: new Date("2023-04-01T09:00:00"),
              shiftEnd: new Date("2023-04-01T17:00:00"),
              shiftPositions: 3,
            },
          ],
          eventVenue: "Venue 5",
        };
        await Event.create(eventWithFilteredIsOpen);

        const filterKeysObj = { isOpen: true };

        const { status, body } = await request
          .post("/events/filter")
          .send(filterKeysObj);

        expect(status).toBe(200);

        expect(body).toHaveProperty("sortedIdsWithTags");

        body.sortedIdsWithTags.forEach((sortedObj) => {
          expect(sortedObj).toEqual({
            eventId: expect.any(String),
            filterTags: [{ isOpen: true }],
          });
        });
      });
    });
  });

  // describe('/event create event', () => {

  //   describe('first', () => {
  //     it('should ', () => {

  //      })
  //    })
  // });
});
