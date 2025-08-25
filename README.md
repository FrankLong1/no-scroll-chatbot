# AI Chat Auto-Scroll Blocker (Local)

A privacy-first Chrome extension that blocks programmatic auto-scrolling on AI chat platforms while preserving all user-initiated scrolling.

## What It Does

This extension prevents ChatGPT, Gemini, and Claude from automatically jumping to the bottom of conversations while messages are being generated. You retain full control over scrolling with your mouse wheel, trackpad, keyboard, or touch gestures.

## Privacy Stance

**Zero Permissions:** This extension requests no special permissions from Chrome.
- **No storage** - doesn't save any data
- **No background processes** - runs only when needed
- **No network access** - completely offline
- **No telemetry** - doesn't track or report anything
- **No popup UI** - invisible once installed

## Installation

### Step 1: Get the Extension Files
- **Option A:** Download this repository as a ZIP file and extract it
- **Option B:** Clone with Git: `git clone https://github.com/FrankLong1/no-scroll-chatbot.git`

### Step 2: Install in Chrome
1. Open **Google Chrome**
2. Go to `chrome://extensions/` (copy-paste this into address bar)
3. In the top-right corner, enable **Developer mode** toggle
4. Click the **Load unpacked** button that appears
5. Browse to and select the `no-scroll-chatbot` folder (the one containing `manifest.json`)
6. Click **Select Folder** or **Open**

### Step 3: Verify Installation
- You should see "AI Chat Auto-Scroll Blocker (Local)" appear in your extensions list
- Make sure the toggle switch is **ON** (blue)
- No extension icon will appear in your toolbar (this is intentional)

### Step 4: Test It Out
1. Visit [ChatGPT](https://chatgpt.com), [Gemini](https://gemini.google.com), or [Claude](https://claude.ai)
2. Ask for a long response (like "write me a detailed 1000-word story")
3. Notice the page doesn't auto-scroll as text appears
4. Your manual scrolling still works perfectly

### Troubleshooting Installation
- **"Manifest file is missing or unreadable"**: Make sure you selected the folder containing `manifest.json`
- **Extension not working**: Refresh the chat page after installation
- **Can't find extensions page**: Type exactly `chrome://extensions/` in the address bar

## How to Verify It's Working

1. Visit [ChatGPT](https://chatgpt.com), [Gemini](https://gemini.google.com), or [Claude](https://claude.ai)
2. Start a conversation that generates a long response
3. **Without the extension:** The page automatically scrolls down as text appears
4. **With the extension:** The page stays where you left it, no auto-scrolling
5. **Manual scrolling:** Your mouse wheel, trackpad gestures, and keyboard still work normally

## Supported Platforms

- **ChatGPT** (`chatgpt.com`)
- **Google Gemini** (`gemini.google.com`)
- **Claude** (`claude.ai`)

## Technical Details

This extension uses main-world script injection to patch JavaScript scroll methods:
- `Element.prototype.scrollIntoView`
- `Element.prototype.scrollTo` / `scrollBy`  
- `window.scrollTo` / `scrollBy`

The patches are non-writable and non-configurable, with defensive re-patching every second to prevent restoration by page scripts.

## FAQ

**Q: Why don't I see any extension icon or UI?**  
A: This extension runs silently without any interface. It's always active on supported sites.

**Q: Can I turn it off temporarily?**  
A: Go to `chrome://extensions/` and toggle the extension off, or remove it entirely.

**Q: Does this affect other websites?**  
A: No, it only runs on ChatGPT, Gemini, and Claude. Other sites are unaffected.

**Q: Will this break the chat interfaces?**  
A: No, it only blocks programmatic scrolling. All other functionality remains intact.

**Q: Is my data safe?**  
A: Yes, this extension has zero permissions and runs entirely locally. It cannot access, store, or transmit any data.

## Troubleshooting

**Extension not working:**
1. Verify it's enabled in `chrome://extensions/`
2. Refresh the chat page
3. Check that you're on a supported domain

**Manual scrolling not working:**
1. This is likely a separate browser or system issue
2. The extension only blocks programmatic scrolling, not user input

## Development

This is a minimal Manifest V3 extension with three files:
- `manifest.json` - Extension configuration
- `content.js` - Script injector
- `README.md` - This documentation

No build process required - load directly as an unpacked extension for development.

## License

MIT License - Use freely for personal or commercial projects.