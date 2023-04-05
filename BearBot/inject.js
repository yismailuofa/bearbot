const TIMEOUT_IN_MS = 5 * 1000; // 5 seconds

let interval;
let localRunning = false;

chrome.storage.local.onChanged.addListener(async (changes) => {
  clearInterval(interval);

  if (changes.started?.newValue) {
    interval = setInterval(onInterval, TIMEOUT_IN_MS);
  }
});

chrome.storage.local.get("submit", (ls) => {
  if (ls.submit && !localRunning) {
    console.log("Submit onload.");
    handleSubmit();
    localRunning = true;
  }
});

chrome.storage.local.get("started", (ls) => {
  if (ls.started) {
    console.log("Started onload.");
    interval = setInterval(onInterval, TIMEOUT_IN_MS);
  }
});

async function onInterval() {
  console.log("Interval.");
  if (!localRunning) {
    if (await findOpenSeats()) {
      await chrome.storage.local.set({ submit: true });
      clearInterval(interval);
    }

    location.reload();
  }
}

async function handleSubmit() {
  let iterations = 0;
  let searchInterval = setInterval(() => {
    console.log("Searching for submit button...", iterations);
    let submitButton = document.getElementById("SSR_ENRL_FL_WRK_SUBMIT_PB");

    if (submitButton) {
      console.log("Found submit button");
      clearInterval(interval);
      clearInterval(searchInterval);

      let event = new CustomEvent("submit-bearbot");

      document.getElementsByTagName("body")[0].dispatchEvent(event);

      chrome.storage.local.set({ submit: false });
    }

    if (iterations > 10) {
      clearInterval(searchInterval);
    }

    iterations++;
  }, 1000);
}

async function findOpenSeats() {
  const rows = document.getElementsByTagName("tr");
  const ls = await chrome.storage.local.get("filter");
  const sections = ls.filter;

  console.log("Filter:", sections);

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
function injectScript(file_path, tag) {
  var node = document.getElementsByTagName(tag)[0];
  var script = document.createElement("script");
  script.setAttribute("type", "text/javascript");
  script.setAttribute("src", file_path);
  node.appendChild(script);
}

injectScript(chrome.runtime.getURL("event.js"), "body");
