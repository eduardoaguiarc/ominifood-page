"use strict";

document.addEventListener("DOMContentLoaded", () => {
  const header = document.querySelector(".header");
  const mobileButton = document.querySelector(".btn-mobile-nav");
  const navLinks = [...document.querySelectorAll('.main-nav-link[href^="#"]')];
  const progressBar = document.querySelector(".scroll-progress");
  const backToTop = document.querySelector(".back-to-top");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const notice = document.createElement("div");
  let noticeTimer;

  notice.className = "site-notice";
  notice.setAttribute("role", "status");
  notice.setAttribute("aria-live", "polite");
  document.body.append(notice);

  const showNotice = (message) => {
    notice.textContent = message;
    notice.classList.add("is-visible");
    window.clearTimeout(noticeTimer);
    noticeTimer = window.setTimeout(() => notice.classList.remove("is-visible"), 2600);
  };

  const closeMobileNav = () => {
    header.classList.remove("nav-open");
    mobileButton.setAttribute("aria-expanded", "false");
    mobileButton.setAttribute("aria-label", "Open navigation");
    document.body.style.overflow = "";
  };

  mobileButton.addEventListener("click", () => {
    const isOpen = header.classList.toggle("nav-open");
    mobileButton.setAttribute("aria-expanded", String(isOpen));
    mobileButton.setAttribute("aria-label", isOpen ? "Close navigation" : "Open navigation");
    document.body.style.overflow = isOpen ? "hidden" : "";
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeMobileNav();
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 900) closeMobileNav();
  });

  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (event) => {
      const selector = link.getAttribute("href");

      if (selector === "#") {
        event.preventDefault();
        closeMobileNav();
        showNotice(link.dataset.notice || "This feature is coming soon.");
        return;
      }

      const target = document.querySelector(selector);

      if (!target) return;

      event.preventDefault();
      closeMobileNav();
      target.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
    });
  });

  const updatePageChrome = () => {
    const scrollTop = window.scrollY;
    const scrollRange = document.documentElement.scrollHeight - window.innerHeight;
    const progress = scrollRange > 0 ? scrollTop / scrollRange : 0;

    header.classList.toggle("is-scrolled", scrollTop > 24);
    backToTop.classList.toggle("is-visible", scrollTop > 650);
    progressBar.style.transform = `scaleX(${progress})`;
  };

  updatePageChrome();
  window.addEventListener("scroll", updatePageChrome, { passive: true });

  backToTop.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
  });

  const observedSections = navLinks
    .map((link) => document.querySelector(link.getAttribute("href")))
    .filter(Boolean);

  const activeSectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        navLinks.forEach((link) => {
          link.classList.toggle("is-active", link.getAttribute("href") === `#${entry.target.id}`);
        });
      });
    },
    { rootMargin: "-35% 0px -55%", threshold: 0 }
  );

  observedSections.forEach((section) => activeSectionObserver.observe(section));

  const year = document.querySelector(".year");
  if (year) year.textContent = new Date().getFullYear();

  if (!window.gsap || !window.ScrollTrigger || reduceMotion) return;

  gsap.registerPlugin(ScrollTrigger);

  const intro = gsap.timeline({ defaults: { ease: "power3.out" } });
  intro
    .from(".image-webpage-logo", { y: -20, autoAlpha: 0, duration: 0.55 })
    .from(".main-nav-list > li", { y: -18, autoAlpha: 0, stagger: 0.07, duration: 0.45 }, "<0.05")
    .from(".hero-text-box > *:not(.delivered-meals)", {
      y: 36,
      autoAlpha: 0,
      stagger: 0.11,
      duration: 0.7,
    }, "-=0.15")
    .from(".hero-img", { x: 60, scale: 0.92, autoAlpha: 0, duration: 1 }, "-=0.75")
    .from(".delivered-meals", { y: 20, autoAlpha: 0, duration: 0.55 }, "-=0.5")
    .from(".delivered-imgs img", { x: -12, autoAlpha: 0, stagger: 0.07, duration: 0.35 }, "-=0.35");

  gsap.to(".hero-img", {
    y: -14,
    duration: 2.8,
    repeat: -1,
    yoyo: true,
    ease: "sine.inOut",
  });

  gsap.from(".logos img", {
    scrollTrigger: { trigger: ".section-featured", start: "top 85%", once: true },
    y: 22,
    autoAlpha: 0,
    stagger: 0.1,
    duration: 0.6,
    ease: "power2.out",
  });

  gsap.utils.toArray("section .subheading, section .heading-secondary").forEach((element) => {
    gsap.from(element, {
      scrollTrigger: { trigger: element, start: "top 88%", once: true },
      y: 32,
      autoAlpha: 0,
      duration: 0.7,
      ease: "power3.out",
    });
  });

  gsap.utils.toArray(".step-text-box").forEach((textBox, index) => {
    const previous = textBox.previousElementSibling;
    const imageBox = previous?.classList.contains("step-img-box")
      ? previous
      : textBox.nextElementSibling;

    gsap.from(textBox, {
      scrollTrigger: { trigger: textBox, start: "top 80%", once: true },
      x: index % 2 === 0 ? -55 : 55,
      autoAlpha: 0,
      duration: 0.85,
      ease: "power3.out",
    });

    if (imageBox?.classList.contains("step-img-box")) {
      gsap.from(imageBox, {
        scrollTrigger: { trigger: imageBox, start: "top 82%", once: true },
        scale: 0.78,
        autoAlpha: 0,
        duration: 0.9,
        ease: "back.out(1.4)",
      });
    }
  });

  const revealGroups = [
    [".testimonials", ".testimonial"],
    [".gallery", ".gallery-item"],
    [".plans-pricing", ".plan-header-left, .plan-header-right"],
    [".plan-features", ".feature"],
    [".grid--footer", ".logo-col, .address-col, .nav-col"],
  ];

  revealGroups.forEach(([trigger, targets]) => {
    gsap.from(targets, {
      scrollTrigger: { trigger, start: "top 84%", once: true },
      y: 44,
      autoAlpha: 0,
      stagger: 0.09,
      duration: 0.7,
      ease: "power3.out",
    });
  });

  // Keep meal cards visible even if ScrollTrigger is delayed or unavailable.
  gsap.from(".container-meals-grid > *", {
    scrollTrigger: { trigger: ".container-meals-grid", start: "top 84%", once: true },
    y: 44,
    stagger: 0.09,
    duration: 0.7,
    ease: "power3.out",
    clearProps: "transform",
  });

  gsap.from(".cta-content > *", {
    scrollTrigger: { trigger: ".cta", start: "top 78%", once: true },
    x: -40,
    autoAlpha: 0,
    stagger: 0.14,
    duration: 0.8,
    ease: "power3.out",
  });

  gsap.from(".image-woman img", {
    scrollTrigger: { trigger: ".cta", start: "top 78%", once: true },
    scale: 1.15,
    autoAlpha: 0,
    duration: 1.1,
    ease: "power3.out",
  });

  gsap.to(".gallery", {
    yPercent: -4,
    ease: "none",
    scrollTrigger: {
      trigger: ".section-testimonials",
      start: "top bottom",
      end: "bottom top",
      scrub: 1,
    },
  });

  document.querySelectorAll("[data-counter]").forEach((counter) => {
    const targetValue = Number(counter.dataset.counter);
    const suffix = counter.dataset.suffix || "";
    const state = { value: 0 };

    gsap.to(state, {
      value: targetValue,
      duration: 1.8,
      ease: "power2.out",
      scrollTrigger: { trigger: counter, start: "top 90%", once: true },
      onUpdate: () => {
        counter.textContent = `${Math.round(state.value).toLocaleString("en-US")}${suffix}`;
      },
    });
  });

  const supportsHover = window.matchMedia("(hover: hover) and (pointer: fine)");
  if (supportsHover.matches) {
    document.querySelectorAll(".interactive-btn").forEach((button) => {
      const moveX = gsap.quickTo(button, "x", { duration: 0.35, ease: "power3.out" });
      const moveY = gsap.quickTo(button, "y", { duration: 0.35, ease: "power3.out" });

      button.addEventListener("pointermove", (event) => {
        const bounds = button.getBoundingClientRect();
        moveX((event.clientX - bounds.left - bounds.width / 2) * 0.14);
        moveY((event.clientY - bounds.top - bounds.height / 2) * 0.18);
      });

      button.addEventListener("pointerleave", () => {
        moveX(0);
        moveY(0);
      });
    });
  }
});
