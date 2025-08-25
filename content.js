// Main world content script - blocks autoscroll directly
console.log('🚀 AI Chat Auto-Scroll Blocker loading on:', window.location.hostname);

// Block scroll methods with debug logging
function blockScrollMethod(owner, methodName, ownerName) {
  try {
    Object.defineProperty(owner, methodName, {
      value: function(...args) {
        console.log(`🚫 Blocked ${ownerName}.${methodName}() - autoscroll prevented`);
        // Don't call the original method - just block it
        return;
      },
      writable: false,
      configurable: false
    });
    console.log(`✅ Successfully blocked ${ownerName}.${methodName}`);
  } catch (e) {
    // Fallback for older browsers or edge cases
    owner[methodName] = function(...args) {
      console.log(`🚫 Blocked ${ownerName}.${methodName}() - autoscroll prevented (fallback)`);
      return;
    };
    console.log(`⚠️ Fallback block applied to ${ownerName}.${methodName}`);
  }
}

// Install all scroll blocking
function installScrollBlocks() {
  // Block the main culprit - scrollIntoView
  blockScrollMethod(Element.prototype, 'scrollIntoView', 'Element.prototype');
  
  // Block other scroll methods as defensive measures
  blockScrollMethod(Element.prototype, 'scrollTo', 'Element.prototype');
  blockScrollMethod(Element.prototype, 'scrollBy', 'Element.prototype');
  blockScrollMethod(Element.prototype, 'scroll', 'Element.prototype');
  
  // Block window scroll methods
  blockScrollMethod(window, 'scrollTo', 'window');
  blockScrollMethod(window, 'scrollBy', 'window'); 
  blockScrollMethod(window, 'scroll', 'window');
  
  // Disable smooth scrolling
  if (document.documentElement) {
    document.documentElement.style.scrollBehavior = 'auto';
    console.log('✅ Disabled smooth scrolling');
  }
}

// Install immediately
installScrollBlocks();

// Re-install every second as defensive measure
setInterval(installScrollBlocks, 1000);

// Clean logging
console.log('✨ AI Chat Auto-Scroll Blocker active - autoscroll is now blocked!');

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
  console.log('👋 AI Chat Auto-Scroll Blocker unloading');
});