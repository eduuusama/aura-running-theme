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
| 8 | Ingredients blog: 0/16 have SEO + FAQ schema | in progress (3 agents) |
| 9 | 2 collections + 4 pages missing SEO fields | DONE + verified live |
| 10 | Missing/mismatched redirects | DONE — already fixed, verified |
| 11 | Two possible cannibalizing article pairs | BLOCKED — needs user decision |

## Task 9 — done, verified live

Collections (`seo.title`/`seo.description` via collectionUpdate): `all`, `frontpage`.
Pages (`global.title_tag`/`global.description_tag` metafields — Page has no native `seo`
field in the Admin API): contact, data-sharing-opt-out, about-us, review.
Verified by curling each live URL: all now render a title (49-64 chars) and a meta
description. `/collections/all` previously had NO meta description at all.

## Task 10 — no action needed, verified

All 7 GSC-reported 404s already 301 correctly and resolve 200, with no redirect chains:
/editorial/marathon-chafing, /editorial/100-mile-blister-prevention (+/index.html),
/about, /contact, /product/aura-stride (-> /products/aura-full),
/editorial/anti-chafing-cream-runners. GSC's report is stale (last crawled Apr-Jun 2026).
Only outstanding item is asking GSC to re-validate so the stale report clears.

The 8th reported 404, literal `https://aura-running.com/${t}`, is an un-evaluated template
literal. Not reproducible in the current theme (no backtick literals in any liquid file);
it is a leftover from the old Lovable React site. 404s harmlessly, will age out.

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
