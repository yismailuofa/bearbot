/**
 * injectScript - Inject internal script to available access to the `window`
 *
 * @param  {type} file_path Local path of the internal script.
 * @param  {type} tag The tag as string, where the script will be append (default: 'body').
 * @see    {@link http://stackoverflow.com/questions/20499994/access-window-variable-from-content-script}
 */
function injectScript(file_path, tag) {
  var node = document.getElementsByTagName(tag)[0];
  var script = document.createElement("script");
  script.setAttribute("type", "text/javascript");
  script.setAttribute("src", file_path);
  node.appendChild(script);
}
injectScript(chrome.runtime.getURL("event.js"), "body");

chrome.runtime.sendMessage({ type: "popupStatus" }, (isPopupOpen) => {
  if (isPopupOpen && chrome.runtime.lastError === undefined) {
    let iterations = 0;
    let interval = setInterval(() => {
      let submitButton = document.getElementById("SSR_ENRL_FL_WRK_SUBMIT_PB");

      if (submitButton) {
        clearInterval(interval);

        let event = new CustomEvent("submit-bearbot");

        document.getElementsByTagName("body")[0].dispatchEvent(event);
      }

      if (iterations > 10) {
        clearInterval(interval);
      }

      iterations++;
    }, 1000);
  }
});
