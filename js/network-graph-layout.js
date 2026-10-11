// Network graph layout algorithms — PHYSICS epitope.
// Pure computation separated from rendering.
// Loaded before network-graph.js.

(function() {
  'use strict';

  var PI = Math.PI;

  // ── Elastic slingshot layout (baseCamp 71) ─────────────────────────
  // Origin at CENTER. Tier 1 (deep institutional core) = center.
  // Higher tiers radiate outward by π^(tier/2).
  // Edges = work left unfinished. The sort reveals the gaps.

  function slingshotLayout(filteredNodes, filteredLinks, width, height) {
    var originX = width * 0.5;
    var originY = height * 0.48;
    var maxRadius = Math.min(width, height) * 0.42;

    // Bucket nodes by tier
    var tierBuckets = {};
    filteredNodes.forEach(function(n) {
      var t = n.tier || 3;
      if (!tierBuckets[t]) tierBuckets[t] = [];
      tierBuckets[t].push(n);
    });

    var nodes = [];
    var maxTier = Math.max.apply(null, Object.keys(tierBuckets).map(Number));
    Object.keys(tierBuckets).sort(function(a, b) { return +a - +b; }).forEach(function(tierStr) {
      var tier = +tierStr;
      var bucket = tierBuckets[tierStr];
      // r = maxRadius × (1 - 1/π^(tier/2))
      var r = maxRadius * (1.0 - 1.0 / Math.pow(PI, tier / 2.0));
      r = Math.max(r, 20 + tier * 8);

      bucket.forEach(function(n, i) {
        var angle = (2 * PI * i) / bucket.length + (tier * PI / 7);
        nodes.push(Object.assign({}, n, {
          x: originX + r * Math.cos(angle),
          y: originY + r * Math.sin(angle),
          _ringR: r,
          _tier: tier,
          vx: 0, vy: 0
        }));
      });
    });

    // Light force relaxation — untangle overlaps, pull linked nodes
    var nodeMap = {};
    nodes.forEach(function(n) { nodeMap[n.id] = n; });
    for (var iter = 0; iter < 80; iter++) {
      for (var i = 0; i < nodes.length; i++) {
        for (var j = i + 1; j < nodes.length; j++) {
          var dx = nodes[j].x - nodes[i].x;
          var dy = nodes[j].y - nodes[i].y;
          var dist = Math.sqrt(dx * dx + dy * dy) || 1;
          if (dist < 55) {
            var push = (55 - dist) * 0.25;
            var px = (dx / dist) * push;
            var py = (dy / dist) * push;
            nodes[i].x -= px; nodes[i].y -= py;
            nodes[j].x += px; nodes[j].y += py;
          }
        }
      }
      filteredLinks.forEach(function(link) {
        var s = nodeMap[link.source];
        var t = nodeMap[link.target];
        if (!s || !t) return;
        var dx = t.x - s.x;
        var dy = t.y - s.y;
        var dist = Math.sqrt(dx * dx + dy * dy) || 1;
        if (dist > 90) {
          var pull = (dist - 90) * 0.004;
          var fx = (dx / dist) * pull;
          var fy = (dy / dist) * pull;
          s.x += fx; s.y += fy;
          t.x -= fx; t.y -= fy;
        }
      });
      nodes.forEach(function(n) {
        n.x = Math.max(50, Math.min(width - 50, n.x));
        n.y = Math.max(40, Math.min(height - 40, n.y));
      });
    }

    return {
      nodes: nodes,
      maxTier: maxTier,
      originX: originX,
      originY: originY,
      maxRadius: maxRadius
    };
  }

  // ── Slingshot geometry data ────────────────────────────────────────
  // Returns ring descriptors for SVG rendering.

  function slingshotRings(maxTier, maxRadius) {
    var rings = [];
    for (var t = 1; t <= maxTier; t++) {
      var r = maxRadius * (1.0 - 1.0 / Math.pow(PI, t / 2.0));
      r = Math.max(r, 20 + t * 8);
      rings.push({
        tier: t,
        radius: r,
        label: 'tier ' + t + ' — π^' + (t <= 2 ? (t === 1 ? '½' : '1') : t + '/2'),
        opacity: 0.08 + t * 0.03,
        labelOpacity: 0.2 + t * 0.06
      });
    }
    return rings;
  }

  // ── Force-directed layout (original) ───────────────────────────────

  function forceDirectedLayout(filteredNodes, filteredLinks, width, height) {
    var nodes = filteredNodes.map(function(n, i) {
      var angle = (2 * PI * i) / filteredNodes.length;
      var radius = Math.min(width, height) * 0.35;
      return Object.assign({}, n, {
        x: width / 2 + radius * Math.cos(angle) * (0.5 + n.tier * 0.12),
        y: height / 2 + radius * Math.sin(angle) * (0.5 + n.tier * 0.12),
        vx: 0, vy: 0
      });
    });

    var nodeMap = {};
    nodes.forEach(function(n) { nodeMap[n.id] = n; });

    var hasSuper = nodes.some(function(n) { return n._isSuper; });
    var repulsion = hasSuper ? 28000 : 18000;
    var idealDist = hasSuper ? 240 : 180;

    for (var iter = 0; iter < 100; iter++) {
      for (var i = 0; i < nodes.length; i++) {
        for (var j = i + 1; j < nodes.length; j++) {
          var dx = nodes[j].x - nodes[i].x;
          var dy = nodes[j].y - nodes[i].y;
          var dist = Math.sqrt(dx * dx + dy * dy) || 1;
          var force = repulsion / (dist * dist);
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
        var force = (dist - idealDist) * 0.015;
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
        n.x = Math.max(90, Math.min(width - 90, n.x));
        n.y = Math.max(50, Math.min(height - 50, n.y));
      });
    }

    return nodes;
  }

  // ── Convex hull (Andrew's monotone chain) ──────────────────────────

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

  // ── Degree computation ─────────────────────────────────────────────

  function computeDegrees(nodes, links) {
    var degree = {};
    nodes.forEach(function(n) { degree[n.id] = 0; });
    links.forEach(function(l) {
      if (degree[l.source] !== undefined) degree[l.source]++;
      if (degree[l.target] !== undefined) degree[l.target]++;
    });
    return degree;
  }

  // ── Build adjacency map ────────────────────────────────────────────

  function buildAdjacency(nodes, links) {
    var adjacency = {};
    nodes.forEach(function(n) { adjacency[n.id] = new Set(); });
    links.forEach(function(l) {
      if (adjacency[l.source]) adjacency[l.source].add(l.target);
      if (adjacency[l.target]) adjacency[l.target].add(l.source);
    });
    return adjacency;
  }

  // ── Export ──────────────────────────────────────────────────────────
  window.NetworkGraphLayout = {
    slingshot: slingshotLayout,
    slingshotRings: slingshotRings,
    forceDirected: forceDirectedLayout,
    convexHull: convexHull,
    computeDegrees: computeDegrees,
    buildAdjacency: buildAdjacency
  };
})();
