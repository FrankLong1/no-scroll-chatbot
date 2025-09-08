/**
 * AI Chat Auto-Scroll Blocker
 * 
 * This extension allows the first autoscroll on each page/chat to happen 
 * (so you see the latest messages), then blocks all subsequent autoscrolls
 * to prevent the annoying behavior where new messages auto-scroll you away
 * from what you're reading.
 * 
 * Works by intercepting scroll methods and using a simple counter system.
 */

console.log('🚀 AI Chat Auto-Scroll Blocker loading on:', window.location.hostname);

// State tracking: Allow first scroll per page/URL, block the rest
let scrollCount = 0;           // Tracks how many scroll attempts have been made
let currentUrl = window.location.href;  // Detect client-side navigation (URL changes without page reload)

/**
 * Intercepts a scroll method and applies the "first scroll only" logic
 * @param {Object} owner - The object that owns the method (Element.prototype, window, etc)
 * @param {string} methodName - Name of the method to intercept (scrollIntoView, scrollTo, etc)
 * @param {string} ownerName - Human-readable name for logging
 */
function blockScrollMethod(owner, methodName, ownerName) {
  try {
    const originalMethod = owner[methodName];
    Object.defineProperty(owner, methodName, {
      value: function(...args) {
        // Check if URL changed (client-side navigation)
        if (window.location.href !== currentUrl) {
          currentUrl = window.location.href;
          scrollCount = 0;
          console.log(`🔄 URL changed - reset scroll counter for: ${currentUrl}`);
        }
        
        scrollCount++;
        if (scrollCount === 1) {
          console.log(`✅ Allowed first ${ownerName}.${methodName}() - initial scroll`);
          return originalMethod.apply(this, args);
        } else {
          console.log(`🚫 Blocked ${ownerName}.${methodName}() - autoscroll prevented (count: ${scrollCount})`);
          return;
        }
      },
      writable: false,
      configurable: false
    });
    console.log(`✅ Successfully blocked ${ownerName}.${methodName}`);
  } catch (e) {
    // Fallback for older browsers or edge cases
    const originalMethod = owner[methodName];
    owner[methodName] = function(...args) {
      // Check if URL changed (client-side navigation)
      if (window.location.href !== currentUrl) {
        currentUrl = window.location.href;
        scrollCount = 0;
        console.log(`🔄 URL changed - reset scroll counter for: ${currentUrl}`);
      }
      
      scrollCount++;
      if (scrollCount === 1) {
        console.log(`✅ Allowed first ${ownerName}.${methodName}() - initial scroll (fallback)`);
        return originalMethod && originalMethod.apply(this, args);
      } else {
        console.log(`🚫 Blocked ${ownerName}.${methodName}() - autoscroll prevented (fallback, count: ${scrollCount})`);
        return;
      }
    };
    console.log(`⚠️ Fallback block applied to ${ownerName}.${methodName}`);
  }
}

/**
 * Installs scroll blocking on all relevant methods
 * Covers both element-specific and window-level scroll methods
 */
function installScrollBlocks() {
  // Block the main culprit - scrollIntoView (most common autoscroll method)
  blockScrollMethod(Element.prototype, 'scrollIntoView', 'Element.prototype');
  
  // Block other element scroll methods as defensive measures
  blockScrollMethod(Element.prototype, 'scrollTo', 'Element.prototype');
  blockScrollMethod(Element.prototype, 'scrollBy', 'Element.prototype');
  blockScrollMethod(Element.prototype, 'scroll', 'Element.prototype');
  
  // Block window-level scroll methods
  blockScrollMethod(window, 'scrollTo', 'window');
  blockScrollMethod(window, 'scrollBy', 'window'); 
  blockScrollMethod(window, 'scroll', 'window');
  
  // Force disable smooth scrolling behavior to prevent animations
  if (document.documentElement) {
    document.documentElement.style.scrollBehavior = 'auto';
    console.log('✅ Disabled smooth scrolling');
  }
}

// Install scroll blocking immediately when script loads
installScrollBlocks();

// Re-install every second as defensive measure against dynamic content/frameworks
// that might restore original methods
setInterval(installScrollBlocks, 1000);

console.log('✨ AI Chat Auto-Scroll Blocker active - first scroll allowed, rest blocked!');

// Cleanup logging on page unload
window.addEventListener('beforeunload', () => {
  console.log('👋 AI Chat Auto-Scroll Blocker unloading');
});