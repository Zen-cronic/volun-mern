require("dotenv").config();
const { Builder, By, Key, until, Capabilities } = require("selenium-webdriver");
const {MongoMemoryServer} = require('mongodb-memory-server')
const mongoose = require("mongoose");
const Event = require("../../models/Event");


describe("/events/search", () => {
  let driver;

  beforeAll(async () => {
    jest.setTimeout(10000);

    let chromeCapabilities = Capabilities.chrome();

    const chromeOptions = {
      args: [
        "--window-size=1920,1080",
        // "--headless"
      ],
    };

    chromeCapabilities.set("goog:chromeOptions", chromeOptions);

    driver = new Builder()
      .forBrowser("chrome")
      .withCapabilities(chromeCapabilities)
      .build();

      const mongoServer = await MongoMemoryServer.create();
      await mongoose.connect(mongoServer.getUri());

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

      await Event.create(events)
  });

  afterAll(async () => {

    await driver.close();
    await Event.deleteMany()
    await mongoose.disconnect()
    await mongoose.connection.close()
  });

  it("should return search results", async () => {
    const searchTerm = "fall";

    await driver.get(`${process.env.TEST_ALLOWED_ORIGIN}/events`);
    await driver
      .findElement(By.id("search-bar"))
      .findElement(By.css("input"))
      .sendKeys(searchTerm, Key.ENTER);
    await driver.wait(until.urlContains(`/search?q=${searchTerm}`));

    const headingsRow = await driver.findElements(By.css("tr"));

    // console.log('searchResuts: ', headingsRow);
    // expect(headingsRow).not.toHaveLength(0)

    const firstRow = await headingsRow[0].getText();
    expect(firstRow.toLowerCase()).toBe("event name venue description when?");

    const searchResults = await driver.findElements(By.id("search-result"));
    // console.log('searchResuts: ', searchResults);

    const resultsText = await Promise.all(
      searchResults.map(async (result) => await result.getText())
    );

    resultsText.forEach((text) => {
      expect(text.toLowerCase()).toContain(searchTerm);
      // expect(text.toLowerCase()).toEqual(expect.stringContaining(searchTerm))
    });
  });
});
