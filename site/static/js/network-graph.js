// Network graph visualization for detroit.primals.eco
// Renders actor/entity relationships as an interactive force-directed graph.
//
// Data source priority:
// 1. petalTongue API: /api/public-record/network (live, when NUCLEUS is running)
// 2. Embedded static data (fallback, always available)

(function() {
  'use strict';

  // ── Static network data (single source of truth from config.toml registry) ──

  const STATIC_GRAPH = {
    nodes: [
      // Tier 1: Enterprise Principals
      { id: 'banks', label: 'Brian R. Banks', tier: 1, type: 'actor',
        detail: '9 convictions (6 felony, 3 misd.)', url: '/network/actors/brian-banks/',
        nexus: ['education', 'political', 'police', 'legislative'] },
      { id: 'holland', label: 'Joseph Holland Jr.', tier: 1, type: 'actor',
        detail: 'Drug offender, MDOC #443789', url: '/network/actors/joseph-holland/',
        nexus: ['education', 'political'] },

      // Tier 2: Judicial Cover
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

      // Tier 3: Political
      { id: 'gay_dagnogo', label: 'S. Gay-Dagnogo', tier: 3, type: 'political',
        detail: 'DPSCD Board, succeeded Banks in HD-1', url: '/network/political/sherry-gay-dagnogo/',
        nexus: ['political', 'education'] },

      // Tier 5: BMF
      { id: 'od_banks', label: 'OD Banks', tier: 5, type: 'bmf',
        detail: 'BMF Defendant #22, Banks\' father', url: null,
        nexus: [] },
      { id: 'welch', label: 'Tonesa Welch', tier: 5, type: 'bmf',
        detail: 'BMF figure, Banks\' aunt', url: null,
        nexus: [] },

      // FOIA-revealed actors (Layer 2)
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

      // Nexus 2: Political Capture (Wave 162 — Capture Graph)
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

      // Nexus 3: Police Weaponization
      { id: 'bettison', label: 'Chief Bettison', tier: 2, type: 'actor',
        detail: 'DPD Chief + DPSA Board Secretary. OIG investigation Sep 2026.', url: null,
        nexus: ['police', 'education'] },
      { id: 'dpsa', label: 'Detroit Public Safety Academy', tier: 0, type: 'school',
        detail: 'Charter school — police chief on the board.', url: null,
        nexus: ['police', 'education'] },

      // Nexus 3b: Operation Northern Hook
      { id: 'fiore', label: 'G. Fiore', tier: 2, type: 'actor',
        detail: 'Convicted bribery. FBI wiretap: "bid-rigging with Banks"', url: null,
        nexus: ['police', 'political'] },
      { id: 'spivey', label: 'A. Spivey', tier: 3, type: 'political',
        detail: 'Convicted (24 mo). Op Northern Hook. Warned targets.', url: null,
        nexus: ['police', 'political'] },
      { id: 'perkins_t', label: 'T. Perkins', tier: 3, type: 'actor',
        detail: 'Banks attorney. Repped 2 Op Northern Hook targets. Ran for mayor.', url: null,
        nexus: ['police', 'political'] },

      // Nexus 4: Legislative Pipeline — Stallworth family
      { id: 'stallworth_t', label: 'T. Stallworth III', tier: 3, type: 'political',
        detail: 'Former State Rep. Nicole\'s husband. Defended Banks at felony rally.', url: null,
        nexus: ['legislative'] },
      { id: 'moreland', label: 'L. Moreland', tier: 2, type: 'judge',
        detail: 'AAG → PCA Board Vice Chair. Argued AGAINST Banks cert, then joined his board.', url: null,
        nexus: ['education', 'legislative'] },
      { id: 'johnson_l', label: 'L. Johnson', tier: 3, type: 'political',
        detail: 'City Council. PCA Board Secretary. Campaign funded by Inner Link ($850).', url: null,
        nexus: ['political', 'education'] },

      // Entities
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
    ],
    links: [
      // flow: what is exchanged along this edge
      //   'money'     — dollars (campaign, contracts, fees, payments)
      //   'power'     — authority (appointments, authorizations, police power)
      //   'influence' — endorsements, political support, legal cover, protection
      //   'position'  — board seats, institutional roles granted

      // Banks controls everything
      { source: 'banks', target: 'pca', type: 'controls', label: 'superintendent', flow: 'power' },
      { source: 'banks', target: 'macdowell', type: 'controls', label: 'superintendent', flow: 'power' },
      { source: 'banks', target: 'purpose_group', type: 'controls', label: 'sole member', flow: 'power' },
      { source: 'banks', target: 'purpose_foundation', type: 'controls', label: 'president + director', flow: 'power' },
      { source: 'banks', target: 'banks_strategy', type: 'controls', label: 'agent', flow: 'power' },

      // Holland financial roles
      { source: 'holland', target: 'purpose_foundation', type: 'financial', label: 'secretary + treasurer', flow: 'position' },
      { source: 'holland', target: 'pacs', type: 'financial', label: 'PAC treasurer', flow: 'position' },

      // Co-residence
      { source: 'banks', target: 'holland', type: 'associate', label: 'co-resident, all entities', flow: 'influence' },

      // Money flow
      { source: 'pca', target: 'purpose_group', type: 'money', label: 'management fee', flow: 'money' },
      { source: 'macdowell', target: 'purpose_group', type: 'money', label: '72.67% ($4.28M)', flow: 'money' },

      // Judicial connections
      { source: 'miller', target: 'banks', type: 'judicial', label: 'Board Chair → legal cover', flow: 'influence' },
      { source: 'yancey', target: 'banks_strategy', type: 'judicial', label: '$383.82 payment', flow: 'money' },
      { source: 'sabree', target: 'banks', type: 'judicial', label: 'MSU Law 2010', flow: 'influence' },
      { source: 'perkins_d', target: 'banks', type: 'judicial', label: 'family donations', flow: 'money' },

      // Political
      { source: 'gay_dagnogo', target: 'pca', type: 'political', label: 'DPSCD authorizer', flow: 'power' },
      { source: 'gay_dagnogo', target: 'banks', type: 'political', label: 'CBC honoree, HD-1 successor', flow: 'influence' },

      // BMF lineage
      { source: 'od_banks', target: 'banks', type: 'family', label: 'father', flow: 'influence' },
      { source: 'welch', target: 'od_banks', type: 'family', label: 'BMF network', flow: 'influence' },

      // FOIA-revealed connections (Layer 2)
      { source: 'wells_stallworth', target: 'macdowell', type: 'controls', label: 'Board President ≥2014', flow: 'position' },
      { source: 'wells_stallworth', target: 'banks', type: 'associate', label: 'received investigation, protected', flow: 'influence' },
      { source: 'mde', target: 'banks', type: 'institutional', label: 'HOLD on permit #590606', flow: 'power' },
      { source: 'mde', target: 'macdowell', type: 'institutional', label: 'investigated Feb 2022, cleared', flow: 'power' },
      { source: 'schmiedeknecht', target: 'mde', type: 'institutional', label: 'analyst, OEE', flow: 'position' },
      { source: 'alan_young', target: 'macdowell', type: 'financial', label: 'auditor 9yr (FY17-25)', flow: 'influence' },
      { source: 'macdowell', target: 'banks', type: 'money', label: 'School Admin $667K', flow: 'money' },

      // Nexus 2: Political Capture
      { source: 'sheffield', target: 'bettison', type: 'political', label: 'appointed chief', flow: 'power' },
      { source: 'sheffield', target: 'banks', type: 'political', label: 'endorsed', flow: 'influence' },
      { source: 'evans', target: 'banks', type: 'political', label: 'endorsed', flow: 'influence' },
      { source: 'sabree_e', target: 'banks', type: 'political', label: 'endorsed', flow: 'influence' },
      { source: 'inner_link', target: 'banks', type: 'money', label: '$39K Banks for Senate', flow: 'money' },
      { source: 'inner_link', target: 'yancey', type: 'money', label: '$8K Yancey campaign', flow: 'money' },
      { source: 'mccastle', target: 'banks', type: 'money', label: '$9,450 Banks for Senate', flow: 'money' },
      { source: 'mccastle', target: 'gay_dagnogo', type: 'money', label: '$1K Strong Women PAC', flow: 'money' },
      { source: 'johnson_l', target: 'pca', type: 'controls', label: 'Board Secretary', flow: 'position' },
      { source: 'inner_link', target: 'johnson_l', type: 'money', label: '$850 campaign', flow: 'money' },

      // Nexus 3: Police Weaponization
      { source: 'bettison', target: 'dpsa', type: 'controls', label: 'Board Secretary', flow: 'position' },
      { source: 'bettison', target: 'sheffield', type: 'political', label: 'OIG probe — phone call', flow: 'power' },
      { source: 'fiore', target: 'banks', type: 'associate', label: 'FBI wiretap: "bid-rigging"', flow: 'money' },
      { source: 'spivey', target: 'fiore', type: 'associate', label: 'Op Northern Hook', flow: 'influence' },
      { source: 'perkins_t', target: 'banks', type: 'associate', label: 'defense attorney', flow: 'influence' },
      { source: 'perkins_t', target: 'fiore', type: 'associate', label: 'donated $500', flow: 'money' },
      { source: 'gay_dagnogo', target: 'perkins_t', type: 'money', label: '$750 mayor campaign', flow: 'money' },

      // Nexus 4: Legislative Pipeline
      { source: 'stallworth_t', target: 'wells_stallworth', type: 'family', label: 'married', flow: 'influence' },
      { source: 'stallworth_t', target: 'banks', type: 'political', label: 'defended at rally, $1,250', flow: 'influence' },
      { source: 'moreland', target: 'pca', type: 'controls', label: 'Board Vice Chair', flow: 'position' },
      { source: 'moreland', target: 'banks', type: 'judicial', label: 'AAG argued against cert → joined board', flow: 'influence' },
      { source: 'miller', target: 'pca', type: 'controls', label: 'Board Chair', flow: 'position' },
    ]
  };

  // ── Ownership groups ─────────────────────────────────────────────────
  // When "Ownership" layer is active, a hull is drawn around entities
  // controlled by the same person — revealing that 6 "entities" = 1 person.

  const OWNERSHIP_GROUPS = [
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

  // ── Cyclic oversight paths ──────────────────────────────────────────
  // Directed cycles where "oversight" is self-referential.
  // Each cycle is a sequence of node IDs forming a closed loop.

  const OVERSIGHT_CYCLES = [
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

  // ── Color scheme ──────────────────────────────────────────────────────

  const COLORS = {
    actor: '#c0392b',
    judge: '#8e44ad',
    political: '#2980b9',
    bmf: '#e74c3c',
    school: '#27ae60',
    entity: '#f39c12',
    institutional: '#7f8c8d',
  };

  const LINK_COLORS = {
    controls: '#95a5a6',
    financial: '#f39c12',
    associate: '#e74c3c',
    money: '#27ae60',
    judicial: '#8e44ad',
    political: '#2980b9',
    family: '#c0392b',
    institutional: '#7f8c8d',
  };

  // ── Render ────────────────────────────────────────────────────────────

  // ── Nexus filter state ─────────────────────────────────────────────
  var activeNexus = { education: true, political: true, police: true, legislative: true };
  var showOwnership = false;
  var showCycles = false;
  var activeFlows = null; // null = show all, otherwise { money: true, power: false, ... }

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

  function renderGraph(container, data) {
    var width = container.clientWidth || 800;
    var height = Math.max(600, width * 0.65);

    // ── Build nexus filter controls ──────────────────────────────────
    var controls = container.querySelector('.graph-controls');
    if (!controls) {
      controls = document.createElement('div');
      controls.className = 'graph-controls';
      controls.style.cssText = 'display:flex;gap:8px;flex-wrap:wrap;margin-bottom:12px;align-items:center;';
      var label = document.createElement('span');
      label.textContent = 'Nexus overlay:';
      label.style.cssText = 'font-size:12px;font-weight:600;opacity:0.7;margin-right:4px;';
      controls.appendChild(label);
      ['education', 'political', 'police', 'legislative'].forEach(function(nx) {
        var btn = document.createElement('button');
        btn.textContent = nx.charAt(0).toUpperCase() + nx.slice(1);
        btn.dataset.nexus = nx;
        btn.style.cssText = 'padding:4px 12px;border:2px solid ' + NEXUS_COLORS[nx] +
          ';border-radius:14px;font-size:11px;font-weight:600;cursor:pointer;transition:all 0.2s;' +
          'background:' + NEXUS_COLORS[nx] + ';color:#fff;';
        btn.addEventListener('click', function() {
          activeNexus[nx] = !activeNexus[nx];
          btn.style.background = activeNexus[nx] ? NEXUS_COLORS[nx] : 'transparent';
          btn.style.color = activeNexus[nx] ? '#fff' : NEXUS_COLORS[nx];
          renderGraph(container, data);
        });
        controls.appendChild(btn);
      });
      var allBtn = document.createElement('button');
      allBtn.textContent = 'All';
      allBtn.style.cssText = 'padding:4px 10px;border:1px solid #888;border-radius:14px;font-size:10px;cursor:pointer;background:transparent;color:inherit;';
      allBtn.addEventListener('click', function() {
        Object.keys(activeNexus).forEach(function(k) { activeNexus[k] = true; });
        controls.querySelectorAll('button[data-nexus]').forEach(function(b) {
          b.style.background = NEXUS_COLORS[b.dataset.nexus];
          b.style.color = '#fff';
        });
        renderGraph(container, data);
      });
      controls.appendChild(allBtn);

      // Layer separator
      var sep = document.createElement('span');
      sep.textContent = '│';
      sep.style.cssText = 'opacity:0.3;margin:0 4px;';
      controls.appendChild(sep);

      // Ownership hull toggle
      var ownBtn = document.createElement('button');
      ownBtn.textContent = '⬡ Ownership';
      ownBtn.dataset.layer = 'ownership';
      ownBtn.style.cssText = 'padding:4px 12px;border:2px solid #e74c3c;border-radius:14px;font-size:11px;font-weight:600;cursor:pointer;transition:all 0.2s;background:transparent;color:#e74c3c;';
      ownBtn.addEventListener('click', function() {
        showOwnership = !showOwnership;
        ownBtn.style.background = showOwnership ? '#e74c3c' : 'transparent';
        ownBtn.style.color = showOwnership ? '#fff' : '#e74c3c';
        renderGraph(container, data);
      });
      controls.appendChild(ownBtn);

      // Cycle detection toggle
      var cycBtn = document.createElement('button');
      cycBtn.textContent = '⟳ Cycles';
      cycBtn.dataset.layer = 'cycles';
      cycBtn.style.cssText = 'padding:4px 12px;border:2px solid #e67e22;border-radius:14px;font-size:11px;font-weight:600;cursor:pointer;transition:all 0.2s;background:transparent;color:#e67e22;';
      cycBtn.addEventListener('click', function() {
        showCycles = !showCycles;
        cycBtn.style.background = showCycles ? '#e67e22' : 'transparent';
        cycBtn.style.color = showCycles ? '#fff' : '#e67e22';
        renderGraph(container, data);
      });
      controls.appendChild(cycBtn);

      // Flow type separator
      var sep2 = document.createElement('span');
      sep2.textContent = '│';
      sep2.style.cssText = 'opacity:0.3;margin:0 4px;';
      controls.appendChild(sep2);

      // Flow type label
      var flowLabel = document.createElement('span');
      flowLabel.textContent = 'Flows:';
      flowLabel.style.cssText = 'font-size:12px;font-weight:600;opacity:0.7;';
      controls.appendChild(flowLabel);

      // Flow type filter buttons
      ['money', 'power', 'influence', 'position'].forEach(function(ft) {
        var btn = document.createElement('button');
        btn.textContent = FLOW_ICONS[ft] + ' ' + ft.charAt(0).toUpperCase() + ft.slice(1);
        btn.dataset.flow = ft;
        btn.style.cssText = 'padding:4px 10px;border:2px solid ' + FLOW_COLORS[ft] +
          ';border-radius:14px;font-size:10px;font-weight:600;cursor:pointer;transition:all 0.2s;' +
          'background:transparent;color:' + FLOW_COLORS[ft] + ';';
        btn.addEventListener('click', function() {
          if (!activeFlows) {
            activeFlows = { money: false, power: false, influence: false, position: false };
          }
          activeFlows[ft] = !activeFlows[ft];
          var anyFlowActive = Object.values(activeFlows).some(function(v) { return v; });
          if (!anyFlowActive) activeFlows = null;
          btn.style.background = (activeFlows && activeFlows[ft]) ? FLOW_COLORS[ft] : 'transparent';
          btn.style.color = (activeFlows && activeFlows[ft]) ? '#fff' : FLOW_COLORS[ft];
          renderGraph(container, data);
        });
        controls.appendChild(btn);
      });

      container.insertBefore(controls, container.firstChild);
    }

    // ── Filter nodes by active nexus ──────────────────────────────────
    var anyActive = Object.values(activeNexus).some(function(v) { return v; });
    var filteredNodes = data.nodes.filter(function(n) {
      if (!anyActive) return true;
      if (!n.nexus || n.nexus.length === 0) return true;
      return n.nexus.some(function(nx) { return activeNexus[nx]; });
    });
    var visibleIds = {};
    filteredNodes.forEach(function(n) { visibleIds[n.id] = true; });
    var filteredLinks = data.links.filter(function(l) {
      return visibleIds[l.source] && visibleIds[l.target];
    });

    // ── SVG setup ─────────────────────────────────────────────────────
    var existingSvg = container.querySelector('svg');
    if (existingSvg) existingSvg.remove();

    var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('viewBox', '0 0 ' + width + ' ' + height);
    svg.setAttribute('width', '100%');
    svg.setAttribute('height', height);
    svg.setAttribute('role', 'img');
    svg.setAttribute('aria-label', 'Institutional capture network — ' + filteredNodes.length + ' nodes, ' + filteredLinks.length + ' edges');
    svg.style.cssText = 'background:rgba(0,0,0,0.02);border-radius:8px;';
    container.appendChild(svg);

    // ── Force-directed layout (no D3 dependency) ──────────────────────
    var nodes = filteredNodes.map(function(n, i) {
      var angle = (2 * Math.PI * i) / filteredNodes.length;
      var radius = Math.min(width, height) * 0.35;
      return Object.assign({}, n, {
        x: width / 2 + radius * Math.cos(angle) * (0.5 + n.tier * 0.12),
        y: height / 2 + radius * Math.sin(angle) * (0.5 + n.tier * 0.12),
        vx: 0, vy: 0
      });
    });

    var nodeMap = {};
    nodes.forEach(function(n) { nodeMap[n.id] = n; });

    for (var iter = 0; iter < 100; iter++) {
      for (var i = 0; i < nodes.length; i++) {
        for (var j = i + 1; j < nodes.length; j++) {
          var dx = nodes[j].x - nodes[i].x;
          var dy = nodes[j].y - nodes[i].y;
          var dist = Math.sqrt(dx * dx + dy * dy) || 1;
          var force = 12000 / (dist * dist);
          var fx = (dx / dist) * force;
          var fy = (dy / dist) * force;
          nodes[i].vx -= fx; nodes[i].vy -= fy;
          nodes[j].vx += fx; nodes[j].vy += fy;
        }
      }
      filteredLinks.forEach(function(link) {
        var s = nodeMap[link.source];
        var t = nodeMap[link.target];
        if (!s || !t) return;
        var dx = t.x - s.x;
        var dy = t.y - s.y;
        var dist = Math.sqrt(dx * dx + dy * dy) || 1;
        var force = (dist - 140) * 0.015;
        var fx = (dx / dist) * force;
        var fy = (dy / dist) * force;
        s.vx += fx; s.vy += fy;
        t.vx -= fx; t.vy -= fy;
      });
      nodes.forEach(function(n) {
        n.vx += (width / 2 - n.x) * 0.004;
        n.vy += (height / 2 - n.y) * 0.004;
        n.x += n.vx * 0.3;
        n.y += n.vy * 0.3;
        n.vx *= 0.78; n.vy *= 0.78;
        n.x = Math.max(70, Math.min(width - 70, n.x));
        n.y = Math.max(40, Math.min(height - 40, n.y));
      });
    }

    // ── Build adjacency for hover highlighting ────────────────────────
    var adjacency = {};
    nodes.forEach(function(n) { adjacency[n.id] = new Set(); });
    filteredLinks.forEach(function(l) {
      if (adjacency[l.source]) adjacency[l.source].add(l.target);
      if (adjacency[l.target]) adjacency[l.target].add(l.source);
    });

    // ── Convex hull helper ────────────────────────────────────────────
    function convexHull(points) {
      if (points.length < 3) return points;
      points.sort(function(a, b) { return a[0] - b[0] || a[1] - b[1]; });
      var lower = [];
      for (var i = 0; i < points.length; i++) {
        while (lower.length >= 2 && cross(lower[lower.length - 2], lower[lower.length - 1], points[i]) <= 0)
          lower.pop();
        lower.push(points[i]);
      }
      var upper = [];
      for (var i = points.length - 1; i >= 0; i--) {
        while (upper.length >= 2 && cross(upper[upper.length - 2], upper[upper.length - 1], points[i]) <= 0)
          upper.pop();
        upper.push(points[i]);
      }
      upper.pop(); lower.pop();
      return lower.concat(upper);
    }
    function cross(O, A, B) {
      return (A[0] - O[0]) * (B[1] - O[1]) - (A[1] - O[1]) * (B[0] - O[0]);
    }

    // ── Draw ownership hulls (behind everything) ──────────────────────
    if (showOwnership) {
      OWNERSHIP_GROUPS.forEach(function(group) {
        var pts = [];
        group.members.forEach(function(mid) {
          if (nodeMap[mid]) {
            var n = nodeMap[mid];
            var pad = 35;
            pts.push([n.x - pad, n.y - pad]);
            pts.push([n.x + pad, n.y - pad]);
            pts.push([n.x - pad, n.y + pad]);
            pts.push([n.x + pad, n.y + pad]);
          }
        });
        if (pts.length < 6) return;
        var hull = convexHull(pts);
        var pathD = 'M ' + hull.map(function(p) { return p[0] + ',' + p[1]; }).join(' L ') + ' Z';
        var hullPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        hullPath.setAttribute('d', pathD);
        hullPath.setAttribute('fill', group.color);
        hullPath.setAttribute('stroke', group.stroke);
        hullPath.setAttribute('stroke-width', '2');
        hullPath.setAttribute('stroke-dasharray', '6,4');

        var title = document.createElementNS('http://www.w3.org/2000/svg', 'title');
        title.textContent = group.label + '\n' + group.note;
        hullPath.appendChild(title);
        svg.appendChild(hullPath);

        // Hull label
        var cx = 0, cy = 0;
        hull.forEach(function(p) { cx += p[0]; cy += p[1]; });
        cx /= hull.length; cy /= hull.length;
        var hullLabel = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        hullLabel.setAttribute('x', cx);
        hullLabel.setAttribute('y', cy - (Math.max.apply(null, hull.map(function(p) { return p[1]; })) - cy) - 8);
        hullLabel.setAttribute('text-anchor', 'middle');
        hullLabel.setAttribute('fill', group.stroke);
        hullLabel.setAttribute('font-size', '10');
        hullLabel.setAttribute('font-weight', '600');
        hullLabel.setAttribute('font-style', 'italic');
        hullLabel.textContent = group.label;
        svg.appendChild(hullLabel);
      });
    }

    // ── Draw cyclic oversight paths (behind nodes, above hulls) ───────
    if (showCycles) {
      OVERSIGHT_CYCLES.forEach(function(cycle) {
        var pts = [];
        var allVisible = true;
        cycle.path.forEach(function(nid) {
          if (!nodeMap[nid]) { allVisible = false; return; }
          pts.push(nodeMap[nid]);
        });
        if (!allVisible || pts.length < 3) return;

        // Draw animated cycle path
        var pathParts = [];
        for (var i = 0; i < pts.length; i++) {
          var from = pts[i];
          var to = pts[(i + 1) % pts.length];
          if (i === 0) pathParts.push('M ' + from.x + ',' + from.y);
          pathParts.push('L ' + to.x + ',' + to.y);
        }
        var cyclePath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        cyclePath.setAttribute('d', pathParts.join(' '));
        cyclePath.setAttribute('fill', 'none');
        cyclePath.setAttribute('stroke', '#e67e22');
        cyclePath.setAttribute('stroke-width', '3');
        cyclePath.setAttribute('stroke-opacity', '0.7');
        cyclePath.setAttribute('stroke-dasharray', '8,4');
        cyclePath.setAttribute('marker-mid', 'url(#cycle-arrow)');

        // Animate the dash
        var animate = document.createElementNS('http://www.w3.org/2000/svg', 'animate');
        animate.setAttribute('attributeName', 'stroke-dashoffset');
        animate.setAttribute('from', '24');
        animate.setAttribute('to', '0');
        animate.setAttribute('dur', '1.5s');
        animate.setAttribute('repeatCount', 'indefinite');
        cyclePath.appendChild(animate);

        var title = document.createElementNS('http://www.w3.org/2000/svg', 'title');
        title.textContent = cycle.label + '\n' + cycle.note;
        cyclePath.appendChild(title);
        svg.appendChild(cyclePath);

        // Cycle label at centroid
        var cx = 0, cy = 0;
        pts.forEach(function(p) { cx += p.x; cy += p.y; });
        cx /= pts.length; cy /= pts.length;
        var bg = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        var labelText = cycle.label;
        bg.setAttribute('x', cx - labelText.length * 3);
        bg.setAttribute('y', cy - 8);
        bg.setAttribute('width', labelText.length * 6);
        bg.setAttribute('height', 14);
        bg.setAttribute('rx', 3);
        bg.setAttribute('fill', 'rgba(230,126,34,0.15)');
        bg.setAttribute('stroke', 'rgba(230,126,34,0.4)');
        bg.setAttribute('stroke-width', '1');
        svg.appendChild(bg);

        var cycleLabel = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        cycleLabel.setAttribute('x', cx);
        cycleLabel.setAttribute('y', cy + 3);
        cycleLabel.setAttribute('text-anchor', 'middle');
        cycleLabel.setAttribute('fill', '#e67e22');
        cycleLabel.setAttribute('font-size', '9');
        cycleLabel.setAttribute('font-weight', '600');
        cycleLabel.textContent = cycle.label;
        svg.appendChild(cycleLabel);
      });

      // Add arrow marker definition for cycles
      var defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
      var marker = document.createElementNS('http://www.w3.org/2000/svg', 'marker');
      marker.setAttribute('id', 'cycle-arrow');
      marker.setAttribute('viewBox', '0 0 10 10');
      marker.setAttribute('refX', '5'); marker.setAttribute('refY', '5');
      marker.setAttribute('markerWidth', '6'); marker.setAttribute('markerHeight', '6');
      marker.setAttribute('orient', 'auto');
      var arrowPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      arrowPath.setAttribute('d', 'M 0 0 L 10 5 L 0 10 z');
      arrowPath.setAttribute('fill', '#e67e22');
      marker.appendChild(arrowPath);
      defs.appendChild(marker);
      svg.insertBefore(defs, svg.firstChild);
    }

    // ── Arrow marker definitions for flow directions ────────────────
    var defs = svg.querySelector('defs') || document.createElementNS('http://www.w3.org/2000/svg', 'defs');
    if (!defs.parentNode) svg.insertBefore(defs, svg.firstChild);

    // Create arrow markers for each flow color
    Object.keys(FLOW_COLORS).forEach(function(ft) {
      var marker = document.createElementNS('http://www.w3.org/2000/svg', 'marker');
      marker.setAttribute('id', 'arrow-' + ft);
      marker.setAttribute('viewBox', '0 0 10 10');
      marker.setAttribute('refX', '28'); marker.setAttribute('refY', '5');
      marker.setAttribute('markerWidth', '5'); marker.setAttribute('markerHeight', '5');
      marker.setAttribute('orient', 'auto');
      var arrowP = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      arrowP.setAttribute('d', 'M 0 0 L 10 5 L 0 10 z');
      arrowP.setAttribute('fill', FLOW_COLORS[ft]);
      arrowP.setAttribute('opacity', '0.8');
      marker.appendChild(arrowP);
      defs.appendChild(marker);
    });
    // Default arrow
    var defMarker = document.createElementNS('http://www.w3.org/2000/svg', 'marker');
    defMarker.setAttribute('id', 'arrow-default');
    defMarker.setAttribute('viewBox', '0 0 10 10');
    defMarker.setAttribute('refX', '28'); defMarker.setAttribute('refY', '5');
    defMarker.setAttribute('markerWidth', '4'); defMarker.setAttribute('markerHeight', '4');
    defMarker.setAttribute('orient', 'auto');
    var defArrowP = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    defArrowP.setAttribute('d', 'M 0 0 L 10 5 L 0 10 z');
    defArrowP.setAttribute('fill', '#95a5a6');
    defArrowP.setAttribute('opacity', '0.5');
    defMarker.appendChild(defArrowP);
    defs.appendChild(defMarker);

    // ── Draw links ────────────────────────────────────────────────────
    var linkElements = [];
    filteredLinks.forEach(function(link) {
      var s = nodeMap[link.source];
      var t = nodeMap[link.target];
      if (!s || !t) return;

      var flowActive = activeFlows && link.flow;
      var isFlowMatch = !activeFlows || (activeFlows && activeFlows[link.flow]);
      var useFlowColor = activeFlows && link.flow;

      var line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      line.setAttribute('x1', s.x); line.setAttribute('y1', s.y);
      line.setAttribute('x2', t.x); line.setAttribute('y2', t.y);

      if (useFlowColor && isFlowMatch) {
        line.setAttribute('stroke', FLOW_COLORS[link.flow]);
        line.setAttribute('stroke-width', '3');
        line.setAttribute('stroke-opacity', '0.8');
        line.setAttribute('marker-end', 'url(#arrow-' + link.flow + ')');
      } else if (activeFlows && !isFlowMatch) {
        line.setAttribute('stroke', '#555');
        line.setAttribute('stroke-width', '1');
        line.setAttribute('stroke-opacity', '0.1');
      } else {
        line.setAttribute('stroke', LINK_COLORS[link.type] || '#95a5a6');
        line.setAttribute('stroke-width', link.type === 'money' ? '3' : '1.5');
        line.setAttribute('stroke-opacity', '0.5');
        if (activeFlows) line.setAttribute('marker-end', 'url(#arrow-default)');
      }

      line.dataset.source = link.source;
      line.dataset.target = link.target;
      line.dataset.flow = link.flow || '';
      svg.appendChild(line);
      linkElements.push(line);
    });

    // ── Draw nodes ────────────────────────────────────────────────────
    var nodeElements = {};
    nodes.forEach(function(n) {
      var g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
      g.setAttribute('transform', 'translate(' + n.x + ',' + n.y + ')');
      g.style.transition = 'opacity 0.2s';
      if (n.url) {
        g.style.cursor = 'pointer';
        g.addEventListener('click', function(e) {
          e.stopPropagation();
          window.location.href = n.url;
        });
      }

      var r = n.tier <= 1 ? 24 : (n.type === 'school' || n.type === 'entity' ? 18 : 15);
      var circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      circle.setAttribute('r', r);
      circle.setAttribute('fill', COLORS[n.type] || '#95a5a6');
      circle.setAttribute('stroke', '#fff');
      circle.setAttribute('stroke-width', '2.5');
      circle.style.transition = 'r 0.2s, stroke-width 0.2s';
      g.appendChild(circle);

      var text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      text.setAttribute('dy', r + 14);
      text.setAttribute('text-anchor', 'middle');
      text.setAttribute('fill', 'currentColor');
      text.setAttribute('font-size', n.tier <= 1 ? '12' : '10');
      text.setAttribute('font-weight', n.tier <= 1 ? '700' : '500');
      text.textContent = n.label;
      g.appendChild(text);

      var title = document.createElementNS('http://www.w3.org/2000/svg', 'title');
      title.textContent = n.label + '\n' + n.detail;
      g.appendChild(title);

      // Hover info panel
      g.addEventListener('mouseenter', function() {
        highlightNode(n.id);
        showInfo(n);
      });
      g.addEventListener('mouseleave', function() {
        clearHighlight();
        hideInfo();
      });

      svg.appendChild(g);
      nodeElements[n.id] = { group: g, circle: circle };
    });

    // ── Hover highlighting ────────────────────────────────────────────
    function highlightNode(id) {
      var neighbors = adjacency[id] || new Set();
      Object.keys(nodeElements).forEach(function(nid) {
        var el = nodeElements[nid];
        if (nid === id) {
          el.group.style.opacity = '1';
          el.circle.setAttribute('stroke-width', '4');
        } else if (neighbors.has(nid)) {
          el.group.style.opacity = '1';
          el.circle.setAttribute('stroke-width', '3');
        } else {
          el.group.style.opacity = '0.15';
        }
      });
      linkElements.forEach(function(line) {
        if (line.dataset.source === id || line.dataset.target === id) {
          line.setAttribute('stroke-opacity', '0.9');
          line.setAttribute('stroke-width', line.getAttribute('stroke-width') === '3' ? '4' : '3');
        } else {
          line.setAttribute('stroke-opacity', '0.08');
        }
      });
    }

    function clearHighlight() {
      Object.keys(nodeElements).forEach(function(nid) {
        nodeElements[nid].group.style.opacity = '1';
        nodeElements[nid].circle.setAttribute('stroke-width', '2.5');
      });
      linkElements.forEach(function(line) {
        line.setAttribute('stroke-opacity', '0.5');
        var isMoney = line.getAttribute('stroke') === LINK_COLORS.money;
        line.setAttribute('stroke-width', isMoney ? '3' : '1.5');
      });
    }

    // ── Info panel on hover ───────────────────────────────────────────
    var infoPanel = container.querySelector('.graph-info');
    if (!infoPanel) {
      infoPanel = document.createElement('div');
      infoPanel.className = 'graph-info';
      infoPanel.style.cssText = 'position:absolute;top:12px;right:12px;background:rgba(0,0,0,0.85);' +
        'color:#fff;padding:12px 16px;border-radius:8px;font-size:12px;max-width:280px;' +
        'pointer-events:none;opacity:0;transition:opacity 0.2s;z-index:10;line-height:1.5;';
      container.style.position = 'relative';
      container.appendChild(infoPanel);
    }

    function showInfo(n) {
      var connCount = (adjacency[n.id] || new Set()).size;
      var nexusStr = (n.nexus && n.nexus.length) ? n.nexus.map(function(x) {
        return '<span style="color:' + NEXUS_COLORS[x] + '">' + x + '</span>';
      }).join(' · ') : 'none';

      // Find ownership groups containing this node
      var ownershipInfo = '';
      OWNERSHIP_GROUPS.forEach(function(g) {
        if (g.members.indexOf(n.id) !== -1) {
          ownershipInfo += '<br><span style="color:#e74c3c;font-size:10px;">⬡ ' + g.note + '</span>';
        }
      });

      // Find cycles containing this node
      var cycleInfo = '';
      OVERSIGHT_CYCLES.forEach(function(c) {
        if (c.path.indexOf(n.id) !== -1) {
          cycleInfo += '<br><span style="color:#e67e22;font-size:10px;">⟳ ' + c.label + '</span>';
        }
      });

      // Flow summary — what flows IN and OUT of this node
      var flowIn = { money: 0, power: 0, influence: 0, position: 0 };
      var flowOut = { money: 0, power: 0, influence: 0, position: 0 };
      filteredLinks.forEach(function(l) {
        if (l.flow) {
          if (l.target === n.id && flowIn[l.flow] !== undefined) flowIn[l.flow]++;
          if (l.source === n.id && flowOut[l.flow] !== undefined) flowOut[l.flow]++;
        }
      });
      var flowParts = [];
      Object.keys(FLOW_COLORS).forEach(function(ft) {
        if (flowIn[ft] || flowOut[ft]) {
          var parts = [];
          if (flowIn[ft]) parts.push(flowIn[ft] + ' in');
          if (flowOut[ft]) parts.push(flowOut[ft] + ' out');
          flowParts.push('<span style="color:' + FLOW_COLORS[ft] + '">' +
            FLOW_ICONS[ft] + ' ' + ft + ': ' + parts.join(', ') + '</span>');
        }
      });
      var flowInfo = flowParts.length ?
        '<br><span style="font-size:10px;">' + flowParts.join(' · ') + '</span>' : '';

      infoPanel.innerHTML = '<strong style="font-size:14px;">' + n.label + '</strong><br>' +
        '<span style="opacity:0.7">' + n.detail + '</span><br>' +
        '<span style="opacity:0.5;font-size:10px;">' + connCount + ' connections · Nexus: ' + nexusStr + '</span>' +
        flowInfo + ownershipInfo + cycleInfo +
        (n.url ? '<br><span style="opacity:0.4;font-size:10px;">Click to view page →</span>' : '');
      infoPanel.style.opacity = '1';
    }

    function hideInfo() {
      infoPanel.style.opacity = '0';
    }

    // ── Legend ─────────────────────────────────────────────────────────
    var legendY = 20;
    var legend = [
      { color: COLORS.actor, label: 'Enterprise principals' },
      { color: COLORS.judge, label: 'Judicial cover' },
      { color: COLORS.political, label: 'Political enablers' },
      { color: COLORS.school, label: 'Schools' },
      { color: COLORS.entity, label: 'Shell entities' },
      { color: COLORS.bmf, label: 'BMF connection' },
      { color: COLORS.institutional, label: 'Institutional (FOIA)' },
    ];
    legend.forEach(function(item) {
      var c = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      c.setAttribute('cx', 20); c.setAttribute('cy', legendY);
      c.setAttribute('r', 6); c.setAttribute('fill', item.color);
      svg.appendChild(c);
      var t = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      t.setAttribute('x', 32); t.setAttribute('y', legendY + 4);
      t.setAttribute('fill', 'currentColor'); t.setAttribute('font-size', '10');
      t.setAttribute('font-weight', '500');
      t.textContent = item.label;
      svg.appendChild(t);
      legendY += 20;
    });

    // Flow legend when active
    if (activeFlows) {
      legendY += 8;
      Object.keys(FLOW_COLORS).forEach(function(ft) {
        if (activeFlows[ft]) {
          var fl = document.createElementNS('http://www.w3.org/2000/svg', 'line');
          fl.setAttribute('x1', 14); fl.setAttribute('y1', legendY);
          fl.setAttribute('x2', 26); fl.setAttribute('y2', legendY);
          fl.setAttribute('stroke', FLOW_COLORS[ft]);
          fl.setAttribute('stroke-width', '3');
          fl.setAttribute('marker-end', 'url(#arrow-' + ft + ')');
          svg.appendChild(fl);
          var ftText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
          ftText.setAttribute('x', 32); ftText.setAttribute('y', legendY + 4);
          ftText.setAttribute('fill', FLOW_COLORS[ft]); ftText.setAttribute('font-size', '10');
          ftText.setAttribute('font-weight', '600');
          ftText.textContent = FLOW_ICONS[ft] + ' ' + ft.charAt(0).toUpperCase() + ft.slice(1);
          svg.appendChild(ftText);
          legendY += 20;
        }
      });
    }

    // Layer legend additions
    if (showOwnership || showCycles) {
      legendY += 8;
      if (showOwnership) {
        var oc = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        oc.setAttribute('x', 14); oc.setAttribute('y', legendY - 5);
        oc.setAttribute('width', 12); oc.setAttribute('height', 10);
        oc.setAttribute('rx', 2);
        oc.setAttribute('fill', 'rgba(192,57,43,0.15)');
        oc.setAttribute('stroke', 'rgba(192,57,43,0.5)');
        oc.setAttribute('stroke-width', '1.5');
        oc.setAttribute('stroke-dasharray', '3,2');
        svg.appendChild(oc);
        var ot = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        ot.setAttribute('x', 32); ot.setAttribute('y', legendY + 4);
        ot.setAttribute('fill', 'currentColor'); ot.setAttribute('font-size', '10');
        ot.setAttribute('font-weight', '500');
        ot.textContent = 'Ownership hull';
        svg.appendChild(ot);
        legendY += 20;
      }
      if (showCycles) {
        var cl = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        cl.setAttribute('x1', 14); cl.setAttribute('y1', legendY);
        cl.setAttribute('x2', 26); cl.setAttribute('y2', legendY);
        cl.setAttribute('stroke', '#e67e22');
        cl.setAttribute('stroke-width', '2');
        cl.setAttribute('stroke-dasharray', '4,2');
        svg.appendChild(cl);
        var ct = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        ct.setAttribute('x', 32); ct.setAttribute('y', legendY + 4);
        ct.setAttribute('fill', 'currentColor'); ct.setAttribute('font-size', '10');
        ct.setAttribute('font-weight', '500');
        ct.textContent = 'Cyclic "oversight"';
        svg.appendChild(ct);
        legendY += 20;
      }
    }

    // Node count summary
    var countText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    countText.setAttribute('x', width - 10); countText.setAttribute('y', height - 10);
    countText.setAttribute('text-anchor', 'end');
    countText.setAttribute('fill', 'currentColor'); countText.setAttribute('font-size', '10');
    countText.setAttribute('opacity', '0.4');
    var layerInfo = [];
    if (showOwnership) layerInfo.push(OWNERSHIP_GROUPS.length + ' ownership groups');
    if (showCycles) layerInfo.push(OVERSIGHT_CYCLES.length + ' cycles');
    if (activeFlows) {
      var flowCounts = {};
      filteredLinks.forEach(function(l) {
        if (l.flow && activeFlows[l.flow]) flowCounts[l.flow] = (flowCounts[l.flow] || 0) + 1;
      });
      var fc = Object.keys(flowCounts).map(function(f) { return flowCounts[f] + ' ' + f; });
      if (fc.length) layerInfo.push(fc.join(', '));
    }
    countText.textContent = filteredNodes.length + ' nodes · ' + filteredLinks.length + ' edges' +
      (layerInfo.length ? ' · ' + layerInfo.join(' · ') : '');
    svg.appendChild(countText);
  }

  // ── Initialize ────────────────────────────────────────────────────────

  function init() {
    var container = document.getElementById('network-graph');
    if (!container) return;

    // Try petalTongue API first, fall back to static
    fetch('/api/public-record/network')
      .then(function(r) { return r.ok ? r.json() : Promise.reject('no API'); })
      .then(function(data) { renderGraph(container, data); })
      .catch(function() { renderGraph(container, STATIC_GRAPH); });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
