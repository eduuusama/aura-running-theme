# SEO audit fixes — shipped 2026-08-29

All work is **merged to `main` and live**. Verified with 15 automated checks against
production (all passing) plus manual browser checks.

## What shipped

**Theme (deployed via GitHub sync, confirmed live)**
- Product pages: was 2 `<h1>`, now exactly 1. A single `sr-only` H1 sits outside the mobile
  and desktop layout trees; the two visible titles are styled `<p>`. Demoting one in place
  would have left one viewport's screen-reader users with no H1 at all.
- Homepage H1 read "Balmfor" to text extractors; added a space before the `<br>`.
- Article BreadcrumbList used a hardcoded "Editorial"; now uses `blog.title`/`blog.url`
  (ingredient articles correctly say "Ingredients").
- Article author now publishes the real byline; falls back to Organization for the shop name
  and for "Shopify API".
- Publisher logo URL is absolute (`https:`), matching the Organization logo pattern.
- blog-hero alt text: `image.alt -> heading -> blog.title -> 'Editorial'`.
- `config/settings_schema.json` was `[]`, so five referenced settings were unsettable.
  Added the schema **and** `config/settings_data.json` (which never existed) with the real
  Instagram URL. `sameAs` and the previously dead footer Instagram links now work.
- `/collections` was a live 200 page with no H1 and "No products found". Shopify will not
  let a URL redirect override that built-in route, so the template now renders
  collection-hero (H1 "Shop") and only that template is `noindex, follow`.

**Store data (live immediately, no deploy needed)**
- All 16 Ingredients articles: SEO title, meta description, and FAQPage schema (4-5 FAQs
  each). Independently verified on the live site, including a cross-contamination check.
- Both collections and all four pages: SEO title + description. `/collections/all` had no
  meta description at all before.
- All 36 articles across both blogs: author set to Eduardo Samayoa.
- Older ingredient-science article retargeted to "how to choose an anti-chafing cream" so it
  no longer competes with the natural-ingredients article.
- Search Console: 404 re-validation started; indexing requested for /blogs/ingredients.

## Decisions applied from user review

- Duration claims (Full 4-5h, Ultra 7+h) and the existing six-hour / vegan-cruelty-free
  article copy: confirmed correct, left as written. Recorded in memory.
- Duplicate content: "100% natural anti-chafing cream" wins the natural/ingredients query.
  Resolved by differentiation, not deletion — see below.
- Collections not needed: retired from the index.

## Two corrections to the earlier overnight report

1. **The About Us "trail socks and hydration vests" claim was never live.** That page has
   templateSuffix "about" and renders hardcoded copy from `sections/about-page.liquid`; its
   Shopify Page body is dormant. The live copy says "Every formula we make is built for real
   distance", which is accurate. Same pattern for /pages/contact and /pages/review.
2. **The Ingredients hub is not orphaned.** Search Console showed "Referring page: None
   detected", but the hub is linked from every page checked; GSC simply has not crawled it.

## Open

- `Aura-Editorial/context/editorial-guidelines.md` is chmod 400 (read-only) and still carries
  the stale "duration claims are unresolved" paragraph. Needs a manual unlock to update.
  formulation-notes.md and market-opportunity.md are also read-only.
- Duplicate pair kept live rather than consolidated: the older article has 15 inbound
  internal links from 10 articles, three of them from the top traffic driver. Say the word
  and it can be unpublished + 301'd into the natural one, with those links rewritten.
- Product page descriptions still use distance/condition language rather than the approved
  hour figures, so product pages and editorial content differ.
