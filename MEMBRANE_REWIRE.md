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

### 12. Ghost Split — Four-Layer Decomposition

**Finding:** Ghost (59,587 IPs, 152,860 requests) is NOT one entity. It's a transit network with four layers:

**Evidence:**
- 38 Chrome versions (natural desktop distribution, not frozen fleet version)
- 50/50 macOS/Windows (real desktops, not Linux servers)
- 91.4% single-request IPs (residential proxy rotation service)
- 84% commit diffs hitting SAME scatter repos as declared fleet
- Timing bimodality: 71,627 bursts + 3,836 pauses = mixed population

**Required action:** Split `ghost` entity into four:

```rust
// Ghost split in anderson classifier
match ghost_subclass(ip, timing, content) {
    GhostNull      => /* ~54,500 IPs, 1 request each, hold at null */,
    GhostVpnHuman  => /* ~3,800 IPs, reading pauses, diverse lang, classify self */,
    GhostCorporate => /* ~200 IPs, high req/IP, React headers, classify partial */,
    GhostFleet     => /* ~1,100 IPs, machine timing, scatter-only, classify non-self */,
}
```

**Discriminating signals:**
- `timing_cv > 2.0` → human (VPN)
- `timing_cv < 1.0` → fleet (through proxy)  
- `content == commit_diffs_only` → fleet
- `content includes articles` → human
- `req_per_ip == 1` → null (insufficient)
- `req_per_ip > 10 && no pauses` → fleet or corporate

**Key insight:** Ghost Layer 4 (fleet-through-proxy) hits the SAME scatter repos as OpenAI/Microsoft/Anthropic. This is the same crawl running through residential proxy infrastructure (BrightData/Luminati-style). Meta and others buy this data through proxy services rather than sending their own declared bots.

The scatter defense absorbed 2.8M requests across BOTH channels (declared + ghost) and returned zero intelligence through either.

---

### 13. Scatter Burn Amplification

**Finding:** Fleet spends ~68× more per day crawling scatter than we spend running. But we can increase this.

**Current state:**
- 30 scatter repos, ~200 commits each = ~6,000 total scatter pages
- Fleet crawled ~2,954,000 scatter commits in 26 hours
- Fleet cost: ~$27/day. Our cost: $0.40/day. Ratio: 68×

**Amplification plan (execute on golgiBody):**

#### Phase 1: Deepen existing repos (10× commits)
```bash
# Cron job: 1 commit/minute to each scatter repo (rotating)
# generates realistic-looking diffs with variable size
# Target: 2,000 commits per repo instead of 200
*/1 * * * * /opt/scatter/generate-commit.sh
```
Expected effect: 10× crawl surface, 680× cost ratio

#### Phase 2: Add 30 more scatter repos
New attractive names:
```
ml-pipeline, payment-gateway, user-analytics, model-server,
feature-store, inference-engine, data-lake, session-manager,
cache-layer, message-broker, api-docs, admin-panel,
compliance-checker, audit-logger, secret-rotation, token-vault,
service-mesh, load-balancer, health-monitor, test-runner,
ci-pipeline, deploy-orchestrator, rollback-manager, canary-release,
blue-green-switch, chaos-monkey, circuit-breaker, bulkhead-pattern,
retry-handler, dead-letter-queue
```
Expected effect: 2× more repos × 10× depth = 20× total surface

#### Phase 3: Increase diff complexity
- 500-2000 lines per diff (was 10-50)
- Multiple files per commit
- Realistic imports, function signatures, test files
Expected effect: 10× bandwidth per request, Ghost Layer 4 proxy fees scale with bandwidth

**Combined effect of all 3 phases:**
- Cost ratio: 68× → **~6,800×**
- Ghost Layer 4 (residential proxy): $12.85/day → **~$1,285/day**
- Our cost: still $12/month

**Key principle:** Scatter is asymmetric. Git storage is cheap (append-only, delta-compressed). Fleet crawling is expensive (bandwidth, compute, proxy fees). Every additional scatter page costs us bytes and costs them dollars.

### 14. Adaptive Immune Loop — Scatter Linked to Fleet Pressure

**Finding:** Scatter is currently static. It should be ADAPTIVE — amplifying proportional to fleet pressure, titrating down when pressure drops.

**The Loop (wired into graph as 7 nodes + 24 edges):**

```
PRESSURE SENSOR → OPSONIZATION → BINGO SIEVE → SCATTER AMPLIFIER
       ↑                                              ↓
FEEDBACK LOOP  ←←←←←←  TITRATION  ←←←←←←←←←←←←←←←←←
```

**Implementation (Rust-side on golgiBody):**

