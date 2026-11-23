# MewCMS Web

> The landing page for **MewCMS**, the open-source content system for teams who run many sites in many languages. *Elegance, built in.*

Developed as an open-source initiative by **[DeepSoft](https://deepsoft.lat)**.

---

## Links

- **Live demo:** [https://mewcms.onrender.com](https://mewcms.onrender.com)
- **CMS repository:** [https://github.com/fishercom/mewcms](https://github.com/fishercom/mewcms)
- **License:** [GNU AGPL v3](LICENSE) (AGPL-3.0-only), the same as the CMS

---

## What the page covers

- A full-screen hero film (a white cat on a dark stage with purple neon) that ends on the slogan
- Six chapters: multi-site and themes, the block editor, the AI writing assistant, languages, the admin, and security/SEO/performance. Each one shows a real dark-mode capture of the admin (Sites, block picker, AI assistant, Translations, Dashboard, SEO tab), stored as 1440 px WebP files in `public/assets/shots/` and lazy-loaded
- A grid of the smaller features and a short section for developers
- Two inner pages with the same design: `/features/` (every feature in more depth) and `/developers/` (stack, install, themes, blocks and translations). Each is a folder with its own `index.html`, listed in `pages` in `vite.config.js`, which also feeds the sitemap
- A footer with the MewCMS logo, a link to the AGPL-3.0 license and the credit "WebSite developed by deepsoft"
- English only: there is no language switcher

## Design notes

- Dark plum background `#0B0910`, one neon purple accent `#B76CFF`
- Titles in Cormorant Garamond, text in Jost Light, both self-hosted through `@fontsource` (latin subset only)
- Scroll reveals use `opacity` and `transform` only, from one small IntersectionObserver; everything is off with `prefers-reduced-motion`
- The hero video (white cat, DeeVid AI export without watermark) lives in `public/assets/hero/` (`hero-cat.mp4` + `hero-poster.webp`/`.jpg`, the poster being the video's last frame). It loads after the page has painted
- The logo is the MewCMS logo, copied from the CMS repo (`public/brand/`): `public/assets/brand/lockup-dark.svg` (header and footer, dark background), `lockup-light.svg` (for light backgrounds), `mark.svg` / `mark-dark.svg` (icon only), plus `public/favicon.svg` and `public/apple-touch-icon.png`. The wordmark is outlined, so no font is needed.

## SEO

- The public address lives in `.env` as `VITE_SITE_URL` (default `https://www.mewcms.com`, no trailing slash). The build uses it for the canonical URL, the Open Graph/Twitter tags, the JSON-LD and the generated `robots.txt` and `sitemap.xml`. Override it per deploy with an environment variable of the same name
- `index.html` carries the title, description, canonical, Open Graph and Twitter tags, and a JSON-LD graph (`Organization` for DeepSoft, `WebSite`, `SoftwareApplication` for MewCMS)
- The share image is `public/assets/og/mewcms-og.jpg` (1200×630)
- The build preloads the three fonts the first screen uses (Cormorant Garamond 300 and 300 italic, Jost 300)

---

## Local development

```bash
# Clone the repository
git clone https://github.com/fishercom/mewcms-web.git
cd mewcms-web

# Install dependencies
npm install

# Run development server
npm run dev

# Build production bundle
npm run build
```

---

## License

This website and MewCMS itself are free software under the **[GNU Affero General Public License v3.0](LICENSE)** (AGPL-3.0-only). If you modify this code and serve it over a network, you must offer its users the source of your modified version under the same license. Developed by **DeepSoft**.
