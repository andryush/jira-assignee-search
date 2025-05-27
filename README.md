# Jira Assignee Search

A Chrome extension that adds search functionality to Jira assignee dropdowns, making it easier and faster to find and select users.

## Problem

In Jira, when you need to assign a task to someone, the assignee dropdown list can be very large and doesn't have a built-in search functionality. This makes it difficult and time-consuming to find the right person, especially in organizations with many users.

## Solution

This extension adds a search box at the top of any Jira assignee dropdown, allowing you to quickly filter the list of users by typing part of their name.

## Features

- 🔍 Adds a search box to Jira assignee dropdowns
- ⚡ Filters users in real-time as you type
- 🎯 Works with all Jira Cloud instances (atlassian.net, atlassian.com)
- 🔄 Works with dynamically loaded content
- 🎚️ Can be easily toggled on/off through the extension popup
- ⌨️ Keyboard shortcut: Press ESC to clear the search
- 🎨 Styled to match Jira's UI

## Installation

### From Source Code

1. Clone this repository:
   ```
   git clone https://github.com/yourusername/jira-assignee-search.git
   ```
   
2. Open Chrome and navigate to `chrome://extensions/`

3. Enable "Developer mode" by toggling the switch in the top right corner

4. Click "Load unpacked" and select the cloned repository folder

5. The extension should now be installed and active

## Usage

1. Navigate to any Jira page with an assignee dropdown

2. Click on the assignee field to open the dropdown

3. A search box will automatically appear at the top of the dropdown

4. Start typing to filter the list of users

5. Press ESC to clear the search

6. Click on a user to select them as usual

## Toggling the Extension

1. Click on the extension icon in the Chrome toolbar

2. Use the toggle switch to enable or disable the extension

3. When disabled, no search boxes will be added to Jira dropdowns

## Compatibility

- Works with Jira Cloud (atlassian.net, atlassian.com)
- Works with self-hosted Jira instances
- Compatible with Chrome, Edge, and other Chromium-based browsers

## Privacy

This extension:
- Does not collect any user data
- Does not send any information to external servers
- Only operates on Jira pages
- Requires minimal permissions (only access to Jira sites)

## Contributing

Contributions are welcome! Feel free to submit issues or pull requests.

## License

[MIT License](LICENSE)
