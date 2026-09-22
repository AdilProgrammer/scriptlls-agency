/* =========================================================
   NOVA DENTAL — Concept Website by Scriptll's Agency
   ========================================================= */

(function () {
  "use strict";

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

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

  /* ---------- NAVBAR SCROLL ---------- */
  const navbar = document.getElementById("navbar");
  function handleScroll() {
    navbar.classList.toggle("scrolled", window.scrollY > 40);
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
      { threshold: 0.12, rootMargin: "0px 0px -60px 0px" }
    );
    document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
  } else {
    document.querySelectorAll(".reveal").forEach((el) => el.classList.add("visible"));
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

  /* ---------- APPOINTMENT FORM ---------- */
  const appointmentForm = document.getElementById("appointmentForm");
  const appointmentSuccess = document.getElementById("appointmentSuccess");
  const appSubmit = document.getElementById("appSubmit");

  if (appointmentForm) {
    appointmentForm.addEventListener("submit", (e) => {
      e.preventDefault();
      let valid = true;

      appointmentForm.querySelectorAll(".form-group").forEach((g) => g.classList.remove("error"));

      const required = ["app-first", "app-last", "app-email"];
      required.forEach((id) => {
        const field = document.getElementById(id);
        if (!field) return;
        const value = field.value.trim();
        const group = field.closest(".form-group");
        if (!value) {
          group.classList.add("error");
          valid = false;
        } else if (id === "app-email") {
          const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!regex.test(value)) {
            group.classList.add("error");
            valid = false;
          }
        }
      });

      if (!valid) {
        const first = appointmentForm.querySelector(".form-group.error input");
        if (first) first.focus();
        return;
      }

      // Loading micro-interaction
      const originalText = appSubmit.textContent;
      appSubmit.disabled = true;
      appSubmit.textContent = "Sending...";

      setTimeout(() => {
        appSubmit.textContent = "Confirming details...";
        setTimeout(() => {
          appointmentSuccess.classList.add("show");
          appSubmit.textContent = originalText;
          appSubmit.disabled = false;
          appointmentForm.reset();
        }, 700);
      }, 800);
    });

    // Clear errors on input
    appointmentForm.querySelectorAll("input, select, textarea").forEach((field) => {
      field.addEventListener("input", () => {
        const g = field.closest(".form-group");
        if (g) g.classList.remove("error");
      });
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

    const rect = baSlider.getBoundingClientRect();
    setPosition(rect.left + rect.width / 2);
  }

  /* ---------- TREATMENT MODAL ---------- */
  const treatmentModal = document.getElementById("treatmentModal");
  const treatmentModalClose = document.getElementById("treatmentModalClose");
  const treatmentModalTitle = document.getElementById("treatmentModalTitle");
  const treatmentModalBody = document.getElementById("treatmentModalBody");

  const treatmentData = {
    general: {
      title: "General Dentistry",
      overview:
        "General dentistry covers routine oral care — checkups, cleanings, and preventive support. It's the foundation of long-term dental health.",
      involves: [
        "Routine examinations and professional cleanings",
        "Preventive guidance tailored to your oral health",
        "Early identification of potential concerns",
        "Clear explanations of what's happening and why",
      ],
      who:
        "General dentistry is relevant for most patients, regardless of age or current oral health status.",
      next:
        "A consultation is the simplest way to understand what general care looks like for you.",
    },
    cosmetic: {
      title: "Cosmetic Dentistry",
      overview:
        "Cosmetic dentistry focuses on improving the appearance of the smile through treatments selected according to individual needs.",
      involves: [
        "A conversation about your goals and expectations",
        "Professional assessment of your dental health",
        "A treatment approach built around what suits you",
        "Clear information about what each option involves",
      ],
      who:
        "Cosmetic treatment may be considered by patients looking to address the appearance of their smile. Suitability is always determined professionally.",
      next:
        "A consultation is the best starting point to discuss what's possible for your smile.",
    },
    implants: {
      title: "Dental Implants",
      overview:
        "Dental implants are one option for replacing missing teeth. They're designed to look and function like natural teeth.",
      involves: [
        "A professional assessment of your dental health",
        "Discussion of replacement options and what each involves",
        "A plan tailored to your situation",
        "Ongoing care and follow-up",
      ],
      who:
        "Implant suitability depends on individual factors including oral health. A professional consultation is required to determine if it's right for you.",
      next:
        "A consultation will help clarify what replacement options may suit your situation.",
    },
    orthodontics: {
      title: "Orthodontics",
      overview:
        "Orthodontics focuses on straightening and aligning teeth. Treatment approaches vary depending on your goals and dental situation.",
      involves: [
        "Assessment of alignment and bite",
        "Discussion of available approaches",
        "A plan suited to your needs",
        "Regular monitoring and adjustments where appropriate",
      ],
      who:
        "Orthodontic treatment may be considered by patients looking to address alignment. A professional assessment determines the right approach.",
      next:
        "A consultation is the best way to understand which orthodontic options may apply to you.",
    },
    whitening: {
      title: "Teeth Whitening",
      overview:
        "Professional teeth whitening is a cosmetic treatment focused on the shade of your teeth. Results and suitability vary by individual.",
      involves: [
        "A professional assessment of your teeth and gums",
        "Discussion of whitening options and expectations",
        "A treatment approach suited to your situation",
        "Aftercare guidance",
      ],
      who:
        "Whitening may be considered by patients looking to brighten their smile. Suitability is always determined through professional assessment.",
      next:
        "A consultation will clarify whether whitening is appropriate for you and what it may involve.",
    },
    emergency: {
      title: "Emergency Dental Care",
      overview:
        "Emergency dental care is support for unexpected dental problems that need prompt attention. If you're experiencing an urgent issue, contact the clinic directly.",
      involves: [
        "Direct contact with the clinic to discuss your situation",
        "Guidance on the appropriate next step",
        "A prompt assessment where possible",
        "Treatment planning based on what's needed",
      ],
      who:
        "Anyone experiencing a dental problem that needs prompt attention should contact the clinic directly.",
      next:
        "Call the clinic to discuss your situation and the appropriate next step.",
    },
  };

  function openTreatmentModal(key) {
    const data = treatmentData[key];
    if (!data) return;

    treatmentModalTitle.textContent = data.title.toUpperCase();
    treatmentModalBody.innerHTML = `
      <h2>${data.title}</h2>
      <div class="modal-section">
        <h4>Overview</h4>
        <p>${data.overview}</p>
      </div>
      <div class="modal-section">
        <h4>What it may involve</h4>
        <ul>
          ${data.involves.map((i) => `<li>${i}</li>`).join("")}
        </ul>
      </div>
      <div class="modal-section">
        <h4>Who may consider it</h4>
        <p>${data.who}</p>
      </div>
      <div class="modal-section">
        <h4>What happens next</h4>
        <p>${data.next}</p>
      </div>
      <div class="modal-cta">
        <p>Information shown is general and for demonstration purposes.</p>
        <a href="#appointment" class="btn btn-primary" id="modalCtaBtn">Request a Consultation</a>
      </div>
    `;

    const ctaBtn = document.getElementById("modalCtaBtn");
    if (ctaBtn) {
      ctaBtn.addEventListener("click", () => closeTreatmentModal());
    }

    treatmentModal.classList.add("open");
    treatmentModal.setAttribute("aria-hidden", "false");
    document.body.classList.add("no-scroll");
  }

  function closeTreatmentModal() {
    treatmentModal.classList.remove("open");
    treatmentModal.setAttribute("aria-hidden", "true");
    if (!mobileMenu.classList.contains("open")) {
      document.body.classList.remove("no-scroll");
    }
  }

  document.querySelectorAll(".treatment-card").forEach((card) => {
    card.addEventListener("click", () => {
      const key = card.dataset.treatment;
      if (key) openTreatmentModal(key);
    });
  });

  treatmentModalClose.addEventListener("click", closeTreatmentModal);
  treatmentModal.addEventListener("click", (e) => {
    if (e.target === treatmentModal) closeTreatmentModal();
  });

  /* ---------- MOBILE STICKY VISIBILITY ---------- */
  const mobileSticky = document.getElementById("mobileSticky");
  const appointmentSection = document.getElementById("appointment");
  const footer = document.querySelector(".footer");

  if (mobileSticky) {
    const hideTargets = [appointmentSection, footer].filter(Boolean);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            mobileSticky.classList.add("hidden");
          } else {
            // Only show again when none of the hide targets are visible
            const anyVisible = hideTargets.some((t) => {
              const r = t.getBoundingClientRect();
              return r.top < window.innerHeight && r.bottom > 0;
            });
            if (!anyVisible) mobileSticky.classList.remove("hidden");
          }
        });
      },
      { threshold: 0.05 }
    );
    hideTargets.forEach((t) => observer.observe(t));
  }

  /* ---------- KEYBOARD ---------- */
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      if (treatmentModal.classList.contains("open")) closeTreatmentModal();
      if (mobileMenu.classList.contains("open")) toggleMobileMenu(false);
    }
  });
})();