# Subnautica 2 Guide — 内容更新补丁（data.js）

> 本文件是把 2026-07-17 之后的两个真实大版本更新（EA 1.1「Adaptive Measures」、EA 1.2「Buddy System」）补进 `assets/js/data.js` 的改动手册。
> 所有事实均来自官方补丁说明与社区 Wiki，已附来源链接。**字段名以你现有 data.js 里同类条目为准**——我无法逐行读取 85KB 的 data.js，所以下面的 JSON 片段是「内容规格」，粘贴前请对照现有 adaptations / creatures / tips 数组的字段名微调。

---

## 一、核心改动清单

| 区域 | 现状（EA 1.0） | 更新后（真实） |
|---|---|---|
| Biomod 数量 | 4 个（Bio Lab + Biobed） | 共 15 个：5 主动 + 10 被动；其中「Biolab 解锁」从 4 提升到 6 |
| Biolab 位置 | 少量 | 新增 2 个：Coral Gardens、Axum Ruins |
| 被动 Biomod 槽 | 无 | 用 Bioscanner 扫描生物可解锁额外被动槽位 |
| 移动 | 仅游泳 | 水面/基地内可冲刺（可改键） |
| 战斗 | 生物被攻击立即反击 | 被 Survival Multitool 击中会逃跑；被 Sonic Resonator 击中短暂眩晕 |
| 沉船 | 旧路线 | 新增行进路线 + 氧气谜题 |
| 基地 | 常规储物 | 新增「个人储物」——不接入制作系统 |
| 联机 | 通用 4 人联机 | 新增 Buddy System：Grace/Jegna、近距语音、救援、交易、表情、追踪标签 |

---

## 二、Adaptations / Biomods（data.js `adaptations` 数组）

完整 15 个 Biomod 清单（来源：社区 Wiki + 1.1 补丁）。把你现有 4 个扩展/修正为下面的完整名单。

### 主动 Biomods（5 个）
```js
// Active
{ type:"Biomod", name:"Dash", icon:"⚡", source:"Biolab (default/unlocked early)", desc:"Short burst of forward speed underwater." },
{ type:"Biomod", name:"Pathfinder", icon:"🧭", source:"Biolab (default/unlocked early)", desc:"Projects a visible route to a marked destination." },
{ type:"Biomod", name:"Sonic Echo", icon:"📡", source:"Scan: Collector Leviathan", desc:"Pings surroundings to reveal terrain and nearby life." },
{ type:"Biomod", name:"Electric Discharge", icon:"🔌", source:"Scan: Electric Geordie", desc:"Releases an electric burst that deters nearby predators." },
{ type:"Biomod", name:"Chum Cloud", icon:"🫧", source:"Scan: Toxic Sponge / Houndgar", desc:"Emits a cloud that distracts or lures creatures away." },
```

### 被动 Biomods（10 个）
```js
// Passive
{ type:"Biomod", name:"Sea Skimmer", icon:"🌊", source:"Biolab (default/unlocked early)", desc:"Reduces drag so you glide farther between strokes." },
{ type:"Biomod", name:"Oxygen Control", icon:"🫁", source:"Biolab (default/unlocked early)", desc:"Slower oxygen drain, longer dives." },
{ type:"Biomod", name:"Bioluminescence", icon:"✨", source:"Scan: Sandspear / Electric Geordie", desc:"Emits soft light in the dark depths." },
{ type:"Biomod", name:"Camouflage", icon:"🦎", source:"Scan: Bullethead", desc:"Blend with surroundings to reduce predator aggro while still." },
{ type:"Biomod", name:"Water Retention", icon:"💧", source:"Scan: Coral Crab", desc:"Slower dehydration between drinks." },
{ type:"Biomod", name:"Homing Sense", icon:"🧲", source:"Scan: Surge Jelly / Hammerhead", desc:"Highlights dropped gear and beacons over distance." },
{ type:"Biomod", name:"Threat Sense", icon:"⚠️", source:"Scan: Hoverthorn", desc:"Warns when a predator is closing in." },
{ type:"Biomod", name:"Dermal Garden", icon:"🌱", source:"Scan: Needler Mango", desc:"Slowly regenerates a small amount of health." },
{ type:"Biomod", name:"Slow Metabolism", icon:"🍃", source:"Scan: Nibbler Mango", desc:"Reduces food drain over time." },
{ type:"Biomod", name:"Water Secretion", icon:"🫗", source:"Scan: Water Slug", desc:"Trickle-produces fresh water while you explore." },
```

### 1.1 更新说明（写进 adaptations 页头部/介绍文字）
- Biolab 解锁的 Biomod 数量从 **4 → 6**。
- 新增两个 Biolab：**Coral Gardens** 和 **Axum Ruins**。
- 用 **Bioscanner** 扫描生物可解锁额外**被动 Biomod 槽位**（UI 会显示每个槽位所需扫描次数和累计 Bioscan 总数）。
- **创造模式**默认解锁全部 Biomod。

