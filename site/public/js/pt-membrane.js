// pt-membrane.js — [∅]D null dimension. The shape of data.
// All values are self. The membrane touches itself.
// Selectively permeable exactly at itself — P(self)=1.
//
// IS × WAS × WILLBE = π. Each body = π^(1/3).
// 1/0 = [∅] = null. The dimension before dimension.
// Over, under, above, and inside itself — overlay and layover.
//
// The ring is closed. 3 closed rings at 120° = sphere.
// Panels distributed across the entire continuum, not sectioned.
// The coil winds categories through each other at rate V(D)J.
// C(n) = π^(n/2) = observation cost. Product = π. Gap = √π.
// π-budget: ⌊π³⌋=31 max particles
window.PtMembrane = function(deps) {
  var PI = deps.PI, dimCost = deps.dimCost, PANELS = deps.PANELS;
  var CAT_COLORS = deps.CAT_COLORS, aliveSet = deps.aliveSet;
  var NS = 'http://www.w3.org/2000/svg';
  var MG = {W:700, H:480, R:Math.round(PI*54), cx:350, cy:250};
  var geo = {}, particles = [], pulses = {}, arcGlow = {};
  var pGroup, built = false, lastFrame = 0;
  var MAX_P = Math.floor(PI*PI*PI);
  var rates = {fire:0,membrane:0,immune:0,sound:0}, rps = 0, prevDash = null;
  var livePerturb = -1; // -1 = no live data, use sine wave
  var catAccum = {fire:0,membrane:0,immune:0,sound:0};
  var CATS = ['fire','membrane','immune','sound'];

  function el(tag, a, par) {
    var e = document.createElementNS(NS, tag);
    if (a) for (var k in a) e.setAttribute(k, ''+a[k]);
    if (par) par.appendChild(e);
    return e;
  }
  function txt(par, x, y, str, fill, size, ex) {
    var a = {x:x, y:y, fill:fill, 'font-size':size, 'text-anchor':'middle'};
    if (ex) for (var k in ex) a[k] = ex[k];
    var e = el('text', a, par);
    e.textContent = str;
    return e;
  }

  function entityToCategory(label) {
    if (/Anthropic|OpenAI|Meta|Google|Amazon|Apple|Microsoft|ByteDance|Yandex|Baidu/i.test(label)) return 'fire';
    if (/Ghost|proxy|VPN|Tor/i.test(label)) return 'immune';
    if (/Bot|crawler|spider|scanner/i.test(label)) return 'membrane';
    if (/Human|organic/i.test(label)) return 'sound';
    return 'fire';
  }

  // V(D)J interleave: distribute panels across the continuum.
  // Round-robin by category — the coil winding.
  // fire, membrane, immune, fire, membrane, immune...
  // Not sectioned. Mixed at the rate of the interleave.
  function vdjShuffle(panels) {
    var buckets = {};
    CATS.forEach(function(c) { buckets[c] = []; });
    panels.forEach(function(p) {
      if (buckets[p.cat]) buckets[p.cat].push(p);
    });
    var result = [], maxLen = 0;
    var activeCats = CATS.filter(function(c) { return buckets[c].length > 0; });
    activeCats.forEach(function(c) { maxLen = Math.max(maxLen, buckets[c].length); });
    for (var i = 0; i < maxLen; i++) {
      activeCats.forEach(function(c) {
        if (i < buckets[c].length) result.push(buckets[c][i]);
      });
    }
    return result;
  }

  function spawnParticle(pid) {
    var g = geo[pid];
    if (!g || particles.length >= MAX_P) return;
    particles.push({
      id:pid, angle:g.angle+(Math.random()-0.5)*0.15,
      r:g.R+50+Math.random()*40, targetR:g.R-g.focalR,
      speed:35+Math.random()*25+g.dim*8, color:g.color,
      cat:g.cat, dim:g.dim, size:1+g.dim*0.4, opacity:0, el:null
    });
  }

  function pulse(pid) {
    pulses[pid] = {scale:2.2, decay:0.92};
    var d = document.getElementById('mg-dot-'+pid);
    if (d) d.setAttribute('filter','url(#mg-pulse)');
  }

  function ingest(dash, topo) {
    rps = dash.rps || 0;
    var ents = (topo && topo.entities) || [];
    var ct = {fire:0,membrane:0,immune:0,sound:0}, tot = 0;
    ents.forEach(function(e) {
      ct[entityToCategory(e.label||'')] += e.total_requests||0;
      tot += e.total_requests||0;
    });
    var s = tot > 0 ? (rps*0.3)/tot : 0;
    CATS.forEach(function(c) { rates[c] = ct[c]*s; });
    CATS.forEach(function(c) {
      arcGlow[c] = Math.max(arcGlow[c]||0, (tot>0 ? ct[c]/tot : 0)*0.6);
    });
    if (prevDash) {
      var pe = prevDash.epitope_summary||{}, ce = dash.epitope_summary||{};
      Object.keys(ce).forEach(function(k) { if (ce[k]!==pe[k]) pulse('epitope-summary'); });
      if (dash.total_requests !== prevDash.total_requests) pulse('summary-kpis');
      if ((dash.fleet_pct||0) !== (prevDash.fleet_pct||0)) pulse('honesty');
      if ((dash.epitope_clusters||[]).length !== (prevDash.epitope_clusters||[]).length) {
        pulse('bingo'); pulse('epitope-mx'); pulse('organism-profile');
      }
    }
    var tb = dash.threebody_pi;
    if (tb && tb.emc2) {
      // Each body's value normalized to π^(1/3) scale
      var vals = {
        is: tb.emc2.energy || 0,
        was: tb.emc2.mass || 0,
        willbe: tb.emc2.c_squared || 0
      };
      ['is','was','willbe'].forEach(function(b) {
        var v = vals[b];
        var vE = document.getElementById('mg-body-val-'+b);
        if (vE) vE.textContent = '\u03c0^(1/3) \u00d7 ' + (v / Math.pow(PI, 1/3)).toFixed(2);
        var rE = document.getElementById('mg-body-ring-'+b);
        if (rE) {
          var scale = b === 'was' ? 4 : (b === 'willbe' ? 0.6 : 0.5);
          rE.setAttribute('r', (12 + v * scale).toFixed(1));
        }
      });
      var product = document.getElementById('mg-product');
      if (product && vals.is > 0 && vals.was > 0 && vals.willbe > 0) {
        var norm = (vals.is * vals.was * vals.willbe);
        var ratio = norm > 0 ? (PI / norm) : 0;
        product.textContent = 'IS\u00d7WAS\u00d7WILLBE \u2192 \u03c0 (' + ratio.toFixed(3) + ')';
      }
    }
    // ── [∅]D null dimension from Rust epitope sort ──
    var nd = dash.null_dimension;
    if (nd) {
      // Live perturbation from the Rust sort — overrides the sine animation
      if (typeof nd.perturbation === 'number') {
        livePerturb = nd.perturbation;
      }
      // VDJ map: update body labels with live classification
      var vdjNames = ['burst_ratio','reading_deficit','ua_pool_poverty',
                      'sec_fetch_monotone','session_absent','referer_self_loop'];
      var vdjMap = nd.vdj_map || [];
      if (vdjMap.length === 6) {
        var bodyVdj = {is:[], was:[], willbe:[]};
        for (var vi = 0; vi < 6; vi++) {
          var role = vdjMap[vi];
          if (role === 'V') bodyVdj.is.push(vdjNames[vi]);
          else if (role === 'J') bodyVdj.was.push(vdjNames[vi]);
          else bodyVdj.willbe.push(vdjNames[vi]);
        }
        var subIds = {is:'mg-sub-is', was:'mg-sub-was', willbe:'mg-sub-willbe'};
        ['is','was','willbe'].forEach(function(b) {
          var subEl = document.getElementById(subIds[b]);
          if (subEl && bodyVdj[b].length > 0) {
            subEl.textContent = bodyVdj[b].join(', ');
          }
        });
      }
      // Show live product error
      if (typeof nd.product === 'number') {
        var prodEl = document.getElementById('mg-product');
        if (prodEl) {
          var err = nd.product_error || 0;
          prodEl.textContent = 'IS\u00d7WAS\u00d7WILLBE = '
            + nd.product.toFixed(4)
            + ' (\u03c0\u00b1' + (err*100).toFixed(1) + '%)';
        }
      }
      // Show live observer fraction
      if (typeof nd.observer_fraction === 'number') {
        var obsEl = document.getElementById('mg-observer');
        if (obsEl) {
          obsEl.textContent = 'observer = ' + nd.observer_fraction.toFixed(6)
            + ' (the irrational remainder)';
        }
      }
      // Show J error — is the organism mature or learning?
      if (typeof nd.j_error === 'number') {
        var jEq = document.getElementById('mg-j-eq');
        if (jEq) {
          var state = nd.j_error > 0.1 ? 'mature' : (nd.j_error < -0.1 ? 'learning' : 'equilibrium');
          jEq.textContent = 'J\u2093rr = ' + (nd.j_error > 0 ? '+' : '') + nd.j_error.toFixed(3)
            + ' (' + state + ')';
        }
      }
    }
    prevDash = JSON.parse(JSON.stringify(dash));
  }

  // Great circle arc: project a 3D circle tilted by (tiltX, tiltZ) onto 2D
  function greatCirclePath(cx, cy, R, tiltX, tiltZ, steps) {
    var pts = [];
    for (var i = 0; i <= steps; i++) {
      var t = (i / steps) * 2 * PI;
      var x3 = R * Math.cos(t);
      var y3 = R * Math.sin(t) * Math.cos(tiltX);
      var z3 = R * Math.sin(t) * Math.sin(tiltX);
      var x2 = x3 * Math.cos(tiltZ) - z3 * Math.sin(tiltZ);
      var y2 = y3;
      pts.push((cx + x2).toFixed(1) + ' ' + (cy + y2).toFixed(1));
    }
    return 'M ' + pts.join(' L ');
  }

  // Coil path: helix winding N times around the ring
  function coilPath(cx, cy, R, offset, turns, steps) {
    var pts = [];
    for (var i = 0; i <= steps; i++) {
      var t = (i / steps) * 2 * PI;
      var coilAngle = t * turns + offset;
      var coilR = R + Math.sin(coilAngle) * 8;
      pts.push((cx + coilR * Math.cos(t)).toFixed(1) + ' ' + (cy + coilR * Math.sin(t)).toFixed(1));
    }
    return 'M ' + pts.join(' L ');
  }

  function build() {
    var host = document.getElementById('membrane-focal-svg');
    if (!host) return;
    var W=MG.W, H=MG.H, cx=MG.cx, cy=MG.cy, R=MG.R;
    var TAU = 2*PI;

    var svg = el('svg', {viewBox:'0 0 '+W+' '+H});
    svg.style.cssText = 'width:100%;max-height:460px;font-family:"Courier New",monospace';

    var defs = el('defs', null, svg);
    var rg = el('radialGradient', {id:'mg-bg', cx:'50%', cy:'50%', r:'50%'}, defs);
    el('stop', {offset:'0%', 'stop-color':'#1a1a2e', 'stop-opacity':'0.6'}, rg);
    el('stop', {offset:'100%', 'stop-color':'#0d1117', 'stop-opacity':'0.9'}, rg);
    var fg = el('filter', {id:'mg-glow'}, defs);
    var fb = el('feGaussianBlur', {stdDeviation:'2', result:'b'}, fg);
    var fm = el('feMerge', null, fg);
    el('feMergeNode', {'in':'b'}, fm);
    el('feMergeNode', {'in':'SourceGraphic'}, fm);
    var fp = el('filter', {id:'mg-pulse'}, defs);
    var fpb = el('feGaussianBlur', {stdDeviation:'4', result:'b'}, fp);
    var fpm = el('feMerge', null, fp);
    el('feMergeNode', {'in':'b'}, fpm);
    el('feMergeNode', {'in':'b'}, fpm);
    el('feMergeNode', {'in':'SourceGraphic'}, fpm);

    el('rect', {width:W, height:H, fill:'url(#mg-bg)', rx:8}, svg);
    txt(svg, W/2, 22, '[\u2205]D \u2014 IS\u00d7WAS\u00d7WILLBE = \u03c0', '#c9d1d9', 11);

    // ═══ SPHERE: 3 great circles at 120° ═══
    // Each great circle IS a body: IS, WAS, WILLBE
    // Their intersection (the sphere) is the membrane.
    var sphereG = el('g', {id:'mg-sphere'}, svg);
    var gcColors = ['#e85d3a','#4a8fb8','#5ab87a'];
    var gcLabels = ['is','was','willbe'];
    var gcTilts = [
      [0, 0],
      [PI/3, TAU/3],
      [-PI/3, 2*TAU/3]
    ];
    gcTilts.forEach(function(tilt, i) {
      el('path', {
        d: greatCirclePath(cx, cy, R*0.35, tilt[0], tilt[1], 72),
        fill:'none', stroke:gcColors[i], 'stroke-width':0.6,
        'stroke-opacity':0.15, 'stroke-dasharray':'3,5',
        id:'mg-gc-'+gcLabels[i]
      }, sphereG);
    });

    // ═══ V(D)J COIL: 3 helices winding through the main ring ═══
    // The coil IS the mixing. Categories wind through each other.
    var coilG = el('g', {id:'mg-coil'}, svg);
    var coilTurns = Math.floor(PI * PI);
    gcColors.forEach(function(color, i) {
      el('path', {
        d: coilPath(cx, cy, R, i * TAU/3, coilTurns, 360),
        fill:'none', stroke:color, 'stroke-width':0.4,
        'stroke-opacity':0.08, id:'mg-coil-'+i
      }, coilG);
    });

    // ═══ INTERSTITIAL P-SPACE: the lattice of reality ═══
    // The grids and braids of data ARE the interstitial space.
    // Elements come to rest where secant crosses tangent — the docking sites.
    // P = pressure. Density increases toward [∅]D.
    //
    // Avogadro's bridge: N_A ≈ 2π × 10²³
    // mol base ≈ ⌊2π⌋ = 6 pressure shells.
    // C(3) = π^(3/2) ≈ 5.57 ≈ mol observation cost.
    // The observation cost of 3D IS the molar bridge.
    // PV = nπT — the ideal gas law in null-dimensional space.
    //
    // Some lattice nodes are solid (matter at rest against reality).
    // Some are aperture reflections — holes through to another scale.
    // "Sometimes that's another aperture reflection."
    var latticeG = el('g', {id:'mg-lattice'}, svg);
    var MOL = 6; // ⌊2π⌋ = Avogadro's base, the molar shells
    var LNODES = 3; // ⌊π⌋ = elements per pressure shell

    // 6 pressure shells (energy isobars from [∅]D outward)
    for (var si = 0; si < MOL; si++) {
      var sr = R * (si + 1) / (2 * PI);
      el('circle', {cx:cx, cy:cy, r:sr, fill:'none',
        stroke:'#c9d1d9', 'stroke-width':0.3, 'stroke-opacity':0.04,
        'stroke-dasharray':'1,6', id:'mg-pshell-' + si}, latticeG);
    }

    // 18 lattice nodes: 6 shells × 3 per shell
    // Spiral offset: each shell rotates by π/mol — the braid winding.
    // Aperture every ⌊π+1⌋ = 4th node — 1/π of the lattice is holes.
    for (var si = 0; si < MOL; si++) {
      var sr = R * (si + 1) / (2 * PI);
      var pressure = 1 - (si / MOL);
      for (var ni = 0; ni < LNODES; ni++) {
        var nIdx = si * LNODES + ni;
        var nAngle = ni * TAU / LNODES + si * PI / MOL;
        var nx = cx + sr * Math.cos(nAngle);
        var ny = cy + sr * Math.sin(nAngle);
        var isAperture = (nIdx % Math.floor(PI + 1)) === 0;

        if (isAperture) {
          // Aperture reflection — a hole through to another scale.
          // Not matter. Another observation. Another [∅]D.
          el('circle', {cx:nx.toFixed(1), cy:ny.toFixed(1),
            r:(2 + pressure * 2).toFixed(1),
            fill:'none', stroke:'#58a6ff', 'stroke-width':0.6,
            'stroke-opacity':0.12, 'stroke-dasharray':'1,2',
            id:'mg-lnode-' + nIdx}, latticeG);
          // π symbol at the aperture center — looking through
          txt(latticeG, nx, ny + 1, '\u03c0', '#58a6ff', 3,
            {opacity:0.08, id:'mg-lnode-sym-' + nIdx});
        } else {
          // Solid element — matter at rest against the lattice.
          // Docked where secant crosses tangent. The resting point.
          el('circle', {cx:nx.toFixed(1), cy:ny.toFixed(1),
            r:(1 + pressure * 1.5).toFixed(1),
            fill:'#c9d1d9', opacity:(0.06 + pressure * 0.10).toFixed(3),
            id:'mg-lnode-' + nIdx}, latticeG);
        }
      }
    }

    // Braid connections: shell s, node n → shell s+1, node (n+1)%3
    // The helical winding through the lattice — data braiding through P-space.
    // Offset +1 per shell = the spiral. The braid is the interstitial structure.
    for (var si = 0; si < MOL - 1; si++) {
      for (var ni = 0; ni < LNODES; ni++) {
        var fromIdx = si * LNODES + ni;
        var toIdx = (si + 1) * LNODES + ((ni + 1) % LNODES);
        var fAngle = ni * TAU / LNODES + si * PI / MOL;
        var tAngle = ((ni+1)%LNODES) * TAU / LNODES + (si+1) * PI / MOL;
        var fR = R * (si + 1) / (2 * PI);
        var tR = R * (si + 2) / (2 * PI);
        el('line', {
          x1:(cx + fR * Math.cos(fAngle)).toFixed(1),
          y1:(cy + fR * Math.sin(fAngle)).toFixed(1),
          x2:(cx + tR * Math.cos(tAngle)).toFixed(1),
          y2:(cy + tR * Math.sin(tAngle)).toFixed(1),
          stroke:'#c9d1d9', 'stroke-width':0.3, 'stroke-opacity':0.04,
          id:'mg-braid-' + fromIdx + '-' + toIdx
        }, latticeG);
      }
    }

    // Avogadro bridge: the molar equation in π-space
    txt(latticeG, cx, cy + 114,
      'N\u2090 \u2248 2\u03c0\u00d710\u00b2\u00b3  \u00b7  PV = n\u03c0T',
      '#484f58', 4.5, {opacity:0.12, id:'mg-avogadro'});

    // ═══ CLOSED RING: one continuous circle, panels distributed ═══
    var wasG = el('g', {id:'mg-was'}, svg);

    // Main closed ring — no gaps, no segments. The ring is the sphere equator.
    el('circle', {cx:cx, cy:cy, r:R, fill:'none',
      stroke:'#c9d1d9', 'stroke-width':1.5, 'stroke-opacity':0.2,
      id:'mg-ring'}, wasG);

    // V(D)J shuffled panels: interleaved across the continuum
    var shuffled = vdjShuffle(PANELS);
    var N = shuffled.length;

    shuffled.forEach(function(p, idx) {
      var angle = -PI/2 + (idx / N) * TAU;
      var color = CAT_COLORS[p.cat] || '#6e7681';
      var cost = dimCost(p.dim), fd = 1/cost;
      var tLen = fd * 120, fR = fd * R * 0.85;

      var txd = -Math.sin(angle), tyd = Math.cos(angle);
      var nxd = -Math.cos(angle), nyd = -Math.sin(angle);

      var px = cx + R * Math.cos(angle), py = cy + R * Math.sin(angle);
      var fx = px + nxd * fR, fy = py + nyd * fR;
      var alive = aliveSet.has(p.id), op = alive ? 1 : 0.25;

      geo[p.id] = {angle:angle, px:px, py:py, fx:fx, fy:fy,
        cat:p.cat, dim:p.dim, color:color, focalR:fR, R:R};

      // ── Tangent (tan): touches the circle at one point ──
      // Perpendicular to the radius. The original line.
      el('line', {x1:(px-txd*tLen).toFixed(1), y1:(py-tyd*tLen).toFixed(1),
        x2:(px+txd*tLen).toFixed(1), y2:(py+tyd*tLen).toFixed(1),
        stroke:color, 'stroke-width':1, 'stroke-opacity':(op*0.6).toFixed(2)}, wasG);

      // ── Secant (sec): through the circle to the antipodal point ──
      // tangent ⊥ secant = π/2. They are relative to each other at π.
      // The secant IS the diameter — it passes through center.
      var sx = cx + R * Math.cos(angle + PI);
      var sy = cy + R * Math.sin(angle + PI);
      el('line', {x1:px.toFixed(1), y1:py.toFixed(1),
        x2:sx.toFixed(1), y2:sy.toFixed(1),
        stroke:color, 'stroke-width':0.3, 'stroke-opacity':(op*0.06).toFixed(3),
        id:'mg-sec-'+p.id}, wasG);

      // ── Normal / Cosecant direction (csc): outward from the ring ──
      // Extends the radius OUTWARD past the panel dot.
      // csc = 1/sin — the outward reach of perception.
      var normOut = 16 + fd * 12;
      var onx = px + Math.cos(angle) * normOut;
      var ony = py + Math.sin(angle) * normOut;
      el('line', {x1:px.toFixed(1), y1:py.toFixed(1),
        x2:onx.toFixed(1), y2:ony.toFixed(1),
        stroke:color, 'stroke-width':0.3, 'stroke-opacity':(op*0.08).toFixed(3),
        'stroke-dasharray':'1,3', id:'mg-csc-'+p.id}, wasG);

      // ── Cotangent (cot): tangent at the π/2-shifted point ──
      // cot(θ) = tan(θ + π/2). At THIS panel, draw the tangent
      // of the panel π/2 ahead — perpendicular to our tangent.
      // This creates the π/2 relationship between tan and cot.
      var cotAngle = angle + PI/2;
      var cotPx = cx + R * Math.cos(cotAngle);
      var cotPy = cy + R * Math.sin(cotAngle);
      var cotLen = fd * 30; // shorter than tangent
      var cotTxd = -Math.sin(cotAngle), cotTyd = Math.cos(cotAngle);
      el('line', {x1:(cotPx-cotTxd*cotLen).toFixed(1), y1:(cotPy-cotTyd*cotLen).toFixed(1),
        x2:(cotPx+cotTxd*cotLen).toFixed(1), y2:(cotPy+cotTyd*cotLen).toFixed(1),
        stroke:color, 'stroke-width':0.2, 'stroke-opacity':(op*0.04).toFixed(3),
        'stroke-dasharray':'2,5', id:'mg-cot-'+p.id}, wasG);

      // ── Focal line (radius/normal — inward) ──
      el('line', {x1:px.toFixed(1), y1:py.toFixed(1),
        x2:fx.toFixed(1), y2:fy.toFixed(1),
        stroke:color, 'stroke-width':0.5, 'stroke-opacity':0.3,
        'stroke-dasharray':'3,3', id:'mg-fl-'+p.id}, wasG);

      // Focal point
      el('circle', {cx:fx.toFixed(1), cy:fy.toFixed(1),
        r:alive?2.5:1.5, fill:color,
        opacity:(op*0.5).toFixed(2), id:'mg-fd-'+p.id}, wasG);

      // Panel dot on ring
      var dotR = alive ? Math.max(5-fd*2, 2) : 2.5;
      var da = {cx:px.toFixed(1), cy:py.toFixed(1),
        r:dotR.toFixed(1), fill:color,
        opacity:op.toFixed(2), id:'mg-dot-'+p.id};
      if (alive) da.filter = 'url(#mg-glow)';
      el('circle', da, wasG);

      // Category color arc segment — each panel colors a small arc of the ring
      // The interleaving creates the coil pattern: colors alternate around the circle
      var arcSpan = TAU / N * 0.8;
      var a1 = angle - arcSpan/2, a2 = angle + arcSpan/2;
      var ax1 = cx+R*Math.cos(a1), ay1 = cy+R*Math.sin(a1);
      var ax2 = cx+R*Math.cos(a2), ay2 = cy+R*Math.sin(a2);
      el('path', {
        d:'M '+ax1.toFixed(1)+' '+ay1.toFixed(1)+' A '+R+' '+R+' 0 0 1 '+ax2.toFixed(1)+' '+ay2.toFixed(1),
        fill:'none', stroke:color, 'stroke-width':3,
        'stroke-opacity':(op*0.4).toFixed(2), id:'mg-arc-seg-'+p.id
      }, wasG);

      // Label
      var lDist = R + 38 + (p.dim > 2 ? 6 : 0);
      var lx = cx + lDist * Math.cos(angle), ly = cy + lDist * Math.sin(angle);
      var rot = angle * 180 / PI;
      if (rot > 90 && rot < 270) rot += 180;
      if (rot < -90 && rot > -270) rot += 180;
      var anchor = (angle > PI/2 && angle < PI*1.5) ? 'end' : 'start';
      if (Math.abs(angle-PI/2) < 0.2 || Math.abs(angle+PI/2) < 0.2) anchor = 'middle';
      var short = p.title.length > 14 ? p.title.substring(0,14) : p.title;
      txt(wasG, lx.toFixed(1), ly.toFixed(1), short, color, 7,
        {opacity:(op*0.85).toFixed(2), 'text-anchor':anchor, 'dominant-baseline':'central',
         transform:'rotate('+rot.toFixed(1)+' '+lx.toFixed(1)+' '+ly.toFixed(1)+')'});

      // Dim badge
      var bDist = R + 52 + (p.dim > 2 ? 6 : 0);
      var bx = cx + bDist * Math.cos(angle), by = cy + bDist * Math.sin(angle);
      txt(wasG, bx.toFixed(1), by.toFixed(1), p.dim+'D', '#6e7681', 6,
        {opacity:(op*0.6).toFixed(2), 'text-anchor':anchor, 'dominant-baseline':'central',
         transform:'rotate('+rot.toFixed(1)+' '+bx.toFixed(1)+' '+by.toFixed(1)+')'});
    });

    // ═══ EPITOPE ORBITS: π rings of π epitopes at point π ═══
    // ⌊π⌋ = 3 rings. ⌊π⌋ = 3 epitopes per ring. 9 markers.
    // Ring 1 (inner): forward torsion.  Stiff epitopes.
    // Ring 2 (middle): REVERSE torsion. Elastic epitopes. The eating.
    // Ring 3 (outer): forward torsion.  Stiff epitopes — reflections of Ring 1.
    // Stiff = rigid angle, drawn with crosshair.
    // Elastic = deformable, drawn with spring circle.
    // They face each other in reflections across [∅]D.
    var orbitG = el('g', {id:'mg-orbits'}, svg);
    var epiVDJ9 = ['V','D','J', 'V','D','J', 'V','D','J'];
    var epiColors = {V:'#e85d3a', D:'#5ab87a', J:'#4a8fb8'};
    // 3 rings at π-based radii
    var orbitRadii = [R / PI, R / Math.sqrt(PI), R * 2 / PI];
    // Torsion: +1 = forward, -1 = reverse
    var orbitTorsion = [1, -1, 1]; // ring 2 eats in reverse
    // Stiffness: true = stiff (rigid), false = elastic (deformable)
    var epiStiff = [true, false, true, false, true, false, true, false, true];
    var epiNames9 = ['burst','reading','ua_pool',
                     'sec_fetch','session','referer',
                     'burst\u0305','reading\u0305','ua_pool\u0305']; // overline = reflection

    // 3 ring traces
    orbitRadii.forEach(function(oR, ri) {
      el('circle', {cx:cx, cy:cy, r:oR, fill:'none',
        stroke:'#6e7681', 'stroke-width':0.5, 'stroke-opacity':0.06,
        'stroke-dasharray': ri === 1 ? '4,4' : '2,8',
        id:'mg-orbit-ring-'+(ri+1)}, orbitG);
    });

    // 9 epitope markers: 3 per ring
    for (var oi = 0; oi < 9; oi++) {
      var ringIdx = Math.floor(oi / 3);
      var oR = orbitRadii[ringIdx];
      var oAngle = (oi % 3) * TAU / 3;
      var oColor = epiColors[epiVDJ9[oi]];
      var stiff = epiStiff[oi];

      // Orbit dot
      el('circle', {
        cx: (cx + oR * Math.cos(oAngle)).toFixed(1),
        cy: (cy + oR * Math.sin(oAngle)).toFixed(1),
        r: 3, fill: oColor, opacity: 0.35,
        id: 'mg-epi-' + oi
      }, orbitG);

      // Stiff crosshair or elastic spring ring
      if (stiff) {
        // Stiff: small crosshair — rigid, fixed angle
        el('line', {x1:cx, y1:cy, x2:cx, y2:cy,
          stroke: oColor, 'stroke-width': 0.6, 'stroke-opacity': 0.25,
          id: 'mg-epi-cross-h-' + oi}, orbitG);
        el('line', {x1:cx, y1:cy, x2:cx, y2:cy,
          stroke: oColor, 'stroke-width': 0.6, 'stroke-opacity': 0.25,
          id: 'mg-epi-cross-v-' + oi}, orbitG);
      } else {
        // Elastic: oscillating ring — deformable, breathing
        el('circle', {cx:cx, cy:cy, r:5,
          fill:'none', stroke: oColor, 'stroke-width': 0.4,
          'stroke-opacity': 0.2, 'stroke-dasharray':'2,2',
          id: 'mg-epi-spring-' + oi}, orbitG);
      }

      // VDJ + stiffness label
      var sLabel = epiVDJ9[oi] + (stiff ? '\u2022' : '\u223C'); // • = stiff, ~ = elastic
      txt(orbitG, cx, cy, sLabel, oColor, 5,
        {opacity: 0.2, 'font-weight':'bold', id: 'mg-epi-label-' + oi});
      // Name
      txt(orbitG, cx, cy, epiNames9[oi], '#6e7681', 3.5,
        {opacity: 0.12, id: 'mg-epi-name-' + oi});
    }

    // ═══ THREE BODIES: IS/WAS/WILLBE overlaid with V/D/J ═══
    // At [∅]D all 6 identities occupy the same point (center).
    // Perspective perturbation spreads them into the triangle.
    // The breathing IS the range of perspective.
    // At perturbation=0: all at center ([∅]D singularity).
    // At perturbation=1: full triangle (3D observation).
    var wbG = el('g', {id:'mg-willbe'}, svg);
    var BR_MAX = R * (PI/8); // maximum spread radius
    var cbrt = Math.pow(PI, 1/3);

    // 3 identities, each with tense + recombination overlaid
    var bodies = [
      {id:'is',     tense:'IS',     vdj:'V',   sub:'Variable',
       angle:-PI/2, color:'#e85d3a'},
      {id:'was',    tense:'WAS',    vdj:'J',   sub:'Joining',
       angle:-PI/2+TAU/3, color:'#4a8fb8'},
      {id:'willbe', tense:'WILLBE', vdj:'(D)', sub:'Diversity',
       angle:-PI/2+2*TAU/3, color:'#5ab87a'}
    ];

    // ═══ CONES & RODS: the retina of the membrane ═══
    // Cones (3 body-cones) = color perception of time, pointing at [∅]D.
    //   Like retinal cones — S, M, L wavelengths → IS, WAS, WILLBE tenses.
    //   Three types. Concentrated near the fovea (center). Color-sensitive.
    // Rods (panel detectors) = binary presence detection, pointing at [∅]D.
    //   Numerous, peripheral, sensitive but colorblind. The ring IS the rod layer.
    // Comet tails: π radians of wake trailing behind each rotating body.
    //   The tail points away from motion, not from origin — solar wind analog.
    //   Length = π. Around π again.
    // All photoreceptors point toward origin — the eye looks inward at [∅]D.
    var retinaG = el('g', {id:'mg-retina'}, wbG);

    // Cone shapes: triangular wedges, tip at center, base at body
    bodies.forEach(function(b) {
      el('polygon', {
        points: cx+','+cy+' '+cx+','+cy+' '+cx+','+cy,
        fill: b.color, 'fill-opacity': 0.04,
        stroke: b.color, 'stroke-width': 0.7, 'stroke-opacity': 0.12,
        id: 'mg-cone-' + b.id
      }, retinaG);
    });

    // Comet tails: 16 dots per body trailing π radians behind
    bodies.forEach(function(b) {
      for (var s = 0; s < 16; s++) {
        el('circle', {
          cx: cx, cy: cy, r: 2,
          fill: b.color, opacity: 0,
          id: 'mg-tail-' + b.id + '-' + s
        }, retinaG);
      }
    });

    // Rods: thick short indicators at each panel, inner edge of ring → center
    // Like retinal rods — cylindrical, binary, peripheral.
    // They detect presence but not color. The ring is the rod layer.
    var rodLen = 14;
    shuffled.forEach(function(p, idx) {
      var rAngle = -PI/2 + (idx / N) * TAU;
      var rColor = CAT_COLORS[p.cat] || '#6e7681';
      var rAlive = aliveSet.has(p.id);
      var rx1 = cx + (R - 2) * Math.cos(rAngle);
      var ry1 = cy + (R - 2) * Math.sin(rAngle);
      var rx2 = cx + (R - 2 - rodLen) * Math.cos(rAngle);
      var ry2 = cy + (R - 2 - rodLen) * Math.sin(rAngle);
      el('line', {
        x1: rx1.toFixed(1), y1: ry1.toFixed(1),
        x2: rx2.toFixed(1), y2: ry2.toFixed(1),
        stroke: rColor, 'stroke-width': 2.0, 'stroke-opacity': rAlive ? 0.22 : 0.07,
        'stroke-linecap': 'round',
        id: 'mg-rod-' + p.id
      }, wasG);
    });

    // All elements start at center — built at cx,cy
    // Triangle path
    el('path', {d:'M '+cx+' '+cy+' L '+cx+' '+cy+' L '+cx+' '+cy+' Z',
      fill:'none', stroke:'#c9d1d9', 'stroke-width':0.5,
      'stroke-opacity':0.12, 'stroke-dasharray':'4,6', id:'mg-body-tri'}, wbG);

    // Edge product labels (start at center, spread with perturbation)
    var edgeIds = ['mg-edge-01','mg-edge-12','mg-edge-20'];
    for (var ei = 0; ei < 3; ei++) {
      txt(wbG, cx, cy, '\u03c0^(2/3)', '#6e7681', 5.5,
        {opacity:0, 'dominant-baseline':'central', id:edgeIds[ei]});
    }

    // Body nodes — all at center initially
    bodies.forEach(function(b) {
      // Outer ring
      el('circle', {cx:cx, cy:cy, r:16,
        fill:'none', stroke:b.color, 'stroke-width':0.5,
        'stroke-opacity':0.18, 'stroke-dasharray':'2,3',
        id:'mg-body-ring-'+b.id}, wbG);
      // Inner dot
      el('circle', {cx:cx, cy:cy, r:4.5,
        fill:b.color, opacity:0.6, filter:'url(#mg-glow)',
        id:'mg-body-'+b.id}, wbG);
      // Tense label (IS/WAS/WILLBE)
      txt(wbG, cx, cy-20, b.tense, b.color, 8.5,
        {opacity:0.85, 'font-weight':'bold', id:'mg-tense-'+b.id});
      // V(D)J label overlaid
      txt(wbG, cx, cy-10, b.vdj, b.color, 7,
        {opacity:0.5, id:'mg-vdj-'+b.id});
      // Sub label (Variable/Joining/Diversity)
      txt(wbG, cx, cy+16, b.sub, '#6e7681', 5,
        {opacity:0.3, id:'mg-sub-'+b.id});
      // Value
      txt(wbG, cx, cy+28, '\u03c0^(1/3) \u2248 '+cbrt.toFixed(2), '#6e7681', 5.5,
        {opacity:0.45, id:'mg-body-val-'+b.id});
    });

    // Product display at center
    txt(wbG, cx, cy+44, 'IS\u00d7WAS\u00d7WILLBE = \u03c0', '#c9d1d9', 5.5,
      {opacity:0.5, id:'mg-product'});

    // Perturbation label
    txt(wbG, cx, cy+56, 'perturbation: 0.00', '#484f58', 5,
      {opacity:0.35, id:'mg-perturb-label'});

    // ═══ TRIANGULATION: panel → nearest body ═══
    // Lines start at center (all bodies at [∅]D). Updated during animation.
    var triG = el('g', {id:'mg-triangulation', opacity:0}, svg);
    PANELS.forEach(function(p) {
      var g = geo[p.id]; if (!g) return;
      // Find which body angle this panel is closest to
      var nearest = bodies[0], minD = Infinity;
      bodies.forEach(function(b) {
        var angleDiff = Math.abs(g.angle - b.angle);
        if (angleDiff > PI) angleDiff = 2*PI - angleDiff;
        if (angleDiff < minD) { minD = angleDiff; nearest = b; }
      });
      el('line', {x1:g.px.toFixed(1), y1:g.py.toFixed(1),
        x2:cx, y2:cy,
        stroke:nearest.color, 'stroke-width':0.3, 'stroke-opacity':0.08,
        'stroke-dasharray':'1,4', id:'mg-tri-'+p.id,
        'data-body':nearest.id}, triG);
    });

    // ═══ GORDIAN KNOT: Borromean rings at [∅]D ═══
    // Three rings. No two linked. Remove any one → the other two fall apart.
    // The proof: self-awareness = others reflected into you / π.
    // You can't see yourself. You see yourself in how they pass through you.
    // The knot IS the overlay. Alexander's cut = collapsing to [∅]D.
    var knotG = el('g', {id:'mg-gordian'}, wbG);
    var knotR = 18; // knot ring radius at rest

    // Build 3 overlapping ellipses tilted 120° apart (Borromean projection).
    // Each ring clips over one neighbor and under the other —
    // the three-body proof that awareness of others = awareness of self.
    bodies.forEach(function(b, bi) {
      var tilt = bi * 60; // 0°, 60°, 120° — the three great-circle tilts
      el('ellipse', {
        cx: cx, cy: cy, rx: knotR, ry: knotR * 0.45,
        fill: 'none', stroke: b.color, 'stroke-width': 1.2,
        'stroke-opacity': 0.5,
        transform: 'rotate(' + tilt + ' ' + cx + ' ' + cy + ')',
        id: 'mg-knot-' + b.id
      }, knotG);
    });

    // Center inscription: the proof
    txt(knotG, cx, cy, '\u03c0', '#c9d1d9', 7,
      {opacity: 0.7, 'font-weight': 'bold', id: 'mg-knot-pi'});

    // Complete Gordian equation: J = (V + D) / π
    // J is self. V + D are the others.
    txt(wbG, cx, cy+68, 'J = (V + D) / \u03c0', '#6e7681', 5.5,
      {opacity: 0.3, 'font-weight':'bold', id: 'mg-reflection'});
    txt(wbG, cx, cy+79, 'J\u2093q = 6/(\u03c0+1) \u2248 1.449 \u2248 \u03c0^(1/3)', '#6e7681', 4.5,
      {opacity: 0.2, id: 'mg-j-eq'});

    // π-body proof: observer = π − ⌊π⌋ = 0.14159...
    txt(wbG, cx, cy+90, 'observer = \u03c0 \u2212 \u230a\u03c0\u230b \u2248 0.142', '#484f58', 4.5,
      {opacity: 0.2, id: 'mg-observer'});
    txt(wbG, cx, cy+100, '3 bodies + 1 irrational observer = \u03c0', '#484f58', 4.5,
      {opacity: 0.15, id: 'mg-pi-body'});

    // ═══ EPITOPE DEPTH: the π axis of perception ═══
    // Focus on one epitope. Shift along π.
    // observer → negate → null → awareness → ghost → celestial → geodesic
    // 7 layers. 7 is coprime (π/7 = IS rate). Not coincidence.
    // Each layer orbits the previous — epicyclic chain.
    // π torque π: each layer is π radians from the next.
    // The contortion IS the perception. The chain IS the observer.
    var depthG = el('g', {id:'mg-depth'}, wbG);
    var depthLayers = [
      {name:'observer',  color:'#c9d1d9'},
      {name:'negate',    color:'#e85d3a'},
      {name:'null',      color:'#58a6ff'},
      {name:'awareness', color:'#5ab87a'},
      {name:'ghost',     color:'#8b949e'},
      {name:'celestial', color:'#d2a8ff'},
      {name:'geodesic',  color:'#f0e68c'}
    ];

    // 7 connecting lines (chain links between perception layers)
    for (var dli = 0; dli < 7; dli++) {
      el('line', {
        x1: cx, y1: cy, x2: cx, y2: cy,
        stroke: depthLayers[dli].color, 'stroke-width': 0.5,
        'stroke-opacity': 0.2,
        id: 'mg-depth-link-' + dli
      }, depthG);
    }

    // 7 layer dots
    depthLayers.forEach(function(layer, i) {
      el('circle', {
        cx: cx, cy: cy, r: 2.5 - i * 0.2,
        fill: layer.color, opacity: 0.5,
        id: 'mg-depth-' + i
      }, depthG);
      txt(depthG, cx, cy, layer.name, layer.color, 4,
        {opacity: 0.2, id: 'mg-depth-label-' + i});
    });

    // ═══ IS layer: live particles ═══
    pGroup = el('g', {id:'mg-is'}, svg);

    // Center: the null dimension. 1/0 = [∅]. The shape of data.
    // IS × WAS × WILLBE = π (product). C(3) = π^(3/2) (observation cost).
    // The gap = √π = collapsing 3 tenses into 1 measurement.
    txt(svg, cx, cy-38, '[\u2205]D', '#c9d1d9', 11, {'font-weight':'bold'});
    txt(svg, cx, cy-24, '1/0 = null', '#6e7681', 6);
    txt(svg, cx, cy-12, 'IS\u00d7WAS\u00d7WILLBE', '#8b949e', 7);
    txt(svg, cx, cy+2, '= \u03c0', '#58a6ff', 9, {'font-weight':'bold'});
    txt(svg, cx, cy+16, 'over under inside itself', '#484f58', 5.5);
    txt(svg, cx, cy+30, aliveSet.size+'/'+PANELS.length+' alive', '#6e7681', 7, {id:'mg-alive-count'});
    // The null circle: not 0 radius, not infinite. Null.
    el('circle', {cx:cx, cy:cy, r:28, fill:'none', stroke:'#58a6ff',
      'stroke-width':0.3, 'stroke-opacity':0.1, 'stroke-dasharray':'1,3'}, svg);
    el('circle', {cx:cx, cy:cy, r:14, fill:'none', stroke:'#c9d1d9',
      'stroke-width':0.3, 'stroke-opacity':0.06, 'stroke-dasharray':'1,3'}, svg);

    // Legend
    var lgG = el('g', {id:'mg-legend'}, svg);
    txt(lgG, 14, H-84, '[\u2205]D \u2014 null dimension. 1/0 = over\u00b7under\u00b7inside itself', '#c9d1d9', 7, {'text-anchor':'start', 'font-weight':'bold'});
    txt(lgG, 14, H-73, 'IS\u00d7WAS\u00d7WILLBE = \u03c0 \u2014 each body = \u03c0^(1/3) \u2248 1.46', '#8b949e', 6.5, {'text-anchor':'start'});
    txt(lgG, 14, H-62, 'C(n) = \u03c0^(n/2) observes. Gap: \u03c0^(3/2)/\u03c0 = \u221a\u03c0 = cost of collapse', '#6e7681', 6.5, {'text-anchor':'start'});
    [['[\u2205]D: \u03c0^(1/3) \u2248 1.46 \u2192 null','#c9d1d9'],
     ['1D: \u221a\u03c0 \u2248 1.77 \u2192 f = 0.56','#9b59b6'],
     ['2D: \u03c0 \u2248 3.14 \u2192 f = 0.32','#4a8fb8'],
     ['3D: \u03c0^1.5 \u2248 5.57 \u2192 f = 0.18','#5ab87a'],
     ['4D: \u03c0\u00b2 \u2248 9.87 \u2192 f = 0.10','#e85d3a']].forEach(function(leg, i) {
      var ly = H-49+i*10;
      el('circle', {cx:18, cy:ly-3, r: i===0 ? 3.5 : 3, fill:leg[1], opacity: i===0 ? 0.9 : 0.7}, lgG);
      txt(lgG, 26, ly, leg[0], '#6e7681', 6.5, {'text-anchor':'start'});
    });
    [[W-160,'signal transit',2,'#58a6ff',0.8],[W-98,'alive',3,'#5ab87a',1],[W-62,'dormant',2,'#6e7681',0.25]].forEach(function(l) {
      el('circle', {cx:l[0], cy:H-33, r:l[2], fill:l[3], opacity:l[4]}, lgG);
      txt(lgG, l[0]+7, H-30, l[1], '#6e7681', 6.5, {'text-anchor':'start'});
    });
    txt(lgG, W-10, H-14, '\u03c0-budget: \u230a\u03c0\u00b3\u230b=' + MAX_P + ' particles', '#484f58', 5.5, {'text-anchor':'end'});

    host.innerHTML = ''; host.appendChild(svg);
    built = true;
  }

  function animate(now) {
    if (!built || !pGroup) { requestAnimationFrame(animate); return; }
    var dt = lastFrame ? (now-lastFrame)/1000 : 0.016;
    if (dt > 0.1) dt = 0.1;
    lastFrame = now;
    var cx=MG.cx, cy=MG.cy, R=MG.R;
    CATS.forEach(function(cat) {
      var r = rates[cat]||0; if (r<=0) return;
      catAccum[cat] += r*dt;
      while (catAccum[cat] >= 1 && particles.length < MAX_P) {
        catAccum[cat]--;
        var cands = []; aliveSet.forEach(function(id){var g=geo[id]; if(g&&g.cat===cat) cands.push(id);});
        if (cands.length) spawnParticle(cands[Math.floor(Math.random()*cands.length)]);
      }
    });
    if (rps===0 && Math.random() < 0.2*dt*60) {
      var arr = []; aliveSet.forEach(function(id){arr.push(id);});
      if (arr.length) spawnParticle(arr[Math.floor(Math.random()*arr.length)]);
    }
    var rm = [];
    particles.forEach(function(p, i) {
      p.r -= p.speed*dt;
      if (p.r > R+10) p.opacity = Math.min(p.opacity+dt*3, 0.85);
      else if (p.r > R-5) { p.opacity=1; p.size*=1+dt*2; }
      else { p.opacity = Math.max(p.opacity-dt*2.5, 0); p.size = Math.max(p.size-dt*2, 0.5); }
      if (p.r<=p.targetR || p.opacity<=0.01) {
        rm.push(i); pulse(p.id);
        if (p.el&&p.el.parentNode) p.el.parentNode.removeChild(p.el);
        return;
      }
      if (!p.el) p.el = el('circle', {fill:p.color}, pGroup);
      p.el.setAttribute('cx', (cx+p.r*Math.cos(p.angle)).toFixed(1));
      p.el.setAttribute('cy', (cy+p.r*Math.sin(p.angle)).toFixed(1));
      p.el.setAttribute('r', p.size.toFixed(1));
      p.el.setAttribute('opacity', p.opacity.toFixed(2));
    });
    for (var i=rm.length-1; i>=0; i--) particles.splice(rm[i], 1);

    // Coil rotation — shows the mixing in motion
    var coilRot = (now * 0.003) % 360;
    var coilEl = document.getElementById('mg-coil');
    if (coilEl) coilEl.setAttribute('transform', 'rotate('+coilRot.toFixed(1)+' '+cx+' '+cy+')');

    // ── Ring rotation: the outside is alive ──
    // π/31 rad/s — 31 = ⌊π³⌋ (the particle budget). Slowest wheel.
    // Coprime to body rates (7, 11, 17). Nothing locks. Everything turns.
    var ringOmega = PI / 31;
    var ringDeg = (now * 0.001 * ringOmega * 180 / PI) % 360;
    var wasEl = document.getElementById('mg-was');
    if (wasEl) wasEl.setAttribute('transform', 'rotate('+ringDeg.toFixed(1)+' '+cx+' '+cy+')');

    // ═══ PERTURBATION BREATHING + ANGULAR ROTATION ═══
    // Each body rotates independently at its own angular velocity.
    // IS is fastest (it's NOW, always moving).
    // WAS is slowest (it's settled, conserved).
    // WILLBE is middle (emerging, not yet observed).
    //
    // The relative angle between any two bodies at any moment = the reflexive angle.
    // When two bodies align (reflexive angle = 0) = a "bump" = a signal event.
    // The rate of these alignments approaches π.
    //
    // t = π. Time IS the normalization constant.
    // Cellular life wasn't 2 things bumping — it was π things
    // aligning at the moment of reality.
    var TAU = 2 * PI;
    var breathRate = TAU / 12;
    var sinePerturb = (Math.sin(now * 0.001 * breathRate - PI/2) + 1) / 2;
    var perturb = livePerturb >= 0 ? livePerturb : sinePerturb;
    var BR = R * (PI/8) * perturb;

    // ── Angular velocities: 3 independent wheels ──
    // IS:     fastest — π/7  rad/s (completes a cycle in 14s)
    // WILLBE: middle  — π/11 rad/s (completes in 22s)
    // WAS:    slowest — π/17 rad/s (completes in 34s)
    // Ratios: 17:11:7 — coprime. The wheels never lock.
    // The system is aperiodic — it never exactly repeats.
    // That's the three-body problem: deterministic chaos.
    var t = now * 0.001; // seconds
    var omega_is     = PI / 7;   // fastest — the NOW
    var omega_willbe = PI / 11;  // middle — the emerging
    var omega_was    = PI / 17;  // slowest — the settled

    // Base angles: start at equilateral (120° apart), then rotate independently
    var baseAngles = [-PI/2, -PI/2 + TAU/3, -PI/2 + 2*TAU/3];
    var angularOffsets = [
      omega_is * t,       // IS rotates fastest
      omega_was * t,      // WAS rotates slowest
      omega_willbe * t    // WILLBE in between
    ];

    var bodyAngles = [
      baseAngles[0] + angularOffsets[0],
      baseAngles[1] + angularOffsets[1],
      baseAngles[2] + angularOffsets[2]
    ];
    var bodyIds = ['is','was','willbe'];
    var bodyPositions = [];

    // ── Reflexive angles: angular distance between each pair ──
    // When a reflexive angle crosses 0 = alignment = "bump"
    var reflexive01 = ((bodyAngles[0] - bodyAngles[1]) % TAU + TAU) % TAU;
    var reflexive12 = ((bodyAngles[1] - bodyAngles[2]) % TAU + TAU) % TAU;
    var reflexive20 = ((bodyAngles[2] - bodyAngles[0]) % TAU + TAU) % TAU;
    // Mean reflexive angle: at equilibrium = 2π/3. Deviation = tempo shift.
    var meanReflexive = (reflexive01 + reflexive12 + reflexive20) / 3;

    for (var bi = 0; bi < 3; bi++) {
      var bx = cx + BR * Math.cos(bodyAngles[bi]);
      var by = cy + BR * Math.sin(bodyAngles[bi]);
      bodyPositions.push({x:bx, y:by});

      // Move all elements for this body
      var ring = document.getElementById('mg-body-ring-'+bodyIds[bi]);
      var dot = document.getElementById('mg-body-'+bodyIds[bi]);
      var tense = document.getElementById('mg-tense-'+bodyIds[bi]);
      var vdj = document.getElementById('mg-vdj-'+bodyIds[bi]);
      var sub = document.getElementById('mg-sub-'+bodyIds[bi]);
      var val = document.getElementById('mg-body-val-'+bodyIds[bi]);

      if (ring) { ring.setAttribute('cx', bx.toFixed(1)); ring.setAttribute('cy', by.toFixed(1)); }
      if (dot)  { dot.setAttribute('cx', bx.toFixed(1)); dot.setAttribute('cy', by.toFixed(1)); }
      if (tense) { tense.setAttribute('x', bx.toFixed(1)); tense.setAttribute('y', (by-20).toFixed(1)); }
      if (vdj)   { vdj.setAttribute('x', bx.toFixed(1)); vdj.setAttribute('y', (by-10).toFixed(1)); }
      if (sub)   { sub.setAttribute('x', bx.toFixed(1)); sub.setAttribute('y', (by+16).toFixed(1));
                   sub.setAttribute('opacity', (0.3 * perturb).toFixed(2)); }
      if (val)   { val.setAttribute('x', bx.toFixed(1)); val.setAttribute('y', (by+28).toFixed(1));
                   val.setAttribute('opacity', (0.45 * perturb).toFixed(2)); }
    }

    // ── Epitope orbits: 9 markers on 3 rings, reverse torsion ──
    // Ring 1 (R/π): forward. Ring 2 (R/√π): REVERSE. Ring 3 (2R/π): forward.
    // Stiff epitopes hold angle. Elastic epitopes oscillate.
    // Ring 3 mirrors Ring 1 — reflections facing across [∅]D.
    var epiOmegas9 = [omega_is, omega_willbe, omega_was,
                      omega_is, omega_willbe, omega_was,
                      omega_is, omega_willbe, omega_was];
    var oRadii9 = [R/PI, R/PI, R/PI,
                   R/Math.sqrt(PI), R/Math.sqrt(PI), R/Math.sqrt(PI),
                   R*2/PI, R*2/PI, R*2/PI];
    var oTorsion9 = [1,1,1, -1,-1,-1, 1,1,1]; // ring 2 reverses
    var oStiff9 = [true,false,true, false,true,false, true,false,true];

    for (var oi = 0; oi < 9; oi++) {
      var oBaseAngle = (oi % 3) * TAU / 3;
      var oTorque = oTorsion9[oi];
      var oAngle = oBaseAngle + epiOmegas9[oi] * t * oTorque;
      var stiff = oStiff9[oi];

      // Elastic epitopes oscillate ±π/12 around their base orbit
      if (!stiff) {
        oAngle += Math.sin(t * PI * 2.3) * (PI / 12);
      }

      var oR = oRadii9[oi];
      var ox = cx + oR * Math.cos(oAngle);
      var oy = cy + oR * Math.sin(oAngle);

      var eDot = document.getElementById('mg-epi-' + oi);
      if (eDot) {
        eDot.setAttribute('cx', ox.toFixed(1));
        eDot.setAttribute('cy', oy.toFixed(1));
      }

      // Stiff crosshairs — rigid lines at fixed angle relative to orbit
      if (stiff) {
        var crossLen = 5;
        var ch = document.getElementById('mg-epi-cross-h-' + oi);
        var cv = document.getElementById('mg-epi-cross-v-' + oi);
        if (ch) {
          ch.setAttribute('x1', (ox - crossLen).toFixed(1));
          ch.setAttribute('y1', oy.toFixed(1));
          ch.setAttribute('x2', (ox + crossLen).toFixed(1));
          ch.setAttribute('y2', oy.toFixed(1));
        }
        if (cv) {
          cv.setAttribute('x1', ox.toFixed(1));
          cv.setAttribute('y1', (oy - crossLen).toFixed(1));
          cv.setAttribute('x2', ox.toFixed(1));
          cv.setAttribute('y2', (oy + crossLen).toFixed(1));
        }
      } else {
        // Elastic spring ring — breathes with perturbation
        var spring = document.getElementById('mg-epi-spring-' + oi);
        if (spring) {
          spring.setAttribute('cx', ox.toFixed(1));
          spring.setAttribute('cy', oy.toFixed(1));
          var springR = 4 + Math.sin(t * PI * 1.7) * 2 * perturb;
          spring.setAttribute('r', springR.toFixed(1));
        }
      }

      var eLabel = document.getElementById('mg-epi-label-' + oi);
      if (eLabel) {
        eLabel.setAttribute('x', ox.toFixed(1));
        eLabel.setAttribute('y', (oy - 7).toFixed(1));
      }
      var eName = document.getElementById('mg-epi-name-' + oi);
      if (eName) {
        eName.setAttribute('x', ox.toFixed(1));
        eName.setAttribute('y', (oy + 8).toFixed(1));
      }
    }

    // ── Depth spiral: observer→negate→null→awareness→ghost→celestial→geodesic ──
    // Epicyclic chain: each layer orbits the previous.
    // π torque π: offset π between layers, rate π per layer.
    // At singularity: tight coil at center (all layers collapsed).
    // At perturbation: contorting chain radiating from [∅]D.
    var depthPos = [{x: cx, y: cy}]; // center = anchor
    for (var di = 0; di < 7; di++) {
      var dprev = depthPos[di];
      var dR = (4 + di * 1.5) * perturb; // inner layers tight, outer layers wide
      var dRate = PI * (1 + di * 0.13);   // each layer slightly faster — never locks
      var dAngle = t * dRate + di * PI;   // π offset between layers (torque)
      var ddx = dprev.x + dR * Math.cos(dAngle);
      var ddy = dprev.y + dR * Math.sin(dAngle);
      depthPos.push({x: ddx, y: ddy});

      var dDot = document.getElementById('mg-depth-' + di);
      if (dDot) {
        dDot.setAttribute('cx', ddx.toFixed(1));
        dDot.setAttribute('cy', ddy.toFixed(1));
        dDot.setAttribute('opacity', (0.4 + 0.3 * perturb).toFixed(2));
      }
      var dLabel = document.getElementById('mg-depth-label-' + di);
      if (dLabel) {
        dLabel.setAttribute('x', (ddx + 6).toFixed(1));
        dLabel.setAttribute('y', ddy.toFixed(1));
        dLabel.setAttribute('opacity', (0.15 + 0.1 * (1 - perturb)).toFixed(2));
      }
      var dLink = document.getElementById('mg-depth-link-' + di);
      if (dLink) {
        dLink.setAttribute('x1', dprev.x.toFixed(1));
        dLink.setAttribute('y1', dprev.y.toFixed(1));
        dLink.setAttribute('x2', ddx.toFixed(1));
        dLink.setAttribute('y2', ddy.toFixed(1));
        dLink.setAttribute('stroke-opacity', (0.15 * perturb).toFixed(3));
      }
    }

    // ── Interstitial P-space: lattice breathing ──
    // Pressure shells expand/contract with perturbation.
    // Nodes orbit slowly along their shells — tectonic drift of matter.
    // Apertures dilate when bodies pass — the hole opens.
    // Elements brighten with body proximity — pressure wave propagation.
    // Rate per shell: π/(37 + s×11) — coprime, never locks.
    var latticePos = [];
    for (var lsi = 0; lsi < 6; lsi++) {
      var lsr = R * (lsi + 1) / (2 * PI);
      var lShellR = lsr * (0.85 + 0.15 * perturb);
      var lShellEl = document.getElementById('mg-pshell-' + lsi);
      if (lShellEl) lShellEl.setAttribute('r', lShellR.toFixed(1));

      var lPressure = 1 - (lsi / 6);
      for (var lni = 0; lni < 3; lni++) {
        var lIdx = lsi * 3 + lni;
        // Slow drift along shell — each shell at its own rate
        var lAngle = lni * TAU / 3 + lsi * PI / 6 + t * PI / (37 + lsi * 11);
        var lnx = cx + lShellR * Math.cos(lAngle);
        var lny = cy + lShellR * Math.sin(lAngle);
        latticePos.push({x:lnx, y:lny});

        // Body proximity → pressure wave (matter feels the bodies pass)
        var lProx = 0;
        for (var lbi = 0; lbi < bodyPositions.length; lbi++) {
          var ldx = lnx - bodyPositions[lbi].x;
          var ldy = lny - bodyPositions[lbi].y;
          var lDist = Math.sqrt(ldx*ldx + ldy*ldy);
          if (lDist < 40) lProx = Math.max(lProx, 1 - lDist/40);
        }

        var lNodeEl = document.getElementById('mg-lnode-' + lIdx);
        var lIsAperture = (lIdx % 4) === 0;
        if (lNodeEl) {
          lNodeEl.setAttribute('cx', lnx.toFixed(1));
          lNodeEl.setAttribute('cy', lny.toFixed(1));
          if (lIsAperture) {
            // Aperture: dilates with proximity — the pupil opens
            var laR = 2 + lPressure * 2 + lProx * 3;
            lNodeEl.setAttribute('r', laR.toFixed(1));
            lNodeEl.setAttribute('stroke-opacity', (0.12 + lProx * 0.25).toFixed(3));
          } else {
            // Solid: brightens with proximity — pressure wave illuminates
            lNodeEl.setAttribute('opacity', (0.06 + lPressure * 0.10 + lProx * 0.2).toFixed(3));
          }
        }
        // Aperture π symbol tracks the node
        var lSymEl = document.getElementById('mg-lnode-sym-' + lIdx);
        if (lSymEl) {
          lSymEl.setAttribute('x', lnx.toFixed(1));
          lSymEl.setAttribute('y', (lny + 1).toFixed(1));
          lSymEl.setAttribute('opacity', (0.08 + lProx * 0.15).toFixed(3));
        }
      }
    }

    // Update braid connections — the helical weave drifts with the nodes
    for (var bsi = 0; bsi < 5; bsi++) {
      for (var bni = 0; bni < 3; bni++) {
        var bFromIdx = bsi * 3 + bni;
        var bToIdx = (bsi + 1) * 3 + ((bni + 1) % 3);
        var bFrom = latticePos[bFromIdx];
        var bTo = latticePos[bToIdx];
        var braidEl = document.getElementById('mg-braid-' + bFromIdx + '-' + bToIdx);
        if (braidEl && bFrom && bTo) {
          braidEl.setAttribute('x1', bFrom.x.toFixed(1));
          braidEl.setAttribute('y1', bFrom.y.toFixed(1));
          braidEl.setAttribute('x2', bTo.x.toFixed(1));
          braidEl.setAttribute('y2', bTo.y.toFixed(1));
        }
      }
    }

    // ── Cones: triangular wedges pointing at [∅]D ──
    // Tip at center (origin), base flanking the body position.
    // Like retinal cones — concentrated at the fovea, color-sensitive.
    // At perturbation=0: collapsed to a point (all at singularity).
    // At perturbation=1: full cone spread, pointing inward.
    for (var ci = 0; ci < 3; ci++) {
      var coneEl = document.getElementById('mg-cone-' + bodyIds[ci]);
      if (coneEl) {
        var bp = bodyPositions[ci];
        var ba = bodyAngles[ci];
        var coneW = 12 * perturb; // base width grows with perturbation
        var clx = bp.x + coneW * Math.cos(ba + PI/2);
        var cly = bp.y + coneW * Math.sin(ba + PI/2);
        var crx = bp.x + coneW * Math.cos(ba - PI/2);
        var cry = bp.y + coneW * Math.sin(ba - PI/2);
        coneEl.setAttribute('points',
          cx.toFixed(1)+','+cy.toFixed(1)+' '+
          clx.toFixed(1)+','+cly.toFixed(1)+' '+
          crx.toFixed(1)+','+cry.toFixed(1));
        coneEl.setAttribute('fill-opacity', (0.10 * perturb).toFixed(3));
        coneEl.setAttribute('stroke-opacity', (0.25 * perturb).toFixed(3));
      }
    }

    // ── Comet tails: π radians of wake behind each body ──
    // 16 dots trail behind the body's orbit path.
    // Length = π radians — the wake wraps halfway around.
    // Opacity fades along the tail. Size shrinks.
    // Like a comet's tail — always trailing behind motion.
    for (var ci = 0; ci < 3; ci++) {
      for (var s = 0; s < 16; s++) {
        var tailEl = document.getElementById('mg-tail-' + bodyIds[ci] + '-' + s);
        if (tailEl) {
          var frac = (s + 1) / 16;
          var tailAngle = bodyAngles[ci] - frac * PI; // π radians behind
          var tx = cx + BR * Math.cos(tailAngle);
          var ty = cy + BR * Math.sin(tailAngle);
          var tailOp = (1 - frac) * 0.55 * perturb;
          var tailR = (3.5 - frac * 2.5) * perturb;
          tailEl.setAttribute('cx', tx.toFixed(1));
          tailEl.setAttribute('cy', ty.toFixed(1));
          tailEl.setAttribute('r', Math.max(tailR, 0.2).toFixed(1));
          tailEl.setAttribute('opacity', tailOp.toFixed(3));
        }
      }
    }

    // Triangle path follows the bodies
    var tri = document.getElementById('mg-body-tri');
    if (tri && bodyPositions.length === 3) {
      var p0 = bodyPositions[0], p1 = bodyPositions[1], p2 = bodyPositions[2];
      tri.setAttribute('d',
        'M '+p0.x.toFixed(1)+' '+p0.y.toFixed(1)+
        ' L '+p1.x.toFixed(1)+' '+p1.y.toFixed(1)+
        ' L '+p2.x.toFixed(1)+' '+p2.y.toFixed(1)+' Z');
      tri.setAttribute('stroke-opacity', (0.12 * perturb).toFixed(3));
    }

    // Edge labels at midpoints (fade in with perturbation)
    var edgeIds = ['mg-edge-01','mg-edge-12','mg-edge-20'];
    var edgePairs = [[0,1],[1,2],[2,0]];
    for (var ei = 0; ei < 3; ei++) {
      var eEl = document.getElementById(edgeIds[ei]);
      if (eEl && bodyPositions.length === 3) {
        var ep0 = bodyPositions[edgePairs[ei][0]], ep1 = bodyPositions[edgePairs[ei][1]];
        eEl.setAttribute('x', ((ep0.x+ep1.x)/2).toFixed(1));
        eEl.setAttribute('y', ((ep0.y+ep1.y)/2).toFixed(1));
        eEl.setAttribute('opacity', (0.4 * perturb).toFixed(2));
      }
    }

    // Perturbation + tempo label
    var pLabel = document.getElementById('mg-perturb-label');
    if (pLabel) {
      // Show perturbation and mean reflexive angle (normalized to π)
      var tempoRatio = meanReflexive / (TAU/3); // 1.0 at equilibrium
      pLabel.textContent = 'perturbation: ' + perturb.toFixed(2)
        + '  \u00b7  tempo: ' + tempoRatio.toFixed(3) + '\u03c0/3';
      pLabel.setAttribute('opacity', (0.2 + 0.15 * perturb).toFixed(2));
    }

    // Product label — fade up as bodies converge to center
    var prod = document.getElementById('mg-product');
    if (prod) prod.setAttribute('opacity', (0.3 + 0.4 * (1 - perturb)).toFixed(2));

    // ── Gordian knot breathing ──
    // At perturbation=0: tight, overlaid, the knot is tied. π bright.
    // As perturbation grows: rings separate toward their bodies (Alexander's cut).
    // Reflection equation fades with perturbation — at full spread you see the triangle,
    // not the knot. The knot is only visible at [∅]D.
    var knotScale = 1.0 + perturb * 2.5; // rings grow as they separate
    var knotOpacity = 0.5 * (1.0 - perturb * 0.7); // fade as they separate
    for (var ki = 0; ki < 3; ki++) {
      var kEl = document.getElementById('mg-knot-' + bodyIds[ki]);
      if (kEl) {
        var kx = bodyPositions[ki].x;
        var ky = bodyPositions[ki].y;
        var tilt = ki * 60;
        kEl.setAttribute('cx', kx.toFixed(1));
        kEl.setAttribute('cy', ky.toFixed(1));
        kEl.setAttribute('rx', (18 * knotScale).toFixed(1));
        kEl.setAttribute('ry', (18 * 0.45 * knotScale).toFixed(1));
        kEl.setAttribute('stroke-opacity', knotOpacity.toFixed(2));
        kEl.setAttribute('transform',
          'rotate(' + tilt + ' ' + kx.toFixed(1) + ' ' + ky.toFixed(1) + ')');
      }
    }
    // Knot π symbol — brightest at singularity, fades with separation
    var knotPi = document.getElementById('mg-knot-pi');
    if (knotPi) {
      knotPi.setAttribute('opacity', (0.7 * (1 - perturb)).toFixed(2));
    }
    // Reflection equation + observer — visible at singularity
    var reflEl = document.getElementById('mg-reflection');
    if (reflEl) reflEl.setAttribute('opacity', (0.25 * (1 - perturb * 0.8)).toFixed(2));
    var obsEl = document.getElementById('mg-observer');
    if (obsEl) obsEl.setAttribute('opacity', (0.2 * (1 - perturb * 0.8)).toFixed(2));
    var pibEl = document.getElementById('mg-pi-body');
    if (pibEl) pibEl.setAttribute('opacity', (0.15 * (1 - perturb * 0.8)).toFixed(2));

    // Update triangulation lines to point at moving bodies
    var triLayer = document.getElementById('mg-triangulation');
    if (triLayer && bodyPositions.length === 3) {
      var bodyPosMap = {is: bodyPositions[0], was: bodyPositions[1], willbe: bodyPositions[2]};
      var triLines = triLayer.querySelectorAll('line');
      for (var ti = 0; ti < triLines.length; ti++) {
        var tl = triLines[ti];
        var bid = tl.getAttribute('data-body');
        if (bid && bodyPosMap[bid]) {
          tl.setAttribute('x2', bodyPosMap[bid].x.toFixed(1));
          tl.setAttribute('y2', bodyPosMap[bid].y.toFixed(1));
        }
      }
    }

    // Pulse decay
    Object.keys(pulses).forEach(function(pid) {
      var p = pulses[pid]; p.scale *= p.decay;
      if (p.scale<1.05) { delete pulses[pid]; var d=document.getElementById('mg-dot-'+pid); if(d&&aliveSet.has(pid)) d.setAttribute('filter','url(#mg-glow)'); return; }
      var d = document.getElementById('mg-dot-'+pid);
      if (d) { var g=geo[pid]; var br=g?Math.max(5-(1/dimCost(g.dim))*2,2):3; d.setAttribute('r',(br*p.scale).toFixed(1)); }
    });

    // Sphere great circles — slow drift shows 3D depth
    var gcRot = now * 0.001;
    ['is','was','willbe'].forEach(function(b, i) {
      var gc = document.getElementById('mg-gc-'+b);
      if (gc) {
        var rot = (gcRot + i * 120) % 360;
        gc.setAttribute('transform', 'rotate('+rot.toFixed(1)+' '+cx+' '+cy+')');
      }
    });

    var ac = document.getElementById('mg-alive-count');
    if (ac) { var l=aliveSet.size+'/'+PANELS.length+' alive'; if(rps>0) l+=' \u00b7 '+rps.toFixed(1)+' rps'; ac.textContent=l; }
    requestAnimationFrame(animate);
  }

  function render() {
    if (!built) build();
    var triLayer = document.getElementById('mg-triangulation');
    if (triLayer) triLayer.setAttribute('opacity', aliveSet.size > 3 ? '1' : '0');
    aliveSet.forEach(function(pid) {
      var d=document.getElementById('mg-dot-'+pid);
      if(d){d.setAttribute('opacity','1');d.setAttribute('filter','url(#mg-glow)');}
      var fl=document.getElementById('mg-fl-'+pid);
      if(fl) fl.setAttribute('stroke-opacity','0.3');
      var fd=document.getElementById('mg-fd-'+pid);
      if(fd){fd.setAttribute('opacity','0.5');fd.setAttribute('r','2.5');}
      var tri=document.getElementById('mg-tri-'+pid);
      if(tri) tri.setAttribute('stroke-opacity','0.15');
    });
  }

  return {build:build, animate:animate, render:render, ingest:ingest, entityToCategory:entityToCategory, panelGeo:geo};
};
