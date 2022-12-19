const startButton = document.getElementById("startButton");
const stopButton = document.getElementById("stopButton");
const successMsg = document.getElementById("successMsg");
const beep = new Audio(chrome.runtime.getURL("beep.mp3"));
let interval = -1;

const INTERVAL_TIME = 5 * 1000; // 5 seconds

stopButton.classList.add("invisible");
successMsg.classList.add("invisible");

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
  console.log(`Checking at ${new Date().toLocaleTimeString()}`);

  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  chrome.scripting.executeScript(
    {
      target: { tabId: tab.id },
      func: findOpenSeats,
    },
    (injectionResults) => {
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
  return source.search("Open Seats") !== -1;
}

function onFound() {
  beep.loop = true;
  beep.play();

  clearInterval(interval);
  successMsg.classList.remove("invisible");
}

function toggleVisibility() {
  startButton.classList.toggle("invisible");
  stopButton.classList.toggle("invisible");
  successMsg.classList.add("invisible");
}
