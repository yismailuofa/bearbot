// Set a listener to allow content scripts to send messages to the background script
chrome.runtime.onMessage.addListener((request) => {
  if (request.message === "updateIcon") {
    chrome.action.setBadgeText({ text: request.data });
  }
});

// Set the icon to the correct state on load
chrome.storage.local.get("started", (result) => {
  chrome.action.setBadgeText({ text: result.started ? "ON" : "OFF" });
  chrome.action.setBadgeBackgroundColor({
    color: result.started ? "#cfffd5" : "#faa0a0",
  });
});
