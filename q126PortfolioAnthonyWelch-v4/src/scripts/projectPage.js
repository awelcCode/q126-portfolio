document.addEventListener("DOMContentLoaded", () => {
  const railItems = document.querySelectorAll(".rail-item");
  const rail = document.querySelector(".project-nav-rail");
  // Important: include the full-bleed div in the targets!
  const targetSections = document.querySelectorAll(
    "section[id], .full-bleed-dark[id]"
  );

  const updateRail = () => {
    let currentId = "";
    let isOverlappingFullBleed = false;

    targetSections.forEach((section) => {
      const rect = section.getBoundingClientRect();

      // 1. SCROLLSPY LOGIC
      // We check if the top of the section has crossed a "trigger line" (150px from top)
      if (rect.top <= 150) {
        currentId = section.getAttribute("id");
      }

      // 2. HIDE LOGIC
      // Specifically check if the section is the full-bleed one AND if it's in view
      if (section.classList.contains("full-bleed-dark")) {
        if (rect.top < 400 && rect.bottom > 100) {
          isOverlappingFullBleed = true;
        }
      }
    });

    // Apply Active Class
    railItems.forEach((item) => {
      item.classList.remove("active");
      if (item.getAttribute("href") === `#${currentId}`) {
        item.classList.add("active");
      }
    });

    // Apply Visibility
    if (isOverlappingFullBleed) {
      rail.classList.add("rail-hidden");
    } else {
      rail.classList.remove("rail-hidden");
    }
  };

  // 3. CLICKING FIX
  railItems.forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const targetId = link.getAttribute("href");
      const targetElement = document.querySelector(targetId);

      if (targetElement) {
        const elementPosition =
          targetElement.getBoundingClientRect().top + window.pageYOffset;
        const offsetPosition = elementPosition - 100; // Adjust the 100 to your preference

        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth",
        });
      }
    });
  });

  window.addEventListener("scroll", updateRail);
  updateRail(); // Run once on load
});

/**
 * Tab Switcher for Buy Box Comparison Section
 * Swaps two images (Before/After) simultaneously
 */
function switchTab(type, event) {
  // 1. Identify both image targets and all buttons
  const beforeImg = document.getElementById("before-image");
  const afterImg = document.getElementById("after-image");
  const btns = document.querySelectorAll(".tab-btn");

  // 2. UI State: Update underlines
  btns.forEach((btn) => btn.classList.remove("active"));
  event.currentTarget.classList.add("active");

  // 3. Content State: Update both sources with a fade effect
  const images = [beforeImg, afterImg];

  images.forEach((img) => {
    if (img) {
      // Determine if this is the 'before' or 'after' target
      const state = img.id.includes("before") ? "before" : "after";

      // Start Fade
      img.style.opacity = 0;

      setTimeout(() => {
        // Update Source: images/finish-before.png, etc.
        img.src = `../images/buyBox/${type}-${state}.jpg`;
        img.style.transition = "opacity 0.3s ease";
        img.style.opacity = 1;
      }, 150);
    }
  });
}

/**
 * Pre-load all comparison images to prevent flickering
 */
window.addEventListener("load", () => {
  const types = ["finish", "length", "mount", "shade"];
  const states = ["before", "after"];

  types.forEach((type) => {
    states.forEach((state) => {
      const img = new Image();
      img.src = `../images/buyBox/${type}-${state}.jpg`;
    });
  });
});

/**
 * Animate numbers in the Stats Grid
 */
const animateStats = () => {
  const stats = document.querySelectorAll(".stat-value");

  stats.forEach((stat) => {
    const target = parseFloat(stat.innerText.replace(/[^0-9.]/g, ""));
    const isPercentage = stat.innerText.includes("%");
    const isCurrency = stat.innerText.includes("$");
    const duration = 1500; // 1.5 seconds
    let startTime = null;

    const step = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const current = progress * target;

      // Formatting logic
      let displayValue = current.toFixed(isCurrency ? 2 : 0);
      if (isCurrency) displayValue = `$${displayValue}`;
      if (isPercentage) displayValue = `${displayValue}%`;
      if (stat.innerText.includes("+")) displayValue = `+${displayValue}`;

      stat.innerText = displayValue;

      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };

    window.requestAnimationFrame(step);
  });
};

/**
 * Trigger animation when Stats Grid enters viewport
 */
const statsObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        animateStats();
        statsObserver.unobserve(entry.target); // Run once only
      }
    });
  },
  { threshold: 0.5 }
);

const statsGrid = document.querySelector(".impact-stats-grid");
if (statsGrid) statsObserver.observe(statsGrid);
