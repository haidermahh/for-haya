# 🔮 For Haya ✨ — 3D Interactive Celestial Keepsake

A single-viewport, ultra-premium 3D WebGL interactive birthday gift experience crafted for **Haya** (born May 5, 2009).

> *"Some wishes refuse to be bound by a calendar. Yours is already written across the stars."*

Built with **pure HTML5, CSS3, and JavaScript with Three.js (via CDN)**. No build tools, no bundlers, zero external image dependencies. Ready for 1-click deployment on **Vercel** or **Cloudflare Pages**.

---

## 💜 Aesthetic & Creative Direction

- **Single 3D Viewport**: Not a long scroll story — an intimate, immersive 3D digital keepsake she holds, drags, and explores with her hands.
- **Strict Royal Purple & Amethyst Spectrum**: Completely zero gold or amber tones anywhere:
  - Deep Amethyst & Royal Purple: `#6C3483`, `#7D3C98`
  - Soft Orchid & Lavender: `#9B59B6`, `#B497D6`
  - Pale Lilac & Starlight: `#E8D5F5`, `#F5EFFF`
  - Midnight Obsidian Void: `#08040D`, `#0D0814`
- **Living Particle Galaxy**: Thousands of glowing violet, lilac, and orchid motes drifting in 3D space with subtle mouse and gyro parallax reaction.
- **Floating 3D Glass Keepsake Card**:
  - Centerpiece 3D card gently floating with idle breathing animations and rim light.
  - Multi-touch & mouse drag with momentum inertia to rotate 360° freely.
  - **Front Face**: Dedicated to **"Haya Madam G 🎀👀"** in high-resolution engraved serif typography with celestial filigree.
  - **Facets / Turns**: Unfolds poetic lines as she rotates through, revealing reflections on her quiet brilliance, unfolding horizons, and birthday blessings.
  - **Back Face**: Timeless closing signature with dynamic current date.
- **"Make a Wish" Particle Burst**: Tapping the glowing wish orb triggers a radial 3D stardust burst from the card and opens an illuminated blessing modal.
- **Web Audio API Engine**: Built-in procedural harmonic synthesizer generating gentle ethereal ambient chimes (muted by default, autoplay-safe).
- **Designer Signature**: Elegant subtle credit: *"Made With ❤️ By Haider — Turning code into feelings."*

---

## 🚀 3-Step Deployment Guide

### Option 1: Vercel (Recommended)
1. Go to [vercel.com](https://vercel.com) and log in with your GitHub account.
2. Select **"Import Project"** from your GitHub repository `haidermahh/for-haya`.
3. Keep all build settings at default (Framework Preset: **Other**, Build Command: empty, Output Directory: `.`), and click **Deploy**.
   - Your site will deploy instantly with continuous deployment on every git push!

### Option 2: Cloudflare Pages
1. Go to [dash.cloudflare.com](https://dash.cloudflare.com) and navigate to **Workers & Pages**.
2. Click **Create application** > **Pages** > **Connect to Git** (or select **Upload assets** for drag-and-drop).
3. Connect your `for-haya` repository, leave the build settings empty, and click **Save and Deploy**.

---

## 📱 Mobile Performance & Optimization

- **Dynamic Particle Throttling**: Particle counts dynamically scale between desktop (2,500) and mobile (1,000) for smooth 60fps performance on mid-range devices.
- **Single-Finger Touch Drag**: Intuitive touch controls with inertia damping and tilt clamping.
- **Fixed Viewport Architecture**: `height: 100svh; overflow: hidden;` prevents mobile browser chrome bounce and accidental scrolling.
- **Dual Event Handlers**: All buttons listen for both `click` and `touchend` events to guarantee zero dropped interactions on touchscreens.
