# aicheckout

Vivid, playful, Instagram-ish shop with tappable Stories, bottom app-style nav, and a products feed. Everything is static (vanilla HTML/CSS/JS) so it **runs on GitHub Pages** with no build step.

## Quick start
1. Copy all files into your GitHub repo exactly as in the tree.
2. Commit & push. If using GitHub Pages, set Source to `main` / root.
3. Drop your media into:
   - Images → `/assets/img/`
   - Story media → `/assets/stories/`
   - Product videos → `/assets/video/`
4. Update `/data/products.json` and `/data/stories.json` or just replace the placeholder media files with the same filenames.

**Images:** .webp (or .jpg) — 1080×1350 portrait, 1080×1080 square, 1920×1080 wide.  
**Videos:** .mp4 (H.264 + AAC) or .webm. Keep each under 10–15 MB.

## Shopify button (later)
Buttons are present but disabled. When ready, swap the `<button disabled>` in `products.html` for Shopify’s Buy Button code snippet.

## PWA (optional)
This ships a basic `site.webmanifest` and `sw.js` to make it feel more “app-like” on phones. You can remove them if you don’t want caching.
