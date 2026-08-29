# Subnautica 2 攻略站 — data.js 完整补丁 v2

> 本文件**取代**上一版 `DATA-PATCH.md`。整合三块：① EA 1.1/1.2 的 Biomod 与联机数据更新；② 从游戏论坛/攻略站采集的真实高分攻略（含具体数值、坐标、配方）；③ 基地/载具/利维坦的进阶内容。
> 所有内容均有来源（见文末）。**字段名请对照你 data.js 里现有条目**——确认过的字段：生物/物品用 `id`/`name`/`icon`/`desc`，Adaptations 用 `type:"DNA"|"Biomod"`，配方用 `recipe`/`ingredients`，tips 用 `category`/`name`/`desc`，未确认项标 `tbd`，来源标 `source`。

---

## 一、Adaptations / Biomods（EA 1.1：4 → 6 + 被动槽）

完整 15 个 Biomod（5 主动 + 10 被动），把现有 `adaptations` 数组里的 Biomod 条目扩展/修正为下面这组（`type:"Biomod"`）：

```js
// —— 主动（Active）——
{ type:"Biomod", name:"Dash", icon:"⚡", source:"Biolab (unlocked early)", desc:"Short burst of forward speed underwater." },
{ type:"Biomod", name:"Pathfinder", icon:"🧭", source:"Biolab (unlocked early)", desc:"Projects a visible route to a marked destination." },
{ type:"Biomod", name:"Sonic Echo", icon:"📡", source:"Scan: Collector Leviathan", desc:"Pings surroundings to reveal terrain and nearby life." },
{ type:"Biomod", name:"Electric Discharge", icon:"🔌", source:"Scan: Electric Geordie", desc:"Electric burst that deters nearby predators." },
{ type:"Biomod", name:"Chum Cloud", icon:"🫧", source:"Scan: Toxic Sponge / Houndgar", desc:"Emits a cloud that distracts creatures away." },

// —— 被动（Passive）——
{ type:"Biomod", name:"Sea Skimmer", icon:"🌊", source:"Biolab (unlocked early)", desc:"Less drag — you glide farther between strokes." },
{ type:"Biomod", name:"Oxygen Control", icon:"🫁", source:"Biolab (unlocked early)", desc:"Slower oxygen drain while still." },
{ type:"Biomod", name:"Bioluminescence", icon:"✨", source:"Scan: Sandspear / Electric Geordie", desc:"Soft light in the dark depths." },
{ type:"Biomod", name:"Camouflage", icon:"🦎", source:"Scan: Bullethead", desc:"Blend in while still, reducing predator aggro." },
{ type:"Biomod", name:"Water Retention", icon:"💧", source:"Scan: Coral Crab", desc:"Slower dehydration between drinks." },
{ type:"Biomod", name:"Homing Sense", icon:"🧲", source:"Scan: Surge Jelly / Hammerhead", desc:"Highlights dropped gear and beacons at range." },
{ type:"Biomod", name:"Threat Sense", icon:"⚠️", source:"Scan: Hoverthorn", desc:"Warns when a predator is closing in." },
{ type:"Biomod", name:"Dermal Garden", icon:"🌱", source:"Scan: Needler Mango", desc:"Slowly regenerates a little health." },
{ type:"Biomod", name:"Slow Metabolism", icon:"🍃", source:"Scan: Nibbler Mango", desc:"Slower food drain over time." },
{ type:"Biomod", name:"Water Secretion", icon:"🫗", source:"Scan: Water Slug", desc:"Trickle-produces fresh water as you explore." },
```

**1.1 关键变化（写进 adaptations 页头部文字）：**
- Biolab 解锁的 Biomod 从 **4 → 6**；新增两个 Biolab：**Coral Gardens**、**Axum Ruins**。
- 用 **Bioscanner** 扫描生物解锁额外**被动槽位**（UI 显示每槽所需扫描次数 + 累计 Bioscan 数）。
- **创造模式**默认解锁全部 Biomod。

---

## 二、新手攻略新增（tips 数组，真实数值）

以下条目按 `category` 插入 tips 数组（survival / exploration / building / combat / vehicles）：

