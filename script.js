// ---------- Typing effect ----------
const typingEl = document.getElementById("typing-text");
if (typingEl) {
  const roles = ["responsive websites.", "accessible UIs.", "modern interfaces."];
  let roleIndex = 0, charIndex = 0, deleting = false;

  function typeLoop() {
    const current = roles[roleIndex];
    if (!deleting) {
      charIndex++;
      typingEl.textContent = current.slice(0, charIndex);
      if (charIndex === current.length) { deleting = true; setTimeout(typeLoop, 1400); return; }
    } else {
      charIndex--;
      typingEl.textContent = current.slice(0, charIndex);
      if (charIndex === 0) { deleting = false; roleIndex = (roleIndex + 1) % roles.length; }
    }
    setTimeout(typeLoop, deleting ? 45 : 70);
  }
  typeLoop();
}

// ---------- Theme toggle ----------
const themeBtn = document.getElementById("theme-btn");
if (themeBtn) {
  if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
    document.body.classList.add("dark");
  }
  themeBtn.addEventListener("click", () => {
    document.body.classList.toggle("dark");
  });
}

// ---------- Mobile menu ----------
const hamburger = document.querySelector(".hamburger");
const menu = document.querySelector(".menu");
if (hamburger && menu) {
  hamburger.addEventListener("click", () => {
    const isActive = menu.classList.toggle("active");
    hamburger.classList.toggle("active");
    hamburger.setAttribute("aria-expanded", isActive);
  });
  document.querySelectorAll(".nav-link").forEach((link) => {
    link.addEventListener("click", () => {
      menu.classList.remove("active");
      hamburger.classList.remove("active");
      hamburger.setAttribute("aria-expanded", "false");
    });
  });
}

// ---------- Scroll reveal ----------
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("show");
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });
document.querySelectorAll(".reveal").forEach((el) => revealObserver.observe(el));

// ---------- Skill bar animation ----------
const skillCards = document.querySelectorAll(".skill");
if (skillCards.length) {
  const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const cards = entry.target.closest(".skill-grid")?.querySelectorAll(".skill") ?? [];
        cards.forEach((card, i) => setTimeout(() => card.classList.add("animated"), i * 80));
        skillObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });
  skillObserver.observe(skillCards[0]);
}

// ---------- Contact form ----------
window.addEventListener("load", () => {
  const form     = document.getElementById("contact-form");
  const formNote = document.getElementById("form-note");

  console.log("Form found:", form);
  console.log("FormNote found:", formNote);

  if (!form || !formNote) {
    console.error("Form or formNote element missing from HTML");
    return;
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    console.log("Form submitted!");

    const honeypot = form.querySelector("#company");
    if (honeypot && honeypot.value.trim() !== "") { form.reset(); return; }

    const submitBtn    = form.querySelector("button[type='submit']");
    const originalText = submitBtn.textContent;
    submitBtn.disabled    = true;
    submitBtn.textContent = "Sending…";
    formNote.textContent  = "";

    try {
      const response = await fetch(form.action, {
        method: "POST",
        body: new FormData(form),
        headers: { Accept: "application/json" },
      });

      console.log("Response status:", response.status);

      if (response.ok) {
        formNote.textContent = "✓ Thanks! Your message has been sent — I'll get back to you soon.";
        formNote.style.color = "#22c55e";
        form.reset();
      } else {
        const data = await response.json().catch(() => null);
        const msg  = data?.errors?.map((err) => err.message).join(", ");
        formNote.textContent = msg || "Something went wrong — please try again.";
        formNote.style.color = "#ef4444";
      }
    } catch (err) {
      console.error("Fetch error:", err);
      formNote.textContent = "Network error — please check your connection.";
      formNote.style.color = "#ef4444";
    } finally {
      submitBtn.disabled    = false;
      submitBtn.textContent = originalText;
    }
  });

  console.log("Form listener attached successfully!");
});

// ---------- Footer year ----------
const yearEl = document.getElementById("year");
if (yearEl) yearEl.textContent = new Date().getFullYear();
