import puppeteer from "puppeteer";
import assert from "assert";

const LINK =
  "https://www.beartracks.ualberta.ca/psc/uahebprd/EMPLOYEE/HRMS/c/SSR_STUDENT_FL.SSR_SHOP_CART_FL.GBL?Action=U";

const USERNAME = "yismail";
const PASSWORD = "Madskeelz49";
const TIMEOUT = 5 * 1000;

assert(USERNAME !== "YOUR_USERNAME", "Please set your username in index.js");
assert(PASSWORD !== "YOUR_PASSWORD", "Please set your password in index.js");

const f = async () => {
  console.log("Launching browser...");

  const browser = await puppeteer.launch({
    headless: "new",
    defaultViewport: null,
    slowMo: 10,
  });
  const page = await browser.newPage();

  await page.goto(LINK);

  console.log("Logging in...");

  await page.type("#username", USERNAME);

  await page.type("#user_pass", PASSWORD);

  await page.click("input[type=submit]");

  await page.waitForNavigation({ waitUntil: "networkidle2" });

  await page.setCookie({
    name: "PS_DEVICEFEATURES",
    value: "foo:bar",
    domain: ".beartracks.ualberta.ca",
    path: "/",
    expires: -1,
    httpOnly: false,
    secure: true,
    session: true,
    sameSite: "Strict",
    sameParty: false,
    sourceScheme: "Secure",
    sourcePort: 443,
  });

  console.log("Logged in! Waiting for page to load...");

  await page.waitForNavigation({ waitUntil: "networkidle2" });

  let validRows = false;

  while (!validRows) {
    console.log("Checking for valid rows...");
    const rows = (await page.$$(".psa_shop-cart-anchor tr")).slice(1); // slice header

    for (const row of rows) {
      const open = await row.$eval(
        "td:nth-child(2)",
        (el) => el.innerText === "Open"
      );

      if (open) {
        console.log("Found valid row! Clicking checkbox...");
        const checkbox = await row.$("input[type=checkbox]");
        await checkbox.click();
        validRows = true;
      }
    }

    if (!validRows) {
      console.log("No valid rows found. Refreshing page...");

      await new Promise((resolve) => setTimeout(resolve, TIMEOUT));

      await page.reload({ waitUntil: "networkidle2" });
    }
  }

  await page.click("#DERIVED_SSR_FL_SSR_ENROLL_FL\\$92\\$");

  const yes = await page.waitForSelector("#\\#ICYes");

  await yes.click();

  await page.waitForNetworkIdle();

  await page.screenshot({ path: "example.png" });

  console.log("Done!");

  await browser.close();
};

f();
