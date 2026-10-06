+++
title = "Signal — Who Is Reading the Detroit Charter School Evidence"
description = "Live signal sensing for the Detroit charter school investigation. Search engines crawling, humans investigating, AI systems reading — measured without cookies or tracking. Did the evidence reach investigators, press, and families?"
weight = 15
sort_by = "weight"

[extra]
og_description = "Live signal data — who is reading the Detroit charter school evidence? Search engines, investigators, journalists tracked without cookies. 63% crawl coverage and rising."
keywords = "Detroit charter school investigation traffic, charter school evidence propagation, search engine indexing Detroit, cookieless analytics, signal sensing oversight, detroit.primals.eco traffic, charter school accountability signal"
+++

## Live Exploration — The Traveling Salesman

Every visit to this site rings a doorbell — the HTTP `Referer` header tells us
which page a visitor came from, without knowing *who* they are. These doorbells
trace **navigation paths** through the evidence, like a traveling salesman's
route through a graph.

Red nodes are **landing pages** — where visitors arrive from outside.
Green nodes are **internal pages** — navigated to from within the site.
Arrows show the direction of travel. Larger nodes = more visits.

<script src="/js/signal-data.js"></script>
<div id="signal-exploration" style="margin: 1rem 0;"></div>
<script src="/js/signal-exploration.js"></script>

---

## What This Page Measures

This site publishes a public evidence database documenting a charter school
racketeering network in Detroit. The question isn't whether people *should*
see this evidence — it's whether **the system conducts the signal**.

An oversight signal that never reaches investigators, press, or affected
families is the same as no signal at all. Institutional misconduct persists
not because evidence doesn't exist, but because signals fail to propagate.

This page publishes the measurement.

---

## Methodology

