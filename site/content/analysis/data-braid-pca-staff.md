+++
title = "Where Did It Come From, Where Did It Go? — The Artisan Experiment"
description = "An augmented reality game built on public records. 129 nodes. 215 edges. 32 epitopes. Who can find the most connections? The graph is the board. The epitopes are the scoring system. Michigan is the map."
date = 2026-10-10
weight = 15

[extra]
author = "Artisan"
keywords = "augmented reality investigation, public record game, Detroit charter school network graph, epitope scoring system, Michigan dark money investigation, citizen investigation OSINT, Artisan hypothesis, formation governance split, structural corruption patterns, graph theory public records, community investigation tool"

[taxonomies]
actors = ["Brian Banks", "W. Alan Wilk", "Renae Moore"]
entities = ["Dykema Gossett", "Save Detroit Jobs", "Purpose Charter Academy", "MacDowell Preparatory Academy"]
connections = ["augmented reality", "investigation", "graph theory", "epitope scoring"]
+++

This is an experiment.

It is also a game. It is also deadly serious.

---

## The Setup

There is a graph. It has **129 nodes** and **215 edges**. Every node is a person, entity, court, or institution documented in Michigan public records. Every edge is a relationship — employment, formation, payment, governance, family, judicial assignment — sourced to a government database.

The graph is at [detroit.primals.eco/graph.json](/graph.json). Download it. Open it. It's JSON. Every edge has a type, every node has a label, every connection has a source.

There is also a structural template — an **inverted graph** — at [/api/invert.json](/api/invert.json). This version has no names. Just shapes. Twelve behavioral archetypes. Nine pathology signatures. The pattern without the people.

The question is simple:

> **Where did it come from? Where did it go? And who can find and connect the most epitopes?**

---

## The Rules

### What is an epitope?

In immunology, an epitope is the part of a foreign molecule that the immune system recognizes. It's the **shape** that triggers the response. Not the whole pathogen — just the shape that doesn't belong.

In this investigation, an epitope is a **structural corruption pattern** — a specific shape in the graph that indicates something the system should reject but doesn't.

There are currently **32 tracked epitopes.** Twenty-four are confirmed. Eight are candidates. Here are some:

| Epitope | What It Means |
|---------|--------------|
| `dual_role_conflicts` | Same person holds judicial role AND governance role at a private entity |
| `vendor_kickback_loop` | Judge pays vendor owned by someone in their jurisdictional sphere |
| `formation_governance_split` | One person forms entities, a different person governs them, same employer |
| `serial_vehicle_formation` | Single actor incorporates 5+ legal entities through state filings |
| `talent_pipeline_extraction` | Multiple public employees migrate to same private entity in a cluster |
| `ghost_officer_concealment` | Entity has known actors but legally required officer seats are unfilled |
| `authorizer_capture` | Board member who authorized an entity also holds dark money connections |
| `zero_partition_membrane` | Person holds roles on both public AND private sides simultaneously |
| `self_funding_formation` | Vehicles formed by the same attorney fund each other |

### How to play

