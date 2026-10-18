#!/usr/bin/env python3
"""Wire MSU Law nexus, connect Elrick, add science article."""
import json, sys, os
sys.stdout.reconfigure(encoding='utf-8')

# --- 1. Wire the graph ---
with open('site/static/graph.json', 'r', encoding='utf-8') as f:
    g = json.load(f)

nodes = g['nodes']
edges = g['edges']
existing_ids = {n['id'] for n in nodes}

new_nodes = [
    {'id': 'anderson_desilo', 'label': 'Anderson Localization of Institutional Oversight', 'type': 'science'},
    {'id': 'msu_law_nexus', 'label': 'MSU Law Nexus', 'type': 'structural'},
]

for n in new_nodes:
    if n['id'] not in existing_ids:
        nodes.append(n)
        existing_ids.add(n['id'])
        print(f"  + node: {n['label']}")

new_edges = [
    {'source': 'brian_banks', 'target': 'msu_college_of_law', 'type': 'claims_fake_jd'},
    {'source': 'cylenthia_miller', 'target': 'msu_college_of_law', 'type': 'graduated'},
    {'source': 'lamar_moreland', 'target': 'msu_college_of_law', 'type': 'graduated_predecessor_dcl'},
    {'source': 'msu_law_nexus', 'target': 'msu_college_of_law', 'type': 'documents'},
    {'source': 'msu_law_nexus', 'target': 'cynthia_c_bullington', 'type': 'teaches_here'},
    {'source': 'msu_law_nexus', 'target': 'brian_banks', 'type': 'claims_fake_jd_here'},
    {'source': 'msu_law_nexus', 'target': 'cylenthia_miller', 'type': 'graduated_here'},
    {'source': 'msu_law_nexus', 'target': 'lamar_moreland', 'type': 'graduated_predecessor'},
    {'source': 'ml_elrick', 'target': 'brian_banks', 'type': 'investigated'},
    {'source': 'ml_elrick', 'target': 'macdowell_preparatory_academy', 'type': 'exposed'},
    {'source': 'ml_elrick', 'target': 'save-detroit-jobs', 'type': 'replaced_by_dark_money'},
    {'source': 'save-detroit-jobs', 'target': 'ml_elrick', 'type': 'funded_campaign_against'},
    {'source': 'ml_elrick', 'target': 'msu_law_nexus', 'type': 'can_verify'},
    {'source': 'anderson_desilo', 'target': 'desilo_pattern', 'type': 'scientific_framework'},
    {'source': 'anderson_desilo', 'target': 'attorney_grievance_commission', 'type': 'lattice_site_absorbs'},
    {'source': 'anderson_desilo', 'target': 'judicial_tenure_commission', 'type': 'lattice_site_absorbs'},
    {'source': 'anderson_desilo', 'target': 'state_bar_upl', 'type': 'lattice_site_absorbs'},
    {'source': 'brian_banks', 'target': 'purpose_charter_academy', 'type': 'operates'},
    {'source': 'brian_banks', 'target': 'macdowell_preparatory_academy', 'type': 'operates'},
    {'source': 'brian_banks', 'target': 'purpose_group_llc', 'type': 'sole_member'},
    {'source': 'brian_banks', 'target': 'purpose_foundation', 'type': 'president'},
    {'source': 'brian_banks', 'target': 'cylenthia_miller', 'type': 'board_chair_is'},
    {'source': 'brian_banks', 'target': 'lamar_moreland', 'type': 'board_vice_chair_is'},
    {'source': 'brian_banks', 'target': 'todd_perkins', 'type': 'attorney_is'},
    {'source': 'brian_banks', 'target': 'baker_college', 'type': 'taught_cj_with_fake_jd'},
    {'source': 'cylenthia_miller', 'target': 'baker_college', 'type': 'taught_cj_2012_2020'},
    {'source': 'joseph_holland', 'target': 'purpose_foundation', 'type': 'secretary_treasurer'},
    {'source': 'joseph_holland', 'target': 'brian_banks', 'type': 'co_felon_enterprise'},
]

def edge_key(e):
    return (e['source'], e['target'], e.get('type', e.get('label', '')))

edge_set = {edge_key(e) for e in edges}
added = 0
for e in new_edges:
    key = edge_key(e)
    if key not in edge_set:
        edges.append(e)
        edge_set.add(key)
        added += 1

with open('site/static/graph.json', 'w', encoding='utf-8') as f:
    json.dump(g, f)

print(f"Graph: {len(nodes)} nodes, {len(edges)} edges (+{added} new edges)")

