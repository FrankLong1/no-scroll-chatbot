# Scroll-Lock for AI Chat

## Overview

I made this browser extension to prevent AI chat applications like ChatGPT, Gemini, and Claude from auto-scrolling. I would be in the middle of reading a long response, think of a follow-up question, and want to send it in before I forgot so the model could work on generating the response, but then I the page would scroll to the bottom and I'd lose my spot. 

There were other extensions to solve this, but none of them were open-source. To do this kind of thing, an extension needs some serious permissions to inject JavaScript into the page, and I wasn't comfortable with the security of a closed-source tool having that access. So, I decided to write an open-source version you can read and verify for yourself.

## Implementation

The solution turned out to be pretty simple, just a small (~50 lines) JavaScript file (`content.js`) that gets injected into the page. 

It works by overriding the page's native scroll functions (`scrollIntoView`, `scrollTo`, etc.). A counter allows the *first* scroll to happen when the page loads, so you see the latest message, but then it blocks all the ones after that. This does introduce an edge case where when you start a brand new chat, it will do the autoscroll on the 2nd or 3rd message (whichever forces the model to create enough content to require an autoscroll). Handling this was not worth it for me, as scrolling up one message one time per conversation was perfectly manageable.

The sites it runs on are just hardcoded in the `manifest.json` file. If you install it from the source code, you can add other websites to that file yourself.
*   **ChatGPT** (`chatgpt.com`)
*   **Google Gemini** (`gemini.google.com`)
*   **Claude** (`claude.ai`)

## Installation

You can install this from the Chrome Web Store or directly from the code.

### Option 1: Chrome Web Store

[Link to Chrome Web Store] <-- Coming soon.

### Option 2: Self-Install from Source

If you want to inspect the code, you can load the extension directly from this repository.

**Step 1: Get the Code**
*   **Option A:** Download this repository as a ZIP file and extract it.
*   **Option B:** Clone with Git: `git clone https://github.com/FrankLong1/no-scroll-chatbot.git`

**Step 2: Install in Chrome**
1.  Open Google Chrome and navigate to `chrome://extensions/`.
2.  Enable the **Developer mode** toggle in the top-right corner.
3.  Click the **Load unpacked** button.
4.  Select the `no-scroll-chatbot` folder (the one containing `manifest.json`).

The extension will be installed and active immediately.

## License

This project is open-source and available under the MIT License.