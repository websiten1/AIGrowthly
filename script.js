/* AIGrowthly — interactions */

(function () {
  "use strict";

  const qs = (s, c = document) => c.querySelector(s);
  const qsa = (s, c = document) => Array.from(c.querySelectorAll(s));

  // Year in footer
  const yearEl = qs("#year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Header state on scroll
  const header = qs("#site-header");
  const onScroll = () => {
    if (!header) return;
    header.classList.toggle("is-scrolled", window.scrollY > 8);
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  // Mobile menu
  const toggle = qs(".menu-toggle");
  if (toggle && header) {
    toggle.addEventListener("click", () => {
      const open = header.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    qsa(".nav a").forEach((a) =>
      a.addEventListener("click", () => {
        header.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
      })
    );
  }

  // Smooth-anchor offset for sticky header
  qsa('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (e) => {
      const id = link.getAttribute("href");
      if (!id || id === "#" || id.length < 2) return;
      const target = qs(id);
      if (!target) return;
      e.preventDefault();
      const top =
        target.getBoundingClientRect().top +
        window.scrollY -
        (header ? header.offsetHeight + 8 : 0);
      window.scrollTo({ top, behavior: "smooth" });
    });
  });

  // Reveal on scroll (staggered within each group, HH-style)
  const revealTargets = qsa(
    "section .section__head, .svc, .case, .step, .stack__cat, .stat, .quote, .loc, .post, .panel, .logos__row, .awards__items, .cta__form, .cta__text, .hero__content > *, .hero__visual"
  );
  revealTargets.forEach((el) => el.classList.add("reveal"));

  // Stagger siblings of the same type for a cascading cascade
  const stagger = (selector, step = 80, max = 360) => {
    qsa(selector).forEach((parent) => {
      let i = 0;
      parent.querySelectorAll(":scope > *").forEach((child) => {
        if (child.classList.contains("reveal")) {
          child.style.setProperty("--reveal-delay", `${Math.min(i * step, max)}ms`);
          i += 1;
        }
      });
    });
  };
  stagger(".svc-grid, .work__grid, .steps, .stack__grid, .quotes__grid, .loc-grid, .insights__grid, .metrics__stats, .hero__content");

  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-in");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    revealTargets.forEach((el) => io.observe(el));
  } else {
    revealTargets.forEach((el) => el.classList.add("is-in"));
  }

  // Counters
  const counters = qsa("[data-counter]");
  const animateCount = (el) => {
    const target = parseFloat(el.dataset.counter);
    const suffix = el.dataset.suffix || "";
    const duration = 1600;
    const start = performance.now();
    const from = 0;
    const ease = (t) => 1 - Math.pow(1 - t, 3);
    const tick = (now) => {
      const p = Math.min(1, (now - start) / duration);
      const v = from + (target - from) * ease(p);
      el.textContent =
        (target % 1 === 0 ? Math.round(v) : v.toFixed(1)).toLocaleString() +
        suffix;
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };
  if ("IntersectionObserver" in window && counters.length) {
    const cio = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animateCount(entry.target);
            cio.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.4 }
    );
    counters.forEach((el) => cio.observe(el));
  } else {
    counters.forEach(animateCount);
  }

  // Cursor-aware glow on service cards
  qsa(".svc").forEach((card) => {
    card.addEventListener("mousemove", (e) => {
      const r = card.getBoundingClientRect();
      card.style.setProperty("--mx", `${((e.clientX - r.left) / r.width) * 100}%`);
      card.style.setProperty("--my", `${((e.clientY - r.top) / r.height) * 100}%`);
    });
  });

  // Location local times
  const tzEls = qsa("[data-tz]");
  const fmt = (tz) =>
    new Intl.DateTimeFormat("en-GB", {
      timeZone: tz,
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }).format(new Date());
  const updateTz = () => tzEls.forEach((el) => (el.textContent = fmt(el.dataset.tz)));
  updateTz();
  setInterval(updateTz, 30 * 1000);

  // Form submission — open a pre-composed email draft in the user's
  // default mail client. The recipient is kept here (not rendered in the
  // HTML) so the address stays out of view and bot scrapers.
  const INQUIRY_TO = "radu.r.andrei@outlook.com";
  const isRo = document.documentElement.lang === "ro";
  const L = isRo
    ? {
        subjectPrefix: "Cerere proiect nou",
        subjectServices: "servicii",
        greeting: "Bună,",
        intro: "Sunt interesat(ă) de o colaborare. Iată detaliile:",
        name: "Nume",
        email: "Email",
        company: "Companie",
        budget: "Buget estimat",
        services: "Servicii solicitate",
        message: "Despre proiect",
        closing: "Aștept răspunsul vostru. Mulțumesc!",
        none: "(niciunul selectat)",
        sending: "Se deschide draft-ul…",
        again: "Deschide un alt draft",
      }
    : {
        subjectPrefix: "New project inquiry",
        subjectServices: "services",
        greeting: "Hi,",
        intro: "I'm interested in working with you. Here are the details:",
        name: "Name",
        email: "Email",
        company: "Company",
        budget: "Estimated budget",
        services: "Services requested",
        message: "About the project",
        closing: "Looking forward to hearing from you. Thanks!",
        none: "(none selected)",
        sending: "Opening draft…",
        again: "Open another draft",
      };

  const form = qs(".cta__form");
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }

      const name = (qs("#f-name", form)?.value || "").trim();
      const email = (qs("#f-email", form)?.value || "").trim();
      const company = (qs("#f-company", form)?.value || "").trim();
      const budget = (qs("#f-budget", form)?.value || "").trim();
      const message = (qs("#f-msg", form)?.value || "").trim();
      const services = qsa('input[name="service"]:checked', form)
        .map((i) => i.nextElementSibling?.textContent?.trim() || i.value)
        .join(", ");

      const servicesLabel = services || L.none;
      const subject = `${L.subjectPrefix} — ${services || L.subjectServices}`;

      const bodyLines = [
        L.greeting,
        "",
        L.intro,
        "",
        `• ${L.name}: ${name}`,
        `• ${L.email}: ${email}`,
        `• ${L.company}: ${company}`,
        `• ${L.budget}: ${budget}`,
        `• ${L.services}: ${servicesLabel}`,
        "",
        `${L.message}:`,
        message,
        "",
        L.closing,
        name,
      ];
      const body = bodyLines.join("\r\n");

      const href =
        "mailto:" +
        encodeURIComponent(INQUIRY_TO) +
        "?subject=" +
        encodeURIComponent(subject) +
        "&body=" +
        encodeURIComponent(body);

      const success = qs(".form-success", form);
      const btn = qs("button[type='submit']", form);
      if (btn) {
        btn.disabled = true;
        const original = btn.textContent;
        btn.textContent = L.sending;
        setTimeout(() => {
          btn.disabled = false;
          btn.textContent = L.again;
          btn.dataset.originalLabel = original;
        }, 600);
      }
      if (success) success.hidden = false;

      // Open the user's default mail client with the pre-filled draft
      window.location.href = href;
    });
  }
})();