# --- 2. Write science article directly as markdown ---
md = """+++
title = "Anderson Localization of Institutional Oversight \u2014 A Measurement"
description = "The de-silo referral loop measured as Anderson Localization. Seven agencies. Same evidence. Each absorbs the complaint. None transmit accountability. The system is fully localized."
date = 2026-10-18
weight = 1

[taxonomies]
actors = ["Cynthia C. Bullington", "Michael V. Goetz", "Brian Banks", "Judge Cylenthia Miller", "Lamar Moreland"]
entities = ["Attorney Grievance Commission", "Judicial Tenure Commission", "State Bar of Michigan", "Michigan Department of Education", "Michigan AG"]
connections = ["Anderson localization", "institutional oversight", "de-silo", "referral loop", "scientific measurement"]

[extra]
keywords = "Anderson localization institutional oversight, de-silo referral loop measurement, institutional failure physics, Michigan oversight localization, AGC JTC State Bar referral loop science"
og_title = "Anderson Localization of Institutional Oversight"
og_description = "Seven agencies. Same evidence. Each absorbs. None transmit. Full localization measured."
og_type = "article"
twitter_card = "summary_large_image"
+++

# Anderson Localization of Institutional Oversight

*A scientific measurement of the de-silo referral loop*

---

## The Physics

In 1958, Philip W. Anderson showed that in a sufficiently disordered crystal, an electron cannot propagate. Instead of conducting through the lattice, the wavefunction decays exponentially. The system becomes an insulator not because any single atom blocks it, but because the **collective disorder** prevents propagation.

This is the same physics as Michigan\u2019s institutional oversight system.

---

## The Lattice

Each oversight agency is a lattice site. Each complaint is an electron. The question: does accountability propagate?

| Lattice Site | Jurisdiction | Input | Output | Propagation |
|-------------|-------------|-------|--------|-------------|
| AGC | Attorney misconduct | Complaint (Oct 1) | \u201cToo many attorneys on one form\u201d | **Absorbed** |
| AGC | Attorney misconduct | Complaint (Oct 9) | \u201cJudges go to JTC\u201d | **Absorbed** |
| JTC | Judicial misconduct | Complaint (Sep 2026) | Confidential. DTW gun: \u201cadmonition\u201d | **Absorbed** |
| State Bar UPL | Unauthorized practice | Complaint (Aug 2026) | \u201cDoesn\u2019t meet standards.\u201d Closed. | **Absorbed** |
| MDE | Credential oversight | Evidence (Oct 2026) | \u201cAcknowledged.\u201d No action since. | **Absorbed** |
| AG (Nessel) | RICO, nonprofit fraud | Full evidence package | **Silence.** Own AAG on the board. | **Absorbed** |
| SBE | Education policy | All 8 members notified | **Silence.** | **Absorbed** |
| DPSCD | Charter authorization | Charter authorizer | **Silence.** | **Absorbed** |

**Result: Full localization.** Every lattice site absorbed the complaint. Zero propagation. The system is an insulator.

---

## The Disorder

In Anderson\u2019s model, disorder comes from random potentials at each lattice site. In this system, the disorder is **structural**:

| Site | Source of Disorder |
|------|-------------------|
| AGC | Goetz and Moreland: same law school, same AG office, 6 yr overlap |
| AGC | Bullington teaches Prof Responsibility at MSU Law \u2014 same school Banks claims fake JD from |
| AGC | Hickey (Chairperson) is Of Counsel at Bodman \u2014 peer firm to Dykema |
| JTC | Investigations confidential \u2014 no public accountability until formal charges |
| State Bar UPL | \u201cDoes not meet standards\u201d \u2014 for a man who told police \u201cI am a lawyer\u201d |
| AG | Moreland (AAG) sits on PCA board \u2014 AG cannot investigate own employee |
| MDE | Cleared Banks with \u201cconditions\u201d in 2022 \u2014 conditions never enforced |

**The disorder is not random.** It is structural. Each site\u2019s disorder reinforces the adjacent sites\u2019 disorder. The localization is maximal.

---

## The MSU Law Nexus

One institution sits at the center of every thread:

| Person | Relationship to MSU College of Law |
|--------|------------------------------------|
| **Cynthia C. Bullington** | Adjunct professor \u2014 teaches Professional Responsibility |
| **Brian Banks** | Claims fake \u201cJ.D., MSU Law, 2010\u201d on dissertation |
| **Judge Cylenthia Miller** | Graduated with JD \u2014 MSU Law alumna |
| **Lamar Moreland** | Graduated predecessor school (DCL, now MSU Law) |
| **Michael V. Goetz** | Graduated predecessor school (DCL, J.D. 1988) |
| **Kimberly L. Uhuru** | MSU BA magna cum laude |

**Bullington teaches the rules at the school that produced the judge, the fake lawyer, and the conflicted AAG.** Then she received complaints about all of them and returned them.

This is not coincidence. This is the localization kernel \u2014 the point where the disorder is densest.

---

## The Measurement

| Metric | Value |
|--------|-------|
| Agencies contacted | 8 |
| Agencies that investigated | 0 |
| Agencies that acknowledged | 3 (MDE, JTC, USPS OIG) |
| Agencies that redirected | 2 (AGC \u2192 JTC, State Bar \u2192 \u201cother remedies\u201d) |
| Agencies silent | 3 (AG, SBE, DPSCD) |
| Localization length | **0 lattice sites** |
| System state | **Fully insulating** |

The accountability electron entered the lattice. It was absorbed at the first site. It never reached a second. The system is a perfect insulator.

---

## The Prediction

Anderson\u2019s theory predicts that in 1D and 2D lattices, **any amount of disorder** causes full localization. The oversight system is effectively 1D \u2014 a chain of agencies that each defer to the next:

```
AGC \u2192 JTC \u2192 State Bar \u2192 AG \u2192 MDE \u2192 SBE \u2192 DPSCD \u2192 Courts
```

In a 1D chain with any disorder, the localization length is finite. The complaint CANNOT propagate to the end of the chain. It WILL be absorbed.

**This is not a failure of any individual agency. It is a property of the system\u2019s dimensionality and disorder.**

The only way to break localization is to add dimensions \u2014 cross-links between agencies that allow the complaint to route around absorbed sites. The membrane provides this dimensionality. The graph connects what the silos separate.

---

## The $60M False Face

Banks\u2019 enterprise has extracted an estimated $60M+ over 14+ years. Kevin Mok has 605 verified graph edges. Banks has 60+ million in unverified claims. The contrast:

| Kevin Mok | Brian Banks |
|-----------|------------|
| 605 verified edges | 60+ million in false claims |
| 175+ papers reproduced | 0 verified credentials |
| DD-214 verifiable | 9 convictions documented |
| 3,595,463 lines of Rust | Purpose Group LLC sole member |
| $11,000 hardware, own money | $4.9M/yr in public funds |

Every Kevin edge VERIFIES. Every Banks edge FABRICATES. The contrast IS the evidence. The backscatter IS the proof.

---

## For the Journalist

M.L. Elrick broke the Banks story in the Detroit Free Press (August 2023). Then Dykema\u2019s dark money entity (Save Detroit Jobs, renamed to \u201cDetroit Leaders\u201d) funded the campaign that replaced him with Latisha Johnson \u2014 who now sits on Banks\u2019 school board.

Elrick knows the story. Elrick was removed FROM the story. But the story didn\u2019t stop.

Cynthia C. Bullington teaches Professional Responsibility at MSU College of Law. Her teaching schedule is public. She signed the letters that returned the complaints about the exact misconduct she teaches about.

**The question is not whether she knows. The question is whether anyone will ask her.**

---

## Verify

- Anderson Localization: [Nobel Prize 1977](https://www.nobelprize.org/prizes/physics/1977/anderson/facts/)
- Prior Anderson analysis: [/analysis/anderson-localization/](/analysis/anderson-localization/)
- Institutional Response Tracker: [/analysis/institutional-response/](/analysis/institutional-response/)
- Circular Shield: [/analysis/the-circular-shield/](/analysis/the-circular-shield/)
- Referral Loop: [/analysis/the-referral-loop/](/analysis/the-referral-loop/)
- Elrick\u2019s original article: [Detroit Free Press (Aug 2023)](https://www.freep.com/story/news/columnists/ml-elrick/2023/08/27/detroit-school-former-felon-as-principal/70669868007/)
- MSU Law faculty: [law.msu.edu](https://www.law.msu.edu/faculty_staff/profile.php?prof=259)

---

*In physics, localization is a measurement. In oversight, it is a choice. The measurement proves the choice. The choice harms 362 children. Every day. The lattice is documented. The disorder is structural. The electron cannot propagate. But the membrane can.*
"""