---

## 三、Co-op / Buddy System（data.js 联机数据 + multiplayer.html）

### 新角色
```js
// co-op explorers 数组新增
{ name:"Grace", note:"Added in EA 1.2 Buddy System", suit:"2 new suit colors shipped alongside Grace & Jegna" },
{ name:"Jegna", note:"Added in EA 1.2 Buddy System" },
```

### Buddy System 功能（补进 multiplayer 数据/文案）
- **Proximity voice chat**：近距清晰，拉远后切换成无线电风格、随距离断续。
- **Player revives**：队友倒地后有短时间窗口，靠近**共享氧气**救起。
- **Inventory sharing / trading**：站到队友身后打开其背包，直接交换物品。
- **Emotes**：欢呼、鼓掌、表达烦躁。
- **Tracking Tag**：短程信标，可投掷或放进储物柜；带着它死亡会**延长黑匣子信号**，方便找回装备。
- **HUD 图标**：默认更小，悬停放大，减少多信标时的杂乱。

---

## 四、Base Building 新增（data.js 基地数据）
```js
{ name:"Personal Storage", source:"EA 1.1", desc:"Storage that does NOT link to crafting systems — stashed items are excluded from recipe completion." },
{ name:"World Tree Relic", source:"EA 1.1", desc:"Buildable decoration seen in the trailer." },
```

---

## 五、Creatures 校对（对照 1.1 补丁里被点名的生物）

1.1 补丁明确提及、你的生物图鉴里若缺失应补：**Periscopic Clowncrab、Necrolei、Bloom Parasite、Shiver Leviathan、Sandspear、Flash Slug、Scout Ray、Macaron Sponge、Cage Gorgon、Surge Jelly、Lucifer Rotsac、Water Slug、Electric Geordie、Collector Leviathan、Hoverthorn、Bullethead、Coral Crab、Needler Mango、Nibbler Mango、Hammerhead、Toxic Sponge、Houndgar**。
补丁行为变化（写进对应生物条目）：
- 多数生物被 Survival Multitool 击中会**逃跑**（而非立即反击）。
- 被 Sonic Resonator 击中会短暂**眩晕**。
- Bloom Parasite 成为主要遭遇生物；Coral Gardens 与 Ruins 的 Bloom 遭遇按进度重新平衡。

---

## 六、Tips / Beginner's Guide 新增条目（data.js `tips` 数组）
```js
{ category:"exploration", title:"Sprint on land", desc:"Since EA 1.1 you can sprint out of the water (surface + base). Bind it in settings — walk speed was lowered to balance it." },
{ category:"combat", title:"Hit-and-run works now", desc:"Most creatures flee when hit by the Survival Multitool, and the Sonic Resonator briefly stuns them. Don't stand and fight — poke, reposition, scan." },
{ category:"building", title:"Keep keepsakes out of recipes", desc:"Use the new personal storage (EA 1.1) for items you don't want auto-consumed by crafting." },
{ category:"exploration", title:"Wrecks now breathe", desc:"EA 1.1 added oxygen-based puzzles and new routes inside wrecks. Bring spare air tanks before clearing one." },
```

---

## 七、上线清单（除 data.js 外还要改的地方）

1. ✅ `updates.html`（新页面，已生成）—— 放仓库根目录。
2. ✅ `multiplayer.html`（已更新，加入 Buddy System）—— 覆盖旧文件。
3. ✅ `sitemap.xml`（已修复：补上 `map.html` + `updates.html`，lastmod 更新为 2026-08-29）。
4. ✅ `assets/img/buddy-system.svg`（新插画）—— 放 `assets/img/`。
5. ⚠️ **导航栏**：把「Updates」加进 `main.js` 的 header 导航配置（和其他 14 个页面同级）。
6. ⚠️ **noscript 列表**：每个页面的 `<noscript>` 导航都加一行 `<li><a href="updates.html">Updates</a></li>`（本次生成的两个文件已包含；其余 14 个页面需同步）。
7. ⚠️ **adaptations.html**：更新 `<title>` / meta description 里的「Biomods (Dash, Oxygen Control, Biobed upgrades)」为「15 Biomods (5 active + 10 passive)」。

---

## 来源

- 官方 Steam 补丁说明：https://store.steampowered.com/news/app/1962700
- Shacknews — Adaptive Measures 补丁全文：https://www.shacknews.com/article/149949/subnautica-2-adaptive-measures-update-patch-notes
- Unknown Worlds — Buddy System Update：https://unknownworlds.com/en/news/subnautica-2-buddy-system-update
- IGN — EA 1.2 Patch Notes：https://www.ign.com/wikis/subnautica-2/Subnautica_2_Early_Access_1.2_Patch_Notes
- GameRant — August co-op update：https://gamerant.com/subnautica-2-update-co-op-patch-notes/
- Biomods 全名单（Wiki）：https://wiki.subnautica.com/sn2/Biomods