1. **Pick a node.** Any person or entity in the graph.
2. **Search public records.** [LARA](https://cofs.lara.state.mi.us/SearchApi/Search/Search) for entity filings. [CFRS](https://cfrs.michigan.gov/) for campaign finance. [ICHAT](https://apps.michigan.gov/ichat/home.aspx) for criminal history. [PACER](https://pacer.uscourts.gov/) for federal cases. [ProPublica Nonprofit Explorer](https://projects.propublica.org/nonprofits/) for 990s. [FEC](https://www.fec.gov/data/) for federal PACs.
3. **Find a connection** the graph doesn't have yet.
4. **Check if it triggers an epitope.** Does this connection create a dual role? A vendor loop? A formation split?
5. **Document it.** Source, date, database, connection type.

Every connection you find is a new edge. Every edge that triggers an epitope is a score. The graph grows. The pattern sharpens.

---

## The Experiment

### Hypothesis: The Artisan

The structural patterns in this graph are not random. They are **crafted.**

Evidence:
- The formation/governance split (Wilk forms, Moore governs) is consistent across **7 entities.** No natural process produces that division of labor at that scale.
- Both central actors (Banks, Wilk) have clustering coefficients of **0.022** — near zero. Their networks are hub-and-spoke, not organic webs. This indicates deliberate compartmentalization.
- Remove Banks and the graph shatters into **12 pieces** (+10 cut vertex). Remove Wilk and **5 formation vehicles** orphan. No redundancy. Single point of control.

**The Artisan Hypothesis:** If the corruption is crafted rather than organic, then the structural patterns will be consistent, repeatable, and distinguishable from noise. The precision that makes the architecture defensible also makes it **detectable.**

### Test method

Run the same five structural analyses against the graph at different time points:

1. **Clustering coefficient** — Does compartmentalization increase or decrease as new nodes are added?
2. **Betweenness centrality** — Do the same bridges remain critical or do new bridges emerge?
3. **Community detection** — Does the two-community structure (Banks 73%, Dykema 20%) hold or fragment?
4. **Cut vertex analysis** — Does fragility increase or decrease with new connections?
5. **Edge type diversity** — Does the hub accumulate new relationship types or stay constant?

Each time someone finds a new connection and adds it to the graph, these metrics change. The **direction** of change tests the hypothesis. If the artisan is real, the structural signatures stay consistent even as the graph grows. Organic corruption would show increasing randomness with scale. Crafted corruption shows increasing regularity.

---

## The Game Board

### Current structural state:

| Metric | Value |
|--------|-------|
| Nodes | 129 |
| Edges | 215 |
| Communities | 2 major (Banks 73%, Dykema 20%) + 3 fragments |
| Bridge nodes | 3 (Tremblay, SDJ, Dykema) |
| Cut vertices | 21 (Banks = +10, Wilk = +5) |
| Orphans | 2 (Spirit of Detroit Fund, Protect MI Families) |
| Epitopes tracked | 32 (24 confirmed, 8 candidates) |
| Actor archetypes | 12 (4 healthy, 8 pathological) |
| Pathology signatures | 9 |

### The two orphans

**Spirit of Detroit Fund** and **Protect MI Families** have zero connections in the graph. They exist in LARA filings. Someone incorporated them. Someone is their registered agent. Their incorporators are retrievable.

Whoever connects these two orphans to the graph — with sourced public records — adds the first edges. If those edges trigger epitopes, those are the first scored connections.

### The 22 ghost seats

Across 15 entities, **22 legally required officer positions** are unfilled in the graph. Each one is a name on a LARA filing. Each one is a person the graph doesn't know yet. Each one is a potential epitope trigger.

Priority ghost seats:
- Progress Can't Wait — president, treasurer unknown
- Blue Mitten Action — president, treasurer unknown
- Michiganders for Progressive Values Fund — president, treasurer unknown
- Our Neighborhoods First — president, treasurer, incorporator unknown
- MacDowell Preparatory Academy — board treasurer unknown

---

## The Augmented Reality Layer

This is not a video game. This is augmented reality.

The map is Michigan. The nodes are real people and real entities filed with real government agencies. The edges are real relationships documented in real databases. The epitopes are real structural patterns that indicate real conflicts of interest, real dual roles, real financial circuits.

**You are already in the game.** If you live in Michigan, some of these nodes are your judges, your school board members, your elected officials, your children's teachers. The graph describes the architecture of the institutions that affect your life.

The augmented reality layer is this: you now have a **scoring system** for what you see. When you read that a judge also sits on a nonprofit board, you can check: does this trigger `dual_role_conflicts`? When you read that a law firm formed a political nonprofit, you can check: is this a `serial_vehicle_formation`? When you read that a public employee left for a charter school, you can check: is this part of a `talent_pipeline_extraction`?

The game board is the public record. The AR layer is the epitope sorter. The prize is seeing the architecture that was supposed to be invisible.

---

## How to Start

### Level 1: Read the graph
Download [graph.json](/graph.json). Open it in any JSON viewer. Read the nodes. Read the edges. Pick one that interests you.

### Level 2: Search one node
Take that node to a public records database. [LARA](https://cofs.lara.state.mi.us/SearchApi/Search/Search) is the easiest — search by entity name or person name. What comes back?

### Level 3: Find one new edge
Did LARA show a connection the graph doesn't have? A person who isn't a node? An entity that isn't listed? That's a new edge. Document it: source, target, relationship type, source database, date.

### Level 4: Score it
Check the new edge against the epitope list. Does it trigger any of the 32 patterns? Each triggered epitope is a point.

### Level 5: Share it
Send your findings to **eco.primal@pm.me** with the source documentation. If it checks out against the primary record, it goes in the graph. Your edge joins the network. The pattern sharpens.

### Level 6: Find the structure
Don't just find edges. Find **patterns.** Does the person you found appear at multiple entities? Do those entities share other connections? Is there a circuit — money or governance flowing in a loop?

---

## Scoring

| Discovery | Points |
|-----------|--------|
| New edge (sourced to public record) | 1 |
| New edge that triggers 1 epitope | 3 |
| New edge that triggers 2+ epitopes | 5 per additional epitope |
| New node (person or entity not in graph) | 2 |
| Connecting an orphan (Spirit of Detroit, Protect MI Families) | 10 |
| Filling a ghost seat (officer position from LARA filing) | 5 |
| New epitope candidate (novel structural pattern) | 15 |
| Completing a circuit (money or governance loop) | 20 |
| Independent confirmation of existing edge (second source) | 1 |

The highest possible single discovery: a new node that connects an orphan, fills a ghost seat, triggers 3 epitopes, and completes a circuit = **2 + 10 + 5 + 15 + 20 = 52 points.**

Nobody has scored yet. The board is open.

---

## The Invert Template

Don't live in Michigan? The **inverted graph** at [/api/invert.json](/api/invert.json) has no names. Just shapes:

- 12 behavioral archetypes (captured_judge, serial_formation_agent, membrane_operator...)
- 9 pathology signatures (formation_governance_split, vendor_kickback_loop, talent_pipeline_extraction...)
- Structural metrics (clustering, betweenness, community structure)

Hold it up against your own city's charter school network, utility board, zoning commission, or judicial assignments. If 3+ pathology signatures match, the same architecture is present.

**The game works anywhere.** Michigan is just the first map.

---

## Source Registry

Every edge in the graph resolves to at least one of these databases:

| Database | URL | What It Contains |
|----------|-----|-----------------|
| LARA Entity Search | [cofs.lara.state.mi.us](https://cofs.lara.state.mi.us/SearchApi/Search/Search) | Michigan entity filings, officers, agents |
| CFRS | [cfrs.michigan.gov](https://cfrs.michigan.gov/) | Michigan campaign finance reports |
| ICHAT | [apps.michigan.gov/ichat](https://apps.michigan.gov/ichat/home.aspx) | Michigan criminal history ($10/search) |
| OTIS/MDOC | [mdocweb.state.mi.us](https://mdocweb.state.mi.us/OTIS2/otis2.aspx) | Michigan corrections lookup (free) |
| FEC | [fec.gov/data](https://www.fec.gov/data/) | Federal PAC filings and donations |
| ProPublica Nonprofits | [projects.propublica.org/nonprofits](https://projects.propublica.org/nonprofits/) | IRS 990 filings |
| PACER | [pacer.uscourts.gov](https://pacer.uscourts.gov/) | Federal court dockets ($0.10/page) |
| Wayne County ROD | [waynecountylandrecords.com](https://www.waynecountylandrecords.com/) | Property records |
| TransparencyUSA | [transparencyusa.org](https://www.transparencyusa.org/) | Cross-state campaign finance |

No FOIA required. No subscription needed. Every database above is public.

---

## The Question

Where did the money come from?

Where did the money go?

Who can find and connect the most epitopes?

The graph is the board. The public record is the territory. The epitopes are the scoring system. Michigan is the first map.

Play.

---

*Every claim in the graph is sourced to a public record. This game is played with facts, not allegations. The graph grows only with documented, sourced connections. CC-BY-SA-4.0 — remix, share, build upon. No tracking. No cookies. Your investigation stays yours.*

*Contact: eco.primal@pm.me*

*Cross-reference:*
- *[There's a Leak in the Dyke](/analysis/leak-in-the-dyke/) — the Dykema formation machine*
- *[Found the Leak: They Didn't Want the Flower to Wilk](/analysis/the-flower-to-wilk/) — the cross-office trail*
- *[The Corporate Network](/analysis/corporate-network-lara/) — every LARA entity*
- *[/api/invert.json](/api/invert.json) — the nameless template*