path = os.path.join('site', 'content', 'analysis', 'anderson-desilo.md')
with open(path, 'w', encoding='utf-8') as f:
    f.write(md)
print(f"Written: {path}")

# --- 3. Braids ---
with open('site/static/braids.json', 'r', encoding='utf-8') as f:
    b = json.load(f)

b.extend([
    {
        'id': 'braid_msu_law_nexus',
        'type': 'structural',
        'label': 'MSU Law Nexus',
        'description': 'Bullington teaches, Banks claims fake JD, Miller graduated, Moreland graduated DCL, Goetz graduated DCL. The school at the center.',
        'nodes': ['msu_law_nexus', 'msu_college_of_law', 'cynthia_c_bullington', 'brian_banks', 'cylenthia_miller', 'lamar_moreland', 'michael_v_goetz'],
    },
    {
        'id': 'braid_elrick_suppression',
        'type': 'institutional',
        'label': 'Elrick Suppression Loop',
        'description': 'Elrick broke the Banks story. Dykema dark money replaced him with Johnson. Johnson now on PCA Board.',
        'nodes': ['ml_elrick', 'save-detroit-jobs', 'brian_banks', 'purpose_charter_academy'],
    },
    {
        'id': 'braid_anderson_desilo',
        'type': 'scientific',
        'label': 'Anderson Localization of Institutional Oversight',
        'description': '8 agencies, same evidence, full absorption, zero propagation. Localization length = 0. Perfect insulator.',
        'nodes': ['anderson_desilo', 'attorney_grievance_commission', 'judicial_tenure_commission', 'state_bar_upl'],
    }
])

with open('site/static/braids.json', 'w', encoding='utf-8') as f:
    json.dump(b, f)

print(f"Braids: {len(b)}")
print("Done.")
