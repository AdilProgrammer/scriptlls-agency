/* =========================================================
   EMBER & OAK — Concept Website by Scriptll's Agency
   Script
   ========================================================= */

(function () {
  "use strict";

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const isTouch = window.matchMedia("(pointer: coarse)").matches;

  /* ---------- LOADER ---------- */
  window.addEventListener("load", () => {
    const loader = document.getElementById("loader");
    setTimeout(() => {
      loader.classList.add("done");
    }, prefersReducedMotion ? 100 : 1200);
  });

  /* ---------- NAVBAR SCROLL ---------- */
  const navbar = document.getElementById("navbar");
  function handleScroll() {
    if (window.scrollY > 40) {
      navbar.classList.add("scrolled");
    } else {
      navbar.classList.remove("scrolled");
    }
  }
  window.addEventListener("scroll", handleScroll, { passive: true });
  handleScroll();

  /* ---------- PROGRESS BAR ---------- */
  const progressBar = document.getElementById("progressBar");
  function updateProgress() {
    const h = document.documentElement;
    const scrolled = h.scrollTop || document.body.scrollTop;
    const height = h.scrollHeight - h.clientHeight;
    const pct = height > 0 ? (scrolled / height) * 100 : 0;
    progressBar.style.width = pct + "%";
  }
  window.addEventListener("scroll", updateProgress, { passive: true });
  updateProgress();

  /* ---------- MOBILE MENU ---------- */
  const navToggle = document.getElementById("navToggle");
  const mobileMenu = document.getElementById("mobileMenu");

  function toggleMobileMenu(force) {
    const open = typeof force === "boolean" ? force : !mobileMenu.classList.contains("open");
    mobileMenu.classList.toggle("open", open);
    navToggle.classList.toggle("active", open);
    navToggle.setAttribute("aria-expanded", String(open));
    mobileMenu.setAttribute("aria-hidden", String(!open));
    document.body.classList.toggle("no-scroll", open);
  }

  navToggle.addEventListener("click", () => toggleMobileMenu());

  mobileMenu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => toggleMobileMenu(false));
  });

  /* ---------- SMOOTH SCROLL FOR ANCHORS ---------- */
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", (e) => {
      const id = anchor.getAttribute("href");
      if (id.length < 2) return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      const offset = 80;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: prefersReducedMotion ? "auto" : "smooth" });
    });
  });

  /* ---------- REVEAL ---------- */
  if (!prefersReducedMotion) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -60px 0px" }
    );
    document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
  } else {
    document.querySelectorAll(".reveal").forEach((el) => el.classList.add("visible"));
  }

  /* ---------- CUSTOM CURSOR ---------- */
  if (!isTouch && !prefersReducedMotion) {
    const cursor = document.getElementById("cursor");
    const cursorLabel = document.getElementById("cursorLabel");
    let mx = 0, my = 0, cx = 0, cy = 0;

    document.addEventListener("mousemove", (e) => {
      mx = e.clientX;
      my = e.clientY;
      cursor.classList.add("active");
    });

    document.addEventListener("mouseleave", () => {
      cursor.classList.remove("active");
    });

    function animateCursor() {
      cx += (mx - cx) * 0.18;
      cy += (my - cy) * 0.18;
      cursor.style.transform = `translate(${cx}px, ${cy}px) translate(-50%, -50%)`;
      requestAnimationFrame(animateCursor);
    }
    animateCursor();

    // Hover states
    const hoverTargets = [
      { selector: ".gallery-item", label: "View" },
      { selector: ".btn", label: "Open" },
      { selector: ".nav-reserve", label: "Book" },
      { selector: ".mobile-link", label: "Go" },
      { selector: ".dish-card", label: "View" },
      { selector: ".project-card", label: "View" },
    ];

    hoverTargets.forEach(({ selector, label }) => {
      document.querySelectorAll(selector).forEach((el) => {
        el.addEventListener("mouseenter", () => {
          cursor.classList.add("hover");
          cursorLabel.textContent = label;
        });
        el.addEventListener("mouseleave", () => {
          cursor.classList.remove("hover");
          cursorLabel.textContent = "";
        });
      });
    });
  }

  /* ---------- PARALLAX INTERIOR ---------- */
  if (!prefersReducedMotion) {
    const interiorImg = document.querySelector(".interior-bg img");
    if (interiorImg) {
      let ticking = false;
      window.addEventListener(
        "scroll",
        () => {
          if (!ticking) {
            window.requestAnimationFrame(() => {
              const rect = interiorImg.parentElement.getBoundingClientRect();
              const winH = window.innerHeight;
              const progress = Math.max(0, Math.min(1, (winH - rect.top) / (winH + rect.height)));
              interiorImg.style.transform = `translateY(${(progress - 0.5) * 60}px)`;
              ticking = false;
            });
            ticking = true;
          }
        },
        { passive: true }
      );
    }
  }

  /* ---------- FAQ ACCORDION ---------- */
  document.querySelectorAll(".faq-item").forEach((item) => {
    const q = item.querySelector(".faq-q");
    const a = item.querySelector(".faq-a");
    q.addEventListener("click", () => {
      const isOpen = item.classList.contains("open");
      document.querySelectorAll(".faq-item").forEach((other) => {
        other.classList.remove("open");
        other.querySelector(".faq-q").setAttribute("aria-expanded", "false");
        other.querySelector(".faq-a").style.maxHeight = null;
      });
      if (!isOpen) {
        item.classList.add("open");
        q.setAttribute("aria-expanded", "true");
        a.style.maxHeight = a.scrollHeight + "px";
      }
    });
  });

  /* ---------- RESERVATION FORM ---------- */
  const reserveForm = document.getElementById("reserveForm");
  const reserveSuccess = document.getElementById("reserveSuccess");
  const reserveSubmit = document.getElementById("reserveSubmit");

  if (reserveForm) {
    reserveForm.addEventListener("submit", (e) => {
      e.preventDefault();
      let valid = true;

      reserveForm.querySelectorAll(".form-group").forEach((g) => g.classList.remove("error"));

      const required = ["res-date", "res-time", "res-guests", "res-name", "res-email"];
      required.forEach((id) => {
        const field = document.getElementById(id);
        if (!field) return;
        const value = field.value.trim();
        const group = field.closest(".form-group");
        if (!value) {
          group.classList.add("error");
          valid = false;
        } else if (id === "res-email") {
          const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!regex.test(value)) {
            group.classList.add("error");
            valid = false;
          }
        }
      });

      if (!valid) {
        const first = reserveForm.querySelector(".form-group.error input, .form-group.error select");
        if (first) first.focus();
        return;
      }

      // Loading micro-interaction
      const originalText = reserveSubmit.textContent;
      reserveSubmit.disabled = true;
      reserveSubmit.textContent = "Sending...";

      setTimeout(() => {
        reserveSubmit.textContent = "Check your details...";
        setTimeout(() => {
          reserveSuccess.classList.add("show");
          reserveSubmit.textContent = originalText;
          reserveSubmit.disabled = false;
          reserveForm.reset();
        }, 800);
      }, 900);
    });

    // Clear errors on input
    reserveForm.querySelectorAll("input, select, textarea").forEach((field) => {
      field.addEventListener("input", () => {
        const g = field.closest(".form-group");
        if (g) g.classList.remove("error");
      });
    });
  }

  /* ---------- MENU MODAL ---------- */
  const menuModal = document.getElementById("menuModal");
  const menuModalClose = document.getElementById("menuModalClose");
  const openMenuModalBtn = document.getElementById("openMenuModal");
  const menuCategories = document.getElementById("menuCategories");
  const menuContent = document.getElementById("menuContent");

  const menuData = {
    starters: {
      title: "Starters",
      items: [
        { name: "Smoked Bone Marrow", desc: "Toasted sourdough • parsley • sea salt", price: "$16" },
        { name: "Charred Padrón Peppers", desc: "Maldon salt • olive oil", price: "$12" },
        { name: "Ember Flatbread", desc: "Cultured butter • smoked garlic", price: "$11" },
        { name: "Marinated Olives", desc: "Citrus peel • chilli • thyme", price: "$9" },
      ],
    },
    fire: {
      title: "From the Fire",
      items: [
        { name: "Ember-Grilled Ribeye", desc: "Bone marrow • charred shallot • ember jus", price: "$48" },
        { name: "Coal-Roasted Octopus", desc: "Preserved lemon • smoked paprika • herb oil", price: "$32" },
        { name: "Wood-Fired Chicken", desc: "Fermented chilli • charred lemon", price: "$28" },
        { name: "Lamb Shoulder (for two)", desc: "Smoked yoghurt • pickled onion • flatbread", price: "$62" },
      ],
    },
    sea: {
      title: "Sea",
      items: [
        { name: "Whole Grilled Sea Bream", desc: "Fennel • blood orange • olive", price: "$34" },
        { name: "Ember Prawns", desc: "Garlic butter • smoked chilli", price: "$24" },
        { name: "Cured Trout", desc: "Horseradish • dill oil • rye", price: "$18" },
      ],
    },
    veg: {
      title: "Vegetables",
      items: [
        { name: "Fire-Roasted Carrots", desc: "Whipped tahini • pistachio • brown butter", price: "$18" },
        { name: "Charred Hispi Cabbage", desc: "Miso butter • sesame • chilli", price: "$17" },
        { name: "Smoked Beetroot", desc: "Labneh • walnut • dill", price: "$16" },
      ],
    },
    sides: {
      title: "Sides",
      items: [
        { name: "Ember Potatoes", desc: "Rosemary salt • aioli", price: "$10" },
        { name: "Grilled Flatbread", desc: "Cultured butter", price: "$7" },
        { name: "Charred Broccolini", desc: "Lemon • chilli • almonds", price: "$12" },
      ],
    },
    dessert: {
      title: "Dessert",
      items: [
        { name: "Burnt Basque Cheesecake", desc: "Blackberry • vanilla • sea salt", price: "$14" },
        { name: "Smoked Chocolate Tart", desc: "Cherry • crème fraîche", price: "$13" },
        { name: "Grilled Peaches", desc: "Mascarpone • honey • thyme", price: "$12" },
      ],
    },
    cocktails: {
      title: "Cocktails",
      items: [
        { name: "Ember Old Fashioned", desc: "Smoked bourbon • bitters • orange", price: "$16" },
        { name: "Charred Paloma", desc: "Mezcal • grapefruit • lime • salt", price: "$15" },
        { name: "Oak & Honey", desc: "Whiskey • honey • lemon • ginger", price: "$15" },
        { name: "Smoke & Mirrors", desc: "Mezcal • aperol • lime • chilli", price: "$16" },
      ],
    },
  };

  function renderMenu(category) {
    const data = menuData[category];
    if (!data) return;
    menuContent.innerHTML = `
      <div class="modal-menu-group">
        <h3>${data.title}</h3>
        <ul class="modal-menu-list">
          ${data.items
            .map(
              (item) => `
              <li>
                <span class="m-name">${item.name}</span>
                <span class="m-price">${item.price}</span>
                <span class="m-desc">${item.desc}</span>
              </li>`
            )
            .join("")}
        </ul>
      </div>
    `;
  }

  function openMenuModal() {
    menuModal.classList.add("open");
    menuModal.setAttribute("aria-hidden", "false");
    document.body.classList.add("no-scroll");
    renderMenu("starters");
  }

  function closeMenuModal() {
    menuModal.classList.remove("open");
    menuModal.setAttribute("aria-hidden", "true");
    if (!mobileMenu.classList.contains("open")) {
      document.body.classList.remove("no-scroll");
    }
  }

  if (openMenuModalBtn) {
    openMenuModalBtn.addEventListener("click", openMenuModal);
  }
  if (menuModalClose) {
    menuModalClose.addEventListener("click", closeMenuModal);
  }
  if (menuModal) {
    menuModal.addEventListener("click", (e) => {
      if (e.target === menuModal) closeMenuModal();
    });
  }

  if (menuCategories) {
    menuCategories.querySelectorAll(".cat-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        menuCategories.querySelectorAll(".cat-btn").forEach((b) => {
          b.classList.remove("active");
          b.setAttribute("aria-selected", "false");
        });
        btn.classList.add("active");
        btn.setAttribute("aria-selected", "true");
        renderMenu(btn.dataset.cat);
      });
    });
  }

  /* ---------- GALLERY LIGHTBOX ---------- */
  const lightbox = document.getElementById("lightbox");
  const lightboxImg = document.getElementById("lightboxImg");
  const lightboxCaption = document.getElementById("lightboxCaption");
  const lightboxClose = document.getElementById("lightboxClose");
  const lightboxPrev = document.getElementById("lightboxPrev");
  const lightboxNext = document.getElementById("lightboxNext");

  const galleryItems = Array.from(document.querySelectorAll(".gallery-item"));
  let currentIndex = 0;

  function openLightbox(index) {
    currentIndex = index;
    const fig = galleryItems[currentIndex];
    const img = fig.querySelector("img");
    const caption = fig.querySelector("figcaption span");
    lightboxImg.src = img.src;
    lightboxImg.alt = img.alt;
    lightboxCaption.textContent = caption ? caption.textContent : "";
    lightbox.classList.add("open");
    lightbox.setAttribute("aria-hidden", "false");
    document.body.classList.add("no-scroll");
  }

  function closeLightbox() {
    lightbox.classList.remove("open");
    lightbox.setAttribute("aria-hidden", "true");
    if (!mobileMenu.classList.contains("open") && !menuModal.classList.contains("open")) {
      document.body.classList.remove("no-scroll");
    }
  }

  function showNext() {
    currentIndex = (currentIndex + 1) % galleryItems.length;
    openLightbox(currentIndex);
  }
  function showPrev() {
    currentIndex = (currentIndex - 1 + galleryItems.length) % galleryItems.length;
    openLightbox(currentIndex);
  }

  galleryItems.forEach((item) => {
    item.addEventListener("click", () => {
      const idx = parseInt(item.dataset.index, 10);
      openLightbox(idx);
    });
  });

  if (lightboxClose) lightboxClose.addEventListener("click", closeLightbox);
  if (lightboxNext) lightboxNext.addEventListener("click", showNext);
  if (lightboxPrev) lightboxPrev.addEventListener("click", showPrev);

  if (lightbox) {
    lightbox.addEventListener("click", (e) => {
      if (e.target === lightbox) closeLightbox();
    });
  }

  /* ---------- BEFORE / AFTER SLIDER ---------- */
  const baSlider = document.getElementById("baSlider");
  const baAfter = document.getElementById("baAfter");
  const baHandle = document.getElementById("baHandle");

  if (baSlider && baAfter && baHandle) {
    let dragging = false;

    function setPosition(clientX) {
      const rect = baSlider.getBoundingClientRect();
      let pct = ((clientX - rect.left) / rect.width) * 100;
      pct = Math.max(3, Math.min(97, pct));
      baAfter.style.clipPath = `inset(0 0 0 ${pct}%)`;
      baSlider.querySelector(".ba-before").style.clipPath = `inset(0 ${100 - pct}% 0 0)`;
      baHandle.style.left = pct + "%";
    }

    function start(e) {
      dragging = true;
      const x = e.touches ? e.touches[0].clientX : e.clientX;
      setPosition(x);
    }
    function move(e) {
      if (!dragging) return;
      if (e.cancelable) e.preventDefault();
      const x = e.touches ? e.touches[0].clientX : e.clientX;
      setPosition(x);
    }
    function end() { dragging = false; }

    baSlider.addEventListener("mousedown", start);
    baSlider.addEventListener("touchstart", start, { passive: true });
    window.addEventListener("mousemove", move);
    window.addEventListener("touchmove", move, { passive: false });
    window.addEventListener("mouseup", end);
    window.addEventListener("touchend", end);

    // Init
    const rect = baSlider.getBoundingClientRect();
    setPosition(rect.left + rect.width / 2);
  }

  /* ---------- MOBILE BAR VISIBILITY ---------- */
  const mobileBar = document.getElementById("mobileBar");
  const mobileBarMenu = document.getElementById("mobileBarMenu");
  const footer = document.querySelector(".footer");

  if (mobileBarMenu) {
    mobileBarMenu.addEventListener("click", openMenuModal);
  }

  if (mobileBar && footer) {
    const footerObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          mobileBar.classList.toggle("hidden", entry.isIntersecting);
        });
      },
      { threshold: 0.1 }
    );
    footerObserver.observe(footer);
  }

  /* ---------- KEYBOARD HANDLING ---------- */
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      if (lightbox.classList.contains("open")) closeLightbox();
      if (menuModal.classList.contains("open")) closeMenuModal();
      if (mobileMenu.classList.contains("open")) toggleMobileMenu(false);
    }
    if (lightbox.classList.contains("open")) {
      if (e.key === "ArrowRight") showNext();
      if (e.key === "ArrowLeft") showPrev();
    }
  });

  /* ---------- RESERVATION MODAL RESERVE BUTTON ---------- */
  const modalReserve = document.getElementById("modalReserve");
  if (modalReserve) {
    modalReserve.addEventListener("click", () => {
      closeMenuModal();
    });
  }
})();