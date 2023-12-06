require("dotenv").config();
const { Builder, By, Key, until, Capabilities, Options } = require("selenium-webdriver");
const mongoose = require("mongoose");
const Event = require("../../models/Event");
const connectDB = require("../../config/db");
const chrome = require('selenium-webdriver/chrome')

describe("/events/search", () => {
  let driver;

  beforeAll(async () => {
    jest.setTimeout(30000);

    // let chromeCapabilities = Capabilities.chrome();
    
    // const chromeOptions = {
    //   args: [
    //     "--window-size=1920,1080",
    //     // "--headless"
    //     "--disable-dev-shm-usage",
    //     "--no-sandbox"
    //   ],
    // };

    let options = new chrome.Options()
    options.addArguments(
      'headless',
      'window-size=1920,1080',
      'disable-dev-shm-usage',
  'no-sandbox'
    )
    
    // chromeCapabilities.set("goog:chromeOptions", chromeOptions);

    driver = new Builder()
      .forBrowser("chrome")
      .setChromeOptions(options)
      // .withCapabilities(chromeCapabilities)
      .build();

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

    connectDB();
    const createdEvents = await Event.create(events);

    console.log("connect db name for test: ", mongoose.connection.name);
    // console.log('created Events: ', createdEvents);
  });

  afterAll(async () => {
    await driver.close();
    await Event.deleteMany();
    await mongoose.disconnect();
    await mongoose.connection.close();
  });

  it("should return search results", async () => {
    const searchTerm = "event";

    // console.log("driver: ", driver);
    console.log("test allowed origin: ", process.env.TEST_ALLOWED_ORIGIN);
    await driver.get(`${process.env.TEST_ALLOWED_ORIGIN}/events`);
    await driver
      .findElement(By.id("search-bar"))
      .findElement(By.css("input"))
      .sendKeys(searchTerm, Key.ENTER);
    await driver.wait(until.urlContains(`/search?q=${searchTerm}`));

    const headingsRow = await driver.findElements(By.css("tr"));

    const firstRow = await headingsRow[0].getText();
    expect(firstRow.toLowerCase()).toBe("event name venue description when?");

    const searchResults = await driver.findElements(By.id("search-result"));

    const resultsText = await Promise.all(
      searchResults.map(async (result) => await result.getText())
    );

    resultsText.forEach((text) => {
      expect(text.toLowerCase()).toContain(searchTerm);
      // expect(text.toLowerCase()).toEqual(expect.stringContaining(searchTerm))
    });
  });
});
