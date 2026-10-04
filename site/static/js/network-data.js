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
      detail: 'AAG → PCA Board Vice Chair. Argued AGAINST Banks cert, then joined his board.', url: null,
      nexus: ['education', 'legislative'] },
    { id: 'johnson_l', label: 'L. Johnson', tier: 3, type: 'political',
      detail: 'City Council. PCA Board Secretary. Campaign funded by Inner Link ($850).', url: null,
      nexus: ['political', 'education'] },

    // ── Entities ──
    { id: 'pca', label: 'Purpose Charter Academy', tier: 0, type: 'school',
      detail: 'K-8, DPSCD authorized', url: '/network/entities/purpose-charter-academy/',
      nexus: ['education'] },
    { id: 'macdowell', label: 'MacDowell Prep', tier: 0, type: 'school',
      detail: '$4.9M revenue, 3% math. [FOIA: 9yr audits]', url: '/network/entities/macdowell-prep/',
      nexus: ['education'] },
    { id: 'purpose_group', label: 'Purpose Group LLC', tier: 0, type: 'entity',
      detail: 'CMO — takes 72.67% of revenue', url: '/network/entities/purpose-group-llc/',
      nexus: ['education'] },
    { id: 'purpose_foundation', label: 'Purpose Foundation', tier: 0, type: 'entity',
      detail: '501(c)(3), 2 felons in all positions', url: '/network/entities/purpose-foundation/',
      nexus: ['education'] },
    { id: 'banks_strategy', label: 'Banks Strategy LLC', tier: 0, type: 'entity',
      detail: 'Receives judge campaign payments', url: '/network/entities/banks-strategy-llc/',
      nexus: ['education', 'political'] },
    { id: 'pacs', label: 'PACs', tier: 0, type: 'entity',
      detail: '$14.5K+ fines, felon treasurer', url: '/network/entities/political-action-committees/',
      nexus: ['political'] },
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
    { source: 'moreland', target: 'pca', type: 'controls', label: 'Board Vice Chair', flow: 'position', amount: null },
    { source: 'moreland', target: 'banks', type: 'judicial', label: 'AAG argued against cert → joined board', flow: 'influence', amount: null },
    { source: 'miller', target: 'pca', type: 'controls', label: 'Board Chair', flow: 'position', amount: null },
  ];


  // ═══════════════════════════════════════════════════════════════════
  // OWNERSHIP GROUPS — hulls around entities controlled by same person
  // ═══════════════════════════════════════════════════════════════════

  var OWNERSHIP_GROUPS = [
    {
      id: 'banks_empire',
      controller: 'banks',
      label: 'Banks controls all',
      members: ['banks', 'pca', 'macdowell', 'purpose_group', 'purpose_foundation', 'banks_strategy', 'holland'],
      color: 'rgba(192,57,43,0.12)',
      stroke: 'rgba(192,57,43,0.5)',
      note: '1 person, 6 entities, 1 co-resident felon'
    },
    {
      id: 'banks_pacs',
      controller: 'holland',
      label: 'Holland manages finances',
      members: ['holland', 'pacs', 'purpose_foundation'],
      color: 'rgba(243,156,18,0.10)',
      stroke: 'rgba(243,156,18,0.4)',
      note: 'PAC treasurer + Foundation secretary = same felon'
    },
    {
      id: 'pca_board',
      controller: 'banks',
      label: 'PCA Board (Banks-selected)',
      members: ['pca', 'miller', 'moreland', 'johnson_l'],
      color: 'rgba(39,174,96,0.10)',
      stroke: 'rgba(39,174,96,0.4)',
      note: 'Judge + AAG + Council = "oversight" selected by subject'
    },
    {
      id: 'macdowell_board',
      controller: 'banks',
      label: 'MacDowell Board (Banks-selected)',
      members: ['macdowell', 'wells_stallworth', 'yancey'],
      color: 'rgba(142,68,173,0.10)',
      stroke: 'rgba(142,68,173,0.4)',
      note: 'Board President + Judge = hand-picked by superintendent'
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

  var GEO_POSITIONS = {
    // Schools — center of map (the community)
    macdowell:      { px: 0.45, py: 0.42 },
    pca:            { px: 0.52, py: 0.55 },
    dpsa:           { px: 0.38, py: 0.32 },

    // Extraction layer — top (outside community)
    purpose_group:  { px: 0.42, py: 0.14 },
    banks:          { px: 0.22, py: 0.10 },
    banks_strategy: { px: 0.65, py: 0.12 },

    // Political — lower right
    sheffield:      { px: 0.72, py: 0.62 },
    evans:          { px: 0.82, py: 0.50 },
    miller:         { px: 0.75, py: 0.38 },
    yancey:         { px: 0.85, py: 0.72 },

    // State — far left
    mde:            { px: 0.08, py: 0.30 },

    // Vendor — lower left
    inner_link:     { px: 0.15, py: 0.65 },
  };

  // Geo-only aggregate locations (not network nodes, but conceptual positions)
  var GEO_AGGREGATES = [
    { id: 'city_hall', label: 'Detroit City Hall', type: 'political',
      px: 0.72, py: 0.62,
      detail: 'Mayor Sheffield · Ombudsman Gay-Dagnogo',
      aggregates: ['sheffield', 'gay_dagnogo'] },
    { id: 'wayne_county', label: 'Wayne County', type: 'political',
      px: 0.82, py: 0.50,
      detail: 'Exec Evans · Treasurer Sabree',
      aggregates: ['evans', 'sabree_e'] },
    { id: '3rd_circuit', label: '3rd Circuit Court', type: 'court',
      px: 0.75, py: 0.38,
      detail: 'Judges Miller, A. Sabree, Ramsey',
      aggregates: ['miller', 'sabree'] },
    { id: '36th_district', label: '36th District Court', type: 'court',
      px: 0.85, py: 0.72,
      detail: 'Judges Yancey, S. Perkins',
      aggregates: ['yancey', 'perkins_d'] },
    { id: 'lansing', label: 'Lansing (State Capitol)', type: 'state',
      px: 0.08, py: 0.30,
      detail: 'MDE · AG · State Legislature',
      aggregates: ['mde'] },
  ];


  // ═══════════════════════════════════════════════════════════════════
  // GEO FLOWS — money/influence paths for the geographic map
  // ═══════════════════════════════════════════════════════════════════
  //
  // These use geo-level IDs (which may be aggregates or network nodes).
  // flow_type maps to visual style: money_in, money_out, campaign, influence, kickback

  var GEO_FLOWS = [
    // Public money IN to schools
    { from: 'lansing', to: 'macdowell', flow_type: 'money_in', label: '$4.9M state aid', amount: 4900000 },
    { from: 'lansing', to: 'pca', flow_type: 'money_in', label: 'State aid (new)', amount: 2000000 },

    // Extraction OUT of schools
    { from: 'macdowell', to: 'purpose_group', flow_type: 'money_out', label: '72.67% ($4.28M)', amount: 4280000 },
    { from: 'pca', to: 'purpose_group', flow_type: 'money_out', label: 'Management fee', amount: 1500000 },
    { from: 'purpose_group', to: 'banks', flow_type: 'money_out', label: 'Salary + expenses', amount: 667000 },

    // Campaign money flowing outward
    { from: 'banks', to: 'banks_strategy', flow_type: 'campaign', label: 'Consulting payments', amount: 35000 },
    { from: 'banks_strategy', to: '36th_district', flow_type: 'campaign', label: '$383 Yancey', amount: 383 },
    { from: 'banks', to: 'inner_link', flow_type: 'campaign', label: '$98K printing', amount: 98291 },
    { from: 'banks', to: 'city_hall', flow_type: 'influence', label: 'Endorsements + events', amount: 0 },
    { from: 'banks', to: 'wayne_county', flow_type: 'influence', label: 'Endorsements', amount: 0 },

    // Kickback: positions and cover flowing back
    { from: '3rd_circuit', to: 'pca', flow_type: 'kickback', label: 'Board seats (Miller)', amount: 0 },
    { from: '36th_district', to: 'macdowell', flow_type: 'kickback', label: 'Board seats (Yancey)', amount: 0 },
    { from: 'city_hall', to: 'pca', flow_type: 'kickback', label: 'Charter authorization', amount: 0 },
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
    money_in:  { color: '#27ae60', width: 4, dash: '' },
    money_out: { color: '#e74c3c', width: 4, dash: '' },
    campaign:  { color: '#f39c12', width: 2.5, dash: '6,3' },
    influence: { color: '#3498db', width: 2, dash: '4,4' },
    kickback:  { color: '#8e44ad', width: 2, dash: '3,3' },
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
    version: 1,
  };

  window.DETROIT_NETWORK = network;
})();
