const { MongoMemoryServer } = require("mongodb-memory-server");
const mongoose = require("mongoose");
const Event = require("../../models/Event");

describe("/events route", () => {
  beforeAll(async () => {
    const mongoServer = await MongoMemoryServer.create();
    const mongoServerUri = mongoServer.getUri();
    console.log(mongoServerUri);
    await mongoose.connect(mongoServerUri, { dbName: "events" });

    // Create an array of event objects
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
        eventName: "Event 2",
        eventDescription: "Description 2",
        eventDates: [
          new Date("2024-02-01T00:00"),
          new Date("2024-02-02T00:00"),
        ],
        shifts: [
          {
            shiftStart: new Date("2024-02-01T09:00:00"),
            shiftEnd: new Date("2024-02-01T17:00:00"),
            shiftPositions: 5,
          },
          {
            shiftStart: new Date("2024-02-02T09:00:00"),
            shiftEnd: new Date("2024-02-02T17:00:00"),
            shiftPositions: 5,
          },
        ],
        // openPositions: 10,
        eventVenue: "Venue 2",
      },
      {
        eventName: "Event 3",
        eventDescription: "Description 3",
        eventDates: [
          new Date("2024-06-01T00:00"),
          new Date("2024-07-02T00:00"),
        ],
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
    ];

    await Event.create(events);
  });

  afterAll(async () => {
    await Event.deleteMany();
    await mongoose.disconnect();
    await mongoose.connection.close();
  });

  describe("/events/sort", () => {
    describe("given that sort option is SOONEST", () => {
      it("should return", () => {});
    });
  });
});
