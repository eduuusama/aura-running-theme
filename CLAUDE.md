# Aura Running — Shopify Theme

Shopify 2.0 theme for **aura-running.com** (store: `smooth-sailing-store-apljc.myshopify.com`, Basic plan, USD).

## How this store is run

Everything is managed from Claude Code — theme code, products, prices, blogs, pages, discounts, analytics.

- **Theme code** (this repo): text, fonts, images, layout, CSS, sections, templates.
- **Store data** (Shopify Admin MCP connector): products, prices, inventory, collections, orders, customers, blogs, pages, metafields, discounts, analytics. Use built-in MCP tools when they exist; otherwise `graphql_query` / `graphql_mutation`.

## The publish pipeline (IMPORTANT)

The live theme is **`aura-running-theme/main`**, connected to GitHub via Shopify's GitHub integration:

```
edit files locally → preview at localhost:9292 → user approves → git push origin main → Shopify auto-syncs live (~30s)
```

- **Never create copies of the theme, never publish another theme.** Publishing = `git push`. Rollback = `git revert` + push.
- Shopify commits theme-editor (customizer) changes back to this repo as `shopify[bot]` — **always `git pull` before editing**.
- The MCP connector blocks `themePublish` by design; theme publishing is a manual admin click (should never be needed again).
- Theme ID of the GitHub-connected theme: `159492735234`. A theme named "BACKUP copy — safe to delete" (`160765640962`) may still exist; it's a verified-identical May 2026 copy, safe to delete, do not edit it.

## Local preview

Shopify CLI 4.x is installed and authenticated for edu@thinkr.pro.

```bash
shopify theme dev --store smooth-sailing-store-apljc.myshopify.com
```

- Preview at **http://127.0.0.1:9292** — hot-reloads on file save, does NOT touch the live store.
- There's a `.claude/launch.json` entry named `theme-dev` (usable via preview_start).
- Must use the permanent `.myshopify.com` domain — the vanity domain `aura-running.com` fails CLI auth.

## Gotchas

- **Liquid has no `\'` escape.** `'We\'d love'` inside a single-quoted Liquid string is a syntax error that makes the file (and any template referencing its section) silently fail to sync to Shopify. Use double quotes instead. This once hid the entire contact page for months.
- **Tailwind is precompiled.** Styling uses Tailwind classes; the compiled CSS is `assets/tailwind.min.css`, built from `tailwind-input.css` + `tailwind.config.js`. After adding NEW utility classes to liquid files, rebuild the CSS (e.g. `npx @tailwindcss/cli -i tailwind-input.css -o assets/tailwind.min.css --minify`) and commit it. Never reintroduce the Tailwind CDN (it was replaced to cut 350KB → 23KB).
- `shopify theme dev` uploads files in arbitrary order; if a template errors with "section does not refer to an existing section file" on first boot, just restart the dev server.

## Structure

Standard Shopify 2.0 layout: `sections/`, `snippets/`, `templates/` (JSON), `layout/theme.liquid`, `assets/`, `config/`, `locales/`. Product templates are per-product (`product.aura-ultra.json`, etc.). Blog/editorial content renders via `sections/article-content.liquid` + `templates/article.json`.
