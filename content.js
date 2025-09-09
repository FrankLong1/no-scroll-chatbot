let scrollCount = 0;           // Tracks scroll attempts per page load.
let currentUrl = window.location.href;  // Used to detect client-side navigation.

// Intercepts and overrides a scroll method with our blocking logic.
function blockScrollMethod(owner, methodName) {
  const originalMethod = owner[methodName];
  if (!originalMethod) return; // Skip if method doesn't exist.

  Object.defineProperty(owner, methodName, {
    value: function(...args) {
      if (window.location.href !== currentUrl) { // If URL changes,
        currentUrl = window.location.href;       // update it,
        scrollCount = 0;                         // and reset the scroll counter.
      }

      scrollCount++;
      if (scrollCount === 1) {
        return originalMethod.apply(this, args); // Allow the first scroll.
      }
      return; // Block all subsequent scrolls.
    },
    writable: false,   // Prevent the method from being overwritten.
    configurable: false // Prevent the property from being reconfigured.
  });
}

// Installs scroll blocking on all relevant methods.
function installScrollBlocks() {
  blockScrollMethod(Element.prototype, 'scrollIntoView'); // The main culprit for autoscrolling.
  blockScrollMethod(Element.prototype, 'scrollTo');     // Defensive measure.
  blockScrollMethod(Element.prototype, 'scrollBy');       // Defensive measure.
  blockScrollMethod(Element.prototype, 'scroll');         // Defensive measure.
  blockScrollMethod(window, 'scrollTo');                  // Defensive measure for window-level scrolls.
  blockScrollMethod(window, 'scrollBy');                  // Defensive measure for window-level scrolls.
  blockScrollMethod(window, 'scroll');                    // Defensive measure for window-level scrolls.
  
  if (document.documentElement) {
    document.documentElement.style.scrollBehavior = 'auto'; // Disable smooth scrolling animations.
  }
}

// --- Main Execution ---

installScrollBlocks(); // Install the blocks immediately on script load.

// Re-install every second as a defense against frameworks (e.g., React) that might restore original methods.
setInterval(installScrollBlocks, 1000);
