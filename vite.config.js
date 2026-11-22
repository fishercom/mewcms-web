import { resolve } from 'node:path';
import { defineConfig, loadEnv } from 'vite';

/* Every page of the site: its URL path and its HTML entry. The sitemap lists them all. */
const pages = {
  '/': 'index.html',
  '/features/': 'features/index.html',
  '/developers/': 'developers/index.html',
};

/* SEO build steps for this one-page static site:
   - robots.txt and sitemap.xml, built from VITE_SITE_URL (see .env)
   - <link rel="preload"> for the fonts the hero and body text use first,
     so the hashed woff2 files start downloading with the HTML */
function seo(siteUrl) {
  const preloadFonts = [
    /cormorant-garamond-latin-300-normal-.*\.woff2$/,
    /cormorant-garamond-latin-300-italic-.*\.woff2$/,
    /jost-latin-300-normal-.*\.woff2$/,
  ];

  return {
    name: 'mewcms-seo',
    apply: 'build',
    transformIndexHtml(html, ctx) {
      if (!ctx.bundle) return html;
      const files = Object.keys(ctx.bundle);
      return preloadFonts
        .map((re) => files.find((f) => re.test(f)))
        .filter(Boolean)
        .map((file) => ({
          tag: 'link',
          attrs: { rel: 'preload', as: 'font', type: 'font/woff2', href: `/${file}`, crossorigin: '' },
          injectTo: 'head-prepend',
        }));
    },
    generateBundle() {
      const today = new Date().toISOString().slice(0, 10);
      this.emitFile({
        type: 'asset',
        fileName: 'robots.txt',
        source: `User-agent: *\nAllow: /\n\nSitemap: ${siteUrl}/sitemap.xml\n`,
      });
      this.emitFile({
        type: 'asset',
        fileName: 'sitemap.xml',
        source:
          '<?xml version="1.0" encoding="UTF-8"?>\n' +
          '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
          Object.keys(pages)
            .map((path) => `  <url>\n    <loc>${siteUrl}${path}</loc>\n    <lastmod>${today}</lastmod>\n  </url>\n`)
            .join('') +
          '</urlset>\n',
      });
    },
  };
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const siteUrl = (env.VITE_SITE_URL || 'https://www.mewcms.com').replace(/\/+$/, '');
  process.env.VITE_SITE_URL = siteUrl;

  return {
    plugins: [seo(siteUrl)],
    server: {
      port: 3000,
      open: false
    },
    build: {
      outDir: 'dist',
      sourcemap: true,
      rollupOptions: {
        input: Object.fromEntries(
          Object.entries(pages).map(([path, file]) => [path === '/' ? 'main' : path.slice(1, -1), resolve(__dirname, file)]),
        ),
      },
    }
  };
});
