# detroit.primals.eco — Site Architecture

**Status**: Deployed and automated | **Date**: Sep 25, 2026

---

## Overview

detroit.primals.eco is a public evidence library documenting the Brian Banks Detroit charter school investigation. It runs as a Zola static site served by Caddy on golgiBody (157.230.3.183), with automated publishing from Forgejo via the membrane webhook pipeline.

## Technology Stack

| Layer | Technology | Location |
|-------|-----------|----------|
| Content | Zola 0.19+ (static site generator) | `detroit/site/` |
| Build | `detroit-build` (Rust binary) | `detroit/crates/detroit-build/` |
| Serving | Caddy 2 (HTTPS, file_server) | golgiBody `/etc/membrane/Caddyfile` |
| Publishing | membrane webhook pipeline | sporeGate `cellMembrane/` |
| Evidence | BLAKE3-hashed file depot | sporeGate local → golgiBody remote |
| Provenance | rhizoCrypt + loamSpine + sweetGrass | sporeGate UDS sockets |
| DNS | Cloudflare (CNAME to golgiBody) | `detroit.primals.eco` |

## Directory Structure

```
detroit/
├── site/                    Zola project root
│   ├── config.toml          Registries: actors, entities, sources (SSOT)
│   ├── content/             Markdown pages (39 content + 19 sections)
│   ├── templates/           Tera templates (macros, shortcodes, layouts)
│   ├── static/              Static assets + generated artifacts
│   │   ├── graph.json       Network graph (43 nodes, 57 edges)
│   │   ├── graph.csv        Edge list for Gephi/pandas/R
│   │   ├── api/site.json    Site structure API (pages, sections, taxonomies)
│   │   ├── llms.txt         AI agent context document
│   │   ├── llms-full.txt    Complete content dump
│   │   ├── braids.json      PROV-O braids for graph edges
│   │   ├── cas-manifest.json CAS entries for content pages
│   │   ├── identity.json    Schema.org structured data
│   │   └── content-manifest.toml  BLAKE3 hashes
│   └── public/              Built output (Caddy root)
├── data/
│   ├── edges.toml           Graph edge definitions (SSOT)
│   └── llms-editorial.md    LLM context template with {{PLACEHOLDERS}}
├── evidence/                Evidence depot (local authority)
├── crates/
│   ├── detroit-build/       Rust build tool (7-step pipeline)
│   └── litho-core/          Shared BLAKE3 manifest + frontmatter parsing
├── specs/                   Technical specifications (this directory)
├── actors/                  Actor profiles and research
├── entities/                Entity profiles and LARA data
├── pattern/                 RICO pattern analysis
├── filings/                 Court filings and complaints
└── README.md                Master documentation
```

## URL Structure

| URL Pattern | Source | Handler |
|-------------|--------|---------|
| `/` | `site/content/_index.md` | Zola (try_files) |
| `/network/actors/{slug}/` | `site/content/network/actors/{slug}.md` | Zola |
| `/network/judges/{slug}/` | `site/content/network/judges/{slug}.md` | Zola |
| `/analysis/{slug}/` | `site/content/analysis/{slug}.md` | Zola |
| `/evidence/` | Zola template (evidence library page) | `handle /evidence/` → try_files |
| `/evidence/{file}` | `evidence/` directory (raw files) | `handle /evidence/*` → file_server browse |
| `/sitemap.xml` | Zola auto-generated | `handle /sitemap.xml` |
| `/robots.txt` | `site/static/robots.txt` | `handle /robots.txt` |
| `/api/site.json` | `detroit-build` generated | file_server |
| `/graph.json` | `detroit-build` generated | file_server |
| `/llms.txt` | `detroit-build` generated | file_server |
| `/identity.json` | manually created | file_server |

## Registries (Single Source of Truth)

The `config.toml` `[extra]` section contains three registries:

1. **Actors** (`[extra.actors.*]`): 15 individuals — display name, role, tier, page URL, criminal records, credentials, connections
2. **Entities** (`[extra.entities.*]`): 11 organizations — display name, LARA ID, EIN, type, page URL, financials
3. **Sources** (`[extra.sources.*]`): 21 external databases — display name, URL, type, access method, tier

`data/edges.toml` defines all graph edges between actors and entities.

These three files (config.toml, edges.toml, content/*.md) are the complete source of truth. Everything else is derived.

## Epistemic Grammar

Every graph edge carries an epistemic status:

| Status | Meaning |
|--------|---------|
| `record` | Verifiable public fact from government database or official document |
| `corroborated` | Independently confirmed by 2+ sources |
| `inference` | Analytical conclusion drawn from records, not adjudicated |
| `allegation` | Formally alleged in complaint, awaiting determination |
| `filed` | Submitted to agency or court, pending |
| `adjudicated` | Determined by court or agency |
| `corrected` | Previously published claim corrected |

## Security Headers

All responses include:
- `Strict-Transport-Security: max-age=63072000; includeSubDomains; preload`
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Permissions-Policy: camera=(), microphone=(), geolocation=(), interest-cohort=()`

## Machine-Readable Endpoints

| Endpoint | Format | Generator | Purpose |
|----------|--------|-----------|---------|
| `/api/site.json` | JSON | detroit-build | Complete site structure, pages, taxonomies |
| `/graph.json` | JSON | detroit-build | Network graph (nodes + edges) |
| `/graph.csv` | CSV | detroit-build | Edge list for analysis tools |
| `/llms.txt` | Markdown | detroit-build | AI agent context document |
| `/llms-full.txt` | Markdown | detroit-build | Complete content dump |
| `/content-manifest.toml` | TOML | detroit-build | BLAKE3 hashes of all pages |
| `/braids.json` | JSON | detroit-build | PROV-O braids for graph edges |
| `/cas-manifest.json` | JSON | detroit-build | CAS entries for content pages |
| `/identity.json` | JSON | manual | Schema.org structured data |
| `/sitemap.xml` | XML | Zola | URL list for search engines |
| `/robots.txt` | Text | static | Crawler directives |
| `/atom.xml` | Atom | Zola | Feed |
