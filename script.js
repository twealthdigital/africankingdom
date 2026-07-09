/* =========================================================
   African Kingdom Restaurant — Header & Hero interactions
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

  /* ---------- Sticky header: transparent -> white on scroll ---------- */
  const header = document.getElementById("siteHeader");
  const SCROLL_THRESHOLD = 24;

  const updateHeaderState = () => {
    if (window.scrollY > SCROLL_THRESHOLD) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }
  };

  updateHeaderState();
  window.addEventListener("scroll", updateHeaderState, { passive: true });

  /* ---------- Mobile navigation ---------- */
  const hamburgerBtn = document.getElementById("hamburgerBtn");
  const mobileCloseBtn = document.getElementById("mobileCloseBtn");
  const mobileNav = document.getElementById("mobileNav");
  const mobileLinks = document.querySelectorAll(".mobile-link, .mobile-cta");

  const openMobileNav = () => {
    mobileNav.classList.add("open");
    mobileNav.setAttribute("aria-hidden", "false");
    hamburgerBtn.classList.add("active");
    hamburgerBtn.setAttribute("aria-expanded", "true");
    document.body.classList.add("nav-open");
  };

  const closeMobileNav = () => {
    mobileNav.classList.remove("open");
    mobileNav.setAttribute("aria-hidden", "true");
    hamburgerBtn.classList.remove("active");
    hamburgerBtn.setAttribute("aria-expanded", "false");
    document.body.classList.remove("nav-open");
  };

  hamburgerBtn.addEventListener("click", () => {
    const isOpen = mobileNav.classList.contains("open");
    isOpen ? closeMobileNav() : openMobileNav();
  });

  mobileCloseBtn.addEventListener("click", closeMobileNav);

  mobileLinks.forEach((link) => {
    link.addEventListener("click", closeMobileNav);
  });

  // Close mobile nav when clicking the dimmed backdrop (outside the panel)
document.body.addEventListener("click", (e) => {
  if (e.target === document.body && mobileNav.classList.contains("open")) {
    closeMobileNav();
  }
});

  // Close mobile nav with the Escape key
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && mobileNav.classList.contains("open")) {
      closeMobileNav();
    }
  });

  // Close mobile nav automatically if the viewport is resized back to desktop
  window.addEventListener("resize", () => {
    if (window.innerWidth > 992 && mobileNav.classList.contains("open")) {
      closeMobileNav();
    }
  });

  /* ---------- Menu carousel: auto-scroll + arrows + favorites ---------- */
  const menuTrack = document.getElementById("menuTrack");
  const menuViewport = document.querySelector(".menu-track-viewport");
  const menuPrev = document.getElementById("menuPrev");
  const menuNext = document.getElementById("menuNext");

  if (menuTrack && menuViewport) {

    const getStep = () => {
      const firstCard = menuTrack.querySelector(".menu-card");
      if (!firstCard) return 300;
      const gap = parseFloat(getComputedStyle(menuTrack).gap) || 24;
      return firstCard.getBoundingClientRect().width + gap;
    };

    const scrollByStep = (direction) => {
      menuViewport.scrollBy({ left: direction * getStep(), behavior: "smooth" });
    };

    menuPrev && menuPrev.addEventListener("click", () => scrollByStep(-1));
    menuNext && menuNext.addEventListener("click", () => scrollByStep(1));

    // Auto-scroll (only the food track, not the heading)
    const AUTO_SCROLL_INTERVAL = 3500;
    let autoScrollTimer = null;

    const startAutoScroll = () => {
      stopAutoScroll();
      autoScrollTimer = setInterval(() => {
        const atEnd = menuViewport.scrollLeft + menuViewport.clientWidth >= menuViewport.scrollWidth - 4;
        if (atEnd) {
          menuViewport.scrollTo({ left: 0, behavior: "smooth" });
        } else {
          scrollByStep(1);
        }
      }, AUTO_SCROLL_INTERVAL);
    };

    const stopAutoScroll = () => {
      if (autoScrollTimer) clearInterval(autoScrollTimer);
    };

    startAutoScroll();

    // Pause on hover / touch / focus so people can browse manually
    ["mouseenter", "touchstart", "focusin"].forEach((evt) => {
      menuViewport.addEventListener(evt, stopAutoScroll, { passive: true });
    });
    ["mouseleave", "touchend", "focusout"].forEach((evt) => {
      menuViewport.addEventListener(evt, startAutoScroll, { passive: true });
    });

    // Favorites (persisted in localStorage)
    const FAV_KEY = "akrFavorites";
    const savedFavs = new Set(JSON.parse(localStorage.getItem(FAV_KEY) || "[]"));

    document.querySelectorAll(".menu-fav").forEach((btn) => {
      const card = btn.closest(".menu-card");
      const id = card?.dataset.favId;

      if (id && savedFavs.has(id)) {
        btn.classList.add("is-active");
        btn.setAttribute("aria-pressed", "true");
      }

      btn.addEventListener("click", () => {
        const isActive = btn.classList.toggle("is-active");
        btn.setAttribute("aria-pressed", String(isActive));

        if (id) {
          if (isActive) savedFavs.add(id);
          else savedFavs.delete(id);
          localStorage.setItem(FAV_KEY, JSON.stringify([...savedFavs]));
        }
      });
    });
  }

});
