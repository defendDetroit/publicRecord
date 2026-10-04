+++
title = "Signal Sensing — Live Propagation Data"
description = "Real-time oversight signal measurement for detroit.primals.eco. No cookies. No tracking. No identifying data. Did the signal get through?"
weight = 15
sort_by = "weight"

[extra]
og_description = "Live signal sensing data — measuring whether oversight signals propagate through institutional systems. Cookieless, trackingless, purely sensory."
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

## Signal Status — Week of Oct 3, 2026

### Emission (LuxI — outbound)

| Date | Event | Pages | IndexNow | Status |
|------|-------|-------|----------|--------|
| Oct 2 | Contact page updated | 213 | 212 URLs | ✅ HTTP 200 |
| Oct 3 | Coverage section launched (10 cross-index pages) | 233 | 232 URLs | ✅ HTTP 200 |
| Oct 3 | Signal transparency notice added to footer | 233 | 232 URLs | ✅ HTTP 200 |
| Oct 4 | Behavioral classification deployed | 233 | 232 URLs | ✅ HTTP 200 |

Every page publish triggers an IndexNow notification to Bing and a Google
Search Console sitemap ping. The signal is emitted automatically — no manual
submission required.

### Reception (LuxR — inbound)

| Date | Total Requests | Human | Search Bot | AI Bot | Scraper Bot | Crawl Coverage |
|------|---------------|-------|------------|--------|-------------|---------------|
| Oct 2 | 78 | 25 | 29 | — | — | 39% (12/31) |
| Oct 3 | 166 | 9 | 138 | 2 | — | 63% (26/41) |
| Oct 4 (partial) | 19 | 7 | 6 | 1 | 0 | 46% (6/13) |

**Oct 3 saw a 376% increase in search bot activity** following the coverage
section launch. Search engines are actively indexing the new cross-reference
pages linking to Clutch Justice, Detroit Free Press, and Chalkbeat reporting.

### Crawl Coverage Trend

Crawl coverage measures what fraction of unique pages on the site have been
visited by at least one search engine crawler. Higher coverage means more of
the evidence database is discoverable through search.

| Date | Pages in Sitemap | Unique Paths Seen | Bot-Crawled | Coverage |
|------|-----------------|-------------------|-------------|----------|
| Oct 2 | 213 | 31 | 12 | 39% |
| Oct 3 | 233 | 41 | 26 | 63% |

### Activation Patterns

"Activation" means a human navigated beyond a single page — they investigated.

**Observed activation behaviors** (Oct 2–4, aggregated, no identifying data):

- **Evidence → Contact**: A human viewed FOIA financial evidence, left the site,
  returned 2.5 hours later, checked the contact page, then researched a
  specific individual in the network map and the dynasty analysis. This is
  investigation behavior — reading evidence, considering engagement, then
  mapping the network.

- **Coordinated access**: Three different device types accessed the same
  two pages (a network actor + an entity) within 1 second of each other.
  This indicates shared links — someone distributed specific URLs to a group.

- **Deep evidence reads**: Multiple humans accessed FOIA audit documents,
  investigation files, and the MDE evidence depot. These are not casual
  visitors — they're reading primary source material.

### Bot Ecosystem

| Bot Type | What It Means | Oct 3 Activity |
|----------|--------------|----------------|
| **Googlebot** | Page will appear in Google search results | Active — crawling connections, entities, evidence |
| **Bingbot** | Page will appear in Bing search results | Active — deep-crawling network map |
| **AI Bots** | Content consumed by AI systems (GPT, Claude) | 2 hits — AI systems are reading the evidence |
| **Social Bots** | Someone shared a link on social media | 1 hit — a link was shared somewhere |
| **Scraper Bots** | Automated scanning, not reading | 23 hits (credential scanners, properly classified) |

---

## What the Signal Tells Us

### The system is conducting

Search engines are actively crawling the evidence database. Coverage rose from
39% to 63% in one day after the coverage section launch. IndexNow notifications
are accepted (HTTP 200). The signal is entering the network.

### Humans are activating

Multiple humans are not just visiting — they're downloading evidence, checking
specific individuals by name, visiting the contact page, and returning for
subsequent sessions. This is investigation behavior, not casual browsing.

### The coverage cross-index works

The new `/coverage/` section — linking to Clutch Justice, Detroit Free Press,
and Chalkbeat reporting — was crawled by search bots within hours of deployment.
Outbound links to high-authority journalism domains signal to search engines
that this site participates in a legitimate content network.

---

## How to Read This Data

This is not web analytics. We don't know how many "unique visitors" we have.
We don't know where they came from. We don't know who they are.

What we know:
- **The signal was emitted** (pages published, search engines notified)
- **The signal propagated** (bots crawled, humans arrived)
- **Investigation behavior occurred** (evidence downloaded, network explored, contact considered)
- **The signal is conducting through the network** (search coverage increasing, AI systems consuming, social links shared)

What we don't know and can't know:
- Whether the person who read the RICO analysis is a journalist, an attorney,
  or a subject of the investigation checking their own exposure
- Whether the coordinated three-device access was a legal team, a community
  group, or individuals who happened to click the same shared link
- Whether anyone has acted on what they read

The receptor answers one question: **did the signal get through?**

The answer, as of this week: **yes. The system is conducting.**

---

*Methodology: [Signal Sensing Without Surveillance](https://sporeprint.primals.eco/methodology/signal-sensing-receptor/) — published on sporePrint*

*This page will be updated weekly with new receptor data. No historical
visitor data is retained — each report reflects the measurement window only.*
