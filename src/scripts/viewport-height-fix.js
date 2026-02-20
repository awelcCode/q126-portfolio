// Viewport Height Fix for Safari
// Sets actual viewport height as CSS variable to fix 100vh bug
// Also detects Safari for browser-specific CSS

(function() {
  // Detect Safari
  const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
  if (isSafari) {
    document.documentElement.classList.add('is-safari');
  }

  function setVH() {
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
  }

  // Set on load
  setVH();

  // Update on resize (debounced)
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      setVH();
    }, 100);
  });

  // Update on orientation change (mobile)
  window.addEventListener('orientationchange', () => {
    setTimeout(setVH, 100); // Small delay for Safari
  });
})();
