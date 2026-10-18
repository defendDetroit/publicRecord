# Membrane Rewire Plan — October 18, 2026

Generated from scan-sweep-sort pipeline analysis + ASN investigation.
Execute Rust-side changes when intra-membrane systems go live.

---

## COMPLETED (from this session)

### 1. Entity Identification: 74.7.x.x = Microsoft (AS8075)

**Finding:** The 1.38M-request "Unknown" block is **Microsoft Corporation.**
- ASN: AS8075
- Registered to: Microsoft Limited
- Location: Atlanta, Georgia datacenter
- Usage type: Data Center/Web Hosting/Transit
- IP range: 74.7.0.0/16 (entire /16 is Microsoft)
- Note: Transferred from ARIN to RIPE NCC in April 2024, which is why geolocation databases show "??"

**Implication:** This could be:
- Bingbot (usually uses different ranges, but Microsoft rotates)
- An Azure customer (OpenAI runs on Azure)
- Microsoft Copilot/AI crawling infrastructure
- Azure DevOps mirroring service

**Action taken:** Updated `the-fleet-is-live.md` with attribution.

**Action needed (Rust-side):** Add ASN mapping for 74.7.0.0/16 → "Microsoft (AS8075)" in the entity classifier. Update geo fallback to use ASN data when geolocation returns "??".

### 2. Entity Identification: 194.26.192.x = 1337 Services GmbH

**Finding:** The parasite (18,663 requests) is a German VPS provider.
- ASN: AS210558
- Organization: 1337 Services GmbH
- Location: Hamburg, Germany (registered NL)
- Domain: rdp.sh (VPS/dedicated server provider)
- Hostname pattern: `*.powered.by.rdp.sh`

**Implication:** Someone rented a VPS to scrape. Not the org itself — a customer. The membrane correctly classified it as parasite before identification.

**Action taken:** Updated `the-fleet-is-live.md` with attribution.

**Action needed (Rust-side):** Add ASN mapping for AS210558 → "1337 Services / rdp.sh (VPS)". Flag as known-hosting-provider for parasite likelihood boost.

### 3. SCIENCE Braid Pathways Created

**Finding:** SCIENCE domain had 0 active humans. No braid routes into SCIENCE existed.

**Action taken:** Added `science` tag to:
- `touch-radiates-in.md`
- `pi-body-in-life.md`  
- `three-tools.md`

Added cross-article connections to create braid entry points between SCIENCE articles and other domains.

---

## NEEDS RUST-SIDE CHANGES (when intra-membrane goes live)

### 4. Epitope Independence Is Broken — Factor Analysis Required

**Finding:** Falsification experiment 1 (coprimality) FAILED. `claim_survives: false.`

The 6 epitopes are correlated, not independent:
- Mean shared epitopes across entity pairs: 3.58/6
- Zero pairs share 0 epitopes
- If `burst_ratio` triggers, `reading_deficit` and `session_absent` almost always also trigger

**Current epitopes (correlated clusters):**
```
Cluster A (speed signals):  burst_ratio + reading_deficit
Cluster B (identity signals): session_absent + referer_self_loop + referer_absence
Cluster C (structure signal): ua_pool_poverty + sec_fetch_monotone
```

**Required action:**
1. Run PCA or factor analysis on the epitope matrix across all 15 entities
2. Reduce to 3 independent factors (one per cluster)
3. OR weight correlated epitopes to sum to 1 bit instead of counting separately
4. This should push confidence from 83.3% past the 85% target

### 5. Fleet/Human Separator Too Weak for Edge Cases

**Finding:** Falsification experiment 2 (sensitivity) FAILED. `claim_survives: false.`

KS statistic (fleet vs human separation): 0.636-0.727 (needs >0.8)

