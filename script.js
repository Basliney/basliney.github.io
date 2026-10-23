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
        const el = entry.target;
        el.classList.add("visible");
        revealObserver.unobserve(el);
        // Снимаем ступенчатую задержку после появления: иначе она тормозит
        // 3D-наклон карточек при наведении курсора (transition-delay общий
        // для всех свойств, включая transform).
        el.addEventListener(
          "transitionend",
          () => { el.style.transitionDelay = ""; },
          { once: true }
        );
      }
    });
  },
  { threshold: 0.15 }
);

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

document.querySelectorAll(".reveal").forEach((el, i) => {
  if (!reduceMotion) el.style.transitionDelay = `${(i % 6) * 70}ms`;
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

/* ================= 8. ОКНО ПРОЕКТА: ОПИСАНИЕ + КАРУСЕЛЬ ================= */
const projectDetails = {
  photomosaic: {
    title: "Система генерации фотомозаики",
    category: "Искусство",
    tags: ["WPF", "C#", "Многопоточность", "XAML"],
    images: [
      { src: "sources/PhotoStitcher/ps1.png", webp: "sources/PhotoStitcher/ps1.webp 700w", width: 700, height: 700 },
      { src: "sources/PhotoStitcher/ps2.png", webp: "sources/PhotoStitcher/ps2.webp 700w", width: 700, height: 700 },
      { src: "sources/PhotoStitcher/ps3.png", webp: "sources/PhotoStitcher/ps3.webp 700w", width: 700, height: 700 },
      { src: "sources/PhotoStitcher/ps4.png", webp: "sources/PhotoStitcher/ps4.webp 700w", width: 700, height: 700 },
      { src: "sources/PhotoStitcher/ps5.png", webp: "sources/PhotoStitcher/ps5.webp 700w", width: 700, height: 700 },
    ],
    description: `
      <p>Приложение собирает единое изображение из нескольких сотен других фотографий: каждый маленький кадр подбирается так, чтобы по цвету и тону совпасть с фрагментом итоговой картинки. Проект выполнен по заказу Художественно-графического факультета.</p>
      <p>Работа получила публичный отклик: после релиза вышло интервью для сайта «Кубанские Новости», а результат показали на государственном телеканале.</p>
      <p>С этим проектом я участвовал в международной конференции и занял II место.</p>
      <p class="modal-stack">Стек: WPF, C#</p>
      <ul>
        <li>Сложные математические алгоритмы анализа цветовых различий и подбора похожих оттенков</li>
        <li>Математический анализ больших объёмов данных</li>
        <li>Работа с большими файлами, многопоточность, сегментация изображений</li>
        <li>Оптимизация анализа и обработки изображений</li>
      </ul>
      <p>Ссылки: <a href="https://kubnews.ru/obshchestvo/2023/03/09/odin-iz-tysyachi-ili-kak-sozdat-avatar-iz-lichnykh-foto/" target="_blank" rel="noopener">интервью «Кубанские Новости»</a> · <a href="https://vk.com/video-186976898_456239162" target="_blank" rel="noopener">сюжет на телеканале</a></p>
    `,
  },
  market: {
    title: "Магазин приложений",
    category: "Интернет-магазин",
    tags: [".NET 6", "PostgreSQL", "S3", "Bearer", "FullStack"],
    images: [
      { src: "sources/market/market1.png", webp: "sources/market/market1-960.webp 960w, sources/market/market1-1600.webp 1600w", width: 1920, height: 954 },
      { src: "sources/market/market2.png", webp: "sources/market/market2-960.webp 960w, sources/market/market2-1600.webp 1600w", width: 1920, height: 1080 },
      { src: "sources/market/market3.png", webp: "sources/market/market3-960.webp 960w, sources/market/market3-1600.webp 1600w", width: 1920, height: 1080 },
      { src: "sources/market/market4.png", webp: "sources/market/market4-960.webp 960w, sources/market/market4-1600.webp 1600w", width: 1919, height: 1079 },
    ],
    description: `
      <p>Интернет-магазин приложений: витрина, каталог и загрузка сборок. Ключевая особенность — система потокового шифрования, которая защищает распространяемые файлы приложений.</p>
      <p>Проект сделан полностью по фуллстек-профилю: от проектирования бэкенда и базы данных до вёрстки интерфейса и деплоя в облако.</p>
      <p class="modal-stack">Стек: .NET 6, HTML, CSS, JS, PostgreSQL, AWS</p>
      <ul>
        <li>Система потокового шифрования файлов приложений</li>
        <li>Фуллстек-разработка: бэкенд, база данных, фронтенд, деплой</li>
        <li>Хранение сборок в S3 и авторизация по Bearer-токену</li>
      </ul>
    `,
  },
  testing: {
    title: "Сайт для тестирования студентов",
    category: "Обучение",
    tags: ["C#", ".NET 5", "PostgreSQL", "Auth", "FullStack"],
    images: [
      { src: "sources/Testing/Testing1.jpg", webp: "sources/Testing/Testing1-640.webp 640w, sources/Testing/Testing1-1280.webp 1280w", width: 1280, height: 724 },
      { src: "sources/Testing/Testing2.jpg", webp: "sources/Testing/Testing2-640.webp 640w, sources/Testing/Testing2-1280.webp 1280w", width: 1280, height: 663 },
      { src: "sources/Testing/Testing3.jpg", webp: "sources/Testing/Testing3-640.webp 640w, sources/Testing/Testing3-1280.webp 1280w", width: 1280, height: 576 },
    ],
    description: `
      <p>Образовательная платформа для тестирования студентов: преподаватель создаёт тесты, студенты проходят их, а система считает результаты и строит аналитику.</p>
      <p>Ядро — статистический анализ ответов и гибкие рекомендации на основе медианных значений: по результатам подбираются темы, которые стоит подтянуть.</p>
      <p class="modal-stack">Стек: C#, .NET 5, HTML, CSS, JS, PostgreSQL</p>
      <ul>
        <li>Система статистического анализа и гибких рекомендаций на основе медианных значений</li>
        <li>Многоролевой доступ: студент, преподаватель, администратор</li>
        <li>Админка и удобная система создания тестов</li>
      </ul>
    `,
  },
};

const projectModal = document.getElementById("projectModal");
const carouselTrack = document.getElementById("carouselTrack");
const carouselDots = document.getElementById("carouselDots");
const carouselCounter = document.getElementById("carouselCounter");
const carouselViewport = projectModal.querySelector(".carousel-viewport");
const carouselPrev = document.getElementById("carouselPrev");
const carouselNext = document.getElementById("carouselNext");
let slideIndex = 0;
let slideCount = 0;
let lastTrigger = null;

function updateCarousel() {
  carouselTrack.style.transform = `translateX(${-slideIndex * 100}%)`;
  Array.from(carouselDots.children).forEach((dot, i) =>
    dot.classList.toggle("active", i === slideIndex)
  );
  carouselCounter.textContent = `${slideIndex + 1} / ${slideCount}`;
}

function goToSlide(index) {
  slideIndex = (index + slideCount) % slideCount;
  updateCarousel();
}

function buildCarousel(images, alt) {
  carouselTrack.innerHTML = "";
  carouselDots.innerHTML = "";
  slideCount = images.length;
  slideIndex = 0;

  images.forEach((item, i) => {
    const picture = document.createElement("picture");

    const source = document.createElement("source");
    source.type = "image/webp";
    source.srcset = item.webp;
    source.sizes = "(max-width: 640px) 92vw, 848px";
    picture.appendChild(source);

    const img = document.createElement("img");
    img.src = item.src;
    img.alt = `${alt} — изображение ${i + 1}`;
    img.width = item.width;
    img.height = item.height;
    img.loading = i === 0 ? "eager" : "lazy";
    img.decoding = "async";
    picture.appendChild(img);

    carouselTrack.appendChild(picture);

    const dot = document.createElement("button");
    dot.type = "button";
    dot.setAttribute("aria-label", `Изображение ${i + 1}`);
    dot.addEventListener("click", () => goToSlide(i));
    carouselDots.appendChild(dot);
  });

  // для одного изображения стрелки и точки не нужны
  const single = slideCount < 2;
  carouselDots.style.display = single ? "none" : "";
  carouselPrev.style.display = single ? "none" : "";
  carouselNext.style.display = single ? "none" : "";

  updateCarousel();
}

function openProjectModal(id) {
  const data = projectDetails[id];
  if (!data) return;

  document.getElementById("modalTitle").textContent = data.title;
  document.getElementById("modalCat").textContent = data.category;
  document.getElementById("modalTags").innerHTML = data.tags
    .map((t) => `<span>${t}</span>`)
    .join("");
  document.getElementById("modalDesc").innerHTML = data.description;
  buildCarousel(data.images, data.title);

  projectModal.classList.add("open");
  projectModal.setAttribute("aria-hidden", "false");
  document.body.classList.add("modal-open");
  projectModal.querySelector(".modal-close").focus();
}

function closeProjectModal() {
  projectModal.classList.remove("open");
  projectModal.setAttribute("aria-hidden", "true");
  document.body.classList.remove("modal-open");
  if (lastTrigger) lastTrigger.focus();
}

document.querySelectorAll(".project-more").forEach((btn) => {
  btn.addEventListener("click", () => {
    lastTrigger = btn;
    openProjectModal(btn.dataset.project);
  });
});

projectModal.addEventListener("click", (e) => {
  if (e.target.hasAttribute("data-close")) closeProjectModal();
});

carouselPrev.addEventListener("click", () => goToSlide(slideIndex - 1));
carouselNext.addEventListener("click", () => goToSlide(slideIndex + 1));

document.addEventListener("keydown", (e) => {
  if (!projectModal.classList.contains("open")) return;
  if (e.key === "Escape") closeProjectModal();
  else if (e.key === "ArrowLeft") goToSlide(slideIndex - 1);
  else if (e.key === "ArrowRight") goToSlide(slideIndex + 1);
});

// свайп по карусели на тач-устройствах
let swipeStartX = null;
carouselViewport.addEventListener("touchstart", (e) => {
  swipeStartX = e.touches[0].clientX;
}, { passive: true });
carouselViewport.addEventListener("touchend", (e) => {
  if (swipeStartX === null) return;
  const dx = e.changedTouches[0].clientX - swipeStartX;
  if (Math.abs(dx) > 40) goToSlide(slideIndex + (dx < 0 ? 1 : -1));
  swipeStartX = null;
}, { passive: true });
