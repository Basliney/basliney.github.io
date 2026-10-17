/* ================= 1. ПЕЧАТАЮЩИЙСЯ ТЕКСТ ================= */
const phrases = ["backend-разработчик", "FullStack разработчик", "лид и наставник", "разработчик с ИИ-агентами"];
const tw = document.getElementById("typewriter");

let phraseIndex = 0;
let charIndex = 0;
let deleting = false;

function typeLoop() {
  const current = phrases[phraseIndex];

  if (!deleting) {
    tw.textContent = current.slice(0, ++charIndex);
    if (charIndex === current.length) {
      deleting = true;
      return setTimeout(typeLoop, 1800);
    }
  } else {
    tw.textContent = current.slice(0, --charIndex);
    if (charIndex === 0) {
      deleting = false;
      phraseIndex = (phraseIndex + 1) % phrases.length;
    }
  }
  setTimeout(typeLoop, deleting ? 45 : 90);
}
typeLoop();

/* ================= 2. ПРОЖКТОР ПОД КУРСОРОМ ================= */
const spotlight = document.getElementById("spotlight");
let spotX = window.innerWidth / 2;
let spotY = window.innerHeight / 2;
let targetX = spotX;
let targetY = spotY;

document.addEventListener("mousemove", (e) => {
  targetX = e.clientX;
  targetY = e.clientY;
});

function animateSpotlight() {
  spotX += (targetX - spotX) * 0.12;
  spotY += (targetY - spotY) * 0.12;
  spotlight.style.left = spotX + "px";
  spotlight.style.top = spotY + "px";
  requestAnimationFrame(animateSpotlight);
}
animateSpotlight();

/* ================= 3. ПАРЯЩИЕ ЧАСТИЦЫ КОДА ================= */
const canvas = document.getElementById("particles");
const ctx = canvas.getContext("2d");
const symbols = ["{", "}", ";", "=>", "var", "async", "await", "class", "()", "<>", "NuGet", "git", "λ", "[]", "::"];
let particles = [];

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener("resize", resizeCanvas);

class Particle {
  constructor(reset) {
    this.reset(reset);
  }
  reset(randomY = true) {
    this.x = Math.random() * canvas.width;
    this.y = randomY ? Math.random() * canvas.height : canvas.height + 20;
    this.speed = 0.25 + Math.random() * 0.6;
    this.size = 10 + Math.random() * 8;
    this.opacity = 0.08 + Math.random() * 0.22;
    this.symbol = symbols[Math.floor(Math.random() * symbols.length)];
    this.drift = (Math.random() - 0.5) * 0.3;
  }
  update() {
    this.y -= this.speed;
    this.x += this.drift;
    if (this.y < -20) this.reset(false);
  }
  draw() {
    ctx.font = `${this.size}px "JetBrains Mono", monospace`;
    ctx.fillStyle = `rgba(124, 92, 255, ${this.opacity})`;
    ctx.fillText(this.symbol, this.x, this.y);
  }
}

for (let i = 0; i < 45; i++) particles.push(new Particle(true));

function animateParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles.forEach((p) => {
    p.update();
    p.draw();
  });
  requestAnimationFrame(animateParticles);
}
animateParticles();

/* ================= 4. REVEAL ПРИ СКРОЛЛЕ ================= */
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.15 }
);

document.querySelectorAll(".reveal").forEach((el, i) => {
  el.style.transitionDelay = `${(i % 6) * 70}ms`;
  revealObserver.observe(el);
});

/* ================= 5. АНИМИРОВАННЫЕ ШКАЛЫ НАВЫКОВ ================= */
const skillObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;

      const skill = entry.target;
      const level = +skill.dataset.level;
      const bar = skill.querySelector(".bar i");
      const label = skill.querySelector(".skill-val");

      bar.style.width = level + "%";

      // счётчик %
      let current = 0;
      const step = Math.max(1, Math.round(level / 40));
      const counter = setInterval(() => {
        current = Math.min(level, current + step);
        label.textContent = current + "%";
        if (current >= level) clearInterval(counter);
      }, 30);

      skillObserver.unobserve(skill);
    });
  },
  { threshold: 0.4 }
);

document.querySelectorAll(".skill").forEach((s) => skillObserver.observe(s));

/* ================= 6. 3D-TILT НА КАРТОЧКАХ ================= */
function attachTilt(el, maxDeg = 8) {
  el.addEventListener("mousemove", (e) => {
    const rect = el.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    el.style.transform = `perspective(800px) rotateY(${px * maxDeg}deg) rotateX(${-py * maxDeg}deg) translateY(-4px)`;
  });
  el.addEventListener("mouseleave", () => {
    el.style.transform = "perspective(800px) rotateY(0) rotateX(0)";
  });
}

document.querySelectorAll(".tilt").forEach((el) => attachTilt(el, 7));
const tiltPhoto = document.getElementById("tiltPhoto");
if (tiltPhoto) attachTilt(tiltPhoto, 12);

/* ================= 7. ПЛАВНЫЙ СКРОЛЛ ДЛЯ ЯКОРЬКОВ ================= */
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", (e) => {
    const target = document.querySelector(anchor.getAttribute("href"));
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({ behavior: "smooth", block: "start" });
  });
});
