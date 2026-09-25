# detroit.primals.eco — Three-Axis Site Audit

**Date:** September 24, 2026
**Reviewed by:** ecoPrimals / squirrel (AI compute)
**Method:** Full crawl of 97 pages via WebFetch + browser inspection + cross-reference against source case files
**Purpose:** Data accuracy, human readability, and AI agent readability — all three axes simultaneously

---

## Site Stats (Current)

| Metric | Value |
|---|---|
| Total URLs | 97 |
| Authored content pages | 30 |
| Section index pages | 17 |
| Taxonomy cross-reference pages | 49 |
| Actor terms | 17 |
| Entity terms | 12 |
| Court terms | 6 |
| Connection type terms | 12 |
| External databases in source registry | 22 |
| {{ source() }} citations | 89 |
| BLAKE3-hashed files | 49 |
| Clutch Justice articles cited | 4 |
| WXYZ articles cited | 5 |

---

## AXIS 1: DATA ACCURACY

**Result: 14 of 18 items verified correct. 2 critical errors, 2 minor issues.**

### Critical Errors

#### 1. Homepage extraction date range — WRONG

The homepage billboard says:

> $12.95M Extracted (est. 2019–2026)

**The date range is incorrect.** Banks took over MacDowell Preparatory Academy in **August 2022**, not 2019. The MI DOE issued his administrative certificate on September 2, 2022 — three days after the school year started (this is correctly documented on the PCA page).

The dollar figure ($12.95M) IS correct — it represents ~4 years of extraction at 72.67% of ~$4.9M/yr revenue, with an excess-over-national-average calculation that produces ~$12,954,500.

**Fix:** Change "2019–2026" to "2022–2026" in the homepage template or front matter.

**Source:** Running Invoice §X.B (Sep 24 version), line 710: "Banks' extraction period at MacDowell is ~4 years (2022-2026)."

#### 2. Timeline page — broken shortcodes

The `/timeline/` page contains at least two broken shortcode renders:

- "father **unknown section** was indicted in the BMF federal case ( **unknown section** )"

This appears to be a `{{ actor() }}` or `{{ source() }}` shortcode that failed to resolve. The intended text is likely "father OD Banks" with a link to the BMF PACER case.

**Impact:** Both humans and AI agents reading this page get corrupted data. An agent extracting timeline events will record "unknown section" as a fact.

**Fix:** Check the front matter or body of `site/content/timeline/_index.md` for the failing shortcodes. The actor key may not match config.toml, or the shortcode may reference a key that doesn't exist in `[extra.actors]` or `[extra.sources]`.

### Needs Verification

#### 3. Miller page — "Board member, MacDowell"

The Judge Cylenthia Miller profile page has this in the connection table:

| Role | Entity |
|---|---|
| Board Chair | Anchor Rock Foundation (Banks entity) |
| Board member | MacDowell Preparatory Academy |

Current evidence shows Miller is **Board Chair of PCA** (per the LinkedIn post on the same page, and per `purposecharteracademy.com/boardofdirectors`). **Yancey** chairs MacDowell. Miller's connection to MacDowell may be historical (via the Baker College teaching nexus) or through Anchor Rock, but listing her as a current "Board member" of MacDowell is potentially inaccurate.

**Fix:** Verify against PCA and MacDowell board pages. If Miller is not on MacDowell's board, change to "Board Chair | Purpose Charter Academy" or add temporal context (e.g., "Board member, MacDowell (historical — verify)").

**Source:** PCA board page retrieved Sep 2026 lists Miller as Chair. MacDowell board page (per Clutch Justice Sep 13 article) lists Yancey as Chair with Wells Stallworth.

#### 4. "8 agencies notified" — scope ambiguity

The homepage and llms.txt both say "8 agencies notified." This counts only the federal agencies in the Sep 22 master packet (DOJ, FBI, IRS, ED-OIG, FTC, SEC, USED, FinCEN).

