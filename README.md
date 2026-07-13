# Subnautica 2 Guide 🌊

A premium, fan-made strategy hub for **Subnautica 2**, built as a zero-build static site (HTML + CSS + vanilla JS) and deployed via **GitHub Pages**.

> ⚠️ Fan project — not affiliated with Unknown Worlds or Krafton. Data is based on the established Subnautica universe; items marked **TBD** are pending official game release.

## Core boards
| Board | File | Highlights |
|-------|------|-----------|
| Home | `index.html` | Hero, navigation, feature grid |
| Biomes | `biomes.html` | Proteus' vertical descent — depth / danger / resources / creatures, filterable (22 biomes) |
| Creatures | `creatures.html` | Threat-tier encyclopedia: Titan → Leviathan → Alpha → Predator → Carnivore → Passive → Parasite (19 species) |
| Crafting | `crafting.html` | 25 real recipes across Tools / Equipment / Consumables / Base Parts / Vehicle Parts, filterable by category |
| Vehicles | `vehicles.html` | Modular Tadpole, Seafrog chassis, planned Mobile-Base Sub & Mech Suit |
| Base Building | `base-building.html` | Piece-by-piece habitats, windows, color/lighting, descent elevator, hydro/thermal power |
| Beginner's Guide | `tips.html` | 20 survival tips by topic + the early-game route timeline |
| Resources | `resources.html` | Every mineral & organism, abundance (★) and best farming spots |
| Adaptations | `adaptations.html` | DNA Adaptations (Digestion, Heat, Endurance) & Biomods (Dash, Oxygen Control, Biobed) |
| Story & Lore | `story.html` | Proteus, CICADA, Pioneer Program, the Blight, World Tree, timeline |
| Co-op | `multiplayer.html` | Up to 4 players, cross-platform, single-player-first, shared progression |
| About / FAQ | `about.html` | Sourcing, TBD policy, roadmap |

Content is sourced from the Subnautica 2 fan wiki, the Epic Games / Kotaku / TapTap / Ludens guides, and paraphrased; Subnautica 2 is in Early Access, so details may change.

## Tech
- **No build step** — pure static files, opens directly in a browser.
- **Design system**: `assets/css/style.css` (deep-sea glassmorphism, light/dark/system theme).
- **Behaviour**: `assets/js/main.js` (theme toggle, mobile menu, scroll reveal, bubble canvas, magnetic buttons, data rendering & filtering).
- **Content**: `assets/js/data.js` — all guide data lives here. To contribute, edit this file.

## Local preview
```bash
cd subnautica2-guide
python3 -m http.server 8000
# open http://localhost:8000
```

## Deploy (GitHub Pages)
The site is served from the `main` branch root. After pushing:
Settings → Pages → Source: `Deploy from a branch` → Branch: `main` → `/ (root)`.

## Roadmap
- Story / walkthrough board
- Equipment & tools deep-dive
- Seeds & resources index
- Replace TBD entries with verified Subnautica 2 data on release
