+++
title = "RICO Pattern — The Banks Enterprise"
description = "RICO pattern analysis: 6 predicate acts, 14+ years of continuity, $4.9M annual extraction through shell entities. The Banks enterprise mapped."
weight = 1
date = 2026-09-20

[extra]
keywords = "Detroit RICO pattern, Brian Banks RICO, charter school racketeering, 18 USC 1961, mail fraud charter school, wire fraud Detroit, money laundering Purpose Group LLC, Detroit charter school enterprise, Banks enterprise predicate acts"

[taxonomies]
actors = ["Brian Banks", "Joseph Holland", "OD Banks", "Judge Cylenthia Miller", "Judge Aliyah Sabree", "Judge Tenisha Yancey", "Judge David Perkins"]
entities = ["Purpose Charter Academy", "MacDowell Preparatory Academy", "The Purpose Group LLC", "Purpose Foundation", "Banks Strategy LLC", "Anchor Rock Foundation", "Serenity Guardianship Services"]
courts = ["Wayne County 3rd Circuit Court", "36th District Court", "Wayne County Probate Court", "Eastern District of Michigan"]
connections = ["RICO predicate", "credential fraud", "campaign finance", "business entity", "board membership", "criminal record", "charter authorization", "family"]
+++

The Banks enterprise operates as a documented racketeering pattern across charter schools, shell entities, captured courts, and political infrastructure. This analysis maps the structure under 18 U.S.C. § 1961.

## Enterprise Structure {{ confidence(level="documented") }}

```
BRIAN RODERICK BANKS (9 convictions, 3 bankruptcies, fake J.D.)
│
├── REVENUE STREAMS
│   ├── Purpose Charter Academy (K-8, DPSCD authorized) ─── state aid
│   ├── MacDowell Preparatory Academy ─────────────────── {{ entity(key="macdowell", field="revenue") }} state aid
│   ├── Banks Strategy & Consultants LLC ──────────────── Campaign payments from judges
│   └── Eventbrite events (CBC Week, Galas) ───────────── $50K–$150K est. (4 years)
│
├── EXTRACTION MECHANISM
│   ├── The Purpose Group LLC (CMO) ───── Takes {{ entity(key="macdowell", field="extraction_pct") }} of school revenue
│   │   └── {{ entity(key="macdowell", field="unaccounted") }} unaccounted "management fee" gap
│   ├── Purpose Foundation (501c3) ────── "Private foundation" — 2 felons, all positions
│   └── Personal salary ──────────────── $150K base + control of all entities
│
├── POLITICAL COVER
│   ├── Bank on Banks for Michigan PAC ── Holland (felon) as Treasurer
│   ├── Bank on Wayne County PAC ──────── Banks as Treasurer
│   ├── Opportunities For All Michigan ── Dark money mailers
│   └── CBC Week events ───────────────── 4 years hosting Congressional members
│
├── JUDICIAL COVER
│   ├── {{ actor(key="miller") }} ────────── Board Chair of Banks' prior school entity
│   ├── {{ actor(key="sabree") }} ───────────── MSU Law classmate (2010), never reported fraud
│   ├── {{ actor(key="yancey") }} ──────────── Paid $383.82 to Banks Strategy (SOLE expenditure, 2024)
│   └── {{ actor(key="perkins_david") }} ────────────────── Wayne Probate Judge, family donated to network
│
└── KEY ASSOCIATE
    └── {{ actor(key="holland") }} (felon, MDOC #443789)
        ├── Purpose Foundation: Secretary + Treasurer
        ├── Bank on Banks PAC: Treasurer
        ├── Banks Living Trust: 1st Successor Trustee
        └── OFA Michigan: Officer
```

See: [Enterprise Principals](/network/actors/), [Entity Profiles](/network/entities/), [Judicial Cover](/network/judges/).

## Revenue Streams

| Stream | Entity | Annual Value | Source |
|--------|--------|-------------|--------|
| Charter school A | {{ entity(key="macdowell") }} | **{{ entity(key="macdowell", field="revenue") }}** state aid | School budget transparency |
| Charter school B | {{ entity(key="pca") }} | State aid (finances pending) | DPSCD authorization |
| Consulting | {{ entity(key="banks_strategy") }} | Judge campaign payments | TransparencyUSA |
| Events | [CBC Week parties](/analysis/cbc-events/) | $50K–$150K est. (4 years) | Eventbrite |

## Extraction Mechanism

| Layer | Entity | Mechanism |
|-------|--------|-----------|
| CMO shell | {{ entity(key="purpose_group") }} | Takes **{{ entity(key="macdowell", field="extraction_pct") }}** of school revenue; sole member: Banks |
| Management gap | Purpose Group LLC | **{{ entity(key="macdowell", field="unaccounted") }}** unaccounted "management fee" |
| Private foundation | {{ entity(key="purpose_foundation") }} | 2 felons hold all 4 officer positions |
| Personal extraction | {{ actor(key="banks") }} | $150K base salary + control of all entities |

## Political Cover

| Entity | Role | Detail |
|--------|------|--------|
| Bank on Banks for Michigan PAC | Treasurer | {{ actor(key="holland") }} — convicted drug trafficker |
| Bank on Wayne County PAC | Treasurer | {{ actor(key="banks") }} |
| Opportunities For All Michigan | Officer | Holland; dark money mailers |
| [CBC Week events](/analysis/cbc-events/) | Host | 4 years of Congressional Black Caucus networking |

See: [Political Action Committees](/network/entities/political-action-committees/), [Political Enablers](/network/political/).

## Judicial Cover

