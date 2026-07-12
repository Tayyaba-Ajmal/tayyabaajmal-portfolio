// ---------- Typing effect ----------
const roles = ["responsive websites.", "accessible UIs.", "modern interfaces."];
const typingEl = document.getElementById("typing-text");
let roleIndex = 0;
let charIndex = 0;
let deleting = false;

function typeLoop() {
  const current = roles[roleIndex];

  if (!deleting) {
    charIndex++;
    typingEl.textContent = current.slice(0, charIndex);
    if (charIndex === current.length) {
      deleting = true;
      setTimeout(typeLoop, 1400);
      return;
    }
  } else {
    charIndex--;
    typingEl.textContent = current.slice(0, charIndex);
    if (charIndex === 0) {
      deleting = false;
      roleIndex = (roleIndex + 1) % roles.length;
    }
  }
  setTimeout(typeLoop, deleting ? 45 : 70);
}
typeLoop();

// ---------- Theme toggle ----------
const themeBtn = document.getElementById("theme-btn");
const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
if (prefersDark) {
  document.body.classList.add("dark");
}

themeBtn.addEventListener("click", () => {
  document.body.classList.toggle("dark");
});

// ---------- Mobile menu ----------
const hamburger = document.querySelector(".hamburger");
const menu = document.querySelector(".menu");

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

// ---------- Scroll reveal ----------
const revealEls = document.querySelectorAll(".reveal");

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("show");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.15 },
);

revealEls.forEach((el) => revealObserver.observe(el));

// ---------- Skill bar animation ----------
const skillCards = document.querySelectorAll(".skill");

const skillObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const cards =
          entry.target.closest(".skill-grid")?.querySelectorAll(".skill") ?? [];
        cards.forEach((card, i) => {
          setTimeout(() => card.classList.add("animated"), i * 80);
        });
        skillObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.3 },
);

if (skillCards.length) skillObserver.observe(skillCards[0]);

// ---------- Contact form ----------
const form = document.getElementById("contact-form");
const formNote = document.getElementById("form-note");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  // Honeypot check — Formspree also checks this server-side, this just avoids the network call
  const honeypot = form.querySelector("#company");
  if (honeypot && honeypot.value.trim() !== "") {
    form.reset();
    return; // silently drop — don't tell the bot it failed
  }

  const submitBtn = form.querySelector("button[type='submit']");
  submitBtn.disabled = true;
  formNote.textContent = "Sending…";

  try {
    const response = await fetch(form.action, {
      method: "POST",
      body: new FormData(form),
      headers: { Accept: "application/json" },
    });

    if (response.ok) {
      formNote.textContent =
        "Thanks! Your message has been sent — I'll get back to you soon.";
      form.reset();
    } else {
      const data = await response.json().catch(() => null);
      const message = data?.errors?.map((err) => err.message).join(", ");
      formNote.textContent =
        message ||
        "Something went wrong — please try again or email me directly.";
    }
  } catch (err) {
    formNote.textContent =
      "Network error — please check your connection and try again.";
  } finally {
    submitBtn.disabled = false;
  }
});

// ---------- Footer year ----------
document.getElementById("year").textContent = new Date().getFullYear();
