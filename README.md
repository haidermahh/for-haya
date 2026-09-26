# 🕯️ For Haya — A Timeless Tribute ✨

An ultra-premium, cinematic digital tribute and belated birthday celebration website crafted for **Haya** (born May 5, 2009).

> *"Though the calendar page has turned, genuine wishes hold no expiration."*

Built with **pure HTML5, CSS3, and modern JavaScript** (zero build tools, zero dependencies, no frameworks). Deployable directly to **Vercel** or **Cloudflare Pages** in seconds with 100% static hosting.

---

## ⚜️ Creative Direction & Aesthetic

- **Color Palette**: Obsidian black & deep espresso backgrounds (`#08070A`, `#0E0D13`), brushed gold-foil typography (`#D4AF37`), warm champagne accents (`#F3E5AB`), and soft gold glow shadows.
- **Typography**: Displayed in **Cormorant Garamond** (timeless editorial serif) paired with **Jost** (clean geometric sans-serif), loaded via Google Fonts.
- **Micro-Interactions**: Slow, luxurious easing curves (`cubic-bezier(0.16, 1, 0.3, 1)`), subtle film grain texture, and slow-drifting gold dust motes.
- **Belated Framing**: Crafted specifically with the understanding that her birthday has already passed this year—framing the message as an enduring, timeless celebration of her character, growth, and the luminous chapter ahead.

---

## 🏛️ Sections Included

1. **Hero Introduction (`#hero`)**:
   - Small gold kicker line: `FOR HAYA • BORN MAY 5, 2009`.
   - Large serif display headline: *"A Celebration of You"*.
   - Thoughtful belated message acknowledging that wishes are timeless.
   - Minimalist scroll prompt with a pulsing vertical gold line.

2. **A Moment to Celebrate (`#celebrate`)**:
   - Minimalist line-art candle illustration in gold with an ethereal, softly swaying flame and ambient halo.
   - Interactive button: **"Make a wish, even now"**.
   - Triggers a slow, radial burst of shimmering gold light particles and reveals the quote:
     > *“Some wishes don't need a date. Yours is already coming true.”*

3. **Heartfelt Letter (`#letter`)**:
   - Glassmorphism letter card with fine gold hairline dividers and a golden wax seal (`H`).
   - A genuine, beautifully written personal message for Haya honoring her kindness, easy laughter, and inner resilience.
   - Line-by-line cinematic fade-and-rise entrance animation powered by Intersection Observer.

4. **Reflections of Grace Gallery (`#gallery`)**:
   - 3 glass-framed memory cards with subtle 3D hover-tilt and deep gold/obsidian gradient placeholders.
   - Marked with clear code comments showing where to drop in real `<img>` tags if desired.

5. **Whispered Wishes Orbs (`#orbs`)**:
   - 5 floating gold orbs orbiting gently on independent sinusoidal float paths.
   - Tapping an orb smoothly expands it into a tender blessing for her journey ahead.

6. **Closing & Signature (`#closing`)**:
   - Closing line: *"Made with love, thinking of you — always."* with a pulsing gold heart monogram.
   - Dynamically generated date caption: *"Sent on [Current Date] — though the wish is timeless."*

7. **Harmonic Sound Engine (Web Audio API)**:
   - Built-in synthesizer that generates soft, meditative pentatonic chimes on demand.
   - Zero external audio files—100% reliable offline, zero CORS or 404 errors.

---

## 🚀 3-Step Deployment Guide

### Option 1: Vercel (Instant Drag & Drop)
1. Go to [vercel.com](https://vercel.com) and log in.
2. Click **"Add New..."** > **"Project"**.
3. Drag and drop the `Wish` folder into the upload window, and click **Deploy**. Your site will be live instantly with a free HTTPS `.vercel.app` URL.

### Option 2: Cloudflare Pages
1. Go to [dash.cloudflare.com](https://dash.cloudflare.com) and navigate to **Workers & Pages**.
2. Click **Create application** > **Pages** > **Upload assets**.
3. Name your project (e.g. `for-haya`), drop in the `Wish` folder, and click **Deploy site**.

---

## 📷 Swapping in Real Photos (Optional)

In `index.html`, locate **SECTION 4: MEMORY GALLERY SECTION (`#gallery`)**.

Each card contains a comment:
```html
<!-- PHOTO SWAP PLACEHOLDER:
     To swap in a real photograph, replace the div.gallery-art with:
     <img src="your-photo.jpg" alt="Haya" class="gallery-photo"> -->
```
Place your photo in the directory and replace the `<div class="gallery-art ...">` element with your `<img>` tag. The rounded borders, glass frame, and hover effects will remain intact automatically.