| Judge | Court | Connection |
|-------|-------|------------|
| {{ actor(key="miller") }} | Wayne 3rd Circuit | Board Chair of {{ entity(key="anchor_rock") }} |
| {{ actor(key="sabree") }} | Wayne 3rd Circuit | MSU Law classmate (~2010); brother is County Treasurer |
| {{ actor(key="yancey") }} | 36th District | Paid **$383.82** to Banks Strategy — her **sole expenditure** (2024) |
| {{ actor(key="perkins_david") }} | Wayne Probate | Family donations to network campaigns; {{ entity(key="serenity") }} jurisdiction |

See: [Institutional Capture](/analysis/institutional-capture/).

{% mermaid(title="RICO Predicate Acts — How Each Crime Feeds the Enterprise") %}
graph TB
    ENT["<b>Banks Enterprise</b><br/>14+ years · $4.9M+/yr"]

    subgraph FRAUD["📄 Fraud Predicates"]
        MAIL["<b>Mail Fraud</b><br/>§1341<br/>Fake J.D. on school<br/>websites + conference bios"]
        WIRE["<b>Wire Fraud</b><br/>§1343<br/>False credentials on<br/>DOE + grant applications"]
    end

    subgraph MONEY["💰 Financial Predicates"]
        LAUNDER["<b>Money Laundering</b><br/>§1956<br/>$4.28M through LLC shell<br/>$348K unaccounted gap"]
        BANK_FR["<b>Financial Fraud</b><br/>§1344<br/>3 bankruptcies<br/>PAC irregularities"]
    end

    subgraph CORRUPT["⚖️ Corruption Predicates"]
        BRIBE["<b>Bribery</b><br/>§201<br/>Judge campaign payments<br/>to Banks Strategy LLC"]
        OBSTRUCT["<b>Obstruction</b><br/>§1503<br/>Network judges refuse<br/>to recuse"]
    end

    MAIL -->|"fake credentials<br/>= school authorization"| ENT
    WIRE -->|"federal reporting<br/>= continued funding"| ENT
    LAUNDER -->|"LLC extraction<br/>= private enrichment"| ENT
    BANK_FR -->|"financial opacity<br/>= no audit trail"| ENT
    BRIBE -->|"judge payments<br/>= judicial protection"| ENT
    OBSTRUCT -->|"no recusal<br/>= captured courts"| ENT

    ENT -->|"revenue"| LAUNDER
    ENT -->|"authority"| MAIL
    ENT -->|"payments"| BRIBE

    classDef enterprise fill:#991b1b,stroke:#ef4444,color:#fecaca
    classDef fraud fill:#713f12,stroke:#f59e0b,color:#fef3c7
    classDef money fill:#14532d,stroke:#4ade80,color:#bbf7d0
    classDef corrupt fill:#312e81,stroke:#818cf8,color:#c7d2fe

    class ENT enterprise
    class MAIL,WIRE fraud
    class LAUNDER,BANK_FR money
    class BRIBE,OBSTRUCT corrupt
{% end %}

Each predicate act reinforces the others. Credential fraud enables school authorization → authorization enables revenue → revenue enables campaign payments → payments enable judicial protection → judicial protection prevents accountability → the cycle continues.

## Predicate Acts (18 U.S.C. § 1961)

| # | Act | Statute | Evidence |
|---|-----|---------|----------|
| 1 | **Mail Fraud** | 18 U.S.C. § 1341 | Credential fraud on school websites, conference bios, and published materials — distributed via mail/wire to obtain public school funds |
| 2 | **Wire Fraud** | 18 U.S.C. § 1343 | False J.D. credential on federally-funded school applications, DOE reporting, and grant applications |
| 3 | **Money Laundering** | 18 U.S.C. § 1956 | $4.28M/yr funneled through [Purpose Group LLC](/network/entities/purpose-group-llc/) shell structure; $348K unaccounted management fees |
| 4 | **Financial Institution Fraud** | 18 U.S.C. § 1344 | Three personal bankruptcies; PAC financial irregularities |
| 5 | **Bribery** | 18 U.S.C. § 201 | Campaign payments from sitting judges to Banks' consulting firm |
| 6 | **Obstruction** | 18 U.S.C. § 1503 | Network judges presiding over network-connected cases without recusal |

## The Continuity Test

The enterprise has operated continuously for **14+ years** (2010–present):

| Phase | Period | Activity |
|-------|--------|----------|
| **Street** | Pre-2005 | BMF drug distribution network (father {{ fact(section="bmf", field="father") }} = Defendant #22) |
| **Political** | 2014–2016 | MI State House using fake credentials |
| **Educational** | 2017–present | Charter school superintendent using fake credentials |
| **Financial** | 2017–present | CMO extraction of public school funds |
| **Nonprofit** | 2024–present | [Purpose Foundation](/network/entities/purpose-foundation/) — private foundation, 2 felon officers |

See: [Timeline](/timeline/) for chronological documentation.

## Verify

| Claim | Verify At |
|-------|----------|
| Criminal record | MI ICHAT — SID **{{ fact(section="actors", key="banks", field="sid") }}** |
| No bar admission | State Bar of MI — {{ source(key="state_bar") }} |
| Entity records | LARA — IDs **803294855**, **803295082**, **802070120** |
| School finances | [macdowellprep.com](https://macdowellprep.com) (budget transparency) |
| Campaign payments | [transparencyusa.org](https://transparencyusa.org) |
| Bankruptcies | PACER — Cases 97-45020, 98-49073, 06-55281 |
| BMF connection | PACER — Case 2:05-cr-80955 |
| Judicial connections | MI campaign finance — {{ source(key="cfrs") }} |

---

*All sources are public records.*
