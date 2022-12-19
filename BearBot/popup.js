const startButton = document.getElementById("startButton");
const stopButton = document.getElementById("stopButton");
const successMsg = document.getElementById("successMsg");

const INTERVAL_TIME = 5 * 1000; // 5 seconds

const beep = new Audio(chrome.runtime.getURL("beep.mp3"));
beep.loop = true;

let interval;
startButton.onclick = () => {
  toggleVisibility();

  interval = setInterval(() => {
    chrome.tabs.reload();
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
    },
    (injectionResults) => {
      console.log(injectionResults);
      if (injectionResults === undefined) return;
      for (const frameResult of injectionResults) {
        if (frameResult.result) {
          onFound();
        }
      }
    }
  );
}

function findOpenSeats() {
  const source = document.getElementsByTagName("html")[0].innerHTML;
  return source.includes("Open Seats");
}

function onFound() {
  successMsg.classList.remove("invisible");

  beep.play();

  clearInterval(interval);
}

function toggleVisibility() {
  startButton.classList.toggle("invisible");
  stopButton.classList.toggle("invisible");

  successMsg.classList.add("invisible");
}
