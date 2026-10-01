# SEO Sensor — Baseline Snapshot

**Purpose**: Track detroit.primals.eco visibility against target entity astroturfing.
**Baseline date**: 2026-09-28 (Wave 159)
**Updated**: 2026-09-28 (critical process correction)
**Methodology**: Search engine results position (SERP) mapping for key terms.
**Re-run**: After each wave or weekly, compare positions to this baseline.

---

## ⚠️ Critical Process Correction (Sep 28, 2026)

### Google Indexing API Misuse — STOPPED

Research validated that the Google Indexing API is **strictly restricted to `JobPosting` and
`BroadcastEvent` schema only**. We submitted 540+ URLs of general content across 3 days — this:
- **Violates Google's TOS** (explicitly documented restriction)
- **Default 200/day quota is "for testing only"** — doesn't trigger actual crawls for non-approved content
- **May harm indexing performance** for the domain (property quarantine risk)
- **All API calls returned HTTP 200** but this is just a receipt, not a crawl commitment

### What Actually Works (2026 research-validated)

1. **External backlinks from indexed sites** → "single biggest unlock" for new domains ✅ (5 GitHub repos)
2. **GSC URL Inspection → Request Indexing** → legitimate, triggers actual crawl (2,000/day)
3. **Sitemap with `<lastmod>` dates** → tells Google which pages to prioritize ✅ (54 pages now have lastmod)
4. **Internal linking from indexed pages** → homepage crawl path ✅ (fixed: 1 → 17 deep links)
5. **IndexNow (Bing/Yandex)** → legitimate for any content ✅ (working)
6. **Content quality and uniqueness** → Google judges new domain trust from crawled pages

### Realistic Timeline (2026 data, new domains)

