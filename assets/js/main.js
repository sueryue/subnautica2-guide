/* ============================================================
   Subnautica 2 Guide — Shared behaviour
   ============================================================ */
(function () {
  "use strict";

  /* ---------- Theme (light / dark / system) ---------- */
  var THEME_KEY = "s2-theme";
  var themeToggle = document.getElementById("themeToggle");
  var mql = window.matchMedia("(prefers-color-scheme: light)");

  function systemTheme() { return mql.matches ? "light" : "dark"; }
  function applyTheme(t) {
    var eff = t === "system" ? systemTheme() : t;
    document.documentElement.setAttribute("data-theme", eff);
    if (themeToggle) {
      themeToggle.dataset.state = t;
      themeToggle.setAttribute("aria-label", "Theme: " + t);
      themeToggle.title = "Theme: " + t + " (click to change)";
    }
  }
  function initTheme() {
    var saved = localStorage.getItem(THEME_KEY) || "system";
    applyTheme(saved);
    if (themeToggle) {
      themeToggle.addEventListener("click", function () {
        var order = ["system", "light", "dark"];
        var cur = localStorage.getItem(THEME_KEY) || "system";
        var next = order[(order.indexOf(cur) + 1) % order.length];
        localStorage.setItem(THEME_KEY, next);
        applyTheme(next);
      });
    }
    mql.addEventListener("change", function () {
      if ((localStorage.getItem(THEME_KEY) || "system") === "system") applyTheme("system");
    });
  }

  /* ---------- Mobile menu ---------- */
  function initNav() {
    var burger = document.getElementById("navBurger");
    var menu = document.getElementById("mobileMenu");
    if (burger && menu) {
      burger.addEventListener("click", function () { menu.classList.toggle("open"); });
      menu.querySelectorAll("a").forEach(function (a) {
        a.addEventListener("click", function () { menu.classList.remove("open"); });
      });
    }
    var navMore = document.getElementById("navMore");
    var navMoreBtn = document.getElementById("navMoreBtn");
    if (navMore && navMoreBtn) {
      navMoreBtn.addEventListener("click", function (e) {
        e.stopPropagation();
        var open = navMore.classList.toggle("open");
        navMoreBtn.setAttribute("aria-expanded", open ? "true" : "false");
      });
      document.addEventListener("click", function (e) {
        if (!navMore.contains(e.target)) {
          navMore.classList.remove("open");
          navMoreBtn.setAttribute("aria-expanded", "false");
        }
      });
      navMore.querySelectorAll(".nav-more-panel a").forEach(function (a) {
        a.addEventListener("click", function () {
          navMore.classList.remove("open");
          navMoreBtn.setAttribute("aria-expanded", "false");
        });
      });
    }
  }

  /* ---------- Scroll reveal ---------- */
  function initReveal() {
    var els = document.querySelectorAll(".reveal");
    if (!("IntersectionObserver" in window) || !els.length) {
      els.forEach(function (e) { e.classList.add("in"); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); }
      });
    }, { threshold: 0.12 });
    els.forEach(function (e) { io.observe(e); });
  }

  /* ---------- Bubble canvas (hero) ---------- */
  function initBubbles() {
    var canvas = document.getElementById("bubbles");
    if (!canvas || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    var ctx = canvas.getContext("2d");
    var bubbles = [];
    function resize() { canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight; }
    function spawn() {
      return {
        x: Math.random() * canvas.width,
        y: canvas.height + 20,
        r: 1.5 + Math.random() * 3.5,
        s: 0.4 + Math.random() * 1.1,
        a: 0.15 + Math.random() * 0.35,
        drift: (Math.random() - 0.5) * 0.4
      };
    }
    function loop() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      var cs = getComputedStyle(document.documentElement);
      var accent = cs.getPropertyValue("--accent").trim() || "#2de2e6";
      bubbles.forEach(function (b) {
        b.y -= b.s; b.x += b.drift;
        if (b.y < -20) Object.assign(b, spawn());
        ctx.beginPath();
        ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
        ctx.fillStyle = accent; ctx.globalAlpha = b.a; ctx.fill(); ctx.globalAlpha = 1;
      });
      requestAnimationFrame(loop);
    }
    resize();
    window.addEventListener("resize", resize);
    for (var i = 0; i < 46; i++) { var b = spawn(); b.y = Math.random() * canvas.height; bubbles.push(b); }
    loop();
  }

  /* ---------- Magnetic buttons ---------- */
  function initMagnetic() {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    document.querySelectorAll("[data-magnetic]").forEach(function (el) {
      el.addEventListener("mousemove", function (e) {
        var r = el.getBoundingClientRect();
        var mx = e.clientX - r.left - r.width / 2;
        var my = e.clientY - r.top - r.height / 2;
        el.style.transform = "translate(" + mx * 0.18 + "px," + my * 0.28 + "px)";
      });
      el.addEventListener("mouseleave", function () { el.style.transform = ""; });
    });
  }

  /* ---------- Render helpers ---------- */
  function dangerLabel(d) {
    return d === "safe" ? "Safe" : d === "caution" ? "Caution" : d === "extreme" ? "Extreme" : "Danger";
  }
  function tierMeta(t) {
    switch (t) {
      case "titan": return { cls: "leviathan", label: "Titan" };
      case "leviathan": return { cls: "danger", label: "Leviathan" };
      case "alpha": return { cls: "danger", label: "Alpha Predator" };
      case "predator": return { cls: "caution", label: "Predator" };
      case "carnivore": return { cls: "caution", label: "Carnivore" };
      case "herbivore": return { cls: "safe", label: "Herbivore" };
      case "gentle": return { cls: "safe", label: "Gentle" };
      case "parasite": return { cls: "info", label: "Parasite" };
      default: return { cls: "info", label: t };
    }
  }
  function badge(type, label) { return '<span class="badge ' + type + '">' + label + "</span> "; }
  function tbd() { return '<p class="note-tbd">⚠ Subnautica 2 details to be confirmed</p>'; }

  var templates = {
    biome: function (b) {
      return '<article class="card item-card reveal">' +
        '<div class="thumb">' + b.icon + '<span class="th-name">' + b.depth + "</span></div>" +
        badge(b.danger, dangerLabel(b.danger)) +
        "<h3>" + b.name + "</h3>" +
        '<p class="desc">' + b.desc + "</p>" +
        '<dl class="spec"><dt>Depth</dt><dd>' + b.depth + "</dd>" +
        "<dt>Resources</dt><dd>" + b.resources.join(", ") + "</dd>" +
        (b.creatures && b.creatures.length ? "<dt>Creatures</dt><dd>" + b.creatures.join(", ") + "</dd>" : "") +
        "</dl>" + (b.tbd ? tbd() : "") +
        (b.advice ? '<p class="biome-advice">💡 ' + b.advice + "</p>" : "") +
        "</article>";
    },
    creature: function (c) {
      var m = tierMeta(c.tier);
      var beh = c.hostile ? badge("danger", "Hostile") : badge("safe", "Passive");
      return '<article class="card item-card reveal">' +
        '<div class="thumb">' + c.icon + "</div>" +
        badge(m.cls, m.label) + beh +
        "<h3>" + c.name + "</h3>" +
        '<p class="desc">' + c.desc + "</p>" +
        '<dl class="spec"><dt>Tier</dt><dd>' + m.label + "</dd>" +
        "<dt>Habitat</dt><dd>" + c.biome + "</dd></dl>" +
        (c.tbd ? tbd() : "") + "</article>";
    },
    crafting: function (r) {
      var ings = r.ingredients.map(function (i) {
        return '<span class="ing">' + i.name + (i.qty > 1 ? " ×" + i.qty : "") + "</span>";
      }).join("");
      return '<article class="card item-card reveal">' +
        '<div class="thumb">' + r.icon + "</div>" +
        badge("info", r.station) +
        "<h3>" + r.name + "</h3>" +
        '<p class="desc">' + r.desc + "</p>" +
        '<div class="ings">' + ings + "</div>" +
        (r.source ? (r.source.indexOf("http") === 0
          ? '<a class="src-link" href="' + r.source + '" target="_blank" rel="noopener">✓ Verified source ↗</a>'
          : '<span class="src-note">Source: ' + r.source + '</span>') : "") +
        (r.tbd ? tbd() : "") + "</article>";
    },
    base: function (m) {
      return '<article class="card item-card reveal">' +
        '<div class="thumb">' + m.icon + "</div>" +
        badge("info", m.category) +
        "<h3>" + m.name + "</h3>" +
        '<p class="desc">' + m.desc + "</p>" +
        (m.tbd ? tbd() : "") + "</article>";
    },
    tip: function (t) {
      var cat = { survival: "Survival", building: "Base & Gear", exploration: "Exploration", combat: "Threats", vehicles: "Vehicles" }[t.category] || t.category;
      return '<article class="card item-card reveal">' +
        '<div class="thumb">' + t.icon + '<span class="th-name">' + cat + "</span></div>" +
        "<h3>" + t.title + "</h3>" +
        '<p class="desc">' + t.body + "</p></article>";
    },
    resource: function (r) {
      var stars = "★★★★★".slice(0, r.rarity) + "☆☆☆☆☆".slice(0, 5 - r.rarity);
      var g = r.group === "mineral" ? "Mineral" : r.group === "refined" ? "Refined" : "Biological";
      var rare = r.rarity
        ? '<div class="rarity">' + stars + "</div>"
        : '<div class="rarity">' + badge("caution", "Gated / late") + "</div>";
      return '<article class="card item-card reveal">' +
        '<div class="thumb">' + r.icon + '<span class="th-name">' + g + "</span></div>" +
        rare +
        "<h3>" + r.name + "</h3>" +
        '<p class="desc">' + r.uses + "</p>" +
        '<dl class="spec"><dt>Where</dt><dd>' + r.locations + "</dd></dl></article>";
    },
    adaptation: function (a) {
      var typeBadge = a.type === "DNA" ? badge("leviathan", "DNA Adaptation") : badge("info", "Biomod");
      return '<article class="card item-card reveal">' +
        '<div class="thumb">' + a.icon + "</div>" +
        typeBadge +
        "<h3>" + a.name + "</h3>" +
        '<p class="desc">' + a.effect + "</p>" +
        '<dl class="spec"><dt>Unlock</dt><dd>' + a.how + "</dd></dl></article>";
    }
  };

  /* Generic filterable list */
  function setupList(opts) {
    var data = opts.data;
    var wrap = document.getElementById(opts.root);
    if (!wrap) return;
    var listEl = wrap.querySelector("#list");
    var chips = wrap.querySelectorAll(".chip[data-filter]");
    var search = wrap.querySelector(".search input");
    var state = { q: "", filters: {} };

    function matches(item) {
      if (state.q) {
        var hay = (item.name + " " + item.desc + " " + (item.biome || "") + " " +
          (item.resources || []).join(" ") + " " + (item.creatures || []).join(" ")).toLowerCase();
        if (hay.indexOf(state.q.toLowerCase()) === -1) return false;
      }
      for (var key in state.filters) {
        var want = state.filters[key];
        if (want && item[key] !== want) return false;
      }
      return true;
    }
    function render() {
      var html = data.filter(matches).map(opts.tpl).join("");
      listEl.innerHTML = html || '<p class="lead" style="grid-column:1/-1">No results. Try another filter.</p>';
      initReveal();
    }
    chips.forEach(function (chip) {
      chip.addEventListener("click", function () {
        var f = chip.getAttribute("data-filter").split(":");
        var key = f[0], val = f[1];
        if (key === "__all") {
          state.filters = {};
          chips.forEach(function (c) { c.classList.remove("active"); });
          chip.classList.add("active");
          render(); return;
        }
        chips.forEach(function (c) {
          if (c.getAttribute("data-filter").split(":")[0] === key) c.classList.remove("active");
        });
        if (state.filters[key] === val) { delete state.filters[key]; }
        else { state.filters[key] = val; chip.classList.add("active"); }
        render();
      });
    });
    if (search) search.addEventListener("input", function () { state.q = search.value; render(); });
    render();
  }

  function renderVehicles() {
    var root = document.getElementById("vehicleList");
    if (!root) return;
    root.innerHTML = S2DATA.vehicles.map(function (v) {
      var statusBadge = v.status === "planned"
        ? '<span class="badge caution">Planned</span>'
        : '<span class="badge safe">Available</span>';
      var mods = v.modules.length
        ? v.modules.map(function (m) {
            return '<div class="card" style="padding:1rem"><div style="font-size:1.5rem">' + m.icon +
              '</div><h4 style="margin:.4rem 0 .2rem;font-size:.98rem">' + m.name + "</h4>" +
              '<p class="desc" style="font-size:.85rem">' + m.desc + "</p></div>";
          }).join("")
        : '<p class="desc">Modules: TBD (confirmed for a post-launch update).</p>';
      return '<article class="card reveal" style="padding:0;overflow:hidden">' +
        '<div class="thumb" style="height:160px;border-radius:0;font-size:3.4rem">' + v.icon +
        '<span class="th-name">' + v.depth + "</span></div>" +
        '<div style="padding:1.6rem">' +
        statusBadge + "<h3 style='margin-top:.6rem'>" + v.name + "</h3>" +
        '<p class="desc">' + v.desc + "</p>" +
        (v.modules.length ? '<p style="margin:.6rem 0 .3rem;color:var(--text-dim);font-size:.85rem">Modules / variants</p>' +
          '<div class="grid grid-3" style="gap:.8rem">' + mods + "</div>" : mods) +
        (v.tbd ? tbd() : "") + "</div></article>";
    }).join("");
    initReveal();
  }

  function renderRoute() {
    var root = document.getElementById("routeList");
    if (!root) return;
    root.innerHTML = S2DATA.earlyRoute.map(function (s) {
      return '<div class="tl-item"><div class="when">Step ' + s.step + '</div><h3>' + s.title +
        '</h3><p>' + s.detail + "</p></div>";
    }).join("");
  }

  /* ---------- Walkthrough & progression ---------- */
  function renderWalkthrough() {
    var root = document.getElementById("walkthroughRoot");
    if (root && S2DATA.walkthrough) {
      root.innerHTML = S2DATA.walkthrough.map(function (ch, i) {
        var pois = ch.pois.map(function (p) {
          return "<li><strong>" + p.name + "</strong><span>" + p.note + "</span></li>";
        }).join("");
        var objs = ch.objectives.map(function (o) { return "<li>" + o + "</li>"; }).join("");
        var unlocks = ch.unlocks.map(function (u) {
          return '<span class="chip-static">' + u + "</span>";
        }).join("");
        return '<article class="wf-chapter reveal" data-phase="' + ch.phase + '">' +
          '<div class="wf-num">' + (i + 1) + "</div>" +
          '<div class="wf-body">' +
            '<div class="wf-tag">' + ch.phase + " · " + ch.gw + "</div>" +
            "<h3>" + ch.title + "</h3>" +
            '<p class="desc">' + ch.summary + "</p>" +
            '<div class="wf-cols">' +
              '<div><h4>📍 Points of interest</h4><ul class="wf-pois">' + pois + "</ul></div>" +
              '<div><h4>🎯 Objectives</h4><ul class="wf-objs">' + objs + "</ul></div>" +
            "</div>" +
            '<div class="wf-unlocks"><span class="wf-unlock-label">Unlocks</span>' + unlocks + "</div>" +
          "</div></article>";
      }).join("");
    }

    var bu = document.getElementById("biomeUnlockRoot");
    if (bu && S2DATA.biomeUnlocks) {
      bu.innerHTML = S2DATA.biomeUnlocks.map(function (b) {
        return '<div class="wf-phase reveal"><span class="wf-phase-tag">' + b.phase + "</span><p>" + b.biomes + "</p></div>";
      }).join("");
    }

    var vp = document.getElementById("vehicleRoot");
    if (vp && S2DATA.vehicleProgression) {
      vp.innerHTML = S2DATA.vehicleProgression.map(function (v, i) {
        return '<div class="wf-veh reveal">' +
          '<div class="wf-veh-step">Step ' + (i + 1) + "</div>" +
          "<h4>" + v.step + "</h4>" +
          '<p class="desc">' + v.from + "</p>" +
          '<div class="wf-recipe">' + v.recipe + "</div>" +
          (v.source ? (v.source.indexOf("http") === 0
            ? '<a class="src-link" href="' + v.source + '" target="_blank" rel="noopener">✓ Verified source ↗</a>'
            : '<span class="src-note">Source: ' + v.source + '</span>') : "") +
          "</div>";
      }).join("");
    }
    initReveal();
  }

  /* ---------- Media gallery + lightbox ---------- */
  function renderMedia() {
    var grid = document.getElementById("mediaGrid");
    if (!grid || !S2DATA.media) return;
    var imgs = S2DATA.media.filter(function (m) { return m.type === "image"; });
    grid.innerHTML = imgs.map(function (m) {
      return '<button class="gallery-item reveal" data-src="' + m.src + '" data-title="' + m.title +
        '" data-biome="' + m.biome + '" data-cap="' + m.caption + '">' +
        '<img src="' + m.src + '" alt="' + m.title + '" loading="lazy" />' +
        '<span class="gallery-cap"><strong>' + m.title + '</strong><em>' + m.biome + '</em></span>' +
        '</button>';
    }).join("");
    initReveal();
    var lb = document.getElementById("lightbox");
    if (!lb) return;
    grid.querySelectorAll(".gallery-item").forEach(function (btn) {
      btn.addEventListener("click", function () {
        document.getElementById("lbImg").src = btn.dataset.src;
        document.getElementById("lbTitle").textContent = btn.dataset.title;
        document.getElementById("lbBiome").textContent = btn.dataset.biome;
        document.getElementById("lbCap").textContent = btn.dataset.cap;
        lb.classList.add("open");
      });
    });
    lb.addEventListener("click", function (e) {
      if (e.target === lb || e.target.id === "lbClose") lb.classList.remove("open");
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") lb.classList.remove("open");
    });
  }

  /* ---------- YouTube videos (official channel) ---------- */
  function renderVideos() {
    var grid = document.getElementById("videoGrid");
    if (!grid || !S2DATA.videos) return;
    grid.innerHTML = S2DATA.videos.map(function (v) {
      var isPlaylist = !!v.list;
      var ytId = isPlaylist ? "videoseries?list=" + v.list : v.id;
      var embed = "https://www.youtube-nocookie.com/embed/" + ytId +
        "?rel=0&modestbranding=1&playsinline=1";
      var watchUrl = isPlaylist
        ? "https://www.youtube.com/playlist?list=" + v.list
        : "https://www.youtube.com/watch?v=" + v.id;
      return '<article class="video-card reveal">' +
        '<div class="video-frame"><iframe src="' + embed + '" title="' + v.title +
        '" loading="lazy" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe></div>' +
        '<div class="video-meta"><span class="video-topic">' + v.topic + '</span>' +
        '<h3>' + v.title + '</h3>' +
        '<p class="video-desc">' + v.desc + '</p>' +
        '<p class="video-sub">' + v.channel + ' · ' + v.views + ' views · ' + v.date + '</p>' +
        '<a class="video-link" href="' + watchUrl + '" target="_blank" rel="noopener">Watch on YouTube ↗</a>' +
        '</div></article>';
    }).join("");
    initReveal();
  }

  /* ---------- Boot ---------- */
  function boot() {
    initTheme();
    initNav();
    initReveal();
    initBubbles();
    initMagnetic();
    renderRoute();

    var page = document.body.dataset.page;
    if (page === "biomes") setupList({ root: "biomesRoot", data: S2DATA.biomes, tpl: templates.biome });
    else if (page === "creatures") setupList({ root: "creaturesRoot", data: S2DATA.creatures, tpl: templates.creature });
    else if (page === "crafting") setupList({ root: "craftingRoot", data: S2DATA.crafting, tpl: templates.crafting });
    else if (page === "base") setupList({ root: "baseRoot", data: S2DATA.baseModules, tpl: templates.base });
    else if (page === "vehicles") renderVehicles();
    else if (page === "tips") setupList({ root: "tipsRoot", data: S2DATA.tips, tpl: templates.tip });
    else if (page === "resources") setupList({ root: "resourcesRoot", data: S2DATA.resources, tpl: templates.resource });
    else if (page === "adaptations") setupList({ root: "adaptationsRoot", data: S2DATA.adaptations, tpl: templates.adaptation });
    else if (page === "media") { renderVideos(); renderMedia(); }
    else if (page === "walkthrough") renderWalkthrough();
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
