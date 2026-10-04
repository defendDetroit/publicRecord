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
      // Banks controls everything
      { source: 'banks', target: 'pca', type: 'controls', label: 'superintendent' },
      { source: 'banks', target: 'macdowell', type: 'controls', label: 'superintendent' },
      { source: 'banks', target: 'purpose_group', type: 'controls', label: 'sole member' },
      { source: 'banks', target: 'purpose_foundation', type: 'controls', label: 'president + director' },
      { source: 'banks', target: 'banks_strategy', type: 'controls', label: 'agent' },

      // Holland financial roles
      { source: 'holland', target: 'purpose_foundation', type: 'financial', label: 'secretary + treasurer' },
      { source: 'holland', target: 'pacs', type: 'financial', label: 'PAC treasurer' },

      // Co-residence
      { source: 'banks', target: 'holland', type: 'associate', label: 'co-resident, all entities' },

      // Money flow
      { source: 'pca', target: 'purpose_group', type: 'money', label: 'management fee' },
      { source: 'macdowell', target: 'purpose_group', type: 'money', label: '72.67% ($4.28M)' },

      // Judicial connections
      { source: 'miller', target: 'banks', type: 'judicial', label: 'Board Chair' },
      { source: 'yancey', target: 'banks_strategy', type: 'judicial', label: '$383.82 payment' },
      { source: 'sabree', target: 'banks', type: 'judicial', label: 'MSU Law 2010' },
      { source: 'perkins_d', target: 'banks', type: 'judicial', label: 'family donations' },

      // Political
      { source: 'gay_dagnogo', target: 'pca', type: 'political', label: 'DPSCD authorizer' },
      { source: 'gay_dagnogo', target: 'banks', type: 'political', label: 'CBC honoree, HD-1 successor' },

      // BMF lineage
      { source: 'od_banks', target: 'banks', type: 'family', label: 'father' },
      { source: 'welch', target: 'od_banks', type: 'family', label: 'BMF network' },

      // FOIA-revealed connections (Layer 2)
      { source: 'wells_stallworth', target: 'macdowell', type: 'controls', label: 'Board President ≥2014' },
      { source: 'wells_stallworth', target: 'banks', type: 'associate', label: 'received investigation, protected' },
      { source: 'mde', target: 'banks', type: 'institutional', label: 'HOLD on permit #590606' },
      { source: 'mde', target: 'macdowell', type: 'institutional', label: 'investigated Feb 2022, cleared' },
      { source: 'schmiedeknecht', target: 'mde', type: 'institutional', label: 'analyst, OEE' },
      { source: 'alan_young', target: 'macdowell', type: 'financial', label: 'auditor 9yr (FY17-25)' },
      { source: 'macdowell', target: 'banks', type: 'money', label: 'School Admin $667K' },

      // Nexus 2: Political Capture
      { source: 'sheffield', target: 'bettison', type: 'political', label: 'appointed chief' },
      { source: 'sheffield', target: 'banks', type: 'political', label: 'endorsed' },
      { source: 'evans', target: 'banks', type: 'political', label: 'endorsed' },
      { source: 'sabree_e', target: 'banks', type: 'political', label: 'endorsed' },
      { source: 'inner_link', target: 'banks', type: 'money', label: '$39K Banks for Senate' },
      { source: 'inner_link', target: 'yancey', type: 'money', label: '$8K Yancey campaign' },
      { source: 'mccastle', target: 'banks', type: 'money', label: '$9,450 Banks for Senate' },
      { source: 'mccastle', target: 'gay_dagnogo', type: 'money', label: '$1K Strong Women PAC' },
      { source: 'johnson_l', target: 'pca', type: 'controls', label: 'Board Secretary' },
      { source: 'inner_link', target: 'johnson_l', type: 'money', label: '$850 campaign' },

      // Nexus 3: Police Weaponization
      { source: 'bettison', target: 'dpsa', type: 'controls', label: 'Board Secretary' },
      { source: 'bettison', target: 'sheffield', type: 'political', label: 'OIG probe — phone call' },
      { source: 'fiore', target: 'banks', type: 'associate', label: 'FBI wiretap: "bid-rigging"' },
      { source: 'spivey', target: 'fiore', type: 'associate', label: 'Op Northern Hook' },
      { source: 'perkins_t', target: 'banks', type: 'associate', label: 'defense attorney' },
      { source: 'perkins_t', target: 'fiore', type: 'associate', label: 'donated $500' },
      { source: 'gay_dagnogo', target: 'perkins_t', type: 'money', label: '$750 mayor campaign' },

      // Nexus 4: Legislative Pipeline
      { source: 'stallworth_t', target: 'wells_stallworth', type: 'family', label: 'married' },
      { source: 'stallworth_t', target: 'banks', type: 'political', label: 'defended at rally, $1,250' },
      { source: 'moreland', target: 'pca', type: 'controls', label: 'Board Vice Chair' },
      { source: 'moreland', target: 'banks', type: 'judicial', label: 'AAG argued against cert → joined board' },
      { source: 'miller', target: 'pca', type: 'controls', label: 'Board Chair' },
    ]
  };

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

  var NEXUS_COLORS = {
    education: '#27ae60',
    political: '#2980b9',
    police: '#c0392b',
    legislative: '#f39c12',
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

    // ── Draw links ────────────────────────────────────────────────────
    var linkElements = [];
    filteredLinks.forEach(function(link) {
      var s = nodeMap[link.source];
      var t = nodeMap[link.target];
      if (!s || !t) return;
      var line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      line.setAttribute('x1', s.x); line.setAttribute('y1', s.y);
      line.setAttribute('x2', t.x); line.setAttribute('y2', t.y);
      line.setAttribute('stroke', LINK_COLORS[link.type] || '#95a5a6');
      line.setAttribute('stroke-width', link.type === 'money' ? '3' : '1.5');
      line.setAttribute('stroke-opacity', '0.5');
      line.dataset.source = link.source;
      line.dataset.target = link.target;
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
      infoPanel.innerHTML = '<strong style="font-size:14px;">' + n.label + '</strong><br>' +
        '<span style="opacity:0.7">' + n.detail + '</span><br>' +
        '<span style="opacity:0.5;font-size:10px;">' + connCount + ' connections · Nexus: ' + nexusStr + '</span>' +
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

    // Node count summary
    var countText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    countText.setAttribute('x', width - 10); countText.setAttribute('y', height - 10);
    countText.setAttribute('text-anchor', 'end');
    countText.setAttribute('fill', 'currentColor'); countText.setAttribute('font-size', '10');
    countText.setAttribute('opacity', '0.4');
    countText.textContent = filteredNodes.length + ' nodes · ' + filteredLinks.length + ' edges';
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
