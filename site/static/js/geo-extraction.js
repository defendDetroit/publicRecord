// Geographic extraction map for detroit.primals.eco
// Shows where public money enters (schools in Detroit) and where it exits
// (LLCs, campaign payments, political allies outside the community).
// Pure SVG, zero dependencies, zero tracking.

(function() {
  'use strict';

  // Approximate lat/lon → SVG coordinates for Detroit area
  // Bounding box: roughly 42.25°N to 42.50°N, -83.35°W to -82.90°W
  var BOUNDS = { minLat: 42.25, maxLat: 42.50, minLon: -83.35, maxLon: -82.90 };

  // Key locations with real approximate coordinates
  var LOCATIONS = [
    // Schools — where public money ENTERS
    { id: 'macdowell', label: 'MacDowell Prep', type: 'school',
      lat: 42.377, lon: -83.120, detail: '$4.9M/yr state aid · 3% math',
      flow_in: '$4.9M', flow_out: '72.67% → Purpose Group' },
    { id: 'pca', label: 'Purpose Charter', type: 'school',
      lat: 42.350, lon: -83.100, detail: 'K-8 · Opening 2026-27',
      flow_in: 'TBD state aid', flow_out: '→ Purpose Group' },
    { id: 'dpsa', label: 'Detroit Public Safety Academy', type: 'school',
      lat: 42.383, lon: -83.150, detail: 'Police chief on the board',
      flow_in: 'State aid', flow_out: '→ EMU authorizer' },

    // Extraction layer — where money EXITS Detroit kids
    { id: 'purpose_llc', label: 'Purpose Group LLC', type: 'extraction',
      lat: 42.410, lon: -83.190, detail: 'Sole member: Banks · Takes 72.67%',
      flow_in: '$4.28M from MacDowell', flow_out: 'Salary to Banks' },
    { id: 'banks_home', label: 'Banks/Holland Residence', type: 'extraction',
      lat: 42.415, lon: -83.210, detail: 'PAC HQ + Foundation + LLC — same address',
      flow_in: 'Salary + consulting', flow_out: 'Campaign payments' },
    { id: 'banks_strategy', label: 'Banks Strategy LLC', type: 'extraction',
      lat: 42.420, lon: -83.180, detail: 'Campaign consulting firm',
      flow_in: 'Judge campaign $', flow_out: '$15K+ to candidates' },

    // Political destinations — where influence flows
    { id: 'city_hall', label: 'Detroit City Hall', type: 'political',
      lat: 42.329, lon: -83.045, detail: 'Mayor Sheffield · Ombudsman Gay-Dagnogo',
      flow_in: 'Endorsements + $$', flow_out: 'Charter authorization' },
    { id: 'wayne_county', label: 'Wayne County', type: 'political',
      lat: 42.333, lon: -83.049, detail: 'Exec Evans · Treasurer Sabree',
      flow_in: 'Campaign $$', flow_out: 'Endorsements + cover' },
    { id: 'third_circuit', label: '3rd Circuit Court', type: 'court',
      lat: 42.331, lon: -83.047, detail: 'Judges Miller, A. Sabree, Ramsey',
      flow_in: 'Board seats for Banks', flow_out: 'Judicial cover' },
    { id: '36th_district', label: '36th District Court', type: 'court',
      lat: 42.334, lon: -83.051, detail: 'Judges Yancey, S. Perkins',
      flow_in: '$383 from Banks Strategy', flow_out: 'Board positions' },

    // State level — Lansing
    { id: 'lansing', label: 'Lansing (State Capitol)', type: 'state',
      lat: 42.48, lon: -83.34, detail: 'MDE · AG · State Legislature',
      flow_in: 'Investigation referrals', flow_out: 'Cleared Banks (2022)' },

    // Inner Link — print shop
    { id: 'inner_link', label: 'Inner Link Graphics', type: 'vendor',
      lat: 42.390, lon: -83.240, detail: '$98,291 from Banks committees',
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

  function toSVG(lat, lon, width, height) {
    var x = ((lon - BOUNDS.minLon) / (BOUNDS.maxLon - BOUNDS.minLon)) * width;
    var y = ((BOUNDS.maxLat - lat) / (BOUNDS.maxLat - BOUNDS.minLat)) * height;
    return { x: Math.max(40, Math.min(width - 40, x)), y: Math.max(30, Math.min(height - 30, y)) };
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
      var pos = toSVG(loc.lat, loc.lon, width, height);
      locMap[loc.id] = Object.assign({}, loc, pos);
    });

    // Draw a simplified Detroit city outline (approximate polygon)
    var detroitOutline = [
      { lat: 42.45, lon: -83.20 },  // NW
      { lat: 42.45, lon: -82.92 },  // NE (river)
      { lat: 42.40, lon: -82.91 },  // E
      { lat: 42.33, lon: -82.92 },  // SE (downtown)
      { lat: 42.28, lon: -83.00 },  // S
      { lat: 42.29, lon: -83.15 },  // SW
      { lat: 42.35, lon: -83.20 },  // W
      { lat: 42.40, lon: -83.22 },  // NW approach
    ];
    var outlinePoints = detroitOutline.map(function(p) {
      var sv = toSVG(p.lat, p.lon, width, height);
      return sv.x + ',' + sv.y;
    }).join(' ');
    var outline = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
    outline.setAttribute('points', outlinePoints);
    outline.setAttribute('fill', 'rgba(100,100,100,0.05)');
    outline.setAttribute('stroke', 'rgba(150,150,150,0.3)');
    outline.setAttribute('stroke-width', '1.5');
    outline.setAttribute('stroke-dasharray', '8,4');
    svg.appendChild(outline);

    // Detroit label
    var detLabel = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    var detCenter = toSVG(42.36, -83.06, width, height);
    detLabel.setAttribute('x', detCenter.x);
    detLabel.setAttribute('y', detCenter.y);
    detLabel.setAttribute('text-anchor', 'middle');
    detLabel.setAttribute('fill', 'currentColor');
    detLabel.setAttribute('font-size', '18');
    detLabel.setAttribute('font-weight', '700');
    detLabel.setAttribute('opacity', '0.08');
    detLabel.textContent = 'DETROIT';
    svg.appendChild(detLabel);

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
