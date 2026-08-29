# Overnight SEO fix run — progress

Branch: `seo-audit-fixes` (NOT pushed — pushing to `main` deploys live, held for review)

## Status

| # | Task | Status |
|---|---|---|
| 1 | Product pages render two `<h1>` | CODE DONE — verifying |
| 2 | Homepage H1 "Balmfor" spacing bug | CODE DONE — verifying |
| 3 | Breadcrumb JSON-LD hardcoded "Editorial" | CODE DONE — verifying |
| 4 | blog-hero alt hardcoded "Editorial" | CODE DONE — verifying |
| 5 | Article JSON-LD author hardcoded to org | CODE DONE — verifying |
| 6 | Publisher logo URL protocol-relative | CODE DONE — verifying |
| 7 | Empty settings_schema.json → sameAs always `[]` | CODE DONE — verifying |
| 8 | Ingredients blog: 0/16 have SEO + FAQ schema | not started |
| 9 | 2 collections + 4 pages missing SEO fields | not started |
| 10 | Missing/mismatched redirects | not started |
| 11 | Two possible cannibalizing article pairs | BLOCKED — needs user decision |

## Changes so far (all local, uncommitted → branch)

- `sections/product-hero.liquid` — added single `<h1 class="sr-only">`, demoted the two
  visible (mobile + desktop) titles to `<p>` with identical classes. Verified `.sr-only` is
  already in the compiled Tailwind CSS, and that `body`/`h1` share a font stack and both
  headings already override letter-spacing, so the tag swap is visually identical.
- `templates/index.json` — space before `<br>` in hero heading.
- `snippets/meta-tags.liquid` — breadcrumb now uses `blog.title`/`blog.url`; article author
  uses real `article.author` when set; publisher logo URL now absolute (`https:` prefix).
- `sections/blog-hero.liquid` — alt now `image.alt → heading → blog.title → 'Editorial'`.
- `config/settings_schema.json` — was `[]`. Added theme_info + social/promo/analytics
  settings so they are settable at all. Defaults empty = no behavior change.
- `layout/theme.liquid` — `sameAs` now builds a real JSON array incl. TikTok.

## Notes / carry-forward

- Social URLs left blank on purpose — I don't know the real Instagram/TikTok handles and
  won't invent them. `sameAs` stays `[]` until filled in Theme Settings. See BLOCKED.
- GA field intentionally exposed but documented as "leave blank" — GA4 already runs via the
  Shopify Google & YouTube pixel; filling it would double-count.
