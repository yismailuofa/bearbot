const TIMEOUT_IN_MS = 5 * 1000; // 5 seconds
const MAX_SUBMIT_ITER = 10;
const SUBMIT_TIMEOUT = 1000;

let interval;

chrome.storage.local.onChanged.addListener(async (changes) => {
  console.debug("Storage changed:", changes);
  clearInterval(interval);

  if (changes.started?.newValue) {
    interval = setInterval(onInterval, TIMEOUT_IN_MS);
  }
});

chrome.storage.local.get(["submit", "started"], (ls) => {
  const { submit, started } = ls;

  if (submit) {
    console.debug("Submit onload.");
    handleSubmit();
  } else if (started) {
    console.debug("Start onload.");
    interval = setInterval(onInterval, TIMEOUT_IN_MS);
  }
});

async function onInterval() {
  console.debug("Interval callback.");
  if (await findOpenSeats()) {
    await chrome.storage.local.set({ submit: true });
    clearInterval(interval);
  }

  location.reload();
}

async function handleSubmit() {
  let iterations = 0;
  let searchInterval = setInterval(async () => {
    console.debug("Searching for submit button...", iterations);

    let submitButton = document.getElementById("SSR_ENRL_FL_WRK_SUBMIT_PB");

    if (submitButton) {
      console.debug("Found submit button");

      clearInterval(interval);
      clearInterval(searchInterval);

      let event = new CustomEvent("submit-bearbot");

      document.getElementsByTagName("body")[0].dispatchEvent(event);

      await chrome.storage.local.set({ submit: false });
      await chrome.storage.local.set({ started: false });

      chrome.runtime.sendMessage({ message: "updateIcon", data: "OFF" });
    }

    if (iterations > MAX_SUBMIT_ITER) {
      clearInterval(searchInterval);
    }

    iterations++;
  }, SUBMIT_TIMEOUT);
}

async function findOpenSeats() {
  const rows = document.getElementsByTagName("tr");
  const { filter: sections } = await chrome.storage.local.get("filter");

  console.debug("Filter:", sections);

  for (const row of rows) {
    const html = row.innerHTML;

    const canCheck =
      html.includes("Open Seats") &&
      (!sections.length || sections.some((section) => html.includes(section)));

    if (canCheck) {
      const idx = Array.from(row.getElementsByTagName("a"))
        .find((a) => a.innerText.includes("Enroll"))
        ?.href.split("$")[1]
        .split("');")[0];

      if (!idx) return false;

      const enrollEvent = new CustomEvent("enroll-bearbot", { detail: idx });

      document.getElementsByTagName("body")[0].dispatchEvent(enrollEvent);

      return true;
    }
  }
  return false;
}

// Get the window to the soul
// http://stackoverflow.com/questions/20499994/access-window-variable-from-content-script}
const node = document.getElementsByTagName("body")[0];
const script = document.createElement("script");
script.setAttribute("type", "text/javascript");
script.setAttribute("src", chrome.runtime.getURL("event.js"));
node.appendChild(script);