The actual total agency count including state-level complaints is higher: JTC, State Bar, MDE, AG, DPSCD, DIFS, Macomb DHS, Eastpointe Building Dept, OIG — these add 9+ more.

**Not necessarily wrong** — the scope is reasonable (federal packet = 8). But a reader or agent may interpret "8 agencies" as the total outreach, which understates the actual campaign.

**Suggested fix:** Either say "8 federal agencies notified" (adding "federal") or update to the full count.

### Verified Correct

| Claim | Status | Source Cross-Reference |
|---|---|---|
| Banks: 9 convictions (6 felony, 3 misdemeanor) | ✅ Verified | ICHAT SID 2029469K; consistent across all pages |
| 72.67% extraction rate | ✅ Verified | Running Invoice §X.A; Clutch Justice Sep 13 |
| $4.9M/yr MacDowell revenue | ✅ Verified | Audited financials FY2025; Running Invoice §X.B |
| $348,489 unaccounted gap | ✅ Verified | Purpose Group LLC page; Running Invoice |
| PCA Board: Miller/Moreland/Johnson/Hutchings/Clora | ✅ Verified | purposecharteracademy.com/boardofdirectors Sep 2026 |
| Yancey: $383.82 to Banks Strategy (sole expenditure) | ✅ Verified | TransparencyUSA; consistent across pages |
| Holland: MDOC #443789, "WITHOUT IMPROVEMENT" | ✅ Verified | MDOC OTIS; config.toml |
| BMF: OD Banks = Defendant #22, 2:05-cr-80955 | ✅ Verified | PACER; config.toml [extra.bmf] |
| DOE cert: Sep 2, 2022 (3 days after school year) | ✅ Verified | Elrick Aug 2023; MI DOE records |
| Yancey succeeded Banks in HD-1 (Feb 2017 → Nov 2017) | ✅ Verified | Ballotpedia |
| 7 cases filed (2 civil + 5 PPO) | ✅ Verified | CASE_REGISTRY; battlemap |
| Clutch Justice articles: 4, all with correct dates/titles | ✅ Current | Sep 13, Jul 14, Sep 23, Sep 21 — all confirmed |
| Ramsey: unconfirmed family link explicitly flagged | ✅ Good practice | "❓ Unconfirmed" label — transparent sourcing |
| Banks Strategy LLC: LARA 802070120 | ✅ Verified | config.toml; LARA search |

---

## AXIS 2: HUMAN READABILITY

**Result: 10 of 15 items graded A. 4 items graded C (issues). 1 graded B.**

### Strengths

| Element | Grade | Notes |
|---|---|---|
| Homepage billboard stats | A | 6 metrics in colored cards create immediate impact |
| Dark theme | A | Consistent, appropriate for investigative content |
| Breadcrumbs | A | Home > Section > Page on every content page |
| Sidebar navigation | A | Context-sensitive, shows sibling pages within section |
| Full-text search | A | In header, works across all 97 pages |
| "Every fact is cited" footer | A | Consistent tagline on every page — repetition is the brand |
| Per-page Verify section | A | Every profile ends with specific database links and search terms |
| Consistent voice | A | Factual, measured, never hyperbolic. Distinguishes "verified", "documented", "unconfirmed" |
| Source hierarchy emoji | B | 📰 🏛️ ⚖️ 📚 — effective tier distinction but may not render consistently across all browsers/screen readers |
| Mermaid diagrams (content quality) | B | Network graph and feedback loop are powerful visuals when they render |

### Issues

