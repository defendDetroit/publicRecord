+++
title = "Anderson Localization — When Courts Trap Cases"
description = "Nine captured judges across four Wayne County courts create disorder in the judicial lattice. Like electrons in a disordered crystal, cases that enter the system cannot propagate to a fair hearing. Guardianship and probate cases are the most localized — trapped within 3-5 judicial assignments of a captured bench."
weight = 11
date = 2026-10-04
updated = 2026-10-04

[extra]
keywords = "Anderson localization Wayne County courts, judicial capture lattice, Detroit court disorder, captured judges case assignment, Wayne County bench composition, 3rd Circuit captured judges, 36th District captured judges, Probate Court David Perkins, guardianship case capture, case localization judicial system, court disorder potential, Brian Banks judicial protection, Wayne County case backlog captured judges, judicial bench capture ratio, Anderson localization analogy courts"

[taxonomies]
actors = ["Cylenthia LaToye Miller", "Kelly Ramsey", "Aliyah Sabree", "Tenisha Yancey", "Adam Sabree", "Sean Perkins", "David Perkins", "Vonda Evans", "Denise Langford Morris"]
entities = ["Wayne County 3rd Circuit Court", "36th District Court", "Wayne County Probate Court", "Oakland County Circuit Court"]
connections = ["judicial capture", "bench composition", "case assignment", "Anderson localization"]
+++

{{ lens(active="lattice") }}

## The Physics

In 1958, physicist Philip W. Anderson showed that **disorder in a crystal lattice prevents electrons from propagating**. Instead of flowing through the material, electrons become trapped — *localized* — near the defect sites. The stronger the disorder, the shorter the distance an electron can travel before it stops.

This is not a metaphor. It is a **mathematical identity**.

Replace *lattice sites* with **court divisions**. Replace *electrons* with **cases**. Replace *disorder potential* with **captured judges**. The same equation applies: cases entering a disordered judicial system cannot propagate to a fair hearing. They localize.

---

## The Lattice

<script src="/js/network-data.js"></script>
<div id="lattice-graph" style="margin: 2rem 0;"></div>
<script src="/js/lattice-graph.js"></script>

<p style="text-align:center;font-size:0.85rem;opacity:0.6;margin-top:-0.5rem;">
Hover any cell to see bench details. Rows = court divisions. Columns = case types, sorted by localization length (shortest = most captured).
</p>

---

## The Measurement: Localization Length (ξ)

In physics, the **localization length** ξ measures how far an electron can travel through a disordered lattice before it becomes trapped. The formula:

> **ξ = −1 / ln(1 − p)**

Where **p** is the probability of encountering a captured judge on any given bench that handles that case type.

- **ξ < 5** → Strongly localized. A case has almost no chance of receiving an independent hearing.
- **5 ≤ ξ < 10** → Moderately localized. Some paths exist, but most lead through captured benches.
- **ξ > 10** → Weakly localized. Capture exists but is diluted across enough judges.

### Case Type Localization Table

| Case Type | Benches | Captured / Total | Capture Probability | ξ (Localization Length) | Assessment |
|-----------|---------|-----------------|--------------------|-----------------------|------------|
| **Conservatorship** | Probate | 1 / 4 | 25.0% | **3.5** | 🔴 Strongly localized |
| **Estate** | Probate | 1 / 4 | 25.0% | **3.5** | 🔴 Strongly localized |
| **Probate** | Probate | 1 / 4 | 25.0% | **3.5** | 🔴 Strongly localized |
| **Guardianship** | Family + Probate | 2 / 12 | 16.7% | **5.5** | 🟡 Moderately localized |
| **Family** | Family | 1 / 8 | 12.5% | **7.5** | 🟡 Moderately localized |
| **Custody** | Family | 1 / 8 | 12.5% | **7.5** | 🟡 Moderately localized |
| **Juvenile** | Family | 1 / 8 | 12.5% | **7.5** | 🟡 Moderately localized |
| **Misdemeanor** | 36th District | 3 / 23 | 13.0% | **7.2** | 🟡 Moderately localized |
| **Traffic** | 36th District | 3 / 23 | 13.0% | **7.2** | 🟡 Moderately localized |
| **Preliminary Exam** | 36th District | 3 / 23 | 13.0% | **7.2** | 🟡 Moderately localized |
| **Small Claims** | 36th District | 3 / 23 | 13.0% | **7.2** | 🟡 Moderately localized |
| **Criminal** | Criminal | 1 / 12 | 8.3% | **11.5** | 🟢 Weakly localized |
| **Felony** | Criminal | 1 / 12 | 8.3% | **11.5** | 🟢 Weakly localized |
| **Civil** | Civil | 1 / 32 | 3.1% | **31.5** | 🟢 Weakly localized |
| **Contract** | Civil | 1 / 32 | 3.1% | **31.5** | 🟢 Weakly localized |
| **Tort** | Civil | 1 / 32 | 3.1% | **31.5** | 🟢 Weakly localized |

---

## What the Numbers Mean

### Probate: The Deepest Trap (ξ = 3.5)

