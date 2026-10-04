// Geographic extraction map for detroit.primals.eco
// Shows where public money enters (schools in Detroit) and where it exits
// (LLCs, campaign payments, political allies outside the community).
//
// Data source: window.DETROIT_NETWORK (loaded from network-data.js)
// Pure SVG, zero dependencies, zero tracking.

(function() {
  'use strict';

  // ── Resolve data from shared data layer ─────────────────────────────
  var DN = window.DETROIT_NETWORK || {};
  var TYPE_COLORS = DN.geoTypeColors || {};
  var FLOW_STYLES = DN.geoFlowStyles || {};

  function buildLocations() {
    var nodes = DN.nodes || [];
    var geoPos = DN.geoPositions || {};
    var geoAgg = DN.geoAggregates || [];
    var locations = [];

    // Build locations from network nodes that have geo positions
    var nodeMap = {};
    nodes.forEach(function(n) { nodeMap[n.id] = n; });

    Object.keys(geoPos).forEach(function(nid) {
      var node = nodeMap[nid];
      if (!node) return;
      var pos = geoPos[nid];
      var geoType = node.type;
      if (node.type === 'entity' && (nid === 'purpose_group' || nid === 'banks_strategy')) geoType = 'extraction';
      if (node.type === 'actor' && nid === 'banks') geoType = 'extraction';
      var summary = DN.flowSummary ? DN.flowSummary(nid) : { totalDollarsIn: 0, totalDollarsOut: 0 };
      locations.push({
        id: nid,
        label: node.label,
        type: geoType,
        px: pos.px,
        py: pos.py,
        detail: node.detail,
        flow_in: summary.totalDollarsIn ? '$' + (summary.totalDollarsIn / 1000).toFixed(0) + 'K' : 'documented',
        flow_out: summary.totalDollarsOut ? '$' + (summary.totalDollarsOut / 1000).toFixed(0) + 'K' : 'documented',
      });
    });

    // Add geo-only aggregates
    geoAgg.forEach(function(agg) {
      if (geoPos[agg.aggregates[0]]) return; // skip if primary node already placed
      locations.push({
        id: agg.id,
        label: agg.label,
        type: agg.type,
        px: agg.px,
        py: agg.py,
        detail: agg.detail,
        flow_in: '',
        flow_out: '',
      });
    });

    return locations;
  }

  function getFlows() {
    return DN.geoFlows || [];
  }

  function toSVG(px, py, width, height) {
    return {
      x: Math.max(60, Math.min(width - 60, px * width)),
      y: Math.max(40, Math.min(height - 50, py * height))
    };
  }

  function renderGeoMap(container) {
    var LOCATIONS = buildLocations();
    var FLOWS = getFlows();
    var width = container.clientWidth || 800;
    var height = Math.max(500, width * 0.55);

    container.innerHTML = '';

    // Title
    var title = document.createElement('h3');
    title.style.cssText = 'text-align:center;margin:0 0 4px;font-size:16px;';
    title.textContent = 'Where the Money Goes — Geographic Extraction';
    container.appendChild(title);

    var subtitle = document.createElement('p');
    subtitle.style.cssText = 'text-align:center;margin:0 0 12px;font-size:11px;opacity:0.5;';
    subtitle.textContent = 'Public dollars enter Detroit schools (green). Most exit through one LLC (red). Campaign payments distribute to allies (orange).';
    container.appendChild(subtitle);

    var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('viewBox', '0 0 ' + width + ' ' + height);
    svg.setAttribute('width', '100%');
    svg.setAttribute('height', height);
    svg.setAttribute('role', 'img');
    svg.setAttribute('aria-label', 'Geographic extraction map — where public school money enters and exits Detroit');
    svg.style.cssText = 'background:rgba(0,0,0,0.03);border-radius:8px;';
    container.appendChild(svg);

    // Defs for arrowheads
    var defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
    Object.keys(FLOW_STYLES).forEach(function(ft) {
      var marker = document.createElementNS('http://www.w3.org/2000/svg', 'marker');
      marker.setAttribute('id', 'geo-arrow-' + ft);
      marker.setAttribute('viewBox', '0 0 10 10');
      marker.setAttribute('refX', '8'); marker.setAttribute('refY', '5');
      marker.setAttribute('markerWidth', '6'); marker.setAttribute('markerHeight', '6');
      marker.setAttribute('orient', 'auto');
      var path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      path.setAttribute('d', 'M 0 0 L 10 5 L 0 10 z');
      path.setAttribute('fill', FLOW_STYLES[ft].color);
      marker.appendChild(path);
      defs.appendChild(marker);
    });
    svg.appendChild(defs);

    // Convert all locations to SVG coordinates
    var locMap = {};
    LOCATIONS.forEach(function(loc) {
      var pos = toSVG(loc.px, loc.py, width, height);
      locMap[loc.id] = Object.assign({}, loc, pos);
    });

    // Zone backgrounds — community vs extraction
    // Community zone (center — where schools and kids are)
    var communityZone = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    communityZone.setAttribute('x', width * 0.28);
    communityZone.setAttribute('y', height * 0.25);
    communityZone.setAttribute('width', width * 0.42);
    communityZone.setAttribute('height', height * 0.50);
    communityZone.setAttribute('rx', '12');
    communityZone.setAttribute('fill', 'rgba(39,174,96,0.06)');
    communityZone.setAttribute('stroke', 'rgba(39,174,96,0.15)');
    communityZone.setAttribute('stroke-width', '1.5');
    communityZone.setAttribute('stroke-dasharray', '8,4');
    svg.appendChild(communityZone);

    var communityLabel = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    communityLabel.setAttribute('x', width * 0.49);
    communityLabel.setAttribute('y', height * 0.78);
    communityLabel.setAttribute('text-anchor', 'middle');
    communityLabel.setAttribute('fill', 'rgba(39,174,96,0.25)');
    communityLabel.setAttribute('font-size', '22');
    communityLabel.setAttribute('font-weight', '800');
    communityLabel.setAttribute('letter-spacing', '4');
    communityLabel.textContent = 'DETROIT COMMUNITY';
    svg.appendChild(communityLabel);

    // Extraction zone (top — where money goes)
    var extractionZone = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    extractionZone.setAttribute('x', width * 0.12);
    extractionZone.setAttribute('y', height * 0.03);
    extractionZone.setAttribute('width', width * 0.65);
    extractionZone.setAttribute('height', height * 0.20);
    extractionZone.setAttribute('rx', '12');
    extractionZone.setAttribute('fill', 'rgba(231,76,60,0.06)');
    extractionZone.setAttribute('stroke', 'rgba(231,76,60,0.15)');
    extractionZone.setAttribute('stroke-width', '1.5');
    extractionZone.setAttribute('stroke-dasharray', '8,4');
    svg.appendChild(extractionZone);

    var extractionLabel = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    extractionLabel.setAttribute('x', width * 0.45);
    extractionLabel.setAttribute('y', height * 0.06);
    extractionLabel.setAttribute('text-anchor', 'middle');
    extractionLabel.setAttribute('fill', 'rgba(231,76,60,0.3)');
    extractionLabel.setAttribute('font-size', '14');
    extractionLabel.setAttribute('font-weight', '700');
    extractionLabel.setAttribute('letter-spacing', '3');
    extractionLabel.textContent = 'EXTRACTION LAYER';
    svg.appendChild(extractionLabel);

    // Big directional arrow showing money flowing UP and OUT
    var bigArrow = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    bigArrow.setAttribute('x', width * 0.92);
    bigArrow.setAttribute('y', height * 0.35);
    bigArrow.setAttribute('text-anchor', 'middle');
    bigArrow.setAttribute('fill', 'rgba(231,76,60,0.15)');
    bigArrow.setAttribute('font-size', '42');
    bigArrow.textContent = '↑';
    svg.appendChild(bigArrow);
    var bigArrowLabel = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    bigArrowLabel.setAttribute('x', width * 0.92);
    bigArrowLabel.setAttribute('y', height * 0.42);
    bigArrowLabel.setAttribute('text-anchor', 'middle');
    bigArrowLabel.setAttribute('fill', 'rgba(231,76,60,0.2)');
    bigArrowLabel.setAttribute('font-size', '9');
    bigArrowLabel.setAttribute('font-weight', '600');
    bigArrowLabel.textContent = 'MONEY';
    svg.appendChild(bigArrowLabel);
    var bigArrowLabel2 = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    bigArrowLabel2.setAttribute('x', width * 0.92);
    bigArrowLabel2.setAttribute('y', height * 0.45);
    bigArrowLabel2.setAttribute('text-anchor', 'middle');
    bigArrowLabel2.setAttribute('fill', 'rgba(231,76,60,0.2)');
    bigArrowLabel2.setAttribute('font-size', '9');
    bigArrowLabel2.setAttribute('font-weight', '600');
    bigArrowLabel2.textContent = 'EXITS';
    svg.appendChild(bigArrowLabel2);

    // Draw flow lines (behind locations)
    FLOWS.forEach(function(flow) {
      var from = locMap[flow.from];
      var to = locMap[flow.to];
      if (!from || !to) return;

      var style = FLOW_STYLES[flow.flow_type] || FLOW_STYLES[flow.type] || FLOW_STYLES.money_out;
      var line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      line.setAttribute('x1', from.x); line.setAttribute('y1', from.y);
      line.setAttribute('x2', to.x); line.setAttribute('y2', to.y);
      line.setAttribute('stroke', style.color);
      line.setAttribute('stroke-width', style.width);
      line.setAttribute('stroke-opacity', '0.5');
      if (style.dash) line.setAttribute('stroke-dasharray', style.dash);
      line.setAttribute('marker-end', 'url(#geo-arrow-' + (flow.flow_type || flow.type) + ')');

      var title = document.createElementNS('http://www.w3.org/2000/svg', 'title');
      title.textContent = flow.label + ' (' + from.label + ' → ' + to.label + ')';
      line.appendChild(title);
      svg.appendChild(line);

      // Amount label on significant flows
      if (flow.amount > 100000) {
        var mx = (from.x + to.x) / 2;
        var my = (from.y + to.y) / 2;
        var amtText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        amtText.setAttribute('x', mx);
        amtText.setAttribute('y', my - 4);
        amtText.setAttribute('text-anchor', 'middle');
        amtText.setAttribute('fill', style.color);
        amtText.setAttribute('font-size', '9');
        amtText.setAttribute('font-weight', '600');
        amtText.textContent = flow.label;
        svg.appendChild(amtText);
      }
    });

    // Draw locations
    Object.values(locMap).forEach(function(loc) {
      var g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
      g.setAttribute('transform', 'translate(' + loc.x + ',' + loc.y + ')');

      var r = loc.type === 'school' ? 12 : (loc.type === 'extraction' ? 14 : 10);
      var shape;
      if (loc.type === 'extraction') {
        // Diamond for extraction
        shape = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
        shape.setAttribute('points', '0,-' + r + ' ' + r + ',0 0,' + r + ' -' + r + ',0');
        shape.setAttribute('fill', TYPE_COLORS[loc.type]);
        shape.setAttribute('stroke', '#fff');
        shape.setAttribute('stroke-width', '2');
      } else {
        shape = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        shape.setAttribute('r', r);
        shape.setAttribute('fill', TYPE_COLORS[loc.type]);
        shape.setAttribute('stroke', '#fff');
        shape.setAttribute('stroke-width', '2');
      }
      g.appendChild(shape);

      var text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      text.setAttribute('dy', r + 12);
      text.setAttribute('text-anchor', 'middle');
      text.setAttribute('fill', 'currentColor');
      text.setAttribute('font-size', loc.type === 'extraction' ? '10' : '9');
      text.setAttribute('font-weight', loc.type === 'extraction' ? '700' : '500');
      text.textContent = loc.label;
      g.appendChild(text);

      var tooltip = document.createElementNS('http://www.w3.org/2000/svg', 'title');
      tooltip.textContent = loc.label + '\n' + loc.detail + '\nIN: ' + loc.flow_in + '\nOUT: ' + loc.flow_out;
      g.appendChild(tooltip);

      svg.appendChild(g);
    });

    // Legend
    var legendX = 10, legendY = height - 100;
    var legendItems = [
      { color: '#27ae60', label: '● School (money enters)', dash: '' },
      { color: '#e74c3c', label: '◆ Extraction point (money exits)', dash: '' },
      { color: '#2980b9', label: '● Political ally', dash: '' },
      { color: '#8e44ad', label: '● Court', dash: '' },
    ];
    legendItems.forEach(function(item, i) {
      var t = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      t.setAttribute('x', legendX); t.setAttribute('y', legendY + i * 16);
      t.setAttribute('fill', item.color); t.setAttribute('font-size', '10');
      t.setAttribute('font-weight', '500');
      t.textContent = item.label;
      svg.appendChild(t);
    });

    // Flow legend
    var flowLegendX = width - 200, flowLegendY = height - 80;
    var flowItems = [
      { color: '#27ae60', label: '→ Public money in', width: 3 },
      { color: '#e74c3c', label: '→ Money extracted', width: 3 },
      { color: '#f39c12', label: '⇢ Campaign payments', width: 2 },
      { color: '#8e44ad', label: '⇠ Positions/cover back', width: 2 },
    ];
    flowItems.forEach(function(item, i) {
      var t = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      t.setAttribute('x', flowLegendX); t.setAttribute('y', flowLegendY + i * 16);
      t.setAttribute('fill', item.color); t.setAttribute('font-size', '10');
      t.setAttribute('font-weight', '500');
      t.textContent = item.label;
      svg.appendChild(t);
    });
  }

  function init() {
    var container = document.getElementById('geo-extraction-map');
    if (!container) return;
    renderGeoMap(container);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