```js
// —— survival ——
{ category:"survival", name:"Craft the Survival Multitool first", desc:"It only needs 3 Titanium near the Lifepod. Without it you can't harvest Fibrous Pulp, Acidic Raion Pouches, or most other materials." },
{ category:"survival", name:"Battery → Scanner order", desc:"Basic Battery = 2 Copper + 1 Acidic Raion Pouch. Scanner = 2 Titanium + 2 Quartz + 1 Basic Battery. Both Copper and Raion Pouches are in the cave directly under the Lifepod." },
{ category:"survival", name:"Before Digestion, only Nutrient Blocks feed you", desc:"Until you unlock the Digestion Adaptation, local food does little or nothing. Eat Nutrient Blocks below 60 food (meter caps at 100)." },
{ category:"survival", name:"Cook your fish after Digestion", desc:"Cooked Geordie gives +30 food and clings to coral domes (easy catch). Oily Salad (2 Fibrous Pulp) = +20. Threemoon Temaki = +60 food +15 health. Cooked food decays, so cook only for the next dive." },
{ category:"survival", name:"Turn back at 50% oxygen", desc:"Treat O2 as a movement budget, not a panic meter. Decide your refill and turnaround point before each dive — don't wait for the red warning." },
{ category:"survival", name:"Unlock Digestion (160 m NNE)", desc:"Swim ~160 m north-northeast of the Lifepod, follow the black cable / NOA Anita signal to a large glowing Angel Comb, and interact with its central pink bulb." },

// —— exploration ——
{ category:"exploration", name:"Scanner ≠ Bioscanner", desc:"The regular Scanner unlocks blueprints; creature Biomods need the separate Bioscanner. Its fragment is in the Cicada Wreck EVA Prep (~1,700 m east of the Lifepod) and needs a Repair Tool to reach." },
{ category:"exploration", name:"Scanner Station = ore radar", desc:"A Scanner Station fragment is at Camp One, ~240 m northeast of the Lifepod. It pings nearby ore, wrecks, and anomalies." },
{ category:"exploration", name:"Welcome Center is a hub", desc:"Southeast of the Lifepod. Scan two Habitat Builder fragments, power the Biolab, and pick starter Biomods. Don't leave after one scan." },
{ category:"exploration", name:"Oxygen Tunics refill you", desc:"Blue bulbous plants that emit refillable air bubbles. Keep an Air Bladder on the hotbar (Rubber from 2 Lucifer Rotsacs + Titanium) for emergency ascents." },
{ category:"exploration", name:"The red-striped boundary is the EA edge", desc:"Don't cross it. Beyond it is the Void — Shiver Leviathan territory." },

// —— building ——
{ category:"building", name:"Solar panels go on the ROOF", desc:"Side-mounted panels generate far less power. Build shallow (15–100 m) so solar works, and add a Bioreactor later for nighttime." },
{ category:"building", name:"Assign a Biobed before deep dives", desc:"A Biobed is your respawn point — set one at your forward base or you'll respawn all the way back at the Lifepod." },
{ category:"building", name:"Biobeds expand inventory", desc:"Endurance Biobeds give +3 inventory slots; Dexterity Biobeds give +1 hotbar slot." },
{ category:"building", name:"Keep keepsakes out of recipes", desc:"Use the new personal storage (EA 1.1) for items you don't want auto-consumed by crafting." },
{ category:"building", name:"Fix a flooded base", desc:"Exit, add reinforcement panels outside until hull integrity is above zero, then re-enter and repair breaches with the Repair Tool." },

// —— combat ——
{ category:"combat", name:"Hit-and-run works now (1.1)", desc:"Most creatures flee when hit by the Survival Multitool, and the Sonic Resonator briefly stuns them. Poke, reposition, scan." },
{ category:"combat", name:"Leviathans cannot be killed", desc:"In Subnautica 2 they can't die — treat them as terrain. Avoid, bait, or slip past; don't fight." },
{ category:"combat", name:"Flares don't work on Leviathans", desc:"Use the Tadpole, camouflage, or terrain instead. The Electric Discharge biomod and Sonic Resonator can buy you a moment." },

// —— vehicles ——
{ category:"vehicles", name:"Build the Tadpole ASAP", desc:"It removes constant oxygen stress and protects you from wildlife. You'll need 3 Tadpole Fragments, a Moonpool, a Vehicle Fabricator, and a Tadpole Core Module." },
{ category:"vehicles", name:"Dock to recharge every return", desc:"A dead Tadpole deep in a cave is a serious problem. Make docking a habit." },
{ category:"vehicles", name:"Scout Ray Chassis is the best general pick", desc:"Faster and more agile — better for escaping Leviathans. Haul Chassis only beats it for dedicated cargo/farming runs." },
```

---

## 三、基地进阶（data.js 基地数据 + 可加「best base locations」说明）

真实推荐位置（按进度）：

