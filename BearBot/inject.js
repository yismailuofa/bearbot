const TIMEOUT_IN_MS = 5 * 1000; // 5 seconds

let interval;

chrome.storage.local.onChanged.addListener((changes) => {
  console.debug("Storage changed:", changes);
  clearInterval(interval);

  if (changes.started?.newValue) {
    interval = setInterval(onInterval, TIMEOUT_IN_MS);
  }
});

chrome.storage.local.get(["started"], (ls) => {
  const { started } = ls;

  if (started) {
    console.debug("Start onload.");
    interval = setInterval(onInterval, TIMEOUT_IN_MS);
  }
});

async function onInterval() {
  console.debug("Interval callback.");
  if (await findOpenSeats()) {
    const enrollEvent = new CustomEvent("enroll-bearbot");
    document.getElementsByTagName("body")[0].dispatchEvent(enrollEvent);

    await waitForSubmit();

    const submitEvent = new CustomEvent("submit-bearbot");
    document.getElementsByTagName("body")[0].dispatchEvent(submitEvent);

    clearInterval(interval);
  } else {
    open(
      "https://www.beartracks.ualberta.ca/psc/uahebprd/EMPLOYEE/HRMS/c/SSR_STUDENT_FL.SSR_SHOP_CART_FL.GBL?Page=SSR_TERM_STA3_FL&Action=U",
      "_self"
    );
  }
}

async function findOpenSeats() {
  const rows = Array.from(
    document.querySelectorAll(".psa_shop-cart-anchor tr")
  ).slice(1); // slice header

  let validRows = false;

  for (const row of rows) {
    const open = row.children[1].innerText === "Open";

    if (open) {
      const checkbox = row.children[0].querySelector(".ps-checkbox");
      checkbox.click();
      validRows = true;
    }
  }

  return validRows;
}

async function waitForSubmit() {
  for (let i = 0; i < 100; i++) {
    if (!document.querySelector("#alertmsg")) {
      console.debug("Waiting for submit button to appear.");
      await new Promise((resolve) => setTimeout(resolve, 100));
    } else {
      return;
    }
  }
  console.debug("Submit button did not appear.");
}

// Get the window to the soul
// http://stackoverflow.com/questions/20499994/access-window-variable-from-content-script}
const node = document.getElementsByTagName("body")[0];
const script = document.createElement("script");
script.setAttribute("type", "text/javascript");
script.setAttribute("src", chrome.runtime.getURL("event.js"));
node.appendChild(script);
