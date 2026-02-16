// Global Nav Dropdown System
document.addEventListener('DOMContentLoaded', () => {
  const navButtons = document.querySelectorAll('[data-dropdown]');
  const dropdown = document.querySelector('[data-dropdown-content]');
  const dropdownViews = document.querySelectorAll('[data-view]');
  const hamburger = document.querySelector('.hamburger');
  const nav = document.querySelector('nav');
  
  // Exit if nav elements don't exist on this page
  if (!dropdown || navButtons.length === 0) {
    console.log('Nav dropdown not found - skipping initialization');
    return;
  }
  
  let currentView = null;

  // Toggle dropdown and switch views (Desktop)
  navButtons.forEach(button => {
    button.addEventListener('click', (e) => {
      e.stopPropagation();
      const viewName = button.dataset.dropdown;
      
      // If clicking the same button, close dropdown
      if (currentView === viewName && dropdown.classList.contains('active')) {
        closeDropdown();
        return;
      }

      // Open dropdown and show correct view
      openDropdown(viewName);
      
      // Update button states
      navButtons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');
    });
  });

  // Toggle mobile menu
  if (hamburger) {
    hamburger.addEventListener('click', (e) => {
      e.stopPropagation();
      hamburger.classList.toggle('active');
      dropdown.classList.toggle('active');
      
      // On mobile, show all views
      if (window.innerWidth <= 900) {
        dropdownViews.forEach(view => view.classList.add('active'));
      }
    });
  }

  // Close dropdown when clicking outside
  document.addEventListener('click', (e) => {
    if (!e.target.closest('nav')) {
      closeDropdown();
    }
  });

  // Close on escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeDropdown();
    }
  });

  // Helper functions
  function openDropdown(viewName) {
    currentView = viewName;
    dropdown.classList.add('active');
    
    // Show only the requested view (desktop)
    if (window.innerWidth > 900) {
      dropdownViews.forEach(view => {
        if (view.dataset.view === viewName) {
          view.classList.add('active');
        } else {
          view.classList.remove('active');
        }
      });
    }
  }

  function closeDropdown() {
    if (!dropdown) return;
    
    currentView = null;
    dropdown.classList.remove('active');
    dropdownViews.forEach(view => view.classList.remove('active'));
    navButtons.forEach(btn => btn.classList.remove('active'));
    if (hamburger) {
      hamburger.classList.remove('active');
    }
  }

  // Handle window resize
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      if (dropdown && dropdown.classList.contains('active')) {
        closeDropdown();
      }
    }, 250);
  });

  // Auto-hide nav on scroll down, show on scroll up
  if (nav && !nav.classList.contains('homepage-nav')) {
    let lastScrollY = window.scrollY;
    let ticking = false;

    function updateNavVisibility() {
      const currentScrollY = window.scrollY;
      
      // Don't hide if at the very top
      if (currentScrollY < 10) {
        nav.classList.remove('nav-hidden');
      }
      // Hide when scrolling down
      else if (currentScrollY > lastScrollY && currentScrollY > 100) {
        nav.classList.add('nav-hidden');
        // Close dropdown when hiding nav
        closeDropdown();
      }
      // Show when scrolling up
      else if (currentScrollY < lastScrollY) {
        nav.classList.remove('nav-hidden');
      }
      
      lastScrollY = currentScrollY;
      ticking = false;
    }

    window.addEventListener('scroll', () => {
      if (!ticking) {
        window.requestAnimationFrame(updateNavVisibility);
        ticking = true;
      }
    });
  }
});

