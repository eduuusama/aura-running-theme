# Overnight SEO fix run — 2026-08-28

Branch: `seo-audit-fixes` — **committed but NOT pushed.** Pushing to `main` deploys straight
to the live theme, which is a production deploy, so it is held for review.

## Status

| # | Task | Status |
|---|---|---|
| 1 | Product pages render two `<h1>` | DONE, verified |
| 2 | Homepage H1 "Balmfor" spacing bug | DONE, verified |
| 3 | Breadcrumb JSON-LD hardcoded "Editorial" | DONE, verified |
| 4 | blog-hero alt hardcoded "Editorial" | DONE, verified |
| 5 | Article JSON-LD author hardcoded to org | DONE, verified (see note) |
| 6 | Publisher logo URL protocol-relative | DONE, verified vs production |
| 7 | Empty settings_schema.json → sameAs always `[]` | DONE (needs social URLs from user) |
| 8 | Ingredients blog 0/16 SEO + FAQ schema | DONE — 16/16 verified live |
| 9 | 2 collections + 4 pages missing SEO | DONE — verified live |
| 10 | Missing/mismatched redirects | Already fixed; verified, GSC re-validation started |
| 11 | Two possible cannibalizing article pairs | BLOCKED — needs user decision |

## Theme code (tasks 1-7) — on branch, awaiting push

- `sections/product-hero.liquid` — one `sr-only` `<h1>` outside both layout trees; the two
  visible titles are now styled `<p>`. Chosen over demoting one in place, which would have
  left desktop (or mobile) screen-reader users with no H1 at all. Verified 1 H1 at both
  viewports, styling byte-identical (28px Inter, -0.28px tracking on mobile).
- `templates/index.json` — space before `<br>`; textContent now "Balm for", was "Balmfor".
- `snippets/meta-tags.liquid` — breadcrumb uses `blog.title`/`blog.url` (verified: renders
  "Ingredients" on ingredient articles, "Editorial" on editorial ones); author uses a real
  byline but falls back to Organization for the shop name and for "Shopify API"; publisher
  logo prefixed `https:`.
- `sections/blog-hero.liquid` — alt: `image.alt → heading → blog.title → 'Editorial'`.
- `config/settings_schema.json` — was `[]`. Now defines all 5 referenced global settings.
  Caught during verification that Shopify **requires** `theme_documentation_url` in
  `theme_info`; without it the theme fails to upload. Fixed before commit.
- `layout/theme.liquid` — `sameAs` builds a valid JSON array and includes TikTok.

Regression checked: all page types return 200 with exactly one H1 and no Liquid errors;
editorial articles still emit Article + BreadcrumbList + FAQPage + Organization cleanly.

## Store data (tasks 8-9) — live now, no deploy needed

- 16/16 Ingredients articles: `global.title_tag` (50-60 chars), `global.description_tag`
  (150-160), `custom.faq_json` (4-5 FAQs as literal Google queries, grounded only in each
  article's own body). Independently verified on the live site: all render valid FAQPage
  JSON-LD, correct counts, on-topic per ingredient, no drug-claim terms, no duration claims.
- 2 collections + 4 pages: SEO title and description set and verified live.
  `/collections/all` previously shipped with no meta description at all.

## Verification notes worth keeping

- Task 6 could not be proven on the local preview: `shopify theme dev` rewrites CDN asset
  URLs to local relative paths, so the `https:` prefix is invisible locally. Proved instead
  against production, where the identical pre-existing pattern on the Organization logo
  renders `https://aura-running.com/cdn/...` while the unfixed one renders `//aura-running...`.
- Two subagents briefly collided on a scratchpad filename. That is why every one of the 16
  articles was re-checked for cross-contamination against its own ingredient. None found.
- GSC "Referring page: None detected" for /blogs/ingredients is NOT an orphaned-page problem
  — the hub is linked from every page checked. GSC simply has never crawled it (Last crawl:
  N/A). Requested indexing for it.

## Open items for the user

1. Social URLs for `sameAs` — deliberately left blank, not invented.
2. Task 11 duplicate-content pairs — needs a call.
3. Pre-existing body copy worth a decision (all pre-date tonight, none introduced by me):
   - `squalane`: visible FAQ heading "Is squalane vegan and cruelty-free?"
   - `tea-tree-oil`: "A product worn for six hours against sweating skin..."
   - `microcrystalline-paraffin-wax`: "...still on your skin at hour six."
4. `/collections` renders live with zero H1 and "No products found" (confirmed). Not in the
   sitemap and not linked from the homepage, so exposure is low.
