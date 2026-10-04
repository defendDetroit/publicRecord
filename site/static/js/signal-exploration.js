// Signal exploration visualization — the traveling salesman's doorbell
// Shows how visitors navigate through the evidence site.
// Each hop is detected via the Referer header — no cookies, no tracking.
// Data source: window.SIGNAL_EXPLORATION (from signal-data.js)

(function() {
  'use strict';

  var SE = window.SIGNAL_EXPLORATION;
  if (!SE) return;

  function renderExploration(container) {
    var width = container.clientWidth || 800;
    container.innerHTML = '';

    // ── Stats bar ──
    var stats = document.createElement('div');
    stats.style.cssText = 'display:flex;gap:24px;flex-wrap:wrap;justify-content:center;margin:0 0 16px;';
    var s = SE.summary;
    [
      { n: s.totalHits, l: 'content hits' },
      { n: s.uniquePages, l: 'pages explored' },
      { n: s.totalHops, l: 'doorbell hops' },
      { n: s.days, l: 'days measured' },
    ].forEach(function(item) {
      var d = document.createElement('div');
      d.style.cssText = 'text-align:center;';
      d.innerHTML = '<div style="font-size:28px;font-weight:800;color:#2ecc71;">' + item.n +
        '</div><div style="font-size:10px;opacity:0.5;text-transform:uppercase;letter-spacing:1px;">' +
        item.l + '</div>';
      stats.appendChild(d);
    });
    container.appendChild(stats);

    // ── Hourly heatmap ──
    var heatTitle = document.createElement('h4');
    heatTitle.style.cssText = 'margin:20px 0 6px;font-size:13px;opacity:0.7;';
    heatTitle.textContent = 'When They Come — Hourly Signal';
    container.appendChild(heatTitle);

    var heatSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    var heatH = 80;
    heatSvg.setAttribute('viewBox', '0 0 ' + width + ' ' + heatH);
    heatSvg.setAttribute('width', '100%');
    heatSvg.setAttribute('height', heatH);
    heatSvg.style.cssText = 'background:rgba(0,0,0,0.02);border-radius:6px;margin-bottom:8px;';

    var hours = SE.hourly || [];
    if (hours.length) {
      var maxH = Math.max.apply(null, hours.map(function(h) { return h.hits; }));
      var barW = Math.max(6, (width - 40) / hours.length - 2);
      hours.forEach(function(h, i) {
        var bh = (h.hits / maxH) * (heatH - 25);
        var x = 20 + i * (barW + 2);
        var bar = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        bar.setAttribute('x', x);
        bar.setAttribute('y', heatH - 15 - bh);
        bar.setAttribute('width', barW);
        bar.setAttribute('height', bh);
        bar.setAttribute('rx', '2');
        var intensity = h.hits / maxH;
        var r = Math.round(46 + intensity * 200);
        var g = Math.round(204 - intensity * 100);
        var b = Math.round(113 - intensity * 50);
        bar.setAttribute('fill', 'rgb(' + r + ',' + g + ',' + b + ')');
        bar.setAttribute('opacity', '0.8');
        var title = document.createElementNS('http://www.w3.org/2000/svg', 'title');
        title.textContent = h.hour + ':00 — ' + h.hits + ' hits';
        bar.appendChild(title);
        heatSvg.appendChild(bar);

        if (h.hits > maxH * 0.5 || i === 0 || i === hours.length - 1) {
          var lbl = document.createElementNS('http://www.w3.org/2000/svg', 'text');
          lbl.setAttribute('x', x + barW / 2);
          lbl.setAttribute('y', heatH - 3);
          lbl.setAttribute('text-anchor', 'middle');
          lbl.setAttribute('fill', 'currentColor');
          lbl.setAttribute('font-size', '7');
          lbl.setAttribute('opacity', '0.4');
          lbl.textContent = h.hour.split(' ')[1] + 'h';
          heatSvg.appendChild(lbl);
        }

        if (h.hits > 5) {
          var ct = document.createElementNS('http://www.w3.org/2000/svg', 'text');
          ct.setAttribute('x', x + barW / 2);
          ct.setAttribute('y', heatH - 18 - bh);
          ct.setAttribute('text-anchor', 'middle');
          ct.setAttribute('fill', 'currentColor');
          ct.setAttribute('font-size', '8');
          ct.setAttribute('font-weight', '600');
          ct.setAttribute('opacity', '0.6');
          ct.textContent = h.hits;
          heatSvg.appendChild(ct);
        }
      });
    }
    container.appendChild(heatSvg);

    // ── Navigation hop graph (the traveling salesman) ──
    var hopTitle = document.createElement('h4');
    hopTitle.style.cssText = 'margin:20px 0 6px;font-size:13px;opacity:0.7;';
    hopTitle.textContent = 'The Traveling Salesman — How They Navigate';
    container.appendChild(hopTitle);

    var hopSub = document.createElement('p');
    hopSub.style.cssText = 'font-size:10px;opacity:0.4;margin:0 0 8px;';
    hopSub.textContent = 'Each arrow is a doorbell ring — a visitor moving from one page to another. Detected via Referer header. No cookies. No tracking.';
    container.appendChild(hopSub);

    var graphH = Math.max(350, width * 0.4);
    var graphSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    graphSvg.setAttribute('viewBox', '0 0 ' + width + ' ' + graphH);
    graphSvg.setAttribute('width', '100%');
    graphSvg.setAttribute('height', graphH);
    graphSvg.style.cssText = 'background:rgba(0,0,0,0.02);border-radius:8px;';

    // Arrow defs
    var defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
    var marker = document.createElementNS('http://www.w3.org/2000/svg', 'marker');
    marker.setAttribute('id', 'hop-arrow');
    marker.setAttribute('viewBox', '0 0 10 10');
    marker.setAttribute('refX', '22');
    marker.setAttribute('refY', '5');
    marker.setAttribute('markerWidth', '5');
    marker.setAttribute('markerHeight', '5');
    marker.setAttribute('orient', 'auto');
    var ap = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    ap.setAttribute('d', 'M 0 0 L 10 5 L 0 10 z');
    ap.setAttribute('fill', '#2ecc71');
    ap.setAttribute('opacity', '0.6');
    marker.appendChild(ap);
    defs.appendChild(marker);
    graphSvg.appendChild(defs);

    // Build node list from hops + top pages
    var hopNodes = {};
    var hops = SE.hops || [];
    var pages = SE.pages || [];

    hops.forEach(function(h) {
      hopNodes[h.from] = hopNodes[h.from] || { id: h.from, hits: 0 };
      hopNodes[h.to] = hopNodes[h.to] || { id: h.to, hits: 0 };
    });

    pages.slice(0, 15).forEach(function(p) {
      if (!hopNodes[p.path]) hopNodes[p.path] = { id: p.path, hits: 0 };
      hopNodes[p.path].hits = p.hits;
      hopNodes[p.path].label = p.label;
      hopNodes[p.path].entries = p.entries;
    });

    // Add hits info from pages for hop nodes
    pages.forEach(function(p) {
      if (hopNodes[p.path]) {
        hopNodes[p.path].hits = p.hits;
        hopNodes[p.path].label = p.label;
        hopNodes[p.path].entries = p.entries;
      }
    });

    var nodeArr = Object.values(hopNodes);
    if (nodeArr.length === 0) {
      container.appendChild(graphSvg);
      return;
    }

    // Short label helper
    function shortLabel(path) {
      if (path === '/') return 'Home';
      var parts = path.split('/').filter(Boolean);
      var last = parts[parts.length - 1].replace(/-/g, ' ');
      return last.length > 18 ? last.substring(0, 16) + '...' : last;
    }

    // Force layout
    var nodes = nodeArr.map(function(n, i) {
      var angle = (2 * Math.PI * i) / nodeArr.length;
      var r = Math.min(width, graphH) * 0.3;
      return {
        id: n.id,
        label: n.label || shortLabel(n.id),
        hits: n.hits || 1,
        entries: n.entries || 0,
        x: width / 2 + r * Math.cos(angle),
        y: graphH / 2 + r * Math.sin(angle),
        vx: 0, vy: 0
      };
    });

    var nodeMap = {};
    nodes.forEach(function(n) { nodeMap[n.id] = n; });

    // Simple force sim
    for (var iter = 0; iter < 80; iter++) {
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
      hops.forEach(function(h) {
        var s = nodeMap[h.from];
        var t = nodeMap[h.to];
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
      nodes.forEach(function(n) {
        n.vx += (width / 2 - n.x) * 0.005;
        n.vy += (graphH / 2 - n.y) * 0.005;
        n.x += n.vx * 0.3;
        n.y += n.vy * 0.3;
        n.vx *= 0.75; n.vy *= 0.75;
        n.x = Math.max(60, Math.min(width - 60, n.x));
        n.y = Math.max(30, Math.min(graphH - 30, n.y));
      });
    }

    // Draw edges
    hops.forEach(function(h) {
      var s = nodeMap[h.from];
      var t = nodeMap[h.to];
      if (!s || !t) return;
      var line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      line.setAttribute('x1', s.x); line.setAttribute('y1', s.y);
      line.setAttribute('x2', t.x); line.setAttribute('y2', t.y);
      line.setAttribute('stroke', '#2ecc71');
      line.setAttribute('stroke-width', Math.min(h.count * 2, 6));
      line.setAttribute('stroke-opacity', Math.min(0.3 + h.count * 0.15, 0.8));
      line.setAttribute('marker-end', 'url(#hop-arrow)');
      var title = document.createElementNS('http://www.w3.org/2000/svg', 'title');
      title.textContent = shortLabel(h.from) + ' → ' + shortLabel(h.to) + ' (' + h.count + ' hops)';
      line.appendChild(title);
      graphSvg.appendChild(line);

      // Edge label for multi-hop routes
      if (h.count >= 2) {
        var mx = (s.x + t.x) / 2;
        var my = (s.y + t.y) / 2;
        var el = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        el.setAttribute('x', mx); el.setAttribute('y', my - 4);
        el.setAttribute('text-anchor', 'middle');
        el.setAttribute('fill', '#2ecc71');
        el.setAttribute('font-size', '8');
        el.setAttribute('font-weight', '700');
        el.textContent = h.count + '×';
        graphSvg.appendChild(el);
      }
    });

    // Draw nodes
    var maxHits = Math.max.apply(null, nodes.map(function(n) { return n.hits; }));
    nodes.forEach(function(n) {
      var g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
      g.setAttribute('transform', 'translate(' + n.x + ',' + n.y + ')');

      var r = 8 + Math.sqrt(n.hits / maxHits) * 16;
      var isEntry = n.entries > n.hits * 0.5;
      var circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      circle.setAttribute('r', r);
      circle.setAttribute('fill', isEntry ? '#e74c3c' : '#2ecc71');
      circle.setAttribute('fill-opacity', '0.7');
      circle.setAttribute('stroke', '#fff');
      circle.setAttribute('stroke-width', '2');
      g.appendChild(circle);

      // Hit count inside
      if (n.hits > 1) {
        var ht = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        ht.setAttribute('dy', '3');
        ht.setAttribute('text-anchor', 'middle');
        ht.setAttribute('fill', '#fff');
        ht.setAttribute('font-size', Math.max(8, r * 0.6));
        ht.setAttribute('font-weight', '700');
        ht.textContent = n.hits;
        g.appendChild(ht);
      }

      // Label below
      var label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      label.setAttribute('dy', r + 12);
      label.setAttribute('text-anchor', 'middle');
      label.setAttribute('fill', 'currentColor');
      label.setAttribute('font-size', '9');
      label.setAttribute('font-weight', n.hits > 5 ? '600' : '400');
      label.textContent = n.label;
      g.appendChild(label);

      var tooltip = document.createElementNS('http://www.w3.org/2000/svg', 'title');
      tooltip.textContent = n.label + '\n' + n.hits + ' visits' +
        (n.entries ? '\n' + n.entries + ' direct entries (landing page)' : '') +
        '\n' + n.id;
      g.appendChild(tooltip);

      graphSvg.appendChild(g);
    });

    // Legend
    var ly = 16;
    [
      { color: '#e74c3c', label: '● Entry point (landing page)' },
      { color: '#2ecc71', label: '● Internal page (navigated to)' },
      { color: '#2ecc71', label: '→ Doorbell hop (Referer detected)' },
    ].forEach(function(item) {
      var t = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      t.setAttribute('x', 8); t.setAttribute('y', ly);
      t.setAttribute('fill', item.color);
      t.setAttribute('font-size', '9');
      t.setAttribute('opacity', '0.6');
      t.textContent = item.label;
      graphSvg.appendChild(t);
      ly += 14;
    });

    container.appendChild(graphSvg);

    // ── Top exploration paths ──
    var pathTitle = document.createElement('h4');
    pathTitle.style.cssText = 'margin:20px 0 6px;font-size:13px;opacity:0.7;';
    pathTitle.textContent = 'Most Explored Pages';
    container.appendChild(pathTitle);

    var table = document.createElement('table');
    table.style.cssText = 'width:100%;border-collapse:collapse;font-size:12px;';
    var thead = '<tr style="opacity:0.5;text-align:left;border-bottom:1px solid rgba(255,255,255,0.1);">' +
      '<th style="padding:4px 8px;">Page</th>' +
      '<th style="padding:4px 8px;text-align:right;">Visits</th>' +
      '<th style="padding:4px 8px;text-align:right;">Direct</th>' +
      '<th style="padding:4px 8px;">Bar</th></tr>';
    var tbody = '';
    pages.slice(0, 12).forEach(function(p) {
      var barW = Math.round((p.hits / pages[0].hits) * 100);
      var entryPct = p.entries ? Math.round(p.entries / p.hits * 100) : 0;
      tbody += '<tr style="border-bottom:1px solid rgba(255,255,255,0.05);">' +
        '<td style="padding:4px 8px;"><a href="' + p.path + '" style="color:inherit;text-decoration:none;">' + p.label + '</a></td>' +
        '<td style="padding:4px 8px;text-align:right;font-weight:600;">' + p.hits + '</td>' +
        '<td style="padding:4px 8px;text-align:right;opacity:0.5;">' + (p.entries || 0) + '</td>' +
        '<td style="padding:4px 8px;">' +
          '<div style="background:rgba(46,204,113,0.15);border-radius:3px;height:14px;width:100%;position:relative;">' +
            '<div style="background:#2ecc71;border-radius:3px;height:100%;width:' + barW + '%;opacity:0.7;"></div>' +
            (entryPct > 0 ? '<div style="background:#e74c3c;border-radius:3px;height:100%;width:' + Math.round(barW * entryPct / 100) + '%;opacity:0.5;position:absolute;top:0;left:0;"></div>' : '') +
          '</div>' +
        '</td></tr>';
    });
    table.innerHTML = thead + tbody;
    container.appendChild(table);

    // ── Generated timestamp ──
    var ts = document.createElement('p');
    ts.style.cssText = 'font-size:9px;opacity:0.3;text-align:right;margin-top:12px;';
    ts.textContent = 'Receptor snapshot: ' + SE.generated + ' · ' +
      SE.summary.totalHits + ' hits across ' + SE.summary.days + ' days';
    container.appendChild(ts);
  }

  function init() {
    var container = document.getElementById('signal-exploration');
    if (!container) return;
    renderExploration(container);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
