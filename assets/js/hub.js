/* ============================================================
   HUB — scroll reveal, sticky nav, project filtering
   ============================================================ */
(function () {
  // reveal on scroll
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } });
  }, { threshold: 0.14, rootMargin: "0px 0px -8% 0px" });
  document.querySelectorAll("[data-reveal]").forEach((el) => io.observe(el));

  // sticky nav state
  const nav = document.querySelector(".nav");
  const onScroll = () => nav && nav.classList.toggle("scrolled", window.scrollY > 12);
  onScroll(); window.addEventListener("scroll", onScroll, { passive: true });

  // project filters
  const chips = document.querySelectorAll(".chip[data-filter]");
  const cards = document.querySelectorAll(".pcard[data-cat]");
  chips.forEach((c) => c.addEventListener("click", () => {
    chips.forEach((x) => x.classList.remove("on"));
    c.classList.add("on");
    const f = c.getAttribute("data-filter");
    cards.forEach((card) => {
      const show = f === "all" || card.getAttribute("data-cat").includes(f);
      card.classList.toggle("hide", !show);
    });
  }));

  // smooth-scroll for in-page nav links
  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener("click", (e) => {
      const id = a.getAttribute("href");
      if (id.length > 1) { const t = document.querySelector(id);
        if (t) { e.preventDefault(); t.scrollIntoView({ behavior: "smooth", block: "start" }); } }
    });
  });
})();
