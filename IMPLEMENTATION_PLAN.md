# AI Chat Auto-Scroll Blocker - Full Implementation Plan

## 1) Project Goal & Scope

**Goal:** Ship a tiny, privacy-lean Chrome extension that **always blocks programmatic autoscroll** on AI chat platforms (`chatgpt.com`, `gemini.google.com`, `claude.ai`), while leaving **user-initiated scrolling** (wheel, touch, keyboard) untouched.

**Out of scope (v1):**
* No popup UI
* No background/service worker
* No analytics, remote assets, or network calls
* No cross-device sync
* No per-site toggles (always on for all supported sites)

## 2) File Tree
```
no-scroll-chatbot/
├─ manifest.json
├─ content.js
├─ .gitignore
├─ README.md
└─ IMPLEMENTATION_PLAN.md (this file)
```

## 3) Implementation Phases

### ✅ Phase 1: Planning & Documentation
- [x] Create implementation plan document

### 📋 Phase 2: Foundation Setup
- [ ] Create `manifest.json` with zero permissions
- [ ] Set up minimal `.gitignore` file
- [ ] Implement `content.js` main-world injector

### 🔧 Phase 3: Core Functionality
- [ ] Implement page-world script injection
- [ ] Block scroll methods with hard patches
- [ ] Add defensive re-patching (1s interval)
- [ ] Set scroll-behavior to 'auto'

### 🧪 Phase 4: Testing & Documentation
- [ ] Create comprehensive README.md
- [ ] Test all scroll blocking scenarios
- [ ] Verify manual scrolling works normally
- [ ] Test long sessions and performance
Use pupeteeer to verify this yourself a bit to the xtent that you can

## 4) Architecture & Design

### 4.1 Overview
* **Manifest V3 + single content script**
* **Main-world patching:** Content scripts run in an *isolated world*, so patching prototypes there won't affect the page's own JavaScript. We inject a tiny inline `<script>` that executes in the **page (MAIN) world** to replace autoscroll methods with safe no-ops.

### 4.2 What we block
* `Element.prototype.scrollIntoView`
* `Element.prototype.scrollTo`
* `window.scrollTo`
* (Defensive) `window.scrollBy` and `Element.prototype.scrollBy`
* (Optional hardening) periodic re-patch in case the page tries to restore originals

### 4.3 Privacy posture
* **No permissions** (no `storage`, no `host_permissions` beyond matches)
* **No background worker**
* **No popup**
* **No web_accessible_resources**
* **No remote code or telemetry**

## 5) UX & Behavior
* **Always ON** on all supported AI chat platforms
* **No UI**. No console noise in production (debug logs off)
* **Manual scrolling unaffected** (wheel, touch, keys)
* **Accessibility preserved** (we don't intercept input events)

## 6) Specifications

### 6.1 `manifest.json`
* MV3
* Single `content_scripts` entry
* Covers ChatGPT, Gemini, and Claude
* `run_at: document_start` to patch before site JS binds

```json
{
  "manifest_version": 3,
  "name": "AI Chat Auto-Scroll Blocker (Local)",
  "version": "1.0.0",
  "description": "Blocks programmatic autoscroll on AI chat platforms. No popup, no storage, no background.",
  "content_scripts": [
    {
      "matches": [
        "https://chatgpt.com/*",
        "https://gemini.google.com/*",
        "https://claude.ai/*"
      ],
      "js": ["content.js"],
      "run_at": "document_start"
    }
  ]
}
```

### 6.2 `content.js` (MAIN-world injector)

**Responsibilities:**
* Inject an inline `<script>` with page-world code
* Page-world code patches the scroll methods and keeps them patched

**Spec (behavioral):**
* On load, create a `<script>` element with the `pageCode` string
* `pageCode`:
  * Defines `hardBlock(owner, key)` which sets method to a no-op via `Object.defineProperty` (non-writable, non-configurable), with assignment fallback
  * Calls `install()` once, then every 1000ms (defensive re-patch)
  * Sets `document.documentElement.style.scrollBehavior='auto'` (removes glide)
  * Clears interval on `beforeunload`

### 6.3 `.gitignore`
```gitignore
# OS junk
.DS_Store
Thumbs.db
```

### 6.4 `README.md` (key sections)
* What it does (one paragraph)
* Privacy stance (no permissions, no background, no telemetry)
* Install steps
* How to verify it's working
* FAQ (troubleshooting + known limitations)

## 7) Testing Plan

### 7.1 Environments
* Browser: Chrome Stable (latest), optionally Edge Chromium
* OS: macOS + Windows
* Sites: `https://chatgpt.com/`, `https://gemini.google.com/`, `https://claude.ai/`

### 7.2 Test Matrix

| Case | Steps | Expected |
|------|-------|----------|
| 1. Basic block | Load extension → open chat → prompt long answer | Page does **not** auto-jump to bottom while messages stream |
| 2. Manual wheel scroll | Scroll with mouse/trackpad during generation | Scrolling works normally |
| 3. Keyboard scroll | Use Space/PageDown/Arrow keys | Scrolling works normally |
| 4. Touch scroll (laptop/trackpad) | Two-finger swipe | Scrolling works normally |
| 5. Page reload | Cmd/Ctrl+R | Blocking still in effect |
| 6. Navigation in-site | Open a past chat / new chat | Blocking still in effect |
| 7. Long session | Keep tab open 10–15 min while content streams | No surprise jumps; re-patcher doesn't degrade performance |
| 8. Perf sanity | Record performance panel while generating | No measurable CPU spikes from re-patch interval (1s) |
| 9. Regression off (manual) | Temporarily comment `hardBlock` to test baseline | Baseline page auto-scroll returns (to confirm patch efficacy) |

**Note:** Manual scrolls don't call `scrollTo`/`scrollIntoView`—so our block doesn't interfere.

## 8) Acceptance Criteria (DoD)
* ✅ Blocks programmatic autoscroll on ChatGPT, Gemini, and Claude
* ✅ Manual user scroll unaffected on all platforms
* ✅ No permissions requested (manifest validates)
* ✅ No background worker, no popup, no storage
* ✅ No console errors or noisy logs
* ✅ Works after reloads and in long sessions
* ✅ README explains install, verify, and privacy

## 9) Risks & Mitigations
* **Page attempts to restore prototypes**
  *Mitigation:* periodic re-patch (1s). Keep code idempotent and cheap.

* **Future DOM API changes**
  *Mitigation:* small code surface; easy to update to new methods if needed.

* **Chrome tightening inline script policies**
  *Mitigation:* If inline injection becomes restricted, fall back to `world: "MAIN"` (where supported) or a declared `web_accessible_resources` script injected via a `<script src="...">` (still local, no remote).

* **Site scroller uses direct `scrollTop` on a container**
  *Mitigation (if ever observed):* observe scroll container and revert unexpected jumps; v1 keeps it simple because current behavior is controlled by the methods we block.

## 10) Installation Instructions
1. Open `chrome://extensions/`
2. Enable **Developer mode** 
3. Click **Load unpacked**
4. Select the project folder
5. Navigate to ChatGPT, Gemini, or Claude and test functionality

## 11) Delivery Timeline
* **Day 1:** Implement files; smoke test locally
* **Day 2:** Cross-OS/browser sanity; finalize README
* **Day 3:** Polish & package (zip), confirm no permissions and no warnings

---

**Definition of Done:** All acceptance criteria in §8 pass on Chrome Stable on macOS & Windows.