- Homepage: 1-3 days ✅ (indexed day 3)
- Inner pages: **2-6 weeks** (we're day 7 — patience required)
- 14% indexed within first week (study of 16M pages)
- 50% indexed: 3-8 weeks
- Full site: 2-6 months

**"Discovered - currently not indexed" is NORMAL for a 7-day-old property.**

---

## Google URL Inspection Status (via API, Sep 28)

| URL | Status | Last Crawl |
|-----|--------|-----------|
| `/` (homepage) | ✅ **INDEXED** | Sep 23, 14:42 UTC |
| `/network/actors/brian-banks/` | 🔄 Discovered, not indexed | never |
| `/network/judges/cylenthia-miller/` | 🔄 Discovered, not indexed | never |
| `/analysis/rico-pattern/` | ❌ Unknown to Google | never |
| `/evidence/` | 🔄 Discovered, not indexed | never |
| `/network/` | 🔄 Discovered, not indexed | never |
| `/open-letters/` | 🔄 Discovered, not indexed | never |
| `/timeline/` | 🔄 Discovered, not indexed | never |

**GSC sitemaps**: detroit=127 discovered (pre-180 push), sporePrint=403, gorilla=pending
**Indexed pages**: 0 in search results (homepage indexed but not yet appearing in SERPs)

---

## SERP Landscape by Search Term

### 1. `"Brian Banks" Detroit charter school`

detroit.primals.eco position: **NOT RANKING** (not yet indexed)

| Pos | URL | Type | Notes |
|-----|-----|------|-------|
| 1 | macdowellprep.com/meet-our-superintendent/ | **ASTROTURF** | Self-promotion bio, no mention of convictions |
| 2 | chartercollab.org/brian-banks/ | **ASTROTURF** | National Charter Collaborative profile, hagiographic |
| 3 | pahara.org/fellow/brian-banks | **ASTROTURF** | Pahara Fellowship page — "dismantling broken systems" |
| 4 | linkedin.com (Banks post) | **ASTROTURF** | Self-promotional LinkedIn, no criminal history |
| 5 | linkedin.com (Banks profile) | **ASTROTURF** | Claims "J.D., Ph.D." in display name |

**Analysis**: 5/5 top results are self-promotional or affiliated. ZERO accountability content visible. A parent searching this term sees only Banks' own narrative.

### 2. `"Brian Banks" Detroit convictions felon charter school`

detroit.primals.eco position: **NOT RANKING**

| Pos | URL | Type | Notes |
|-----|-----|------|-------|
| 1 | eu.freep.com (ML Elrick, Aug 2023) | **JOURNALISM** | "Back to Fool" — first investigative piece |
| 2 | en.wikipedia.org/Brian_Banks_(politician) | **NEUTRAL** | Mentions 8 felonies, resignation |
| 3 | mdoe.state.mi.us (legislator detail) | **PUBLIC RECORD** | Notes 8 felonies, forced resignation |
| 4 | yahoo.com (FreePres syndication) | **JOURNALISM** | Same Elrick piece, syndicated |
| 5 | purposecharteracademy.com/ourfounder | **ASTROTURF** | "Our Founder" — zero mention of convictions |

**Analysis**: When users add "convictions" or "felon" to the query, journalism appears. But detroit.primals.eco — with 181 pages of documented evidence — is invisible. The FreePres piece is 3 years old and pre-dates the RICO analysis, the judicial capture, the funding flow, the entity map.

### 3. `"Purpose Charter Academy" Detroit`

detroit.primals.eco position: **NOT RANKING**

| Pos | URL | Type | Notes |
|-----|-----|------|-------|
| 1 | purposecharteracademy.com | **ASTROTURF** | School's own site |
| 2 | linkedin.com (Banks PCA post) | **ASTROTURF** | Self-promotional |
| 3 | purposecharteracademy.com/contactus | **ASTROTURF** | Contact page |
| 4 | chalkbeat.org (Mar 2026) | **JOURNALISM** | Neutral coverage, no accountability angle |

**Analysis**: The new school is 100% astroturfed. No accountability content ranks. A parent researching where to send their child sees only Banks' self-promotion.

### 4. `"MacDowell Preparatory Academy" Detroit`

detroit.primals.eco position: **NOT RANKING**

| Pos | URL | Type | Notes |
|-----|-----|------|-------|
| 1 | macdowellprep.com | **ASTROTURF** | School website |
| 2 | detroitk12.org (DPSCD listing) | **NEUTRAL** | Lists Banks as superintendent, "Self-Managed" |
| 3 | macdowellprep.com/about/ | **ASTROTURF** | More self-promotion |
| 4 | publicschoolreview.com | **DATA** | **3% math, bottom 50%, ranked #2941/3025** |
| 5 | macdowellprep.com (audited financials PDF) | **ASTROTURF** | Operational data |

**Analysis**: PublicSchoolReview (#4) is the ONLY result showing actual performance data. detroit.primals.eco has far deeper analysis but is invisible.

### 5. `Judge Cylenthia Miller Wayne County Detroit`

detroit.primals.eco position: **NOT RANKING**

| Pos | URL | Type | Notes |
|-----|-----|------|-------|
| 1 | keepjudgemiller.com (About) | **CAMPAIGN** | Re-election campaign site |
| 2 | ballotpedia.org | **NEUTRAL** | Standard judge entry |
| 3 | keepjudgemiller.com | **CAMPAIGN** | Campaign homepage, endorsed by Eric Sabree |
| 4 | dailymail.com | **JOURNALISM** | "Wholly improper" OWI representation incident |
| 5 | wxyz.com | **JOURNALISM** | Same OWI incident, bar referral |

**Analysis**: Her campaign site ranks #1 and #3. Endorsement list includes **Eric Sabree** (Wayne County Treasurer, whose children are judges in the network). The Daily Mail and WXYZ pieces cover the OWI incident but NOT the charter school connections. detroit.primals.eco has the full network map — judges, boards, campaign payments — but is invisible to voters.

### 6. `"Sherry Gay-Dagnogo" Detroit ombudsman`

detroit.primals.eco position: **NOT RANKING**

| Pos | URL | Type | Notes |
|-----|-----|------|-------|
| 1 | detroitmi.gov/government/ombudsman | **OFFICIAL** | City of Detroit page |
| 2 | detroitmi.gov (PDF bio) | **OFFICIAL** | Official bio, no controversies |
| 3 | bridgedetroit.com | **JOURNALISM** | Appointment coverage, neutral |
| 4 | outliermedia.org | **JOURNALISM** | Soft profile piece |
| 5 | michiganchronicle.com | **JOURNALISM** | Appointment announcement |

**Analysis**: No mention anywhere of: paying convicted drug offender Holland $2K from her PAC, rallying publicly for Banks at AG charges, AG referral for campaign finance violations, or her role authorizing PCA while on DPSCD board. detroit.primals.eco has all of this documented.

### 7. `"Purpose Group LLC" Detroit charter school management`

detroit.primals.eco position: **NOT RANKING**

| Pos | URL | Type | Notes |
|-----|-----|------|-------|
| 1 | thepurposegroupmichigan.com | **ASTROTURF** | "35 years of collective experience" — entity website |
| 2 | purposecharteracademy.com | **ASTROTURF** | PCA site |
| 3 | purposecharteracademy.com/contactus | **ASTROTURF** | Contact page |
| 4 | sec.gov (unrelated Purpose Group LLC) | **IRRELEVANT** | Different entity in Atlanta |
| 5 | linkedin.com (unrelated CEO) | **IRRELEVANT** | Different entity in Dover, DE |

**Analysis**: The extraction vehicle has its own professional website. "Comprehensive administrative support" obscures the 72.67% extraction. No accountability content ranks for the entity name.

---

## Astroturfing Infrastructure Summary

### Banks-Controlled Properties (ranked for his name)
| Domain | Purpose | Ranking For |
|--------|---------|-------------|
| macdowellprep.com | School website | school name, "superintendent" |
| purposecharteracademy.com | New school website | school name, "founder" |
| thepurposegroupmichigan.com | Management LLC website | "Purpose Group" |
| keepjudgemiller.com | Miller campaign | "Judge Cylenthia Miller" |
| linkedin.com/brian-banks-j-d-ph-d | Personal LinkedIn | "Brian Banks" |

### Affiliated/Sympathetic Properties
| Domain | Relationship | Ranking For |
|--------|-------------|-------------|
| chartercollab.org | National Charter Collaborative | "Brian Banks" |
| pahara.org | Pahara Fellowship | "Brian Banks" |
| Chalkbeat | Neutral journalism | school names |
| detroitk12.org | DPSCD (authorizer) | school names |

### Accountability Properties (NOT yet ranking)
| Domain | Content | Status |
|--------|---------|--------|
| **detroit.primals.eco** | 181-page evidence library | **DISCOVERED, NOT INDEXED** |
| clutchjustice.com | Independent analysis | Ranking for "MacDowell Preparatory Academy academic" |
| eu.freep.com | 2023 Elrick investigation | Ranking for "Brian Banks felon" |
| en.wikipedia.org | Political career summary | Ranking for "Brian Banks convictions" |

---

## Displacement Targets

When detroit.primals.eco is fully indexed, these are the SERP positions we aim to displace:

| Search Term | Target Position | Currently Held By |
|-------------|----------------|-------------------|
| `"Brian Banks" Detroit charter school` | Top 3 | astroturf (macdowellprep, chartercollab, pahara) |
| `"Purpose Charter Academy" Detroit` | Top 3 | astroturf (purposecharteracademy.com) |
| `"MacDowell Preparatory Academy"` | Top 3 | astroturf (macdowellprep.com) |
| `Judge Cylenthia Miller` | Top 5 | campaign (keepjudgemiller.com) |
| `Brian Banks Detroit convictions` | #1 | journalism (eu.freep.com — 3yr old piece) |
| `"Sherry Gay-Dagnogo" Banks` | #1 | **NOTHING ranks** — virgin SERP |
| `"Purpose Group LLC" Detroit` | #1 | astroturf (thepurposegroupmichigan.com) |
| `Detroit charter school fraud` | Top 3 | generic news results |
| `Detroit charter school racketeering` | #1 | **NOTHING ranks** — virgin SERP |

### Virgin SERPs (no competition — immediate #1 on index)
- `detroit charter school racketeering`
- `Brian Banks 9 convictions charter school`
- `Purpose Group LLC 72% extraction`
- `Wayne County judicial capture charter school`
- `Cylenthia Miller Anchor Rock Foundation`
- `Tenisha Yancey MacDowell board chair`
- `Brian Banks BMF Black Mafia Family charter school`
- `Detroit charter school RICO pattern`

---

## Re-measurement Protocol

Run this check weekly (or after each wave):

1. **URL Inspection API**: Check the 8 priority URLs above → track `verdict` changes
2. **`site:detroit.primals.eco`**: Count indexed pages in Google
3. **SERP position checks**: Search each term above → note detroit.primals.eco position
4. **Clutch Justice tracking**: Check if their article rises (validates mutual reinforcement)
5. **Astroturf monitoring**: Check if any Banks-controlled property adds/removes content

### Automation hook (for membrane pipeline)
The `membrane site.publish` pipeline already tracks:
- Pages submitted vs. indexed (GSC API)
- IndexNow acceptance status
- URL notification quota usage

**Future**: Add SERP position scraping to the pipeline as a `[seo] serp_sensor` module.

---

## Wave 159 SEO Actions Completed

| Action | Impact | Status |
|--------|--------|--------|
| Google Indexing API: 180 URLs | Bumps crawl queue priority | ✅ Done (quota resets daily) |
| IndexNow: 180 detroit + 20 gorilla + 403 sporePrint | Bing/Yandex discovery | ✅ Accepted |
| Title fix: `CFK2` → `Detroit Charter School Investigation` | Google SERP headlines | ✅ Live on 181 pages |
| GitHub backlinks: 5 repos (all Google-cached) | Domain authority signals | ✅ Pushed |
| Wayback Machine: 8 priority pages | archive.org backlinks + preservation | ✅ Archived |
| Meta descriptions: verified on all pages | SERP snippets | ✅ Already present |
| JSON-LD: Person, Organization, Report schemas | Rich results eligibility | ✅ Validated |
| GSC sitemaps: all 3 sites | Crawl guidance | ✅ Submitted |

**Next daily**: Indexing API quota resets → membrane auto-submits 50 URLs per push.
**Next wave**: Re-run SERP checks, update positions in this document.

---

## Wave 159b — Link Audit + MHC Indexing Strategy (Oct 1, 2026)

### Link Audit Results

14 files fixed across detroit site, 4 files updated on sporePrint:

| Issue | Fix | Files |
|-------|-----|-------|
| ZeekBeek (403, unreliable) | → michbar.org/memberdirectory/ (official State Bar) | config + README + RICO_PATTERN + all content refs |
| MDOC OTIS URL (404) | otis2profile.aspx → otis2/Search | config |
| Todd Perkins Wikipedia (404) | Removed — page never existed. michbar.org kept | 2 files |
| Kelly Ramsey Ballotpedia (404) | → courts.michigan.gov + MI Lawyers Weekly | 1 file |
| Chalkbeat PCA article (404) | → DPSCD board minutes reference | 1 file |
| SchoolDigger (403, bot-blocked) | → mischooldata.org (official MI source) | config + evidence |
| MDE PSA reports (404) | → mischooldata.org | 1 file |
| Free Press paywalled (402) | 4 direct links → archive.org mirrors | 5 files |
| Detroit News (no Wayback) | → DEA press release | 1 file |

### Cross-Site Graph Strengthened

| Direction | Before | After |
|-----------|--------|-------|
| detroit → sporePrint | 3 pages, 10 unique targets | unchanged (already strong) |
| sporePrint → detroit | 5 pages, **2 unique targets** | 8+ pages, **12+ unique targets** |

New deep links added to: public_record.md (8 links), guerilla_gorilla.md (6 links),
the_city_of_omelas.md (4 links), 99pi_radiolab_invitation.md (2 links).

### golgiBody Fixes

- **detroit access_log was missing** — added `import access_log` to Caddyfile vhost
- **sporePrint build failure** — `public/` owned by root, git user couldn't delete.
  Created `/etc/sudoers.d/membrane-publish` with narrow chown rules for both sites.
  The handoff doc said "hardened" but the sudoers rule was never created.

### MHC Indexing Strategy — Network Percolation

Analyzed internal link graph to find optimal "Request Indexing" submission order.
The site has **scale-free hub structure**: 5 pages cover 96% of the graph (204/212).

| Hub Page | Outbound Links | Cumulative Discovery |
|----------|---------------|---------------------|
| /network/actors/brian-banks/ | 69 | 70/212 (33%) |
| /network/dynasties/ | 64 | 80/212 (38%) |
| /actors/ (taxonomy) | 59 | 126/212 (59%) |
| /connections/ (taxonomy) | 46 | 173/212 (82%) |
| /entities/ (taxonomy) | 28 | 204/212 (96%) |

### GSC Request Indexing Results (Oct 1, 2026)

**Quota**: ~11 submissions/day, **shared across domain property** (primals.eco).
Not per-subdomain — detroit and sporePrint share the same quota.

11 pages submitted. 10 moved from "Unknown/Discovered" → **"Crawled"** within minutes:

| Page | Before | After |
|------|--------|-------|
| /analysis/funding-flow/ | Unknown | **Crawled** |
| /analysis/historical-pattern/ | Unknown | **Crawled** |
| /timeline/ | Unknown | **Crawled** |
| /sources/ | Unknown | **Crawled** |
| /network/judges/cylenthia-miller/ | Unknown | **Crawled** |
| /network/entities/purpose-charter-academy/ | Unknown | **Crawled** |
| /network/actors/brian-banks/ | Discovered | **Crawled** |
| /network/dynasties/ | Discovered | **Crawled** |
| /analysis/rico-pattern/ | Discovered | **Crawled** |
| /analysis/credential-audit/ | Discovered | **Crawled** |
| /analysis/detroit-literacy/ | Discovered | Still Unknown (quota hit) |

"Crawled - currently not indexed" → typically moves to INDEXED within 24-48 hours.

### Remaining Queue (next quota refresh)

Priority for next day's submissions:

**Detroit** (remaining from today):
1. /analysis/detroit-literacy/ (quota victim)
2. /about/
3. /evidence/
4. /validate/
5. /network/entities/macdowell-prep/
6. /network/actors/joseph-holland/
7. /books/it-had-2-happen/

**sporePrint** (cross-link targets):
8. /outreach/public-record/
9. /outreach/guerilla-gorilla/
10. /philosophy/the-city-of-omelas/
11. /outreach/99pi-radiolab-invitation/

### SEO Signal Route Status (Oct 1)

| Signal | Detroit | sporePrint |
|--------|---------|------------|
| GSC Request Indexing | 11 submitted, 10 crawled | 0 (shared quota exhausted) |
| IndexNow (Bing) | 212 URLs accepted (HTTP 200) | 403 (HTTP 403 — site verification pending) |
| GSC sitemap resubmit | ✅ on every push | ✅ on every push |
| WebSub hub | ✅ in base.html | — |
| Atom feed | ✅ 701KB | ✅ 7.2MB |
| robots.txt AI crawlers | ✅ 16 named bots | — |

### Bot Activity (Oct 1, since logging fixed)

| Bot | sporePrint | detroit | git.primals.eco |
|-----|-----------|---------|-----------------|
| bingbot | 39 | logging just enabled | — |
| Applebot | — | — | 6 |
| ClaudeBot | — | — | 2 |
| AhrefsBot | 2 | — | — |

### Theoretical Framework

The indexing strategy maps to **network percolation on scale-free graphs** — the same
mathematical structure appears in adaptive immunity, population genetics, epidemiology,
and graph crawling. Documented in whitePaper/subGen/NETWORK_PERCOLATION_RECOGNITION.md.