| 位置 | 深度/方位 | 要点 |
|---|---|---|
| Hydrothermal Vents | ~500 m 东（需 Heat Tolerance 适应） | 热泉旁放 Thermal Plant，稳定供电；碎片 ~490 m 东，配方 3 Titanium + 3 Copper + 3 Gold |
| Crag Canyon Shelf | 150–250 m | 有铅/银/金 + 热泉，威胁 3（Ceratehecan、Hound Gar） |
| Cicada Wreck / Lander Garage | ~400 m 东北 | 铅矿富集，附近风力流可配 Hydroelectric Turbine |
| Alien Ruins Research Outpost | ~1300 m 东 | 省去反复横穿 Collector Leviathan 深渊 |

社区教训（Steam 讨论）：避开 **"Wander" 区域**——建基地时 Nibbler Mango 会一直来骚扰。

---

## 四、利维坦 / 生物要点（creatures 数据 + tips）

- **Collector Leviathan（大王乌贼）**：出生点**东 ~950 m**，绿色水域 ~169 m 深处；也出现在 Graveyard、Observatory 北缘、Root Canyon。第二只在 Karakorum 遗迹东北的毒黄绿水区 ~350 m 深。
  - 扫描技巧：① 用 **Tadpole 当诱饵**，趁它咬住时下艇扫；② **Camouflage** 生效时扫；③ 贴地形/遗迹侧边绕；④ 扫完下潜到 ~250 m 甩掉追兵。扫描它解锁 **Sonic Echo**。
- **Shiver Leviathan**：红屏障外的 Void，~5000 m 深，群攻。逃跑：直线向上游回可玩区。
- **Great Jaw Leviathan**：出生点**西南**，Cicada Wreck 附近，静态蛤型，从嘴外扫。
- **1.1 战斗变化**：被 Survival Multitool 击中多数生物会逃跑；被 Sonic Resonator 击中短暂眩晕。

---

## 五、Tadpole / 载具配方（crafting/vehicles 数据）

```js
// Tadpole
{ name:"Tadpole", recipe:["2 Titanium Ingot","1 Glass","1 System Chip","1 Power Cell"], source:"GameWith" },
{ name:"Moonpool", recipe:["5 Titanium"], source:"GameWith" },
{ name:"Vehicle Fabricator", recipe:["1 Copper Ingot","2 Glass"], source:"GameWith" },
{ name:"Tadpole Dock", recipe:["1 Silver Ingot","2 Copper Wire"], source:"GameWith" },
// Chassis
{ name:"Scout Ray Chassis", recipe:["2 Plasteel Ingot","1 Advanced Wiring Kit","1 Dedicated Core","1 Strong Acid"], note:"Best general pick — speed & agility", source:"GameWith" },
{ name:"Haul Chassis", recipe:["4 Titanium Ingot","3 Strontium","3 Enameled Glass"], note:"Cargo/farming runs", source:"GameWith" },
// Depth
{ name:"Depth Module Mk.1", source:"Modification Station (unlock via Mod Station at research base)", note:"Needed below 250 m" },
```

---

## 六、联机 / Buddy System（EA 1.2，已进 multiplayer.html 文字，data.js 可加角色条目）

```js
// co-op explorers 数组新增
{ name:"Grace", added:"EA 1.2 Buddy System" },
{ name:"Jegna", added:"EA 1.2 Buddy System" },
```

---

## 来源

- Shacknews — Adaptive Measures 补丁全文：https://www.shacknews.com/article/149949/subnautica-2-adaptive-measures-update-patch-notes
- Unknown Worlds — Buddy System：https://unknownworlds.com/en/news/subnautica-2-buddy-system-update
- Biomods 全名单（Wiki）：https://wiki.subnautica.com/sn2/Biomods
- 新手顺序/食物/氧气：https://allthings.how/subnautica-2-early-food-guide-best-fish-recipes-and-the-digestion-fix/ 、https://grindnstrat.com/subnautica-2-beginner-guide/ 、https://finalboss.io/subnautica-2-how-to-survive-early-game-o2
- 基地位置：https://www.rockpapershotgun.com/subnautica-2-best-base-locations 、https://www.eurogamer.net/best-subnautica-2-base-locations 、https://steamcommunity.com/app/1962700/discussions/0/564785190210392075/
- 利维坦位置/扫描：https://www.dexerto.com/wikis/subnautica-2/how-to-find-the-collector-leviathan/ 、https://allthings.how/shiver-leviathan-in-subnautica-2-where-to-find-the-void-predator/ 、https://gamingbolt.com/subnautica-2-guide-how-to-find-and-bio-scan-the-collector-leviathan
- Tadpole/配方：https://gamewith.net/subnautica-2/75820 、https://www.whisperofthehouse.com/subnautica-2/tadpole-submarine
