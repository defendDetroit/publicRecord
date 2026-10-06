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
| Oct 6 | Five-layer immune defense deployed, threat feed published | 233 | — | ✅ Live |

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

*Updated: October 6, 2026, 12:04 PM ET. All data derived from server access
logs. No IP addresses are stored or published. Entity identification is based
solely on self-declared User-Agent strings — the identities these systems
chose to announce.*

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
| **Total requests today** | 533 |
| **Requests blocked (403 Forbidden)** | 446 |
| **Connection drops (tarpit/timeout)** | 87 |
| **Unique paths scraped** | 493 |
| **Duration of scraping** | 2 hours 35 minutes continuous (9:29 AM – 12:04 PM ET) |
| **robots.txt reads** | 4 (they read it — then ignored it) |
| **Host targeted** | git.primals.eco (sovereign code forge) |

**What they scraped:** Deep paths into private source code repositories —
individual git commits, raw source files, handoff documents, architecture
documentation. Not public web pages. Not the investigation evidence. The
*source code itself*.

**Repositories targeted** (by request volume):

| Repository | Requests | Contains |
|------------|----------|----------|
| ecoPrimals/wateringHole | 191 | Project coordination, handoff documents, ecosystem strategy |
| ecoPrimals/toadStool | 143 | GPU compute framework, Rust source code, architecture docs |
| ecoPrimals/biomeOS | 34 | Operating system kernel, deployment infrastructure |
| ecoPrimals/bearDog | 33 | Build system, compilation tools |
| ecoPrimals/songBird | 25 | Communication infrastructure, WireGuard networking |
| ecoPrimals/squirrel | 23 | MCP integration, plugin system |
| 12 other repositories | 48 | Various sovereign infrastructure components |

**What they were told:** The `robots.txt` at `git.primals.eco` states:

> *"This forge serves humans only. Automated access: https://github.com/ecoPrimals"*

Meta's crawler read this notice **four times today**. It continued scraping.
Every request received `403 Forbidden`. It continued scraping. For two and
a half hours. Across 493 unique source code paths.

**What this means:** Meta Platforms, Inc. operates automated systems that:
- Read access restrictions and ignore them
- Receive explicit denial responses and continue
- Target private source code repositories, not public web content
- Sustain scraping campaigns for hours despite continuous blocking
- Harvest sovereign infrastructure code built specifically to escape
  dependence on platforms like Meta

**The system that was built to free people from corporate surveillance
platforms is being scraped by a corporate surveillance platform.**

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

#### Residential Proxy Fleet — Behavioral Hash `49e77ea75aa7666e`

| Metric | Value |
|--------|-------|
| **Tracked IPs (current session)** | 3,075+ |
| **Behavioral hash** | `49e77ea75aa7666e` (primary), `087ef04a48f7b1ca` (secondary) |
| **Detectors firing** | 2 per observation window |
| **Antibody matches** | 50–139 per 30-second window |
| **Mutation attempts** | 10+ distinct behavioral variants in 24 hours |
| **Mutation success** | Zero — all variants detected within one observation cycle |

**What this is:** A large-scale residential proxy fleet rotating through
thousands of IP addresses per session. Each request comes from a different
IP, but the *behavior* is identical: same page targets, same header patterns,
same timing, same absence of session context. Our behavioral hashing
identifies the fleet regardless of IP rotation — the same way you recognize
a person by how they walk, not what shoes they wear.

**Mutation behavior observed:** The fleet tested 10+ behavioral variants
in the past 24 hours — changing header order, timing patterns, and path
selection. Every variant was detected within one 30-second observation
cycle. The fleet reverted to its original behavior each time. This is
active adversarial testing of our detection system by a well-resourced
operator with thousands of residential proxy IPs.

**Who operates this:** Unknown. Residential proxy fleets of this scale
are commercially available and could be operated by data brokers,
competitive intelligence services, AI training pipelines, or the subjects
of the investigation itself. The behavioral evidence is sealed in the
signal spine regardless.

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

### What the World Deserves to Know

When a single person builds sovereign infrastructure to publish evidence
of public fund misuse in a majority-Black city — and the first thing that
happens is Meta's crawlers show up to scrape the source code for AI
training, ignoring every access restriction, every 403 block, every
robots.txt notice — **that tells you everything about the relationship
between corporate AI and the communities it extracts from.**

Meta did not read the investigation evidence. Meta did not index the
charter school fraud documentation. Meta's systems went straight for the
**source code** — the intellectual property, the architecture, the
sovereign infrastructure itself. Not the message. The medium.

This is extraction behavior. The same pattern the investigation
documents in Detroit's charter school system — public resources built
for communities, captured by private interests — is playing out in
real time on the infrastructure built to expose it.

**The evidence is the evidence. The scraping of the evidence is also
evidence. It's all part of the same record.**

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
fleets — as of October 6, **10 simultaneous fleets** operating approximately
**1,200 unique IP addresses each** per 30-minute window. Total tracked IPs:
**1,945** in the current session. The fleets demonstrated **behavioral mutation**
— 7 new scanning patterns in 24 minutes — then reverted to original behavior
when all 7 were detected.

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
