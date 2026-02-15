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
    link: "/buyBox",
    posterImage: "images/project1-fallback.jpg", // Background image for all browsers
  },
  2: {
    title: "Circuit Coffee Logo Animation",
    theme: "theme-ocean",
    link: "https://www.youtube.com/watch?v=HmW7Dp1DpMk",
    posterImage: "images/project2-fallback.jpg",
  },
  3: {
    title: "Project Collective",
    theme: "theme-tan",
    link: "/projectCollective",
    posterImage: "images/project3-fallback.jpg",
  },
};

const players = {};

// Detect Safari
const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

// 1. Setup background images for ALL browsers
const setupBackgroundImages = () => {
  Object.keys(slots).forEach((id) => {
    const slot = slots[id];
    const data = projectData[id];

    const container = slot.querySelector("div[style*='padding']");
    if (!container) return;

    // Set container background image via CSS (cleaner approach)
    container.style.backgroundImage = `url(${data.posterImage})`;
    container.style.backgroundSize = "cover";
    container.style.backgroundPosition = "center";

    // For Safari, hide the iframe completely
    if (isSafari) {
      const iframe = slot.querySelector("iframe");
      if (iframe) {
        iframe.style.display = "none";
      }
    }
  });
};

// 2. Initialize Players (skip for Safari)
const initPlayers = () => {
  if (isSafari) {
    console.log("Safari detected - using static images instead of videos");
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

  // Update Theme & Text
  stickyView.className = `sticky-view ${data.theme}`;
  titleEl.textContent = data.title;
  if (linkEl) linkEl.href = data.link;

  // Update Active Class
  Object.keys(slots).forEach((slotId) => {
    if (slotId === id) {
      slots[slotId].classList.add("active");

      // Play video only if not Safari
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

// 4. Trigger Observer (The Scrolling Logic)
const triggerObserver = new IntersectionObserver(
  (entries) => {
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

// 5. "Wake Up" Observer (Starts Video 1 early - non-Safari only)
const wakeUpObserver = new IntersectionObserver(
  (entries) => {
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

// 6. Global Initialization
window.addEventListener("load", () => {
  // Setup background images for ALL browsers
  setupBackgroundImages();

  if (!isSafari) {
    initPlayers();

    // Interaction Failsafe (Non-Safari)
    const unlockAll = () => {
      if (players["1"]) players["1"].play();
      window.removeEventListener("scroll", unlockAll);
      window.removeEventListener("touchstart", unlockAll);
    };
    window.addEventListener("scroll", unlockAll, { passive: true });
    window.addEventListener("touchstart", unlockAll, { passive: true });
  }

  // Start observing triggers
  triggers.forEach((trigger) => triggerObserver.observe(trigger));

  // Start observing the whole section to wake it up early
  if (featuredWrapper) wakeUpObserver.observe(featuredWrapper);

  // Set initial UI state
  switchToProject("1");
});
