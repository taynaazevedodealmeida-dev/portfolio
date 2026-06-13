/* ============================================================
   CINEMATIC DEMO ENGINE
   Auto-plays a sequence of .scene elements with a progress rail,
   transport controls, pause/resume, keyboard + phase sync.
   Auto-inits on any element with class .stage (one per page).
   ============================================================ */
(function () {
  const ICON = {
    play: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>',
    pause:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M6 5h4v14H6zM14 5h4v14h-4z"/></svg>',
    replay:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 1 0 3-6.7"/><path d="M3 4v4h4"/></svg>'
  };
  const reduce = window.matchMedia("(prefers-reduced-motion:reduce)").matches;

  class Demo {
    constructor(root) {
      this.stage = root;
      this.scenes = Array.from(root.querySelectorAll(".scene"));
      this.n = this.scenes.length;
      this.splash = root.querySelector(".splash");
      this.phaseChips = Array.from(document.querySelectorAll(".phase"));
      this.cur = 0; this.playing = false; this.elapsed = 0; this.timer = null;

      this.rail = document.getElementById("rail");
      this.cstep = document.getElementById("cstep");
      this.playBtn = document.querySelector("[data-play]");
      this.buildRail();
      this.wire();
      this.show(0, false);
    }

    buildRail() {
      if (!this.rail) return;
      this.segs = this.scenes.map((_, i) => {
        const s = document.createElement("div");
        s.className = "seg"; s.innerHTML = "<i></i>";
        s.addEventListener("click", () => this.jump(i));
        this.rail.appendChild(s);
        return s;
      });
    }

    wire() {
      const q = (s) => document.querySelector(s);
      q("[data-start]") && q("[data-start]").addEventListener("click", () => this.begin(false));
      q("[data-skip]") && q("[data-skip]").addEventListener("click", () => this.begin(true));
      this.playBtn && this.playBtn.addEventListener("click", () => this.toggle());
      q("[data-next]") && q("[data-next]").addEventListener("click", () => this.next(true));
      q("[data-prev]") && q("[data-prev]").addEventListener("click", () => this.prev());
      q("[data-restart]") && q("[data-restart]").addEventListener("click", () => this.restart());

      document.addEventListener("keydown", (e) => {
        if (e.key === " ") { e.preventDefault(); this.toggle(); }
        else if (e.key === "ArrowRight") this.next(true);
        else if (e.key === "ArrowLeft") this.prev();
        else if (e.key.toLowerCase() === "r") this.restart();
        else if (e.key === "Escape") { const b = document.querySelector(".dbar .back"); if (b) b.click(); }
      });
      document.addEventListener("visibilitychange", () => { if (document.hidden && this.playing) this.pause(); });
    }

    begin(toEnd) {
      if (this.splash) this.splash.classList.add("hide");
      if (toEnd) { this.playing = false; this.show(this.n - 1, false); this.setIcon(); }
      else if (reduce) { this.playing = false; this.show(0, false); this.setIcon(); }
      else { this.play(); }
    }

    show(i, autoTick) {
      this.cur = Math.max(0, Math.min(i, this.n - 1));
      this.elapsed = 0;
      clearTimeout(this.timer);

      this.scenes.forEach((s, k) => s.classList.toggle("is-active", k === this.cur));

      // rail
      if (this.segs) this.segs.forEach((s, k) => {
        s.classList.remove("cur", "done");
        const bar = s.querySelector("i");
        bar.style.transition = "none"; bar.style.width = k < this.cur ? "100%" : "0%";
        if (k < this.cur) s.classList.add("done");
      });

      // phases
      if (this.phaseChips.length) {
        const ph = this.scenes[this.cur].dataset.phase;
        const pi = ph != null ? parseInt(ph, 10) : -1;
        this.phaseChips.forEach((c, k) => {
          c.classList.toggle("on", k === pi);
          c.classList.toggle("done", pi > -1 && k < pi);
        });
      }

      if (this.cstep) this.cstep.textContent = (this.cur + 1) + " / " + this.n;
      if (autoTick && this.playing) this.startTick();
      this.setIcon();
    }

    startTick() {
      const scene = this.scenes[this.cur];
      const dur = parseInt(scene.dataset.dur || "5200", 10);
      const remain = Math.max(400, dur - this.elapsed);
      // animate current segment fill
      const seg = this.segs && this.segs[this.cur];
      if (seg) {
        seg.classList.add("cur");
        const bar = seg.querySelector("i");
        const startW = dur > 0 ? (this.elapsed / dur) * 100 : 0;
        bar.style.transition = "none"; bar.style.width = startW + "%";
        // next frame -> animate to 100 over remain
        requestAnimationFrame(() => requestAnimationFrame(() => {
          bar.style.transition = "width " + remain + "ms linear";
          bar.style.width = "100%";
        }));
      }
      this.tickStart = performance.now();
      this.timer = setTimeout(() => {
        if (this.cur < this.n - 1) { this.show(this.cur + 1, true); }
        else { this.playing = false; this.setIcon(); }   // stop at end
      }, remain);
    }

    play() {
      if (this.cur >= this.n - 1) { this.restart(); return; }
      this.playing = true;
      if (this.splash) this.splash.classList.add("hide");
      this.startTick(); this.setIcon();
    }
    pause() {
      this.playing = false;
      clearTimeout(this.timer);
      this.elapsed += performance.now() - (this.tickStart || performance.now());
      const seg = this.segs && this.segs[this.cur];
      if (seg) { const bar = seg.querySelector("i"); const w = getComputedStyle(bar).width;
        bar.style.transition = "none"; bar.style.width = w; }
      this.setIcon();
    }
    toggle() { this.playing ? this.pause() : this.play(); }
    next(user) { if (this.cur < this.n - 1) this.show(this.cur + 1, true); else { this.playing = false; this.setIcon(); } }
    prev() { this.show(Math.max(0, this.cur - 1), true); }
    jump(i) { this.show(i, true); }
    restart() { this.playing = true; if (this.splash) this.splash.classList.add("hide"); this.show(0, true); }

    setIcon() {
      if (!this.playBtn) return;
      this.playBtn.innerHTML = this.playing ? ICON.pause : (this.cur >= this.n - 1 ? ICON.replay : ICON.play);
      this.playBtn.setAttribute("aria-label", this.playing ? "Pause" : "Play");
    }
  }

  function init() {
    const stage = document.querySelector(".stage");
    if (stage && stage.querySelector(".scene")) window.__demo = new Demo(stage);
  }
  document.readyState === "loading"
    ? document.addEventListener("DOMContentLoaded", init)
    : init();
})();
