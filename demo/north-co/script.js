/* =========================================================
   NORTH & CO. — Concept Website by Scriptll's Agency
   ========================================================= */

(function () {
  "use strict";

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const isTouch = window.matchMedia("(pointer: coarse)").matches;

  /* ---------- PROGRESS BAR ---------- */
  const progressBar = document.getElementById("progressBar");
  function updateProgress() {
    const h = document.documentElement;
    const scrolled = h.scrollTop || document.body.scrollTop;
    const height = h.scrollHeight - h.clientHeight;
    progressBar.style.width = (height > 0 ? (scrolled / height) * 100 : 0) + "%";
  }
  window.addEventListener("scroll", updateProgress, { passive: true });
  updateProgress();

  /* ---------- NAVBAR ---------- */
  const navbar = document.getElementById("navbar");
  function handleScroll() {
    navbar.classList.toggle("scrolled", window.scrollY > 60);
  }
  window.addEventListener("scroll", handleScroll, { passive: true });
  handleScroll();

  /* ---------- MOBILE MENU ---------- */
  const navToggle = document.getElementById("navToggle");
  const mobileMenu = document.getElementById("mobileMenu");
  const mobileMenuClose = document.getElementById("mobileMenuClose");

  function toggleMobileMenu(force) {
    const open = typeof force === "boolean" ? force : !mobileMenu.classList.contains("open");
    mobileMenu.classList.toggle("open", open);
    navToggle.classList.toggle("active", open);
    navToggle.setAttribute("aria-expanded", String(open));
    mobileMenu.setAttribute("aria-hidden", String(!open));
    document.body.classList.toggle("no-scroll", open);
  }

  navToggle.addEventListener("click", () => toggleMobileMenu());
  mobileMenuClose.addEventListener("click", () => toggleMobileMenu(false));
  mobileMenu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => toggleMobileMenu(false));
  });

  /* ---------- SMOOTH SCROLL ---------- */
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
      { threshold: 0.1, rootMargin: "0px 0px -60px 0px" }
    );
    document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));

    // Statement text reveal
    const statement = document.querySelector(".statement");
    if (statement) {
      const stObs = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("visible");
              stObs.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.3 }
      );
      stObs.observe(statement);
    }
  } else {
    document.querySelectorAll(".reveal").forEach((el) => el.classList.add("visible"));
    const statement = document.querySelector(".statement");
    if (statement) statement.classList.add("visible");
  }

  /* ---------- HERO PARALLAX ---------- */
  if (!prefersReducedMotion) {
    const heroImg = document.querySelector(".hero-img");
    if (heroImg) {
      let ticking = false;
      window.addEventListener(
        "scroll",
        () => {
          if (!ticking) {
            window.requestAnimationFrame(() => {
              const scrolled = window.scrollY;
              if (scrolled < window.innerHeight) {
                heroImg.style.transform = `scale(1) translateY(${scrolled * 0.15}px)`;
              }
              ticking = false;
            });
            ticking = true;
          }
        },
        { passive: true }
      );
    }
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
    document.addEventListener("mouseleave", () => cursor.classList.remove("active"));

    function animateCursor() {
      cx += (mx - cx) * 0.18;
      cy += (my - cy) * 0.18;
      cursor.style.transform = `translate(${cx}px, ${cy}px) translate(-50%, -50%)`;
      requestAnimationFrame(animateCursor);
    }
    animateCursor();

    const hoverTargets = [
      { selector: ".property-card", label: "View" },
      { selector: ".journal-card", label: "Read" },
      { selector: ".gallery-item", label: "Open" },
      { selector: ".btn", label: "Open" },
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

  /* ---------- PROPERTY FILTERS ---------- */
  const filterBtns = document.querySelectorAll(".filter-btn");
  const propertyCards = document.querySelectorAll(".property-card");

  filterBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      filterBtns.forEach((b) => {
        b.classList.remove("active");
        b.setAttribute("aria-selected", "false");
      });
      btn.classList.add("active");
      btn.setAttribute("aria-selected", "true");

      const filter = btn.dataset.filter;
      propertyCards.forEach((card) => {
        const match = filter === "all" || card.dataset.category === filter;
        card.classList.toggle("hidden", !match);
      });
    });
  });

  /* ---------- PROPERTY DATA ---------- */
  const propertyData = {
    "north-house": {
      name: "The North House",
      location: "Northern District",
      type: "Architectural Residence",
      beds: "5",
      baths: "6",
      area: "6,800 SQ FT",
      hero: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1800&q=80",
      overview:
        "A fictional architectural residence designed around natural light, material contrast, and seamless indoor-outdoor living.",
      architecture:
        "Concrete, glass, and natural stone are used to frame light and create a strong architectural identity that feels both calm and considered.",
      interior:
        "Interiors are open, tactile, and restrained. Materials are warm, finishes are quiet, and every room is designed around how it will actually be lived in.",
      setting:
        "Positioned to take advantage of light, views, and privacy. The landscaping is treated as an extension of the architecture.",
      features: [
        "Private Courtyard",
        "Double-Height Living",
        "Natural Stone",
        "Floor-to-Ceiling Glass",
        "Landscaped Gardens",
        "Private Study",
      ],
    },
    "casa-vista": {
      name: "Casa Vista",
      location: "Western Hills",
      type: "Hillside Villa",
      beds: "4",
      baths: "5",
      area: "4,900 SQ FT",
      hero: "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=1800&q=80",
      overview:
        "A contemporary hillside residence designed around openness, light, and the experience of living close to the landscape.",
      architecture:
        "The house steps with the terrain, using horizontal lines and framed views to soften the transition between interior and exterior.",
      interior:
        "Interiors are warm and textural, with an emphasis on natural materials, soft light, and spaces that feel generous without being excessive.",
      setting:
        "Oriented to maximize natural light and long views. The landscape is treated as part of the architecture, not separate from it.",
      features: [
        "Panoramic Views",
        "Infinity Pool",
        "Stone Terraces",
        "Open Plan Living",
        "Wine Room",
        "Guest Suite",
      ],
    },
    "aurora": {
      name: "The Aurora",
      location: "Central District",
      type: "Urban Penthouse",
      beds: "3",
      baths: "4",
      area: "3,200 SQ FT",
      hero: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1800&q=80",
      overview:
        "A minimalist urban penthouse designed for calm, clarity, and long city views.",
      architecture:
        "Restrained geometry, wide glass, and a muted material palette. The architecture does less, so the city and the light can do more.",
      interior:
        "Interiors are quiet and precise, with an emphasis on proportion, texture, and the way light moves through the space over a day.",
      setting:
        "Located above the noise of the city, but connected to it. Views, orientation, and privacy are central to the design.",
      features: [
        "Skyline Views",
        "Private Terrace",
        "Floor-to-Ceiling Glass",
        "Custom Joinery",
        "Concierge Access",
        "Secure Parking",
      ],
    },
    "oakline": {
      name: "Oakline Residence",
      location: "Oakline Park",
      type: "Contemporary Residence",
      beds: "5",
      baths: "5",
      area: "5,600 SQ FT",
      hero: "https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=1800&q=80",
      overview:
        "A warm contemporary family residence designed around daily life, natural light, and an easy relationship with the garden.",
      architecture:
        "Timber, stone, and glass combine into a house that feels grounded, generous, and quietly confident.",
      interior:
        "Interiors are designed for how families actually live: open but not exposed, warm but not cluttered, and easy to keep feeling calm.",
      setting:
        "Set within mature landscaping, with generous gardens, shaded terraces, and a strong sense of privacy.",
      features: [
        "Mature Gardens",
        "Family Kitchen",
        "Home Office",
        "Guest Wing",
        "Pool House",
        "Double Garage",
      ],
    },
    "house-17": {
      name: "House 17",
      location: "North Quarter",
      type: "Private Residence",
      beds: "4",
      baths: "4",
      area: "4,300 SQ FT",
      hero: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1800&q=80",
      overview:
        "An architect-designed private residence built around proportion, material, and the experience of daily rituals.",
      architecture:
        "The house is organized around a clear architectural idea: simple volumes, honest materials, and a strong relationship to the site.",
      interior:
        "Interiors are warm and considered, with careful attention to how each room will be used and how it will feel at different times of day.",
      setting:
        "Positioned to feel private and calm, with landscaping used to frame views and soften the boundaries of the site.",
      features: [
        "Sculptural Stair",
        "Custom Kitchen",
        "Reading Room",
        "Private Garden",
        "Studio Space",
        "Underfloor Heating",
      ],
    },
    "courtyard": {
      name: "The Courtyard",
      location: "Southern Quarter",
      type: "Courtyard Villa",
      beds: "4",
      baths: "5",
      area: "5,100 SQ FT",
      hero: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=1800&q=80",
      overview:
        "A contemporary private residence centered around an internal courtyard that brings light and calm into the heart of the home.",
      architecture:
        "The courtyard is the organizing idea. Rooms open onto it, light moves through it, and the house feels both open and protected.",
      interior:
        "Interiors are soft, warm, and quiet, with an emphasis on natural materials and the experience of living around a central garden.",
      setting:
        "The house turns inward for privacy, with carefully framed views out and a strong sense of retreat.",
      features: [
        "Internal Courtyard",
        "Water Feature",
        "Stone Walls",
        "Shaded Terraces",
        "Guest Pavilion",
        "Private Spa",
      ],
    },
  };

  /* ---------- PROPERTY MODAL ---------- */
  const propertyModal = document.getElementById("propertyModal");
  const propertyModalBody = document.getElementById("propertyModalBody");
  const propertyModalClose = document.getElementById("propertyModalClose");

  function openPropertyModal(key) {
    const p = propertyData[key];
    if (!p) return;

    propertyModalBody.innerHTML = `
      <div class="pm-hero">
        <img src="${p.hero}" alt="${p.name}" />
        <span class="pm-badge">Concept Property</span>
      </div>
      <div class="pm-content">
        <div class="pm-head">
          <div>
            <h2>${p.name}</h2>
            <p class="pm-location">${p.location}</p>
          </div>
          <span class="pm-type">${p.type}</span>
        </div>

        <div class="pm-meta">
          <div class="pm-meta-item">
            <span class="pm-meta-label">Bedrooms</span>
            <span class="pm-meta-value">${p.beds}</span>
          </div>
          <div class="pm-meta-item">
            <span class="pm-meta-label">Bathrooms</span>
            <span class="pm-meta-value">${p.baths}</span>
          </div>
          <div class="pm-meta-item">
            <span class="pm-meta-label">Approx. Area</span>
            <span class="pm-meta-value">${p.area}</span>
          </div>
          <div class="pm-meta-item">
            <span class="pm-meta-label">Price</span>
            <span class="pm-meta-value" style="font-size:1rem;">Upon Request</span>
          </div>
        </div>

        <div class="pm-section">
          <h3>Overview</h3>
          <p>${p.overview}</p>
        </div>

        <div class="pm-section">
          <h3>The Architecture</h3>
          <p>${p.architecture}</p>
        </div>

        <div class="pm-section">
          <h3>The Interior</h3>
          <p>${p.interior}</p>
        </div>

        <div class="pm-section">
          <h3>The Setting</h3>
          <p>${p.setting}</p>
        </div>

        <div class="pm-section">
          <h3>Key Features</h3>
          <ul class="pm-features">
            ${p.features.map((f) => `<li>${f}</li>`).join("")}
          </ul>
        </div>

        <div class="pm-cta">
          <p>Concept property shown for demonstration. Not a real listing.</p>
          <a href="#inquiry-form" class="btn btn-primary" id="pmCtaBtn">Inquire About This Concept</a>
        </div>
      </div>
    `;

    const cta = document.getElementById("pmCtaBtn");
    if (cta) cta.addEventListener("click", () => closePropertyModal());

    propertyModal.classList.add("open");
    propertyModal.setAttribute("aria-hidden", "false");
    document.body.classList.add("no-scroll");
  }

  function closePropertyModal() {
    propertyModal.classList.remove("open");
    propertyModal.setAttribute("aria-hidden", "true");
    if (!mobileMenu.classList.contains("open") && !journalModal.classList.contains("open")) {
      document.body.classList.remove("no-scroll");
    }
  }

  document.querySelectorAll(".property-card").forEach((card) => {
    card.addEventListener("click", () => {
      const key = card.dataset.property;
      if (key) openPropertyModal(key);
    });
  });
  propertyModalClose.addEventListener("click", closePropertyModal);
  propertyModal.addEventListener("click", (e) => {
    if (e.target === propertyModal) closePropertyModal();
  });

  /* ---------- JOURNAL DATA ---------- */
  const journalData = {
    "architecture": {
      category: "Architecture",
      title: "Why Architecture Matters in Modern Living",
      hero: "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=1400&q=80",
      body: [
        "Architecture is not only about how a building looks. It is about how it works, how it feels, and how it supports the daily life that happens inside it.",
        "The best buildings tend to disappear into use. They are not shouting for attention. They are quietly doing their job: framing light, shaping movement, and giving the people inside them a sense of calm and clarity.",
        "This is why architectural quality matters. It is not a luxury reserved for exceptional projects. It is the difference between a space that feels considered and one that merely functions.",
      ],
    },
    "quiet-luxury": {
      category: "Design",
      title: "Inside the Quiet Luxury Movement",
      hero: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=1400&q=80",
      body: [
        "Quiet luxury is not about restraint for its own sake. It is about choosing materials, proportions, and details that will age well and feel better over time.",
        "It moves away from visible wealth and toward visible care. Better fabrics, honest materials, considered joinery, and a palette that does not chase trends.",
        "In property, this translates to homes that feel less like statements and more like places. That is a harder thing to design — and a more valuable one.",
      ],
    },
    "details": {
      category: "Materiality",
      title: "Five Details That Change a Space",
      hero: "https://images.unsplash.com/photo-1600566752355-35792bedcfea?w=1400&q=80",
      body: [
        "Some architectural decisions have an outsized effect. A well-placed window. A properly detailed threshold. A ceiling height that gives a room room to breathe.",
        "Five details that consistently change how a space feels: the depth of a window reveal, the weight of a door, the colour temperature of artificial light, the way a floor meets a wall, and the sound a room makes when it is quiet.",
        "None of these are expensive. All of them are architectural. And together, they are the difference between a house and a home that feels right.",
      ],
    },
    "light": {
      category: "Light",
      title: "Designing for Natural Light",
      hero: "https://images.unsplash.com/photo-1600585152220-90363fe7e115?w=1400&q=80",
      body: [
        "Natural light is the most valuable material in architecture. It is free, it is renewable, and it transforms how a space feels across a day.",
        "Designing for light means paying attention to orientation, glazing, reflection, and shadow. It means knowing where the sun will be at 9am in winter and how the light will feel in a room at 4pm in summer.",
        "Done well, natural light makes rooms feel larger, materials feel richer, and time feel slower. It is one of the few things you can never add later.",
      ],
    },
  };

  /* ---------- JOURNAL MODAL ---------- */
  const journalModal = document.getElementById("journalModal");
  const journalModalBody = document.getElementById("journalModalBody");
  const journalModalClose = document.getElementById("journalModalClose");

  function openJournalModal(key) {
    const j = journalData[key];
    if (!j) return;

    journalModalBody.innerHTML = `
      <div class="jm-hero">
        <img src="${j.hero}" alt="${j.title}" />
      </div>
      <div class="jm-content">
        <span class="jm-cat">${j.category} &nbsp;·&nbsp; Concept Editorial</span>
        <h2>${j.title}</h2>
        ${j.body.map((p) => `<p>${p}</p>`).join("")}
        <p class="jm-note">This is a fictional concept editorial created for the North &amp; Co. demonstration.</p>
      </div>
    `;

    journalModal.classList.add("open");
    journalModal.setAttribute("aria-hidden", "false");
    document.body.classList.add("no-scroll");
  }

  function closeJournalModal() {
    journalModal.classList.remove("open");
    journalModal.setAttribute("aria-hidden", "true");
    if (!mobileMenu.classList.contains("open") && !propertyModal.classList.contains("open")) {
      document.body.classList.remove("no-scroll");
    }
  }

  document.querySelectorAll(".journal-card").forEach((card) => {
    card.addEventListener("click", () => {
      const key = card.dataset.article;
      if (key) openJournalModal(key);
    });
  });
  journalModalClose.addEventListener("click", closeJournalModal);
  journalModal.addEventListener("click", (e) => {
    if (e.target === journalModal) closeJournalModal();
  });

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
    const cap = fig.querySelector("figcaption span");
    lightboxImg.src = img.src;
    lightboxImg.alt = img.alt;
    lightboxCaption.textContent = cap ? cap.textContent : "";
    lightbox.classList.add("open");
    lightbox.setAttribute("aria-hidden", "false");
    document.body.classList.add("no-scroll");
  }

  function closeLightbox() {
    lightbox.classList.remove("open");
    lightbox.setAttribute("aria-hidden", "true");
    if (!mobileMenu.classList.contains("open") && !propertyModal.classList.contains("open") && !journalModal.classList.contains("open")) {
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
  lightboxClose.addEventListener("click", closeLightbox);
  lightboxNext.addEventListener("click", showNext);
  lightboxPrev.addEventListener("click", showPrev);
  lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  /* ---------- FAQ ---------- */
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

    const rect = baSlider.getBoundingClientRect();
    setPosition(rect.left + rect.width / 2);
  }

  /* ---------- INQUIRY FORM ---------- */
  const inquiryForm = document.getElementById("inquiryForm");
  const inquirySuccess = document.getElementById("inquirySuccess");
  const inqSubmit = document.getElementById("inqSubmit");

  if (inquiryForm) {
    inquiryForm.addEventListener("submit", (e) => {
      e.preventDefault();
      let valid = true;

      inquiryForm.querySelectorAll(".form-group").forEach((g) => g.classList.remove("error"));

      const required = ["inq-first", "inq-last", "inq-email"];
      required.forEach((id) => {
        const field = document.getElementById(id);
        if (!field) return;
        const value = field.value.trim();
        const group = field.closest(".form-group");
        if (!value) {
          group.classList.add("error");
          valid = false;
        } else if (id === "inq-email") {
          const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!regex.test(value)) {
            group.classList.add("error");
            valid = false;
          }
        }
      });

      if (!valid) {
        const first = inquiryForm.querySelector(".form-group.error input");
        if (first) first.focus();
        return;
      }

      const originalText = inqSubmit.textContent;
      inqSubmit.disabled = true;
      inqSubmit.textContent = "Sending...";

      setTimeout(() => {
        inquirySuccess.classList.add("show");
        inqSubmit.textContent = originalText;
        inqSubmit.disabled = false;
        inquiryForm.reset();
      }, 900);
    });

    inquiryForm.querySelectorAll("input, select, textarea").forEach((field) => {
      field.addEventListener("input", () => {
        const g = field.closest(".form-group");
        if (g) g.classList.remove("error");
      });
    });
  }

  /* ---------- MOBILE STICKY VISIBILITY ---------- */
  const mobileSticky = document.getElementById("mobileSticky");
  const inquirySection = document.getElementById("inquiry-form");
  const footer = document.querySelector(".footer");

  if (mobileSticky && inquirySection && footer) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            mobileSticky.classList.add("hidden");
          } else {
            const anyVisible = [inquirySection, footer].some((t) => {
              const r = t.getBoundingClientRect();
              return r.top < window.innerHeight && r.bottom > 0;
            });
            if (!anyVisible) mobileSticky.classList.remove("hidden");
          }
        });
      },
      { threshold: 0.05 }
    );
    observer.observe(inquirySection);
    observer.observe(footer);
  }

  /* ---------- KEYBOARD ---------- */
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      if (lightbox.classList.contains("open")) closeLightbox();
      if (propertyModal.classList.contains("open")) closePropertyModal();
      if (journalModal.classList.contains("open")) closeJournalModal();
      if (mobileMenu.classList.contains("open")) toggleMobileMenu(false);
    }
    if (lightbox.classList.contains("open")) {
      if (e.key === "ArrowRight") showNext();
      if (e.key === "ArrowLeft") showPrev();
    }
  });
})();