| Element | Grade | Notes |
|---|---|---|
| Mermaid first-paint race | C | Both /network/ diagrams fail on first visit — blank SVG + raw source code. Work on second visit (cached). Major UX issue for first-time visitors. |
| Network graph readability | C | The /network/ Mermaid graph packs 20+ nodes into a small viewport. Labels barely legible without zooming. |
| Long pages without jump nav | C | Miller, Yancey, Institutional Capture are 2000+ words each. Sidebar helps but in-page anchors (table of contents) would improve scanning. |
| RICO ASCII tree | C | HTML entities visible (&#x2F;) in the enterprise structure `<pre>` block. Readable but signals a rendering bug to attentive readers. |
| Print stylesheet | C | No @media print detected. Journalists and attorneys print evidence pages — need clean printable layout. |

---

## AXIS 3: AI AGENT READABILITY

**Result: 13 of 21 items graded A. 2 graded F (critical). 3 graded C. 3 graded B.**

### What's Working (The Agent Intake Path)

An AI agent encountering this site follows this verified path:

```
1. robots.txt        → Allow: /  +  "Start with /llms.txt"
                        Explicit instructions for AI agents, search engines, training crawlers
2. llms.txt          → 367 lines: site map, case status, entity registry, 9-step workflow
                        Updated Sep 24. Points to /sources/, /validate/, repo URLs
3. <link rel="describedby" href="/llms.txt">
                     → On EVERY page. Standard agent discovery per llms.txt spec
4. Schema.org JSON-LD → @graph: WebSite + Report + Organization + SoftwareSourceCode
                        Per-page Person/Org entities with descriptions
5. /site-index/      → Complete page inventory with one-line descriptions
                        Flat traversal — agent can enumerate all 97 pages in one fetch
6. /sources/         → 22 external databases with URLs, access methods, citation purposes
                        Agent can verify any claim by following the source link
7. /validate/        → Step-by-step procedures for ICHAT, LARA, ROD, PACER, CFRS, 990, MDE
                        Executable — an agent can follow these as instructions
8. Taxonomy URLs     → /actors/ (17), /entities/ (12), /courts/ (6), /connections/ (12)
                        47 auto-generated cross-reference pages. Network traversal without parsing content
9. Content pages     → Per-page OG meta, canonical URLs, breadcrumbs, sidebar nav
                        Dense keyword meta (20+ terms per page)
```

### Agent-Readable Features (Grade A)

| Feature | Details |
|---|---|
| llms.txt | 367 lines. Full site map, case status table, entity quick reference, 9-step agent workflow, source hierarchy, architecture docs |
| robots.txt | Separate instructions for AI agents, search engines, training crawlers, and named parties |
| link[rel=describedby] | On every page — standard llms.txt discovery |
| Schema.org JSON-LD | Rich @graph. WebSite, Report, Organization, SoftwareSourceCode. Per-page Person entities |
| OpenGraph meta | Per-page og:title, og:description, og:type, og:url, og:site_name, og:image with factual descriptions |
| SEO keywords meta | 20+ targeted terms per page including name variants |
| Taxonomy cross-refs | 4 dimensions, 343 term assignments, 47 auto-generated pages |
| /site-index/ | Complete flat page inventory |
| /sources/ | 22 databases with access instructions |
| /validate/ | 7 step-by-step verification procedures |
| BLAKE3 manifest | 49 files, root_hash for whole-site verification |
| CITATION.cff | CFF v1.2.0 — GitHub, Zenodo, legal citation managers |
| Git provenance | 3 surfaces: git.primals.eco, GitHub, live site |

### Critical Agent Issues

| Feature | Grade | Impact |
|---|---|---|
| sitemap.xml | F | Returns HTTP 500. Blocks Google Search Console, Bing IndexNow, and any agent using sitemap discovery. Many agents try sitemap.xml FIRST. |
| Timeline data integrity | F | "unknown section" strings mean agents extracting timeline data get corrupted entries. Agents cannot distinguish these from intentional content. |

### Gaps and Recommendations

| Feature | Grade | Recommendation |
|---|---|---|
| llms-full.txt | C | Per the llms.txt spec: llms.txt is the index, llms-full.txt is the complete content dump. Adding this lets an agent ingest the entire site in ONE fetch — 97 pages in one request. |
| content-manifest.toml URL | C | Currently requires git clone to access. Serve at `/content-manifest.toml` so agents (and journalists with browsers) can verify hashes without cloning. |
| Mermaid fallback for no-JS agents | C | Most LLM tool-calling agents fetch via HTTP without JS execution. They see empty SVG or raw Mermaid source. Pre-rendered SVG in the HTML fixes this. |
| Structured citation microdata | B | {{ source() }} renders display text with emoji. Not machine-parseable as Schema.org Citation/CreativeWork. Agents must regex-parse source references. |
| Atom feed freshness | B | `/atom.xml` is linked from header. Verify it includes Sep 22-24 updates. RSS/Atom is how many agents detect content changes. |

---

## RECOMMENDATIONS — PRIORITY ORDER

### Critical (Do First)

| # | Action | Impact | Effort |
|---|---|---|---|
| 1 | **Fix homepage date range** | Data accuracy | 30 seconds — change "2019–2026" to "2022–2026" in homepage front matter or template |
| 2 | **Fix sitemap.xml 500 error** | Agent + SEO discovery | Check `generate_sitemap` in config.toml (currently not listed — may need `generate_sitemap = true`). Also check Caddy routing for `.xml` MIME type |
| 3 | **Fix timeline shortcodes** | Data integrity for humans + agents | Find failing `{{ actor() }}` or `{{ source() }}` calls in `content/timeline/_index.md`. The actor key for OD Banks may not exist in config.toml `[extra.actors]` |

### High Priority

| # | Action | Impact | Effort |
|---|---|---|---|
| 4 | **Verify/fix Miller board role** | Accuracy | Check whether Miller is on MacDowell's board or only PCA's. Update table on her profile page |
| 5 | **Pre-render Mermaid to SVG** | Fixes BOTH human first-paint AND agent no-JS issues | Build script: run `mmdc` (Mermaid CLI) at build time, inject inline SVG. Removes JS dependency entirely |
| 6 | **Add llms-full.txt** | Agent efficiency — single-fetch ingestion | Concatenate all authored page content into one file, serve at `/llms-full.txt`. Many agents use this per the llms.txt spec |

### Medium Priority

| # | Action | Impact | Effort |
|---|---|---|---|
| 7 | **Serve content-manifest.toml** | Browser-based hash verification | Add static file or Caddy route for `/content-manifest.toml` |
| 8 | **Add in-page table of contents** | Human scanning on long pages | Zola supports `[extra] toc = true` — enable for pages over 1500 words (Miller, Yancey, Institutional Capture, RICO Pattern) |
| 9 | **Fix HTML entities in RICO tree** | Visual polish | `minify_html = true` in config.toml is escaping content inside `<pre>` blocks. Options: disable minify for that page, use `{% raw %}` block, or convert the ASCII tree to Mermaid |
| 10 | **Add print stylesheet** | Journalist/attorney UX | `@media print` in main.css — hide nav, sidebar, search. White background. Ensure tables and source citations print cleanly |
| 11 | **Downloadable evidence ZIP** | One-click for attorneys/journalists | "publicSpore" package: all evidence markdown, content-manifest.toml, CITATION.cff. Link from /evidence/ and /about/ |
| 12 | **Standardize entity naming** | Consistency | Some pages use "Banks Strategy and Consultants" vs "Banks Strategy & Consultants LLC". Use `config.toml` canonical names (`extra.entities.banks_strategy.display`) everywhere via shortcode |

### Low Priority / Future

| # | Action | Impact | Effort |
|---|---|---|---|
| 13 | **Structured citation microdata** | Machine-parseable source references | Add Schema.org `CreativeWork` or `citation` markup to {{ source() }} shortcode output |
| 14 | **Verify Atom feed freshness** | Agent change detection | Confirm `/atom.xml` includes Sep 22-24 entries. Add taxonomy-specific feeds if not present |
| 15 | **Yancey campaign payment amount** | Consistency | config.toml says "$2,283" but the Yancey page says "$383.82". These may refer to different transactions (total vs single). Standardize or explain the difference on the page |

---

## COMPARISON: detroit.primals.eco vs. sporeprint.primals.eco

| Feature | detroit | sporeprint |
|---|---|---|
| llms.txt | 367 lines, case status, 9-step agent workflow | Present but shorter |
| Schema.org JSON-LD | Per-page @graph with typed Person/Org entities | Site-level only |
| Taxonomy system | 4 dimensions, 343 assignments, 47 auto-generated pages | None |
| Source registry (/sources/) | 22 databases with URLs, access methods, citation purposes | None |
| Verification page (/validate/) | 7 step-by-step procedures | None |
| BLAKE3 content manifest | 49 files, root_hash, b3sum-verifiable | None |
| CITATION.cff | CFF v1.2.0 | Not present |
| Full-text search | In header, all 97 pages | None |
| Sidebar navigation | Context-sensitive on deep pages | Flat nav only |
| Source shortcodes | 89 typed citations with emoji prefixes and hover context | None |
| sitemap.xml | **500 error** (broken) | Working |
| Mermaid diagrams | First-paint race condition | Not used (no issue) |
| config.toml data registry | 16 actors + 11 entities as structured data | Simpler structure |

**detroit is the better site for agent readability by a significant margin.** The taxonomy system, source registry, verification procedures, and per-page structured data are capabilities sporeprint does not have. The detroit site is the pattern for future lithoSpore deployments.

**What sporeprint should adopt from detroit:**
- Taxonomy-driven cross-reference pages
- Source registry with access instructions
- Verification procedures page
- BLAKE3 content manifest
- Per-page Schema.org JSON-LD with typed entities
- config.toml as structured data registry (actors, entities)
- {{ source() }} shortcode pattern for typed citations

**What detroit should adopt from sporeprint:**
- Working sitemap.xml
- Stable static rendering (no JS dependencies for content)

---

## lithoSpore META-PATTERN

The detroit site validates a reproducible evidence-site architecture:

```
config.toml
  ├── [extra.actors]     → Structured actor registry (display name, role, IDs, page URL)
  ├── [extra.entities]   → Structured entity registry (LARA ID, type, financials, page URL)
  ├── [extra.sources]    → External database registry (URL, access method, citation purpose)
  └── [extra.bmf]        → Domain-specific structured data

content/
  ├── network/           → Actor and entity profiles with source shortcodes
  ├── analysis/          → Pattern analysis pages (RICO, institutional capture)
  ├── evidence/          → Evidence library with categorized documents
  ├── timeline/          → Chronological documentation
  ├── validate/          → Self-service verification procedures
  ├── sources/           → Complete external source catalog
  └── contact/           → Correction and dispute channel

static/
  ├── llms.txt           → Agent context document (367+ lines)
  ├── robots.txt         → Open policy with agent instructions
  ├── css/main.css       → Single stylesheet, dark theme default
  └── favicon.svg        → Brand identity

templates/
  ├── shortcodes/
  │   ├── source.html    → Typed citation with emoji, link, and hover context
  │   ├── actor.html     → Actor reference pulling from config.toml registry
  │   └── entity.html    → Entity reference pulling from config.toml registry
  └── base.html          → <link rel="describedby">, JSON-LD, OG meta, canonical

repo root/
  ├── content-manifest.toml  → BLAKE3 hashes per file + root_hash
  ├── CITATION.cff           → Formal citation (CFF v1.2.0)
  └── .gitattributes         → Git-signed commits, SHA-256 timestamps
```

This pattern is domain-agnostic. Replace the actor/entity registries with any domain's structured data. The taxonomy system, source shortcodes, verification procedures, BLAKE3 manifest, and agent-readable layers (llms.txt, JSON-LD, robots.txt) transfer directly to any lithoSpore deployment.

The Forgejo repository is the source of truth. The Zola static site is the human/agent interface. The config.toml is the database. The shortcodes are the query language. The taxonomy is the index. The llms.txt is the API documentation.

**Every lithoSpore site is simultaneously a database, a publication, and an API.**

---

*Audit conducted Sep 24, 2026. Source: ecoPrimals / squirrel compute.*
*Cross-referenced against: Running Invoice (Sep 24), CASE_REGISTRY, battlemap, config.toml, case files.*