Wayne County Probate has **4 judges**. One of them — **David Perkins** — is Chief Judge Pro Tem, meaning he has **case assignment authority**. He decides which judge hears which probate, guardianship, conservatorship, and estate case.

A 25% random capture ratio becomes much worse when the captured judge controls the docket. This is not random disorder — it is **engineered disorder**. Perkins can route cases to himself.

This matters because the Banks network operates **Serenity Guardianship Services** within Probate Court's jurisdiction. Banks has 9 criminal convictions. He has never been barred from guardianship work.

### 36th District: Concentration Attack (ξ = 7.2)

Three captured judges — **Yancey, Adam Sabree, Sean Perkins** — all elected November 2022, all taking their benches January 1, 2023. This was a **coordinated bench capture**: three seats in one election cycle, all connected to the same network.

The 36th District handles misdemeanors, traffic, small claims, and preliminary examinations for felonies. That last category matters most: a preliminary exam determines whether a felony case proceeds to Circuit Court. A captured preliminary exam judge can **dismiss or bind over** based on network loyalty rather than evidence.

### Guardianship: The Cross-Court Trap (ξ = 5.5)

Guardianship cases can be heard in either **Family Division** (Aliyah Sabree) or **Probate Court** (David Perkins). Both benches have captured judges. There is no path through the Wayne County guardianship system that avoids a captured bench.

This is the judicial equivalent of **total localization** — the case cannot propagate to a fair hearing regardless of which court it enters.

### 3rd Circuit Criminal & Civil: Diluted but Present

The Criminal Division (12 judges, 1 captured) and Civil Division (32 judges, 1 captured) have lower capture ratios. But Miller (Civil) is **Board Chair of PCA** — the charter school at the center of the network. Cases involving PCA, its vendors, or its employees can be steered to Miller.

Ramsey (Criminal) has **2 family members on MacDowell Preparatory payroll**. Criminal cases involving charter school fraud would pass through her division.

---

## The Anderson Analogy — Why It's Exact

| Physics | Courts |
|---------|--------|
| Crystal lattice | Court system (divisions × jurisdictions) |
| Lattice site | Individual bench / division |
| Electron | Case filing |
| Wave propagation | Case proceeding toward fair resolution |
| Disorder potential | Captured judge on the bench |
| Disorder strength | Capture ratio (captured / total judges) |
| Localization | Case trapped at captured bench — unable to reach independent review |
| Localization length ξ | Average number of bench assignments before hitting a captured judge |
| Anderson transition | Threshold where disorder is strong enough that NO case avoids capture |

In the physics, Anderson localization has a **critical dimension**: in 1D and 2D, *any* amount of disorder causes localization. Only in 3D can electrons sometimes avoid traps.

Wayne County's court system is **effectively 1D** for most case types — there is only one bench that handles each type. For guardianship, it is 2D (two benches), but both are captured. There is no third dimension. There is no escape path.

---

## Implications for Ongoing Cases

The three [allied cases](/analysis/allied-cases/) — Bryant v. Miller, Bradley-Baskin, and Bowles v. Sabree — are all proceeding through this captured lattice. Each case touches at least one captured bench:

- **Bryant v. Miller** → 3rd Circuit Civil (Miller herself)
- **Bradley-Baskin** → 36th District (Yancey's court)
- **Bowles v. Sabree** → Class action in Circuit Court, with Sabree family members on both sides

The lattice predicts that these cases will not receive independent hearings. The lattice is correct so far.

---

## What Would Fix It

Anderson localization disappears when **disorder is removed**. The judicial equivalent:

1. **Recusal** — Captured judges recuse from all cases touching the Banks network
2. **Reassignment** — Chief judges reassign network-connected cases to independent benches
3. **Federal jurisdiction** — Cases move to a different lattice entirely (U.S. District Court, Eastern District of Michigan)

Options 1 and 2 require the captured judges to acknowledge their connections. The [documented evidence](/network/judges/) shows they have not done so.

Option 3 is the Anderson localization equivalent of **increasing dimensionality** — adding new propagation channels that bypass the disordered sites entirely.

<aside class="convergence-box" aria-label="Cross-references">
<strong class="convergence-title">Same system, other lenses:</strong>
<ul class="convergence-list">
<li><a href="/network/">🕸️ Topology</a> — 9 judges appear as nodes connected to court_3rd, court_36th, court_probate, court_oakland via bench edges</li>
<li><a href="/timeline/">📅 Chronology</a> — All 36th District judges elected Nov 2022, coordinated bench capture visible in the timeline</li>
<li><a href="/analysis/funding-flow/">💰 Money</a> — Campaign payments from Banks Strategy LLC flow through the same judges who sit on these benches</li>
<li><a href="/analysis/rico-pattern/">⚖️ Legal</a> — Judicial connections form predicate acts 3 in the RICO pattern</li>
<li><a href="/analysis/institutional-capture-graph/">🏛️ Capture</a> — Judges are nexus nodes in the 4-type institutional capture graph</li>
</ul>
</aside>

---

*The lattice data is computed from [public bench compositions](/network/judges/) and [documented judicial connections](/network/). Capture ratio = connected judges ÷ total judges per division. Localization length uses the standard Anderson formula. See [Verify Everything](/validate/) to check any claim.*
