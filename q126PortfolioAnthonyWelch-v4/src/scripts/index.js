// ===== STICKY PROJECT SWITCHER (BACKGROUND IMAGES FOR ALL) =====

const triggers = document.querySelectorAll(".project-trigger");
const stickyView = document.querySelector(".sticky-view");
const titleEl = document.getElementById("sticky-title");
const linkEl = document.getElementById("sticky-link");
const featuredWrapper = document.querySelector(".featured-wrapper");

const slots = {
  1: document.getElementById("video-1"),
  2: document.getElementById("video-2"),
  3: document.getElementById("video-3"),
};

const projectData = {
  1: {
    title: "Product Page Redesign, Rejuvenation",
    theme: "theme-plum",
    link: "#",
    posterImage: "images/project1-fallback.jpg",
  },
  2: {
    title: "Circuit Coffee Logo Animation",
    theme: "theme-ocean",
    link: "#",
    posterImage: "images/project2-fallback.jpg",
  },
  3: {
    title: "Project Collective",
    theme: "theme-tan",
    link: "#",
    posterImage: "images/project3-fallback.jpg",
  },
};

const players = {};

// Detect Safari
const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

// Detect mobile (900px or less)
const isMobile = () => window.innerWidth <= 900;

// 1. Setup background images for ALL browsers
const setupBackgroundImages = () => {
  Object.keys(slots).forEach((id) => {
    const slot = slots[id];
    const data = projectData[id];

    const container = slot.querySelector("div[style*='padding']");
    if (!container) return;

    container.style.backgroundImage = `url(${data.posterImage})`;
    container.style.backgroundSize = "cover";
    container.style.backgroundPosition = "center";

    if (isSafari) {
      const iframe = slot.querySelector("iframe");
      if (iframe) {
        iframe.style.display = "none";
      }
    }
  });
};

// 2. Initialize Players (skip for Safari or mobile)
const initPlayers = () => {
  if (isSafari || isMobile()) {
    console.log("Safari or mobile detected - using static images");
    return;
  }

  if (typeof Vimeo === "undefined") return;
  Object.keys(slots).forEach((id) => {
    const iframe = slots[id].querySelector("iframe");
    if (iframe) {
      players[id] = new Vimeo.Player(iframe);
      players[id].setVolume(0);
      players[id].setMuted(true);
    }
  });
};

// 3. The Core Switching Logic
const switchToProject = (id) => {
  const data = projectData[id];
  if (!data) return;

  // Skip switching on mobile - all cards are visible
  if (isMobile()) return;

  // Update Theme & Text
  stickyView.className = `sticky-view ${data.theme}`;
  titleEl.textContent = data.title;
  if (linkEl) linkEl.href = data.link;

  // Update Active Class
  Object.keys(slots).forEach((slotId) => {
    if (slotId === id) {
      slots[slotId].classList.add("active");

      if (!isSafari && players[slotId]) {
        players[slotId].ready().then(() => {
          players[slotId].play().catch(() => {});
        });
      }
    } else {
      slots[slotId].classList.remove("active");
      if (!isSafari && players[slotId]) {
        players[slotId].pause().catch(() => {});
      }
    }
  });
};

// 4. Show all cards on mobile
const showAllCardsOnMobile = () => {
  if (isMobile()) {
    Object.keys(slots).forEach((id) => {
      slots[id].classList.add("active");
    });
  }
};

// 5. Trigger Observer (Desktop only)
const triggerObserver = new IntersectionObserver(
  (entries) => {
    if (isMobile()) return;
    
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute("data-id");
        switchToProject(id);
      }
    });
  },
  {
    rootMargin: "-20% 0px -20% 0px",
    threshold: 0,
  },
);

// 6. "Wake Up" Observer (Desktop only)
const wakeUpObserver = new IntersectionObserver(
  (entries) => {
    if (isMobile()) return;
    
    entries.forEach((entry) => {
      if (entry.isIntersecting && !isSafari) {
        if (players["1"]) {
          players["1"].play().catch(() => {});
        }
      }
    });
  },
  { rootMargin: "0px 0px 300px 0px" },
);

// 7. Global Initialization
window.addEventListener("load", () => {
  setupBackgroundImages();

  if (isMobile()) {
    // Mobile: Show all cards
    showAllCardsOnMobile();
  } else {
    // Desktop: Initialize players and observers
    if (!isSafari) {
      initPlayers();

      const unlockAll = () => {
        if (players["1"]) players["1"].play();
        window.removeEventListener("scroll", unlockAll);
        window.removeEventListener("touchstart", unlockAll);
      };
      window.addEventListener("scroll", unlockAll, { passive: true });
      window.addEventListener("touchstart", unlockAll, { passive: true });
    }

    triggers.forEach((trigger) => triggerObserver.observe(trigger));
    if (featuredWrapper) wakeUpObserver.observe(featuredWrapper);
    switchToProject("1");
  }
});

// Handle resize
window.addEventListener("resize", () => {
  if (isMobile()) {
    showAllCardsOnMobile();
  }
});
