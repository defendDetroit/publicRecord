# Evidence Provenance Specification

**Status**: Operational | **Date**: Sep 25, 2026

---

## Overview

The detroit evidence depot stores documentary evidence (PDFs, FOIA responses, screenshots) alongside the Zola content. Evidence files are BLAKE3-hashed, SCP-pushed to golgiBody, and optionally braided into the provenance trio for cryptographic verification.

## Evidence Depot Pattern

```
sporeGate (local authority)          golgiBody (public serving)
─────────────────────────           ──────────────────────────
detroit/evidence/                   /opt/ecoPrimals/detroit/evidence/
  ├── filings/                       (mirror via SCP push)
  ├── foia/
  ├── financial/
  └── braids.json                   Served at /evidence/*
```

### Local Authority
Evidence files live on sporeGate under the developer's control. The local machine is the authority — golgiBody is a serving mirror.

### Push Protocol
`membrane evidence.push detroit` → SCP rsync from local `evidence_dir` to golgiBody `{parent_of_public}/evidence/`. Uses the same SSH config as `caddy_exec()`.

### Serving
Caddy serves evidence files at `/evidence/*` via `file_server browse`. The bare `/evidence/` path serves a Zola-generated HTML landing page (not the file browser).

## Provenance Trio Integration

If the provenance trio sockets are available on sporeGate, evidence collections are braided:

1. **rhizoCrypt** (`/run/rhizocrypt/rpc.sock`): DAG session → event append per file → dehydrate
2. **loamSpine** (`/run/loamspine/rpc.sock`): Spine creation → session commit
3. **sweetGrass** (`/run/sweetgrass/rpc.sock`): Braid creation → braid commit

### Wire Protocol

All three sockets use the riboCipher prefix (`[0xEC, 0x01]`) followed by JSON-RPC 2.0.

```
[0xEC][0x01]{"jsonrpc":"2.0","method":"dag.session.create","params":{"name":"evidence-filings"},"id":1}
```

### Braid Pipeline

For each evidence collection (subdirectory):
1. Build BLAKE3 manifest of all files in the collection
2. Create DAG session on rhizoCrypt
3. Append DataCreate events for each file (blake3, path, mime, bytes, dataset)
4. Dehydrate the DAG session → get Merkle root
5. Create spine on loamSpine, commit session
6. Create braid on sweetGrass, commit with composite hash

### Convergence Depth

| Level | Service | What It Provides |
|-------|---------|-----------------|
| 1 | CAS (BLAKE3) | Content-addressable storage — file identity |
| 2 | DAG (rhizoCrypt) | Merkle DAG — session grouping, dehydration |
| 3 | Spine (loamSpine) | Append-only spine — commit history |
| 4 | Braid (sweetGrass) | PROV-O braid — cross-reference verification |
| 5 | Signed (bearDog) | Cryptographic signature — identity binding |

detroit currently operates at depth 4 (braid). Depth 5 requires bearDog crypto.sign.

## Files

| File | Purpose |
|------|---------|
| `cellMembrane/crates/membrane-shadow/src/evidence/provenance.rs` | Braid pipeline implementation |
| `cellMembrane/crates/membrane-shadow/src/evidence/mod.rs` | Evidence push + braid dispatch |
| `detroit/evidence/` | Local evidence depot |
| `detroit/site/static/braids.json` | PROV-O braids for graph edges |
| `detroit/site/static/cas-manifest.json` | CAS entries for content pages |
