(function () {
  "use strict";

  console.log("🔍 Jira Assignee Search Extension Loaded");

  let searchBoxAdded = new Set();
  let isEnabled = true;

  // Check initial state from storage
  chrome.storage.sync.get(["extensionEnabled"], function (result) {
    if (!chrome.runtime.lastError) {
      isEnabled = result.extensionEnabled !== false;
      console.log(`Initial state: ${isEnabled ? "enabled" : "disabled"}`);
      if (isEnabled) {
        setTimeout(addSearchToDropdown, 500);
      }
    }
  });

  // Listen for toggle messages
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "toggleExtension") {
      isEnabled = request.enabled;
      console.log(`Extension toggled: ${isEnabled ? "enabled" : "disabled"}`);

      if (isEnabled) {
        // Re-enable: add search boxes
        setTimeout(addSearchToDropdown, 100);
      } else {
        // Disable: remove all search boxes
        removeAllSearchBoxes();
      }

      sendResponse({ success: true });
    }
  });

  function removeAllSearchBoxes() {
    console.log("🧹 Removing all search boxes");
    document
      .querySelectorAll(".jira-search-container")
      .forEach((el) => el.remove());
    document.querySelectorAll(".jira-no-results").forEach((el) => el.remove());
    searchBoxAdded.clear();

    // Restore all hidden items
    document.querySelectorAll('[role="menuitemcheckbox"]').forEach((item) => {
      const container =
        item.closest('div[class*="_v6yzze3t"]') ||
        item.closest('[class*="css-"]') ||
        item.closest("div") ||
        item.parentElement;
      if (container) {
        container.style.display = "";
      }
    });
  }

  function addSearchToDropdown() {
    if (!isEnabled) return;

    const dropdowns = document.querySelectorAll('[role="menu"]');
    console.log(`🔍 Found ${dropdowns.length} dropdowns`);

    dropdowns.forEach((dropdown) => {
      if (searchBoxAdded.has(dropdown)) return;

      const userItems = dropdown.querySelectorAll('[role="menuitemcheckbox"]');
      const hasUserAvatars =
        dropdown.querySelectorAll('img[alt=""], img[data-vc="avatar-image"]')
          .length > 0;

      if (userItems.length > 3 && hasUserAvatars) {
        console.log(
          "📝 Adding search to dropdown with",
          userItems.length,
          "users"
        );

        searchBoxAdded.add(dropdown);

        const searchContainer = document.createElement("div");
        searchContainer.className = "jira-search-container";
        searchContainer.style.cssText = `
                    position: sticky !important;
                    top: 0 !important;
                    background: white !important;
                    padding: 10px !important;
                    border-bottom: 1px solid #ddd !important;
                    z-index: 1000 !important;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.1) !important;
                `;

        const searchBox = document.createElement("input");
        searchBox.type = "text";
        searchBox.placeholder = "🔍 Search users...";
        searchBox.style.cssText = `
                    width: 100% !important;
                    padding: 8px 12px !important;
                    border: 2px solid #ddd !important;
                    border-radius: 4px !important;
                    font-size: 14px !important;
                    box-sizing: border-box !important;
                    outline: none !important;
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
                `;

        // Focus styling
        searchBox.addEventListener("focus", () => {
          searchBox.style.borderColor = "#0052cc";
          searchBox.style.boxShadow = "0 0 0 2px rgba(0, 82, 204, 0.2)";
        });

        searchBox.addEventListener("blur", () => {
          searchBox.style.borderColor = "#ddd";
          searchBox.style.boxShadow = "none";
        });

        // Search functionality
        searchBox.addEventListener("input", (e) => {
          const searchTerm = e.target.value.toLowerCase();
          let visibleCount = 0;

          userItems.forEach((item) => {
            const nameElement =
              item.querySelector('[data-item-title="true"]') ||
              item.querySelector('span[id*=":r"]');

            if (nameElement) {
              const userName = nameElement.textContent.toLowerCase();
              const shouldShow = !searchTerm || userName.includes(searchTerm);

              const container =
                item.closest('div[class*="_v6yzze3t"]') ||
                item.closest('[class*="css-"]') ||
                item.closest("div") ||
                item.parentElement;

              if (container) {
                container.style.display = shouldShow ? "" : "none";
                if (shouldShow) visibleCount++;
              }
            }
          });

          handleNoResults(dropdown, visibleCount, searchTerm);
        });

        // Keyboard shortcuts
        searchBox.addEventListener("keydown", (e) => {
          if (e.key === "Escape") {
            searchBox.value = "";
            searchBox.dispatchEvent(new Event("input"));
          }
          e.stopPropagation();
        });

        searchContainer.addEventListener("click", (e) => {
          e.stopPropagation();
        });

        searchContainer.appendChild(searchBox);
        dropdown.insertBefore(searchContainer, dropdown.firstChild);

        setTimeout(() => {
          if (document.contains(searchBox)) {
            searchBox.focus();
          }
        }, 200);
      }
    });
  }

  function handleNoResults(dropdown, visibleCount, searchTerm) {
    let noResultsMsg = dropdown.querySelector(".jira-no-results");

    if (visibleCount === 0 && searchTerm) {
      if (!noResultsMsg) {
        noResultsMsg = document.createElement("div");
        noResultsMsg.className = "jira-no-results";
        noResultsMsg.style.cssText = `
                    padding: 20px !important;
                    text-align: center !important;
                    color: #666 !important;
                    font-style: italic !important;
                    background: #f8f9fa !important;
                    margin: 8px !important;
                    border-radius: 4px !important;
                    border: 1px dashed #ddd !important;
                `;
        dropdown.appendChild(noResultsMsg);
      }
      noResultsMsg.innerHTML = `
                <div style="font-size: 24px; margin-bottom: 10px;">🔍</div>
                <div>No users found matching "<strong>${searchTerm}</strong>"</div>
                <div style="font-size: 12px; margin-top: 5px;">Try a different search term</div>
            `;
      noResultsMsg.style.display = "block";
    } else if (noResultsMsg) {
      noResultsMsg.style.display = "none";
    }
  }

  // Initialize with observer
  function initExtension() {
    if (isEnabled) {
      addSearchToDropdown();
    }

    let timeoutId;
    const observer = new MutationObserver(() => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        if (isEnabled) {
          addSearchToDropdown();
        }
      }, 100);
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initExtension);
  } else {
    initExtension();
  }

  console.log("✅ Jira Assignee Search Extension Ready");
})();
