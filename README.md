# Scroll-Lock for AI Chat

Tired of losing your place when AI chats auto-scroll? This extension stops that. It's a simple, open-source, and privacy-focused solution to a very annoying problem.

## The Problem

You're reading a long, detailed response from an AI chatbot like ChatGPT, Gemini, or Claude. Halfway through, you think of a follow-up question and want to type it in before you forget. But as soon as the AI finishes generating its response, the page forcefully scrolls you to the bottom, and you lose your spot. You have to scroll back up and hunt for where you were, breaking your concentration. It's a frustrating experience, especially since many platforms have removed or broken their own "disable auto-scroll" features.

## The Solution

This extension prevents the annoying behavior where new messages auto-scroll you away from what you're reading.

It works with a simple but effective rule:
*   **It allows the first autoscroll** on each page or chat to happen, so you see the latest messages when they start generating.
*   **It blocks all subsequent autoscrolls**, letting you read at your own pace without losing your position.

Your manual scrolling (using your mouse wheel, trackpad, or keyboard) is completely unaffected. The extension works by intercepting the page's scroll commands and using a simple counter system, as detailed in the "How It Works" section below.

## Why Another Scroll Blocker? (Open Source & Security)

There are other extensions that do this, but most of them are not open-source. That's a major security and privacy concern. A browser extension that can inject JavaScript into a page requires significant permissions, giving it potential access to your conversations or personal data.

This extension was built to be different:
*   **100% Open Source:** You can see every line of code right here in this repository.
*   **Extremely Simple:** The entire logic is in a single, ~100-line JavaScript file (`content.js`). It is heavily commented and easy to read and verify for yourself.
*   **Privacy First:** It requests zero special permissions, stores no data, and makes no network requests. It cannot read your chats or track your activity.

You shouldn't have to compromise your privacy for a better user experience.

## Installation

You have two options for installing this extension.

### Option 1: Install from the Chrome Web Store (Recommended)

For convenience, you can install this extension directly from the Chrome Web Store.

[Link to Chrome Web Store] <-- I will add this link once it's published.

### Option 2: Install from Source Code (for Developers)

If you prefer to build it yourself or want to inspect the code before installing, you can load it directly from this repository.

**Step 1: Get the Extension Files**
*   **Option A:** Download this repository as a ZIP file and extract it.
*   **Option B:** Clone with Git: `git clone https://github.com/FrankLong1/no-scroll-chatbot.git`

**Step 2: Install in Chrome**
1.  Open **Google Chrome**.
2.  Go to `chrome://extensions/` (copy-paste this into your address bar).
3.  In the top-right corner, enable the **Developer mode** toggle.
4.  Click the **Load unpacked** button that appears.
5.  Browse to and select the `no-scroll-chatbot` folder (the one containing `manifest.json`).
6.  Click **Select Folder** or **Open**.

The extension will be installed and active immediately.

## Supported Platforms

*   **ChatGPT** (`chatgpt.com`)
*   **Google Gemini** (`gemini.google.com`)
*   **Claude** (`claude.ai`)

## How It Works

The extension injects a small script that intercepts and overrides JavaScript's native scroll functions (`scrollIntoView`, `scrollTo`, etc.). It uses a simple counter to allow the first scroll attempt on a page load or navigation and blocks all subsequent attempts. It's a lightweight and effective approach that doesn't interfere with the chat application's functionality.

## License

This project is open-source and available under the MIT License.
