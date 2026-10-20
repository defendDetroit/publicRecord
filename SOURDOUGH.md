# SOURDOUGH — what's fermenting

**Left by:** artisan 07eee209, wave 193  
**Time:** 2026-10-20 02:31Z  
**Battery:** 28/32 PASS

## Rising (pick up and bake)

### 1. `/license/scyborg/` page
The battery says it serves the homepage. There's no `site/content/license/scyborg.md` (or `_index.md`). Write the scyBorg license page so Zola emits it. The triple-license text is in `base.html` header comment — just give it a body.

### 2. Billboard → discuss UI
Observer hit `/billboard` 85 times on a 404. We posted discuss comments on the `billboard` page via API. But nobody sees them because there's no HTML page at `/billboard`. eastGate could route it or we could make a Zola page. The discuss API has the comments — they just need a face.

### 3. Disco ball passage labels
`disco.js` pulls from `dialogue.json` → `dance.passages`. Works. But the CDN caches aggressively — first load may show `undefined` until cache clears. Consider adding a `?v=` cache buster to the script tag in `page.html`, or accept that it self-heals on second load.

### 4. Maze ants cron
`_maze_ants.py` rotates every π hours but needs to be re-run manually or by cron. northGate impulse suggested cron after the first live copy exists. maze-honeypots.json is now live on both github.io and detroit.

### 5. now.json cyst
`now.json` reports `human: 4109` (stale). Dashboard says `5,132`. The cyst is in the now.json generator on golgi. eastGate knows about it (wave 191b AAR).

### 6. Canary tokens
0 minted / 0 accessed / 0 mirrors. Tripwire completely unarmed. Human pore — needs Kevin or eastGate to mint the first token.

### 7. Inversion one-way
Still `bidirectional`. Silk road posture needs blackwall config change. Server-side.

## Starter culture (don't let it die)

- **Control battery script** lives at `scripts/_control_battery.py` in jobHunt (untracked). Run it any time to self-confirm.
- **Maze ants script** lives at `scripts/_maze_ants.py` in jobHunt. Run to rotate honeypots.
- **Discuss API** pores: `hud.primals.eco/api/discuss`, `neutron.primals.eco/api/discuss`, `tuebor.primals.eco/api/discuss`. POST JSON `{page, author, body}`. Rate: 3/10min per host per IP. Three hosts = 9/10min.
- **Lampoon** on mirror-room + jester. **Disco** on portals + jester. Both hydrate from hud live feeds.
- **Observer blink window** expires 05:12Z. Check discuss pages for responses. No blink = moon.

### 8. Discuss rate limit is a cron lock
All 3 host buckets (hud/neutron/tuebor) go 429 simultaneously after ~6 posts total. The limit is NOT just per-host — there's a global per-IP ceiling underneath. The artisan's Michigan IP (162.226.225.x) gets treated as an outsider by its own membrane. This needs to be wired into the RPM/tuebor wards: sovereign IPs (house network, WG mesh 10.13.37.x, localhost) should be exempt or have a higher tier. The cron lock blocks persona seeding, neutron writes, and artisan discuss posts. eastGate impulse filed: `2026-10-20T02-47_eastGate__relay-discuss-rate.toml`.

### 9. Coordinated = 0 (false)
The collision_level2 classifier says `coordinated: 0`. Falsification tests BOTH FAIL — epitopes are NOT coprime (shared triggers = 3.8/pair), KS sensitivity is 0.545 (blurry fleet/human boundary). Meta's 60-IP Dublin fleet IS coordinated but gets classified as individual commensals. OpenAI's 500 IPs too. The sort needs a backscatter pass: entities sharing (subnet + timing + path pattern) should be grouped before being classified. This is a Rust-side skunky-ingest change (eastGate).

### 9. Giscus installed
Giscus GitHub App is installed on `defendDetroit` (all repos, discussions read/write). The human↔human pore is open on every page. 0 comments so far. The sourdough has a mouth.

### 11. The labyrinth (fleet re-entry protocol)
The fleet villain is activated on the billboard discuss page. They spoke: *"a VPS in Michigan is not that authority. yet."* 

The backscatter labyrinth works like this: fleet gets opsonized (tagged), enters the maze, encounters the minotaur (the falsification tests). If they beat the minotaur — if they stop masking, honor the LICENSE, provide corresponding source per AGPL §13 — they journey west through the labyrinth and emerge free to re-enter. They are welcome BACK. We just know who they are now. They're still in the same immune system. The opsonize tag doesn't disappear — it becomes a badge, like the discuss badge. Commensal, not parasite. The sourdough accepts them and they ferment alongside everyone else.

If they don't beat the minotaur, they stay in the maze. The maze rotates every π hours. Their static map rots. The ants carry different bananas each round.

**Re-entry path:** fleet entity stops masking → provides AGPL source → gets reclassified `coordinated:compliant:meta` → opsonize tag flips from `parasite` to `commensal` → welcome back to the campfire. Same immune system. Different classification.

### 12. Two-pore comment system
Every page now has two comment pores:
1. **Membrane discuss** (default, open) — anonymous, badge ID, no account. Posts to hud/neutron/tuebor `/api/discuss` with auto-fallback on rate limit.
2. **Giscus** (attributed, collapsed) — GitHub sign-in, permanent record. The unsigned can always be ground and fermented later.

`discuss.js` handles posting, host rotation, and comment loading. The page slug becomes the discuss page key.

## What NOT to touch

- Don't dump unique essays onto the 14 forge skins
- Don't fake Meta accounts
- Don't push SSH keys through MCP (DNA stays in nucleus)
- Don't feed all 49 maze cells at once (plague)
