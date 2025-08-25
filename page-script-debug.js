// Page-world debug script - injected via web_accessible_resources to bypass CSP
(() => {
  let repatchInterval;

  // Log and block a method
  function logAndBlock(owner, key, ownerName = 'unknown') {
    const original = owner[key];
    
    try {
      Object.defineProperty(owner, key, {
        value: function(...args) {
          console.warn(`🚫 BLOCKED ${ownerName}.${key}() called with args:`, args);
          console.trace('Call stack:');
          // Don't execute the original function - block it
          return;
        },
        writable: false,
        configurable: false
      });
      console.log(`✅ Patched ${ownerName}.${key}`);
    } catch (e) {
      // Fallback: simple assignment
      owner[key] = function(...args) {
        console.warn(`🚫 BLOCKED ${ownerName}.${key}() (fallback) called with args:`, args);
        console.trace('Call stack:');
        return;
      };
      console.log(`⚠️ Fallback patched ${ownerName}.${key}`);
    }
  }

  // Monitor property changes that might affect scrolling
  function monitorScrollProperties() {
    const elements = [document.documentElement, document.body];
    elements.forEach(el => {
      if (el) {
        ['scrollTop', 'scrollLeft'].forEach(prop => {
          let value = el[prop];
          Object.defineProperty(el, prop, {
            get() { return value; },
            set(newValue) {
              console.warn(`🚫 BLOCKED ${el.tagName}.${prop} = ${newValue} (was ${value})`);
              console.trace('Property set call stack:');
              // Don't actually change the value
            },
            configurable: true
          });
        });
      }
    });
  }

  // Install comprehensive scroll blocking
  function install() {
    console.log('🔧 Installing scroll blocks...');
    
    // Block Element scroll methods
    logAndBlock(Element.prototype, 'scrollIntoView', 'Element.prototype');
    logAndBlock(Element.prototype, 'scrollTo', 'Element.prototype');
    logAndBlock(Element.prototype, 'scrollBy', 'Element.prototype');
    logAndBlock(Element.prototype, 'scroll', 'Element.prototype');

    // Block Window scroll methods
    logAndBlock(window, 'scrollTo', 'window');
    logAndBlock(window, 'scrollBy', 'window');
    logAndBlock(window, 'scroll', 'window');

    // Monitor direct property assignment
    monitorScrollProperties();

    // Disable smooth scrolling behavior
    document.documentElement.style.scrollBehavior = 'auto';
    console.log('✅ Set scroll-behavior to auto');
  }

  // Initial install
  console.log('🚀 Debug scroll blocker starting...');
  install();

  // Defensive re-patching every 1000ms
  repatchInterval = setInterval(() => {
    console.log('🔄 Re-patching scroll methods...');
    install();
  }, 1000);

  // Clean up on page unload
  window.addEventListener('beforeunload', () => {
    console.log('🧹 Cleaning up scroll blocker...');
    if (repatchInterval) {
      clearInterval(repatchInterval);
    }
  });

  // Log when page finishes loading
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      console.log('📄 DOM loaded - scroll blocker active');
    });
  }
  
  window.addEventListener('load', () => {
    console.log('🎯 Page fully loaded - scroll blocker active');
  });

  console.log('✨ Debug scroll blocker initialized');
})();