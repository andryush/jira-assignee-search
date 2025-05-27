// Background script for Jira Assignee Search Extension
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "toggleExtension") {
    // Store the state
    chrome.storage.sync.set({ extensionEnabled: request.enabled }, () => {
      console.log(`Extension ${request.enabled ? "enabled" : "disabled"}`);

      // Send message to all Jira tabs
      chrome.tabs.query({}, (tabs) => {
        tabs.forEach((tab) => {
          if (
            tab.url &&
            (tab.url.includes("atlassian.net") ||
              tab.url.includes("atlassian.com") ||
              tab.url.includes("/jira/"))
          ) {
            chrome.tabs
              .sendMessage(tab.id, {
                action: "toggleExtension",
                enabled: request.enabled,
              })
              .catch(() => {
                // Ignore errors for tabs without content script
              });
          }
        });
      });

      sendResponse({ success: true });
    });

    return true; // Keep message channel open for async response
  }
});

// Initialize extension state
chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.set({ extensionEnabled: true });
});
