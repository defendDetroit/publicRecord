#!/usr/bin/env python3
"""Wire MSU Law nexus, connect Elrick, add science article, full backscatter."""
import json, sys, os
sys.stdout.reconfigure(encoding='utf-8')

# --- 1. Wire the graph ---
with open('site/static/graph.json', 'r', encoding='utf-8') as f:
    g = json.load(f)

nodes = g['nodes']
edges = g['edges']
existing_ids = {n['id'] for n in nodes}

# New nodes
new_nodes = [
    {'id': 'anderson_desilo', 'label': 'Anderson Localization of Institutional Oversight', 'type': 'science', 'description': 'The de-silo referral loop measured as Anderson Localization. Each agency is a lattice site. Complaints are electrons. When every site absorbs, no accountability propagates.'},
    {'id': 'msu_law_nexus', 'label': 'MSU Law Nexus', 'type': 'structural', 'description': 'MSU College of Law is the structural nexus: Bullington teaches there, Banks claims fake JD from there, Miller graduated there, Moreland graduated predecessor (DCL). The school at the center of every thread.'},
]

for n in new_nodes:
    if n['id'] not in existing_ids:
        nodes.append(n)
        existing_ids.add(n['id'])
        print(f'  + node: {n["label"]}')

# Wire MSU Law nexus edges
new_edges = [
    # MSU Law nexus
    {'source': 'brian_banks', 'target': 'msu_college_of_law', 'type': 'claims_fake_jd'},
    {'source': 'cylenthia_miller', 'target': 'msu_college_of_law', 'type': 'graduated'},
    {'source': 'lamar_moreland', 'target': 'msu_college_of_law', 'type': 'graduated_predecessor_dcl'},
    {'source': 'msu_law_nexus', 'target': 'msu_college_of_law', 'type': 'documents'},
    {'source': 'msu_law_nexus', 'target': 'cynthia_c_bullington', 'type': 'teaches_here'},
    {'source': 'msu_law_nexus', 'target': 'brian_banks', 'type': 'claims_fake_jd_here'},
    {'source': 'msu_law_nexus', 'target': 'cylenthia_miller', 'type': 'graduated_here'},
    {'source': 'msu_law_nexus', 'target': 'lamar_moreland', 'type': 'graduated_predecessor'},
    # Elrick connections
    {'source': 'ml_elrick', 'target': 'brian_banks', 'type': 'investigated'},
    {'source': 'ml_elrick', 'target': 'macdowell_preparatory_academy', 'type': 'exposed'},
    {'source': 'ml_elrick', 'target': 'save-detroit-jobs', 'type': 'replaced_by_dark_money'},
    {'source': 'save-detroit-jobs', 'target': 'ml_elrick', 'type': 'funded_campaign_against'},
    {'source': 'ml_elrick', 'target': 'msu_law_nexus', 'type': 'can_verify'},
    # Anderson science
    {'source': 'anderson_desilo', 'target': 'desilo_pattern', 'type': 'scientific_framework'},
    {'source': 'anderson_desilo', 'target': 'attorney_grievance_commission', 'type': 'lattice_site_absorbs'},
    {'source': 'anderson_desilo', 'target': 'judicial_tenure_commission', 'type': 'lattice_site_absorbs'},
    {'source': 'anderson_desilo', 'target': 'state_bar_upl', 'type': 'lattice_site_absorbs'},
    # Banks financial
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

print(f'Graph: {len(nodes)} nodes, {len(edges)} edges (+{added} new edges)')

# --- 2. Write science article ---
article = []
article.append('+++')
article.append('title = "Anderson Localization of Institutional Oversight \\u2014 A Measurement"')
article.append('description = "The de-silo referral loop measured as Anderson Localization. Seven agencies. Same evidence. Each absorbs the complaint. None transmit accountability. The physics is the same as disordered crystals: when every lattice site scatters, the electron cannot propagate. The system is fully localized. This is the measurement."')
article.append('date = 2026-10-18')
article.append('weight = 1')
article.append('')
article.append('[taxonomies]')
article.append('actors = ["Cynthia C. Bullington", "Michael V. Goetz", "Brian Banks", "Judge Cylenthia Miller", "Lamar Moreland"]')
article.append('entities = ["Attorney Grievance Commission", "Judicial Tenure Commission", "State Bar of Michigan", "Michigan Department of Education", "Michigan AG"]')
article.append('connections = ["Anderson localization", "institutional oversight", "de-silo", "referral loop", "scientific measurement"]')
article.append('')
article.append('[extra]')
article.append('keywords = "Anderson localization institutional oversight, de-silo referral loop measurement, institutional failure physics, Michigan oversight localization, AGC JTC State Bar referral loop science, accountability wave propagation, lattice site absorption institutional"')
article.append('og_title = "Anderson Localization of Institutional Oversight"')
article.append('og_description = "Seven agencies. Same evidence. Each absorbs the complaint. None transmit. The electron cannot propagate. Full localization measured."')
article.append('og_type = "article"')
article.append('twitter_card = "summary_large_image"')
article.append('+++')
article.append('')
article.append('# Anderson Localization of Institutional Oversight')
article.append('')
article.append('*A scientific measurement of the de-silo referral loop*')
article.append('')
article.append('---')
article.append('')
article.append('## The Physics')
article.append('')
article.append("In 1958, Philip W. Anderson showed that in a sufficiently disordered crystal, an electron cannot propagate. Instead of conducting through the lattice, the electron's wavefunction decays exponentially. The system becomes an insulator not because any single atom blocks it, but because the **collective disorder** prevents propagation.")
article.append('')
article.append('This is the same physics as Michigan\\'s institutional oversight system.')
article.append('')
article.append('---')
article.append('')
article.append('## The Lattice')
article.append('')
article.append('Each oversight agency is a lattice site. Each complaint is an electron. The question: does accountability propagate?')
article.append('')
article.append('| Lattice Site | Jurisdiction | Input | Output | Propagation |')
article.append('|-------------|-------------|-------|--------|-------------|')
article.append('| AGC | Attorney misconduct | Complaint (Oct 1) | "Too many attorneys on one form" | **Absorbed** |')
article.append('| AGC | Attorney misconduct | Complaint (Oct 9) | "Judges go to JTC" | **Absorbed** |')
article.append('| JTC | Judicial misconduct | Complaint (Sep 2026) | Confidential. DTW gun: "admonition" | **Absorbed** |')
article.append('| State Bar UPL | Unauthorized practice | Complaint (Aug 2026) | "Doesn\\'t meet standards." Closed. | **Absorbed** |')
article.append('| MDE | Credential oversight | Evidence (Oct 2026) | "Acknowledged." No action since. | **Absorbed** |')
article.append('| AG (Nessel) | RICO, nonprofit fraud, consumer protection | Full evidence package | **Silence.** Own AAG on the board. | **Absorbed** |')
article.append('| SBE | Education policy oversight | All 8 members notified | **Silence.** | **Absorbed** |')
article.append('| DPSCD | Charter authorization | Charter authorizer | **Silence.** | **Absorbed** |')
article.append('')
article.append('**Result: Full localization.** Every lattice site absorbed the complaint. Zero propagation. The system is an insulator.')
article.append('')
article.append('---')
article.append('')
article.append('## The Disorder')
article.append('')
article.append('In Anderson\\'s model, disorder comes from random potentials at each lattice site. In this system, the disorder is **structural**:')
article.append('')
article.append('| Site | Source of Disorder |')
article.append('|------|-------------------|')
article.append('| AGC | Goetz and Moreland: same law school, same AG office, 6 yr overlap |')
article.append('| AGC | Bullington teaches Professional Responsibility at MSU Law \\u2014 same school Banks claims fake JD from |')
article.append('| AGC | Hickey (Chairperson) is Of Counsel at Bodman \\u2014 peer firm to Dykema (enterprise political infrastructure) |')
article.append('| JTC | Investigations are confidential \\u2014 no public accountability until formal charges |')
article.append('| State Bar UPL | "Does not meet standards" \\u2014 for a man who told police "I am a lawyer" |')
article.append('| AG | Moreland (AAG) sits on PCA board as Vice Chair \\u2014 AG cannot investigate own employee\\'s enterprise |')
article.append('| MDE | Cleared Banks with "conditions" in 2022 \\u2014 conditions never enforced |')
article.append('')
article.append('**The disorder is not random.** It is structural. Each site\\'s disorder reinforces the adjacent sites\\' disorder. The localization is maximal.')
article.append('')
article.append('---')
article.append('')
article.append('## The MSU Law Nexus')
article.append('')
article.append('One institution sits at the center of every thread:')
article.append('')
article.append('| Person | Relationship to MSU College of Law |')
article.append('|--------|------------------------------------|')
article.append('| **Cynthia C. Bullington** | Adjunct professor \\u2014 teaches Professional Responsibility |')
article.append('| **Brian Banks** | Claims fake "J.D., MSU Law, 2010" on dissertation |')
article.append('| **Judge Cylenthia Miller** | Graduated with JD \\u2014 MSU Law alumna |')
article.append('| **Lamar Moreland** | Graduated predecessor school (Detroit College of Law, now MSU Law) |')
article.append('| **Michael V. Goetz** | Graduated predecessor school (Detroit College of Law, J.D. 1988) |')
article.append('| **Kimberly L. Uhuru** | MSU BA magna cum laude |')
article.append('')
article.append('**Bullington teaches the rules at the school that produced the judge, the fake lawyer, and the conflicted AAG.** Then she received complaints about all of them and returned them.')
article.append('')
article.append('This is not coincidence. This is the localization kernel \\u2014 the point where the disorder is densest.')
article.append('')
article.append('---')
article.append('')
article.append('## The Measurement')
article.append('')
article.append('Anderson localization is measured by the **localization length** \\u2014 how far the wavefunction extends before decaying. In this system:')
article.append('')
article.append('| Metric | Value |')
article.append('|--------|-------|')
article.append('| Agencies contacted | 8 |')
article.append('| Agencies that investigated | 0 |')
article.append('| Agencies that acknowledged | 3 (MDE, JTC, USPS OIG) |')
article.append('| Agencies that redirected | 2 (AGC \\u2192 JTC, State Bar \\u2192 "other remedies") |')
article.append('| Agencies silent | 3 (AG, SBE, DPSCD) |')
article.append('| Localization length | **0 lattice sites** |')
article.append('| System state | **Fully insulating** |')
article.append('')
article.append('The accountability electron entered the lattice. It was absorbed at the first site. It never reached a second. The system is a perfect insulator.')
article.append('')
article.append('---')
article.append('')
article.append('## The Prediction')
article.append('')
article.append('Anderson\\'s theory predicts that in 1D and 2D lattices, **any amount of disorder** causes full localization. The oversight system is effectively 1D \\u2014 a chain of agencies that each defer to the next:')
article.append('')
article.append('```')
article.append('AGC \\u2192 JTC \\u2192 State Bar \\u2192 AG \\u2192 MDE \\u2192 SBE \\u2192 DPSCD \\u2192 Courts')
article.append('```')
article.append('')
article.append('In a 1D chain with any disorder, the localization length is finite. The complaint CANNOT propagate to the end of the chain. It WILL be absorbed.')
article.append('')
article.append('**This is not a failure of any individual agency. It is a property of the system\\'s dimensionality and disorder.**')
article.append('')
article.append('The only way to break localization is to add dimensions \\u2014 cross-links between agencies that allow the complaint to route around absorbed sites. The membrane provides this dimensionality. The graph connects what the silos separate.')
article.append('')
article.append('---')
article.append('')
article.append('## For the Journalist')
article.append('')
article.append('M.L. Elrick broke the Banks story in the Detroit Free Press (August 2023). Then Dykema\\'s dark money entity (Save Detroit Jobs, renamed to "Detroit Leaders") funded the campaign that replaced him with Latisha Johnson \\u2014 who now sits on Banks\\' school board.')
article.append('')
article.append('Elrick knows the story. Elrick was removed FROM the story. But the story didn\\'t stop.')
article.append('')
article.append('Cynthia C. Bullington teaches Professional Responsibility at MSU College of Law. Her teaching schedule is public. She is at MSU on teaching days. She signed the letters that returned the complaints about the exact misconduct she teaches about.')
article.append('')
article.append('**The question is not whether she knows. The question is whether anyone will ask her.**')
article.append('')
article.append('---')
article.append('')
article.append('## Verify')
article.append('')
article.append('- Anderson Localization: [Nobel Prize 1977](https://www.nobelprize.org/prizes/physics/1977/anderson/facts/)')
article.append('- Prior Anderson analysis: [/analysis/anderson-localization/](/analysis/anderson-localization/)')
article.append('- Institutional Response Tracker: [/analysis/institutional-response/](/analysis/institutional-response/)')
article.append('- Circular Shield: [/analysis/the-circular-shield/](/analysis/the-circular-shield/)')
article.append('- Referral Loop: [/analysis/the-referral-loop/](/analysis/the-referral-loop/)')
article.append('- Elrick\\'s original article: [Detroit Free Press (Aug 2023)](https://www.freep.com/story/news/columnists/ml-elrick/2023/08/27/detroit-school-former-felon-as-principal/70669868007/)')
article.append('- MSU Law faculty: [law.msu.edu/faculty_staff/profile.php?prof=259](https://www.law.msu.edu/faculty_staff/profile.php?prof=259)')
article.append('')
article.append('---')
article.append('')
article.append('*In physics, localization is a measurement. In oversight, it is a choice. The measurement proves the choice. The choice harms 362 children. Every day. The lattice is documented. The disorder is structural. The electron cannot propagate. But the membrane can.*')

path = os.path.join('site', 'content', 'analysis', 'anderson-desilo.md')
with open(path, 'w', encoding='utf-8') as f:
    f.write('\n'.join(article))
print(f'Written: {path} ({len(article)} lines)')

# --- 3. Add braids ---
with open('site/static/braids.json', 'r', encoding='utf-8') as f:
    b = json.load(f)

b.extend([
    {
        'id': 'braid_msu_law_nexus',
        'type': 'structural',
        'label': 'MSU Law Nexus',
        'description': 'MSU College of Law: Bullington teaches Professional Responsibility, Banks claims fake JD, Miller graduated, Moreland graduated predecessor (DCL), Goetz graduated DCL. The school at the center of every thread.',
        'nodes': ['msu_law_nexus', 'msu_college_of_law', 'cynthia_c_bullington', 'brian_banks', 'cylenthia_miller', 'lamar_moreland', 'michael_v_goetz'],
        'edges': [
            {'source': 'cynthia_c_bullington', 'target': 'msu_college_of_law', 'type': 'teaches'},
            {'source': 'brian_banks', 'target': 'msu_college_of_law', 'type': 'claims_fake_jd'},
            {'source': 'cylenthia_miller', 'target': 'msu_college_of_law', 'type': 'graduated'}
        ]
    },
    {
        'id': 'braid_elrick_suppression',
        'type': 'institutional',
        'label': 'Elrick Suppression Loop',
        'description': 'M.L. Elrick broke the Banks story (Free Press 2023). Dykema formed Save Detroit Jobs, renamed it Detroit Leaders, funded Johnson against Elrick. Johnson won. Johnson now on PCA Board. The journalist who exposed Banks was replaced by a politician who now governs for Banks.',
        'nodes': ['ml_elrick', 'save-detroit-jobs', 'brian_banks', 'macdowell_preparatory_academy', 'dykema', 'purpose_charter_academy'],
        'edges': [
            {'source': 'ml_elrick', 'target': 'brian_banks', 'type': 'investigated'},
            {'source': 'save-detroit-jobs', 'target': 'ml_elrick', 'type': 'funded_campaign_against'}
        ]
    },
    {
        'id': 'braid_anderson_desilo',
        'type': 'scientific',
        'label': 'Anderson Localization of Institutional Oversight',
        'description': 'Eight agencies, same evidence, full absorption, zero propagation. 1D chain with structural disorder. Localization length = 0. The system is a perfect insulator. The membrane adds dimensions.',
        'nodes': ['anderson_desilo', 'attorney_grievance_commission', 'judicial_tenure_commission', 'state_bar_upl', 'michigan_department_of_education', 'michigan_ag'],
        'edges': [
            {'source': 'anderson_desilo', 'target': 'desilo_pattern', 'type': 'scientific_framework'}
        ]
    }
])

with open('site/static/braids.json', 'w', encoding='utf-8') as f:
    json.dump(b, f)

print(f'Braids: {len(b)}')
print('\nDone.')
