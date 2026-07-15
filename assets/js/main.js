/* ============================================================
   Subnautica 2 Guide — Shared behaviour
   ============================================================ */
(function () {
  "use strict";

  /* ---------- Site chrome (nav + footer, rendered once) ---------- */
  var ICON_SUN = '<svg class="icon-sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>';
  var ICON_MOON = '<svg class="icon-moon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/></svg>';
  var ICON_BURGER = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M3 6h18M3 12h18M3 18h18"/></svg>';

  // Single source of truth for navigation — grouped dropdowns keep the bar lean.
  var NAV = [
    { label: "World", items: [
      { page: "biomes", href: "biomes.html", label: "Biomes" },
      { page: "creatures", href: "creatures.html", label: "Creatures" },
      { page: "resources", href: "resources.html", label: "Resources" }
    ]},
    { label: "Build", items: [
      { page: "crafting", href: "crafting.html", label: "Crafting" },
      { page: "vehicles", href: "vehicles.html", label: "Vehicles" },
      { page: "base", href: "base-building.html", label: "Base Building" }
    ]},
    { label: "Progress", items: [
      { page: "story", href: "story.html", label: "Story" },
      { page: "adaptations", href: "adaptations.html", label: "Adaptations" },
      { page: "multiplayer", href: "multiplayer.html", label: "Co-op" }
    ]},
    { label: "Guides", items: [
      { page: "walkthrough", href: "walkthrough.html", label: "Walkthrough" },
      { page: "tips", href: "tips.html", label: "Beginner's Guide" },
      { page: "media", href: "media.html", label: "Media" }
    ]},
    { label: "Map", items: [
      { page: "map", href: "map.html", label: "Depth Map" }
    ]}
  ];
  var NAV_STANDALONE = [
    { page: "about", href: "about.html", label: "About" }
  ];

  function navGroupsHtml(page) {
    var groups = NAV.map(function (g) {
      var childActive = g.items.some(function (it) { return it.page === page; });
      var links = g.items.map(function (it) {
        var act = it.page === page ? " active" : "";
        return '<a href="' + it.href + '" class="' + act.trim() + '">' + it.label + "</a>";
      }).join("");
      return '<div class="nav-group">' +
        '<button class="nav-group-btn' + (childActive ? " active" : "") + '" aria-haspopup="true" aria-expanded="false">' +
        g.label + ' <span class="caret">▾</span></button>' +
        '<div class="nav-group-panel">' + links + "</div></div>";
    }).join("");
    var standalone = NAV_STANDALONE.map(function (it) {
      var act = it.page === page ? " active" : "";
      return '<a href="' + it.href + '" class="nav-standalone' + act + '">' + it.label + "</a>";
    }).join("");
    return groups + standalone;
  }

  function mobileMenuHtml(page) {
    var out = '<form class="global-search mobile" role="search" action="javascript:void(0)">' +
      '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/></svg>' +
      '<input type="search" placeholder="Search…" aria-label="Search" /></form>';
    out += '<a href="index.html" class="' + (page === "home" ? "active" : "") + '">Home</a>';
    NAV.forEach(function (g) {
      out += '<div class="mobile-group-label">' + g.label + "</div>";
      g.items.forEach(function (it) {
        out += '<a href="' + it.href + '" class="' + (it.page === page ? "active" : "") + '">' + it.label + "</a>";
      });
    });
    NAV_STANDALONE.forEach(function (it) {
      out += '<a href="' + it.href + '" class="' + (it.page === page ? "active" : "") + '">' + it.label + "</a>";
    });
    return out;
  }

  function footerCol(title, links) {
    var body = links.map(function (l) {
      var p = l.split("|");
      return '<a href="' + p[0] + '">' + p[1] + "</a>";
    }).join("");
    return "<div><h4>" + title + "</h4>" + body + "</div>";
  }

  function renderChrome() {
    var page = document.body.dataset.page;
    var header = document.getElementById("siteHeader");
    if (header) {
      header.innerHTML =
        '<div class="container">' +
          '<a class="brand" href="index.html"><span class="logo">🌊</span> Subnautica 2 <span style="color:var(--accent)">Guide</span></a>' +
          '<nav class="nav-groups">' + navGroupsHtml(page) + "</nav>" +
          '<form class="global-search" role="search" action="javascript:void(0)">' +
            '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/></svg>' +
            '<input type="search" placeholder="Search the guide…" aria-label="Search the guide" />' +
          "</form>" +
          '<div class="nav-actions">' +
            '<button class="theme-toggle" id="themeToggle" aria-label="Toggle theme">' + ICON_SUN + ICON_MOON + "</button>" +
            '<button class="nav-burger" id="navBurger" aria-label="Menu">' + ICON_BURGER + "</button>" +
          "</div>" +
        "</div>" +
        '<div class="search-results" id="searchResults"></div>' +
        '<div class="mobile-menu" id="mobileMenu">' + mobileMenuHtml(page) + "</div>";
    }
    var footer = document.getElementById("siteFooter");
    if (footer) {
      var yr = new Date().getFullYear();
      footer.innerHTML =
        '<div class="container">' +
          '<div><a class="brand" href="index.html" style="margin-bottom:.8rem"><span class="logo">🌊</span> Subnautica 2 <span style="color:var(--accent)">Guide</span></a>' +
          '<p style="color:var(--text-dim);font-size:.9rem;max-width:280px">A fan-made strategy hub. Not affiliated with Unknown Worlds or Krafton.</p></div>' +
          footerCol("Explore", ["biomes.html|Biomes", "creatures.html|Creatures", "resources.html|Resources", "map.html|Depth Map"]) +
          footerCol("Build", ["crafting.html|Crafting", "vehicles.html|Vehicles", "base-building.html|Base Building"]) +
          footerCol("Progress", ["story.html|Story", "adaptations.html|Adaptations", "multiplayer.html|Co-op"]) +
          footerCol("Guides", ["walkthrough.html|Walkthrough", "tips.html|Beginner's Guide", "media.html|Media", "about.html|About &amp; FAQ"]) +
          footerCol("Community", ["#|Discord", "#|Contribute", "#|Report data"]) +
          '<div class="copy"><span>© ' + yr + ' Subnautica 2 Guide. Fan project.</span>' +
          '<span>Data based on the Subnautica universe · TBD items pending official release.</span></div>' +
        "</div>";
    }
  }

  /* ---------- Theme (light / dark / system) ---------- */
  var THEME_KEY = "s2-theme";
  var themeToggle = null; // resolved lazily in initTheme() AFTER renderChrome() injects the button
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
    themeToggle = document.getElementById("themeToggle");
    var saved = localStorage.getItem(THEME_KEY) || "dark";
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

  /* ---------- Mobile menu + grouped dropdowns ---------- */
  function initNav() {
    var burger = document.getElementById("navBurger");
    var menu = document.getElementById("mobileMenu");
    if (burger && menu) {
      burger.addEventListener("click", function () { menu.classList.toggle("open"); });
      menu.querySelectorAll("a").forEach(function (a) {
        a.addEventListener("click", function () { menu.classList.remove("open"); });
      });
    }
    document.querySelectorAll(".nav-group").forEach(function (group) {
      var btn = group.querySelector(".nav-group-btn");
      if (!btn) return;
      btn.addEventListener("click", function (e) {
        e.stopPropagation();
        var open = group.classList.toggle("open");
        btn.setAttribute("aria-expanded", open ? "true" : "false");
      });
      group.querySelectorAll(".nav-group-panel a").forEach(function (a) {
        a.addEventListener("click", function () {
          group.classList.remove("open");
          btn.setAttribute("aria-expanded", "false");
        });
      });
    });
    document.addEventListener("click", function (e) {
      document.querySelectorAll(".nav-group.open").forEach(function (g) {
        if (!g.contains(e.target)) {
          g.classList.remove("open");
          var b = g.querySelector(".nav-group-btn");
          if (b) b.setAttribute("aria-expanded", "false");
        }
      });
    });
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

  /* ============================================================
     EXPERIENCE LAYER — PDA-assistant enhancements (honest data only)
     ============================================================ */
  var AUG = {
    // Biosampler mechanic: scanning yields DNA / Biomod material. Specifics are TBD per species.
    creatureDrops: {
      "world-tree": ["World Tree tissue (story)", "DNA sample"],
      "collector": ["DNA sample", "Biomod material"],
      "shiver": ["DNA sample", "Biomod material"],
      "great-jaw": ["Portable O₂ Generator (scan)", "DNA sample"],
      "deepwing": ["DNA sample", "Biomod material"],
      "marrowbreach": ["DNA sample", "Biomod material"],
      "needler": ["Uranium fangs (harvest)", "DNA sample"],
      "twin-sitaray": ["DNA sample", "Biomod material"],
      "cerathecan": ["DNA sample"],
      "sandspear": ["Chitin (TBD)", "DNA sample"],
      "bullethead": ["DNA sample"],
      "surge-jelly": ["Electric sac (TBD)", "DNA sample"],
      "epicurean": ["DNA sample"],
      "houndgar": ["DNA sample"],
      "hammerhead": ["Raw catch (cook after Digestion)", "DNA sample"],
      "coral-crab": ["DNA sample"],
      "reef-grazer": ["Raw catch (cook after Digestion)", "DNA sample"],
      "hycean": ["Hydrogen sac (TBD)", "DNA sample"],
      "foureye": ["Raw catch (cook after Digestion)", "DNA sample"],
      "tongue-thief": ["Parasite sample", "DNA sample"]
    },
    resourceMeta: {
      "titanium": { r: true }, "quartz": { r: true }, "copper": { r: true }, "salt": { r: true },
      "silver": { r: true }, "lead": { r: true }, "sulfur": { r: true },
      "celestine": { r: true, note: "Deep; respawns slowly" },
      "fiber": { r: true }, "rubber": { r: true }, "raion": { r: true }, "necrolei": { r: true }, "water-slug": { r: true },
      "nutrient": { r: true }, "gold": { r: true }, "lithium": { r: true }, "grease": { r: true },
      "lucifer-rotsac": { r: true }, "creature-enamel": { r: true }, "axum-culture": { r: true },
      "troilite": { r: false, note: "Finite — rely on Metal Farms" }, "strontium": { r: true },
      "triolite": { r: false, note: "Finite" },
      "adv-wiring": { r: true, note: "Crafted" }, "dedicated-core": { r: true, note: "Wreck / craft" },
      "titanium-ingot": { r: true, note: "Smelted" }, "copper-ingot": { r: true, note: "Smelted" },
      "silver-ingot": { r: true, note: "Smelted" }, "plasteel-ingot": { r: true, note: "Smelted" },
      "glass": { r: true, note: "Smelted" }, "copper-wire": { r: true, note: "Crafted" },
      "wiring-kit": { r: true, note: "Crafted" }, "mild-acid": { r: true, note: "Refined" },
      "strong-acid": { r: true, note: "Brewed" }, "coral-tube": { r: true, note: "Harvested" },
      "alien-conduit": { r: true, note: "Wreck / alien" }, "system-chip": { r: true, note: "Wreck / craft" },
      "basic-battery": { r: true, note: "Crafted" }, "enameled-glass": { r: true, note: "Crafted" }
    },
    adaptationBranch: {
      "digestion": "angelcomb", "heat": "angelcomb", "endurance": "angelcomb", "locomotion": "angelcomb",
      "dash": "biolab", "oxygen-control": "biolab", "stealth": "biolab", "sea-skimmer": "biolab",
      "pressure": "lifepod", "biobed": "bunker"
    },
    earlyRoutePhase: { 1: "hour", 2: "hour", 3: "hour", 4: "day", 5: "day", 6: "week", 7: "week", 8: "week" },
    deathCauses: [
      { icon: "🫁", cause: "Out of oxygen", fix: "Build bigger air tanks, surface often, and top up at any powered base corridor. The Air Bladder rockets you up from ≤100 m.", cls: "caution" },
      { icon: "🦈", cause: "Eaten or bitten", fix: "Flares scare most predators; in the Tadpole the hull takes the hit, not you. Never strike wildlife with the Multitool — it makes them hunt you.", cls: "danger" },
      { icon: "⚓", cause: "Crush damage (too deep)", fix: "Unlock the Pressure Adaptation and stack depth modules. Beyond your rated depth you take crush damage every second.", cls: "danger" },
      { icon: "🍽️", cause: "Starved or dehydrated", fix: "Hydration drains faster than hunger. Keep Water Slugs + Filtered Water, and unlock Digestion to safely eat alien life.", cls: "caution" },
      { icon: "🔥", cause: "Burned in heat zones", fix: "Sulfur Pyres and Thermal Vents are lethal without Heat Resistance. Purify an infected Angel Comb before diving in.", cls: "leviathan" },
      { icon: "🦠", cause: "Tongue Thief infection", fix: "This parasite hijacks a host's hunger signal. Scan from range and avoid infested caves until you have the Sonic Resonator.", cls: "info" }
    ],
    coopRoles: [
      { aspect: "Session host", host: "Owns the world save; starts / closes the session.", client: "Joins the host's world; no save ownership." },
      { aspect: "Progression (blueprints, PDA)", host: "Shared — scan one fragment, all unlock.", client: "Shared — same database as the host." },
      { aspect: "Base & storage", host: "Shared habitat; anyone can build.", client: "Builds in the shared habitat too." },
      { aspect: "Respawn point", host: "Biobed in host base.", client: "Respawns at the host's Biobed." },
      { aspect: "Explorer identity", host: "Chosen per session.", client: "Chooses own explorer independently." },
      { aspect: "Save continuity", host: "World persists between sessions.", client: "Solo save is separate; co-op progress lives in host world." }
    ]
  };

  function applyAugment() {
    if (!window.S2DATA) return;
    S2DATA.creatures.forEach(function (c) { if (AUG.creatureDrops[c.id]) c.drops = AUG.creatureDrops[c.id]; });
    S2DATA.resources.forEach(function (r) { var m = AUG.resourceMeta[r.id]; if (m) { r.renewable = m.r; r.renewNote = m.note || ""; } });
    S2DATA.adaptations.forEach(function (a) { if (AUG.adaptationBranch[a.id]) a.branch = AUG.adaptationBranch[a.id]; });
    S2DATA.earlyRoute.forEach(function (s) { if (AUG.earlyRoutePhase[s.step]) s.phase = AUG.earlyRoutePhase[s.step]; });
  }

  /* ---------- Global fuzzy search ---------- */
  var SEARCH_INDEX = [];
  function buildSearchIndex() {
    if (!window.S2DATA) return [];
    var idx = [];
    function add(arr, page, kind) {
      (arr || []).forEach(function (it) {
        var name = it.name || it.title || "";
        var desc = it.desc || it.effect || it.body || it.detail || it.uses || "";
        idx.push({ name: name, desc: String(desc), page: page, kind: kind, id: it.id || slugify(name) });
      });
    }
    add(S2DATA.biomes, "biomes.html", "Biome");
    add(S2DATA.creatures, "creatures.html", "Creature");
    add(S2DATA.resources, "resources.html", "Resource");
    add(S2DATA.crafting, "crafting.html", "Recipe");
    add(S2DATA.vehicles, "vehicles.html", "Vehicle");
    add(S2DATA.baseModules, "base-building.html", "Base part");
    add(S2DATA.tips, "tips.html", "Tip");
    add(S2DATA.adaptations, "adaptations.html", "Adaptation");
    add(S2DATA.walkthrough, "walkthrough.html", "Story");
    return idx;
  }
  function initGlobalSearch() {
    SEARCH_INDEX = buildSearchIndex();
    var forms = document.querySelectorAll(".global-search");
    var panel = document.getElementById("searchResults");
    if (!forms.length || !panel) return;
    function close() { panel.classList.remove("open"); panel.innerHTML = ""; }
    function run(q) {
      q = (q || "").trim().toLowerCase();
      if (q.length < 2) { close(); return; }
      var hits = SEARCH_INDEX.filter(function (e) {
        return e.name.toLowerCase().indexOf(q) !== -1 || e.desc.toLowerCase().indexOf(q) !== -1;
      }).slice(0, 12);
      if (!hits.length) { panel.innerHTML = '<div class="search-empty">No matches for “' + q + '”.</div>'; panel.classList.add("open"); return; }
      panel.innerHTML = hits.map(function (e) {
        return '<a class="search-hit" href="' + e.page + "#" + slugify(e.name) + '">' +
          '<span class="search-kind">' + e.kind + "</span>" +
          '<span class="search-name">' + e.name + "</span>" +
          '<span class="search-desc">' + e.desc.slice(0, 92) + (e.desc.length > 92 ? "…" : "") + "</span></a>";
      }).join("");
      panel.classList.add("open");
    }
    forms.forEach(function (form) {
      var input = form.querySelector("input");
      if (!input) return;
      input.addEventListener("input", function () { run(input.value); });
      input.addEventListener("focus", function () { if (input.value.length >= 2) run(input.value); });
      form.addEventListener("submit", function (e) { e.preventDefault(); });
    });
    document.addEventListener("click", function (e) {
      var inside = false;
      forms.forEach(function (f) { if (f.contains(e.target)) inside = true; });
      if (!inside && !panel.contains(e.target)) close();
    });
  }

  /* ---------- Creature scan progress (PDA scanner) ---------- */
  var SCAN_KEY = "s2-scanned";
  function getScanned() { try { return JSON.parse(localStorage.getItem(SCAN_KEY) || "[]"); } catch (e) { return []; } }
  function setScanned(a) { localStorage.setItem(SCAN_KEY, JSON.stringify(a)); }
  function isScanned(id) { return getScanned().indexOf(id) !== -1; }
  function toggleScanned(id) {
    var a = getScanned(), i = a.indexOf(id);
    if (i === -1) a.push(id); else a.splice(i, 1);
    setScanned(a); return a;
  }
  function renderScanProgress() {
    var el = document.getElementById("scanProgress");
    if (!el || !S2DATA.creatures) return;
    var total = S2DATA.creatures.length;
    var done = getScanned().filter(function (id) { return S2DATA.creatures.some(function (c) { return c.id === id; }); }).length;
    var pct = total ? Math.round((done / total) * 100) : 0;
    el.innerHTML =
      '<div class="scan-bar"><div class="scan-fill" style="width:' + pct + '%"></div></div>' +
      '<div class="scan-meta"><span><strong>' + done + " / " + total + "</strong> creatures scanned</span>" +
      '<button class="btn btn-ghost btn-sm" id="scanReset" type="button">Reset log</button></div>';
    var reset = document.getElementById("scanReset");
    if (reset) reset.addEventListener("click", function () { setScanned([]); syncScanUI(); });
  }
  function syncScanUI() {
    if (!S2DATA.creatures) return;
    S2DATA.creatures.forEach(function (c) {
      var btn = document.querySelector('.scan-btn[data-id="' + c.id + '"]');
      if (!btn) return;
      var on = isScanned(c.id);
      btn.classList.toggle("on", on);
      btn.textContent = on ? "✓ Scanned" : "Mark scanned";
    });
    var el = document.getElementById("scanProgress");
    if (el) renderScanProgress();
  }
  function initScan() {
    document.addEventListener("click", function (e) {
      var t = e.target;
      var b = t && t.closest ? t.closest(".scan-btn") : null;
      if (b && b.dataset.id) { toggleScanned(b.dataset.id); syncScanUI(); }
    });
  }

  /* ---------- Beginner: phased route + death causes ---------- */
  function renderRoutePhases() {
    var map = { hour: document.getElementById("phaseHour"), day: document.getElementById("phaseDay"), week: document.getElementById("phaseWeek") };
    if (!S2DATA.earlyRoute) return;
    S2DATA.earlyRoute.forEach(function (s) {
      var box = map[s.phase];
      if (!box) return;
      box.innerHTML += '<div class="tl-item"><div class="when">Step ' + s.step + "</div><h3>" + s.title + "</h3><p>" + s.detail + "</p></div>";
    });
  }
  function renderDeathCauses() {
    var root = document.getElementById("deathCauses");
    if (!root) return;
    root.innerHTML = AUG.deathCauses.map(function (d) {
      return '<div class="card death-card badge-' + d.cls + ' reveal">' +
        '<div class="death-icon">' + d.icon + "</div>" +
        "<h4>" + d.cause + "</h4>" +
        '<p class="desc"><strong>Prevent:</strong> ' + d.fix + "</p></div>";
    }).join("");
    initReveal();
  }

  /* ---------- Adaptations gene tree ---------- */
  function renderGeneTree() {
    var root = document.getElementById("geneTree");
    if (!root || !S2DATA.adaptations) return;
    var branches = {
      angelcomb: { label: "DNA Adaptations", sub: "From Angel Combs", cls: "leviathan" },
      biolab: { label: "Biomods", sub: "Installed at the Bio Lab", cls: "info" },
      lifepod: { label: "Lifepod Intro", sub: "Granted at start", cls: "safe" },
      bunker: { label: "Colonist Bunkers", sub: "Hidden Biobeds", cls: "caution" }
    };
    var html = "";
    Object.keys(branches).forEach(function (bk) {
      var kids = S2DATA.adaptations.filter(function (a) { return a.branch === bk; });
      if (!kids.length) return;
      var b = branches[bk];
      html += '<div class="gene-branch">' +
        '<div class="gene-root ' + b.cls + '"><span class="gene-root-label">' + b.label + '</span><span class="gene-root-sub">' + b.sub + "</span></div>" +
        '<div class="gene-kids">' + kids.map(function (a) {
          return '<a class="gene-node" href="adaptations.html#' + slugify(a.name) + '">' +
            '<span class="gene-node-icon">' + a.icon + "</span>" +
            '<span class="gene-node-name">' + a.name + "</span>" +
            '<span class="gene-node-how">' + a.how + "</span></a>";
        }).join("") + "</div></div>";
    });
    root.innerHTML = html;
  }

  /* ---------- Vehicle compare ---------- */
  function renderVehicleCompare() {
    var bar = document.getElementById("vehicleCompareBar");
    if (!bar || !S2DATA.vehicles) return;
    bar.innerHTML = S2DATA.vehicles.map(function (v) {
      return '<label class="cmp-check"><input type="checkbox" data-cmp="' + v.id + '"> ' + v.icon + " " + v.name + "</label>";
    }).join("") + '<button class="btn btn-primary btn-sm" id="cmpGo" type="button">Compare</button>';
    window.__renderCmp = function () {
      var box = document.getElementById("vehicleCompareOut");
      if (!box) return;
      var ids = Array.prototype.slice.call(document.querySelectorAll("input[data-cmp]:checked")).map(function (i) { return i.dataset.cmp; });
      if (ids.length < 2) { box.innerHTML = '<p class="lead">Select at least two vehicles to compare.</p>'; return; }
      var vs = ids.map(function (id) { return S2DATA.vehicles.filter(function (v) { return v.id === id; })[0]; }).filter(Boolean);
      var rows = [
        ["Status", function (v) { return v.status === "planned" ? "Planned (TBD)" : "Available"; }],
        ["Depth rating", function (v) { return v.depth; }],
        ["Modules", function (v) { return v.modules.length + " module" + (v.modules.length === 1 ? "" : "s"); }],
        ["Top speed", function (v) { return v.status === "available" ? "TBD (Early Access)" : "—"; }],
        ["Cargo", function (v) { return v.status === "available" ? "TBD (Early Access)" : "—"; }]
      ];
      var head = "<tr><th>Spec</th>" + vs.map(function (v) { return "<th>" + v.icon + " " + v.name + "</th>"; }).join("") + "</tr>";
      var body = rows.map(function (r) {
        return "<tr><td class=\"cmp-spec\">" + r[0] + "</td>" + vs.map(function (v) { return "<td>" + r[1](v) + "</td>"; }).join("") + "</tr>";
      }).join("");
      box.innerHTML = '<div class="table-wrap"><table class="cmp-table"><thead>' + head + "</thead><tbody>" + body + "</tbody></table></div>" +
        '<p class="note-tbd">⚠ Exact speed / cargo figures are not yet public in Early Access — compare capability, not numbers.</p>';
    };
    bar.addEventListener("change", window.__renderCmp);
    var go = document.getElementById("cmpGo");
    if (go) go.addEventListener("click", window.__renderCmp);
  }

  /* ---------- Base planner (capabilities, not materials) ---------- */
  function renderBasePlanner() {
    var bar = document.getElementById("basePlanner");
    if (!bar || !S2DATA.baseModules) return;
    bar.innerHTML = S2DATA.baseModules.map(function (m) {
      return '<label class="plan-check"><input type="checkbox" data-plan="' + m.id + '"> ' + m.icon + " " + m.name + "</label>";
    }).join("");
    var out = document.getElementById("basePlannerOut");
    window.__renderPlan = function () {
      if (!out) return;
      var ids = Array.prototype.slice.call(document.querySelectorAll("input[data-plan]:checked")).map(function (i) { return i.dataset.plan; });
      if (!ids.length) { out.innerHTML = '<p class="lead">Tick the modules you plan to build — we’ll summarize your capability loadout.</p>'; return; }
      var chosen = ids.map(function (id) { return S2DATA.baseModules.filter(function (m) { return m.id === id; })[0]; }).filter(Boolean);
      out.innerHTML = '<ul class="plan-list">' + chosen.map(function (m) {
        return '<li><span class="plan-icon">' + m.icon + "</span><div><strong>" + m.name + '</strong><p class="desc">' + m.desc + "</p></div></li>";
      }).join("") + "</ul>" +
        '<p class="note-tbd">⚠ Exact piece-by-piece material costs aren’t published in Early Access. This planner tracks capabilities, not a parts bill.</p>';
    };
    bar.addEventListener("change", window.__renderPlan);
    window.__renderPlan();
  }

  /* ---------- Co-op host / client table ---------- */
  function renderCoopTable() {
    var root = document.getElementById("coopTable");
    if (!root) return;
    root.innerHTML = '<div class="table-wrap"><table class="coop-table"><thead><tr><th>Aspect</th><th>Host</th><th>Client</th></tr></thead><tbody>' +
      AUG.coopRoles.map(function (r) { return '<tr><td class="cmp-spec">' + r.aspect + "</td><td>" + r.host + "</td><td>" + r.client + "</td></tr>"; }).join("") +
      "</tbody></table></div>";
  }

  /* ---------- Crafting station tree ---------- */
  function renderCraftingStations() {
    var root = document.getElementById("craftingStations");
    if (!root || !S2DATA.crafting) return;
    var stations = {};
    S2DATA.crafting.forEach(function (r) { (stations[r.station] = stations[r.station] || []).push(r); });
    var order = ["Fabricator", "Processor", "Modification Station", "Bio Lab", "Vehicle Fabricator", "Moonpool", "Habitat Builder"];
    var keys = Object.keys(stations).sort(function (a, b) { return order.indexOf(a) - order.indexOf(b); });
    root.innerHTML = keys.map(function (st) {
      var items = stations[st];
      return '<div class="station-node"><div class="station-name">🛠️ ' + st + '</div>' +
        '<div class="station-items">' + items.map(function (r) { return '<span class="chip-static">' + r.icon + " " + r.name + "</span>"; }).join(" ") + "</div></div>";
    }).join('<div class="station-link">▾</div>');
  }

  /* ---------- Interactive depth map ---------- */
  function repDepth(s) {
    if (!s) return 300;
    if (/unbounded/i.test(s)) return 1600;
    var nums = (s.match(/\d+/g) || []).map(Number);
    if (!nums.length) return /deep/i.test(s) ? 700 : 300;
    if (/deep/i.test(s) && nums.length > 1) return Math.max.apply(null, nums);
    return nums[0];
  }
  function renderMap() {
    var col = document.getElementById("mapColumn");
    if (!col || !S2DATA.biomes) return;
    var biomes = S2DATA.biomes.slice().sort(function (a, b) { return repDepth(a.depth) - repDepth(b.depth); });
    function card(b) {
      var dm = { safe: "safe", caution: "caution", danger: "danger", extreme: "leviathan" }[b.danger] || "info";
      var layers = ["biome"];
      var hasRes = b.resources && b.resources.length && b.resources[0] !== "None";
      var hasCre = b.creatures && b.creatures.length;
      if (hasRes) layers.push("resource");
      if (hasCre) layers.push("creature");
      if (b.danger !== "safe") layers.push("danger");
      return '<a class="map-node ' + dm + '" data-layers="' + layers.join(" ") + '" href="biomes.html#' + b.id + '" style="--d:' + repDepth(b.depth) + '">' +
        '<span class="map-depth">' + b.depth + "</span>" +
        '<span class="map-name">' + b.icon + " " + b.name + "</span>" +
        '<span class="map-tags">' + (hasCre ? '<span class="map-tag">🐟 ' + b.creatures.length + "</span>" : "") +
        (hasRes ? '<span class="map-tag">💎 ' + b.resources.length + "</span>" : "") + "</span></a>";
    }
    col.innerHTML = biomes.map(card).join("");
    var ruler = document.getElementById("mapRuler");
    if (ruler) {
      var marks = [0, 100, 200, 300, 500, 800, 1200, 1600];
      ruler.innerHTML = marks.map(function (m) {
        return '<span class="ruler-mark" style="bottom:' + (m / 1700 * 100) + '%">' + m + (m === 1600 ? "m+" : "m") + "</span>";
      }).join("");
    }
    var bar = document.getElementById("mapLayers");
    if (bar) {
      bar.addEventListener("click", function (e) {
        var btn = e.target.closest ? e.target.closest(".map-layer") : null;
        if (!btn) return;
        var layer = btn.dataset.layer;
        bar.querySelectorAll(".map-layer").forEach(function (b) { b.classList.remove("active"); });
        btn.classList.add("active");
        col.querySelectorAll(".map-node").forEach(function (n) {
          n.style.display = (layer === "all" || n.dataset.layers.indexOf(layer) !== -1) ? "" : "none";
        });
      });
    }
  }

  /* ---------- Structured data (GEO: gives JS-executing crawlers entity data) ---------- */
  function slugify(s) {
    return String(s).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
  }
  function injectJsonLd(obj) {
    try {
      var s = JSON.stringify(obj).replace(/<\//g, "<\\/");
      var el = document.createElement("script");
      el.type = "application/ld+json";
      el.textContent = s;
      document.head.appendChild(el);
    } catch (e) { /* non-fatal */ }
  }
  function injectItemList(items, nameKey, descKey) {
    if (!items || !items.length) return;
    var pageUrl = location.href.split("#")[0];
    var list = items.map(function (it, i) {
      var name = it[nameKey] || "";
      var desc = String(it[descKey] || "").replace(/<[^>]+>/g, "");
      return { "@type": "ListItem", "position": i + 1,
        "item": { "@type": "Thing", "name": name, "description": desc, "url": pageUrl + "#" + slugify(name) } };
    });
    injectJsonLd({ "@context": "https://schema.org", "@type": "ItemList", "itemListElement": list });
  }

  // Render a real in-game icon when one exists for this item id, else fall back to the emoji.
  function iconHtml(item) {
    var p = (window.S2ICONS && item && item.id && window.S2ICONS[item.id]) || "";
    if (p) return '<img class="game-icon" src="' + p + '" alt="' + (item.name || item.title || "") + '" loading="lazy">';
    return item ? item.icon : "";
  }

  var templates = {
    biome: function (b) {
      return '<article class="card item-card reveal">' +
        '<div class="thumb">' + iconHtml(b) + '<span class="th-name">' + b.depth + "</span></div>" +
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
      var drops = c.drops ? '<div class="drops"><span class="drops-label">Scan yield</span> ' +
        c.drops.map(function (d) { return '<span class="chip-static">' + d + "</span>"; }).join(" ") + "</div>" : "";
      return '<article class="card item-card reveal">' +
        '<div class="thumb">' + iconHtml(c) + "</div>" +
        badge(m.cls, m.label) + beh +
        "<h3>" + c.name + "</h3>" +
        '<p class="desc">' + c.desc + "</p>" +
        '<dl class="spec"><dt>Tier</dt><dd>' + m.label + "</dd>" +
        "<dt>Habitat</dt><dd>" + c.biome + "</dd></dl>" +
        drops +
        '<button class="scan-btn' + (isScanned(c.id) ? " on" : "") + '" data-id="' + c.id + '" type="button">' +
          (isScanned(c.id) ? "✓ Scanned" : "Mark scanned") + "</button>" +
        (c.tbd ? tbd() : "") + "</article>";
    },
    crafting: function (r) {
      var ings = r.ingredients.map(function (i) {
        return '<span class="ing">' + i.name + (i.qty > 1 ? " ×" + i.qty : "") + "</span>";
      }).join("");
      return '<article class="card item-card reveal">' +
        '<div class="thumb">' + iconHtml(r) + "</div>" +
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
        '<div class="thumb">' + iconHtml(m) + "</div>" +
        badge("info", m.category) +
        "<h3>" + m.name + "</h3>" +
        '<p class="desc">' + m.desc + "</p>" +
        (m.tbd ? tbd() : "") + "</article>";
    },
    tip: function (t) {
      var cat = { survival: "Survival", building: "Base & Gear", exploration: "Exploration", combat: "Threats", vehicles: "Vehicles" }[t.category] || t.category;
      return '<article class="card item-card reveal">' +
        '<div class="thumb">' + iconHtml(t) + '<span class="th-name">' + cat + "</span></div>" +
        "<h3>" + t.title + "</h3>" +
        '<p class="desc">' + t.body + "</p></article>";
    },
    resource: function (r) {
      var stars = "★★★★★".slice(0, r.rarity) + "☆☆☆☆☆".slice(0, 5 - r.rarity);
      var g = r.group === "mineral" ? "Mineral" : r.group === "refined" ? "Refined" : "Biological";
      var rare = r.rarity
        ? '<div class="rarity">' + stars + "</div>"
        : '<div class="rarity">' + badge("caution", "Gated / late") + "</div>";
      var renew = (r.renewable === false)
        ? badge("danger", "Finite")
        : badge("safe", "Renewable");
      return '<article class="card item-card reveal">' +
        '<div class="thumb">' + iconHtml(r) + '<span class="th-name">' + g + "</span></div>" +
        rare + renew +
        (r.renewNote ? '<span class="renew-note">' + r.renewNote + "</span>" : "") +
        "<h3>" + r.name + "</h3>" +
        '<p class="desc">' + r.uses + "</p>" +
        '<dl class="spec"><dt>Where</dt><dd>' + r.locations + "</dd></dl></article>";
    },
    adaptation: function (a) {
      var typeBadge = a.type === "DNA" ? badge("leviathan", "DNA Adaptation") : badge("info", "Biomod");
      var branchBadge = a.branch === "angelcomb" ? badge("leviathan", "Angel Comb") :
                        a.branch === "biolab" ? badge("info", "Bio Lab") :
                        a.branch === "lifepod" ? badge("safe", "Lifepod") :
                        a.branch === "bunker" ? badge("caution", "Bunker") : "";
      return '<article class="card item-card reveal">' +
        '<div class="thumb">' + iconHtml(a) + "</div>" +
        typeBadge + branchBadge +
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
            return '<div class="card" style="padding:1rem"><div style="font-size:1.5rem">' + iconHtml(m) +
              '</div><h4 style="margin:.4rem 0 .2rem;font-size:.98rem">' + m.name + "</h4>" +
              '<p class="desc" style="font-size:.85rem">' + m.desc + "</p></div>";
          }).join("")
        : '<p class="desc">Modules: TBD (confirmed for a post-launch update).</p>';
      return '<article class="card reveal" style="padding:0;overflow:hidden">' +
        '<div class="thumb" style="height:160px;border-radius:0;font-size:3.4rem">' + iconHtml(v) +
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
    renderChrome();
    applyAugment();
    initTheme();
    initNav();
    initGlobalSearch();
    initScan();
    initReveal();
    initBubbles();
    initMagnetic();

    var page = document.body.dataset.page;
    if (page === "biomes") { setupList({ root: "biomesRoot", data: S2DATA.biomes, tpl: templates.biome }); injectItemList(S2DATA.biomes, "name", "desc"); }
    else if (page === "creatures") { setupList({ root: "creaturesRoot", data: S2DATA.creatures, tpl: templates.creature }); renderScanProgress(); injectItemList(S2DATA.creatures, "name", "desc"); }
    else if (page === "crafting") { setupList({ root: "craftingRoot", data: S2DATA.crafting, tpl: templates.crafting }); renderCraftingStations(); injectItemList(S2DATA.crafting, "name", "desc"); }
    else if (page === "base") { setupList({ root: "baseRoot", data: S2DATA.baseModules, tpl: templates.base }); renderBasePlanner(); injectItemList(S2DATA.baseModules, "name", "desc"); }
    else if (page === "vehicles") { renderVehicles(); renderVehicleCompare(); injectItemList(S2DATA.vehicles, "name", "desc"); }
    else if (page === "tips") { setupList({ root: "tipsRoot", data: S2DATA.tips, tpl: templates.tip }); renderRoutePhases(); renderDeathCauses(); injectItemList(S2DATA.tips, "title", "body"); }
    else if (page === "resources") { setupList({ root: "resourcesRoot", data: S2DATA.resources, tpl: templates.resource }); injectItemList(S2DATA.resources, "name", "uses"); }
    else if (page === "adaptations") { setupList({ root: "adaptationsRoot", data: S2DATA.adaptations, tpl: templates.adaptation }); renderGeneTree(); injectItemList(S2DATA.adaptations, "name", "effect"); }
    else if (page === "media") { renderVideos(); renderMedia(); }
    else if (page === "walkthrough") { renderWalkthrough(); injectItemList(S2DATA.walkthrough, "title", "summary"); }
    else if (page === "multiplayer") { renderCoopTable(); }
    else if (page === "map") { renderMap(); }
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
