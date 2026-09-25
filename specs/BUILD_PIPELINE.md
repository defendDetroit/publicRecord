# detroit-build Pipeline Specification

**Binary**: `detroit-build` | **Version**: 0.1.0
**Location**: `detroit/crates/detroit-build/`
**Dependencies**: litho-core (BLAKE3 manifests, frontmatter), chrono, csv, serde, toml

---

## Overview

`detroit-build` is a single Rust binary that generates all machine-readable artifacts from three source-of-truth files:
1. `site/config.toml` — actor, entity, and source registries
2. `data/edges.toml` — graph edge definitions
3. `site/content/**/*.md` — content pages with TOML frontmatter

## CLI

```bash
detroit-build [--root <path>] [--check] [subcommand]
```

- `--root`: Path to detroit repo root (default: `.`)
- `--check`: Verify consistency only, don't write files
- No subcommand: run all 7 steps

Subcommands: `graph`, `site-api`, `llms`, `manifest`, `verify`, `braids`, `cas-manifest`

## 7-Step Pipeline (Default)

| Step | Output | Size | Source |
|------|--------|------|--------|
| [0/7] Parse sources of truth | (in-memory) | — | config.toml + edges.toml + content/*.md |
| [1/7] Zola build | `site/public/` | — | `zola build` in site/ |
| [2/7] Graph | `graph.json` + `graph.csv` | ~15KB | registries + edges |
| [3/7] Site API | `api/site.json` | ~40KB | sections + pages + taxonomies |
| [4/7] llms.txt | `llms.txt` | ~20KB | editorial template + auto-generated |
| [5/7] llms-full.txt | `llms-full.txt` | ~100KB | all content pages dumped |
| [6/7] Content manifest | `content-manifest.toml` | ~3KB | BLAKE3 hashes |
| [7/7] Verify | (console) | — | cross-layer consistency check |

## Modules

| Module | File | Function |
|--------|------|----------|
| Registry parser | `registry.rs` | Parse `[extra.actors]`, `[extra.entities]`, `[extra.sources]` from config.toml |
| Content scanner | `content.rs` | Walk `content/**/*.md`, parse frontmatter, extract taxonomies, word counts |
| Graph builder | `graph.rs` | Merge registries + edges → nodes + validated edges. Write JSON + CSV |
| Site API | `site_api.rs` | Build complete site structure API with sections, pages, taxonomies, endpoints |
| LLM generator | `llms.rs` | Template expansion (llms-editorial.md) + full content dump |
| Manifest | `manifest.rs` | Delegates to litho-core for BLAKE3 hashing |
| Verifier | `verify.rs` | Actor page resolution, entity page resolution, graph node validation, edge endpoints |
| Provenance | `provenance.rs` | Edge-to-braid conversion, page-to-CAS conversion |

## Webhook Integration

In the membrane publish pipeline, `detroit-build` is invoked as Step 2.5 via:
```rust
artifact_command: Some(&["detroit-build", "--root", "."]),
```

The membrane `publish_artifacts` module runs it as a subprocess in the worktree directory.

## Verification Output

The `verify` step checks 5 categories:
1. Actor pages: every actor with a `page` field resolves to an existing content page
2. Entity pages: same for entities
3. Graph nodes: every graph node exists in a registry (except `institution` type)
4. Edge endpoints: every edge source and target exists as a graph node
5. Page descriptions: every page has a non-empty description

Example output:
```
[7/7] Consistency verification
  ✅ Actors: 15 registered, 15 with pages
  ✅ Entities: 11 registered, 11 with pages
  ✅ Sources: 21 registered
  ✅ Graph: 43 nodes, 57 edges
  ✅ Content: 19 sections, 39 pages
```
