# SIPS · The Cocktail Handbook

[English](#english) · [简体中文](#简体中文)

## English

A cocktail discovery and mixing guide built around your home bar. Warm colors, SVG illustrations and interactive pouring bring each recipe to life.

The website defaults to **Chinese**, with an **EN / 中文** switch. Favorites, ingredients and language preferences are saved locally.

### Features

- 102 cocktails, 20 editor’s picks, and spirit / flavor filters.
- Ingredient categories, Chinese / English search and recipe matching.
- Random cocktail selection without repeats within a round.
- Mouse-controlled bottle movement on desktop; drag right to pour on mobile.
- Step-by-step recipes, quantities for 1–8 servings and saved favorites.
- Missing-ingredient chips on hover / tap, plus bilingual origin and style notes with further reading.

### Get started

Requires **Node.js 22+**. Run in the folder containing `package.json`:

```bash
npm ci
npm run dev
```

Open the local URL printed in the terminal. On Windows, use `npm.cmd` if PowerShell blocks `npm`.

### Checks

```bash
npm run build                  # Type check and production build
npm test                       # Unit tests
npx playwright install chromium
npm run test:e2e                # Desktop and touch-browser tests
```

**Built with:** React 19 · TypeScript · Vite · CSS · Lucide · Vitest · Playwright

### Recipe sources

The catalog covers a September 2025 snapshot of the 102-entry IBA list, using [matt-parish/iba-cocktails](https://github.com/matt-parish/iba-cocktails/tree/cb781316c6a9579648ba54360917b8a35ea975b2) and existing recipe variants from [teijo/iba-cocktails](https://github.com/teijo/iba-cocktails/tree/5f1e5dd4a2189adc3854a51d7b48640bd86e9f76). It has not been verified against the current official list. Source records and license notices are in [data/sources](data/sources/); each recipe links to its versioned source. Illustrations are local SVGs.

---

## 简体中文

SIPS · 微醺手册是一个围绕家庭酒柜设计的鸡尾酒探索与调制教学网站，以暖色调、SVG 插画和倒酒互动呈现配方。

网站**默认中文**，支持 **EN / 中文** 切换。收藏、酒柜材料和语言偏好保存在本机。

### 核心功能

- 102 款鸡尾酒、20 款编辑之选，支持基酒与风味筛选。
- 材料分类、中英文搜索与酒柜配方匹配。
- 随机推荐酒款，一轮内不重复。
- 电脑端鼠标控制酒瓶，手机端向右拖动倾倒。
- 分步教学、1–8 杯用量换算及本地收藏。
- 悬停或点击查看缺失材料卡片；每款详情包含双语来历或风格背景及延伸阅读。

### 本地运行

安装 **Node.js 22+**，在包含 `package.json` 的文件夹中运行：

```bash
npm ci
npm run dev
```

打开终端输出的本地地址。Windows PowerShell 如拦截 `npm`，可改用 `npm.cmd`。

构建与测试命令见上方 [Checks](#checks)。

**技术栈：**React 19 · TypeScript · Vite · CSS · Lucide · Vitest · Playwright

### 配方来源

酒单覆盖 2025 年 9 月保存的 102 款 IBA 名单快照，采用 [matt-parish/iba-cocktails](https://github.com/matt-parish/iba-cocktails/tree/cb781316c6a9579648ba54360917b8a35ea975b2) 及原有 [teijo/iba-cocktails](https://github.com/teijo/iba-cocktails/tree/5f1e5dd4a2189adc3854a51d7b48640bd86e9f76) 配方版本，尚未与最新官方名单核验。来源记录和许可声明保存在 [data/sources](data/sources/)，每款配方均提供固定版本来源链接。插画使用本地 SVG。
