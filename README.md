# SIPS · The Cocktail Handbook

[English](#english) · [简体中文](#简体中文)

## English

A cocktail discovery and guided mixing website built around your home bar. Warm ivory, botanical greens and local SVG illustrations create an editorial feel without an image API.

The website starts in **Simplified Chinese**. Use **EN / 中文** in the header to switch languages. Your choice is saved locally; recipes, ingredients, filters and mixing instructions are available in both languages.

### Run locally

Install **Node.js 22 or newer**, then open a terminal in the project directory (the folder containing `package.json`):

```bash
npm ci
npm run dev
```

Open the local address printed by Vite in your browser. Keep the terminal running.

**Windows PowerShell:** use `npm.cmd ci` and `npm.cmd run dev` if PowerShell blocks `npm.ps1`. If you downloaded a ZIP from GitHub, extract it first, open the folder containing `package.json`, press **Alt + D**, type `powershell`, and press Enter.

```bash
npm run build  # TypeScript checks and production build
npm test       # Bar matching, recommendations and translation coverage
npm run preview
```

In the managed cloud workspace, use `npm ci --cache /tmp/sips-npm-cache` when the default npm cache is not writable.

### Features

- Desktop: random selection automatically pours and reveals the drink, the bottle fades away, and the recipe link remains available. Subtle mouse-follow movement is retained; page scrolling does not control the pour.
- Phone / touch layouts: drag the bottle to the right to tip it. Leftward swipes do not pour. A larger tilt pours faster; release returns it upright and preserves the liquid already poured. Vertical swipes remain normal page scrolling. The bottle also supports holding Space or Enter on the keyboard.
- Random recipes drawn without replacement; choose all 102 cocktails or only recipes available in your bar. Glass shape, color, garnish and recipe link follow the selected drink.
- Reduced-motion mode uses static poses instead of continuous liquid animation. Mobile pours stop when the page is hidden or a gesture is cancelled. Desktop and phone controllers are chosen using viewport width and pointer capabilities.
- 102 cocktails covering the IBA list snapshot, searchable by name and ingredient, with spirit and flavor filters.
- Editor’s pick badges for a fixed set of 20 popular classics; badges remain attached to the recipe when searching, filtering or viewing favorites.
- Ingredient cabinet, recipe matching, missing-ingredient counts and shopping recommendations.
- Recipe details, quantities for 1–8 servings and step-by-step mixing guidance.
- Chinese / English switch with a saved language preference.
- Locally saved favorites and cabinet, responsive layouts, keyboard focus and reduced-motion support.

### Browser interaction tests

```bash
npx playwright install chromium
npm run test:e2e
```

The tests run desktop and touch-enabled iPhone-size Chromium projects. They check automatic desktop reveals, rightward touch-drag speed and release, rejection of leftward pouring, vertical scrolling, keyboard operation, random recipe linkage, reduced motion, mobile bounds, stable editor tags, historical favorites and quantity ranges. This is browser emulation, not a claim of physical iPhone / Safari testing. If Chromium is already installed in a managed environment, set `CHROMIUM_PATH` to its executable path.

### Recipe sources

The current catalog covers **102 entries** (34 per category) in the IBA list captured on **September 20, 2025** by [matt-parish/iba-cocktails](https://github.com/matt-parish/iba-cocktails/tree/cb781316c6a9579648ba54360917b8a35ea975b2), cross-checked against an August 2025 snapshot from [kolaente/iba-cocktails-list](https://github.com/kolaente/iba-cocktails-list/tree/92cbe7f40d0fee14b37ca7a3e938c8ce070242a2). This is third-party snapshot coverage, **not a live verification of the 2026 official website or Difford’s Guide recipes**.

- 57 recipes were added from the September snapshot. Existing measures and IDs for 45 overlapping recipes were preserved from [teijo/iba-cocktails](https://github.com/teijo/iba-cocktails/tree/5f1e5dd4a2189adc3854a51d7b48640bd86e9f76), with cl converted to ml (1 cl = 10 ml). List membership does not imply that an older recipe variant has been updated to the latest measures. Spritz keeps its existing `spritz-veneziano` ID.
- Five historical recipes outside the snapshot remain accessible in saved favorites: Screwdriver, Yellow Bird, Golden Dream, God Mother and God Father. They are excluded from the default collection and random draws. All original 50 IDs still resolve.
- Source ranges and fractions are retained. Qualitative quantities remain unmeasured. IBA Tiki’s source omits the units for pineapple juice (90) and lime juice (30); the detail view explicitly shows that limitation rather than assuming ml. A merged allspice/lime row in Three Dots and a Dash is split without changing its measures.
- Instructions are paraphrased and translated. Time, difficulty, flavor, color, simplified glass illustrations and editor’s picks are house editorial choices. Source photographs are not used.

Each recipe links to its pinned source. `data/sources/iba-2025-snapshot.json` stores the relevant source facts; `iba-catalog-coverage.json` records membership, aliases, preserved IDs and normalization decisions; `iba-provenance.json` retains the original 50-recipe audit. The September source’s MIT notice is retained in `data/sources/licenses/iba-scraper-MIT.txt`.

### Project structure

| File | Purpose |
| --- | --- |
| `src/main.tsx` | Page components, card artwork and recipe dialog |
| `src/MixStudio.tsx` | Shared illustration, device-specific hints and random cocktail studio |
| `src/usePourController.ts` | Automatic desktop reveal and rightward phone drag controls |
| `src/mix-utils.ts` | Shuffle bag, shared bottle / stream geometry and garnish selection |
| `src/mix-studio.css` | Studio layout and mobile touch targets |
| `src/style.css` | Colors, typography and responsive layouts |
| `src/data.ts` | Types, matching and recommendations |
| `src/cocktails.json` | 102 bilingual recipes, measures and pinned source links |
| `src/historical-cocktails.json` | Five legacy recipes kept for saved favorites |
| `src/editors-choice.ts` | Stable IDs for 20 editor’s picks |
| `src/catalog-translations.json` | Additional ingredient, unit and category labels |
| `src/i18n.tsx` | Language provider, UI translations and English recipe instructions |
| `src/data.test.ts` | Matching and recommendation tests |
| `src/i18n.test.ts` | Translation and recipe coverage tests |
| `src/mix-utils.test.ts` | Random draws, pour geometry and garnish tests |

**Stack:** React 19, TypeScript, Vite, Lucide, CSS and Vitest.

No backend, accounts or paid services are required. Google Fonts is optional and falls back to system fonts. Your bar starts empty. Ice is assumed; other listed required ingredients count toward availability, including water where the recipe lists it. Optional ingredients and decorative garnishes do not block a match. Unspecified quantities stay unmeasured when servings change. Servings scale linearly; shake larger orders in batches. Recipes use common preparations and can be adjusted to taste.

Possible next steps: more recipes, ingredient substitutions, timers, photography, custom recipes and cloud sync.

---

## 简体中文

SIPS · 微醺手册是一个以家庭酒柜为起点的鸡尾酒探索与调制教学网站。采用暖白与植物绿的杂志风格，酒瓶与酒杯均为本地 SVG，不依赖图片 API。

网站**默认中文**，点击顶部的 **EN / 中文** 按钮切换语言。语言选择会保存在本机，配方、材料、筛选和调制步骤均支持中英文。

### 本地运行

先安装 **Node.js 22 或更新版本**，在包含 `package.json` 的项目目录中打开终端：

```bash
npm ci
npm run dev
```

在浏览器中打开 Vite 输出的本地地址，并保持终端开启。

**Windows PowerShell：**如果提示禁止运行 `npm.ps1`，请使用 `npm.cmd ci` 和 `npm.cmd run dev`。从 GitHub 下载 ZIP 后，请先解压，进入包含 `package.json` 的文件夹，按 **Alt + D**，输入 `powershell`，再按回车。

```bash
npm run build  # TypeScript 检查及生产构建
npm test       # 酒柜匹配、补货推荐及翻译覆盖测试
npm run preview
```

在受管理的云工作区中，如果默认 npm 缓存无法写入，可使用 `npm ci --cache /tmp/sips-npm-cache`。

### 已包含

- 电脑端：抽酒后自动倒酒、酒瓶淡出，展示成杯和配方入口；保留轻微鼠标跟随，滚动页面不控制倒酒。
- 手机及触屏端：仅向右拖动酒瓶，倾角越大流速越快；向左滑动不倒酒，松手停止并回正，已倒入的酒保留。上下滑动正常滚动页面；键盘可按住空格或回车倒酒。
- 随机抽取真实配方，一轮内不重复；可选择全部 102 款或仅抽酒柜能调的酒，杯型、配色、装饰和配方入口同步变化。
- “减少动态效果”模式使用静态姿态替代连续动画；手机切到后台或手势取消时停止倒酒。根据屏幕宽度及指针能力切换控制方式。
- 覆盖 IBA 名单快照的 102 款配方，按基酒、风味、名称和材料筛选。
- 固定 20 款常见热门酒标记“编辑之选”，搜索、筛选和收藏时保持对应关系；它是本站精选，不是权威热度排名。
- 酒柜材料管理、完整配方匹配、缺失材料数量与补货建议。
- 配方详情、1–8 杯用量换算及分步教学。
- 中英文切换与本地语言偏好保存。
- 本地保存酒柜与收藏，移动端布局、键盘焦点和减少动态效果支持。

### 浏览器交互测试

```bash
npx playwright install chromium
npm run test:e2e
```

自动测试包括桌面及 iPhone 尺寸的触屏 Chromium，验证电脑自动成杯、手机仅右拖倒酒及松手停止、正常上下滚动、键盘操作、随机配方联动、减少动态效果、手机控件边界、编辑标签、旧收藏及范围用量。这是浏览器模拟验证，尚未在实体 iPhone / Safari 上测试。如果云环境已安装 Chromium，可通过 `CHROMIUM_PATH` 指定可执行文件。

### 配方来源

当前酒单覆盖 [matt-parish/iba-cocktails](https://github.com/matt-parish/iba-cocktails/tree/cb781316c6a9579648ba54360917b8a35ea975b2) 在 **2025 年 9 月 20 日**保存的 IBA 名单，**共 102 款、三个分类各 34 款**，并与 [kolaente/iba-cocktails-list](https://github.com/kolaente/iba-cocktails-list/tree/92cbe7f40d0fee14b37ca7a3e938c8ce070242a2) 的 2025 年 8 月快照交叉核对。这是第三方快照，**未实时核验 2026 年 IBA 官网，也不是 Difford’s Guide 的配方版本**。

- 新增 57 款配方；45 款重合酒款保留原有用量和标识，原来源为 [teijo/iba-cocktails](https://github.com/teijo/iba-cocktails/tree/5f1e5dd4a2189adc3854a51d7b48640bd86e9f76)，按 1 cl = 10 ml 换算。名单齐全不代表旧版配方的用量已全部更新为最新版本。Spritz 沿用 `spritz-veneziano` 标识。
- 名单之外的五款历史配方（Screwdriver、Yellow Bird、Golden Dream、God Mother、God Father）仍可从已有收藏打开，不进入默认列表或随机抽选。原有 50 个标识均可继续使用。
- 保留原文的范围、分数和定性用量。IBA Tiki 来源中的菠萝汁 90、青柠汁 30 未注明单位，详情明确标注，不推测成 ml。Three Dots and a Dash 原文连在一起的多香果利口酒与青柠汁条目已拆分，用量不变。
- 步骤经过转述与翻译，时间、难度、风味、配色、简化杯型及编辑之选为本站编辑信息；未使用来源照片。

每款详情均提供固定版本来源。`data/sources/iba-2025-snapshot.json` 保存相关原始事实，`iba-catalog-coverage.json` 记录名单、别名、保留标识与规范化说明，`iba-provenance.json` 保留原始 50 款数据核对记录。新增来源的 MIT 声明保存在 `data/sources/licenses/iba-scraper-MIT.txt`。

### 继续修改

| 文件 | 用途 |
| --- | --- |
| `src/main.tsx` | 页面、卡片插画与配方弹窗 |
| `src/MixStudio.tsx` | 共享插画、双端提示和随机调酒工作台 |
| `src/usePourController.ts` | 电脑自动成杯及手机右拖手势控制 |
| `src/mix-utils.ts` | 不重复抽选、瓶口与酒流统一坐标、装饰选择 |
| `src/mix-studio.css` | 工作台布局及手机触控区域 |
| `src/style.css` | 颜色、排版、响应式样式 |
| `src/data.ts` | 数据类型、材料匹配和补货推荐 |
| `src/cocktails.json` | 102 款双语配方、用量与固定版本来源链接 |
| `src/historical-cocktails.json` | 为旧收藏保留的五款历史配方 |
| `src/editors-choice.ts` | 20 款编辑之选的固定标识 |
| `src/catalog-translations.json` | 新增材料、单位和分类翻译 |
| `src/i18n.tsx` | 语言状态、界面翻译及英文配方教学 |
| `src/data.test.ts` | 核心匹配逻辑测试 |
| `src/i18n.test.ts` | 翻译与配方完整性测试 |
| `src/mix-utils.test.ts` | 随机抽选、倒酒几何及装饰测试 |

**技术栈：**React 19、TypeScript、Vite、Lucide、原生 CSS、Vitest。

无需后端、账号或付费服务；Google Fonts 为可选增强，加载失败时使用本机字体。酒柜初始为空，按需勾选。默认有冰块，其他列出的必需材料（包括配方列明的水）均参与匹配。可选材料与装饰材料不影响匹配；未注明精确用量的材料，在份数变化时保留原本的定性用量。份数换算按线性比例显示，多杯调制建议分批摇和。配方为常见做法，具体风味可按个人口味调整。

后续可扩展更多配方、材料替代、计时器、真实照片、自定义配方和云端同步。