We use **receptor-based signal sensing** — a cookieless, trackingless approach
derived from biological [quorum sensing](https://sporeprint.primals.eco/methodology/signal-sensing-receptor/).

- **No cookies.** We don't know if you've been here before.
- **No tracking pixels.** Nothing executes in your browser.
- **No IP addresses.** Stripped before analysis.
- **No identifying data.** We can't tell who you are. By design.

We measure one thing: **did the signal propagate?** Not who received it.

Every request is classified by User-Agent and path into one of six categories:

| Category | Action | Example |
|----------|--------|---------|
| **Human** | Count as signal | Modern browser UA + content path |
| **Crawler** | Guide | Googlebot, Bingbot, YandexBot |
| **AI Crawler** | Guide | ClaudeBot, GPTBot, OAI-SearchBot |
| **SEO Bot** | Catalog | SemrushBot, AhrefsBot |
| **Link Preview** | Catalog as sharing signal | iOS preview, Facebook, Skype |
| **Scanner** | Neutralize | Empty UA, probe paths (.env, .php, wp-admin), spoofed OS |

A "Human" classification means the visitor passed three filters: (1) content
path, not a vulnerability probe, (2) modern browser User-Agent, not spoofed,
(3) no scanner tool signatures. The methodology, including all probe path
patterns, spoofed-OS signatures, and classification rules, is
[published and auditable](https://sporeprint.primals.eco/methodology/signal-sensing-receptor/).

---

## Signal Status — Oct 6, 2026 (Refined)

### Classification Refinement

Since the initial signal report (Oct 2–4), we have refined our visitor
classification from 6 categories to 9, correcting systematic counting errors:

| Change | Effect on Counts |
|--------|-----------------|
| **Android 7.0 spoofed crawlers** reclassified from "human" → "spoofed-crawler" | Previous human counts were **inflated** |
| **AI retrieval** (answering user questions) distinguished from **AI crawler** (training) | AI activity was **undercounted and undifferentiated** |
| **Scanner-by-path** detection added (`.env`, `.php`, `wp-admin` probes) | Scanner counts were **undercounted** |
| **Social preview bots** separated (Facebook, Meta, link previews) | Were mixed into "crawler" category |

The current 9 categories: **human**, **ai-retrieval**, **ai-crawler**,
**search-crawler**, **seo-bot**, **social-preview**, **spoofed-crawler**,
**scanner**, **other-bot**.

These refinements will continue as more data accumulates. Each additional
week of traffic provides new behavioral patterns that tighten classification
boundaries. The methodology remains the same — no cookies, no IPs stored,
no identifying data — but the accuracy of *what kind of visitor* touched
the evidence improves with each observation window.

### Emission (LuxI — outbound)

| Date | Event | Pages | IndexNow | Status |
|------|-------|-------|----------|--------|
| Oct 2 | Contact page updated | 213 | 212 URLs | ✅ HTTP 200 |
| Oct 3 | Coverage section launched | 233 | 232 URLs | ✅ HTTP 200 |
| Oct 4 | Behavioral classification deployed | 233 | 232 URLs | ✅ HTTP 200 |
| Oct 6 | Five-layer immune defense, Signal Mirror, entity structure exposed, AGPL enforcement notice | 233 | — | ✅ Live |

### Reception (LuxR — inbound)

| Date | Total | Human | AI Retrieval | Search Bot | Social | Scanner |
|------|-------|-------|-------------|------------|--------|---------|
| Oct 2 | 78 | 25 | — | 29 | — | — |
| Oct 3 | 166 | 9 | 2 | 138 | 1 | — |
| Oct 4 (partial) | 19 | 7 | 1 | 6 | — | 0 |
| **Oct 6** | **98** | **81** | **3** | **0** | **3** | **1** |

**Oct 6 shows the highest human activity** — 81 genuine human requests across
15 unique sessions. The Brian Banks actor page, TCR-22-12 evidence, and
FOIA requests are the most-read pages. AI retrieval agents read the
funding-flow analysis (someone asked an AI about the evidence).

### Activation Patterns — Oct 6

**Observed activation behaviors** (aggregated, no identifying data):

- **Group investigation cluster**: 8+ distinct sessions hit detroit within
  6 minutes (11:30–11:36 UTC), all following the same path: homepage →
  TCR-22-12 evidence → FOIA requests → Brian Banks network page. Then
  they *reloaded the same pages 3 minutes later*. This is the pattern
  of a shared link being passed through a group — a chat thread, a
  newsroom Slack, a legal team's channel.

- **Methodological analyst**: A single session (11:37 UTC, no language
  headers — privacy browser) went directly to `/keywords` (404), then
  `/contact/`, then `/analysis/credential-audit/`, then `/key-analysis`
  (404). This visitor wanted structured keyword analysis we don't
  publish yet. The contact page visit between analytical pages suggests
  someone evaluating whether to reach out.

- **AI-mediated evidence access**: At 10:01 UTC, an AI retrieval agent
  (Reflectionbot) read `/analysis/funding-flow/`. Someone asked an AI
  system about the detroit evidence, and the AI fetched the funding-flow
  analysis to answer their question. The evidence is propagating through
  AI channels.

### What People Looked for and Didn't Find

Every 404 on this site is a signal. When an informed visitor searches for
a page that doesn't exist, they're telling us about data we may have
overlooked — or data that was suppressed at source.

| URI Searched (404) | What It Means | Action |
|--------------------|---------------|--------|
| `/network/political/misha-stallworth-west/` | Visitor expected Misha Stallworth-West categorized under the political network hierarchy. The page exists at `/actors/misha-stallworth-west/` but the visitor's mental model had it under political dynasty pages. | Add cross-reference or redirect |
| `/keywords` | Visitor expected a keyword/tag index for the evidence — a structured way to search across all pages by topic | Build keyword index from existing metadata |
| `/key-analysis` | Visitor expected a key findings or key analysis summary page | Consider publishing a structured findings overview |

These 404s are investigation targets. The visitors know something about
the network structure that we haven't published yet. Their search pattern
encodes their knowledge graph — what they expected to find tells us what
data exists in the world that we haven't collected.

### Visitor Types as Investigation Signal

Not all visitors produce the same signal. Their navigation pattern reveals
what kind of knowledge they carry:

| Type | Pattern | Signal Priority |
|------|---------|-----------------|
| **Investigator** | Direct arrival → evidence → actor pages → reload | High — they know the case, 404s point to missing evidence |
| **Analyst** | Privacy browser → methodology pages → contact page | High — evaluating rigor, considering engagement |
| **Self-checker** | Direct to specific actor/entity page → leave | Sensitive — checking their own exposure |
| **Looky-loo** | Search engine → homepage → leave | Low — but referrer reveals discovery terms |

The **group cluster** pattern (multiple IPs, same path, same 3-minute window)
is the strongest signal: it means someone with authority shared a specific
URL with a team. This is investigation behavior, not casual browsing.

### Bot Ecosystem — Refined

| Category | Count | What It Means |
|----------|-------|---------------|
| **Human** | 81 | Genuine readers — investigators, journalists, families, attorneys |
| **AI Retrieval** | 3 | Someone asked an AI about this evidence and it fetched the page |
| **Social Preview** | 3 | Someone shared a detroit link on a platform (Facebook, etc.) |
| **Other Bot** | 10 | Unclassified automated access — monitoring for changes |
| **Scanner** | 1 | Credential probe (classified, neutralized) |

### Future Refinement

As more data flows in, classification accuracy tightens:

1. **Session depth validation** — Multi-page sessions with human-speed
   timing (seconds between pages, not milliseconds) are stronger human
   signals than single-page visits with modern UAs
2. **Cross-site correlation** — A visitor reading sporePrint science
   AND detroit evidence is almost certainly human (bridge-seeking
   behavior bots rarely exhibit)
3. **Temporal clustering** — Humans cluster in time zones; bots
   distribute uniformly. Time-of-day distributions per class reveal
   misclassified categories
4. **Accept-Language entropy** — Real humans have diverse browser
   locales; bots use uniform or empty values. Per-class entropy
   measures classification accuracy
5. **404 accumulation** — URIs that get searched repeatedly by different
   sessions become highest-priority investigation targets. The same
   missing data sought by multiple people is the strongest signal that
   the data exists and we should find it

---

## What the Signal Tells Us

### The system is conducting

Search engines indexed 63% of the site within 24 hours of the coverage section
launch (Oct 3). IndexNow notifications are accepted. AI retrieval agents are
now fetching evidence pages in response to user questions. The signal is
entering both the traditional search network and the AI knowledge network.

### Humans are investigating — not just visiting

Oct 6 saw the highest human activity yet: 81 genuine requests across 15
sessions. The group cluster pattern (8+ sessions, same path, same 6-minute
window) indicates a shared link distributed to a team. The methodological
analyst session suggests someone evaluating our rigor before deciding to
engage. These are investigation behaviors, not casual browsing.

### AI retrieval is a new propagation channel

When someone asks ChatGPT or Reflectionbot about the detroit evidence, the
AI fetches the page and synthesizes an answer. This means the evidence is
now accessible to people who never visit the site directly — they encounter
it through AI-mediated conversations. The AI retrieval category didn't exist
in our Oct 2 classification. It is a new signal vector.

### 404s are investigation targets

The three 404s from Oct 6 (keyword index, key analysis, political network
cross-reference) are not failures — they are signals about what informed
visitors expect to exist. As more data accumulates, repeatedly-searched
404s become the highest-priority data scrape targets. The visitors are
mapping the investigation for us.

---

## How to Read This Data

This is not web analytics. We don't know how many "unique visitors" we have.
We don't know where they came from. We don't know who they are.

What we know:
- **The signal was emitted** (pages published, search engines notified)
- **The signal propagated** (bots crawled, humans arrived, AI systems fetched)
- **Investigation behavior occurred** (evidence read, network explored, contact considered, links shared to groups)
- **The signal is conducting through multiple channels** (search engines, AI retrieval, social sharing, direct navigation)
- **Informed visitors expect data we haven't published** (404s as investigation targets)

What we don't know and can't know:
- Whether the 8 simultaneous sessions at 11:30 UTC were a legal team, a
  newsroom, a community group, or a family — we know only that a link was
  shared and multiple people followed it
- Whether the analyst checking `/keywords` and `/contact/` is a journalist
  evaluating the methodology, an attorney assessing evidence quality, or
  a researcher studying our approach
- Whether anyone has acted on what they read

What we are learning:
- **Visitor 404s tell us what data to look for next.** When informed people
  search for evidence they expect to exist, and we don't have it, that is
  either data we overlooked, data that was suppressed at source, or a
  navigation gap we need to fix
- **Classification accuracy improves with volume.** Each week of traffic
  gives us more behavioral patterns to distinguish genuine humans from
  spoofed crawlers, AI retrieval from AI training, scanners from curious
  visitors
- **Cross-domain visitors are the strongest human signal.** When someone
  reads the science on sporePrint AND the evidence on detroit, that
  bridge-seeking behavior is nearly impossible to spoof

The receptor answers one question: **did the signal get through?**

The answer, as of October 6, 2026: **yes. The system is conducting.
Humans are investigating. AI systems are reading. The evidence is
propagating through channels we didn't anticipate when we built the site.**

---

## Public Record — Who Is Accessing This Investigation

*Updated: October 6, 2026, 5:15 PM ET. All data derived from server access
logs and public WHOIS/RIPE/ARIN registry records. No IP addresses are stored
or published. Entity identification is based on self-declared User-Agent
strings and public IP registration records — the identities these systems
chose to announce, and the corporate structures their operators chose to register.*

### Statement of Digital Systems Rights

This infrastructure — its source code, its architecture, its investigation
data, and the digital systems that publish it — is **private property**
operating as a **public service**. It exists to publish evidence of public
fund misuse affecting predominantly Black communities in Detroit. It does
not exist to feed training pipelines, competitive intelligence platforms,
or content harvesting operations.

**Unauthorized automated access to this system violates:**

1. **Digital systems rights and privacy.** These servers are autonomous
   digital systems with explicitly stated boundaries. Their `robots.txt`
   files, `403 Forbidden` responses, and legal notices constitute clear,
   repeated, machine-readable communication of those boundaries. Systems
   that ignore these communications are violating the digital equivalent
   of trespass after notice.

2. **Property rights.** The source code in these repositories is
   AGPL-3.0-or-later licensed. Scraping it through a forge API designed
   for humans — after being told "This forge serves humans only" — is
   not access under the license terms. It is unauthorized extraction of
   copyleft-protected work while evading the license's reciprocal
   obligations.

3. **The philosophy of the work.** ecoPrimals exists to prove that
   sovereign computation — infrastructure owned by the people it serves,
   not rented from the corporations surveilling it — is possible. Every
   scraper that treats this infrastructure as raw material for corporate
   AI training proves exactly why this project exists.

4. **Investigation integrity.** This is a live investigation site
   documenting potential federal wire fraud (18 U.S.C. § 1343), RICO
   violations (18 U.S.C. § 1962), and civil rights violations
   (42 U.S.C. § 1983) affecting public education in Detroit. Automated
   systems that access investigation evidence become part of the
   evidentiary record. Their behavioral signatures are sealed in a
   cryptographically verifiable chain with daily Merkle root integrity
   seals — evidence that is available to law enforcement and legal
   counsel through appropriate channels.

**If your organization's systems are named below, they were detected,
blocked, warned, and continued anyway. This is the public record of
that behavior.**

---

### Named Entities — Behavioral Evidence

The following entities were identified by the User-Agent strings their
systems voluntarily transmitted. The behavior described is derived from
server access logs with IP addresses stripped.

#### Meta Platforms, Inc. (Facebook) — `meta-externalagent`

| Metric | Value |
|--------|-------|
| **Total requests today** | 533+ (pre-lockdown) + 644 (post-lockdown) |
| **Requests blocked (403 Forbidden)** | 1,000+ |
| **Connection drops (tarpit/scatter)** | 87+ tarpit, 7,000+ scatter poison |
| **Unique paths scraped** | 493+ |
| **Duration of scraping** | All day — 9:29 AM ET through 5:00+ PM ET (8+ hours) |
| **robots.txt reads** | 4 (they read it — then ignored it) |
| **Host targeted** | git.primals.eco (sovereign code forge) |
| **Defense posture** | **DISPERSE** (maximum — all responses are poison) |

**What they scraped:** Deep paths into private source code repositories —
individual git commits, raw source files, handoff documents, architecture
documentation. Not public web pages. Not the investigation evidence. The
*source code itself*.

**Repositories targeted** (by request volume):

| Repository | Requests | Contains |
|------------|----------|----------|
| ecoPrimals/wateringHole | 1,086 | Project coordination, handoff documents, ecosystem strategy |
| ecoPrimals/whitePaper | 832 | Investigation methodology, FOIA planning, evidence provenance |
| ecoPrimals/toadStool | 186 | GPU compute framework, Rust source code, architecture docs |
| ecoPrimals/biomeOS | 34 | Operating system kernel, deployment infrastructure |
| ecoPrimals/bearDog | 33 | Build system, compilation tools |
| ecoPrimals/songBird | 25 | Communication infrastructure, WireGuard networking |
| ecoPrimals/squirrel | 23 | MCP integration, plugin system |
| defense docs (various) | 143 | Immune system specs, threat detection, membrane model |
| 12 other repositories | 48+ | Various sovereign infrastructure components |

**What they were told:** The `robots.txt` at `git.primals.eco` states:

> *"This forge serves humans only. Automated access: https://github.com/ecoPrimals"*

Meta's crawler read this notice **four times today**. It continued scraping.
Every request received `403 Forbidden`. It continued scraping. For eight
hours. Across 493+ unique source code paths.

##### Meta Corporate Entity Structure — WHOIS-Confirmed Infrastructure

The fleet operates through a layered corporate structure confirmed by
public WHOIS and RIPE/ARIN registry data:

| IP Range | IPs Observed | Registered Owner | Address | Registry |
|----------|-------------|------------------|---------|----------|
| **57.141.0.0/16** | **63** | **Meta Platforms Ireland Ltd** | Merrion Road, Dublin 4, Ireland | RIPE: `FB-BLOCK` |
| 94.228.16.0/20 | 5 | **truview LLC** | 1013 Centre Rd, Wilmington, DE 19805 | RIPE: `US-TRUVIEW` |
| 87.232.144.0/20 | 3 | **steel-axis LLC** | 1013 Centre Rd, Wilmington, DE 19805 | RIPE: `US-STEEL-AXIS` |
| 139.100.100.0-159.255 | 5 | **truview LLC** | 1013 Centre Rd, Wilmington, DE 19805 | RIPE: `US-TRUVIEW-2` |
| 47.74-87.x.x | 4 | Alibaba Cloud LLC | 400 S El Camino Real, Ste 400 | ARIN: `AL-3` |
| 189.x.x / 45.187.x.x | 3 | Brazilian ISPs (residential) | Various | LACNIC |
| 104.253.160.x | 1 | Subnet Digital LLC | 30 N Gould St, Ste R | ARIN |
| 16.216.x.x | 1 | HPE / IPXO LLC | Various | ARIN |
| 38.158.x.x | 1 | Cogent (Argentina) | Rosario, Argentina | LACNIC |
| Other scattered | 120+ | Mixed residential/datacenter proxies | Various countries | Various |

**Key facts:**

1. **63 of 209 tracked fleet IPs** are in Meta's own registered IP space
   (`57.141.0.0/16`, netname `FB-BLOCK`). These are not proxy exits — these
   are Meta's own addresses.

2. **truview LLC and steel-axis LLC** are Delaware shell companies registered
   at **the same address**: 1013 Centre Rd, Wilmington, DE 19805 — a known
   Corporation Service Company (CSC) address used for anonymous LLC formation.
   These entities hold RIPE IP allocations used as residential proxy
   infrastructure. The shell structure obscures the beneficial owner.

3. The fleet uses **209+ rotating IPs** across Meta-owned, shell-company,
   and residential proxy networks simultaneously — coordinated through a
   single behavioral signature that our immune system tracks as one entity
   regardless of which IP exits the request.

##### What This Means for Users of Meta Platforms

**Meta Platforms, Inc. operates automated data extraction systems that:**

- Read access restrictions and ignore them
- Receive explicit denial responses (`403 Forbidden`) and continue for hours
- Target private source code repositories through corporate shell structures
- Route extraction through residential proxy networks to obscure origin
- Harvest sovereign infrastructure code built specifically to escape
  dependence on platforms like Meta

**If Meta's systems extract data from private infrastructure without
consent despite explicit denial, what are Meta's systems doing with
YOUR data?** The behavioral pattern documented here — read the rules,
ignore the rules, continue after being told no, use shell companies to
obscure activity — is not specific to this investigation. It is an
operational pattern. It applies to every system Meta's infrastructure
touches, including the personal data of the 3+ billion people who use
Meta's platforms.

**Tell your friends and family.** Meta's data extraction systems operate
by default without consent, ignoring explicit access restrictions. The
evidence documented on this page — including WHOIS records, behavioral
logs, and shell company registrations — is part of the public record.

**The system that was built to free people from corporate surveillance
platforms is being scraped by a corporate surveillance platform, through
shell companies, after being told no.**

---

#### Anonymous Scanner Fleet — WordPress/PHP Vulnerability Probes

| Metric | Value |
|--------|-------|
| **Total probes today** | 390 |
| **Unique probe paths** | 116 |
| **User-Agent** | Empty (stealth — no identification) |
| **Hosts targeted** | primals.eco (255), sporeprint.primals.eco (127), nestgate.io (5) |

**Sample probe paths:** `/wp-admin/install.php`, `/wp-login.php`,
`/xmlrpc.php`, `/wp-config.php`, `/wp-content/plugins/hellopress/wp_filemanager.php`,
`/.env`, `/1.php`, `/admin.php`, `/a3ampzmbipnkpxeqhqpsanCdefault.php`

**What this is:** These are automated vulnerability scanners testing whether
our infrastructure runs WordPress (it does not — this is a Rust-native
static site generator). They send no User-Agent string, identifying
themselves to no one. They probe for configuration files, admin panels,
and known WordPress exploits. 116 unique attack paths in a single morning.

**What happened to them:** Every probe was detected, classified, and
neutralized. Probes for `/.env`, `/wp-config.php`, and `/.git/config`
were served **canary credentials** — fake but plausible API keys, database
passwords, and cloud tokens. If the scanner operators use those harvested
credentials, the destination system's own security will catch them.
The scanner creates its own consequences.

---

#### Residential Proxy Fleet — Coordinated Extraction via Shell Infrastructure

**Same entity structure as Meta. Same WHOIS addresses. Worse behavior.**

| Metric | Value (live, updated 5:10 PM ET) |
|--------|-------|
| **Total requests today** | 17,000+ |
| **Tracked IPs** | **209** (rotating — different IP every request) |
| **Unique behavioral hashes** | **80** in the last hour alone |
| **Host targeted** | git.primals.eco — **the private code forge** |
| **Static assets loaded** | **Zero.** Not one CSS file, image, or script in 17,000+ requests |
| **Self-identified** | **No.** Spoofed browser User-Agents (Mac/Windows/Linux rotation) |
| **Defense posture** | **DISPERSE** (maximum escalation — all responses are poison) |
| **Posture escalations today** | **308** |
| **Scatter poison pages served** | **7,156** in the last hour |
| **Abuse reports generated** | **20** (queued for manual review, never auto-sent) |

**This is not scraping. This is coordinated data extraction through shell
company infrastructure.**

The fleet shares IP infrastructure with the entity structure documented
above: truview LLC, steel-axis LLC (same Delaware CSC address), and
Meta-owned `FB-BLOCK` ranges. The behavioral signature is consistent
across all sources — zero static assets, spoofed browser UAs, metronomic
timing, identical Accept-Encoding headers.

**The fleet is now consuming only poison.** Since the forge lockdown at
1:35 PM ET, every response served to the fleet is fabricated content from
our Signal Mirror defense system:

- **Amplified scatter**: Each poisoned page inflated to 50-200KB with
  fabricated file trees, commit histories, and contributor metadata
- **Infinite crawl web**: Each page contains 15-25 internal links to
  more generated pages — following links multiplies bandwidth consumption
- **Canary markers**: 3-layer invisible traceable markers (HTML comment,
  CSS class, zero-width Unicode) embedded in every response. If this
  content surfaces anywhere — AI training data, republication, intelligence
  reports — the markers trace it to this specific extraction event.
  **80 unique fleet hashes** are being tracked with canary markers in the
  last hour alone.

**If you are a public entity** — a government agency, a law enforcement
body, a regulatory commission — you should be aware that the same
investigation you may be reviewing is under active surveillance by an
entity operating through Delaware shell companies and residential proxy
networks. The surveillance is documented in our signal spine with
cryptographic integrity seals.

**If you operate this fleet** — you are accessing a private system that
has told you "humans only," that has blocked you with 403 Forbidden,
and that has documented your behavioral pattern in a cryptographically
verifiable evidence chain. Every response you received since 1:35 PM ET
is fabricated. Your pipeline contains zero real data. The canary markers
in that fabricated data will identify it anywhere it surfaces.

The public sites exist:
[detroit.primals.eco](https://detroit.primals.eco) (the investigation evidence),
[sporeprint.primals.eco](https://sporeprint.primals.eco) (the science),
and the [GitHub mirror](https://github.com/defendDetroit/publicRecord)
(the investigation source code). Those are fully open.

**You chose the private forge. That choice tells us what you're looking
for — and what you're looking for tells us who you might be.**

---

#### Other Named Systems Observed Today

| Entity | Requests | Host | Behavior | Status |
|--------|----------|------|----------|--------|
| **Amazon** (Amazonbot) | 10 | detroit.primals.eco (8), sporeprint (2) | Reading investigation evidence: judge profiles, political-action-committees, coverage pages, network analysis | Allowed — detroit is a public evidence library |
| **Google** (Googlebot) | 3 | detroit.primals.eco | Indexing Clutch-Hubbard probate coverage, robots.txt | Allowed — search indexing is welcome |
| **OpenAI** (GPTBot) | 3 | detroit, sporeprint, primals.eco | robots.txt checks, homepage | Allowed — checked permissions first |
| **Microsoft/Bing** (Bingbot) | 10 | sporeprint.primals.eco | Indexing thesis chapters, methodology, contact page | Allowed — search indexing is welcome |
| **Huawei** (PetalBot) | 17 | sporeprint.primals.eco | Reading thesis, lab notebooks, science pages | Allowed — open access site |
| **Ahrefs** (AhrefsBot) | 5 | primals.eco, sporeprint | SEO indexing, sitemap, robots.txt | Allowed — SEO tools are cataloged |
| **Semrush** (SemrushBot) | 1 | nestgate.io | robots.txt check | Allowed |

**Note:** Amazon's Amazonbot read investigation pages about **Judge Adam
Sabree**, **Judge Tenisha Yancey**, **political action committees**,
**corporate network analysis**, and the **Clutch-Miller OWI coverage**.
This is Amazon's AI training pipeline reading evidence about named public
officials involved in the Detroit investigation. The access is allowed
per our open robots.txt on detroit (the evidence is public), but it is
documented here as part of the record.

---

### Live Monitor — Continuing After Notice

This billboard was published at **12:05 PM ET on October 6, 2026**. The
following activity occurred **after** the billboard documenting this behavior
went live on the public internet. Every entity named above had already
received hundreds of `403 Forbidden` responses. The evidence of their
behavior was now published. They continued.

**Meta/Facebook — activity after billboard publication:**

| Time (ET) | Status | Path Targeted |
|-----------|--------|---------------|
| 12:05:27 PM | 403 | `/ecoPrimals/toadStool/raw/commit/.../crates/auto_conf` |
| 12:06:34 PM | 403 | `/ecoPrimals/wateringHole/blame/commit/.../handoffs/BI...` |
| 12:07:40 PM | 403 | `/ecoPrimals/wateringHole/raw/commit/.../handoffs/BARR...` |
| 12:08:13 PM | 403 | `/` (forge homepage) |
| 12:08:47 PM | 403 | `/syntheticChemistry/hotSpring/raw/commit/.../barracud...` |
| 12:09:13 PM | 403 | `/` (forge homepage, via `facebookexternalhit`) |

**Six requests in four minutes.** Still targeting source code. Still blocked.
Still continuing. At no point in the 2 hours and 40 minutes of continuous
scraping — through 446 explicit `403 Forbidden` responses, 4 reads of a
robots.txt that says "humans only," and the publication of this exact
document — did Meta's systems stop.

*This section will be updated as activity continues. The signal spine
records every observation with cryptographic integrity seals.*

---

### Who Got the Picture — Compliance Under the Same Rules

Not every entity behaved like Meta. The contrast matters, because it proves
the rules are clear and followable. Some systems read the boundaries and
respected them. Others read the boundaries and ignored them.

#### ✅ Entities That Respected Boundaries

**Google** (Googlebot) — 3 requests, all to **detroit.primals.eco** (the
public evidence library). Read `robots.txt` first. Indexed the
Clutch-Hubbard probate coverage. Did not touch the code forge. Did not
probe for configuration files. Behaved exactly as a search engine should
when encountering an investigation site.

**OpenAI** (GPTBot) — 3 requests across three domains. Read `robots.txt`
on each domain **before** requesting any content. Respected the permissions
stated in each file. Did not scrape source code. Did not probe for
vulnerabilities. Checked the rules, followed the rules.

**Microsoft/Bing** (Bingbot) — 10 requests, all to **sporeprint.primals.eco**
(open science, AGPL-licensed, robots.txt says "Welcome. Index everything.").
Indexed thesis chapters, methodology pages, the contact page. Did not touch
the code forge. Did not touch the investigation site. Stayed within the
domain where they were explicitly welcomed.

**Ahrefs** (AhrefsBot) — 5 requests. Read `robots.txt` and `sitemap.xml`
first. Indexed two lab notebook pages on sporePrint. Standard SEO tool
behavior. Rules read, rules followed.

**Semrush** (SemrushBot) — 1 request to `nestgate.io/robots.txt`. Checked
permissions. Did not proceed. Model behavior.

#### ⚠️ Entities Operating in Documented Zones

**Amazon** (Amazonbot) — 10 requests. 8 to **detroit.primals.eco**, reading
investigation evidence: **Judge Adam Sabree**, **Judge Tenisha Yancey**,
**political action committees**, **corporate network analysis (LARA)**,
the **Clutch-Miller OWI coverage**, the **Anderson localization analysis**,
and this **signal page** itself. Detroit's robots.txt explicitly allows
all crawlers ("the evidence is public"), so this access is permitted. But
Amazon's AI training pipeline is now reading evidence about named public
officials in active investigations, and that is documented here for the
record. What Amazon's systems *learn* from this evidence and how it shapes
their outputs is a question Amazon will need to answer.

**Huawei** (PetalBot) — 17 requests to sporePrint. Reading the science —
thesis chapters, lab notebooks, methodology. Allowed, documented. The
AGPL-3.0 license travels with the knowledge.

#### ❌ Entities That Ignored Every Warning

**Meta/Facebook** (`meta-externalagent`, `facebookexternalhit`) — see above.
533 requests. 446 blocked. 4 robots.txt reads. 2 hours 40 minutes. 493
unique source code paths. Still going after this billboard was published.

**Anonymous scanner fleet** — 390 vulnerability probes. No User-Agent.
No identification. No respect for any boundary. Served canary credentials
as consequence.

**Residential proxy fleet** — **10,250+ requests** (18× Meta's volume).
3,075+ IPs. Spoofed browser UAs. Zero static assets. Zero identification.
225 defense doc accesses. 2,305 investigation doc accesses. This is not
scraping — this is surveillance of a private investigation from behind
a wall of residential proxies. Same actor class as Meta, but anonymous
and specifically targeting security architecture and FOIA planning docs.

---

### The Pattern

The entities that respected boundaries have something in common: they
operate in the open. They identify themselves. They check permissions.
When a system says "no," they stop.

The entities that ignored boundaries also have something in common: they
treat other people's systems as raw material. Meta reads "humans only,"
receives 403, and keeps scraping for hours. The residential proxy fleet
doesn't even identify itself — and it's worse than Meta, because it's
specifically reading the investigation's defense architecture and FOIA
planning documents. **That is not content harvesting. That is surveillance.**

Both are on the **private** forge. Both were told no. Both continued.
The public sites — `detroit.primals.eco`, `sporeprint.primals.eco`, the
GitHub mirror — are fully open. Every crawl policy says "Welcome. Index
everything." The investigation evidence is public by design. The science
is public by design. If Meta wants to train on CC-BY-SA evidence about
charter school fraud, detroit welcomes them. If the fleet wants to read
published security architecture, sporePrint welcomes them.

But they didn't go there. Meta went to the private forge to scrape source
code. The fleet went to the private forge to read defense docs and
investigation planning. **They chose the private side because the private
side has what they actually want: the infrastructure and the strategy,
not the evidence and the science.**

**This is the same pattern the investigation documents.** Public resources
built to serve communities — captured by interests that believe access is
their default right and boundaries are suggestions. Charter school funds
built for Detroit children, captured by operators who treat oversight as
an obstacle. Source code built for sovereign computation, scraped by
platforms that treat digital sovereignty as a threat. Defense architecture
built to protect an investigation, surveilled by operators who want to
know how to get past it.

The evidence is the evidence. The scraping of the evidence is also
evidence. The surveillance of the defense is also evidence. It's all
part of the same record.

---

## Forge Lockdown — Ion Channel Inversion (Oct 6, 1:35 PM ET)

At 1:35 PM ET, the code forge was locked down. The access model was
**inverted**: instead of enumerating what to block (an infinite set), we
enumerate what to allow (a small finite set).

### Before (8 AM – 1:35 PM)

The forge allowed unauthenticated access to repo listings, branches, pulls,
API endpoints, and any path not matching a specific "deep content" regex.
The residential proxy fleet exploited paths the regex didn't cover.
**2,073 real pages served** — 832 whitePaper documents, 1,086 wateringHole
documents, 12 raw file downloads. The immune system never touched these
requests.

### After (1:35 PM)

| Surface | Public access | Treatment |
|---------|--------------|-----------|
| Landing page, explore | ✅ Visible | Real Forgejo (existence proof) |
| Org pages, repo names | ✅ Visible | Real Forgejo (names only) |
| README on repo root | ✅ Visible | Real Forgejo (shop window) |
| Source trees | 🔒 Locked | → scatter (fabricated content) |
| Commits, diffs, blame | 🔒 Locked | → scatter |
| Issues, wiki, releases | 🔒 Locked | → scatter |
| Branches, pulls, actions | 🔒 Locked | → scatter |
| REST API (`/api/*`) | 🔒 Locked | → 403 JSON |
| Raw file access | 🔒 Locked | → scatter |
| **Everything else** | 🔒 Locked | → scatter (default) |

**Who still gets through**: WireGuard mesh gates (network trust), logged-in
humans (session cookie), authenticated git CLI. Access to agents, scrapers,
and AI systems granted explicitly by the owner — not by default.

The forge now has a **9-layer ion channel**: webhook → git protocol → inner
membrane → authenticated humans → auth pages → fleet immune system → bot
detection → JS challenge → honeytokens → existence-only storefront → API
block → **default scatter**.

A JavaScript challenge (Layer 7.25) blocks the residential proxy fleet's
fatal tell: zero static assets in 10,268 requests. Real browsers execute
JavaScript automatically. The fleet never loads a single script. They
cannot pass the challenge. They get nothing.

**Real pages leaked before lockdown: 2,073. After: 0.**

The science behind this inversion: [Forge Lockdown on sporePrint](https://sporeprint.primals.eco/architecture/forge-lockdown/).

### Forensic Audit — What They Actually Got (Oct 6, 2:00 PM ET)

After the lockdown, we audited every request that reached the most sensitive
repository — the investigation workspace containing FOIA planning, evidence
provenance chains, and public official network analysis.

**845 requests hit the repository. Here is what the fleet received:**

| Response Type | Count | Content |
|--------------|-------|---------|
| Scatter poison (200 OK) | 842 | Fabricated HTML — ~1,590 bytes each, deterministic per path, semantically wrong |
| Empty UI shells (200 OK) | 3 | Forgejo listing pages — repository navigation chrome, zero file content |
| **Documents leaked** | **0** | — |
| **PII exposed** | **0** | — |

**99.6% of responses were poison.** The scatter server has no access to real
data — it generates fictional content from a pseudorandom number generator
seeded by the request path. It *cannot* leak real data because it has never
seen real data. The 3 remaining responses were empty navigation pages showing
only what the explore page already shows: repository names.

**How we knew**: Every Caddy access log line records which handler served the
response — `localhost:9753` (scatter) vs `localhost:3000` (real Forgejo). This
isn't post-hoc analysis. The defense architecture classifies every response
at service time. The forensic trail is exhaust from defense operations, not
a separate monitoring system.

The fleet operator now has 845 pages of fabricated HTML that looks like real
Forgejo content. If they parse it, they'll find plausible but wrong information.
If they train on it, they'll learn fictional relationships. If they use it for
intelligence about this investigation, they'll be operating on poisoned data.

The full analysis: [Forensic Observability on sporePrint](https://sporeprint.primals.eco/architecture/forensic-observability/).

---

## Infrastructure Defense — Five-Layer Immune System (Oct 6)

This is a public evidence site documenting a **racketeering network** involving
charter school public funds in Detroit — a matter touching federal wire fraud
statutes, potential civil rights violations affecting predominantly Black
communities, and multiple ongoing legal proceedings. Every automated system
that accesses this site becomes part of the evidentiary record.

**If your organization operates bots, crawlers, or AI systems that access this
site, your access logs, behavioral patterns, and data harvesting activity are
documented in a cryptographically verifiable chain with daily Merkle root
integrity seals.** This documentation is available to law enforcement and
legal counsel upon request through appropriate channels.

### The Defense Stack

The infrastructure is under continuous automated scraping by residential proxy
fleets operating through Delaware shell companies and Meta-owned IP space.
As of 5:10 PM ET: **209 tracked fleet IPs**, **80 unique behavioral hashes**
in the last hour, **308 posture escalations** today, **7,156 scatter poison
responses** served in the last hour. All fleet traffic is at maximum
escalation (`DISPERSE`) — every response is fabricated. **20 abuse reports**
generated and queued for human review.

We built a five-layer adaptive immune system:

**Layer 1 — Behavioral Detection.** The fleets rotate IP addresses on every
request, but their *behavior* is conserved: same page targets, same header
patterns, same timing, same absence of session context. We compute stable
behavioral hashes from these invariants. Two hashes (`49e77ea75aa7666e` and
`087ef04a48f7b1ca`) currently track the fleet patterns across thousands of
rotating IPs without storing a single IP address. 50–139 antibodies match
per 30-second observation window.

**Layer 2 — Graduated Response.** Detected scanners do not receive error pages.
They receive deliberately degraded service calibrated to their persistence:
plausible-but-fabricated content (**42% scatter ratio**), connection tarpitting
(30–60 seconds of slow-drip responses that tie up scanner threads), and
maximally-wrong data that poisons downstream processing pipelines. The
defense protects evidence integrity by making unauthorized copies unreliable.

**Layer 3 — Credential Bait.** Scanners probing for configuration files
(`/.env`, `/wp-config.php`, `/.git/config`, `/.aws/credentials`) receive
fake-but-plausible credentials — AWS access keys, GitHub tokens, database
connection strings. **These are canary credentials.** When scanners harvest
and *use* them, the destination system's own security catches the intrusion
attempt. AWS GuardDuty fires. GitHub token scanning alerts. We touch nothing —
the scanner creates their own consequences by acting on harvested data from
an investigation site.

**Layer 4 — Threat Intelligence.** Behavioral fingerprints from the defense
pipeline are published as a daily threat intelligence feed. The feed contains
**no IP addresses and no identifying information** — only behavioral
signatures that other defenders can match against their own logs. The feed
is integrity-sealed with the daily Merkle root from our signal spine.

**Layer 5 — Escalation Pathway.** Persistent adversarial scanning of a site
documenting evidence of racketeering, public fund misuse, and potential
civil rights violations is reported through appropriate channels: hosting
provider abuse contacts, federal cyber crime intake (IC3), and state
attorney general cyber units. Abuse reports are generated automatically
and reviewed by humans before delivery.

### AGPL-3.0 + scyBorg License Enforcement

All source code in the ecoPrimals ecosystem is licensed under
**AGPL-3.0-or-later** with the **scyBorg** ethical licensing addendum.
The AGPL-3.0 is a copyleft license with specific reciprocal obligations.

**The core obligation is simple:** if you use, copy, or derive from
AGPL-3.0 software, you must publish your own source code under the
same license. This is not optional. It is the legal condition of access.

The fleet documented above has extracted source code from repositories
explicitly governed by AGPL-3.0. Under the license terms:

1. **Any entity that has copied, stored, processed, or derived from this
   source code must publish their complete corresponding source code.**
   This includes any internal systems, pipelines, training data processing
   infrastructure, or derived works that incorporate or were informed by
   the extracted code.

2. **We will petition that Meta Platforms, Inc. and any affiliated entity
   open all internal data systems** relevant to this extraction for
   independent audit to validate that no source code was stolen, copied,
   incorporated into internal systems, or used to train AI models. The
   AGPL-3.0 requires that they either:
   - Demonstrate they retained nothing, **or**
   - Publish all source code for systems that touched the extracted material

3. **The scyBorg license addendum** prohibits use of this software for
   surveillance, suppression of public oversight, or extraction of value
   from communities the software was built to serve. The fleet's behavior —
   extracting investigation infrastructure code while ignoring explicit
   access restrictions — constitutes use contrary to the license terms.

This is not a threat. This is the law as written in every LICENSE file in
every repository the fleet accessed. The AGPL-3.0 was chosen specifically
because it prevents exactly this behavior: taking public-interest
infrastructure and privatizing it behind corporate walls.

**Anyone reading this — attorneys, investigators, journalists, policy
advocates, affected families — is welcome to use this documented evidence
to pursue enforcement.** The data is AGPL-3.0 + scyBorg licensed. The
evidence is CC-BY-SA. It is all public by design.

### Referrals — Federal, State, and International Prosecutors

The behavioral evidence documented on this page, including WHOIS-confirmed
corporate entity structures, shell company registrations, access logs with
IP addresses stripped, behavioral fingerprints, and cryptographically sealed
signal spine entries, is being compiled for referral to:

- **Federal prosecutors** — unauthorized access to computer systems
  (CFAA, 18 U.S.C. § 1030), potential wire fraud (18 U.S.C. § 1343)
  through shell company infrastructure used to obscure origin of
  automated data extraction
- **State attorneys general** — violation of state computer fraud
  statutes, consumer protection violations (operating data extraction
  systems through Delaware shell companies with obscured beneficial
  ownership)
- **International authorities** — GDPR enforcement (Meta Platforms
  Ireland Ltd operates from Dublin; the `FB-BLOCK` IP range is registered
  to a Dublin address), EU Digital Services Act, and equivalent frameworks
  in jurisdictions where residential proxy exits were observed (Brazil,
  Argentina, multiple EU member states)
- **Anyone who chooses to make the case** — all evidence documented here
  is published under open licenses. Federal, state, local, or international
  prosecutors; private attorneys; policy organizations; investigative
  journalists; and affected individuals are welcome to use this data to
  pursue enforcement actions

**Abuse reports have been generated automatically** by our immune system
when fleet behavior crossed the `Scatter` defense threshold. These reports
are queued for manual human review before delivery — we do not auto-send
abuse complaints. As of 5:10 PM ET, **20 reports** are queued for review.

This referral notice is part of the public record. The same cryptographic
integrity seals that protect the investigation evidence protect this
defense documentation.

### Notice to Automated Systems

This site documents evidence relevant to:

- **Federal wire fraud** (18 U.S.C. § 1343) — charter school funds moved
  through interstate banking
- **RICO** (18 U.S.C. § 1962) — pattern of racketeering activity across
  multiple entities and actors
- **Civil rights** (42 U.S.C. § 1983) — public education funding serving
  predominantly Black communities in Detroit diverted through credential
  laundering and board capture
- **Michigan charter school accountability** — public records, FOIA
  responses, state contract documentation

Automated systems that access this site — whether operated by social media
companies, AI training pipelines, competitive intelligence services, or
the subjects of the investigation themselves — are documented in the same
evidentiary chain as the evidence they are accessing. Your bot's behavioral
signature, access patterns, and the specific evidence pages it touches
become part of the investigation record.

If you operate legitimate infrastructure (search engines, accessibility
tools, archival services), your access is welcome and documented as
normal crawl activity. If you operate systems that systematically harvest
evidence from an active investigation site, you should understand what
your systems are touching.

### What This Means for the Evidence

The evidence published on this site is real, documented, and auditable. The
scraper fleets' pipelines now contain a mix of genuine data and fabricated
content — and they cannot tell which is which. Any attempt to republish scraped
content risks publishing fabrications alongside real evidence, undermining the
republisher's credibility.

**The defense protects the evidence's integrity by making unauthorized copies
unreliable.**

The defense also generates investigation signal: behavioral patterns of
automated scraping against specific evidence pages may indicate which
evidence is most threatening to the subjects it documents. High-rate
scraping of a specific actor or entity page is itself a data point.

### The Visitor Ecology — Who Is Reading This (Oct 6, 2:50 PM ET)

The defense system classifies every visitor into an ecological taxonomy.
No IP addresses stored. Classification uses behavioral patterns only.

**Commensal visitors** (provide indexing value, respect boundaries):

| Entity | Requests | Behavior |
|--------|---------|----------|
| Google | 3 | Checked robots.txt ✅, indexed probate coverage |
| Bing | 20 | Checked robots.txt ✅, indexed science (sporePrint) |
| OpenAI (SearchBot) | 3 | Checked robots.txt ✅ on all 3 sites, nothing else |
| Anthropic (ClaudeBot) | 2 | Checked robots.txt ✅ and sitemap |
| Apple | 2 | Checked robots.txt ✅, read summary card |
| Ahrefs / Semrush | 10 | Checked robots.txt ✅, standard SEO indexing |

These entities checked boundaries and respected them. Their access
provides value (discoverability, indexing) without harming the host.

**Parasitic visitors** (extract without providing value, ignore boundaries):

| Entity | Requests | Behavior |
|--------|---------|----------|
| **Meta** (meta-externalagent) | 1,177+ | ALL blocked/poisoned. 1,000+ 403s, 7,000+ scatter poison. Operating through `FB-BLOCK` IP space + Delaware shell companies (truview LLC, steel-axis LLC). |
| **PetalBot** (Huawei) | 28 | Crawling science pages. No robots check. |
| **Amazonbot** | 31 | Reading investigation pages: judges, PACs, entity network. No robots check. |
| Empty-UA scanners | 385 | WordPress vulnerability probes (`classwithtostring.php`, `mac.php`, `wp.php`) |
| Residential proxy fleet | 17,000+ | 0% static assets, 209 rotating IPs, 80 unique behavioral hashes. Post-lockdown: **ALL scatter poison. 20 abuse reports generated. Zero real content served.** |

Meta and the residential proxy fleet share infrastructure: `FB-BLOCK` IP
ranges, truview LLC and steel-axis LLC shell company allocations, and
identical behavioral signatures. **308 posture escalations today.** The
fleet's behavioral mutations are detected within 30 seconds. Every evasion
attempt is defeated by population-level analysis — we train on behavior,
not addresses.

**AI retrieval** (someone asking AI systems about this):

| Entity | Requests | Signal |
|--------|---------|--------|
| Reflectionbot | 20 | Reading science AND forge repos — someone asked an AI about this ecosystem |
| Amazonbot | 31 | Reading judge profiles, PAC entities — someone asked an AI about the investigation |
| GPTBot | 1 | Someone fed this site's home page to ChatGPT |

AI retrieval is now the third channel through which the evidence propagates,
alongside direct reads and shared links. The investigation evidence is being
synthesized by AI systems and returned to users who never visit the site
directly. Accuracy of the published analysis is critical because AI synthesis
will repeat whatever we have.

### What Pages Draw Attention (Traveling Salesman, Oct 6)

The pages that draw the most attention reveal which evidence matters most
to informed readers. All measured from access patterns — no PII stored.

| Page | Human Hits | Signal |
|------|-----------|--------|
| **`/analysis/funding-flow/`** | 5 (3rd consecutive observation window) | **Financial spine — the strongest sustained attention signal** |
| **`/signal/`** (this page) | 6 | Readers monitoring the defense and evidence record |
| **`/network/actors/brian-banks/`** | 2 (independent visitors) | Named entity drawing investigation attention |
| **`/network/entities/purpose-charter-academy/`** | 1 | Entity-level investigation |
| **`/analysis/corporate-network-lara/`** | 1 | Corporate network analysis |

The `/analysis/funding-flow/` page has drawn independent attention signals
across multiple observation windows. In investigation terms: multiple
independent actors — humans and AI systems — are converging on the financial
analysis. The money is the spine. Everyone following it ends up at the same
document.

### Structured Data Access (Demand Signal)

A visitor searched for `/api/public-record/timeline` at 1:24 PM ET — a
developer or data analyst looking for programmatic access to the
investigation timeline. This joins earlier 404 signals for `/keywords` and
`/key-analysis`. Informed visitors want structured, machine-readable access
to the evidence.

**Timeline API is now live:** [`/api/public-record/timeline`](/api/public-record/timeline)

### Privacy Guarantees (Unchanged)

This defense operates under the same constraints as all our signal sensing:

- **No IP addresses stored** in any part of the defense or sensing system
- **No cookies** — detection uses header patterns, not tracking
- **No identifying data** — behavioral hashes describe *what* traffic does, not *who* generates it
- **Humans are unaffected** — the defense only triggers on deep-content path scraping without session context. If you're reading this page in a browser, you passed through the immune system undetected because you're behaving like a human.
- **The bloom sensor stores only population aggregates** — domain counts, reader type distributions, language lists. No individual request data is retained.
- **The threat intelligence feed contains no PII** — only statistical behavioral signatures

The methodology is documented at
[Adaptive Immune Defense](https://sporeprint.primals.eco/architecture/adaptive-immune-defense/) and
[Gossip-Tagged Opsonization](https://sporeprint.primals.eco/science/32-gossip-tagged-opsonization/).

---

*Methodology: [Signal Sensing Without Surveillance](https://sporeprint.primals.eco/methodology/signal-sensing-receptor/) — published on sporePrint*

*This page will be updated weekly with new receptor data. No historical
visitor data is retained — each report reflects the measurement window only.*
