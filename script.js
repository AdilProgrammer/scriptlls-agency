/* ============================================
   SCRIPTLL'S AGENCY — SCRIPT
   ============================================ */

(function () {
  "use strict";

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- 1. NAVBAR SCROLL STATE ---------- */
  const navbar = document.getElementById("navbar");
  let lastScrollY = 0;

  function handleNavScroll() {
    const y = window.scrollY;
    if (y > 40) {
      navbar.classList.add("scrolled");
    } else {
      navbar.classList.remove("scrolled");
    }
    lastScrollY = y;
  }

  window.addEventListener("scroll", handleNavScroll, { passive: true });
  handleNavScroll();

  /* ---------- 2. MOBILE MENU ---------- */
  const hamburger = document.getElementById("hamburger");
  const navLinks = document.getElementById("navLinks");

  function toggleMenu(force) {
    const isOpen = typeof force === "boolean" ? force : !navLinks.classList.contains("open");
    navLinks.classList.toggle("open", isOpen);
    hamburger.classList.toggle("active", isOpen);
    hamburger.setAttribute("aria-expanded", String(isOpen));
    document.body.style.overflow = isOpen ? "hidden" : "";
  }

  hamburger.addEventListener("click", () => toggleMenu());

  navLinks.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => toggleMenu(false));
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      toggleMenu(false);
      closeModal();
    }
  });

  /* ---------- 3. SMOOTH SCROLL + ACTIVE LINK ---------- */
  const sections = document.querySelectorAll("section[id]");
  const navAnchors = document.querySelectorAll(".nav-link");

  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      const targetId = this.getAttribute("href");
      if (targetId === "#" || targetId.length < 2) return;
      const target = document.querySelector(targetId);
      if (!target) return;
      e.preventDefault();
      const offset = 80;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({
        top,
        behavior: prefersReducedMotion ? "auto" : "smooth",
      });
    });
  });

  function updateActiveNav() {
    const scrollPos = window.scrollY + 120;
    let current = "";
    sections.forEach((section) => {
      if (section.offsetTop <= scrollPos) {
        current = section.getAttribute("id");
      }
    });
    navAnchors.forEach((link) => {
      link.classList.toggle(
        "active",
        link.getAttribute("href") === `#${current}`
      );
    });
  }

  window.addEventListener("scroll", updateActiveNav, { passive: true });
  updateActiveNav();

  /* ---------- 4. SCROLL REVEAL ---------- */
  if (!prefersReducedMotion) {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -60px 0px" }
    );

    document.querySelectorAll(".reveal").forEach((el) => revealObserver.observe(el));
  } else {
    document.querySelectorAll(".reveal").forEach((el) => el.classList.add("visible"));
  }

  /* ---------- 5. CURSOR GLOW ---------- */
  const cursorGlow = document.getElementById("cursorGlow");
  let cursorVisible = false;

  if (!prefersReducedMotion && cursorGlow && window.matchMedia("(pointer: fine)").matches) {
    let mouseX = 0, mouseY = 0;
    let glowX = 0, glowY = 0;

    window.addEventListener("mousemove", (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      if (!cursorVisible) {
        cursorGlow.style.opacity = "1";
        cursorVisible = true;
      }
    });

    window.addEventListener("mouseleave", () => {
      cursorGlow.style.opacity = "0";
      cursorVisible = false;
    });

    function animateGlow() {
      glowX += (mouseX - glowX) * 0.08;
      glowY += (mouseY - glowY) * 0.08;
      cursorGlow.style.left = glowX + "px";
      cursorGlow.style.top = glowY + "px";
      requestAnimationFrame(animateGlow);
    }
    animateGlow();
  }

  /* ---------- 6. PORTFOLIO FILTERS ---------- */
  const filterBtns = document.querySelectorAll(".filter-btn");
  const projectCards = document.querySelectorAll(".project-card");

  filterBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      filterBtns.forEach((b) => {
        b.classList.remove("active");
        b.setAttribute("aria-selected", "false");
      });
      btn.classList.add("active");
      btn.setAttribute("aria-selected", "true");

      const filter = btn.dataset.filter;

      projectCards.forEach((card) => {
        const matches = filter === "all" || card.dataset.category === filter;
        if (matches) {
          card.classList.remove("hidden");
          card.style.animation = "none";
          void card.offsetWidth;
          card.style.animation = "cardIn 0.5s cubic-bezier(0.22, 1, 0.36, 1) forwards";
        } else {
          card.classList.add("hidden");
        }
      });
    });
  });

  // Inject cardIn keyframes once
  if (!document.getElementById("cardInKeyframes")) {
    const style = document.createElement("style");
    style.id = "cardInKeyframes";
    style.textContent = `@keyframes cardIn {
      from { opacity: 0; transform: translateY(16px) scale(0.98); }
      to { opacity: 1; transform: translateY(0) scale(1); }
    }`;
    document.head.appendChild(style);
  }

  /* ---------- 7. PROJECT DATA + MODAL ---------- */
  const projects = {
    "ember-oak": {
      name: "EMBER & OAK",
      industry: "Restaurant",
      badge: "Concept Project",
      theme: "theme-ember",
      objective:
        "Create a premium digital experience that makes discovering the restaurant and making a reservation effortless.",
      direction: "Dark editorial luxury. Warm, atmospheric, and confident. Every section drives toward a reservation.",
      features: [
        "Reservation-focused UX",
        "Menu presentation",
        "Mobile-first navigation",
        "Location integration",
        "Social proof & gallery",
        "Instagram integration",
      ],
      heroText: "FIRE. FLAVOR.<br>NO APOLOGIES.",
      cta: "RESERVE A TABLE",
      phoneLogo: "E&O",
      phoneText: "FIRE.<br>FLAVOR.",
      phoneCta: "RESERVE",
      websiteLocation: "demo/ember-and-oak/index.html",
    },
    "nova-dental": {
      name: "NOVA DENTAL",
      industry: "Healthcare",
      badge: "Concept Project",
      theme: "theme-nova",
      objective:
        "Build trust instantly and make booking an appointment the obvious next step for every visitor.",
      direction: "Clean, premium medical aesthetic. Calm, credible, and reassuring.",
      features: [
        "Appointment CTA",
        "Services overview",
        "Doctor profiles",
        "Before/after visual area",
        "Patient reviews section",
        "Emergency contact",
      ],
      heroText: "Confident smiles<br>start here.",
      cta: "BOOK APPOINTMENT",
      phoneLogo: "NOVA",
      phoneText: "Smile<br>confidently.",
      phoneCta: "BOOK",
      websiteLocation: "demo/nova-dental/index.html",
    },
    "north-co": {
      name: "NORTH & CO.",
      industry: "Real Estate",
      badge: "Concept Project",
      theme: "theme-north",
      objective:
        "Showcase premium properties and capture leads through a clear, elegant browsing experience.",
      direction: "Editorial real estate luxury. Understated, confident, and premium.",
      features: [
        "Property cards",
        "Search interface",
        "Featured property",
        "Agent section",
        "Neighborhood info",
        "Lead capture",
      ],
      heroText: "Find your<br>next address.",
      cta: "VIEW LISTINGS",
      phoneLogo: "N&Co",
      phoneText: "Find your<br>next.",
      phoneCta: "VIEW",
      websiteLocation: "demo/north-co/index.html",
    },
    "forge-athletics": {
      name: "FORGE ATHLETICS",
      industry: "Fitness",
      badge: "Concept Project",
      theme: "theme-forge",
      objective:
        "Convert visitors into members with a high-energy brand presence and clear membership CTA.",
      direction: "Bold performance aesthetic. Raw, energetic, and motivating.",
      features: [
        "Membership CTA",
        "Programs overview",
        "Coach profiles",
        "Transformation section",
        "Class schedule",
        "Pricing options",
      ],
      heroText: "BUILT.<br>NOT BORN.",
      cta: "START TRAINING",
      phoneLogo: "FORGE",
      phoneText: "BUILT.<br>NOT BORN.",
      phoneCta: "JOIN",
      websiteLocation: "#contact",
    },
    "sterling-legal": {
      name: "STERLING LEGAL",
      industry: "Professional Services",
      badge: "Concept Project",
      theme: "theme-sterling",
      objective:
        "Communicate authority and expertise, then convert visitors into consultation requests.",
      direction: "Editorial luxury. Authoritative, refined, and trustworthy.",
      features: [
        "Practice areas",
        "Attorney profiles",
        "Case approach",
        "Consultation CTA",
        "FAQ section",
        "Contact form",
      ],
      heroText: "Authority.<br>Precision.<br>Results.",
      cta: "REQUEST CONSULTATION",
      phoneLogo: "SL",
      phoneText: "Authority.<br>Precision.",
      phoneCta: "CONSULT",
      websiteLocation: "#contact",
    },
    "craft-co": {
      name: "CRAFT & CO.",
      industry: "Home Services",
      badge: "Concept Project",
      theme: "theme-craft",
      objective:
        "Showcase quality work and make requesting a quote effortless for homeowners.",
      direction: "Warm, premium craftsmanship aesthetic. Reliable and detail-oriented.",
      features: [
        "Project gallery",
        "Services overview",
        "Process explanation",
        "Client experience copy",
        "Quote CTA",
        "Service areas",
      ],
      heroText: "Craftsmanship<br>you can see.",
      cta: "REQUEST QUOTE",
      phoneLogo: "C&Co",
      phoneText: "Craft you<br>can see.",
      phoneCta: "QUOTE",
      websiteLocation: "#contact",
    },
  };

  const modal = document.getElementById("projectModal");
  const modalBody = document.getElementById("modalBody");
  const modalClose = document.getElementById("modalClose");

  function openModal(projectId) {
    const p = projects[projectId];
    if (!p) return;

    modalBody.innerHTML = `
      <div class="modal-hero ${p.theme}">
        <span class="modal-badge">${p.badge}</span>
        <h2>${p.name}</h2>
        <p class="modal-industry">${p.industry}</p>
      </div>
      <div class="modal-content ${p.theme}">
        <div class="modal-section">
          <h4>Objective</h4>
          <p>${p.objective}</p>
        </div>
        <div class="modal-section">
          <h4>Design Direction</h4>
          <p>${p.direction}</p>
        </div>
        <div class="modal-section">
          <h4>Key Features</h4>
          <ul class="modal-features">
            ${p.features.map((f) => `<li>${f}</li>`).join("")}
          </ul>
        </div>
        <div class="modal-previews">
          <div class="modal-preview-frame">
            <div class="modal-preview-bar">
              <span class="dot"></span><span class="dot"></span><span class="dot"></span>
            </div>
            <div class="modal-preview-content">
              <div class="mock-nav">
                <span>${p.name}</span>
                <span>Menu</span>
              </div>
              <div class="mock-hero-text">${p.heroText}</div>
              <div class="mock-btn-small">${p.cta}</div>
            </div>
          </div>
          <div class="modal-mobile-frame">
            <div class="modal-phone">
              <div class="modal-phone-notch"></div>
              <div class="modal-phone-logo">${p.phoneLogo}</div>
              <div class="modal-phone-text">${p.phoneText}</div>
              <div class="modal-phone-btn">${p.phoneCta}</div>
            </div>
          </div>
        </div>
        <div class="modal-cta">
          <p>This is a concept build created by Scriptll's Agency to demonstrate design direction. It is not a real client project.</p>
          <a href="${p.websiteLocation}" class="btn btn-primary" id="modalCtaBtn">Start a Project</a>
        </div>
      </div>
    `;

    const ctaBtn = document.getElementById("modalCtaBtn");
    if (ctaBtn) {
      ctaBtn.addEventListener("click", () => closeModal());
    }

    modal.classList.add("open");
    modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }

  function closeModal() {
    modal.classList.remove("open");
    modal.setAttribute("aria-hidden", "true");
    if (!navLinks.classList.contains("open")) {
      document.body.style.overflow = "";
    }
  }

  document.querySelectorAll(".project-link, .project-card").forEach((el) => {
    el.addEventListener("click", (e) => {
      // Prevent double firing if button inside card clicked
      const projectId = el.dataset.project || el.closest(".project-card")?.dataset.project;
      if (projectId) {
        e.stopPropagation();
        openModal(projectId);
      }
    });
  });

  modalClose.addEventListener("click", closeModal);
  modal.addEventListener("click", (e) => {
    if (e.target === modal) closeModal();
  });

  /* ---------- 8. FAQ ACCORDION ---------- */
  const faqItems = document.querySelectorAll(".faq-item");

  faqItems.forEach((item) => {
    const question = item.querySelector(".faq-question");
    const answer = item.querySelector(".faq-answer");

    question.addEventListener("click", () => {
      const isOpen = item.classList.contains("open");

      // Close all
      faqItems.forEach((other) => {
        other.classList.remove("open");
        other.querySelector(".faq-question").setAttribute("aria-expanded", "false");
        other.querySelector(".faq-answer").style.maxHeight = null;
      });

      // Open current if it was closed
      if (!isOpen) {
        item.classList.add("open");
        question.setAttribute("aria-expanded", "true");
        answer.style.maxHeight = answer.scrollHeight + "px";
      }
    });
  });

  /* ---------- 9. BEFORE/AFTER SLIDER ---------- */
  const baSlider = document.getElementById("baSlider");
  const baAfter = document.getElementById("baAfter");
  const baHandle = document.getElementById("baHandle");

  if (baSlider && baAfter) {
    let isDragging = false;

    function setSliderPosition(x) {
      const rect = baSlider.getBoundingClientRect();
      let percent = ((x - rect.left) / rect.width) * 100;
      percent = Math.max(2, Math.min(98, percent));

      baAfter.style.clipPath = `inset(0 0 0 ${percent}%)`;
      baHandle.style.left = percent + "%";
      baSlider.querySelector(".ba-before").style.clipPath = `inset(0 ${100 - percent}% 0 0)`;
    }

    function startDrag(e) {
      isDragging = true;
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      setSliderPosition(clientX);
    }

    function moveDrag(e) {
      if (!isDragging) return;
      if (e.cancelable) e.preventDefault();
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      setSliderPosition(clientX);
    }

    function endDrag() {
      isDragging = false;
    }

    baSlider.addEventListener("mousedown", startDrag);
    baSlider.addEventListener("touchstart", startDrag, { passive: true });
    window.addEventListener("mousemove", moveDrag);
    window.addEventListener("touchmove", moveDrag, { passive: false });
    window.addEventListener("mouseup", endDrag);
    window.addEventListener("touchend", endDrag);

    // Initialize
    setSliderPosition(baSlider.getBoundingClientRect().left + baSlider.offsetWidth / 2);
  }

  /* ---------- 10. CONTACT FORM ---------- */
  const contactForm = document.getElementById("contactForm");
  const formSuccess = document.getElementById("formSuccess");

  if (contactForm) {
    const requiredFields = ["name", "email"];

    contactForm.addEventListener("submit", (e) => {
      e.preventDefault();
      let valid = true;

      // Clear previous errors
      contactForm.querySelectorAll(".form-group").forEach((g) => g.classList.remove("error"));

      requiredFields.forEach((fieldName) => {
        const field = contactForm.querySelector(`#${fieldName}`);
        if (!field) return;
        const value = field.value.trim();
        const group = field.closest(".form-group");
        if (!value) {
          group.classList.add("error");
          valid = false;
        } else if (fieldName === "email") {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(value)) {
            group.classList.add("error");
            valid = false;
          }
        }
      });

      if (!valid) {
        const firstError = contactForm.querySelector(".form-group.error input");
        if (firstError) firstError.focus();
        return;
      }

      // Show polished success state
      formSuccess.classList.add("show");
      contactForm.reset();

      setTimeout(() => {
        formSuccess.classList.remove("show");
      }, 6000);
    });

    // Live error clearing
    contactForm.querySelectorAll("input, select, textarea").forEach((field) => {
      field.addEventListener("input", () => {
        const group = field.closest(".form-group");
        if (group) group.classList.remove("error");
      });
    });
  }

  /* ---------- 11. MAGNETIC BUTTONS ---------- */
  if (!prefersReducedMotion && window.matchMedia("(pointer: fine)").matches) {
    document.querySelectorAll(".magnetic").forEach((btn) => {
      btn.addEventListener("mousemove", (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        btn.style.transform = `translate(${x * 0.15}px, ${y * 0.15}px)`;
      });

      btn.addEventListener("mouseleave", () => {
        btn.style.transform = "";
      });
    });
  }

  /* ---------- 12. SUBTLE PARALLAX ON HERO MOCKUP ---------- */
  if (!prefersReducedMotion && window.matchMedia("(pointer: fine)").matches) {
    const heroVisual = document.querySelector(".hero-visual");
    const heroMockup = document.querySelector(".mockup-browser");

    if (heroVisual && heroMockup) {
      heroVisual.addEventListener("mousemove", (e) => {
        const rect = heroVisual.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        heroMockup.style.transform = `perspective(1000px) rotateY(${x * 5}deg) rotateX(${-y * 5}deg) translateY(-6px)`;
      });

      heroVisual.addEventListener("mouseleave", () => {
        heroMockup.style.transform = "";
      });
    }
  }

  /* ---------- 13. NUMBER COUNTER (About stats) ---------- */
  const statNums = document.querySelectorAll(".stat-num");

  if (statNums.length && !prefersReducedMotion) {
    const counterObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const el = entry.target;
            const text = el.textContent.trim();
            const match = text.match(/^(\d+)/);
            if (match) {
              const target = parseInt(match[1], 10);
              const suffix = text.replace(/^\d+/, "");
              let current = 0;
              const duration = 1200;
              const stepTime = 16;
              const steps = duration / stepTime;
              const increment = target / steps;

              const timer = setInterval(() => {
                current += increment;
                if (current >= target) {
                  current = target;
                  clearInterval(timer);
                }
                el.textContent = Math.floor(current) + suffix;
              }, stepTime);
            }
            counterObserver.unobserve(el);
          }
        });
      },
      { threshold: 0.5 }
    );

    statNums.forEach((el) => counterObserver.observe(el));
  }

  /* ---------- 14. INITIAL REVEAL FOR HERO ---------- */
  window.addEventListener("load", () => {
    document.querySelectorAll(".hero .reveal").forEach((el, i) => {
      setTimeout(() => {
        el.classList.add("visible");
      }, i * 120);
    });
  });

})();
