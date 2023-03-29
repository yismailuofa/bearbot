const startButton = document.getElementById("startButton");
const stopButton = document.getElementById("stopButton");
const successMsg = document.getElementById("successMsg");
const sectionInput = document.getElementById("sectionInput");

const INTERVAL_TIME = 5 * 1000; // 5 seconds

const beep = new Audio(chrome.runtime.getURL("beep.mp3"));
beep.loop = true;

let isPopupOpen = false;

chrome.runtime.onMessage.addListener((message, _, sendResponse) => {
  if (message.type === "popupStatus") {
    sendResponse(isPopupOpen);
  }
});

window.addEventListener("load", () => {
  isPopupOpen = true;
});

window.addEventListener("unload", () => {
  isPopupOpen = false;
});

let interval;
startButton.onclick = () => {
  toggleVisibility();

  interval = setInterval(() => {
    // chrome.tabs.reload();
    checkOpen();
  }, INTERVAL_TIME);
};

stopButton.onclick = () => {
  toggleVisibility();

  beep.pause();

  clearInterval(interval);
};

async function checkOpen() {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  chrome.scripting.executeScript(
    {
      target: { tabId: tab.id },
      func: findOpenSeats,
      args: [sectionInput.value],
    },
    (injectionResults) => {
      if (injectionResults === undefined) return;
      for (const frameResult of injectionResults) {
        if (frameResult.result) {
          onFound();
        }
      }
    }
  );
}

async function findOpenSeats(sectionInputValue) {
  const rows = document.getElementsByTagName("tr");
  const sections = sectionInputValue && sectionInputValue.split(" ");

  for (const row of rows) {
    const html = row.innerHTML;

    const canCheck =
      !sections || sections.some((section) => html.includes(section));

    if (canCheck && html.includes("Open Seats")) {
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

function onFound() {
  successMsg.classList.remove("invisible");

  beep.play();

  chrome.notifications.create("CLASS_FOUND", {
    type: "basic",
    iconUrl: "bear.png",
    title: "BearBot: SEAT ALERT",
    message: "An open seat for your class was found!",
    priority: 2,
  });

  clearInterval(interval);
}

function toggleVisibility() {
  startButton.classList.toggle("invisible");
  stopButton.classList.toggle("invisible");

  successMsg.classList.add("invisible");
}
