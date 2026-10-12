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
  // Live stats for ionosphere band display — updated by ingest()
  var liveStats = {
    rps: 0, fleetIps: 0, humanIps: 0, fleetPct: 0,
    totalReqs: 0, entityCount: 0, aliveCount: 0
  };
  // Dimensional shape classification — ○□△◇ at module scope so animate() can see it
  var DIM_SHAPES = [
    {dim:1, sym:'\u25cb', color:'#9b59b6', count:0, names:[]},  // ○ circle
    {dim:2, sym:'\u25a1', color:'#e85d3a', count:0, names:[]},  // □ square
    {dim:3, sym:'\u25b3', color:'#5ab87a', count:0, names:[]},  // △ triangle
    {dim:4, sym:'\u25c7', color:'#4a8fb8', count:0, names:[]}   // ◇ diamond
  ];
  if (PANELS && PANELS.length) {
    PANELS.forEach(function(p) {
      var dsi = Math.min(Math.max((p.dim || 1) - 1, 0), 3);
      DIM_SHAPES[dsi].count++;
      DIM_SHAPES[dsi].names.push(p.id);
    });
  }

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
    // Store live stats for ionosphere band display
    liveStats.rps = dash.rps || 0;
    liveStats.fleetIps = dash.fleet_ips || 0;
    liveStats.humanIps = dash.human_ips || 0;
    liveStats.fleetPct = dash.fleet_pct || 0;
    liveStats.totalReqs = dash.total_requests || 0;
    liveStats.entityCount = ents.length;
    liveStats.aliveCount = aliveSet.size;
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

    // ═══ COMPLEXITY SPINE: jelly strand evolution chain ═══
    // The jelly strand sorts reality by complexity.
    // From [∅]D (null) → quark → atom → molecule → lattice → helix → cell
    //   → organism → Earth → system → Oort.
    // 11 tiers. 11 is prime. The 11th prime is 31 = π-budget.
    // Self strand spirals clockwise. Non-self counter-clockwise.
    // π crossings per tier. The twist IS abstraction.
    // Each tier contains all below it. Each abstracts all below it.
    // The jelly: soft, translucent, wobbling. The connective tissue of reality.
    var spineG = el('g', {id:'mg-spine'}, svg);
    var TIERS = [
      {name:'\u2205',      rFrac:0,     color:'#ffffff'},  // null — the point
      {name:'quark',       rFrac:0.05,  color:'#d2a8ff'},  // fundamental particle
      {name:'atom',        rFrac:0.18,  color:'#c9d1d9'},  // H — simplest
      {name:'He',          rFrac:0.25,  color:'#f0e68c'},  // fusion product
      {name:'H\u2082O',    rFrac:0.35,  color:'#58a6ff'},  // molecule — bonds
      {name:'lattice',     rFrac:0.52,  color:'#6e7681'},  // crystal — structure
      {name:'helix',       rFrac:0.68,  color:'#d2a8ff'},  // DNA — code
      {name:'cell',        rFrac:0.82,  color:'#5ab87a'},  // membrane — boundary
      {name:'Earth',       rFrac:1.0,   color:'#c9d1d9'},  // ring — the membrane
      {name:'system',      rFrac:1.32,  color:'#f0e68c'},  // solar — scale
      {name:'Oort',        rFrac:1.55,  color:'#484f58'}   // cosmic membrane
    ];
    // Tier nodes — complexity markers along the spine
    for (var sti = 0; sti < TIERS.length; sti++) {
      el('circle', {cx:cx, cy:cy, r:1.2,
        fill:TIERS[sti].color, opacity:0.08,
        id:'mg-tier-' + sti}, spineG);
      txt(spineG, cx, cy, TIERS[sti].name, TIERS[sti].color, 3.5,
        {opacity:0.04, id:'mg-tier-label-' + sti});
    }
    // Self spine strand — jelly extending from [∅]D through all tiers to Oort
    el('path', {d:'M '+cx+' '+cy, fill:'none',
      stroke:'#4a8fb8', 'stroke-width':0.5, 'stroke-opacity':0.04,
      'stroke-dasharray':'4,8', id:'mg-spine-self'}, spineG);
    // Non-self spine strand — counter-rotating jelly
    el('path', {d:'M '+cx+' '+cy, fill:'none',
      stroke:'#e85d3a', 'stroke-width':0.5, 'stroke-opacity':0.04,
      'stroke-dasharray':'4,8', id:'mg-spine-nonself'}, spineG);
    // Tier connection arcs — faint lines linking consecutive tiers
    for (var stci = 0; stci < TIERS.length - 1; stci++) {
      el('line', {x1:cx, y1:cy, x2:cx, y2:cy,
        stroke:TIERS[stci+1].color, 'stroke-width':0.3,
        'stroke-opacity':0.02, 'stroke-dasharray':'1,6',
        id:'mg-tier-link-' + stci}, spineG);
    }

    // ── Process verbs: scan → sweep → sort → fossilize → evolve ──
    // The 5 actions that build reality at every tier.
    // Each process spans 2 tiers of the chain (10 gaps / 5 = 2).
    // scan at quark scale. sweep at fusion. sort at molecular.
    // fossilize at cellular. evolve at planetary.
    // When the wave passes through, the verb activates.
    var PROCS = ['scan','sweep','sort','fossilize','evolve'];
    var PROC_COLORS = ['#ffffff','#4a8fb8','#5ab87a','#f0e68c','#d2a8ff'];
    for (var spi = 0; spi < 5; spi++) {
      txt(spineG, cx, cy, PROCS[spi], PROC_COLORS[spi], 4,
        {opacity:0.03, 'font-style':'italic', id:'mg-proc-' + spi});
    }
    // Evolution wave — the particle that climbs the chain
    // One dot, from [∅]D to Oort, cycling. The scan head.
    el('circle', {cx:cx, cy:cy, r:2.5,
      fill:'#ffffff', opacity:0.08,
      filter:'url(#mg-glow)', id:'mg-evo-wave'}, spineG);
    // Wave trail — 3 fading dots behind the wave
    for (var ewt = 0; ewt < 3; ewt++) {
      el('circle', {cx:cx, cy:cy, r:1.5 - ewt * 0.4,
        fill:'#c9d1d9', opacity:0.03,
        id:'mg-evo-trail-' + ewt}, spineG);
    }

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

    // The base fraction: a/b = π. The slash is the constant.
    txt(latticeG, cx, cy + 114,
      'a/b = \u03c0 \u00b7 a/0 = [\u2205]D \u00b7 the slash is the membrane',
      '#484f58', 4.5, {opacity:0.12, id:'mg-base-fraction'});
    txt(latticeG, cx, cy + 126,
      'N\u2090 \u2248 2\u03c0\u00d710\u00b2\u00b3  \u00b7  PV = n\u03c0T',
      '#484f58', 4.5, {opacity:0.12, id:'mg-avogadro'});

    // ═══ CONVERGENCE: ionosphere + fingerprint → membrane → pin ═══
    // Three apertures converging over time to a single point.
    // The ionosphere (geographic transit), the fingerprint (behavioral shape),
    // and the membrane (observation surface) — all stack and twist at π.
    // Reality set on a pin. 1 point wide. Which splits to 3 and up the primes.
    var convG = el('g', {id:'mg-convergence'}, svg);

    // ── Ionosphere ghost: geographic arcs projected onto the membrane ring ──
    // Signal transit routes from the globe, collapsed into ring angles.
    // 5 major corridors: US-IE, US-CN, US-BY, IE-DE, CN-JP
    var ioRoutes = [
      {from:-98, to:-8, color:'#4a8fb8'},   // US → IE
      {from:-98, to:104, color:'#e85d3a'},   // US → CN (via Pacific)
      {from:-98, to:28, color:'#f1c40f'},    // US → BY
      {from:-8, to:10, color:'#5ab87a'},     // IE → DE
      {from:104, to:138, color:'#9b59b6'}    // CN → JP
    ];
    ioRoutes.forEach(function(rt, i) {
      el('path', {d:'M '+cx+' '+cy, fill:'none',
        stroke:rt.color, 'stroke-width':0.4, 'stroke-opacity':0.06,
        'stroke-dasharray':'3,6', id:'mg-io-arc-' + i
      }, convG);
    });

    // ── Fingerprint ghost: behavioral clusters projected as scatter ──
    // UA pool × IP count, mapped to radius × angle on the membrane.
    // 7 cluster seeds (primes: 2,3,5,7,11,13,17)
    var fpSeeds = [2,3,5,7,11,13,17];
    fpSeeds.forEach(function(p, i) {
      el('circle', {cx:cx, cy:cy, r:1.5,
        fill:'#9b59b6', opacity:0.05,
        id:'mg-fp-dot-' + i}, convG);
    });

    // ── The pin: convergence point. 1 point wide. ──
    // All of reality set on a pin. The single aperture.
    // [∅]D IS the pin. Everything converges here.
    el('circle', {cx:cx, cy:cy, r:1.5,
      fill:'#ffffff', opacity:0.7,
      id:'mg-pin'}, convG);
    el('circle', {cx:cx, cy:cy, r:4,
      fill:'none', stroke:'#ffffff', 'stroke-width':0.3,
      'stroke-opacity':0.2, id:'mg-pin-ring'}, convG);

    // ── Prime splitting: from pin → 3 → up the primes per π ──
    // The pin splits to 3 bodies, which split up the primes.
    // Primes to ⌊π³⌋=31: 2,3,5,7,11,13,17,19,23,29,31
    // Each prime at angle = p × (π−3) × 2π — irrational spacing, never repeats.
    // The observer fraction (0.14159...) distributes the primes.
    var PRIMES = [2,3,5,7,11,13,17,19,23,29,31];
    var observerFrac = PI - Math.floor(PI); // 0.14159...
    PRIMES.forEach(function(p) {
      var pAngle = p * observerFrac * TAU;
      var px1 = cx + 6 * Math.cos(pAngle);
      var py1 = cy + 6 * Math.sin(pAngle);
      var px2 = cx + R * 0.4 * Math.cos(pAngle);
      var py2 = cy + R * 0.4 * Math.sin(pAngle);
      el('line', {x1:px1, y1:py1, x2:px2, y2:py2,
        stroke:'#c9d1d9', 'stroke-width':0.3, 'stroke-opacity':0.05,
        id:'mg-prime-' + p}, convG);
    });

    // Convergence label
    txt(convG, cx, cy + 138,
      'pin \u2192 3 \u2192 primes \u00b7 converging to single aperture',
      '#484f58', 4, {opacity:0.10, id:'mg-convergence-label'});

    // ═══ CHEMISTRY: H + H → He, H + H + O → H₂O ═══
    // The basic three-body problem of matter.
    // Hydrogen is the simplest. IS. The first thing that exists.
    // Two H's under pressure → He (fusion). The sun does this.
    // Two H's + one O → H₂O (water). Life needs this.
    // Bond angle 104.5° ≈ π/1.72 rad. Not π/2. Not π/3. Its own thing.
    // The lattice IS the reactor. Pressure drives the chemistry.
    var chemG = el('g', {id:'mg-chem'}, svg);

    // 2 Hydrogen + 1 Oxygen — the basic three-body
    var chemDefs = [
      {id:'H1', symbol:'H', color:'#c9d1d9', r:3},
      {id:'H2', symbol:'H', color:'#c9d1d9', r:3},
      {id:'O',  symbol:'O', color:'#58a6ff', r:4}
    ];
    chemDefs.forEach(function(ce) {
      el('circle', {cx:cx, cy:cy, r:ce.r,
        fill:ce.color, opacity:0.25,
        id:'mg-chem-' + ce.id}, chemG);
      txt(chemG, cx, cy, ce.symbol, ce.color, 6,
        {opacity:0.15, 'font-weight':'bold', id:'mg-chem-label-' + ce.id});
    });

    // He fusion indicator — appears when H + H are close under pressure
    el('circle', {cx:cx, cy:cy, r:5,
      fill:'#f0e68c', opacity:0, filter:'url(#mg-glow)',
      id:'mg-chem-He'}, chemG);
    txt(chemG, cx, cy, 'He', '#f0e68c', 7,
      {opacity:0, 'font-weight':'bold', id:'mg-chem-label-He'});

    // H₂O bond lines — appear when H-O-H triangle forms
    el('line', {x1:cx, y1:cy, x2:cx, y2:cy,
      stroke:'#58a6ff', 'stroke-width':1, 'stroke-opacity':0,
      id:'mg-bond-HO1'}, chemG);
    el('line', {x1:cx, y1:cy, x2:cx, y2:cy,
      stroke:'#58a6ff', 'stroke-width':1, 'stroke-opacity':0,
      id:'mg-bond-HO2'}, chemG);
    // H-H proximity bond — appears during near-fusion
    el('line', {x1:cx, y1:cy, x2:cx, y2:cy,
      stroke:'#f0e68c', 'stroke-width':0.6, 'stroke-opacity':0,
      'stroke-dasharray':'2,2', id:'mg-bond-HH'}, chemG);

    // H₂O label
    txt(chemG, cx, cy, 'H\u2082O', '#58a6ff', 6,
      {opacity:0, 'font-weight':'bold', id:'mg-chem-label-H2O'});

    // Bond angle annotation (104.5°)
    el('path', {d:'M 0 0', fill:'none',
      stroke:'#58a6ff', 'stroke-width':0.4, 'stroke-opacity':0,
      'stroke-dasharray':'2,3', id:'mg-bond-angle'}, chemG);
    txt(chemG, cx, cy, '104.5\u00b0', '#484f58', 4,
      {opacity:0, id:'mg-bond-angle-label'});

    // ═══ SOLAR SYSTEM: the ring IS Earth. Pin IS the Sun. ═══
    // Inside the ring: atomic/quantum scale (chemistry, lattice, fusion).
    // The ring: Earth's membrane. The boundary between inner and outer.
    // Outside the ring: astronomical scale. Moon, Mars, Jupiter, Saturn.
    // Oort Cloud at the edge. The pin at center IS the sun.
    // H + H → He at center IS stellar fusion. It's all the same system.
    var solarG = el('g', {id:'mg-solar'}, svg);

    // Planetary orbits outside the ring (Earth = the ring itself)
    var planets = [
      {id:'moon',    orb:R+12,    size:2,   color:'#c9d1d9', label:'\u263D'},
      {id:'mars',    orb:R*1.15,  size:2.5, color:'#e85d3a', label:'\u2642'},
      {id:'jupiter', orb:R*1.32,  size:4,   color:'#f0e68c', label:'\u2643'},
      {id:'saturn',  orb:R*1.44,  size:3.5, color:'#d2a8ff', label:'\u2644'}
    ];
    planets.forEach(function(p) {
      // Orbit trace
      el('circle', {cx:cx, cy:cy, r:p.orb, fill:'none',
        stroke:p.color, 'stroke-width':0.3, 'stroke-opacity':0.04,
        'stroke-dasharray':'2,8', id:'mg-solar-orbit-' + p.id}, solarG);
      // Planet dot
      el('circle', {cx:cx + p.orb, cy:cy, r:p.size,
        fill:p.color, opacity:0.25,
        id:'mg-solar-' + p.id}, solarG);
      // Symbol label
      txt(solarG, cx + p.orb, cy - p.size - 3, p.label, p.color, 6,
        {opacity:0.15, id:'mg-solar-label-' + p.id});
    });

    // Asteroid belt between Mars and Jupiter
    el('circle', {cx:cx, cy:cy, r:R*1.23, fill:'none',
      stroke:'#6e7681', 'stroke-width':0.8, 'stroke-opacity':0.03,
      'stroke-dasharray':'1,4', id:'mg-asteroid-belt'}, solarG);

    // Oort Cloud — the outermost boundary of the solar system
    el('circle', {cx:cx, cy:cy, r:Math.min(R*1.6, 230), fill:'none',
      stroke:'#484f58', 'stroke-width':0.5, 'stroke-opacity':0.03,
      'stroke-dasharray':'1,10', id:'mg-oort'}, solarG);
    // Oort label
    txt(solarG, cx, cy - Math.min(R*1.6, 230) - 4, 'Oort', '#484f58', 4,
      {opacity:0.06, id:'mg-oort-label'});

    // ═══ IONOSPHERE BAND: inner membrane space ═══
    // The ionosphere belongs INSIDE the membrane. Just below the ring.
    // Earth (ring) forces against it from below — pushing us toward the membrane.
    // Matter is the prediction. Compression is the lattice kernel.
    // The ionosphere is the last layer before the membrane boundary.
    // Signal transits THROUGH it to reach the ring (the outside world).
    var ionoBandG = el('g', {id:'mg-iono-band'}, svg);

    // Ionosphere shell — faint band between R*0.78 and R*0.94
    // The atmospheric layer where signal bends, reflects, refracts.
    el('circle', {cx:cx, cy:cy, r:R*0.86, fill:'none',
      stroke:'#4a8fb8', 'stroke-width':R*0.16,
      'stroke-opacity':0.015, id:'mg-iono-shell'}, ionoBandG);
    // Inner edge — the top of the atmosphere
    el('circle', {cx:cx, cy:cy, r:R*0.78, fill:'none',
      stroke:'#4a8fb8', 'stroke-width':0.4,
      'stroke-opacity':0.04, 'stroke-dasharray':'2,6',
      id:'mg-iono-inner'}, ionoBandG);
    // Outer edge — just below the ring (membrane)
    el('circle', {cx:cx, cy:cy, r:R*0.94, fill:'none',
      stroke:'#4a8fb8', 'stroke-width':0.4,
      'stroke-opacity':0.04, 'stroke-dasharray':'3,5',
      id:'mg-iono-outer'}, ionoBandG);

    // Earth pressure: 8 radial arrows pushing INWARD from ring toward ionosphere
    // Earth forces against the ionosphere. Gravity pushes us toward the membrane.
    for (var epi = 0; epi < 8; epi++) {
      var epAngle = epi * TAU / 8;
      el('line', {
        x1:(cx + R * 0.98 * Math.cos(epAngle)).toFixed(1),
        y1:(cy + R * 0.98 * Math.sin(epAngle)).toFixed(1),
        x2:(cx + R * 0.90 * Math.cos(epAngle)).toFixed(1),
        y2:(cy + R * 0.90 * Math.sin(epAngle)).toFixed(1),
        stroke:'#c9d1d9', 'stroke-width':0.4,
        'stroke-opacity':0.03,
        'marker-end':'', id:'mg-pressure-' + epi
      }, ionoBandG);
    }

    // Ionosphere signal corridors — 5 arcs at the ionosphere altitude
    // These are the same routes from convergence, but positioned in the band.
    for (var ibi = 0; ibi < 5; ibi++) {
      el('path', {d:'M 0 0', fill:'none',
        stroke:['#4a8fb8','#e85d3a','#f1c40f','#5ab87a','#9b59b6'][ibi],
        'stroke-width':0.5, 'stroke-opacity':0.04,
        'stroke-dasharray':'2,4', id:'mg-iono-route-' + ibi
      }, ionoBandG);
    }

    // Ionosphere sublayers: D (lowest), E (middle), F (highest)
    // Real ionosphere has these. Signal reflects off different layers at different
    // frequencies. D absorbs. E reflects medium-wave. F reflects shortwave long-distance.
    var ionoLayers = [
      {name:'D', rFrac:0.80, op:0.025},  // lowest — absorbs, attenuates
      {name:'E', rFrac:0.86, op:0.030},  // middle — sporadic reflection
      {name:'F', rFrac:0.92, op:0.025}   // highest — long-distance skip
    ];
    ionoLayers.forEach(function(il, i) {
      el('circle', {cx:cx, cy:cy, r:R*il.rFrac, fill:'none',
        stroke:'#4a8fb8', 'stroke-width':0.3,
        'stroke-opacity':il.op, 'stroke-dasharray':'1,4',
        id:'mg-iono-layer-' + il.name}, ionoBandG);
      txt(ionoBandG, cx + R * il.rFrac + 3, cy, il.name, '#4a8fb8', 3.5,
        {opacity:0.04, id:'mg-iono-layer-label-' + il.name});
    });

    // Signal transit particles — 5 dots riding the corridors
    // Signal actually MOVES through the ionosphere. This shows it.
    var ioTransitColors = ['#4a8fb8','#e85d3a','#f1c40f','#5ab87a','#9b59b6'];
    for (var iti = 0; iti < 5; iti++) {
      el('circle', {cx:cx, cy:cy, r:1.5,
        fill:ioTransitColors[iti], opacity:0.06,
        filter:'url(#mg-glow)', id:'mg-iono-transit-' + iti}, ionoBandG);
    }

    // Refraction points — where signal bends at ionosphere outer boundary
    // Signal enters from the ring (Earth), bends through the ionosphere.
    for (var rfi = 0; rfi < 5; rfi++) {
      el('circle', {cx:cx, cy:cy, r:1,
        fill:'#ffffff', opacity:0.03,
        id:'mg-refract-' + rfi}, ionoBandG);
    }

    // Compression pulses — 3 rings compressing inward through the lattice
    // The lattice IS compression. These show the kernel contracting.
    // Lattice shells span R*0.16 to R*0.96 — the outer shells are IN the ionosphere.
    for (var cpi = 0; cpi < 3; cpi++) {
      el('circle', {cx:cx, cy:cy, r:R*0.5, fill:'none',
        stroke:'#6e7681', 'stroke-width':0.4,
        'stroke-opacity':0.02, id:'mg-compress-' + cpi}, ionoBandG);
    }

    // Prediction wavefronts — 3 ripples from ring propagating inward
    // Matter predicts. The ring sends prediction waves toward the center.
    for (var pwi = 0; pwi < 3; pwi++) {
      el('circle', {cx:cx, cy:cy, r:R*0.97, fill:'none',
        stroke:'#c9d1d9', 'stroke-width':0.3,
        'stroke-opacity':0.02, id:'mg-predict-' + pwi}, ionoBandG);
    }

    // ── Live stats in the band: astronomers taught us this ──
    // Stats fall in the band. The ionosphere IS the observation layer.
    // RPS, fleet %, entity count, human IPs — all orbit in the band.
    // Astronomers measured stars by magnitude, distance, spectrum.
    // We measure entities by volume, origin, fingerprint. Same thing.
    var statLabels = [
      {id:'rps',     text:'0 rps',     color:'#e85d3a'},
      {id:'fleet',   text:'0% fleet',  color:'#9b59b6'},
      {id:'humans',  text:'0 humans',  color:'#5ab87a'},
      {id:'entities',text:'0 entities',color:'#4a8fb8'},
      {id:'total',   text:'0 total',   color:'#f0e68c'},
      {id:'alive',   text:'0 alive',   color:'#c9d1d9'}
    ];
    statLabels.forEach(function(sl) {
      txt(ionoBandG, cx, cy, sl.text, sl.color, 3.5,
        {opacity:0.04, id:'mg-stat-' + sl.id});
    });

    // Labels: matter = prediction, compression = kernel
    txt(ionoBandG, cx, cy - R * 0.86 - 5,
      'matter = prediction', '#8b949e', 4,
      {opacity:0.06, id:'mg-matter-label'});
    txt(ionoBandG, cx, cy + R * 0.86 + 7,
      'compression = lattice kernel', '#6e7681', 3.5,
      {opacity:0.06, id:'mg-kernel-label'});

    // ── Dimensional shape sweep: ○□△◇ through the complexity chain ──
    // The panel shapes ARE the complexity sort. ○=1D, □=2D, △=3D, ◇=4D.
    // Collision detection is □ (2D). Fingerprint is △ (3D). Epitope Matrix is ◇ (4D).
    // These were calculated in hud-pt.js mount(): shapeGlyph = p.dim === 1 ? '○' : ...
    // C(n) = π^(n/2). Each dimension costs more to observe.
    // Now we sweep them through the band — scan, sort, evolve.
    DIM_SHAPES.forEach(function(ds) {
      txt(ionoBandG, cx, cy, ds.sym, ds.color, 6,
        {opacity:0.04, id:'mg-dim-shape-' + ds.dim});
      txt(ionoBandG, cx, cy, ds.count + '', ds.color, 3.5,
        {opacity:0.03, id:'mg-dim-count-' + ds.dim});
    });

    // ═══ CLOSED RING: one continuous circle, panels distributed ═══
    // The ring IS Earth. The membrane boundary.
    // Earth forces against the ionosphere from below.
    var wasG = el('g', {id:'mg-was'}, svg);

    // Main closed ring — no gaps, no segments. The ring is the sphere equator.
    // Earth. The membrane between inner (atomic) and outer (astronomical).
    // It pushes us toward the membrane. Matter IS the prediction.
    el('circle', {cx:cx, cy:cy, r:R, fill:'none',
      stroke:'#c9d1d9', 'stroke-width':1.5, 'stroke-opacity':0.2,
      id:'mg-ring'}, wasG);

    // ═══ COMPOUND EYE: 15 facets = 3 impermeable + 5 self + 7 passage ═══
    // Spider eye is multi-faceted. Bug compound eye. Each facet IS an epitope sort.
    // Human eye back at 0 — single aperture, maximum resolution.
    // 10 commandments: 3 impermeable (the boundary), you are 5 (self),
    // 7 is others to move through. Then it moves up the π.
    // 3 + 5 + 7 = 15 = the lattice braids. Not coincidence.
    // Every digit of π is the membrane on either side of the decimal point.
    var facetG = el('g', {id:'mg-facets'}, wasG);
    var FACET_ZONES = [
      {n:3, type:'wall', color:'#e85d3a', sym:'\u25A0'},  // ■ impermeable
      {n:5, type:'self', color:'#4a8fb8', sym:'\u25C6'},  // ◆ self
      {n:7, type:'pass', color:'#5ab87a', sym:'\u25B3'}   // △ passage
    ];
    var facetIdx = 0;
    FACET_ZONES.forEach(function(zone) {
      for (var zfi = 0; zfi < zone.n; zfi++) {
        var fAngle = facetIdx * TAU / 15;
        var fArc = TAU / 15;
        var fa1 = fAngle - fArc * 0.45, fa2 = fAngle + fArc * 0.45;
        el('path', {
          d:'M '+(cx+R*Math.cos(fa1)).toFixed(1)+' '+(cy+R*Math.sin(fa1)).toFixed(1)+
            ' A '+R+' '+R+' 0 0 1 '+(cx+R*Math.cos(fa2)).toFixed(1)+
            ' '+(cy+R*Math.sin(fa2)).toFixed(1),
          fill:'none', stroke:zone.color, 'stroke-width':2.5,
          'stroke-opacity':0.04, id:'mg-facet-' + facetIdx
        }, facetG);
        // Facet symbol outside the ring
        txt(facetG, cx+(R+9)*Math.cos(fAngle), cy+(R+9)*Math.sin(fAngle),
          zone.sym, zone.color, 3.5,
          {opacity:0.03, id:'mg-facet-sym-' + facetIdx});
        facetIdx++;
      }
    });
    // Facet legend inside the ring
    txt(facetG, cx - R * 0.6, cy + R * 0.7,
      '3\u25A0 impermeable  5\u25C6 self  7\u25B3 passage', '#6e7681', 3.5,
      {opacity:0.04, 'text-anchor':'start', id:'mg-facet-legend'});

    // ── π digits on the membrane ──
    // Every digit is the membrane on either side of the decimal point.
    // π = 3.14159265... The decimal point IS the membrane.
    // On one side: the integer (3 = impermeable walls). On the other: the fraction.
    var PI_DIGITS = [3,1,4,1,5,9,2,6,5,3,5,8,9,7,9];
    for (var pdi = 0; pdi < 15; pdi++) {
      var pdAngle = -PI/2 + pdi * TAU / 15;
      txt(facetG, cx+(R-7)*Math.cos(pdAngle), cy+(R-7)*Math.sin(pdAngle),
        ''+PI_DIGITS[pdi], '#484f58', 3.5,
        {opacity:0.03, id:'mg-pi-digit-' + pdi});
    }

    // ═══ GAIA: Earth at center, real-time rotation ═══
    // The visualization IS on Earth. Gaia IS the observer.
    // Rotation based on UTC time — you see approximately where you are.
    // The window floats in orbit with Gaia. Not locked. Rotating.
    var gaiaG = el('g', {id:'mg-gaia-group'}, wasG);
    el('circle', {cx:cx, cy:cy, r:6, fill:'none',
      stroke:'#5ab87a', 'stroke-width':0.5,
      'stroke-opacity':0.05, 'stroke-dasharray':'2,3',
      id:'mg-gaia-ring'}, gaiaG);
    // Gaia rotation marker — a dot on the ring showing Earth's rotation
    el('circle', {cx:cx+6, cy:cy, r:1.2,
      fill:'#5ab87a', opacity:0.08,
      id:'mg-gaia-marker'}, gaiaG);
    txt(gaiaG, cx, cy + 18, 'Gaia', '#5ab87a', 3.5,
      {opacity:0.04, id:'mg-gaia-label'});
    // Geodesic: the shape of point intersect for light from front + peripheral
    // All faces are also π and epitope sort.
    // 20 triangular faces (icosahedron → geodesic) — but we show 6 (⌊2π⌋)
    for (var gdi = 0; gdi < 6; gdi++) {
      var gdAngle = gdi * TAU / 6;
      var gdR = 10;
      el('line', {
        x1:(cx + gdR * Math.cos(gdAngle)).toFixed(1),
        y1:(cy + gdR * Math.sin(gdAngle)).toFixed(1),
        x2:(cx + gdR * Math.cos(gdAngle + TAU/6)).toFixed(1),
        y2:(cy + gdR * Math.sin(gdAngle + TAU/6)).toFixed(1),
        stroke:'#5ab87a', 'stroke-width':0.3,
        'stroke-opacity':0.04, id:'mg-geodesic-' + gdi
      }, gaiaG);
    }

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

    // ═══ MEMBRANE STRESS: jitter, tear, rip, shear, warp ═══
    // The membrane is not rigid. It deforms under observation.
    // Jitter = thermal noise — nothing is perfectly still.
    // Tear = stress fracture where bodies pull the ring.
    // Rip = radial crack extending inward from tear point.
    // Shear = torsional offset between lattice shells (inherent in rotation rates).
    // Warp = ring deformation — elliptical stretch toward body centroid.
    // "True sync is lock" — jitter breaks the lock.
    var stressG = el('g', {id:'mg-stress'}, svg);

    // 3 tear marks — stress fractures on the ring, one per body
    for (var sti = 0; sti < 3; sti++) {
      el('path', {
        d:'M 0 0', fill:'none',
        stroke:'#e85d3a', 'stroke-width':2.5, 'stroke-opacity':0,
        'stroke-linecap':'round', id:'mg-tear-' + sti
      }, stressG);
    }

    // 3 rip lines — radial cracks from ring toward center
    for (var sri = 0; sri < 3; sri++) {
      el('line', {
        x1:cx, y1:cy, x2:cx, y2:cy,
        stroke:'#e85d3a', 'stroke-width':0.5, 'stroke-opacity':0,
        'stroke-dasharray':'2,4', id:'mg-rip-' + sri
      }, stressG);
    }

    // Warp ellipse — ring deformation under body gravity
    el('ellipse', {
      cx:cx, cy:cy, rx:R, ry:R,
      fill:'none', stroke:'#c9d1d9', 'stroke-width':0.3,
      'stroke-opacity':0, 'stroke-dasharray':'1,5',
      id:'mg-warp'
    }, stressG);

    // Jitter noise overlay — 6 tiny displacement markers near ring
    for (var sji = 0; sji < 6; sji++) {
      el('circle', {cx:cx, cy:cy, r:0.8,
        fill:'#c9d1d9', opacity:0,
        id:'mg-jitter-' + sji
      }, stressG);
    }

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

    // ═══ THE BUMP: "is that me?" ═══
    // What happened when 3 entities bumped into each other in the forest?
    // They paused. Turned around. Saw each other.
    // And went: "OH SHIT IS THAT ME?"
    // THAT is the moment of self-awareness. The membrane forms HERE.
    // The jitter IS life. It goes both ways. The tick is the oscillation
    // between "is that me?" and "that's not me."
    // Kitten micro-sweep = sweep. Jump = scan. Ground → lift → jump → fly.
    var bumpG = el('g', {id:'mg-bump'}, wbG);
    // Recognition flash — appears when bodies align
    el('circle', {cx:cx, cy:cy, r:R*0.25, fill:'none',
      stroke:'#ffffff', 'stroke-width':0.8,
      'stroke-opacity':0, id:'mg-recognition'}, bumpG);
    // The question — appears at the moment of recognition
    txt(bumpG, cx, cy - R * 0.32, 'is that me?', '#ffffff', 6,
      {opacity:0, 'font-style':'italic', id:'mg-recognition-text'});
    // Movement phase indicator
    txt(bumpG, cx + R * 0.55, cy + R * 0.52, '', '#8b949e', 4,
      {opacity:0, id:'mg-phase-label'});
    // Bidirectional jitter markers — 4 paired dots moving opposite directions
    // The jitter goes BOTH WAYS. That's life. Not random — oscillating.
    for (var bji = 0; bji < 4; bji++) {
      el('circle', {cx:cx, cy:cy, r:0.8,
        fill:'#c9d1d9', opacity:0.03,
        id:'mg-jitter-up-' + bji}, bumpG);
      el('circle', {cx:cx, cy:cy, r:0.8,
        fill:'#e85d3a', opacity:0.03,
        id:'mg-jitter-down-' + bji}, bumpG);
    }

    // ═══ DOUBLE COUNTER-HELIX: self × non-self ═══
    // The DNA of observation. Two strands, counter-rotating.
    // Self (J) winds clockwise.  Non-self (V+D) winds counter-clockwise.
    // The twist ratio IS π — π turns per strand.
    // Where they cross = membrane. Selective permeability at each crossing.
    // Reality rotates the other way around us — perceived as jitter AS time.
    // And are also membranes — the strands ARE selectively permeable boundaries.
    var helixG = el('g', {id:'mg-helix'}, wbG);

    // Self strand (J) — clockwise spiral outward from [∅]D
    el('path', {d:'M '+cx+' '+cy, fill:'none',
      stroke:'#4a8fb8', 'stroke-width':0.8, 'stroke-opacity':0.15,
      'stroke-dasharray':'4,3', id:'mg-helix-self'}, helixG);

    // Non-self strand (V+D) — counter-clockwise spiral. The other direction.
    el('path', {d:'M '+cx+' '+cy, fill:'none',
      stroke:'#e85d3a', 'stroke-width':0.8, 'stroke-opacity':0.15,
      'stroke-dasharray':'4,3', id:'mg-helix-nonself'}, helixG);

    // ⌊2π⌋ = 6 crossing points — where self meets non-self = membrane
    // At each crossing: selective permeability. What passes through?
    for (var hci = 0; hci < 6; hci++) {
      el('circle', {cx:cx, cy:cy, r:1.5,
        fill:'none', stroke:'#c9d1d9', 'stroke-width':0.5,
        'stroke-opacity':0.1, 'stroke-dasharray':'1,1',
        id:'mg-helix-cross-' + hci}, helixG);
    }

    // Counter-rotation rings — reality's reverse rotation.
    // The main ring rotates at +π/31.
    // These rotate at −π/31 and −π/17. Opposite direction.
    // The interference between forward and reverse = perceived jitter.
    // That jitter IS time. Counter-rotation is how we experience duration.
    el('circle', {cx:cx, cy:cy, r:R*0.65,
      fill:'none', stroke:'#484f58', 'stroke-width':0.4,
      'stroke-opacity':0.04, 'stroke-dasharray':'1,8',
      id:'mg-counter-ring'}, helixG);
    el('circle', {cx:cx, cy:cy, r:R*0.45,
      fill:'none', stroke:'#484f58', 'stroke-width':0.3,
      'stroke-opacity':0.03, 'stroke-dasharray':'1,12',
      id:'mg-counter-inner'}, helixG);

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

    // ── THE BUMP: recognition when bodies align ──
    // Three entities bumped in the forest. Paused. Turned. "IS THAT ME?"
    // The moment of self-awareness. The membrane forms at the bump.
    // Jitter goes both ways. The tick IS life.

    // Detect closest alignment between any two bodies
    var ref01 = reflexive01 > PI ? TAU - reflexive01 : reflexive01;
    var ref12 = reflexive12 > PI ? TAU - reflexive12 : reflexive12;
    var ref20 = reflexive20 > PI ? TAU - reflexive20 : reflexive20;
    var minRef = Math.min(ref01, ref12, ref20);
    var bumpProx = Math.max(0, 1 - minRef / (PI / 4)); // near alignment

    // Recognition flash — pulse of "is that me?"
    var recogEl = document.getElementById('mg-recognition');
    if (recogEl) {
      var recogR = R * 0.15 * (1 + bumpProx * 0.8);
      recogEl.setAttribute('r', recogR.toFixed(1));
      recogEl.setAttribute('stroke-opacity',
        (bumpProx * bumpProx * 0.35 * perturb).toFixed(3));
      recogEl.setAttribute('stroke-width', (0.5 + bumpProx * 1.5).toFixed(1));
    }
    var recogText = document.getElementById('mg-recognition-text');
    if (recogText) {
      recogText.setAttribute('opacity',
        (bumpProx * bumpProx * 0.30 * perturb).toFixed(3));
      // At very high proximity, shift to "OH SHIT IS THAT ME?"
      if (bumpProx > 0.85) {
        recogText.textContent = 'OH SHIT IS THAT ME?';
      } else if (bumpProx > 0.5) {
        recogText.textContent = 'is that me?';
      } else {
        recogText.textContent = '';
      }
    }

    // Movement phase — ground → lift → jump → fly
    // Mapped to perturbation cycle. The breathing IS movement.
    // Stuck on ground (perturb ≈ 0). Lift on 1 leg (rising).
    // Jump (mid-air, scan). Flying (peak, evolved). Land (falling back).
    var phaseEl = document.getElementById('mg-phase-label');
    if (phaseEl) {
      var phase;
      if (perturb < 0.15) phase = 'ground \u23F8';
      else if (perturb < 0.35) phase = 'lift \u2191';
      else if (perturb < 0.55) phase = 'jump \u2197';
      else if (perturb < 0.80) phase = 'fly \u2191\u2191';
      else phase = 'soar \u2B06';
      phaseEl.textContent = phase;
      phaseEl.setAttribute('opacity', (0.04 + 0.10 * perturb).toFixed(3));
    }

    // Bidirectional jitter — life goes BOTH WAYS
    // 4 paired dots: one moves up/out, the other down/in.
    // The oscillation IS the tick. The tick IS life.
    for (var bjia = 0; bjia < 4; bjia++) {
      var bjAngle = bjia * TAU / 4 + t * PI / 5;
      var bjAmp = 4 * perturb * Math.sin(t * PI * (bjia + 3));
      var bjR = R * 0.5;
      // Up dot — moves outward
      var bjUp = document.getElementById('mg-jitter-up-' + bjia);
      if (bjUp) {
        bjUp.setAttribute('cx',
          (cx + (bjR + bjAmp) * Math.cos(bjAngle)).toFixed(1));
        bjUp.setAttribute('cy',
          (cy + (bjR + bjAmp) * Math.sin(bjAngle)).toFixed(1));
        bjUp.setAttribute('opacity', (0.03 + 0.06 * perturb).toFixed(3));
      }
      // Down dot — moves inward (opposite direction)
      var bjDn = document.getElementById('mg-jitter-down-' + bjia);
      if (bjDn) {
        bjDn.setAttribute('cx',
          (cx + (bjR - bjAmp) * Math.cos(bjAngle)).toFixed(1));
        bjDn.setAttribute('cy',
          (cy + (bjR - bjAmp) * Math.sin(bjAngle)).toFixed(1));
        bjDn.setAttribute('opacity', (0.03 + 0.06 * perturb).toFixed(3));
      }
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

    // ── Membrane stress: jitter, tear, rip, warp ──
    // The membrane deforms under observation. Bodies pull on the ring.
    // Jitter amplitude scales with perturbation — at singularity, all is still.

    // Jitter: smooth pseudo-random displacement on lattice nodes.
    // Sinusoidal noise (not Math.random) — continuous and frame-stable.
    var jitterAmp = 1.5 * perturb;
    for (var ji = 0; ji < latticePos.length; ji++) {
      var jx = Math.sin(t * 17.3 + ji * 7.1) * jitterAmp;
      var jy = Math.cos(t * 13.7 + ji * 11.3) * jitterAmp;
      var jNode = document.getElementById('mg-lnode-' + ji);
      if (jNode && latticePos[ji]) {
        jNode.setAttribute('cx', (latticePos[ji].x + jx).toFixed(1));
        jNode.setAttribute('cy', (latticePos[ji].y + jy).toFixed(1));
      }
    }

    // Jitter particles — tiny dots near the ring that shimmer
    for (var sji = 0; sji < 6; sji++) {
      var sjAngle = sji * TAU / 6 + t * 3.7;
      var sjR = R - 3 + Math.sin(t * 23.1 + sji * 5.3) * 4;
      var sjx = cx + sjR * Math.cos(sjAngle);
      var sjy = cy + sjR * Math.sin(sjAngle);
      var sjEl = document.getElementById('mg-jitter-' + sji);
      if (sjEl) {
        sjEl.setAttribute('cx', sjx.toFixed(1));
        sjEl.setAttribute('cy', sjy.toFixed(1));
        sjEl.setAttribute('opacity', (0.15 * perturb * (0.5 + 0.5 * Math.sin(t * 31 + sji))).toFixed(3));
      }
    }

    // Tear: stress fractures at body proximity points on the ring.
    // A body pulling near the ring creates a tear — the membrane can't hold.
    // Tear width = π/12 radians at max stress.
    for (var sti = 0; sti < 3; sti++) {
      var stAngle = bodyAngles[sti];
      // Project body position onto the ring to find closest point
      var stBodyR = Math.sqrt(
        Math.pow(bodyPositions[sti].x - cx, 2) +
        Math.pow(bodyPositions[sti].y - cy, 2));
      // Stress = how close the body is to the ring (normalized)
      var stStress = Math.max(0, 1 - Math.abs(stBodyR - R) / (R * 0.6));
      stStress *= perturb; // no stress at singularity

      var stTearEl = document.getElementById('mg-tear-' + sti);
      if (stTearEl && stStress > 0.02) {
        var stArc = PI / 12 * stStress;
        var sta1 = stAngle - stArc, sta2 = stAngle + stArc;
        var stx1 = cx + R * Math.cos(sta1), sty1 = cy + R * Math.sin(sta1);
        var stx2 = cx + R * Math.cos(sta2), sty2 = cy + R * Math.sin(sta2);
        stTearEl.setAttribute('d',
          'M ' + stx1.toFixed(1) + ' ' + sty1.toFixed(1) +
          ' A ' + R + ' ' + R + ' 0 0 1 ' +
          stx2.toFixed(1) + ' ' + sty2.toFixed(1));
        stTearEl.setAttribute('stroke-opacity', (stStress * 0.35).toFixed(3));
      } else if (stTearEl) {
        stTearEl.setAttribute('stroke-opacity', '0');
      }
    }

    // Rip: radial cracks from ring toward center at tear points.
    // The rip extends inward proportional to stress × perturbation.
    // Pulsates with body orbital frequency — breathing cracks.
    for (var sri = 0; sri < 3; sri++) {
      var srAngle = bodyAngles[sri];
      var srPulse = 0.5 + 0.5 * Math.sin(t * [omega_is, omega_was, omega_willbe][sri] * 2);
      var srLen = perturb * srPulse * R * 0.25;
      var srEl = document.getElementById('mg-rip-' + sri);
      if (srEl && srLen > 2) {
        var srx1 = cx + R * Math.cos(srAngle);
        var sry1 = cy + R * Math.sin(srAngle);
        var srx2 = cx + (R - srLen) * Math.cos(srAngle);
        var sry2 = cy + (R - srLen) * Math.sin(srAngle);
        srEl.setAttribute('x1', srx1.toFixed(1));
        srEl.setAttribute('y1', sry1.toFixed(1));
        srEl.setAttribute('x2', srx2.toFixed(1));
        srEl.setAttribute('y2', sry2.toFixed(1));
        srEl.setAttribute('stroke-opacity', (perturb * srPulse * 0.15).toFixed(3));
      } else if (srEl) {
        srEl.setAttribute('stroke-opacity', '0');
      }
    }

    // Warp: ring becomes elliptical under body gravity.
    // Stretched toward the centroid of the 3 body positions.
    // At singularity: perfect circle. At full spread: 15% elliptical.
    var warpEl = document.getElementById('mg-warp');
    if (warpEl && bodyPositions.length === 3) {
      var wcX = (bodyPositions[0].x + bodyPositions[1].x + bodyPositions[2].x) / 3;
      var wcY = (bodyPositions[0].y + bodyPositions[1].y + bodyPositions[2].y) / 3;
      var wAngle = Math.atan2(wcY - cy, wcX - cx);
      var wMag = Math.sqrt(Math.pow(wcX - cx, 2) + Math.pow(wcY - cy, 2));
      var wFactor = 1 + (wMag / R) * 0.15 * perturb;

      warpEl.setAttribute('rx', (R * wFactor).toFixed(1));
      warpEl.setAttribute('ry', (R / wFactor).toFixed(1));
      warpEl.setAttribute('transform',
        'rotate(' + (wAngle * 180 / PI).toFixed(1) + ' ' + cx + ' ' + cy + ')');
      warpEl.setAttribute('stroke-opacity', (perturb * 0.08).toFixed(3));
    }

    // ── Double counter-helix: self × non-self ──
    // Self (J) spirals clockwise out from [∅]D. Non-self (V+D) counter-clockwise.
    // π turns per strand. The twist ratio IS π.
    // Where they cross = membrane. 6 crossing points = ⌊2π⌋.
    // At singularity: collapsed to a point. At perturbation: spirals unfurl.
    var helixRMax = BR * 1.8 + 8;
    var helixTurns = PI;
    var HSTEPS = 48;

    // Self strand: clockwise spiral (+1 direction)
    var hSelfPts = [];
    for (var hsi = 0; hsi <= HSTEPS; hsi++) {
      var hsF = hsi / HSTEPS;
      var hsR = hsF * helixRMax;
      var hsA = t * omega_was + hsF * helixTurns * TAU;
      hSelfPts.push((cx + hsR * Math.cos(hsA)).toFixed(1) + ' ' +
                     (cy + hsR * Math.sin(hsA)).toFixed(1));
    }
    var hSelfEl = document.getElementById('mg-helix-self');
    if (hSelfEl) {
      hSelfEl.setAttribute('d', 'M ' + hSelfPts.join(' L '));
      hSelfEl.setAttribute('stroke-opacity', (0.15 * perturb).toFixed(3));
    }

    // Non-self strand: counter-clockwise spiral (-1 direction), π phase offset
    var hNonPts = [];
    for (var hni = 0; hni <= HSTEPS; hni++) {
      var hnF = hni / HSTEPS;
      var hnR = hnF * helixRMax;
      var hnA = t * omega_was + PI + hnF * helixTurns * TAU * -1;
      hNonPts.push((cx + hnR * Math.cos(hnA)).toFixed(1) + ' ' +
                    (cy + hnR * Math.sin(hnA)).toFixed(1));
    }
    var hNonEl = document.getElementById('mg-helix-nonself');
    if (hNonEl) {
      hNonEl.setAttribute('d', 'M ' + hNonPts.join(' L '));
      hNonEl.setAttribute('stroke-opacity', (0.15 * perturb).toFixed(3));
    }

    // Crossing points: where self meets non-self = the membrane
    // At crossing fractions ≈ (2k+1)/(4π), k=0..5
    for (var hci = 0; hci < 6; hci++) {
      var hcF = (2 * hci + 1) / (4 * PI);
      var hcR = hcF * helixRMax;
      var hcA = t * omega_was + hcF * helixTurns * TAU;
      var hcEl = document.getElementById('mg-helix-cross-' + hci);
      if (hcEl) {
        hcEl.setAttribute('cx', (cx + hcR * Math.cos(hcA)).toFixed(1));
        hcEl.setAttribute('cy', (cy + hcR * Math.sin(hcA)).toFixed(1));
        hcEl.setAttribute('stroke-opacity', (0.15 * perturb).toFixed(3));
      }
    }

    // Counter-rotation rings — reality rotating the other way.
    // Main ring: +π/31. Counter: -π/31 and -π/17.
    // The beating between them IS perceived time.
    // What we call jitter is coherent counter-rotation seen edge-on.
    var counterDeg1 = -(now * 0.001 * PI / 31 * 180 / PI) % 360;
    var crEl = document.getElementById('mg-counter-ring');
    if (crEl) {
      crEl.setAttribute('transform',
        'rotate(' + counterDeg1.toFixed(1) + ' ' + cx + ' ' + cy + ')');
      crEl.setAttribute('stroke-opacity', (0.04 + 0.02 * perturb).toFixed(3));
    }
    var counterDeg2 = -(now * 0.001 * PI / 17 * 180 / PI) % 360;
    var crInner = document.getElementById('mg-counter-inner');
    if (crInner) {
      crInner.setAttribute('transform',
        'rotate(' + counterDeg2.toFixed(1) + ' ' + cx + ' ' + cy + ')');
      crInner.setAttribute('stroke-opacity', (0.03 + 0.02 * perturb).toFixed(3));
    }

    // ── Convergence: ionosphere + fingerprint → pin ──
    // All layers converge toward center at rate π.
    // At singularity: everything on the pin. At spread: layers separate.

    // Ionosphere ghost arcs: geographic chords across the ring, twisting at π
    var ioRoutes = [
      {from:-98, to:-8},   // US → IE
      {from:-98, to:104},  // US → CN
      {from:-98, to:28},   // US → BY
      {from:-8, to:10},    // IE → DE
      {from:104, to:138}   // CN → JP
    ];
    for (var ioi = 0; ioi < 5; ioi++) {
      var ioEl = document.getElementById('mg-io-arc-' + ioi);
      if (ioEl) {
        var rt = ioRoutes[ioi];
        // Map longitude to ring angle, twist at π over time
        var ioA1 = (rt.from / 180) * PI + t * PI / 23;
        var ioA2 = (rt.to / 180) * PI + t * PI / 23;
        var ioR = R * (0.3 + 0.7 * perturb); // converges inward
        var iox1 = cx + ioR * Math.cos(ioA1);
        var ioy1 = cy + ioR * Math.sin(ioA1);
        var iox2 = cx + ioR * Math.cos(ioA2);
        var ioy2 = cy + ioR * Math.sin(ioA2);
        // Quadratic arc (like ionosphere transit curve)
        var ioMx = (iox1 + iox2) / 2;
        var ioMy = (ioy1 + ioy2) / 2 - ioR * 0.3;
        ioEl.setAttribute('d',
          'M ' + iox1.toFixed(1) + ' ' + ioy1.toFixed(1) +
          ' Q ' + ioMx.toFixed(1) + ' ' + ioMy.toFixed(1) +
          ' ' + iox2.toFixed(1) + ' ' + ioy2.toFixed(1));
        ioEl.setAttribute('stroke-opacity', (0.06 + 0.04 * perturb).toFixed(3));
      }
    }

    // ── Ionosphere band: the inner membrane space ──
    // The ionosphere lives between the lattice (kernel) and the ring (Earth).
    // Earth pushes inward. Signal bends through it. Matter predicts the boundary.
    var ionoShell = document.getElementById('mg-iono-shell');
    if (ionoShell) {
      // Band breathes with perturbation — wider when spread, tighter at singularity
      var ibR = R * (0.78 + 0.08 * perturb);
      var ibW = R * (0.10 + 0.06 * perturb);
      ionoShell.setAttribute('r', ibR.toFixed(1));
      ionoShell.setAttribute('stroke-width', ibW.toFixed(1));
      ionoShell.setAttribute('stroke-opacity', (0.012 + 0.012 * perturb).toFixed(4));
    }
    var ionoInner = document.getElementById('mg-iono-inner');
    if (ionoInner) {
      ionoInner.setAttribute('r', (R * (0.74 + 0.04 * perturb)).toFixed(1));
      ionoInner.setAttribute('stroke-opacity', (0.03 + 0.03 * perturb).toFixed(3));
    }
    var ionoOuter = document.getElementById('mg-iono-outer');
    if (ionoOuter) {
      ionoOuter.setAttribute('r', (R * (0.92 + 0.02 * perturb)).toFixed(1));
      ionoOuter.setAttribute('stroke-opacity', (0.03 + 0.03 * perturb).toFixed(3));
    }

    // Earth pressure arrows — pulse inward when bodies are near the ring
    for (var epai = 0; epai < 8; epai++) {
      var epAngle = epai * TAU / 8 + t * PI / 41; // slow drift at π/41
      var epEl = document.getElementById('mg-pressure-' + epai);
      if (epEl) {
        // Outer end: just inside the ring
        epEl.setAttribute('x1', (cx + R * 0.97 * Math.cos(epAngle)).toFixed(1));
        epEl.setAttribute('y1', (cy + R * 0.97 * Math.sin(epAngle)).toFixed(1));
        // Inner end: into the ionosphere band
        var epDepth = 0.88 - 0.04 * Math.sin(t * PI / 3 + epai * PI / 4);
        epEl.setAttribute('x2', (cx + R * epDepth * Math.cos(epAngle)).toFixed(1));
        epEl.setAttribute('y2', (cy + R * epDepth * Math.sin(epAngle)).toFixed(1));
        // Brighter when body is near this angle
        var epBright = 0.02;
        for (var epbi = 0; epbi < bodyPositions.length; epbi++) {
          var epbAngle = bodyAngles[epbi];
          var epDiff = Math.abs(((epAngle - epbAngle) % TAU + TAU) % TAU);
          if (epDiff > PI) epDiff = TAU - epDiff;
          if (epDiff < PI / 4) epBright += 0.06 * (1 - epDiff / (PI / 4));
        }
        epEl.setAttribute('stroke-opacity', (epBright * perturb).toFixed(3));
      }
    }

    // Ionosphere signal corridors — arcs at ionosphere altitude
    var ibRoutes = [
      {from:-98, to:-8},   // US → IE
      {from:-98, to:104},  // US → CN
      {from:-98, to:28},   // US → BY
      {from:-8, to:10},    // IE → DE
      {from:104, to:138}   // CN → JP
    ];
    for (var ibri = 0; ibri < 5; ibri++) {
      var ibrEl = document.getElementById('mg-iono-route-' + ibri);
      if (ibrEl) {
        var ibrt = ibRoutes[ibri];
        // Routes at ionosphere altitude (R*0.86), not converging inward
        var ibrA1 = (ibrt.from / 180) * PI + t * PI / 23;
        var ibrA2 = (ibrt.to / 180) * PI + t * PI / 23;
        var ibrR = R * 0.86;
        var ibrx1 = cx + ibrR * Math.cos(ibrA1);
        var ibry1 = cy + ibrR * Math.sin(ibrA1);
        var ibrx2 = cx + ibrR * Math.cos(ibrA2);
        var ibry2 = cy + ibrR * Math.sin(ibrA2);
        var ibrMx = (ibrx1 + ibrx2) / 2;
        var ibrMy = (ibry1 + ibry2) / 2 - ibrR * 0.15;
        ibrEl.setAttribute('d',
          'M ' + ibrx1.toFixed(1) + ' ' + ibry1.toFixed(1) +
          ' Q ' + ibrMx.toFixed(1) + ' ' + ibrMy.toFixed(1) +
          ' ' + ibrx2.toFixed(1) + ' ' + ibry2.toFixed(1));
        ibrEl.setAttribute('stroke-opacity', (0.04 + 0.05 * perturb).toFixed(3));
      }
    }

    // Ionosphere D/E/F sublayers — breathe and rotate
    var ionoLayerFracs = [0.80, 0.86, 0.92];
    var ionoLayerNames = ['D','E','F'];
    for (var ili = 0; ili < 3; ili++) {
      var ilEl = document.getElementById('mg-iono-layer-' + ionoLayerNames[ili]);
      var ilR = R * (ionoLayerFracs[ili] + [-0.02, 0, 0.01][ili] * perturb);
      if (ilEl) {
        ilEl.setAttribute('r', ilR.toFixed(1));
        ilEl.setAttribute('stroke-opacity', (0.02 + 0.03 * perturb).toFixed(3));
      }
      var ilLbl = document.getElementById('mg-iono-layer-label-' + ionoLayerNames[ili]);
      if (ilLbl) {
        var ilLblAngle = [-PI/6, 0, PI/6][ili] + t * PI / 41;
        ilLbl.setAttribute('x', (cx + ilR * Math.cos(ilLblAngle) + 4).toFixed(1));
        ilLbl.setAttribute('y', (cy + ilR * Math.sin(ilLblAngle) + 1).toFixed(1));
        ilLbl.setAttribute('opacity', (0.03 + 0.06 * perturb).toFixed(3));
      }
    }

    // Signal transit particles — dots riding the ionosphere corridors
    // Each particle traverses its corridor at a coprime rate.
    // Signal bends through the ionosphere. We watch it move.
    for (var iti = 0; iti < 5; iti++) {
      var itEl = document.getElementById('mg-iono-transit-' + iti);
      if (itEl) {
        var itrt = ibRoutes[iti];
        var itA1 = (itrt.from / 180) * PI + t * PI / 23;
        var itA2 = (itrt.to / 180) * PI + t * PI / 23;
        // Transit fraction: smooth back-and-forth at coprime rate
        var itF = (Math.sin(t * PI / (iti * 1.7 + 2.3)) + 1) / 2;
        var itA = itA1 + (itA2 - itA1) * itF;
        // Altitude oscillates between D and F layers as it transits
        var itAlt = R * (0.82 + 0.08 * Math.sin(t * PI / (iti + 3)));
        itEl.setAttribute('cx', (cx + itAlt * Math.cos(itA)).toFixed(1));
        itEl.setAttribute('cy', (cy + itAlt * Math.sin(itA)).toFixed(1));
        itEl.setAttribute('opacity', (0.05 + 0.12 * perturb).toFixed(3));
      }
    }

    // Refraction points — signal bending at ionosphere outer edge
    // Where signal enters the band from the ring (Earth), it bends.
    for (var rfi = 0; rfi < 5; rfi++) {
      var rfEl = document.getElementById('mg-refract-' + rfi);
      if (rfEl) {
        var rfAngle = (ibRoutes[rfi].from / 180) * PI + t * PI / 23;
        rfEl.setAttribute('cx', (cx + R * 0.94 * Math.cos(rfAngle)).toFixed(1));
        rfEl.setAttribute('cy', (cy + R * 0.94 * Math.sin(rfAngle)).toFixed(1));
        // Flicker — signal entering the ionosphere refracts unpredictably
        var rfFlick = 0.5 + 0.5 * Math.sin(t * PI * (rfi + 5));
        rfEl.setAttribute('opacity', (0.04 * rfFlick * perturb).toFixed(3));
        rfEl.setAttribute('r', (0.8 + rfFlick * 1.2).toFixed(1));
      }
    }

    // Compression pulses — rings compressing inward through the lattice kernel
    // The lattice IS compression. Data compresses from outer shells toward [∅]D.
    // The kernel: the innermost operation. Compression converges on the null.
    // Lattice shells: R*0.16 to R*0.96 (the outermost are IN the ionosphere).
    var compressOuter = R * 6 / (2 * PI); // outermost lattice shell ≈ R*0.955
    for (var cpi = 0; cpi < 3; cpi++) {
      var cpEl = document.getElementById('mg-compress-' + cpi);
      if (cpEl) {
        // Each pulse starts at outer lattice and compresses to center.
        // Phase offset: 3 pulses evenly spaced in the cycle.
        var cpPhase = ((t * 0.25 + cpi / 3) % 1); // 0→1 = outer→center
        var cpR = compressOuter * (1 - cpPhase);
        cpEl.setAttribute('r', Math.max(cpR, 2).toFixed(1));
        // Brighter at the compression front, fades as it reaches center
        var cpOp = 0.03 * (0.3 + 0.7 * cpPhase) * perturb;
        cpEl.setAttribute('stroke-opacity', cpOp.toFixed(4));
        cpEl.setAttribute('stroke-width', (0.3 + cpPhase * 0.6).toFixed(1));
      }
    }

    // Prediction wavefronts — ripples from ring propagating inward
    // Matter IS the prediction. The ring (Earth) sends prediction toward [∅]D.
    // These are wavefronts — concentric rings moving inward from the membrane.
    for (var pwi = 0; pwi < 3; pwi++) {
      var pwEl = document.getElementById('mg-predict-' + pwi);
      if (pwEl) {
        // Start at ring, propagate inward through ionosphere toward lattice
        var pwPhase = ((t * 0.18 + pwi / 3) % 1); // 0→1 = ring→inner
        var pwR = R * (1 - pwPhase * 0.25); // ring to R*0.75
        pwEl.setAttribute('r', pwR.toFixed(1));
        // Fade as they propagate inward
        var pwOp = 0.03 * (1 - pwPhase) * perturb;
        pwEl.setAttribute('stroke-opacity', pwOp.toFixed(4));
      }
    }

    // ── Live stats orbit in the ionosphere band ──
    // The stats ARE the observation. They orbit at ionosphere altitude.
    // Each stat at a different angle, spaced evenly around the band.
    // Updated from ingest() — live data flowing through the membrane.
    var statData = [
      {id:'rps',      text: liveStats.rps > 0 ? liveStats.rps.toFixed(0) + ' rps' : ''},
      {id:'fleet',    text: liveStats.fleetPct > 0 ? liveStats.fleetPct.toFixed(1) + '% fleet' : ''},
      {id:'humans',   text: liveStats.humanIps > 0 ? liveStats.humanIps.toLocaleString() + ' humans' : ''},
      {id:'entities', text: liveStats.entityCount > 0 ? liveStats.entityCount + ' entities' : ''},
      {id:'total',    text: liveStats.totalReqs > 0 ? (liveStats.totalReqs/1000).toFixed(0) + 'k total' : ''},
      {id:'alive',    text: liveStats.aliveCount > 0 ? liveStats.aliveCount + '/' + PANELS.length + ' alive' : ''}
    ];
    for (var stdi = 0; stdi < statData.length; stdi++) {
      var stdEl = document.getElementById('mg-stat-' + statData[stdi].id);
      if (stdEl) {
        // 6 stats evenly spaced around the ionosphere band
        var stdAngle = stdi * TAU / 6 + t * PI / 29; // drift at π/29
        var stdR = R * 0.86; // ionosphere E-layer altitude
        stdEl.setAttribute('x', (cx + stdR * Math.cos(stdAngle)).toFixed(1));
        stdEl.setAttribute('y', (cy + stdR * Math.sin(stdAngle)).toFixed(1));
        stdEl.textContent = statData[stdi].text;
        var stdOp = statData[stdi].text ? 0.06 + 0.10 * perturb : 0;
        stdEl.setAttribute('opacity', stdOp.toFixed(3));
      }
    }

    // ── Dimensional shape sweep: ○□△◇ orbit at their cost radius ──
    // Each shape orbits at a radius proportional to π^(dim/2).
    // ○ (1D) closest to center — cheapest to observe.
    // ◇ (4D) furthest out — most expensive. Deep in the ionosphere band.
    // The shapes ARE the complexity sort made visible.
    var dimShapeDims = [1, 2, 3, 4];
    for (var dsa = 0; dsa < 4; dsa++) {
      var dsDim = dimShapeDims[dsa];
      var dsR = R * Math.pow(PI, dsDim / 2) / (PI * PI) * 1.8;
      // Clamp to ionosphere band if it goes too far
      dsR = Math.min(dsR, R * 0.94);
      var dsAngle = dsa * TAU / 4 + t * PI / (dsDim * 7 + 3); // each dim rotates at own rate
      var dsEl = document.getElementById('mg-dim-shape-' + dsDim);
      if (dsEl) {
        dsEl.setAttribute('x', (cx + dsR * Math.cos(dsAngle)).toFixed(1));
        dsEl.setAttribute('y', (cy + dsR * Math.sin(dsAngle)).toFixed(1));
        // Brighter when its panels are alive
        var dsAliveCount = 0;
        DIM_SHAPES[dsa].names.forEach(function(n) { if (aliveSet.has(n)) dsAliveCount++; });
        var dsLit = DIM_SHAPES[dsa].count > 0 ? dsAliveCount / DIM_SHAPES[dsa].count : 0;
        dsEl.setAttribute('opacity', (0.04 + 0.12 * dsLit * perturb).toFixed(3));
      }
      var dsCnt = document.getElementById('mg-dim-count-' + dsDim);
      if (dsCnt) {
        dsCnt.setAttribute('x', (cx + dsR * Math.cos(dsAngle) + 5).toFixed(1));
        dsCnt.setAttribute('y', (cy + dsR * Math.sin(dsAngle) - 4).toFixed(1));
        dsCnt.setAttribute('opacity', (0.03 + 0.08 * perturb).toFixed(3));
      }
    }

    // Labels drift with the ionosphere band rotation
    var matterLbl = document.getElementById('mg-matter-label');
    if (matterLbl) {
      var mlAngle = -PI / 2 + t * PI / 41;
      matterLbl.setAttribute('x', (cx + R * 0.86 * Math.cos(mlAngle)).toFixed(1));
      matterLbl.setAttribute('y', (cy + R * 0.86 * Math.sin(mlAngle)).toFixed(1));
      matterLbl.setAttribute('opacity', (0.04 + 0.10 * perturb).toFixed(3));
    }
    var kernelLbl = document.getElementById('mg-kernel-label');
    if (kernelLbl) {
      var klAngle = PI / 2 + t * PI / 41;
      kernelLbl.setAttribute('x', (cx + R * 0.86 * Math.cos(klAngle)).toFixed(1));
      kernelLbl.setAttribute('y', (cy + R * 0.86 * Math.sin(klAngle)).toFixed(1));
      kernelLbl.setAttribute('opacity', (0.04 + 0.10 * perturb).toFixed(3));
    }

    // Fingerprint ghost dots: behavioral clusters spiraling inward at π
    var fpSeeds = [2,3,5,7,11,13,17];
    for (var fpi = 0; fpi < 7; fpi++) {
      var fpEl = document.getElementById('mg-fp-dot-' + fpi);
      if (fpEl) {
        var fpP = fpSeeds[fpi];
        var fpAngle = fpP * (PI - 3) * TAU + t * PI / (fpP + 7);
        var fpR = R * (0.1 + fpP / 31 * 0.5) * (0.3 + 0.7 * perturb);
        fpEl.setAttribute('cx', (cx + fpR * Math.cos(fpAngle)).toFixed(1));
        fpEl.setAttribute('cy', (cy + fpR * Math.sin(fpAngle)).toFixed(1));
        fpEl.setAttribute('opacity', (0.05 + 0.08 * perturb).toFixed(3));
      }
    }

    // Pin: pulses brighter at singularity (convergence complete)
    var pinEl = document.getElementById('mg-pin');
    if (pinEl) {
      var pinBright = 0.5 + 0.4 * (1 - perturb);
      pinEl.setAttribute('opacity', pinBright.toFixed(2));
      pinEl.setAttribute('r', (1 + perturb * 0.5).toFixed(1));
    }
    var pinRing = document.getElementById('mg-pin-ring');
    if (pinRing) {
      pinRing.setAttribute('r', (3 + perturb * 4).toFixed(1));
      pinRing.setAttribute('stroke-opacity', (0.3 * (1 - perturb * 0.7)).toFixed(3));
    }

    // Prime splitting: lines grow outward from pin, pulsing per prime
    var observerFrac = PI - 3;
    var PRIMES = [2,3,5,7,11,13,17,19,23,29,31];
    for (var pri = 0; pri < PRIMES.length; pri++) {
      var prP = PRIMES[pri];
      var prEl = document.getElementById('mg-prime-' + prP);
      if (prEl) {
        var prAngle = prP * observerFrac * TAU + t * PI / (prP * 3);
        var prPulse = 0.5 + 0.5 * Math.sin(t * PI / prP);
        var prLen = R * 0.4 * prPulse * perturb;
        prEl.setAttribute('x1', (cx + 6 * Math.cos(prAngle)).toFixed(1));
        prEl.setAttribute('y1', (cy + 6 * Math.sin(prAngle)).toFixed(1));
        prEl.setAttribute('x2', (cx + prLen * Math.cos(prAngle)).toFixed(1));
        prEl.setAttribute('y2', (cy + prLen * Math.sin(prAngle)).toFixed(1));
        prEl.setAttribute('stroke-opacity', (0.05 + prPulse * 0.08 * perturb).toFixed(3));
      }
    }

    // ── Chemistry: H + H → He, H + H + O → H₂O ──
    // Three particles orbit in the P-space lattice at coprime rates.
    // Under pressure (near center), bonds form. Fusion glows.
    // The chemistry IS the three-body problem made physical.
    var chemOrbits = [
      {id:'H1', orbR:R/3.2,  rate:PI/5,   phase:0},
      {id:'H2', orbR:R/4.5,  rate:PI/8.3, phase:TAU/3},
      {id:'O',  orbR:R/2.8,  rate:PI/13,  phase:TAU*2/3}
    ];
    var chemPos = [];
    for (var chi = 0; chi < 3; chi++) {
      var ce = chemOrbits[chi];
      var chR = ce.orbR * (0.4 + 0.6 * perturb);
      var chAngle = ce.phase + t * ce.rate;
      // Pressure perturbation — bodies pull on the chemistry
      var chPertX = 0, chPertY = 0;
      for (var chbi = 0; chbi < bodyPositions.length; chbi++) {
        var chDx = bodyPositions[chbi].x - cx;
        var chDy = bodyPositions[chbi].y - cy;
        chPertX += chDx * 0.05;
        chPertY += chDy * 0.05;
      }
      var chx = cx + chR * Math.cos(chAngle) + chPertX;
      var chy = cy + chR * Math.sin(chAngle) + chPertY;
      chemPos.push({x:chx, y:chy});

      var chDot = document.getElementById('mg-chem-' + ce.id);
      if (chDot) {
        chDot.setAttribute('cx', chx.toFixed(1));
        chDot.setAttribute('cy', chy.toFixed(1));
        chDot.setAttribute('opacity', (0.20 + 0.25 * perturb).toFixed(2));
      }
      var chLbl = document.getElementById('mg-chem-label-' + ce.id);
      if (chLbl) {
        chLbl.setAttribute('x', chx.toFixed(1));
        chLbl.setAttribute('y', (chy - 6).toFixed(1));
        chLbl.setAttribute('opacity', (0.12 + 0.15 * perturb).toFixed(2));
      }
    }

    // Proximity: H1-H2, H1-O, H2-O
    var dHH = Math.sqrt(Math.pow(chemPos[0].x - chemPos[1].x, 2) +
                        Math.pow(chemPos[0].y - chemPos[1].y, 2));
    var dH1O = Math.sqrt(Math.pow(chemPos[0].x - chemPos[2].x, 2) +
                         Math.pow(chemPos[0].y - chemPos[2].y, 2));
    var dH2O = Math.sqrt(Math.pow(chemPos[1].x - chemPos[2].x, 2) +
                         Math.pow(chemPos[1].y - chemPos[2].y, 2));

    // H-H bond (pre-fusion proximity)
    var hhBond = document.getElementById('mg-bond-HH');
    var fusionProx = Math.max(0, 1 - dHH / 45);
    if (hhBond) {
      hhBond.setAttribute('x1', chemPos[0].x.toFixed(1));
      hhBond.setAttribute('y1', chemPos[0].y.toFixed(1));
      hhBond.setAttribute('x2', chemPos[1].x.toFixed(1));
      hhBond.setAttribute('y2', chemPos[1].y.toFixed(1));
      hhBond.setAttribute('stroke-opacity', (fusionProx * 0.35).toFixed(3));
    }

    // He fusion indicator — glows when H+H are close
    var heMx = (chemPos[0].x + chemPos[1].x) / 2;
    var heMy = (chemPos[0].y + chemPos[1].y) / 2;
    var heEl = document.getElementById('mg-chem-He');
    if (heEl) {
      heEl.setAttribute('cx', heMx.toFixed(1));
      heEl.setAttribute('cy', heMy.toFixed(1));
      heEl.setAttribute('opacity', (fusionProx * fusionProx * 0.6).toFixed(3));
      heEl.setAttribute('r', (4 + fusionProx * 5).toFixed(1));
    }
    var heLbl = document.getElementById('mg-chem-label-He');
    if (heLbl) {
      heLbl.setAttribute('x', heMx.toFixed(1));
      heLbl.setAttribute('y', (heMy - 10).toFixed(1));
      heLbl.setAttribute('opacity', (fusionProx * fusionProx * 0.35).toFixed(3));
    }

    // H₂O bond formation — when both H's are near O
    var waterProx = Math.min(
      Math.max(0, 1 - dH1O / 55),
      Math.max(0, 1 - dH2O / 55));
    var bond1 = document.getElementById('mg-bond-HO1');
    var bond2 = document.getElementById('mg-bond-HO2');
    if (bond1) {
      bond1.setAttribute('x1', chemPos[0].x.toFixed(1));
      bond1.setAttribute('y1', chemPos[0].y.toFixed(1));
      bond1.setAttribute('x2', chemPos[2].x.toFixed(1));
      bond1.setAttribute('y2', chemPos[2].y.toFixed(1));
      bond1.setAttribute('stroke-opacity', (waterProx * 0.45).toFixed(3));
    }
    if (bond2) {
      bond2.setAttribute('x1', chemPos[1].x.toFixed(1));
      bond2.setAttribute('y1', chemPos[1].y.toFixed(1));
      bond2.setAttribute('x2', chemPos[2].x.toFixed(1));
      bond2.setAttribute('y2', chemPos[2].y.toFixed(1));
      bond2.setAttribute('stroke-opacity', (waterProx * 0.45).toFixed(3));
    }

    // H₂O label — appears when water forms
    var h2oLbl = document.getElementById('mg-chem-label-H2O');
    if (h2oLbl) {
      h2oLbl.setAttribute('x', chemPos[2].x.toFixed(1));
      h2oLbl.setAttribute('y', (chemPos[2].y + 12).toFixed(1));
      h2oLbl.setAttribute('opacity', (waterProx * waterProx * 0.3).toFixed(3));
    }

    // Bond angle arc — show the 104.5° H-O-H angle when water forms
    if (waterProx > 0.1) {
      var aH1 = Math.atan2(chemPos[0].y - chemPos[2].y, chemPos[0].x - chemPos[2].x);
      var aH2 = Math.atan2(chemPos[1].y - chemPos[2].y, chemPos[1].x - chemPos[2].x);
      var bondAngleDeg = Math.abs(aH1 - aH2) * 180 / PI;
      if (bondAngleDeg > 180) bondAngleDeg = 360 - bondAngleDeg;
      var arcR = 8;
      var arcPath = 'M ' +
        (chemPos[2].x + arcR * Math.cos(aH1)).toFixed(1) + ' ' +
        (chemPos[2].y + arcR * Math.sin(aH1)).toFixed(1) +
        ' A ' + arcR + ' ' + arcR + ' 0 0 ' +
        (aH2 > aH1 ? '1' : '0') + ' ' +
        (chemPos[2].x + arcR * Math.cos(aH2)).toFixed(1) + ' ' +
        (chemPos[2].y + arcR * Math.sin(aH2)).toFixed(1);
      var bAngleEl = document.getElementById('mg-bond-angle');
      if (bAngleEl) {
        bAngleEl.setAttribute('d', arcPath);
        bAngleEl.setAttribute('stroke-opacity', (waterProx * 0.3).toFixed(3));
      }
      var bAngleLbl = document.getElementById('mg-bond-angle-label');
      if (bAngleLbl) {
        bAngleLbl.setAttribute('x', (chemPos[2].x + 14 * Math.cos((aH1+aH2)/2)).toFixed(1));
        bAngleLbl.setAttribute('y', (chemPos[2].y + 14 * Math.sin((aH1+aH2)/2)).toFixed(1));
        bAngleLbl.textContent = bondAngleDeg.toFixed(1) + '\u00b0';
        bAngleLbl.setAttribute('opacity', (waterProx * 0.2).toFixed(3));
      }
    }

    // ── Solar system: planets orbit outside the ring ──
    // Moon orbits fast (monthly). Mars, Jupiter, Saturn at their own rates.
    // All rates coprime. Nothing locks.
    var solarRates = [
      {id:'moon',    orb:R+12,    rate:PI*1.5,  phase:0},
      {id:'mars',    orb:R*1.15,  rate:PI/3.7,  phase:PI/3},
      {id:'jupiter', orb:R*1.32,  rate:PI/7.9,  phase:PI},
      {id:'saturn',  orb:R*1.44,  rate:PI/13.3, phase:PI*1.7}
    ];
    for (var spi = 0; spi < solarRates.length; spi++) {
      var sp = solarRates[spi];
      var spAngle = sp.phase + t * sp.rate;
      var spx = cx + sp.orb * Math.cos(spAngle);
      var spy = cy + sp.orb * Math.sin(spAngle);
      var spDot = document.getElementById('mg-solar-' + sp.id);
      if (spDot) {
        spDot.setAttribute('cx', spx.toFixed(1));
        spDot.setAttribute('cy', spy.toFixed(1));
      }
      var spLbl = document.getElementById('mg-solar-label-' + sp.id);
      if (spLbl) {
        spLbl.setAttribute('x', spx.toFixed(1));
        var pSize = [2, 2.5, 4, 3.5][spi];
        spLbl.setAttribute('y', (spy - pSize - 3).toFixed(1));
      }
    }

    // ── Epitope orbit ring twist: dashes rotate, rings come alive ──
    // The 3 orbit rings now twist visually — their dash patterns rotate.
    // Ring 1: forward at ω_is. Ring 2: REVERSE at ω_was. Ring 3: forward at ω_willbe.
    var orbitTwist = [
      {rate: omega_is,     torsion: 1},   // ring 1: forward
      {rate: omega_was,    torsion: -1},   // ring 2: reverse — the eating
      {rate: omega_willbe, torsion: 1}    // ring 3: forward
    ];
    for (var otri = 0; otri < 3; otri++) {
      var otrEl = document.getElementById('mg-orbit-ring-' + (otri + 1));
      if (otrEl) {
        var otrDeg = (t * orbitTwist[otri].rate * orbitTwist[otri].torsion * 180 / PI) % 360;
        otrEl.setAttribute('transform',
          'rotate(' + otrDeg.toFixed(1) + ' ' + cx + ' ' + cy + ')');
      }
    }

    // ── Complexity spine: jelly strands evolving through all tiers ──
    // The spine angle rotates slowly — the chain itself orbits.
    // At each tier, the strand crosses (self meets non-self = abstraction).
    // Complexity increases outward: more crossings, more structure.
    var spineAngle = t * PI / 37; // slow drift — 37 is prime
    var oortR = Math.min(R * 1.55, 230);
    var TIER_FRACS = [0, 0.05, 0.18, 0.25, 0.35, 0.52, 0.68, 0.82, 1.0, 1.32, 1.55];
    var TIER_COLORS = ['#ffffff','#d2a8ff','#c9d1d9','#f0e68c','#58a6ff',
                       '#6e7681','#d2a8ff','#5ab87a','#c9d1d9','#f0e68c','#484f58'];

    // Position tier nodes radially along the spine angle
    for (var stai = 0; stai < 11; stai++) {
      var stR = TIER_FRACS[stai] * R;
      var stNodeAngle = spineAngle + stai * PI / 5.5; // π/5.5 radians between tiers
      var stx = cx + stR * Math.cos(stNodeAngle);
      var sty = cy + stR * Math.sin(stNodeAngle);
      var stNode = document.getElementById('mg-tier-' + stai);
      if (stNode) {
        stNode.setAttribute('cx', stx.toFixed(1));
        stNode.setAttribute('cy', sty.toFixed(1));
        // Pulse at tier's own prime rate
        var stPulse = 0.08 + 0.06 * Math.sin(t * PI / (stai + 2));
        stNode.setAttribute('opacity', (stPulse * (0.3 + 0.7 * perturb)).toFixed(3));
      }
      var stLabel = document.getElementById('mg-tier-label-' + stai);
      if (stLabel) {
        stLabel.setAttribute('x', (stx + 5).toFixed(1));
        stLabel.setAttribute('y', (sty - 3).toFixed(1));
        stLabel.setAttribute('opacity', (0.04 + 0.08 * perturb).toFixed(3));
      }
    }

    // Tier connection links — arc between consecutive tiers
    for (var stli = 0; stli < 10; stli++) {
      var stlR1 = TIER_FRACS[stli] * R;
      var stlR2 = TIER_FRACS[stli + 1] * R;
      var stlA1 = spineAngle + stli * PI / 5.5;
      var stlA2 = spineAngle + (stli + 1) * PI / 5.5;
      var stlLink = document.getElementById('mg-tier-link-' + stli);
      if (stlLink) {
        stlLink.setAttribute('x1', (cx + stlR1 * Math.cos(stlA1)).toFixed(1));
        stlLink.setAttribute('y1', (cy + stlR1 * Math.sin(stlA1)).toFixed(1));
        stlLink.setAttribute('x2', (cx + stlR2 * Math.cos(stlA2)).toFixed(1));
        stlLink.setAttribute('y2', (cy + stlR2 * Math.sin(stlA2)).toFixed(1));
        stlLink.setAttribute('stroke-opacity', (0.03 + 0.04 * perturb).toFixed(3));
      }
    }

    // Self spine strand: clockwise jelly spiral from [∅]D through all tiers to Oort
    var SSTEPS = 64;
    var spSelfPts = [];
    for (var ssi = 0; ssi <= SSTEPS; ssi++) {
      var ssF = ssi / SSTEPS;
      var ssR = ssF * oortR;
      // π turns per full extent — the twist IS abstraction
      var ssA = spineAngle + ssF * PI * TAU;
      spSelfPts.push((cx + ssR * Math.cos(ssA)).toFixed(1) + ' ' +
                     (cy + ssR * Math.sin(ssA)).toFixed(1));
    }
    var spSelfEl = document.getElementById('mg-spine-self');
    if (spSelfEl) {
      spSelfEl.setAttribute('d', 'M ' + spSelfPts.join(' L '));
      spSelfEl.setAttribute('stroke-opacity', (0.04 + 0.04 * perturb).toFixed(3));
    }

    // Non-self spine strand: counter-clockwise, π offset
    var spNonPts = [];
    for (var sni = 0; sni <= SSTEPS; sni++) {
      var snF = sni / SSTEPS;
      var snR = snF * oortR;
      var snA = spineAngle + PI + snF * PI * TAU * -1;
      spNonPts.push((cx + snR * Math.cos(snA)).toFixed(1) + ' ' +
                    (cy + snR * Math.sin(snA)).toFixed(1));
    }
    var spNonEl = document.getElementById('mg-spine-nonself');
    if (spNonEl) {
      spNonEl.setAttribute('d', 'M ' + spNonPts.join(' L '));
      spNonEl.setAttribute('stroke-opacity', (0.04 + 0.04 * perturb).toFixed(3));
    }

    // ── Evolution wave: scan → sweep → sort → fossilize → evolve ──
    // One particle climbs from [∅]D to Oort, cycling every ~73 seconds.
    // As it passes each process zone, that verb activates (brightens).
    // The wave IS the observation moving through complexity.
    var evoRate = 0.15; // climb speed — one tier per ~6.7s
    var evoF = (t * evoRate) % 11; // fractional tier position [0..11)
    var evoTierA = Math.floor(evoF);
    var evoTierB = Math.min(evoTierA + 1, 10);
    var evoLerp = evoF - evoTierA;

    // Interpolate wave position between consecutive tier nodes
    var evoR1 = TIER_FRACS[evoTierA] * R;
    var evoR2 = TIER_FRACS[evoTierB] * R;
    var evoA1 = spineAngle + evoTierA * PI / 5.5;
    var evoA2 = spineAngle + evoTierB * PI / 5.5;
    var evoR = evoR1 + (evoR2 - evoR1) * evoLerp;
    var evoA = evoA1 + (evoA2 - evoA1) * evoLerp;
    var evoX = cx + evoR * Math.cos(evoA);
    var evoY = cy + evoR * Math.sin(evoA);

    var evoWave = document.getElementById('mg-evo-wave');
    if (evoWave) {
      evoWave.setAttribute('cx', evoX.toFixed(1));
      evoWave.setAttribute('cy', evoY.toFixed(1));
      // Pulse brighter at tier crossings (when evoLerp near 0 or 1)
      var evoPulse = 1 - Math.abs(evoLerp - 0.5) * 2; // 0 at edges, 1 at center
      evoWave.setAttribute('opacity', (0.06 + 0.12 * perturb + 0.06 * evoPulse).toFixed(3));
      evoWave.setAttribute('r', (2 + evoPulse * 1.5).toFixed(1));
    }

    // Wave trail — 3 fading dots trailing behind the wave
    for (var ewti = 0; ewti < 3; ewti++) {
      var ewtF = ((t * evoRate) - (ewti + 1) * 0.3 + 110) % 11;
      var ewtTierA = Math.floor(ewtF);
      var ewtTierB = Math.min(ewtTierA + 1, 10);
      var ewtLerp = ewtF - ewtTierA;
      var ewtR1 = TIER_FRACS[ewtTierA] * R;
      var ewtR2 = TIER_FRACS[ewtTierB] * R;
      var ewtA1 = spineAngle + ewtTierA * PI / 5.5;
      var ewtA2 = spineAngle + ewtTierB * PI / 5.5;
      var ewtR = ewtR1 + (ewtR2 - ewtR1) * ewtLerp;
      var ewtA = ewtA1 + (ewtA2 - ewtA1) * ewtLerp;
      var ewtEl = document.getElementById('mg-evo-trail-' + ewti);
      if (ewtEl) {
        ewtEl.setAttribute('cx', (cx + ewtR * Math.cos(ewtA)).toFixed(1));
        ewtEl.setAttribute('cy', (cy + ewtR * Math.sin(ewtA)).toFixed(1));
        ewtEl.setAttribute('opacity', (0.03 * (3 - ewti) / 3 * perturb).toFixed(3));
      }
    }

    // Process verb labels — positioned at their zone midpoints
    // scan: tiers 0-1 (quark scale). sweep: tiers 2-3 (fusion).
    // sort: tiers 4-5 (molecular). fossilize: tiers 6-7 (cellular).
    // evolve: tiers 8-9 (planetary). Tier 10 = Oort = boundary/wrap.
    var PROC_COLS = ['#ffffff','#4a8fb8','#5ab87a','#f0e68c','#d2a8ff'];
    for (var pvi = 0; pvi < 5; pvi++) {
      var pvMidTier = pvi * 2 + 1; // midpoint tier for this process
      var pvR = TIER_FRACS[pvMidTier] * R;
      var pvA = spineAngle + pvMidTier * PI / 5.5 + PI / 11;
      var pvX = cx + pvR * Math.cos(pvA);
      var pvY = cy + pvR * Math.sin(pvA);
      var pvEl = document.getElementById('mg-proc-' + pvi);
      if (pvEl) {
        pvEl.setAttribute('x', pvX.toFixed(1));
        pvEl.setAttribute('y', pvY.toFixed(1));
        // Brighten when evolution wave is in this process's zone
        var pvActive = (evoF >= pvi * 2 && evoF < (pvi + 1) * 2) ? 1 : 0;
        var pvOp = 0.03 + 0.15 * pvActive * perturb + 0.03 * perturb;
        pvEl.setAttribute('opacity', pvOp.toFixed(3));
        pvEl.setAttribute('fill', pvActive ? '#ffffff' : PROC_COLS[pvi]);
      }
    }

    // ── Compound eye facets: 3/5/7 rotate with the ring ──
    // Each facet is an epitope sort. The compound eye sees π directions at once.
    // 3 impermeable walls + 5 self facets + 7 passage facets = 15 braids.
    var ringDrift = t * PI / 31; // ring's rotation rate
    var facetCounts = [3, 5, 7]; // wall, self, passage
    var facetColors = ['#e85d3a', '#4a8fb8', '#5ab87a'];
    for (var fai = 0; fai < 15; fai++) {
      var faEl = document.getElementById('mg-facet-' + fai);
      if (faEl) {
        var faBase = fai * TAU / 15 + ringDrift;
        var faArc = TAU / 15;
        var fa1 = faBase - faArc * 0.45, fa2 = faBase + faArc * 0.45;
        faEl.setAttribute('d',
          'M '+(cx+R*Math.cos(fa1)).toFixed(1)+' '+(cy+R*Math.sin(fa1)).toFixed(1)+
          ' A '+R+' '+R+' 0 0 1 '+
          (cx+R*Math.cos(fa2)).toFixed(1)+' '+(cy+R*Math.sin(fa2)).toFixed(1));
        // Pulse: each facet has its own rhythm
        var faPulse = 0.03 + 0.05 * Math.sin(t * PI / (fai + 2)) * perturb;
        faEl.setAttribute('stroke-opacity', faPulse.toFixed(3));
      }
      // Symbol drifts with its facet
      var faSym = document.getElementById('mg-facet-sym-' + fai);
      if (faSym) {
        var faSymA = fai * TAU / 15 + ringDrift;
        faSym.setAttribute('x', (cx + (R + 9) * Math.cos(faSymA)).toFixed(1));
        faSym.setAttribute('y', (cy + (R + 9) * Math.sin(faSymA)).toFixed(1));
        faSym.setAttribute('opacity', (0.02 + 0.04 * perturb).toFixed(3));
      }
    }

    // π digits rotate with the ring — the membrane on either side
    for (var pdai = 0; pdai < 15; pdai++) {
      var pdaEl = document.getElementById('mg-pi-digit-' + pdai);
      if (pdaEl) {
        var pdaAngle = -PI/2 + pdai * TAU / 15 + ringDrift;
        pdaEl.setAttribute('x', (cx + (R - 7) * Math.cos(pdaAngle)).toFixed(1));
        pdaEl.setAttribute('y', (cy + (R - 7) * Math.sin(pdaAngle)).toFixed(1));
        pdaEl.setAttribute('opacity', (0.02 + 0.05 * perturb).toFixed(3));
      }
    }

    // ── Gaia: real-time Earth rotation ──
    // Map UTC hour to rotation angle. You see where you are on the system.
    // The window floats in orbit with Gaia. Not locked. Rotating.
    var gaiaRing = document.getElementById('mg-gaia-ring');
    var gaiaMarker = document.getElementById('mg-gaia-marker');
    if (gaiaRing && gaiaMarker) {
      var now24 = new Date();
      var utcHourFrac = (now24.getUTCHours() + now24.getUTCMinutes() / 60
                         + now24.getUTCSeconds() / 3600) / 24;
      var gaiaAngle = utcHourFrac * TAU - PI / 2; // noon at top
      // Marker shows current position on Earth's rotation
      gaiaMarker.setAttribute('cx', (cx + 6 * Math.cos(gaiaAngle)).toFixed(1));
      gaiaMarker.setAttribute('cy', (cy + 6 * Math.sin(gaiaAngle)).toFixed(1));
      gaiaMarker.setAttribute('opacity', (0.06 + 0.06 * perturb).toFixed(2));
      // Ring breathes
      gaiaRing.setAttribute('stroke-opacity', (0.04 + 0.04 * perturb).toFixed(3));
    }
    var gaiaLabel = document.getElementById('mg-gaia-label');
    if (gaiaLabel) {
      gaiaLabel.setAttribute('opacity', (0.03 + 0.05 * perturb).toFixed(3));
    }

    // Geodesic: the shape of light intersection, front + peripheral
    // Hexagonal faces rotate slowly — the geodesic dome of observation.
    for (var gdai = 0; gdai < 6; gdai++) {
      var gdaEl = document.getElementById('mg-geodesic-' + gdai);
      if (gdaEl) {
        var gdaA1 = gdai * TAU / 6 + t * PI / 19;
        var gdaA2 = (gdai + 1) * TAU / 6 + t * PI / 19;
        var gdaR = 8 + 4 * perturb;
        gdaEl.setAttribute('x1', (cx + gdaR * Math.cos(gdaA1)).toFixed(1));
        gdaEl.setAttribute('y1', (cy + gdaR * Math.sin(gdaA1)).toFixed(1));
        gdaEl.setAttribute('x2', (cx + gdaR * Math.cos(gdaA2)).toFixed(1));
        gdaEl.setAttribute('y2', (cy + gdaR * Math.sin(gdaA2)).toFixed(1));
        gdaEl.setAttribute('stroke-opacity', (0.03 + 0.04 * perturb).toFixed(3));
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
