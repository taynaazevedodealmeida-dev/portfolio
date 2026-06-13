/* ============================================================
   i18n — bilingual toggle (PT / EN), persistent across pages
   Markup convention:
     <span data-pt>Olá</span><span data-en>Hello</span>
   Attribute swap (placeholder/aria/title):
     data-pt-attr="placeholder:Buscar|aria-label:Buscar"
     data-en-attr="placeholder:Search|aria-label:Search"
   Page title: <body data-title-pt="..." data-title-en="...">
   ============================================================ */
(function () {
  const KEY = "tayna-lang";
  const valid = ["pt", "en"];

  function getLang() {
    const saved = localStorage.getItem(KEY);
    if (valid.includes(saved)) return saved;
    const nav = (navigator.language || "pt").slice(0, 2).toLowerCase();
    return nav === "en" ? "en" : "pt";
  }

  function applyAttrs(lang) {
    document.querySelectorAll("[data-" + lang + "-attr]").forEach((el) => {
      el.getAttribute("data-" + lang + "-attr")
        .split("|")
        .forEach((pair) => {
          const i = pair.indexOf(":");
          if (i > 0) el.setAttribute(pair.slice(0, i).trim(), pair.slice(i + 1));
        });
    });
  }

  function setLang(lang, save) {
    if (!valid.includes(lang)) lang = "pt";
    document.documentElement.setAttribute("lang", lang);
    if (save !== false) localStorage.setItem(KEY, lang);

    // toggle buttons
    document.querySelectorAll("[data-lang-btn]").forEach((b) => {
      b.classList.toggle("on", b.getAttribute("data-lang-btn") === lang);
      b.setAttribute("aria-pressed", b.getAttribute("data-lang-btn") === lang);
    });

    // page title
    const b = document.body;
    const t = b && b.getAttribute("data-title-" + lang);
    if (t) document.title = t;

    applyAttrs(lang);
    document.dispatchEvent(new CustomEvent("langchange", { detail: { lang } }));
  }

  // expose
  window.TaynaI18N = { setLang, getLang };

  // wire toggle clicks
  document.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-lang-btn]");
    if (btn) setLang(btn.getAttribute("data-lang-btn"), true);
  });

  // init ASAP (avoid flash)
  setLang(getLang(), false);
  document.addEventListener("DOMContentLoaded", () => setLang(getLang(), false));
})();
