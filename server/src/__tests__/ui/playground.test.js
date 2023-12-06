const { Builder, By, Key, until, Capabilities,  } = require("selenium-webdriver");


describe("Ggl search", () => {
  let driver;

  beforeAll(async () => {
    let chromeCapabilities = Capabilities.chrome();
    const chromeOptions = {
      args: [
        // "headless",
    //    "window-size=1920,1080",
    ]
    };

    chromeCapabilities.set("goog:chromeOptions", chromeOptions);
    // chromeCapabilities.set("chromeOptions", chromeOptions);
    driver = await new Builder()
      .forBrowser("chrome")
    
      .withCapabilities(chromeCapabilities)
      .build();
  });

  afterAll(async () => {
    // await driver.quit()
    // await driver.close()
  });

  it("should open ggl search", async () => {
    await driver.get("https://www.google.com");
    await driver.findElement(By.name("q")).sendKeys("webdriver", Key.ENTER);
    await driver.wait(until.titleIs("webdriver - Google Search"), 1000);
    
  });
});
