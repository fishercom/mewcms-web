# MewCMS Web

> The landing page for **MewCMS**, the open-source content system for teams who run many sites in many languages. *Elegance, built in.*

Developed as an open-source initiative by **[DeepSoft](https://deepsoft.lat)**.

---

## Links

- **Live demo:** [https://mewcms.onrender.com](https://mewcms.onrender.com)
- **CMS repository:** [https://github.com/fishercom/mewcms](https://github.com/fishercom/mewcms)
- **License:** [MIT](LICENSE)

---

## What the page covers

- A full-screen hero film (a white cat on a dark stage with purple neon) that ends on the slogan
- Six chapters: multi-site and themes, the block editor, the AI writing assistant, languages, the admin, and security/SEO/performance
- A grid of the smaller features and a short section for developers

## Design notes

- Dark plum background `#0B0910`, one neon purple accent `#B76CFF`
- Titles in Cormorant Garamond, text in Jost Light, both self-hosted through `@fontsource` (latin subset only)
- Scroll reveals use `opacity` and `transform` only, from one small IntersectionObserver; everything is off with `prefers-reduced-motion`
- The hero video (white cat, DeeVid AI export without watermark) lives in `public/assets/hero/` (`hero-cat.mp4` + `hero-poster.webp`/`.jpg`, the poster being the video's last frame). It loads after the page has painted
- The logo is the CMS "code cat" in ivory with neon eyes: `public/assets/brand/mark.svg`, `public/favicon.svg`, `public/apple-touch-icon.png`

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

This project is licensed under the **MIT License** — free for personal, educational, and commercial use. Developed by **DeepSoft**.
