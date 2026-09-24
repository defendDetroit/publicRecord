+++
title = "Institutional Capture — How the Enterprise Controls Detroit"
description = "Institutional capture: how the Banks enterprise controls Detroit schools, courts, and political offices — installing loyalists and creating financial dependencies."
weight = 2
date = 2026-09-20

[extra]
keywords = "institutional capture Detroit, captured courts Wayne County, Detroit charter school corruption, DPSCD authorization fraud, Wayne County judges Brian Banks, Detroit institutional corruption, charter school captured institutions"

[taxonomies]
actors = ["Brian Banks", "Joseph Holland", "Judge Cylenthia Miller", "Judge Tenisha Yancey", "Judge Aliyah Sabree", "Judge David Perkins", "Sherry Gay-Dagnogo", "Eric Sabree"]
entities = ["Purpose Charter Academy", "MacDowell Preparatory Academy", "The Purpose Group LLC", "Purpose Foundation", "Banks Strategy LLC", "Anchor Rock Foundation", "Serenity Guardianship Services", "Inner Link Graphics"]
courts = ["Wayne County 3rd Circuit Court", "36th District Court", "Wayne County Probate Court"]
connections = ["charter authorization", "board membership", "campaign finance", "business entity", "family", "employment", "credential fraud"]
+++

The Banks enterprise does not just commit fraud. It **captures institutions** — installing loyalists, creating financial dependencies, and ensuring that the systems meant to protect the public instead protect the enterprise.

## The Capture Pattern — Three Domains

| Domain | Function | Capture Effect |
|--------|----------|----------------|
| **Schools** | Revenue source | Public education dollars become private revenue |
| **Courts** | Protection | Network-connected judges handle enterprise cases |
| **Political** | Authorization | Allies authorize charters and provide institutional cover |

See also: [RICO Pattern](/analysis/rico-pattern/) — full enterprise structure.

## 1. Schools (Revenue Source)

| Institution | Capture Method | Effect |
|-------------|---------------|--------|
| {{ entity(key="pca") }} | Banks is superintendent with fake credentials; {{ entity(key="purpose_group") }} takes ~73% | Public dollars routed to CMO shell |
| {{ entity(key="macdowell") }} | Same structure; CMU as authorizer | {{ entity(key="macdowell", field="revenue") }} state aid extracted |
| DPSCD (authorizer) | Former board member {{ actor(key="gay_dagnogo") }} — Banks' political ally and [CBC honoree](/analysis/cbc-events/) — authorized charters before resigning for ombudsman role (Oct 2025) | Charter authorization by captured board |

**Effect:** Students are the product, not the beneficiaries. Money flows from state per-pupil funding through shell entities to enterprise principals.

## 2. Courts (Protection)

| Court | Captured Actor | Method | Effect |
|-------|---------------|--------|--------|
| Wayne 3rd Circuit | {{ actor(key="miller") }} | Board Chair of {{ entity(key="anchor_rock") }} | Judge chairs felon's nonprofit while on bench |
| Wayne 3rd Circuit | {{ actor(key="yancey") }} | Campaign paid {{ entity(key="banks_strategy") }} | Financial tie to enterprise principal |
| Wayne 3rd Circuit | {{ actor(key="sabree") }} | MSU Law classmate; brother is County Treasurer | Professional and family network overlap |
| Wayne Probate | {{ actor(key="perkins_david") }} | Family donations to network campaigns | {{ entity(key="serenity") }} jurisdiction |

**Effect:** 4 judges in the same county system with demonstrable ties to the enterprise. Any case involving Banks, his schools, or his network risks landing before a captured judge.

Three of these judges sit on **36th District Court** — the same court where Judge Andrea Bradley-Baskin was indicted in January 2026 for allegedly embezzling from incapacitated wards (no Banks connection; see [Allied Cases](/analysis/allied-cases/)).

Corroboration: [Allied Cases](/analysis/allied-cases/) — Bryant v. Miller independently identified Miller.

## 3. Political Offices (Authorization)

| Office | Captured Actor | Method | Effect |
|--------|---------------|--------|--------|
| MI HD-1 (former) | {{ actor(key="banks") }} | Held office 2015–2016 with fake credentials | Political legitimacy for enterprise |
| MI HD-8 (former) | {{ actor(key="gay_dagnogo") }} | Authorized Banks' charters from DPSCD board; now Detroit City Ombudsman (Oct 2025) | Direct authorization conflict (historical) |
| Wayne County Treasurer | Eric Sabree | Sister is {{ actor(key="sabree") }}; office handles tax foreclosures | Housing distress pipeline |

**Effect:** Political allies authorize the charter schools and protect the revenue stream.

See: [Political Enablers](/network/political/), [CBC Week Events](/analysis/cbc-events/).

## 4. Financial System (Extraction)

| Entity | Capture Method | Effect |
|--------|---------------|--------|
| {{ entity(key="purpose_group") }} | Shell CMO — all school staff "employed" by the LLC, not the school | {{ entity(key="macdowell", field="extraction_pct") }} revenue extraction |
| {{ entity(key="purpose_foundation") }} | Private foundation — 2 felons hold all 4 officer positions | Self-dealing risk under IRC §4940–4948 |
| {{ entity(key="banks_strategy") }} | Consulting entity — receives payments from judges | Judicial financial dependency |
| {{ entity(key="pacs") }} | Felon as treasurer; $14.5K+ in unpaid fines | Political infrastructure |
| OFA Michigan | Dark money 501(c)(4) at Holland's PO Box | Unreported political spending |

**Effect:** Money flows from public schools through multiple shell entities, obscuring extraction.

## 5. Housing (Community Extraction)

| Mechanism | Detail |
|-----------|--------|
| Tax foreclosure pipeline | Wayne County Treasurer (Eric Sabree) processes foreclosures → distressed properties → acquisition opportunities |
| Wayne ROD | Banks' property transactions documented (QCD, mortgage at 1968 Severn) |
| GPW residence | Enterprise principals live in affluent suburb while extracting from Detroit |

**Effect:** The enterprise benefits from the housing distress its broader network helps perpetuate.

## The Silo Problem

Each institution sees only its piece:

| Regulator | What They See | What They Miss |
|-----------|--------------|----------------|
| **DOE** | Charter school with paperwork in order | Fake credentials, CMO extraction |
| **Courts** | Individual cases | Pattern of connected judges |
| **Campaign finance** | Individual donations | Network cross-payments ($98K+ to [Inner Link](/network/entities/inner-link-graphics/)) |
| **LARA** | Individual entities | Common control at 1968 Severn Road |
| **IRS** | Individual returns | Self-dealing across foundation + LLC |
| **Bar** | No complaints about Banks | He was never admitted |

**This is by design.** The enterprise operates across silos precisely because no single regulator sees the full picture.

## Breaking the Silo

The federal packet — "Cash for Kids 2: Operation Detroit Plantation" — is the first document to present the full cross-institutional picture to all agencies simultaneously.

One civilian, pro se, pro bono, compiled what no single agency had assembled.

## Verify

- LARA entity records: {{ source(key="lara_cofs") }}
- Campaign finance: [transparencyusa.org](https://transparencyusa.org), {{ source(key="cfrs") }}
- School authorization: DPSCD board records
- Judicial connections: [Judicial Cover](/network/judges/)
- Allied corroboration: [Allied Cases](/analysis/allied-cases/) — PACER **2:26-cv-10917**

---

*All sources are public records.*