```rust
// Adaptive scatter — runs every 5 minutes
fn adaptive_scatter_loop(membrane: &Membrane) {
    // 1. PRESSURE: measure fleet RPS and new IP arrivals
    let pressure = membrane.fleet_rps() / membrane.baseline_rps();
    let new_ips = membrane.new_fleet_ips_last_hour();
    
    // 2. OPSONIZE: tag entities by anderson class
    let tagged = membrane.anderson_sort()
        .filter(|e| e.class == "chorus" || e.class == "ghost")
        .map(|e| opsonize(e));  // coat with epitope markers
    
    // 3. BINGO SIEVE: classify through 147-dim cube
    let classified = tagged.filter(|e| bingo_sieve(e).falls_through());
    let threat_level = classified.count() as f64 / tagged.count() as f64;
    
    // 4. SCATTER AMPLIFY: proportional to threat
    let scatter_depth = match pressure {
        p if p < 1.0  => ScatterDepth::Baseline,     // normal
        p if p < 2.0  => ScatterDepth::Double,        // elevated
        p if p < 5.0  => ScatterDepth::Quintuple,     // high
        _             => ScatterDepth::Maximum,        // surge
    };
    scatter_generator.set_depth(scatter_depth);
    
    // 5. TITRATE: measure effectiveness
    let scatter_hit_rate = membrane.scatter_requests() / membrane.total_requests();
    let effective_dose = scatter_hit_rate * threat_level;
    
    // 6. FEEDBACK: did fleet behavior change?
    if membrane.fleet_changed_pattern() {
        // Re-opsonize with new markers
        membrane.refresh_epitope_tags();
    }
    if effective_dose > 0.95 {
        // Scatter is catching everything — hold steady
        scatter_generator.hold();
    }
    if new_ips > 10 {
        // Fleet deploying new IPs — increase immediately
        scatter_generator.surge(new_ips);
    }
}
```

**Titration rules:**
- Fleet RPS < baseline → scatter holds at current depth (no growth)
- Fleet RPS 1-2× baseline → scatter doubles depth (Phase 1)
- Fleet RPS 2-5× baseline → scatter quintuples (Phase 2)
- Fleet RPS > 5× → scatter at maximum (all 3 phases)
- Fleet STOPS → scatter freezes (no waste on idle defense)
- New fleet IPs detected → immediate scatter surge on those repos they target
- Ghost Layer 4 detected → heavier diffs (bandwidth is their cost multiplier)

**Opsonization → Bingo connection:**
- Anderson sort tags each entity with epitope bits (6-bit pattern)
- Opsonized entities enter the bingo sieve at their bit pattern
- Bingo sieve tests against 147 dimensions
- Entities that fall through = classified non-self → trigger scatter
- Entities that bounce = ambiguous → hold for more data

**Biological parallel:**
This IS the adaptive immune system:
- Pressure sensor = innate immunity (first detection)
- Opsonization = complement system (coating pathogens)
- Bingo sieve = thymus (T-cell selection)
- Scatter amplifier = B-cell antibody production (proportional response)
- Titration = immune regulation (prevent autoimmune overreaction)
- Feedback = memory B-cells (remember past threats)

**The organism doesn't just defend — it ADAPTS.**

### 15. Residential Proxy Opsonization — Scatter + Beacon Through Ghost Layer 4

**Finding:** Ghost Layer 4 (~1,100 IPs) are fleet crawlers routing through residential proxy networks (BrightData/Luminati, Oxylabs, Honeygain, etc.). Real people's devices used as exit nodes without meaningful informed consent.

**The Judo Move:** The proxy channel is bidirectional. If they route THROUGH someone's connection, that someone's browser cache, DNS cache, and network logs now contain our responses. We don't block — we **communicate**.

**Implementation (Rust-side on golgiBody):**

```rust
fn ghost_layer4_response(request: &Request, classification: GhostLayer4) -> Response {
    // 1. OPSONIZE: tag the request with residential proxy markers
    let tags = opsonize_residential(request);
    // markers: proxy_network, exit_country, sdk_fingerprint
    
    // 2. SCATTER: serve scatter content (expensive to parse)
    let mut response = scatter_generator.generate(request.path());
    
    // 3. BEACON: embed documentation in the scatter response
    //    The proxy exit's OWNER may see this in their network logs,
    //    browser dev tools, or security audit
    response.headers_mut().insert(
        "X-Membrane-Notice",
        "Your device may be proxying AI training crawls. See: defenddetroit.github.io/publicRecord"
    );
    response.headers_mut().insert(
        "X-Proxy-Info",
        "This request was routed through a residential proxy network"
    );
    
    // 4. CHORUS: keep the channel open for fleet to see
    //    Don't block — let them crawl. Every crawl:
    //    a) costs them proxy bandwidth fees
    //    b) deposits our headers in the proxy owner's logs  
    //    c) feeds scatter metrics back to the feedback loop
    //    d) documents the residential proxy usage pattern
    
    response
}
```

