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

- Cursor-following pouring animation, rising liquid, click controls and reset.
- Six classic cocktails searchable by name and ingredient, with spirit and flavor filters.
- Ingredient cabinet, recipe matching, missing-ingredient counts and shopping recommendations.
- Recipe details, quantities for 1–8 servings and step-by-step mixing guidance.
- Chinese / English switch with a saved language preference.
- Locally saved favorites and cabinet, responsive layouts, keyboard focus and reduced-motion support.

### Project structure

| File | Purpose |
| --- | --- |
| `src/main.tsx` | Page components, interactions, SVG artwork and recipe dialog |
| `src/style.css` | Colors, typography and responsive layouts |
| `src/data.ts` | Recipes, ingredients, matching and recommendations |
| `src/i18n.tsx` | Language provider, UI translations and English recipe instructions |
| `src/data.test.ts` | Matching and recommendation tests |
| `src/i18n.test.ts` | Translation and recipe coverage tests |

**Stack:** React 19, TypeScript, Vite, Lucide, CSS and Vitest.

No backend, accounts or paid services are required. Google Fonts is optional and falls back to system fonts. Your bar starts empty. Ice and water are assumed staples and excluded from matching; all other ingredients listed in a recipe count toward availability. Servings scale linearly; shake larger orders in batches. Recipes use common preparations and can be adjusted to taste.

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

- 首页鼠标跟随倒酒、液面上升、点击控制和重新倒酒。
- 六款经典配方，按基酒、风味、名称和材料筛选。
- 酒柜材料管理、完整配方匹配、缺失材料数量与补货建议。
- 配方详情、1–8 杯用量换算及分步教学。
- 中英文切换与本地语言偏好保存。
- 本地保存酒柜与收藏，移动端布局、键盘焦点和减少动态效果支持。

### 继续修改

| 文件 | 用途 |
| --- | --- |
| `src/main.tsx` | 页面、交互、SVG 插画与配方弹窗 |
| `src/style.css` | 颜色、排版、响应式样式 |
| `src/data.ts` | 配方数据、材料匹配和补货推荐 |
| `src/i18n.tsx` | 语言状态、界面翻译及英文配方教学 |
| `src/data.test.ts` | 核心匹配逻辑测试 |
| `src/i18n.test.ts` | 翻译与配方完整性测试 |

**技术栈：**React 19、TypeScript、Vite、Lucide、原生 CSS、Vitest。

无需后端、账号或付费服务；Google Fonts 为可选增强，加载失败时使用本机字体。酒柜初始为空，按需勾选。冰块和水为默认基础用品，不参与匹配；配方中列出的其他材料均参与匹配。份数换算按线性比例显示，多杯调制建议分批摇和。配方为常见做法，具体风味可按个人口味调整。

后续可扩展更多配方、材料替代、计时器、真实照片、自定义配方和云端同步。
