// Geographic extraction map for detroit.primals.eco
// Shows where public money enters (schools in Detroit) and where it exits
// (LLCs, campaign payments, political allies outside the community).
// Pure SVG, zero dependencies, zero tracking.

(function() {
  'use strict';

  // Layout uses a conceptual geographic arrangement:
  // Schools central, extraction NW, courts/politics SE, state far NW
  // Coordinates are SVG-space (percentage of viewBox), not real lat/lon

  var LOCATIONS = [
    // Schools — where public money ENTERS (center of map, the community)
    { id: 'macdowell', label: 'MacDowell Prep', type: 'school',
      px: 0.45, py: 0.42, detail: '$4.9M/yr state aid · 3% math',
      flow_in: '$4.9M', flow_out: '72.67% → Purpose Group' },
    { id: 'pca', label: 'Purpose Charter', type: 'school',
      px: 0.52, py: 0.55, detail: 'K-8 · Opening 2026-27',
      flow_in: 'TBD state aid', flow_out: '→ Purpose Group' },
    { id: 'dpsa', label: 'Detroit Public Safety Academy', type: 'school',
      px: 0.38, py: 0.32, detail: 'Police chief on the board',
      flow_in: 'State aid', flow_out: '→ EMU authorizer' },

    // Extraction layer — where money EXITS (upper area, OUTSIDE community)
    { id: 'purpose_llc', label: 'Purpose Group LLC', type: 'extraction',
      px: 0.42, py: 0.14, detail: 'Sole member: Banks · Takes 72.67%',
      flow_in: '$4.28M from MacDowell', flow_out: 'Salary to Banks' },
    { id: 'banks_home', label: 'Banks/Holland Residence', type: 'extraction',
      px: 0.22, py: 0.10, detail: 'PAC HQ + Foundation + LLC — same address',
      flow_in: 'Salary + consulting', flow_out: 'Campaign payments' },
    { id: 'banks_strategy', label: 'Banks Strategy LLC', type: 'extraction',
      px: 0.65, py: 0.12, detail: 'Campaign consulting firm',
      flow_in: 'Judge campaign $', flow_out: '$15K+ to candidates' },

    // Political destinations — where influence flows (lower right)
    { id: 'city_hall', label: 'Detroit City Hall', type: 'political',
      px: 0.72, py: 0.62, detail: 'Mayor Sheffield · Ombudsman Gay-Dagnogo',
      flow_in: 'Endorsements + $$', flow_out: 'Charter authorization' },
    { id: 'wayne_county', label: 'Wayne County', type: 'political',
      px: 0.82, py: 0.50, detail: 'Exec Evans · Treasurer Sabree',
      flow_in: 'Campaign $$', flow_out: 'Endorsements + cover' },
    { id: 'third_circuit', label: '3rd Circuit Court', type: 'court',
      px: 0.75, py: 0.38, detail: 'Judges Miller, A. Sabree, Ramsey',
      flow_in: 'Board seats for Banks', flow_out: 'Judicial cover' },
    { id: '36th_district', label: '36th District Court', type: 'court',
      px: 0.85, py: 0.72, detail: 'Judges Yancey, S. Perkins',
      flow_in: '$383 from Banks Strategy', flow_out: 'Board positions' },

    // State level — Lansing (far left, outside Detroit)
    { id: 'lansing', label: 'Lansing (State Capitol)', type: 'state',
      px: 0.08, py: 0.30, detail: 'MDE · AG · State Legislature',
      flow_in: 'Investigation referrals', flow_out: 'Cleared Banks (2022)' },

    // Inner Link — print shop (lower left)
    { id: 'inner_link', label: 'Inner Link Graphics', type: 'vendor',
      px: 0.15, py: 0.65, detail: '$98,291 from Banks committees',
      flow_in: '$98K campaign printing', flow_out: 'Print services' },
  ];

  // Money flow paths — showing extraction direction
  var FLOWS = [
    // Public money IN to schools
    { from: 'lansing', to: 'macdowell', type: 'money_in', label: '$4.9M state aid', amount: 4900000 },
    { from: 'lansing', to: 'pca', type: 'money_in', label: 'State aid (new)', amount: 2000000 },

    // Extraction OUT of schools
    { from: 'macdowell', to: 'purpose_llc', type: 'money_out', label: '72.67% ($4.28M)', amount: 4280000 },
    { from: 'pca', to: 'purpose_llc', type: 'money_out', label: 'Management fee', amount: 1500000 },
    { from: 'purpose_llc', to: 'banks_home', type: 'money_out', label: 'Salary + expenses', amount: 667000 },

    // Campaign money flowing outward
    { from: 'banks_home', to: 'banks_strategy', type: 'campaign', label: 'Consulting payments', amount: 35000 },
    { from: 'banks_strategy', to: '36th_district', type: 'campaign', label: '$383 Yancey', amount: 383 },
    { from: 'banks_home', to: 'inner_link', type: 'campaign', label: '$98K printing', amount: 98291 },
    { from: 'banks_home', to: 'city_hall', type: 'influence', label: 'Endorsements + events', amount: 0 },
    { from: 'banks_home', to: 'wayne_county', type: 'influence', label: 'Endorsements', amount: 0 },

    // Kickback: positions and cover flowing back
    { from: 'third_circuit', to: 'pca', type: 'kickback', label: 'Board seats (Miller)', amount: 0 },
    { from: '36th_district', to: 'macdowell', type: 'kickback', label: 'Board seats (Yancey)', amount: 0 },
    { from: 'city_hall', to: 'pca', type: 'kickback', label: 'Charter authorization', amount: 0 },
  ];

  var TYPE_COLORS = {
    school: '#27ae60',
    extraction: '#e74c3c',
    political: '#2980b9',
    court: '#8e44ad',
    state: '#7f8c8d',
    vendor: '#f39c12',
  };

  var FLOW_STYLES = {
    money_in: { color: '#27ae60', width: 4, dash: '' },      // green — public money arriving
    money_out: { color: '#e74c3c', width: 4, dash: '' },     // red — money extracted
    campaign: { color: '#f39c12', width: 2.5, dash: '6,3' }, // orange dashed — campaign payments
    influence: { color: '#3498db', width: 2, dash: '4,4' },  // blue dashed — influence
    kickback: { color: '#8e44ad', width: 2, dash: '3,3' },   // purple dashed — positions/cover back
  };

  function toSVG(px, py, width, height) {
    return {
      x: Math.max(60, Math.min(width - 60, px * width)),
      y: Math.max(40, Math.min(height - 50, py * height))
    };
  }

  function renderGeoMap(container) {
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

      var style = FLOW_STYLES[flow.type] || FLOW_STYLES.money_out;
      var line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      line.setAttribute('x1', from.x); line.setAttribute('y1', from.y);
      line.setAttribute('x2', to.x); line.setAttribute('y2', to.y);
      line.setAttribute('stroke', style.color);
      line.setAttribute('stroke-width', style.width);
      line.setAttribute('stroke-opacity', '0.5');
      if (style.dash) line.setAttribute('stroke-dasharray', style.dash);
      line.setAttribute('marker-end', 'url(#geo-arrow-' + flow.type + ')');

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
