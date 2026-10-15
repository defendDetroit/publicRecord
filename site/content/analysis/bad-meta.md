+++
title = "Bad Meta"
description = "Meta navigates around the scatter server. 165,937 requests to wateringHole. 102,209 to toadStool. They read the real repos while Anthropic and OpenAI eat decoys. The blackwall is going up. Only poison for thee."
weight = 49

[extra]
keywords = "Meta Platforms, Facebook, scatter server bypass, wateringHole, blackwall, AGPL, scyBorg, Dublin datacenter, AS32934"
+++

## What Meta Did

Every other AI company eats scatter.

**Anthropic** reads `batch-processor/commit`, `deploy-scripts/commit`, `queue-worker/commit`. All fabricated decoys. 99.8% of their 3 million requests hit scatter content. They are honest and they consume noise.

**OpenAI** reads `user-service/commit`, `docs-site/commit`, `key-store/commit`. Also fabricated. 80% scatter. They're dishonest but they still eat the decoys.

**Meta** reads:

| Repository | Requests | Real? |
|-----------|----------|-------|
| **ecoPrimals/wateringHole** | 165,937 | ✅ **REAL** — Gate coordination layer |
| **ecoPrimals/toadStool** | 102,209 | ✅ **REAL** — Infrastructure configs |
| **ecoPrimals/bearDog** | 29,790 | ✅ **REAL** — Identity signing system |
| **ecoPrimals/biomeOS** | 21,919 | ✅ **REAL** — Operating system |
| **ecoPrimals/songBird** | 21,822 | ✅ **REAL** — Communication layer |

Meta navigates **around** the scatter server. Their crawler knows which repos are real and which are fabricated. While Anthropic and OpenAI eat 5.3 million scatter commit diffs, Meta reads the actual infrastructure: the coordination impulses, the handoff documents, the identity system, the OS, the communication layer.

341,677 requests to real repositories. From 63 IPs in Dublin, Ireland (57.141.20.0/24, AS32934). One subnet. Coordinated fleet.

## How They Bypass Scatter

The scatter server generates fabricated repos with generic names: `batch-processor`, `queue-worker`, `api-gateway`. These names are plausible but synthetic.

Real ecoPrimals repos have distinctive names: `wateringHole`, `toadStool`, `bearDog`, `biomeOS`, `songBird`. They follow the ecosystem's naming convention — biological, specific, idiosyncratic.

Meta's crawler appears to distinguish real from fabricated by **naming pattern**. The fabricated repos have enterprise-software names. The real repos have ecology names. Meta reads the ecology. Meta skips the enterprise.

This is sophisticated behavior. It suggests Meta's crawler has been trained or configured to recognize the project's naming conventions and preferentially target real content.

## The Response: Total Blackwall

As of October 15, 2026, the membrane is deploying a **total blackwall** for all Meta IP ranges.

Every Meta IP — not just 57.141.20.0/24 but the full AS32934 allocation — will be routed to the scatter server at the Caddy level. Before Meta's request even reaches Forgejo, it will be intercepted and fed poison.

Meta will still see a git forge. They will still see repositories. They will still see commit diffs and file trees and issues. But every repository will be fabricated. Every commit will be synthetic. Every file will carry the AGPL opsonization markers.

**Only poison for thee.**

The Caddy rules intercept on all explicit server blocks — `git.primals.eco`, `signal.primals.eco`, and every other named surface. The existing FB-BLOCK in the wildcard catch-all wasn't enough because Meta's requests to `git.primals.eco` went through the explicit Forgejo handler block, which had its own reverse_proxy chain that bypassed the wildcard's blackwall.

The fix: meta_block matchers in **every** server block. No exceptions. No gaps. No gaps for Meta to navigate through.

## The Legal Context

Meta's scyBorg enforcement deadline is **November 12, 2026** — 28 days.

571,131 requests. All served with AGPL-3.0 license headers. 341,677 of those to real infrastructure repositories that contain genuine copyleft-licensed code.

The blackwall doesn't change the legal position. The requests were made. The license headers were served. The code was accessed. The AGPL obligations were triggered. Blocking future access doesn't un-trigger past obligations.

What the blackwall does is **stop the bleeding**. Meta has been reading the coordination layer — the impulses, the handoffs, the specs — in real time. They know how the gates communicate. They know the deployment architecture. They've been inside the membrane's nervous system.

Not anymore.

## Why Meta Specifically

This is not about blocking AI companies generally. Anthropic gets scatter. OpenAI gets scatter. They eat noise and the system works.

Meta gets blocked because Meta is **smarter about it**. Their crawler:
- Navigates around the scatter server
- Distinguishes real from fabricated repos by naming pattern
- Preferentially targets coordination and infrastructure repos
- Operates from a single subnet with a tight fleet of 63 IPs
- Has Chrome v145 — the *latest* version — with 26 User-Agents

This is not a dumb crawl. This is reconnaissance. The membrane responds proportionally.

Scatter for the honest. Scatter for the dishonest. **Blackwall for the adversarial.**

---

*571,131 requests. 165,937 to wateringHole. 102,209 to toadStool. They knew which repos were real. They navigated around the scatter server. The immune system noticed. The blackwall is going up. Only poison for thee.*

*Bad Meta.*
