// Popup script for Jira Assignee Search Extension
let isEnabled = true;
const debugDiv = document.getElementById("debug");

function debug(message) {
  console.log(message);
}

// Load current state
chrome.storage.sync.get(["extensionEnabled"], function (result) {
  if (chrome.runtime.lastError) {
    debug("Storage error: " + chrome.runtime.lastError.message);
    isEnabled = true;
  } else {
    isEnabled = result.extensionEnabled !== false;
    debug(`Loaded state: ${isEnabled ? "enabled" : "disabled"}`);
  }
  updateUI();
});

// Toggle functionality
document.getElementById("toggleSwitch").addEventListener("click", function () {
  debug("Toggle clicked - switching state...");
  isEnabled = !isEnabled;

  // Send message to background script
  chrome.runtime.sendMessage(
    {
      action: "toggleExtension",
      enabled: isEnabled,
    },
    function (response) {
      if (chrome.runtime.lastError) {
        debug("Error: " + chrome.runtime.lastError.message);
      } else if (response && response.success) {
        debug(`Successfully ${isEnabled ? "enabled" : "disabled"} extension`);
      } else {
        debug("Unknown response from background script");
      }
    }
  );

  updateUI();
  showRefreshNotice();
});

function updateUI() {
  const status = document.getElementById("status");
  const toggle = document.getElementById("toggleSwitch");
  const features = document.querySelectorAll(".feature");
  const footerText = document.getElementById("footerText");

  if (isEnabled) {
    status.className = "status enabled";
    status.innerHTML = "✅ Extension Active";
    toggle.className = "toggle-switch enabled";
    footerText.textContent =
      "Open any Jira assignee dropdown to see the search box!";

    features.forEach((feature) => {
      feature.classList.remove("disabled");
    });
  } else {
    status.className = "status disabled";
    status.innerHTML = "❌ Extension Disabled";
    toggle.className = "toggle-switch";
    footerText.textContent =
      "Extension is disabled. Toggle on to enable search functionality.";

    features.forEach((feature) => {
      feature.classList.add("disabled");
    });
  }
}

function showRefreshNotice() {
  const notice = document.getElementById("refreshNotice");
  notice.style.display = "block";
  setTimeout(() => {
    notice.style.display = "none";
  }, 5000);
}

// Test functionality
setTimeout(() => {
  debug("Popup loaded and ready");
}, 500);
