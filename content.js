(() => {
  // Main-world script injection for blocking autoscroll
  const pageCode = `
    (() => {
      let repatchInterval;

      // Hard block a method by making it non-writable and non-configurable
      function hardBlock(owner, key) {
        try {
          Object.defineProperty(owner, key, {
            value: () => {},
            writable: false,
            configurable: false
          });
        } catch (e) {
          // Fallback: simple assignment
          owner[key] = () => {};
        }
      }

      // Install scroll blocking patches
      function install() {
        // Block Element scroll methods
        hardBlock(Element.prototype, 'scrollIntoView');
        hardBlock(Element.prototype, 'scrollTo');
        hardBlock(Element.prototype, 'scrollBy');

        // Block Window scroll methods
        hardBlock(window, 'scrollTo');
        hardBlock(window, 'scrollBy');

        // Disable smooth scrolling behavior
        document.documentElement.style.scrollBehavior = 'auto';
      }

      // Initial install
      install();

      // Defensive re-patching every 1000ms
      repatchInterval = setInterval(install, 1000);

      // Clean up on page unload
      window.addEventListener('beforeunload', () => {
        if (repatchInterval) {
          clearInterval(repatchInterval);
        }
      });
    })();
  `;

  // Inject the page-world script
  const script = document.createElement('script');
  script.textContent = pageCode;
  (document.head || document.documentElement).appendChild(script);
  script.remove();
})();