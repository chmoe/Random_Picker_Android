# 🎲 Random Picker Android

> A tiny cutie that loves making decisions for you.

---

## English Version

[English Version]() | [中文版](#中文版)

### 🌈 Overview

**Random Picker Android** is a light, sparkly helper built with **Capacitor**. Everything lives on one adorable screen: type your options, tap the shiny button, and let luck sprinkle glitter on a winner.

![App preview](images.png)

Use it when you cannot decide who cleans the dishes, picks the playlist, or buys the next bubble tea. Random Picker will happily choose for you.

### ✨ Features

- 🎀 Charming single-screen layout with animated title, collapsible input card, and rotating pastel themes.
- 🎯 Smart parsing that accepts commas or line breaks, trims stray spaces, and quietly skips empty entries.
- 🔢 Adjustable pick count with built-in validation, cheerful toasts, and optional haptic feedback.
- 📋 Friendly “copy result” button powered by the Clipboard API plus a graceful fallback.
- 🤖 Capacitor foundation so the same code powers the Android app or a simple static web page in `www/`.

### 🚀 Quick Start

```bash
# install dependencies
npm install

# sync the Capacitor Android project
npx cap sync android

# open the native project in Android Studio or run directly
npx cap open android
# or
npx cap run android
```

Prefer to peek inside a browser first? Open `www/index.html` directly or run a tiny static server such as `npx serve www`.

### 🗂 Project Structure

- `www/` – HTML, CSS, and JS for the delightful picker interface, themes, toasts, and clipboard logic.
- `android/` – Capacitor-generated native project ready for Android Studio builds and signing.
- `images.png` – Screenshot used in this README; feel free to swap in your own cute artwork.

### 🎨 Customization Ideas

- Edit `www/index.html`, `styles.css`, or `script.js` to change copy, layout, or picker behavior; rerun `npx cap sync android` afterward.
- Update `capacitor.config.json` plus the Android package name if you want a new app title or bundle ID.
- Replace `images.png` whenever you produce fresher visuals so the README stays on-brand.

---

## 中文版

[English Version](#english-version) | [中文版]()

### 🌈 简介

**Random Picker Android** 是一个基于 **Capacitor** 构建的轻量级随机抽取工具。
它拥有 **单屏可爱 UI**，让你在一页之内完成输入、抽取和结果展示 ✨

![App preview](images.png)


无论是：  

- 聚会点名 🎉
- 今天吃什么 🍔
- 谁来当幸运儿 🍀

它都会用“随机的力量”帮你愉快决定～

### ✨ 功能亮点

- 🎀 单屏可爱布局，闪闪发光的标题、可折叠输入卡片与轮换的马卡龙主题。
- 🎯 聪明的文本解析，可用逗号或换行分隔，自动去除多余空格与空项。
- 🔢 支持自定义抽取数量，配合校验逻辑、小提示 Toast 与可用设备上的触觉反馈。
- 📋 一键复制结果，原生 Clipboard API 加回退方案，贴心提示复制是否成功。
- 🤖 基于 Capacitor，可打包为 Android App，也能直接从 `www/` 文件夹当网页运行。

### 🚀 快速开始

```bash
npm install
npx cap sync android
npx cap open android   # 在 Android Studio 中构建或调试
```
👀 想先偷看效果？
你可以直接打开`www/index.html`，或者用任意静态服务器：

```bash
npx serve www
```

### 🗂 项目结构

- `www/` – 页面与交互脚本，包含主题、Toast、复制逻辑等。
- `android/` – 原生项目，可在 Android Studio 中签名与发布。
- `images.png` – README 展示用的截图，欢迎换成自己的可爱图片。

### 🎨 自定义建议

- 修改 `www/index.html`、`styles.css`、`script.js` 即可自定义文案、样式或抽取规则，记得随后执行 `npx cap sync android`。
- 若需更换 App 名称或包名，更新 `capacitor.config.json` 以及 `android/` 内对应包结构。
- 替换 `images.png` 以保持 README 里的预览与实际界面同步。

祝玩得开心，也欢迎继续延伸更多随机玩法！💖