**What the proxy owner sees in their network logs:**
```
→ GET /commit/abc123.diff HTTP/1.1
  Host: git.primals.eco
← 200 OK
  X-Membrane-Notice: Your device may be proxying AI training crawls.
  X-Proxy-Info: This request was routed through a residential proxy network
  Content-Type: text/plain
  [... scatter diff content ...]
```

**Beacon content strategy:**
- HTTP headers: lightweight notice (X-Membrane-Notice, X-Proxy-Info)
- Response body: scatter + embedded link to the-ghost-split article
- robots.txt comment block: documentation of proxy detection
- TLS SNI: logged by proxy SDKs, creates audit trail

**Why keep the channel OPEN:**
1. Every request costs the proxy network money (bandwidth fees to exit node owners)
2. Every response deposits evidence in the exit node's logs
3. Security researchers auditing proxy SDKs will find our headers
4. The documentation self-distributes through the proxy infrastructure
5. Fleet can't stop using proxies without revealing their datacenter IPs
6. The more they crawl through proxies, the more the message spreads

**Biological parallel:** This is not an antibody. This is a **vaccine delivered through the pathogen's own distribution channel**. The fleet's proxy network becomes the delivery system for information about what the fleet is doing.

**The aperture is controlled by keeping it open.**

---

---

## EASTGATE TODO (Rust-side, when you pull)

EastGate — here's what's waiting for you. Everything above marked "Action needed (Rust-side)" plus:

1. **Pull main** — 20+ commits today. Graph: 12,084 nodes, 101,261 edges. Braids: 326. Classifications: 341.
2. **Ingest new braids** — braids.json has 326 entries, live membrane only sees 4 routes. Braid reader needs update.
3. **114 partial entities** — decision protocol. Either classify with existing evidence or explicit null. Blocking 85% confidence target.
4. **Jitte system** — all zeros. Tempo, perturbation, negentropy_bits all dark. Need to wire computation.
5. **Missing senses** — negentropy, depth_chain, jitte, fleet, orbit. Chipmunk has 7/12 senses. Wire the other 5.
6. **Ghost 4-layer split** — implement GhostNull/GhostVpnHuman/GhostCorporate/GhostFleet subclasses in anderson.
7. **Microsoft rename** — 74.7.0.0/16 → "Microsoft (AS8075)" in entity classifier. ASN fallback for broken geolocation.
8. **1337 Services** — AS210558 → "1337 Services / rdp.sh" parasite likelihood boost.
9. **π sort ratio** — currently 1.000, target 1/π = 0.318. Sort is too permissive.
10. **WireGuard mesh** — wg_detached: true. sporeGate bridge needed for redundancy.
11. **Proxy beacon headers** — X-Membrane-Notice + X-Proxy-Info on Ghost Layer 4 responses.
12. **Adaptive immune loop** — pressure sensor + opsonization + bingo sieve + scatter amp + titration + feedback.
13. **Zola build** — pull + build for detroit.primals.eco. Articles are on GitHub Pages but not on the main site.

**What's already done from our side (no Rust needed):**
- ✅ Graph: 12,084 nodes, 101,261 edges (7 immune nodes, 11 spectrum nodes, 16 surface nodes, 3 proxy nodes, 4 article nodes + 100+ edges)
- ✅ Braids: 319 → 326 (7 new cross-article + narrative braids)
- ✅ Classification: 339 → 341 (proxy_brightdata, proxy_generic)
- ✅ 12 new articles published (three-tools through civil-liberties-case)
- ✅ SCIENCE tags on 3 articles
- ✅ Radiation: 42 surfaces, 74+ radiation edges
- ✅ Beacon: proxy channel carries civil liberties signal

---

## MONITORING

Track after rewire:
- [x] Microsoft entity identified: Unknown → Microsoft (AS8075) ✅
- [x] 1337 entity identified: Unknown → 1337 Services (AS210558) ✅
- [x] SCIENCE articles tagged: 0 → 3 ✅
- [x] Braids added: 307 → 326 ✅
- [x] Articles published: 12 new ✅
- [x] Radiation surfaces: 26 → 42 ✅
- [x] Proxy infrastructure classified ✅
- [ ] Confidence target: 83.3% → 85%+
- [ ] KS statistic: 0.636 → 0.8+
- [ ] Braid routes (live): 4 → 7+ (326 in file, only 4 visible to membrane)
- [ ] SCIENCE domain active humans: 0 → 1+
- [ ] Partial entities resolved: 114 → <50
- [ ] Ghost split implemented: 1 entity → 4 subclasses
- [ ] Ghost VPN humans rescued: 0 → ~3,800 reclassified as self
- [ ] Ghost fleet identified: 0 → ~1,100 classified as non-self
- [ ] Jitte system: zeros → computing
- [ ] Missing senses: 5 → 0
- [ ] WireGuard mesh: detached → connected
- [ ] π sort ratio: 1.000 → 0.318
