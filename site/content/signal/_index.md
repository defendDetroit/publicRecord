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
| Oct 6 | Afferent sensor deployed, immune defense documented | 233 | — | ✅ Live |

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

## Infrastructure Defense — Immune System Update (Oct 6)

The infrastructure that hosts this evidence site and its source code is under
continuous automated scraping by residential proxy fleets — as of October 6,
**10 simultaneous fleets** operating approximately **1,200 unique IP addresses
each** per 30-minute window. Total tracked IPs: **1,945** in the current session.
Each IP makes a single request and never returns. The fleets target commit-level
data from the source code repository.

### What we're doing about it

We built an adaptive immune system. Not a firewall — a biological-style defense
that identifies *behavior*, not *identity*:

1. **Behavioral fingerprinting** — The fleets rotate IP addresses on every
   request, but their *behavior* is conserved: they always target the same types
   of pages, with the same header patterns, the same timing, the same absence
   of session context. We compute stable hashes from these behavioral invariants.
   Two hashes (`49e77ea75aa7666e` and `087ef04a48f7b1ca`) currently track the
   fleet patterns across thousands of rotating IPs without storing a single
   IP address.

2. **Gossip-tagged identity** — When the immune system detects a fleet pattern,
   it emits a behavioral tag through our mesh network. The tag (called an
   **opsonize tag**) propagates to all gates. 50–139 antibodies match per
   30-second window. The fleet is known to the entire infrastructure.

3. **Poison content delivery** — Instead of blocking detected fleet requests,
   we serve plausible-but-fabricated content at a **42% effective scatter ratio**.
   Fake commit pages, fictional file views, synthetic code. ~20% of fleet
   requests receive 200 responses with fabricated data; ~78% receive
   deterministic false-404 decoys. The fleet's data pipeline ingests the
   fabricated content as real data.

4. **Afferent sensing (NEW — Oct 6)** — The system now has a **sensory channel**
   (BloomSensor) that detects positive signal simultaneously with immune defense.
   The bloom sensor classifies every request by content domain, reader type,
   referrer source, and language — without storing any identifying data. It
   can feel both the humans reading evidence and the fleets hitting the forge.

### What this means for the evidence

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

### Privacy guarantees (unchanged)

This defense operates under the same constraints as all our signal sensing:

- **No IP addresses stored** in any part of the defense or sensing system
- **No cookies** — detection uses header patterns, not tracking
- **No identifying data** — behavioral hashes describe *what* traffic does, not *who* generates it
- **Humans are unaffected** — the defense only triggers on deep-content path scraping without session context. If you're reading this page in a browser, you passed through the immune system undetected because you're behaving like a human.
- **The bloom sensor stores only population aggregates** — domain counts, reader type distributions, language lists. No individual request data is retained.

The methodology is documented at
[Adaptive Immune Defense](https://sporeprint.primals.eco/architecture/adaptive-immune-defense/) and
[Gossip-Tagged Opsonization](https://sporeprint.primals.eco/science/32-gossip-tagged-opsonization/).

---

*Methodology: [Signal Sensing Without Surveillance](https://sporeprint.primals.eco/methodology/signal-sensing-receptor/) — published on sporePrint*

*This page will be updated weekly with new receptor data. No historical
visitor data is retained — each report reflects the measurement window only.*
