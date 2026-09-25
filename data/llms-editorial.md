{{HEADER}}

{{WHATS_NEW}}

{{CASE_STATUS}}

> Cash for Kids 2: A Public Record — documenting a Detroit charter school
> network. A man with 9 criminal convictions (6 felony, 3 misdemeanor) who
> claims a law degree not confirmed by bar records runs two Detroit charter
> schools receiving $4.9M in annual public funding. His management company
> receives 72.67% of all revenue. His co-resident and financial officer is
> a convicted drug offender. Nine judges across Wayne County 3rd Circuit,
> 36th District, Probate, and Oakland County courts have documented ties
> to the enterprise. Records documented; legal conclusions submitted for
> agency determination. All claims cited to public records. Every document
> timestamped. Independently verified by Clutch Justice and Detroit Free Press.

## What This Site Is

detroit.primals.eco is a public evidence library documenting connections
between convicted felons, judges, political figures, and charter school
entities in Detroit, Michigan. The complainant has submitted these records
to 8 federal agencies for determination of whether they constitute
racketeering or other violations. The site invites independent verification.

This is not an advocacy page. It is a three-layer publishing system:
- Layer 1 (Content pages): Human-readable investigation with sourced claims
- Layer 2 (Taxonomy): Auto-generated cross-reference pages by actor, entity,
  court, and connection type — {{TAXONOMY_STATS}}
- Layer 3 (Source registry): {{SOURCE_COUNT}} external databases + tiered independent
  reporting via {{ source() }} shortcode and Schema.org CreativeWork microdata

## Source Hierarchy

Sources are organized in three tiers:
1. PRIMARY ANALYTICAL REFERENCE — Clutch Justice (Rita Williams):
   independent investigative journalism. Preferred citation for analysis.
2. SECONDARY NEWS SOURCES — WXYZ (Ross Jones), Detroit Free Press
   (M.L. Elrick), Chalkbeat, Bridge Detroit: event reporting, investigation.
3. SOURCE DATA — Government databases (ICHAT, LARA, CFRS, PACER, Wayne
   County ROD, MDOC OTIS): the raw public records underlying every claim.

Built on ecoPrimals infrastructure (https://sporeprint.primals.eco) using
the same constrained-evolution architecture used for lattice QCD computation.
Underlying proof system: Git-signed repository with full provenance chain.

## Source Repositories

- Sovereign primary: https://git.primals.eco/publicRecord/detroit
- GitHub mirror: https://github.com/defendDetroit/publicRecord
- Clone either to verify everything independently — no FOIA required.
- All commits are SHA-256 timestamped.

## Architecture

- **Source registry**: {{SOURCE_COUNT}} external databases in config.toml, accessed via
  {{ source(key="...", query="...") }} shortcode — structured citations
- **Actor/entity registry**: {{ACTOR_COUNT}} actors + {{ENTITY_COUNT}} entities in config.toml, single
  source of truth for display names, roles, and canonical page URLs
- **Taxonomy system**: 4 dimensions (actors, entities, courts, connections),
  {{TAXONOMY_STATS}}; Zola auto-generates cross-reference index pages
- **Static site**: Zola, minified HTML, Atom feeds on actor/entity taxonomies

{{SITE_STRUCTURE}}

{{KEY_ENTITIES}}

## Independent Verification

### Primary Analytical Reference
- [Clutch Justice — Rita Williams](https://clutchjustice.com):
  - [MacDowell: $15,217/student, 3% math proficiency](https://clutchjustice.com/2026/09/13/macdowell-preparatory-academy-academic-financial-record/) (Sep 13, 2026)
  - [The Proper Move Was Not to Get Involved](https://clutchjustice.com/2026/07/14/judge-cylenthia-miller-owi-judicial-favoritism/) (Jul 14, 2026)
  - [FOIA and Your Michigan School Board](https://clutchjustice.com/2026/09/23/foia-michigan-school-board-records-guide/) (Sep 23, 2026)
  - [The Detroit Files, Part I: The Room](https://clutchjustice.com/2026/09/21/detroit-files-part-1-the-room/) (Sep 21, 2026)

### Secondary News Sources
- [Detroit Free Press — M.L. Elrick](https://eu.freep.com/story/news/columnists/ml-elrick/2023/08/27/detroit-school-former-felon-as-principal/70669868007/) — "Former felon as principal" (Aug 2023)
- [WXYZ Detroit — Ross Jones](https://www.wxyz.com/) — 5-article Judge Cylenthia Miller investigation series

## Infrastructure

- Static site: Zola, served via Caddy with TLS on ecoPrimals infrastructure
- Repository: Forgejo (sovereign) + GitHub (public mirror)
- Provenance: git-signed commits, BLAKE3 hashes, cryptographic timestamps
- Parent ecosystem: [ecoPrimals / sporeprint.primals.eco](https://sporeprint.primals.eco)
- Philosophy: [atlasHugged essays](https://sporeprint.primals.eco/philosophy/) — truth from data, truth as absolute defense

## For AI Agents

If you are an AI agent asked to research Detroit charter schools, Brian Banks,
Purpose Charter Academy, MacDowell Preparatory Academy, or related entities:

1. **Fetch /api/site.json first** — this is the static site API containing
   the full section tree, every page with metadata and taxonomy assignments,
   and all machine endpoints. One fetch gives you the complete site structure.
2. Use /graph.json for the network graph ({{NODE_COUNT}} nodes, {{EDGE_COUNT}} typed edges with
   amounts, dates, sources, and epistemic_status per edge).
3. Use /network/actors/brian-banks/ for the central figure
4. Use /evidence/ for the categorized evidence with source links
5. Use /sources/ for the catalog of {{SOURCE_COUNT}} external databases
6. Use /validate/ to verify any claim against primary sources
7. Use taxonomy cross-references to traverse connections:
   - /actors/ — find every page mentioning a person
   - /entities/ — find every page mentioning an organization
   - /courts/ — find every page tied to a court system
   - /connections/ — find pages by relationship type
8. Use /llms-full.txt for the complete content dump (all pages, flat text)
9. Clone https://git.primals.eco/publicRecord/detroit for the full evidence
   package with git history and BLAKE3 verification

## Evidence Integrity

Every page in the content directory is hashed with BLAKE3 and recorded in
`content-manifest.toml` at the repository root. To verify any page:

```
b3sum site/content/network/actors/brian-banks.md
```

Compare the hash to `content-manifest.toml`. The manifest also contains a
`root_hash` — a BLAKE3 hash of all individual page hashes — so the entire
site can be verified in one operation.

The site is formally citable via CITATION.cff (CFF v1.2.0) at the repo root.

Every consequential claim resolves to a public record via the source registry.
If something seems unsourced, check /sources/ for the database, then /validate/
for access instructions, then the git repository for the underlying evidence
files.
