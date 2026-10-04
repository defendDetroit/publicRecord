// ╔══════════════════════════════════════════════════════════════════════╗
// ║  DETROIT NETWORK DATA — single source of truth                     ║
// ║                                                                    ║
// ║  All network graph, geographic extraction map, and matrix           ║
// ║  visualizations derive from this file.                             ║
// ║                                                                    ║
// ║  To add a new actor/entity/connection:                             ║
// ║    1. Add node to NODES                                            ║
// ║    2. Add edge(s) to EDGES                                         ║
// ║    3. Optionally add geo position to GEO_POSITIONS                 ║
// ║    4. Optionally add to OWNERSHIP_GROUPS or OVERSIGHT_CYCLES       ║
// ║    5. Both visualizations update automatically                     ║
// ║                                                                    ║
// ║  Zero dependencies. No tracking. Pure data.                        ║
// ╚══════════════════════════════════════════════════════════════════════╝

(function() {
  'use strict';

  // ═══════════════════════════════════════════════════════════════════
  // NODES — every actor, entity, school, court, and institution
  // ═══════════════════════════════════════════════════════════════════
  //
  // Schema:
  //   id:      unique string key (used in edges, ownership, cycles, geo)
  //   label:   display name
  //   tier:    0 = entity, 1 = principal, 2 = enabler, 3 = political, 4 = institutional, 5 = lineage
  //   type:    actor | judge | political | bmf | school | entity | institutional
  //   detail:  short evidence summary
  //   url:     link to detailed page (null if none)
  //   nexus:   array of nexus types this node participates in
  //            (education, political, police, legislative)

  var NODES = [
    // ── Tier 1: Enterprise Principals ──
    { id: 'banks', label: 'Brian R. Banks', tier: 1, type: 'actor',
      detail: '9 convictions (6 felony, 3 misd.)', url: '/network/actors/brian-banks/',
      nexus: ['education', 'political', 'police', 'legislative'] },
    { id: 'holland', label: 'Joseph Holland Jr.', tier: 1, type: 'actor',
      detail: 'Drug offender, MDOC #443789', url: '/network/actors/joseph-holland/',
      nexus: ['education', 'political'] },

    // ── Tier 2: Judicial Cover ──
    { id: 'miller', label: 'Judge C. Miller', tier: 2, type: 'judge',
      detail: 'Board Chair, Anchor Rock Foundation', url: '/network/judges/cylenthia-miller/',
      nexus: ['education'] },
    { id: 'yancey', label: 'Judge T. Yancey', tier: 2, type: 'judge',
      detail: 'Campaign paid $383.82 to Banks Strategy (sole expenditure)', url: '/network/judges/tenisha-yancey/',
      nexus: ['education', 'political'] },
    { id: 'sabree', label: 'Judge A. Sabree', tier: 2, type: 'judge',
      detail: 'MSU Law classmate (2010)', url: '/network/judges/aliyah-sabree/',
      nexus: ['education'] },
    { id: 'perkins_d', label: 'Judge D. Perkins', tier: 2, type: 'judge',
      detail: 'Family donations, Probate overlap', url: '/network/judges/david-perkins/',
      nexus: ['education'] },

    // ── Tier 3: Political ──
    { id: 'gay_dagnogo', label: 'S. Gay-Dagnogo', tier: 3, type: 'political',
      detail: 'DPSCD Board, succeeded Banks in HD-1', url: '/network/political/sherry-gay-dagnogo/',
      nexus: ['political', 'education'] },

    // ── Tier 5: BMF ──
    { id: 'od_banks', label: 'OD Banks', tier: 5, type: 'bmf',
      detail: 'BMF Defendant #22, Banks\' father', url: null,
      nexus: [] },
    { id: 'welch', label: 'Tonesa Welch', tier: 5, type: 'bmf',
      detail: 'BMF figure, Banks\' aunt', url: null,
      nexus: [] },

    // ── FOIA-revealed actors (Layer 2) ──
    { id: 'wells_stallworth', label: 'N. Wells-Stallworth', tier: 3, type: 'political',
      detail: 'Board President since 2014. Received MDE investigation letter Feb 2022. [FOIA]', url: null,
      nexus: ['education', 'legislative'] },
    { id: 'schmiedeknecht', label: 'K. Schmiedeknecht', tier: 4, type: 'institutional',
      detail: 'MDE Analyst — sent investigation letter, then cleared. [FOIA]', url: '/actors/katie-schmiedeknecht/',
      nexus: ['education'] },
    { id: 'mde', label: 'MI Dept of Education', tier: 4, type: 'institutional',
      detail: 'Investigated Banks Feb 2022 for no credential. Cleared. [FOIA]', url: null,
      nexus: ['education'] },
    { id: 'alan_young', label: 'Alan C. Young CPA', tier: 4, type: 'institutional',
      detail: 'Auditor FY2017-2025, 9 consecutive years. No material findings. [FOIA]', url: null,
      nexus: ['education'] },

    // ── Nexus 2: Political Capture ──
    { id: 'sheffield', label: 'Mayor Sheffield', tier: 2, type: 'political',
      detail: 'City Council President → Mayor. OIG probe re: Bettison call.', url: null,
      nexus: ['political', 'police'] },
    { id: 'evans', label: 'W. Evans', tier: 3, type: 'political',
      detail: 'Wayne County Executive. Endorsed Banks.', url: null,
      nexus: ['political'] },
    { id: 'sabree_e', label: 'E. Sabree', tier: 3, type: 'political',
      detail: 'Wayne County Treasurer. Endorsed Banks.', url: '/network/political/eric-sabree/',
      nexus: ['political'] },
    { id: 'inner_link', label: 'Inner Link Graphics', tier: 0, type: 'entity',
      detail: '$98,291 from Banks-connected committees', url: null,
      nexus: ['political'] },
    { id: 'mccastle', label: 'G. McCastle', tier: 4, type: 'political',
      detail: '$20,410 across 5 committees. Bridges Banks to Gay-Dagnogo.', url: null,
      nexus: ['political'] },

    // ── Nexus 3: Police Weaponization ──
    { id: 'bettison', label: 'Chief Bettison', tier: 2, type: 'actor',
      detail: 'DPD Chief + DPSA Board Secretary. OIG investigation Sep 2026.', url: null,
      nexus: ['police', 'education'] },
    { id: 'dpsa', label: 'Detroit Public Safety Academy', tier: 0, type: 'school',
      detail: 'Charter school — police chief on the board.', url: null,
      nexus: ['police', 'education'] },

    // ── Nexus 3b: Operation Northern Hook ──
    { id: 'fiore', label: 'G. Fiore', tier: 2, type: 'actor',
      detail: 'Convicted bribery. FBI wiretap: "bid-rigging with Banks"', url: null,
      nexus: ['police', 'political'] },
    { id: 'spivey', label: 'A. Spivey', tier: 3, type: 'political',
      detail: 'Convicted (24 mo). Op Northern Hook. Warned targets.', url: null,
      nexus: ['police', 'political'] },
    { id: 'perkins_t', label: 'T. Perkins', tier: 3, type: 'actor',
      detail: 'Banks attorney. Repped 2 Op Northern Hook targets. Ran for mayor.', url: null,
      nexus: ['police', 'political'] },

    // ── Nexus 4: Legislative Pipeline ──
    { id: 'stallworth_t', label: 'T. Stallworth III', tier: 3, type: 'political',
      detail: 'Former State Rep. Nicole\'s husband. Defended Banks at felony rally.', url: null,
      nexus: ['legislative'] },
    { id: 'moreland', label: 'L. Moreland', tier: 2, type: 'judge',
      detail: 'AAG → PCA Board Director + Banks litigation attorney. MRPC 1.7 conflict.', url: null,
      nexus: ['education', 'legislative'] },
    { id: 'johnson_l', label: 'L. Johnson', tier: 3, type: 'political',
      detail: 'City Council D2. PCA Board Secretary. Campaign funded by SDJ/Detroit Leaders.', url: null,
      nexus: ['political', 'education'] },

    // ── LARA-confirmed actors (Corporate Network Analysis) ──
    { id: 'carol_banks', label: 'Carol Banks', tier: 3, type: 'actor',
      detail: 'Brian\'s sister. Controls Original Eastside Slate. Former CoS to Benson. FBI target.', url: null,
      nexus: ['political'] },
    { id: 'leach', label: 'W. Spencer Leach', tier: 3, type: 'actor',
      detail: '13 political entities. Batch-filed 3 on same day (consecutive LARA IDs). Machine builder.', url: null,
      nexus: ['political'] },
    { id: 'ross', label: 'Carlton Ross', tier: 2, type: 'actor',
      detail: 'Right Turn Project Treasurer + connected to Ross Catering ($35K+ from PACs). Self-dealing loop.', url: null,
      nexus: ['political'] },
    { id: 'gordon', label: 'Jason Gordon', tier: 2, type: 'actor',
      detail: 'Attorney. Custom Promotions + Deen Legal. FBI/IRS/DoL investigated (UAW bribery). 20+ entities.', url: null,
      nexus: ['political'] },
    { id: 'larry_thomas', label: 'Larry Thomas Jr', tier: 2, type: 'actor',
      detail: 'Inner Link Graphics owner. Also runs obituaries4less.com. $98K from 5 committees.', url: null,
      nexus: ['political'] },
    { id: 'daniels', label: 'Kenneth Daniels', tier: 3, type: 'actor',
      detail: 'SDJ/Detroit Leaders President. Agent on 15+ entities (real estate, construction).', url: null,
      nexus: ['political'] },
    { id: 'crump_gibson', label: 'Crump-Gibson', tier: 2, type: 'judge',
      detail: 'Great Lakes Legal Group. MI Attorney Discipline Board panelist. MSU. Possible Crump family.', url: null,
      nexus: ['education'] },
    { id: 'v_hall', label: 'V. Hall', tier: 2, type: 'judge',
      detail: 'Crump Hall of Justice Law Firm. Filed PPO against journalist. Maiden name = Crump.', url: null,
      nexus: ['education'] },
    { id: 'hutchings', label: 'D. Hutchings', tier: 3, type: 'actor',
      detail: 'PCA Board Treasurer. DB Strategies + DB Athletics (Ypsilanti). Not from Detroit.', url: null,
      nexus: ['education'] },
    { id: 'clora', label: 'M. Clora', tier: 3, type: 'actor',
      detail: 'PCA Board Director. Former American Motor Coach Inc (dissolved).', url: null,
      nexus: ['education'] },

    // ── Entities ──
    { id: 'pca', label: 'Purpose Charter Academy', tier: 0, type: 'school',
      detail: 'K-8, DPSCD authorized. LARA 900072324.', url: '/network/entities/purpose-charter-academy/',
      nexus: ['education'] },
    { id: 'macdowell', label: 'MacDowell Prep', tier: 0, type: 'school',
      detail: '$4.9M revenue, 3% math. [FOIA: 9yr audits]', url: '/network/entities/macdowell-prep/',
      nexus: ['education'] },
    { id: 'purpose_group', label: 'Purpose Group LLC', tier: 0, type: 'entity',
      detail: 'CMO — takes 72.67% of revenue. LARA 803295082.', url: '/network/entities/purpose-group-llc/',
      nexus: ['education'] },
    { id: 'purpose_foundation', label: 'Purpose Foundation', tier: 0, type: 'entity',
      detail: '501(c)(3), 2 felons in all positions. LARA 803294855.', url: '/network/entities/purpose-foundation/',
      nexus: ['education'] },
    { id: 'banks_strategy', label: 'Banks Strategy LLC', tier: 0, type: 'entity',
      detail: 'Receives judge campaign payments. LARA 802070120.', url: '/network/entities/banks-strategy-llc/',
      nexus: ['education', 'political'] },
    { id: 'pacs', label: 'PACs', tier: 0, type: 'entity',
      detail: '$14.5K+ fines, felon treasurer', url: '/network/entities/political-action-committees/',
      nexus: ['political'] },

    // ── LARA-revealed entities ──
    { id: 'sdj', label: 'Save Detroit Jobs', tier: 0, type: 'entity',
      detail: '3 names: SDJ (2016) + Impact Detroit (2018) + Detroit Leaders (2021). LARA 802002459.', url: null,
      nexus: ['political'] },
    { id: 'dykema', label: 'Dykema Gossett', tier: 4, type: 'institutional',
      detail: 'MI\'s largest law firm. Formed SDJ. compliance@dykema.com. 201 Townsend, Lansing.', url: null,
      nexus: ['political'] },
    { id: 'right_turn', label: 'Right Turn Project', tier: 0, type: 'entity',
      detail: 'Nonprofit. Dissolved 12/2021 (annual report failure). Holland = Pres. LARA 800936257.', url: null,
      nexus: ['political'] },
    { id: 'ross_catering', label: 'Ross Catering', tier: 0, type: 'entity',
      detail: '$35K+ from Banks campaigns. Ross = Right Turn treasurer + catering vendor. Self-dealing.', url: null,
      nexus: ['political'] },
    { id: 'serenity', label: 'Serenity Guardianship', tier: 0, type: 'entity',
      detail: 'For-profit guardianship. Banks sole officer. Never barred. UPL concern. LARA 802290962.', url: null,
      nexus: ['education'] },
    { id: 'custom_promo', label: 'Custom Promotions', tier: 0, type: 'entity',
      detail: 'Dissolve-and-reform (Inc → LLC, 3 months). Gordon = attorney under FBI investigation.', url: null,
      nexus: ['political'] },
    { id: 'eastside_slate', label: 'Original Eastside Slate', tier: 0, type: 'entity',
      detail: '4th incarnation. Carol Banks = agent. Endorsement machine. LARA 802434498.', url: null,
      nexus: ['political'] },
    { id: 'great_lakes_legal', label: 'Great Lakes Legal', tier: 0, type: 'entity',
      detail: 'Crump-Gibson\'s firm. LARA 802112914. Discipline Board panelist = Banks attorney.', url: null,
      nexus: ['education'] },
    { id: 'anchor_rock', label: 'Anchor Rock Services', tier: 0, type: 'entity',
      detail: 'Construction + upfitting (Holland, MI). 3 assumed names. LARA 800770907.', url: null,
      nexus: [] },
  ];


  // ═══════════════════════════════════════════════════════════════════
  // EDGES — every connection, tagged with flow type
  // ═══════════════════════════════════════════════════════════════════
  //
  // Schema:
  //   source:  node ID (origin of directed edge)
  //   target:  node ID (destination)
  //   type:    relationship category (controls, financial, associate, money, judicial, political, family, institutional)
  //   label:   evidence-based description
  //   flow:    what is exchanged (money | power | influence | position)
  //   amount:  dollar value if applicable (null if not monetary)

  var EDGES = [
    // ── Banks controls everything ──
    { source: 'banks', target: 'pca', type: 'controls', label: 'superintendent', flow: 'power', amount: null },
    { source: 'banks', target: 'macdowell', type: 'controls', label: 'superintendent', flow: 'power', amount: null },
    { source: 'banks', target: 'purpose_group', type: 'controls', label: 'sole member', flow: 'power', amount: null },
    { source: 'banks', target: 'purpose_foundation', type: 'controls', label: 'president + director', flow: 'power', amount: null },
    { source: 'banks', target: 'banks_strategy', type: 'controls', label: 'agent', flow: 'power', amount: null },

    // ── Holland financial roles ──
    { source: 'holland', target: 'purpose_foundation', type: 'financial', label: 'secretary + treasurer', flow: 'position', amount: null },
    { source: 'holland', target: 'pacs', type: 'financial', label: 'PAC treasurer', flow: 'position', amount: null },

    // ── Co-residence ──
    { source: 'banks', target: 'holland', type: 'associate', label: 'co-resident, all entities', flow: 'influence', amount: null },

    // ── Money flow ──
    { source: 'pca', target: 'purpose_group', type: 'money', label: 'management fee', flow: 'money', amount: null },
    { source: 'macdowell', target: 'purpose_group', type: 'money', label: '72.67% ($4.28M)', flow: 'money', amount: 4280000 },

    // ── Judicial connections ──
    { source: 'miller', target: 'banks', type: 'judicial', label: 'Board Chair → legal cover', flow: 'influence', amount: null },
    { source: 'yancey', target: 'banks_strategy', type: 'judicial', label: '$383.82 payment', flow: 'money', amount: 383 },
    { source: 'sabree', target: 'banks', type: 'judicial', label: 'MSU Law 2010', flow: 'influence', amount: null },
    { source: 'perkins_d', target: 'banks', type: 'judicial', label: 'family donations', flow: 'money', amount: null },

    // ── Political ──
    { source: 'gay_dagnogo', target: 'pca', type: 'political', label: 'DPSCD authorizer', flow: 'power', amount: null },
    { source: 'gay_dagnogo', target: 'banks', type: 'political', label: 'CBC honoree, HD-1 successor', flow: 'influence', amount: null },

    // ── BMF lineage ──
    { source: 'od_banks', target: 'banks', type: 'family', label: 'father', flow: 'influence', amount: null },
    { source: 'welch', target: 'od_banks', type: 'family', label: 'BMF network', flow: 'influence', amount: null },

    // ── FOIA-revealed connections ──
    { source: 'wells_stallworth', target: 'macdowell', type: 'controls', label: 'Board President ≥2014', flow: 'position', amount: null },
    { source: 'wells_stallworth', target: 'banks', type: 'associate', label: 'received investigation, protected', flow: 'influence', amount: null },
    { source: 'mde', target: 'banks', type: 'institutional', label: 'HOLD on permit #590606', flow: 'power', amount: null },
    { source: 'mde', target: 'macdowell', type: 'institutional', label: 'investigated Feb 2022, cleared', flow: 'power', amount: null },
    { source: 'schmiedeknecht', target: 'mde', type: 'institutional', label: 'analyst, OEE', flow: 'position', amount: null },
    { source: 'alan_young', target: 'macdowell', type: 'financial', label: 'auditor 9yr (FY17-25)', flow: 'influence', amount: null },
    { source: 'macdowell', target: 'banks', type: 'money', label: 'School Admin $667K', flow: 'money', amount: 667000 },

    // ── Nexus 2: Political Capture ──
    { source: 'sheffield', target: 'bettison', type: 'political', label: 'appointed chief', flow: 'power', amount: null },
    { source: 'sheffield', target: 'banks', type: 'political', label: 'endorsed', flow: 'influence', amount: null },
    { source: 'evans', target: 'banks', type: 'political', label: 'endorsed', flow: 'influence', amount: null },
    { source: 'sabree_e', target: 'banks', type: 'political', label: 'endorsed', flow: 'influence', amount: null },
    { source: 'inner_link', target: 'banks', type: 'money', label: '$39K Banks for Senate', flow: 'money', amount: 39000 },
    { source: 'inner_link', target: 'yancey', type: 'money', label: '$8K Yancey campaign', flow: 'money', amount: 8000 },
    { source: 'mccastle', target: 'banks', type: 'money', label: '$9,450 Banks for Senate', flow: 'money', amount: 9450 },
    { source: 'mccastle', target: 'gay_dagnogo', type: 'money', label: '$1K Strong Women PAC', flow: 'money', amount: 1000 },
    { source: 'johnson_l', target: 'pca', type: 'controls', label: 'Board Secretary', flow: 'position', amount: null },
    { source: 'inner_link', target: 'johnson_l', type: 'money', label: '$850 campaign', flow: 'money', amount: 850 },

    // ── Nexus 3: Police Weaponization ──
    { source: 'bettison', target: 'dpsa', type: 'controls', label: 'Board Secretary', flow: 'position', amount: null },
    { source: 'bettison', target: 'sheffield', type: 'political', label: 'OIG probe — phone call', flow: 'power', amount: null },
    { source: 'fiore', target: 'banks', type: 'associate', label: 'FBI wiretap: "bid-rigging"', flow: 'money', amount: null },
    { source: 'spivey', target: 'fiore', type: 'associate', label: 'Op Northern Hook', flow: 'influence', amount: null },
    { source: 'perkins_t', target: 'banks', type: 'associate', label: 'defense attorney', flow: 'influence', amount: null },
    { source: 'perkins_t', target: 'fiore', type: 'associate', label: 'donated $500', flow: 'money', amount: 500 },
    { source: 'gay_dagnogo', target: 'perkins_t', type: 'money', label: '$750 mayor campaign', flow: 'money', amount: 750 },

    // ── Nexus 4: Legislative Pipeline ──
    { source: 'stallworth_t', target: 'wells_stallworth', type: 'family', label: 'married', flow: 'influence', amount: null },
    { source: 'stallworth_t', target: 'banks', type: 'political', label: 'defended at rally, $1,250', flow: 'influence', amount: null },
    { source: 'moreland', target: 'pca', type: 'controls', label: 'Board Director + litigation attorney', flow: 'position', amount: null },
    { source: 'moreland', target: 'banks', type: 'judicial', label: 'AAG argued against cert → became his attorney + board member', flow: 'influence', amount: null },
    { source: 'miller', target: 'pca', type: 'controls', label: 'Board Chair', flow: 'position', amount: null },

    // ── LARA-revealed: PCA Board (full composition) ──
    { source: 'hutchings', target: 'pca', type: 'controls', label: 'Board Treasurer (Ypsilanti)', flow: 'position', amount: null },
    { source: 'clora', target: 'pca', type: 'controls', label: 'Board Director', flow: 'position', amount: null },

    // ── LARA-revealed: Dark money vehicle (SDJ / Detroit Leaders) ──
    { source: 'dykema', target: 'sdj', type: 'controls', label: 'formed entity (compliance@dykema.com)', flow: 'power', amount: null },
    { source: 'daniels', target: 'sdj', type: 'controls', label: 'President + Director', flow: 'position', amount: null },
    { source: 'sdj', target: 'johnson_l', type: 'money', label: 'funded 2021 campaign vs. Elrick', flow: 'money', amount: null },
    { source: 'johnson_l', target: 'pca', type: 'controls', label: 'PCA Board Secretary (payoff)', flow: 'position', amount: null },

    // ── LARA-revealed: Right Turn Project (dissolved charity loop) ──
    { source: 'holland', target: 'right_turn', type: 'controls', label: 'President + Director', flow: 'position', amount: null },
    { source: 'ross', target: 'right_turn', type: 'controls', label: 'Treasurer + Director', flow: 'position', amount: null },
    { source: 'banks', target: 'right_turn', type: 'controls', label: 'controlled via email (BBesq06@aol.com)', flow: 'power', amount: null },
    { source: 'pacs', target: 'right_turn', type: 'money', label: 'PAC transfers', flow: 'money', amount: null },
    { source: 'ross', target: 'ross_catering', type: 'associate', label: 'treasurer + vendor (self-dealing)', flow: 'money', amount: null },
    { source: 'pacs', target: 'ross_catering', type: 'money', label: '$35K+ campaign payments', flow: 'money', amount: 35000 },

    // ── LARA-revealed: Inner Link + Larry Thomas ──
    { source: 'larry_thomas', target: 'inner_link', type: 'controls', label: 'owner + agent', flow: 'power', amount: null },

    // ── LARA-revealed: Custom Promotions (dissolve-and-reform) ──
    { source: 'gordon', target: 'custom_promo', type: 'controls', label: 'dissolve-and-reform (Inc→LLC, 3 mo)', flow: 'power', amount: null },
    { source: 'custom_promo', target: 'johnson_l', type: 'money', label: 'campaign payments', flow: 'money', amount: null },
    { source: 'gordon', target: 'banks', type: 'associate', label: 'UAW bribery network ($3M+)', flow: 'influence', amount: null },

    // ── LARA-revealed: Eastside Slate endorsement machine ──
    { source: 'carol_banks', target: 'eastside_slate', type: 'controls', label: 'agent — 4th incarnation', flow: 'power', amount: null },
    { source: 'carol_banks', target: 'banks', type: 'family', label: 'sister', flow: 'influence', amount: null },
    { source: 'leach', target: 'eastside_slate', type: 'associate', label: '2nd incarnation agent. 13 political entities.', flow: 'influence', amount: null },
    { source: 'eastside_slate', target: 'banks', type: 'political', label: 'endorsement pipeline', flow: 'influence', amount: null },

    // ── LARA-revealed: Legal representation family ──
    { source: 'crump_gibson', target: 'great_lakes_legal', type: 'controls', label: 'agent + member', flow: 'power', amount: null },
    { source: 'crump_gibson', target: 'banks', type: 'judicial', label: 'represents Banks (Discipline Board panelist)', flow: 'influence', amount: null },
    { source: 'v_hall', target: 'banks', type: 'judicial', label: 'filed PPO against journalist', flow: 'influence', amount: null },
    { source: 'v_hall', target: 'crump_gibson', type: 'associate', label: 'shared surname Crump — MSU — family?', flow: 'influence', amount: null },

    // ── LARA-revealed: Serenity Guardianship (UPL) ──
    { source: 'banks', target: 'serenity', type: 'controls', label: 'sole officer (all 4 roles). Never barred.', flow: 'power', amount: null },

    // ── LARA-revealed: Anchor Rock (construction, Holland MI) ──
    { source: 'banks', target: 'anchor_rock', type: 'controls', label: 'agent. 3 assumed names.', flow: 'power', amount: null },
  ];


  // ═══════════════════════════════════════════════════════════════════
  // OWNERSHIP GROUPS — hulls around entities controlled by same person
  // ═══════════════════════════════════════════════════════════════════

  var OWNERSHIP_GROUPS = [
    {
      id: 'banks_empire',
      controller: 'banks',
      label: 'Banks controls all (12 LARA entities)',
      members: ['banks', 'pca', 'macdowell', 'purpose_group', 'purpose_foundation', 'banks_strategy', 'holland', 'serenity', 'anchor_rock'],
      color: 'rgba(192,57,43,0.12)',
      stroke: 'rgba(192,57,43,0.5)',
      note: '1 person, 12 LARA entities, 1 co-resident felon. Grosse Pointe Woods, Holland, Zeeland, Clarkston, Waterford.'
    },
    {
      id: 'banks_pacs',
      controller: 'holland',
      label: 'Holland manages finances',
      members: ['holland', 'pacs', 'purpose_foundation', 'right_turn'],
      color: 'rgba(243,156,18,0.10)',
      stroke: 'rgba(243,156,18,0.4)',
      note: 'PAC treasurer + Foundation secretary + Right Turn president = same convicted drug dealer'
    },
    {
      id: 'pca_board',
      controller: 'banks',
      label: 'PCA Board (LARA-confirmed)',
      members: ['pca', 'miller', 'moreland', 'johnson_l', 'hutchings', 'clora'],
      color: 'rgba(39,174,96,0.10)',
      stroke: 'rgba(39,174,96,0.4)',
      note: 'Banks = agent (not officer). Moreland = litigation attorney + director (MRPC 1.7). Johnson = SDJ-funded.'
    },
    {
      id: 'macdowell_board',
      controller: 'banks',
      label: 'MacDowell Board (Banks-selected)',
      members: ['macdowell', 'wells_stallworth', 'yancey'],
      color: 'rgba(142,68,173,0.10)',
      stroke: 'rgba(142,68,173,0.4)',
      note: 'Board President + Judge = hand-picked by superintendent'
    },
    {
      id: 'dark_money_vehicle',
      controller: 'dykema',
      label: 'Dark Money Vehicle (3 names, 1 entity)',
      members: ['sdj', 'dykema', 'daniels', 'johnson_l'],
      color: 'rgba(231,76,60,0.10)',
      stroke: 'rgba(231,76,60,0.4)',
      note: 'Dykema Gossett formed SDJ. 3 assumed names. Daniels = president. Funded Johnson vs. Elrick.'
    },
    {
      id: 'endorsement_machine',
      controller: 'carol_banks',
      label: 'Endorsement Machine (4 incarnations)',
      members: ['eastside_slate', 'carol_banks', 'leach'],
      color: 'rgba(41,128,185,0.10)',
      stroke: 'rgba(41,128,185,0.4)',
      note: 'Eastside Slate filed 4 times. Leach batch-filed 3 entities same day. Carol Banks = current agent.'
    },
    {
      id: 'self_dealing_loop',
      controller: 'ross',
      label: 'Right Turn Self-Dealing',
      members: ['right_turn', 'ross', 'ross_catering'],
      color: 'rgba(211,84,0,0.10)',
      stroke: 'rgba(211,84,0,0.4)',
      note: 'Ross = charity treasurer + connected to vendor paid $35K by PACs. BBesq06@aol.com = Banks\'s email.'
    }
  ];


  // ═══════════════════════════════════════════════════════════════════
  // OVERSIGHT CYCLES — directed loops where "oversight" is circular
  // ═══════════════════════════════════════════════════════════════════

  var OVERSIGHT_CYCLES = [
    {
      id: 'gay_dagnogo_cycle',
      label: 'Authorization feedback loop',
      path: ['gay_dagnogo', 'pca', 'banks', 'gay_dagnogo'],
      note: 'Gay-Dagnogo authorized PCA → Banks benefits → Banks political support → Gay-Dagnogo gets city appointment'
    },
    {
      id: 'yancey_cycle',
      label: 'Judicial campaign cycle',
      path: ['yancey', 'banks_strategy', 'banks', 'yancey'],
      note: 'Yancey paid Banks Strategy $383 → Banks ran her campaign → Yancey became judge → sits on Banks school board'
    },
    {
      id: 'moreland_cycle',
      label: 'Regulator capture cycle',
      path: ['moreland', 'pca', 'banks', 'moreland'],
      note: 'AAG Moreland argued AGAINST Banks cert → now Board Vice Chair of Banks\'s school'
    },
    {
      id: 'wells_stallworth_cycle',
      label: 'Board oversight cycle',
      path: ['wells_stallworth', 'macdowell', 'banks', 'stallworth_t', 'wells_stallworth'],
      note: 'Nicole "oversees" MacDowell → Banks runs it → Thomas defended Banks at rally → Thomas married to Nicole'
    },
    {
      id: 'bettison_cycle',
      label: 'Police-education bridge',
      path: ['bettison', 'dpsa', 'sheffield', 'bettison'],
      note: 'Chief Bettison on DPSA board → Sheffield appointed Bettison → Bettison protects Sheffield (OIG probe)'
    },
    {
      id: 'mde_cycle',
      label: 'Regulator capture (state)',
      path: ['mde', 'macdowell', 'banks', 'wells_stallworth', 'mde'],
      note: 'MDE investigated Banks → cleared → Wells-Stallworth (who protects Banks) received the investigation letter'
    },
    {
      id: 'sdj_suppression_cycle',
      label: 'Dark money suppression loop',
      path: ['dykema', 'sdj', 'johnson_l', 'pca', 'banks'],
      note: 'Dykema formed SDJ → SDJ funded Johnson vs Elrick (journalist) → Johnson won → joined PCA board → Banks benefits'
    },
    {
      id: 'right_turn_cycle',
      label: 'Right Turn self-dealing',
      path: ['pacs', 'right_turn', 'ross', 'ross_catering', 'pacs'],
      note: 'PAC transfers to Right Turn (Ross = treasurer) → Ross connected to Ross Catering → Catering paid $35K+ by PACs'
    },
    {
      id: 'moreland_dual_role',
      label: 'Attorney-director conflict',
      path: ['moreland', 'pca', 'banks', 'moreland'],
      note: 'Moreland is Banks\'s litigation attorney AND PCA board director simultaneously. MRPC 1.7 conflict.'
    }
  ];


  // ═══════════════════════════════════════════════════════════════════
  // GEOGRAPHIC POSITIONS — for extraction map overlay
  // ═══════════════════════════════════════════════════════════════════
  //
  // These map network node IDs to conceptual geographic positions.
  // px/py are proportional (0-1) coordinates in the SVG viewBox.
  // Nodes without geo positions won't appear on the extraction map.
  // Some geo entries are aggregates (city_hall, wayne_county) that
  // don't map 1:1 to network nodes — they carry a `geoOnly` flag.

  // ── Geo layout ──
  // LEFT: Funding sources | CENTER: Detroit schools | RIGHT-TOP: Extraction
  // RIGHT: Political/judicial | FAR-RIGHT: Grosse Pointe Woods (actual destination)

  var GEO_POSITIONS = {
    // Schools — center column (Detroit community)
    macdowell:        { px: 0.38, py: 0.38 },
    pca:              { px: 0.38, py: 0.55 },
    dpsa:             { px: 0.38, py: 0.24 },

    // Extraction — right of schools, heading out of Detroit
    purpose_group:    { px: 0.55, py: 0.32 },
    purpose_foundation: { px: 0.55, py: 0.50 },
    banks_strategy:   { px: 0.55, py: 0.65 },
    pacs:             { px: 0.55, py: 0.78 },

    // LARA entities — Detroit side
    inner_link:       { px: 0.20, py: 0.82 },
    sdj:              { px: 0.20, py: 0.65 },
    right_turn:       { px: 0.20, py: 0.50 },
    ross_catering:    { px: 0.20, py: 0.38 },
    custom_promo:     { px: 0.20, py: 0.25 },
    eastside_slate:   { px: 0.20, py: 0.12 },

    // LARA entities — extraction side
    serenity:         { px: 0.68, py: 0.45 },
    anchor_rock:      { px: 0.68, py: 0.60 },
    great_lakes_legal: { px: 0.68, py: 0.75 },
  };

  var GEO_AGGREGATES = [
    // ── Funding sources (left column) ──
    { id: 'mi_state_aid', label: 'MI State Aid', type: 'source',
      px: 0.08, py: 0.30,
      detail: 'Per-pupil funding from Michigan taxpayers',
      aggregates: [] },
    { id: 'dpscd', label: 'DPSCD', type: 'source',
      px: 0.08, py: 0.55,
      detail: 'Authorizer — receives 3% fee (~$147K/yr)',
      aggregates: [] },
    { id: 'private_donors', label: 'Private Donors', type: 'source',
      px: 0.08, py: 0.70,
      detail: 'Tax-deductible contributions to Purpose Foundation',
      aggregates: [] },
    { id: 'pscu', label: 'PSCU Credit Union', type: 'source',
      px: 0.08, py: 0.82,
      detail: 'Shared lender — $549K+ enterprise mortgages',
      aggregates: [] },
    { id: 'cbc_events', label: 'CBC Events', type: 'source',
      px: 0.08, py: 0.15,
      detail: 'Congressional Black Caucus Week — $50K-$150K est.',
      aggregates: [] },

    // ── Destination: Grosse Pointe Woods (far right — OUTSIDE Detroit) ──
    { id: 'gpw', label: 'Grosse Pointe Woods', type: 'destination',
      px: 0.88, py: 0.30,
      detail: '1968 Severn Rd — Purpose Group LLC registered address. Banks/Holland residence.',
      aggregates: ['banks'] },

    // ── Political/Judicial (lower right) ──
    { id: 'city_hall', label: 'City Hall', type: 'political',
      px: 0.78, py: 0.60,
      detail: 'Mayor Sheffield · Ombudsman Gay-Dagnogo',
      aggregates: ['sheffield', 'gay_dagnogo'] },
    { id: 'wayne_county', label: 'Wayne County', type: 'political',
      px: 0.78, py: 0.75,
      detail: 'Exec Evans · Treasurer Sabree (foreclosure pipeline)',
      aggregates: ['evans', 'sabree_e'] },
    { id: '3rd_circuit', label: '3rd Circuit', type: 'court',
      px: 0.78, py: 0.42,
      detail: 'Judge Miller (PCA Board Chair), Judge A. Sabree',
      aggregates: ['miller', 'sabree'] },
    { id: '36th_district', label: '36th District', type: 'court',
      px: 0.88, py: 0.55,
      detail: 'Judge Yancey (MacDowell Board Chair)',
      aggregates: ['yancey', 'perkins_d'] },
    { id: 'ofa_michigan', label: 'OFA Michigan', type: 'dark_money',
      px: 0.88, py: 0.78,
      detail: 'Dark money org — Holland = officer. Undisclosed donors → mailers.',
      aggregates: [] },
    { id: 'canfield_bldg', label: '10101 E. Canfield', type: 'property',
      px: 0.38, py: 0.68,
      detail: 'DPSCD building. Purchase option embedded in Purpose Group contract.',
      aggregates: [] },

    // ── State oversight (top left) ──
    { id: 'lansing', label: 'Lansing', type: 'state',
      px: 0.08, py: 0.05,
      detail: 'MDE investigated Feb 2022 → cleared. AG deferred.',
      aggregates: ['mde'] },

    // ── Dykema Gossett (Lansing — dark money formation) ──
    { id: 'dykema_lansing', label: 'Dykema Gossett (Lansing)', type: 'dark_money',
      px: 0.08, py: 0.45,
      detail: 'MI\'s largest law firm. 201 Townsend St Ste 900. Formed Save Detroit Jobs.',
      aggregates: ['dykema'] },

    // ── Southfield (North Park address hub) ──
    { id: 'southfield', label: 'Southfield', type: 'property',
      px: 0.68, py: 0.88,
      detail: '16500 North Park Dr — connects Banks (2001) to Ross + Tarver (2013). Inner Link at 9 Mile.',
      aggregates: [] },

    // ── Warren (Custom Promotions / Deen Legal) ──
    { id: 'warren', label: 'Warren', type: 'vendor',
      px: 0.38, py: 0.12,
      detail: '14326 E. 9 Mile Rd — Custom Promotions + Deen Legal. Gordon = FBI investigated.',
      aggregates: ['gordon'] },

    // ── Holland MI (Anchor Rock) ──
    { id: 'holland_mi', label: 'Holland, MI', type: 'property',
      px: 0.88, py: 0.88,
      detail: 'Anchor Rock Services + ARS Holdings + GL Upfitting. Banks = agent.',
      aggregates: [] },
  ];


  // ═══════════════════════════════════════════════════════════════════
  // GEO FLOWS — every documented money/power route individually traced
  // ═══════════════════════════════════════════════════════════════════
  //
  // flow_type:
  //   state_aid    — Michigan per-pupil funding
  //   extraction   — money leaving schools to LLC
  //   personal     — LLC to Banks personally
  //   campaign     — political/judge payments
  //   authorization — charter/regulatory approval
  //   kickback     — board seats, cover flowing back
  //   dark_money   — undisclosed donors
  //   property     — land deals, mortgages
  //   donation     — tax-deductible to foundation
  //   oversight    — investigation/regulatory
  //   events       — CBC/political event revenue

  var GEO_FLOWS = [
    // ══ PATH A: Core extraction — state aid → schools → LLC → suburb ══
    { from: 'mi_state_aid', to: 'macdowell', flow_type: 'state_aid',
      label: '$4.9M/yr per-pupil', amount: 4900000 },
    { from: 'mi_state_aid', to: 'pca', flow_type: 'state_aid',
      label: 'Per-pupil (new)', amount: 2000000 },
    { from: 'macdowell', to: 'purpose_group', flow_type: 'extraction',
      label: '72.67% → LLC ($4.28M)', amount: 4280000 },
    { from: 'pca', to: 'purpose_group', flow_type: 'extraction',
      label: '10% mgmt + all costs', amount: 1500000 },
    { from: 'purpose_group', to: 'gpw', flow_type: 'personal',
      label: '$150K+ salary → suburb', amount: 667000 },

    // ══ PATH B: Unaccounted gap ══
    { from: 'purpose_group', to: 'gpw', flow_type: 'extraction',
      label: '$348K unaccounted gap', amount: 348000 },

    // ══ PATH C: Authorization fee — schools pay DPSCD to exist ══
    { from: 'macdowell', to: 'dpscd', flow_type: 'authorization',
      label: '3% auth fee (~$147K)', amount: 147000 },
    { from: 'dpscd', to: 'pca', flow_type: 'authorization',
      label: 'Authorizes charter', amount: 0 },

    // ══ PATH D: Campaign money distribution ══
    { from: 'purpose_group', to: 'banks_strategy', flow_type: 'campaign',
      label: 'Consulting payments', amount: 35000 },
    { from: 'banks_strategy', to: '36th_district', flow_type: 'campaign',
      label: '$383.82 → Yancey (sole expenditure)', amount: 383 },
    { from: 'purpose_group', to: 'pacs', flow_type: 'campaign',
      label: 'PAC funding (Holland = treas.)', amount: 14500 },
    { from: 'pacs', to: 'inner_link', flow_type: 'campaign',
      label: '$98K printing (5 committees)', amount: 98291 },
    { from: 'pacs', to: 'city_hall', flow_type: 'campaign',
      label: 'Campaign contributions', amount: 0 },

    // ══ PATH E: Dark money ══
    { from: 'pacs', to: 'ofa_michigan', flow_type: 'dark_money',
      label: 'Holland = officer, undisclosed $', amount: 0 },
    { from: 'ofa_michigan', to: 'city_hall', flow_type: 'dark_money',
      label: 'Mailers (undisclosed)', amount: 0 },

    // ══ PATH F: Judicial kickback — board seats flow back ══
    { from: '3rd_circuit', to: 'pca', flow_type: 'kickback',
      label: 'Miller → Board Chair', amount: 0 },
    { from: '36th_district', to: 'macdowell', flow_type: 'kickback',
      label: 'Yancey → Board Chair', amount: 0 },
    { from: 'city_hall', to: 'pca', flow_type: 'kickback',
      label: 'Gay-Dagnogo → authorization', amount: 0 },

    // ══ PATH G: Foundation side channel ══
    { from: 'private_donors', to: 'purpose_foundation', flow_type: 'donation',
      label: 'Tax-deductible (2 felons = officers)', amount: 0 },
    { from: 'purpose_foundation', to: 'gpw', flow_type: 'extraction',
      label: 'Controlled by Banks', amount: 0 },

    // ══ PATH H: Property pipeline ══
    { from: 'pscu', to: 'gpw', flow_type: 'property',
      label: '$549K+ mortgages', amount: 549000 },
    { from: 'wayne_county', to: 'canfield_bldg', flow_type: 'property',
      label: 'Foreclosure pipeline (Sabree)', amount: 0 },
    { from: 'canfield_bldg', to: 'purpose_group', flow_type: 'property',
      label: 'Purchase option in contract', amount: 0 },

    // ══ PATH I: Events revenue ══
    { from: 'cbc_events', to: 'purpose_group', flow_type: 'events',
      label: '$50K-$150K est. (4 years)', amount: 100000 },

    // ══ PATH J: Failed oversight ══
    { from: 'lansing', to: 'macdowell', flow_type: 'oversight',
      label: 'MDE investigated → cleared (2h 24m)', amount: 0 },

    // ══ PATH K: Endorsement influence ══
    { from: 'wayne_county', to: 'gpw', flow_type: 'kickback',
      label: 'Evans + Sabree endorsed Banks', amount: 0 },

    // ══ PATH L: Dark money vehicle — Dykema → SDJ → Johnson → PCA ══
    { from: 'dykema_lansing', to: 'sdj', flow_type: 'dark_money',
      label: 'Dykema formed SDJ (compliance@dykema.com)', amount: 0 },
    { from: 'sdj', to: 'city_hall', flow_type: 'dark_money',
      label: 'Detroit Leaders funded Johnson vs Elrick', amount: 0 },

    // ══ PATH M: Right Turn self-dealing loop ══
    { from: 'pacs', to: 'right_turn', flow_type: 'campaign',
      label: 'PAC transfers → charity', amount: 0 },
    { from: 'right_turn', to: 'ross_catering', flow_type: 'extraction',
      label: 'Ross = treasurer + vendor (self-dealing)', amount: 35000 },

    // ══ PATH N: Custom Promotions (dissolve-reform) ══
    { from: 'warren', to: 'city_hall', flow_type: 'campaign',
      label: 'Custom Promotions → Johnson campaign', amount: 0 },

    // ══ PATH O: Inner Link ownership ══
    { from: 'pacs', to: 'inner_link', flow_type: 'campaign',
      label: '$98K printing (Thomas = obituaries4less.com)', amount: 98291 },

    // ══ PATH P: Serenity Guardianship (UPL) ══
    { from: 'serenity', to: 'gpw', flow_type: 'extraction',
      label: 'For-profit guardianship → Banks (never barred)', amount: 0 },

    // ══ PATH Q: Anchor Rock construction (Holland MI) ══
    { from: 'anchor_rock', to: 'holland_mi', flow_type: 'property',
      label: '3 assumed names (upfitting, fire supply, construction)', amount: 0 },

    // ══ PATH R: Endorsement machine ══
    { from: 'eastside_slate', to: 'city_hall', flow_type: 'campaign',
      label: '4 incarnations. Carol Banks = current agent.', amount: 0 },

    // ══ PATH S: Southfield address connection ══
    { from: 'southfield', to: 'gpw', flow_type: 'property',
      label: '16500 N Park — Banks (2001) → Ross + Tarver (2013)', amount: 0 },
  ];


  // ═══════════════════════════════════════════════════════════════════
  // DISPLAY CONSTANTS — colors, icons, flow styles
  // ═══════════════════════════════════════════════════════════════════

  var NODE_COLORS = {
    actor: '#c0392b',
    judge: '#8e44ad',
    political: '#2980b9',
    bmf: '#e74c3c',
    school: '#27ae60',
    entity: '#f39c12',
    institutional: '#7f8c8d',
  };

  var EDGE_COLORS = {
    controls: '#95a5a6',
    financial: '#f39c12',
    associate: '#e74c3c',
    money: '#27ae60',
    judicial: '#8e44ad',
    political: '#2980b9',
    family: '#c0392b',
    institutional: '#7f8c8d',
  };

  var NEXUS_COLORS = {
    education: '#27ae60',
    political: '#2980b9',
    police: '#c0392b',
    legislative: '#f39c12',
  };

  var FLOW_COLORS = {
    money: '#2ecc71',
    power: '#e74c3c',
    influence: '#3498db',
    position: '#9b59b6',
  };

  var FLOW_ICONS = {
    money: '💰',
    power: '⚡',
    influence: '🤝',
    position: '🪑',
  };

  var GEO_TYPE_COLORS = {
    school: '#27ae60',
    extraction: '#e74c3c',
    political: '#2980b9',
    court: '#8e44ad',
    state: '#7f8c8d',
    vendor: '#f39c12',
  };

  var GEO_FLOW_STYLES = {
    state_aid:     { color: '#27ae60', width: 4, dash: '' },       // green solid — public money in
    extraction:    { color: '#e74c3c', width: 4, dash: '' },       // red solid — money leaving
    personal:      { color: '#c0392b', width: 3, dash: '' },       // dark red — personal enrichment
    campaign:      { color: '#f39c12', width: 2.5, dash: '6,3' },  // orange dashed — campaign $
    authorization: { color: '#1abc9c', width: 2, dash: '4,2' },    // teal dashed — regulatory
    kickback:      { color: '#8e44ad', width: 2.5, dash: '3,3' },  // purple dashed — positions back
    dark_money:    { color: '#e74c3c', width: 2, dash: '2,4' },    // red dotted — undisclosed
    property:      { color: '#d35400', width: 2.5, dash: '8,3' },  // burnt orange — land/mortgage
    donation:      { color: '#2980b9', width: 2, dash: '5,3' },    // blue dashed — donations
    oversight:     { color: '#7f8c8d', width: 1.5, dash: '3,6' },  // grey dotted — failed oversight
    events:        { color: '#e67e22', width: 2, dash: '4,4' },    // amber dashed — event revenue
    formation:     { color: '#e74c3c', width: 3, dash: '2,2' },    // red dotted — entity formation
    self_dealing:  { color: '#d35400', width: 3, dash: '3,2' },    // burnt orange — self-dealing loop
    endorsement:   { color: '#2980b9', width: 2, dash: '4,3' },    // blue dashed — endorsement pipeline
    // Legacy compat
    money_in:      { color: '#27ae60', width: 4, dash: '' },
    money_out:     { color: '#e74c3c', width: 4, dash: '' },
    influence:     { color: '#3498db', width: 2, dash: '4,4' },
  };


  // ═══════════════════════════════════════════════════════════════════
  // MATRIX COMPUTATIONS — derived from edges
  // ═══════════════════════════════════════════════════════════════════

  function buildNodeIndex(nodes) {
    var idx = {};
    nodes.forEach(function(n, i) { idx[n.id] = i; });
    return idx;
  }

  function adjacencyMap(nodes, edges) {
    var adj = {};
    nodes.forEach(function(n) { adj[n.id] = []; });
    edges.forEach(function(e) {
      if (adj[e.source]) adj[e.source].push(e.target);
      if (adj[e.target]) adj[e.target].push(e.source);
    });
    return adj;
  }

  function flowMatrix(edges) {
    var matrix = {};
    edges.forEach(function(e) {
      if (!matrix[e.source]) matrix[e.source] = {};
      if (!matrix[e.source][e.target]) matrix[e.source][e.target] = [];
      matrix[e.source][e.target].push({
        type: e.type,
        flow: e.flow,
        label: e.label,
        amount: e.amount
      });
    });
    return matrix;
  }

  function degreeVector(nodes, edges) {
    var deg = {};
    nodes.forEach(function(n) { deg[n.id] = 0; });
    edges.forEach(function(e) {
      if (deg[e.source] !== undefined) deg[e.source]++;
      if (deg[e.target] !== undefined) deg[e.target]++;
    });
    return deg;
  }

  function flowSummary(nodeId, edges) {
    var inflows = { money: 0, power: 0, influence: 0, position: 0 };
    var outflows = { money: 0, power: 0, influence: 0, position: 0 };
    var totalIn = 0, totalOut = 0;
    edges.forEach(function(e) {
      if (e.target === nodeId && inflows[e.flow] !== undefined) {
        inflows[e.flow]++;
        if (e.amount) totalIn += e.amount;
      }
      if (e.source === nodeId && outflows[e.flow] !== undefined) {
        outflows[e.flow]++;
        if (e.amount) totalOut += e.amount;
      }
    });
    return { inflows: inflows, outflows: outflows, totalDollarsIn: totalIn, totalDollarsOut: totalOut };
  }

  function moneyTrail(edges) {
    return edges
      .filter(function(e) { return e.flow === 'money' && e.amount; })
      .sort(function(a, b) { return (b.amount || 0) - (a.amount || 0); });
  }

  function findCycles(edges, maxLen) {
    maxLen = maxLen || 5;
    var adj = {};
    edges.forEach(function(e) {
      if (!adj[e.source]) adj[e.source] = [];
      adj[e.source].push(e.target);
    });
    var cycles = [];
    var visited = {};

    function dfs(start, path) {
      var current = path[path.length - 1];
      if (path.length > maxLen) return;
      var neighbors = adj[current] || [];
      for (var i = 0; i < neighbors.length; i++) {
        if (neighbors[i] === start && path.length >= 3) {
          cycles.push(path.concat([start]));
        } else if (!visited[neighbors[i]] && path.indexOf(neighbors[i]) === -1) {
          dfs(start, path.concat([neighbors[i]]));
        }
      }
    }

    Object.keys(adj).forEach(function(node) {
      visited = {};
      dfs(node, [node]);
      visited[node] = true;
    });
    return cycles;
  }


  // ═══════════════════════════════════════════════════════════════════
  // EXPORT — window.DETROIT_NETWORK
  // ═══════════════════════════════════════════════════════════════════

  var network = {
    // Raw data
    nodes: NODES,
    edges: EDGES,
    ownershipGroups: OWNERSHIP_GROUPS,
    oversightCycles: OVERSIGHT_CYCLES,

    // Geographic data
    geoPositions: GEO_POSITIONS,
    geoAggregates: GEO_AGGREGATES,
    geoFlows: GEO_FLOWS,

    // Display constants
    nodeColors: NODE_COLORS,
    edgeColors: EDGE_COLORS,
    nexusColors: NEXUS_COLORS,
    flowColors: FLOW_COLORS,
    flowIcons: FLOW_ICONS,
    geoTypeColors: GEO_TYPE_COLORS,
    geoFlowStyles: GEO_FLOW_STYLES,

    // Convenience accessors (for the network graph's STATIC_GRAPH format)
    graphData: function() {
      return { nodes: NODES, links: EDGES };
    },

    // Matrix computations
    nodeIndex: function() { return buildNodeIndex(NODES); },
    adjacency: function() { return adjacencyMap(NODES, EDGES); },
    flowMatrix: function() { return flowMatrix(EDGES); },
    degrees: function() { return degreeVector(NODES, EDGES); },
    flowSummary: function(nodeId) { return flowSummary(nodeId, EDGES); },
    moneyTrail: function() { return moneyTrail(EDGES); },
    findCycles: function(maxLen) { return findCycles(EDGES, maxLen); },

    // Summary stats
    stats: function() {
      var flowCounts = { money: 0, power: 0, influence: 0, position: 0 };
      var totalDocumented = 0;
      EDGES.forEach(function(e) {
        if (flowCounts[e.flow] !== undefined) flowCounts[e.flow]++;
        if (e.amount) totalDocumented += e.amount;
      });
      return {
        nodeCount: NODES.length,
        edgeCount: EDGES.length,
        ownershipGroupCount: OWNERSHIP_GROUPS.length,
        cycleCount: OVERSIGHT_CYCLES.length,
        flowCounts: flowCounts,
        totalDocumentedDollars: totalDocumented,
        nexusTypes: ['education', 'political', 'police', 'legislative'],
      };
    },

    // Version (increment on schema changes)
    version: 2,
  };

  window.DETROIT_NETWORK = network;
})();