Entities in the ambiguity zone:
| Entity | Fleet Confidence | Problem |
|--------|-----------------|---------|
| Stealth Scraper | 41-51% | Coin flip |
| Apple (Applebot) | 35-45% | Worse than coin flip |
| SEO Tooling | 44-54% | Coin flip |
| Meta (Facebook Bot) | 47-58% | Coin flip |

**Required action:**
1. Add new epitopes for the middle zone:
   - `timing_regularity`: CV of request intervals (humans >2.0, machines <1.0)
   - `content_depth`: ratio of article reads to index hits
   - `session_arc`: does the session show exploration (human) or enumeration (fleet)?
2. These signals are independent of the existing cluster and should separate the ambiguous entities
3. Priority: Stealth Scraper (49.5% = literally a coin flip)

### 6. Microsoft Entity Profile

**Required action:** Create a new entity node:
```
entity: microsoft_fleet
label: "Microsoft (AS8075)"
is_fleet: true
is_honest: false  (no user-agent identification)
total_requests: 1,378,000+
unique_ips: 19+ (across 4 subnets)
subnets: [74.7.241.x, 74.7.227.x, 74.7.242.x, 74.7.243.x]
asn: AS8075
location: Atlanta, GA
timing: similar to OpenAI fleet
```

Consider: is this the SAME entity as `open_ai_gpt_bot` using Microsoft IP space? If so, merge. If not, keep separate. Test by comparing timing profiles (mean_interval_ms, CV, burst patterns).

### 7. HPE Entity Profile

**Required action:** Create entity:
```
entity: hpe_crawler
label: "HPE (Hewlett Packard Enterprise)"
is_fleet: false  (single subnet, moderate volume)
total_requests: 9,611
unique_ips: 48
subnet: 16.216.88.x
asn: (needs lookup)
location: Spring, TX
```

Need path analysis: what are they reading? If commit diffs = fleet. If articles = reader. If both = investigate.

### 8. Alibaba Cloud Entity Profile

**Required action:** Create entity:
```
entity: alibaba_cloud
label: "Alibaba Cloud"
is_fleet: true
subnets: [47.79.10.x, 47.79.11.x, 47.82.48.x, 47.82.50.x, 47.82.53.x, 47.82.55.x]
total_requests: ~32,000+
location: California (US presence)
```

### 9. Meta Platforms (Fleet) — Populate or Merge

**Finding:** Entity exists but has 0 evaluated, 0 triggered, 0 trigger_bits in falsification.

**Required action:** Either:
- Populate with the 3 Meta IPs already tagged (from Dublin + Menlo Park)
- Or merge with `meta_facebook_bot` entity if behavior is identical

### 10. Partial Entity Decision Protocol

**Finding:** 114 Detroit entities stuck at `partial` classification. Avg confidence 88.1%.

**Required action:** Implement a decision rule:
```
if entity.sort_class == "partial" && entity.confidence > 0.85 && entity.age_weeks > 4:
    promote to nearest confident class (self or null based on edge signature)
if entity.sort_class == "partial" && entity.confidence < 0.7:
    flag for manual review
```

### 11. Braid Topology — Break the Star

**Finding:** All 4 braid routes go through OTHER as a hub. No direct cross-domain links.

**Required action:**
- Create INVESTIGATION → SCIENCE pathway (Detroit case → convergent evolution thesis)
- Create TOPOLOGY → MEMBRANE pathway (architecture → membrane science)
- Create IMMUNE → INVESTIGATION pathway (immune system → legal evidence)
- These should emerge naturally as humans explore the new cross-tagged articles, but can be seeded by adding explicit connections in the page metadata

---

## MONITORING

Track after rewire:
- [ ] Confidence target: 83.3% → 85%+
- [ ] KS statistic: 0.636 → 0.8+
- [ ] Braid routes: 4 → 7+
- [ ] SCIENCE domain active humans: 0 → 1+
- [ ] Microsoft entity classified: Unknown → Microsoft (AS8075)
- [ ] Partial entities resolved: 114 → <50
