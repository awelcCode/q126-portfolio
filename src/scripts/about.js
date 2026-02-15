/**
 * Simple Gallery for About Page
 */
document.addEventListener("DOMContentLoaded", () => {
  const dots = document.querySelectorAll(".dot");
  const galleryImg = document.getElementById("about-gallery-img");
  const galleryCaption = document.getElementById("about-gallery-caption");

  if (dots.length > 0 && galleryImg) {
    dots.forEach((dot) => {
      dot.addEventListener("click", () => {
        // 1. UI: Reset dots
        dots.forEach((d) => d.classList.remove("active"));
        dot.classList.add("active");

        // 2. Content: Get data from the clicked dot
        const newSrc = dot.getAttribute("data-src");
        const newCaption = dot.getAttribute("data-caption");

        // 3. Animation: Fade out, swap, fade in
        galleryImg.style.opacity = 0;

        setTimeout(() => {
          galleryImg.src = newSrc;
          if (galleryCaption) {
            galleryCaption.innerText = newCaption;
          }
          galleryImg.style.transition = "opacity 0.4s ease";
          galleryImg.style.opacity = 1;
        }, 200);
      });
    });
  }
});
