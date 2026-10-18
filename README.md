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

- One-tap random cocktail reveal: a short automatic pour, a retreating bottle and a finished drink with a recipe link. The illustration itself is not a button; there are no playback controls or percentage meters. Desktop pointers add subtle movement.
- Random recipes drawn without replacement; choose all 50 cocktails or only recipes available in your bar. Glass shape, color, garnish and recipe link follow the selected drink.
- Reduced-motion mode shows the finished drink immediately. Background tabs pause and resume the reveal automatically.
- Fifty classic cocktails searchable by name and ingredient, with spirit and flavor filters.
- Ingredient cabinet, recipe matching, missing-ingredient counts and shopping recommendations.
- Recipe details, quantities for 1–8 servings and step-by-step mixing guidance.
- Chinese / English switch with a saved language preference.
- Locally saved favorites and cabinet, responsive layouts, keyboard focus and reduced-motion support.

### Browser interaction tests

```bash
npx playwright install chromium
npm run test:e2e
```

The tests run desktop and touch-enabled iPhone-size Chromium projects. They check automatic reveals, random recipe linkage, empty / single-recipe bars, reduced motion and mobile control bounds. This is browser emulation, not a claim of physical iPhone / Safari testing. If Chromium is already installed in a managed environment, set `CHROMIUM_PATH` to its executable path.

### Recipe sources

The 50 recipes use the publicly accessible [teijo/iba-cocktails](https://github.com/teijo/iba-cocktails) compilation at commit `5f1e5dd4a2189adc3854a51d7b48640bd86e9f76`. This is a third-party IBA compilation, **not a verification against the current IBA website and not Difford’s Guide recipes**. Ingredient measures are converted from cl to ml (1 cl = 10 ml). Instructions are paraphrased and translated. Necessary ingredients mentioned in preparation are included; garnishes appear in the steps. Time estimates, flavor labels, colors and simplified glass artwork are editorial. Each recipe links to the pinned source, and `data/sources/iba-provenance.json` records the original ingredient facts used for verification.

### Project structure

| File | Purpose |
| --- | --- |
| `src/main.tsx` | Page components, card artwork and recipe dialog |
| `src/MixStudio.tsx` | Touch / pointer pouring controls and random cocktail studio |
| `src/mix-utils.ts` | Shuffle bag, shared bottle / stream geometry and garnish selection |
| `src/mix-studio.css` | Studio layout and mobile touch targets |
| `src/style.css` | Colors, typography and responsive layouts |
| `src/data.ts` | Types, matching and recommendations |
| `src/cocktails.json` | 50 bilingual recipes, measures and pinned source links |
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

- 点“今晚喝什么”随机抽酒后，自动倒酒、酒瓶退场，再展示成杯和配方入口。酒杯插画无需点击，界面不设播放控件或百分比；电脑端保留轻微鼠标跟随。
- 随机抽取真实配方，一轮内不重复；可选择全部 50 款或仅抽酒柜能调的酒，杯型、配色、装饰和配方入口同步变化。
- “减少动态效果”模式直接展示成杯；切到后台时暂停，返回后自动继续。
- 50 款经典配方，按基酒、风味、名称和材料筛选。
- 酒柜材料管理、完整配方匹配、缺失材料数量与补货建议。
- 配方详情、1–8 杯用量换算及分步教学。
- 中英文切换与本地语言偏好保存。
- 本地保存酒柜与收藏，移动端布局、键盘焦点和减少动态效果支持。

### 浏览器交互测试

```bash
npx playwright install chromium
npm run test:e2e
```

自动测试包括桌面及 iPhone 尺寸的触屏 Chromium，验证自动成杯、随机配方联动、空酒柜及单配方酒柜、减少动态效果和手机控件边界。这是浏览器模拟验证，尚未在实体 iPhone / Safari 上测试。如果云环境已安装 Chromium，可通过 `CHROMIUM_PATH` 指定可执行文件。

### 配方来源

50 款配方采用可访问的 [teijo/iba-cocktails](https://github.com/teijo/iba-cocktails) 公开整理数据，固定版本为 `5f1e5dd4a2189adc3854a51d7b48640bd86e9f76`。它是第三方整理的 IBA 配方，**未与当前 IBA 官网核验，也不是 Difford’s Guide 的配方版本**。按 1 cl = 10 ml 转换用量，制作步骤经过转述及翻译。原文做法中提及的必需材料已补入清单，装饰材料在步骤中说明。时间、风味分类、颜色与简化杯型为编辑信息。每款详情都提供固定版本来源链接，`data/sources/iba-provenance.json` 保存用于核对的原始材料事实。

### 继续修改

| 文件 | 用途 |
| --- | --- |
| `src/main.tsx` | 页面、卡片插画与配方弹窗 |
| `src/MixStudio.tsx` | 触屏及鼠标倒酒操作、随机调酒工作台 |
| `src/mix-utils.ts` | 不重复抽选、瓶口与酒流统一坐标、装饰选择 |
| `src/mix-studio.css` | 工作台布局及手机触控区域 |
| `src/style.css` | 颜色、排版、响应式样式 |
| `src/data.ts` | 数据类型、材料匹配和补货推荐 |
| `src/cocktails.json` | 50 款双语配方、用量与固定版本来源链接 |
| `src/i18n.tsx` | 语言状态、界面翻译及英文配方教学 |
| `src/data.test.ts` | 核心匹配逻辑测试 |
| `src/i18n.test.ts` | 翻译与配方完整性测试 |
| `src/mix-utils.test.ts` | 随机抽选、倒酒几何及装饰测试 |

**技术栈：**React 19、TypeScript、Vite、Lucide、原生 CSS、Vitest。

无需后端、账号或付费服务；Google Fonts 为可选增强，加载失败时使用本机字体。酒柜初始为空，按需勾选。默认有冰块，其他列出的必需材料（包括配方列明的水）均参与匹配。可选材料与装饰材料不影响匹配；未注明精确用量的材料，在份数变化时保留原本的定性用量。份数换算按线性比例显示，多杯调制建议分批摇和。配方为常见做法，具体风味可按个人口味调整。

后续可扩展更多配方、材料替代、计时器、真实照片、自定义配方和云端同步。
