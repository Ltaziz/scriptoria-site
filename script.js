document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener("click", (event) => {
    const target = document.querySelector(link.getAttribute("href"));
    if (!target) return;
    event.preventDefault();
    target.scrollIntoView({ behavior: "smooth", block: "start" });
    navMenu?.classList.remove("is-open");
    navToggle?.setAttribute("aria-expanded", "false");
  });
});

const revealItems = document.querySelectorAll(".reveal");
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-visible");
      revealObserver.unobserve(entry.target);
    });
  },
  { threshold: 0.14, rootMargin: "0px 0px -40px 0px" }
);

revealItems.forEach((item) => revealObserver.observe(item));

const tabs = document.querySelectorAll(".tab-btn");
const panels = document.querySelectorAll(".tab-panel");

tabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    const targetId = tab.dataset.tab;

    tabs.forEach((item) => {
      item.classList.remove("active");
      item.setAttribute("aria-selected", "false");
    });

    panels.forEach((panel) => panel.classList.remove("active"));

    tab.classList.add("active");
    tab.setAttribute("aria-selected", "true");
    document.getElementById(targetId)?.classList.add("active");
  });
});

const navToggle = document.querySelector(".nav-toggle");
const navMenu = document.querySelector(".nav-menu");

navToggle?.addEventListener("click", () => {
  const isOpen = navMenu?.classList.toggle("is-open");
  navToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
});

const newsSlider = document.querySelector("[data-news-slider]");

if (newsSlider) {
  const items = [...newsSlider.querySelectorAll(".news-item")];
  const dots = [...newsSlider.querySelectorAll(".news-dots button")];
  const prevButton = newsSlider.querySelector(".news-arrow-right");
  const nextButton = newsSlider.querySelector(".news-arrow-left");
  let currentIndex = 0;

  const renderNews = (index) => {
    items.forEach((item, itemIndex) => {
      item.classList.toggle("active", itemIndex === index);
    });

    dots.forEach((dot, dotIndex) => {
      dot.classList.toggle("active", dotIndex === index);
    });
  };

  prevButton?.addEventListener("click", () => {
    currentIndex = (currentIndex - 1 + items.length) % items.length;
    renderNews(currentIndex);
  });

  nextButton?.addEventListener("click", () => {
    currentIndex = (currentIndex + 1) % items.length;
    renderNews(currentIndex);
  });

  dots.forEach((dot, dotIndex) => {
    dot.addEventListener("click", () => {
      currentIndex = dotIndex;
      renderNews(currentIndex);
    });
  });

  renderNews(currentIndex);
}
