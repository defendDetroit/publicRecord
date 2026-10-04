// Geographic extraction map for detroit.primals.eco
// Multi-path flow diagram showing every documented money/power route.
//
// Data source: window.DETROIT_NETWORK (loaded from network-data.js)
// Pure SVG, zero dependencies, zero tracking.

(function() {
  'use strict';

  var DN = window.DETROIT_NETWORK || {};
  var FLOW_STYLES = DN.geoFlowStyles || {};

  var TYPE_COLORS = {
    school: '#27ae60',
    extraction: '#e74c3c',
    political: '#2980b9',
    court: '#8e44ad',
    state: '#7f8c8d',
    vendor: '#f39c12',
    source: '#1abc9c',
    destination: '#c0392b',
    dark_money: '#e74c3c',
    property: '#d35400',
    entity: '#f39c12',
    actor: '#c0392b',
    judge: '#8e44ad',
    institutional: '#1abc9c',
  };

  function buildLocations() {
    var nodes = DN.nodes || [];
    var geoPos = DN.geoPositions || {};
    var geoAgg = DN.geoAggregates || [];
    var locations = [];

    var nodeMap = {};
    nodes.forEach(function(n) { nodeMap[n.id] = n; });

    var aggregatedNodes = {};
    geoAgg.forEach(function(agg) {
      (agg.aggregates || []).forEach(function(nid) { aggregatedNodes[nid] = agg.id; });
      locations.push({
        id: agg.id,
        label: agg.label,
        type: agg.type,
        px: agg.px,
        py: agg.py,
        detail: agg.detail,
      });
    });

    Object.keys(geoPos).forEach(function(nid) {
      if (aggregatedNodes[nid]) return;
      var node = nodeMap[nid];
      if (!node) return;
      var pos = geoPos[nid];
      var geoType = node.type;
      if (geoType === 'entity' && (nid === 'purpose_group' || nid === 'banks_strategy')) geoType = 'extraction';
      if (geoType === 'actor' && nid === 'banks') geoType = 'extraction';
      locations.push({
        id: nid,
        label: node.label,
        type: geoType,
        px: pos.px,
        py: pos.py,
        detail: node.detail,
      });
    });

    return locations;
  }

  function toSVG(px, py, width, height) {
    return {
      x: Math.max(70, Math.min(width - 70, px * width)),
      y: Math.max(40, Math.min(height - 50, py * height))
    };
  }

  function renderGeoMap(container) {
    var LOCATIONS = buildLocations();
    var FLOWS = DN.geoFlows || [];
    var width = container.clientWidth || 900;
    var height = Math.max(600, width * 0.65);

    container.innerHTML = '';

    var title = document.createElement('h3');
    title.style.cssText = 'text-align:center;margin:0 0 2px;font-size:16px;';
    title.textContent = 'The Extraction Map — Where Every Dollar Goes';
    container.appendChild(title);

    var subtitle = document.createElement('p');
    subtitle.style.cssText = 'text-align:center;margin:0 0 10px;font-size:11px;opacity:0.5;';
    subtitle.textContent = 'State money authorized in Lansing enters Detroit schools serving predominantly Black children. 72.67% is extracted to a Grosse Pointe Woods LLC. Dark money formed 1 block from the Capitol protects the pipeline.';
    container.appendChild(subtitle);

    var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('viewBox', '0 0 ' + width + ' ' + height);
    svg.setAttribute('width', '100%');
    svg.setAttribute('height', height);
    svg.setAttribute('role', 'img');
    svg.setAttribute('aria-label', 'Multi-path flow diagram — every documented money and power route through the Banks network');
    svg.style.cssText = 'background:rgba(0,0,0,0.03);border-radius:8px;';
    container.appendChild(svg);

    // Defs
    var defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
    Object.keys(FLOW_STYLES).forEach(function(ft) {
      var marker = document.createElementNS('http://www.w3.org/2000/svg', 'marker');
      marker.setAttribute('id', 'geo-arrow-' + ft);
      marker.setAttribute('viewBox', '0 0 10 10');
      marker.setAttribute('refX', '8'); marker.setAttribute('refY', '5');
      marker.setAttribute('markerWidth', '5'); marker.setAttribute('markerHeight', '5');
      marker.setAttribute('orient', 'auto');
      var path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      path.setAttribute('d', 'M 0 0 L 10 5 L 0 10 z');
      path.setAttribute('fill', FLOW_STYLES[ft].color);
      marker.appendChild(path);
      defs.appendChild(marker);
    });
    svg.appendChild(defs);

    // Build location map
    var locMap = {};
    LOCATIONS.forEach(function(loc) {
      var pos = toSVG(loc.px, loc.py, width, height);
      locMap[loc.id] = Object.assign({}, loc, pos);
    });

    // ── Zone backgrounds ──

    // Political infrastructure zone (left — PACs, dark money, endorsements)
    var pz = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    pz.setAttribute('x', width * 0.12); pz.setAttribute('y', height * 0.08);
    pz.setAttribute('width', width * 0.16); pz.setAttribute('height', height * 0.82);
    pz.setAttribute('rx', '10');
    pz.setAttribute('fill', 'rgba(243,156,18,0.03)');
    pz.setAttribute('stroke', 'rgba(243,156,18,0.10)');
    pz.setAttribute('stroke-width', '1');
    pz.setAttribute('stroke-dasharray', '4,4');
    svg.appendChild(pz);

    var pzLabel = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    pzLabel.setAttribute('x', width * 0.20); pzLabel.setAttribute('y', height * 0.95);
    pzLabel.setAttribute('text-anchor', 'middle');
    pzLabel.setAttribute('fill', 'rgba(243,156,18,0.15)');
    pzLabel.setAttribute('font-size', '8'); pzLabel.setAttribute('font-weight', '700');
    pzLabel.setAttribute('letter-spacing', '2');
    pzLabel.textContent = 'PROTECTION';
    svg.appendChild(pzLabel);

    // Detroit Community zone (center — schools, the children)
    var cz = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    cz.setAttribute('x', width * 0.30); cz.setAttribute('y', height * 0.12);
    cz.setAttribute('width', width * 0.16); cz.setAttribute('height', height * 0.65);
    cz.setAttribute('rx', '10');
    cz.setAttribute('fill', 'rgba(39,174,96,0.05)');
    cz.setAttribute('stroke', 'rgba(39,174,96,0.15)');
    cz.setAttribute('stroke-width', '1.5');
    cz.setAttribute('stroke-dasharray', '6,3');
    svg.appendChild(cz);

    var czLabel = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    czLabel.setAttribute('x', width * 0.38); czLabel.setAttribute('y', height * 0.83);
    czLabel.setAttribute('text-anchor', 'middle');
    czLabel.setAttribute('fill', 'rgba(39,174,96,0.20)');
    czLabel.setAttribute('font-size', '13'); czLabel.setAttribute('font-weight', '700');
    czLabel.setAttribute('letter-spacing', '2');
    czLabel.textContent = 'DETROIT';
    svg.appendChild(czLabel);

    var czSub = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    czSub.setAttribute('x', width * 0.38); czSub.setAttribute('y', height * 0.86);
    czSub.setAttribute('text-anchor', 'middle');
    czSub.setAttribute('fill', 'rgba(39,174,96,0.12)');
    czSub.setAttribute('font-size', '7'); czSub.setAttribute('font-weight', '400');
    czSub.setAttribute('letter-spacing', '1');
    czSub.textContent = '362 children · 93% Black';
    svg.appendChild(czSub);

    // Extraction zone (right of schools)
    var ez = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    ez.setAttribute('x', width * 0.48); ez.setAttribute('y', height * 0.20);
    ez.setAttribute('width', width * 0.28); ez.setAttribute('height', height * 0.70);
    ez.setAttribute('rx', '10');
    ez.setAttribute('fill', 'rgba(231,76,60,0.04)');
    ez.setAttribute('stroke', 'rgba(231,76,60,0.12)');
    ez.setAttribute('stroke-width', '1.5');
    ez.setAttribute('stroke-dasharray', '6,3');
    svg.appendChild(ez);

    var ezLabel = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    ezLabel.setAttribute('x', width * 0.62); ezLabel.setAttribute('y', height * 0.17);
    ezLabel.setAttribute('text-anchor', 'middle');
    ezLabel.setAttribute('fill', 'rgba(231,76,60,0.20)');
    ezLabel.setAttribute('font-size', '10'); ezLabel.setAttribute('font-weight', '700');
    ezLabel.setAttribute('letter-spacing', '2');
    ezLabel.textContent = 'EXTRACTION';
    svg.appendChild(ezLabel);

    // Grosse Pointe Woods — destination (where the money arrives)
    if (locMap.gpw) {
      var gpwX = locMap.gpw.x - 45, gpwY = locMap.gpw.y - 35;
      var gpw = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
      gpw.setAttribute('x', gpwX); gpw.setAttribute('y', gpwY);
      gpw.setAttribute('width', width * 0.15); gpw.setAttribute('height', height * 0.16);
      gpw.setAttribute('rx', '10');
      gpw.setAttribute('fill', 'rgba(192,57,43,0.08)');
      gpw.setAttribute('stroke', 'rgba(192,57,43,0.30)');
      gpw.setAttribute('stroke-width', '2.5');
      svg.appendChild(gpw);

      var gpwSub = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      gpwSub.setAttribute('x', gpwX + width * 0.075); gpwSub.setAttribute('y', gpwY + height * 0.16 + 12);
      gpwSub.setAttribute('text-anchor', 'middle');
      gpwSub.setAttribute('fill', 'rgba(192,57,43,0.20)');
      gpwSub.setAttribute('font-size', '7');
      gpwSub.textContent = '1968 Severn Rd — Banks/Holland residence';
      svg.appendChild(gpwSub);
    }

    // Authorization zone (far right — distant authorizers)
    var az = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    az.setAttribute('x', width * 0.86); az.setAttribute('y', height * 0.03);
    az.setAttribute('width', width * 0.13); az.setAttribute('height', height * 0.72);
    az.setAttribute('rx', '10');
    az.setAttribute('fill', 'rgba(26,188,156,0.03)');
    az.setAttribute('stroke', 'rgba(26,188,156,0.12)');
    az.setAttribute('stroke-width', '1');
    az.setAttribute('stroke-dasharray', '4,4');
    svg.appendChild(az);

    var azLabel = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    azLabel.setAttribute('x', width * 0.925); azLabel.setAttribute('y', height * 0.78);
    azLabel.setAttribute('text-anchor', 'middle');
    azLabel.setAttribute('fill', 'rgba(26,188,156,0.18)');
    azLabel.setAttribute('font-size', '7'); azLabel.setAttribute('font-weight', '700');
    azLabel.setAttribute('letter-spacing', '1');
    azLabel.textContent = 'AUTHORIZERS';
    svg.appendChild(azLabel);

    var azSub = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    azSub.setAttribute('x', width * 0.925); azSub.setAttribute('y', height * 0.81);
    azSub.setAttribute('text-anchor', 'middle');
    azSub.setAttribute('fill', 'rgba(26,188,156,0.11)');
    azSub.setAttribute('font-size', '6');
    azSub.textContent = '50-250 mi from Detroit';
    svg.appendChild(azSub);

    // Funding sources label (far left)
    var srcLabel = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    srcLabel.setAttribute('x', width * 0.06); srcLabel.setAttribute('y', height * 0.98);
    srcLabel.setAttribute('text-anchor', 'middle');
    srcLabel.setAttribute('fill', 'rgba(26,188,156,0.20)');
    srcLabel.setAttribute('font-size', '10'); srcLabel.setAttribute('font-weight', '700');
    srcLabel.setAttribute('letter-spacing', '2');
    srcLabel.textContent = 'SOURCES';
    svg.appendChild(srcLabel);

    // ── Draw flow lines (behind everything) ──
    var flowGroups = {};
    FLOWS.forEach(function(flow) {
      var ft = flow.flow_type;
      if (!flowGroups[ft]) flowGroups[ft] = [];
      flowGroups[ft].push(flow);
    });

    // Draw flows grouped by type (so similar paths layer together)
    Object.keys(flowGroups).forEach(function(ft) {
      flowGroups[ft].forEach(function(flow, idx) {
        var from = locMap[flow.from];
        var to = locMap[flow.to];
        if (!from || !to) return;

        var style = FLOW_STYLES[ft] || FLOW_STYLES.extraction || { color: '#999', width: 1.5, dash: '' };

        // Offset parallel flows slightly
        var samePathCount = flowGroups[ft].filter(function(f) {
          return f.from === flow.from && f.to === flow.to;
        }).length;
        var offset = samePathCount > 1 ? (idx % 2 === 0 ? 3 : -3) : 0;

        var line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        line.setAttribute('x1', from.x + offset); line.setAttribute('y1', from.y);
        line.setAttribute('x2', to.x + offset); line.setAttribute('y2', to.y);
        line.setAttribute('stroke', style.color);
        line.setAttribute('stroke-width', style.width);
        line.setAttribute('stroke-opacity', flow.amount > 0 ? '0.55' : '0.30');
        if (style.dash) line.setAttribute('stroke-dasharray', style.dash);
        line.setAttribute('marker-end', 'url(#geo-arrow-' + ft + ')');

        var title = document.createElementNS('http://www.w3.org/2000/svg', 'title');
        title.textContent = flow.label + '\n' + from.label + ' → ' + to.label;
        if (flow.amount) title.textContent += '\n$' + flow.amount.toLocaleString();
        line.appendChild(title);
        svg.appendChild(line);

        // Amount labels on significant flows ($100K+)
        if (flow.amount >= 100000) {
          var mx = (from.x + to.x) / 2 + offset;
          var my = (from.y + to.y) / 2;
          var angle = Math.atan2(to.y - from.y, to.x - from.x);
          var labelOffX = Math.sin(angle) * 10;
          var labelOffY = -Math.cos(angle) * 10;

          var bg = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
          var labelLen = flow.label.length * 4.5;
          bg.setAttribute('x', mx + labelOffX - labelLen / 2 - 2);
          bg.setAttribute('y', my + labelOffY - 8);
          bg.setAttribute('width', labelLen + 4);
          bg.setAttribute('height', 12);
          bg.setAttribute('rx', '3');
          bg.setAttribute('fill', 'rgba(0,0,0,0.6)');
          svg.appendChild(bg);

          var amtText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
          amtText.setAttribute('x', mx + labelOffX);
          amtText.setAttribute('y', my + labelOffY + 2);
          amtText.setAttribute('text-anchor', 'middle');
          amtText.setAttribute('fill', style.color);
          amtText.setAttribute('font-size', '8');
          amtText.setAttribute('font-weight', '700');
          amtText.textContent = flow.label;
          svg.appendChild(amtText);
        }
      });
    });

    // ── Draw location nodes ──
    var shapeElements = {};
    Object.values(locMap).forEach(function(loc) {
      var g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
      g.setAttribute('transform', 'translate(' + loc.x + ',' + loc.y + ')');

      var color = TYPE_COLORS[loc.type] || '#7f8c8d';
      var r, shape;

      if (loc.type === 'extraction' || loc.type === 'destination') {
        r = loc.type === 'destination' ? 16 : 12;
        shape = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
        shape.setAttribute('points', '0,-' + r + ' ' + r + ',0 0,' + r + ' -' + r + ',0');
        shape.setAttribute('fill', color);
        shape.setAttribute('stroke', '#fff');
        shape.setAttribute('stroke-width', '2');
      } else if (loc.type === 'source') {
        r = 10;
        shape = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        shape.setAttribute('x', -r); shape.setAttribute('y', -r * 0.7);
        shape.setAttribute('width', r * 2); shape.setAttribute('height', r * 1.4);
        shape.setAttribute('rx', '3');
        shape.setAttribute('fill', color);
        shape.setAttribute('stroke', '#fff');
        shape.setAttribute('stroke-width', '1.5');
      } else if (loc.type === 'property') {
        r = 9;
        shape = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
        shape.setAttribute('points', '-' + r + ',' + (r * 0.5) + ' 0,-' + r + ' ' + r + ',' + (r * 0.5));
        shape.setAttribute('fill', '#d35400');
        shape.setAttribute('stroke', '#fff');
        shape.setAttribute('stroke-width', '1.5');
      } else {
        r = loc.type === 'school' ? 13 : 10;
        shape = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        shape.setAttribute('r', r);
        shape.setAttribute('fill', color);
        shape.setAttribute('stroke', '#fff');
        shape.setAttribute('stroke-width', loc.type === 'school' ? '2.5' : '1.5');
      }
      g.appendChild(shape);

      var text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      text.setAttribute('dy', (r || 10) + 11);
      text.setAttribute('text-anchor', 'middle');
      text.setAttribute('fill', 'currentColor');
      text.setAttribute('font-size', loc.type === 'destination' ? '11' : (loc.type === 'extraction' ? '9' : '8'));
      text.setAttribute('font-weight', (loc.type === 'destination' || loc.type === 'school') ? '700' : '500');
      text.textContent = loc.label;
      g.appendChild(text);

      if (loc.detail) {
        var tooltip = document.createElementNS('http://www.w3.org/2000/svg', 'title');
        tooltip.textContent = loc.label + '\n' + loc.detail;
        g.appendChild(tooltip);
      }

      svg.appendChild(g);
      shapeElements[loc.id] = g;
    });

    // ── Legend — organized by flow type ──
    var legendData = [
      { style: 'state_aid', label: 'State aid (in)' },
      { style: 'extraction', label: 'Money extracted' },
      { style: 'personal', label: 'Personal enrichment' },
      { style: 'campaign', label: 'Campaign payments' },
      { style: 'kickback', label: 'Positions / cover back' },
      { style: 'dark_money', label: 'Dark money' },
      { style: 'property', label: 'Property / mortgages' },
      { style: 'authorization', label: 'Authorization' },
      { style: 'donation', label: 'Donations' },
      { style: 'events', label: 'Event revenue' },
      { style: 'oversight', label: 'Failed oversight' },
    ];

    var lx = 8, ly = height - legendData.length * 14 - 5;
    legendData.forEach(function(item) {
      var s = FLOW_STYLES[item.style];
      if (!s) return;
      var line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      line.setAttribute('x1', lx); line.setAttribute('y1', ly);
      line.setAttribute('x2', lx + 18); line.setAttribute('y2', ly);
      line.setAttribute('stroke', s.color);
      line.setAttribute('stroke-width', Math.min(s.width, 3));
      if (s.dash) line.setAttribute('stroke-dasharray', s.dash);
      svg.appendChild(line);

      var t = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      t.setAttribute('x', lx + 22); t.setAttribute('y', ly + 3);
      t.setAttribute('fill', s.color); t.setAttribute('font-size', '8');
      t.setAttribute('font-weight', '500');
      t.textContent = item.label;
      svg.appendChild(t);
      ly += 14;
    });

    // Node legend (right side)
    var nlx = width - 140, nly = height - 70;
    var nodeTypes = [
      { symbol: '●', color: '#27ae60', label: 'School (money enters)' },
      { symbol: '◆', color: '#e74c3c', label: 'Extraction point' },
      { symbol: '■', color: '#1abc9c', label: 'Funding source' },
      { symbol: '●', color: '#2980b9', label: 'Political' },
      { symbol: '●', color: '#8e44ad', label: 'Court' },
      { symbol: '▲', color: '#d35400', label: 'Property' },
      { symbol: '●', color: '#1abc9c', label: 'Authorizer' },
    ];
    nodeTypes.forEach(function(item) {
      var t = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      t.setAttribute('x', nlx); t.setAttribute('y', nly);
      t.setAttribute('fill', item.color); t.setAttribute('font-size', '9');
      t.setAttribute('font-weight', '500');
      t.textContent = item.symbol + ' ' + item.label;
      svg.appendChild(t);
      nly += 12;
    });

    // Flow count
    var countText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    countText.setAttribute('x', width - 8); countText.setAttribute('y', 14);
    countText.setAttribute('text-anchor', 'end');
    countText.setAttribute('fill', 'currentColor');
    countText.setAttribute('font-size', '9');
    countText.setAttribute('opacity', '0.35');
    countText.textContent = LOCATIONS.length + ' locations · ' + FLOWS.length + ' documented flows';
    svg.appendChild(countText);
  }

  function init() {
    var container = document.getElementById('geo-extraction-map');
    if (!container) return;
    if (!DN.nodes) {
      container.innerHTML = '<p style="color:#e74c3c;font-size:12px;">Geographic data not loaded.</p>';
      return;
    }
    renderGeoMap(container);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
