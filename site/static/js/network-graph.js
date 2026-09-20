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
        detail: '9 convictions (6 felony, 3 misd.)', url: '/network/actors/brian-banks/' },
      { id: 'holland', label: 'Joseph Holland Jr.', tier: 1, type: 'actor',
        detail: 'Drug offender, MDOC #443789', url: '/network/actors/joseph-holland/' },

      // Tier 2: Judicial Cover
      { id: 'miller', label: 'Judge C. Miller', tier: 2, type: 'judge',
        detail: 'Board Chair, Anchor Rock Foundation', url: '/network/judges/cylenthia-miller/' },
      { id: 'yancey', label: 'Judge T. Yancey', tier: 2, type: 'judge',
        detail: 'Campaign paid $2,283 to Banks Strategy', url: '/network/judges/tenisha-yancey/' },
      { id: 'sabree', label: 'Judge A. Sabree', tier: 2, type: 'judge',
        detail: 'MSU Law classmate (2010)', url: '/network/judges/aliyah-sabree/' },
      { id: 'perkins_d', label: 'Judge D. Perkins', tier: 2, type: 'judge',
        detail: 'Family donations, Probate overlap', url: '/network/judges/david-perkins/' },

      // Tier 3: Political
      { id: 'gay_dagnogo', label: 'S. Gay-Dagnogo', tier: 3, type: 'political',
        detail: 'DPSCD Board, succeeded Banks in HD-1', url: '/network/political/sherry-gay-dagnogo/' },

      // Tier 5: BMF
      { id: 'od_banks', label: 'OD Banks', tier: 5, type: 'bmf',
        detail: 'BMF Defendant #22, Banks\' father', url: null },
      { id: 'welch', label: 'Tonesa Welch', tier: 5, type: 'bmf',
        detail: 'BMF figure, Banks\' aunt', url: null },

      // Entities
      { id: 'pca', label: 'Purpose Charter Academy', tier: 0, type: 'school',
        detail: 'K-8, DPSCD authorized', url: '/network/entities/purpose-charter-academy/' },
      { id: 'macdowell', label: 'MacDowell Prep', tier: 0, type: 'school',
        detail: '$4.9M revenue, 72.67% extracted', url: '/network/entities/macdowell-prep/' },
      { id: 'purpose_group', label: 'Purpose Group LLC', tier: 0, type: 'entity',
        detail: 'CMO — takes 72.67% of revenue', url: '/network/entities/purpose-group-llc/' },
      { id: 'purpose_foundation', label: 'Purpose Foundation', tier: 0, type: 'entity',
        detail: '501(c)(3), 2 felons in all positions', url: '/network/entities/purpose-foundation/' },
      { id: 'banks_strategy', label: 'Banks Strategy LLC', tier: 0, type: 'entity',
        detail: 'Receives judge campaign payments', url: '/network/entities/banks-strategy-llc/' },
      { id: 'pacs', label: 'PACs', tier: 0, type: 'entity',
        detail: '$14.5K+ fines, felon treasurer', url: '/network/entities/political-action-committees/' },
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
      { source: 'yancey', target: 'banks_strategy', type: 'judicial', label: '$2,283 payment' },
      { source: 'sabree', target: 'banks', type: 'judicial', label: 'MSU Law 2010' },
      { source: 'perkins_d', target: 'banks', type: 'judicial', label: 'family donations' },

      // Political
      { source: 'gay_dagnogo', target: 'pca', type: 'political', label: 'DPSCD authorizer' },
      { source: 'gay_dagnogo', target: 'banks', type: 'political', label: 'CBC honoree, HD-1 successor' },

      // BMF lineage
      { source: 'od_banks', target: 'banks', type: 'family', label: 'father' },
      { source: 'welch', target: 'od_banks', type: 'family', label: 'BMF network' },
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
  };

  const LINK_COLORS = {
    controls: '#95a5a6',
    financial: '#f39c12',
    associate: '#e74c3c',
    money: '#27ae60',
    judicial: '#8e44ad',
    political: '#2980b9',
    family: '#c0392b',
  };

  // ── Render ────────────────────────────────────────────────────────────

  function renderGraph(container, data) {
    var width = container.clientWidth || 800;
    var height = Math.max(500, width * 0.6);

    var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('viewBox', '0 0 ' + width + ' ' + height);
    svg.setAttribute('width', '100%');
    svg.setAttribute('height', height);
    svg.setAttribute('role', 'img');
    svg.setAttribute('aria-label', 'Banks Enterprise network graph — actors, judges, entities, and their connections');
    container.innerHTML = '';
    container.appendChild(svg);

    // Simple force-directed layout (no D3 dependency)
    var nodes = data.nodes.map(function(n, i) {
      var angle = (2 * Math.PI * i) / data.nodes.length;
      var radius = Math.min(width, height) * 0.35;
      return Object.assign({}, n, {
        x: width / 2 + radius * Math.cos(angle) * (0.5 + n.tier * 0.15),
        y: height / 2 + radius * Math.sin(angle) * (0.5 + n.tier * 0.15),
        vx: 0, vy: 0
      });
    });

    var nodeMap = {};
    nodes.forEach(function(n) { nodeMap[n.id] = n; });

    // Simple force simulation (50 iterations)
    for (var iter = 0; iter < 80; iter++) {
      // Repulsion between all nodes
      for (var i = 0; i < nodes.length; i++) {
        for (var j = i + 1; j < nodes.length; j++) {
          var dx = nodes[j].x - nodes[i].x;
          var dy = nodes[j].y - nodes[i].y;
          var dist = Math.sqrt(dx * dx + dy * dy) || 1;
          var force = 8000 / (dist * dist);
          var fx = (dx / dist) * force;
          var fy = (dy / dist) * force;
          nodes[i].vx -= fx; nodes[i].vy -= fy;
          nodes[j].vx += fx; nodes[j].vy += fy;
        }
      }
      // Attraction along links
      data.links.forEach(function(link) {
        var s = nodeMap[link.source];
        var t = nodeMap[link.target];
        if (!s || !t) return;
        var dx = t.x - s.x;
        var dy = t.y - s.y;
        var dist = Math.sqrt(dx * dx + dy * dy) || 1;
        var force = (dist - 120) * 0.02;
        var fx = (dx / dist) * force;
        var fy = (dy / dist) * force;
        s.vx += fx; s.vy += fy;
        t.vx -= fx; t.vy -= fy;
      });
      // Center gravity
      nodes.forEach(function(n) {
        n.vx += (width / 2 - n.x) * 0.005;
        n.vy += (height / 2 - n.y) * 0.005;
        n.x += n.vx * 0.3;
        n.y += n.vy * 0.3;
        n.vx *= 0.8; n.vy *= 0.8;
        n.x = Math.max(60, Math.min(width - 60, n.x));
        n.y = Math.max(30, Math.min(height - 30, n.y));
      });
    }

    // Draw links
    data.links.forEach(function(link) {
      var s = nodeMap[link.source];
      var t = nodeMap[link.target];
      if (!s || !t) return;
      var line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      line.setAttribute('x1', s.x); line.setAttribute('y1', s.y);
      line.setAttribute('x2', t.x); line.setAttribute('y2', t.y);
      line.setAttribute('stroke', LINK_COLORS[link.type] || '#95a5a6');
      line.setAttribute('stroke-width', link.type === 'money' ? '3' : '1.5');
      line.setAttribute('stroke-opacity', '0.6');
      svg.appendChild(line);
    });

    // Draw nodes
    nodes.forEach(function(n) {
      var g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
      g.setAttribute('transform', 'translate(' + n.x + ',' + n.y + ')');
      if (n.url) {
        g.style.cursor = 'pointer';
        g.addEventListener('click', function() { window.location.href = n.url; });
      }

      var r = n.tier <= 1 ? 22 : (n.type === 'school' || n.type === 'entity' ? 16 : 14);
      var circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      circle.setAttribute('r', r);
      circle.setAttribute('fill', COLORS[n.type] || '#95a5a6');
      circle.setAttribute('stroke', '#fff');
      circle.setAttribute('stroke-width', '2');
      g.appendChild(circle);

      var text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      text.setAttribute('dy', r + 14);
      text.setAttribute('text-anchor', 'middle');
      text.setAttribute('fill', 'currentColor');
      text.setAttribute('font-size', n.tier <= 1 ? '11' : '9');
      text.setAttribute('font-weight', n.tier <= 1 ? '700' : '400');
      text.textContent = n.label;
      g.appendChild(text);

      // Tooltip on hover
      var title = document.createElementNS('http://www.w3.org/2000/svg', 'title');
      title.textContent = n.label + '\n' + n.detail;
      g.appendChild(title);

      svg.appendChild(g);
    });

    // Legend
    var legendY = 20;
    var legend = [
      { color: COLORS.actor, label: 'Enterprise principals' },
      { color: COLORS.judge, label: 'Judicial cover' },
      { color: COLORS.political, label: 'Political enablers' },
      { color: COLORS.school, label: 'Schools' },
      { color: COLORS.entity, label: 'Shell entities' },
      { color: COLORS.bmf, label: 'BMF connection' },
    ];
    legend.forEach(function(item) {
      var c = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      c.setAttribute('cx', 20); c.setAttribute('cy', legendY);
      c.setAttribute('r', 5); c.setAttribute('fill', item.color);
      svg.appendChild(c);
      var t = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      t.setAttribute('x', 30); t.setAttribute('y', legendY + 4);
      t.setAttribute('fill', 'currentColor'); t.setAttribute('font-size', '10');
      t.textContent = item.label;
      svg.appendChild(t);
      legendY += 18;
    });
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
