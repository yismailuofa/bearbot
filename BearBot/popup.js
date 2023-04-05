const startButton = document.getElementById("startButton");
const stopButton = document.getElementById("stopButton");
const sectionInput = document.getElementById("sectionInput");

chrome.storage.local.get("started", (result) => {
  if (result.started) {
    toggleVisibility();
  }

  chrome.action.setBadgeText({ text: result.started ? "ON" : "OFF" });
  chrome.action.setBadgeBackgroundColor({
    color: result.started ? "#cfffd5" : "#faa0a0",
  });
});

startButton.onclick = async () => {
  toggleVisibility();

  await chrome.storage.local.set({
    filter: sectionInput.value ? sectionInput.value.split(" ") : [],
  });
  await chrome.storage.local.set({ started: true });
  await chrome.action.setBadgeText({ text: "ON" });
  await chrome.action.setBadgeBackgroundColor({ color: "#cfffd5" });
};

stopButton.onclick = async () => {
  toggleVisibility();

  await chrome.storage.local.set({ started: false });
  await chrome.action.setBadgeText({ text: "OFF" });
  await chrome.action.setBadgeBackgroundColor({ color: "#faa0a0" });
};

function toggleVisibility() {
  startButton.classList.toggle("invisible");
  stopButton.classList.toggle("invisible");
}
