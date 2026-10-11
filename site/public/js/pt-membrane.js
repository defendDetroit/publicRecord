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
      // Show each body's contribution
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
      // Show the product converging to π
      var product = document.getElementById('mg-product');
      if (product && vals.is > 0 && vals.was > 0 && vals.willbe > 0) {
        // Normalize: E·m·c² relative to π
        var norm = (vals.is * vals.was * vals.willbe);
        var ratio = norm > 0 ? (PI / norm) : 0;
        product.textContent = 'IS\u00d7WAS\u00d7WILLBE \u2192 \u03c0 (' + ratio.toFixed(3) + ')';
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

      // Tangent line
      el('line', {x1:(px-txd*tLen).toFixed(1), y1:(py-tyd*tLen).toFixed(1),
        x2:(px+txd*tLen).toFixed(1), y2:(py+tyd*tLen).toFixed(1),
        stroke:color, 'stroke-width':1, 'stroke-opacity':(op*0.6).toFixed(2)}, wasG);

      // Focal line
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

    // ═══ THREE BODIES: IS/WAS/WILLBE ═══
    var wbG = el('g', {id:'mg-willbe'}, svg);
    var BR = R * (PI/8);
    // IS × WAS × WILLBE = π
    // Each body = π^(1/3) ≈ 1.46 — the null-dimensional cost.
    // V·J = π^(2/3) without diversity. V·D·J = π with.
    // The gap between π (product) and π^(3/2) (observation cost) = √π = C(1).
    // That gap is the cost of collapsing 3 tenses into 1 measurement.
    // 1/0 = [∅] — null. The dimension before dimension.
    var cbrt = Math.pow(PI, 1/3); // π^(1/3) ≈ 1.46
    var bodies = [
      {id:'is', label:'IS', sub:'\u03c0^(1/3) \u2248 '+cbrt.toFixed(2), angle:-PI/2, color:'#e85d3a'},
      {id:'was', label:'WAS', sub:'\u03c0^(1/3) \u2248 '+cbrt.toFixed(2), angle:-PI/2+TAU/3, color:'#4a8fb8'},
      {id:'willbe', label:'WILLBE', sub:'\u03c0^(1/3) \u2248 '+cbrt.toFixed(2), angle:-PI/2+2*TAU/3, color:'#5ab87a'}
    ];
    var bPos = {};
    bodies.forEach(function(b) { bPos[b.id] = {x:cx+BR*Math.cos(b.angle), y:cy+BR*Math.sin(b.angle)}; });

    el('path', {d:'M '+bPos.is.x.toFixed(1)+' '+bPos.is.y.toFixed(1)+
      ' L '+bPos.was.x.toFixed(1)+' '+bPos.was.y.toFixed(1)+
      ' L '+bPos.willbe.x.toFixed(1)+' '+bPos.willbe.y.toFixed(1)+' Z',
      fill:'none', stroke:'#c9d1d9', 'stroke-width':0.5,
      'stroke-opacity':0.12, 'stroke-dasharray':'4,6', id:'mg-body-tri'}, wbG);

    // Edge products: each pair = π^(2/3), triple = π
    [{from:'is',to:'was',label:'\u03c0^(2/3)',color:'#e85d3a'},
     {from:'was',to:'willbe',label:'\u03c0^(2/3)',color:'#6e7681'},
     {from:'willbe',to:'is',label:'\u03c0^(2/3)',color:'#5ab87a'}].forEach(function(e) {
      txt(wbG, ((bPos[e.from].x+bPos[e.to].x)/2).toFixed(1),
        ((bPos[e.from].y+bPos[e.to].y)/2).toFixed(1),
        e.label, e.color, 5.5, {opacity:0.4, 'dominant-baseline':'central'});
    });

    bodies.forEach(function(b) {
      var p = bPos[b.id];
      el('circle', {cx:p.x.toFixed(1), cy:p.y.toFixed(1), r:16,
        fill:'none', stroke:b.color, 'stroke-width':0.5,
        'stroke-opacity':0.18, 'stroke-dasharray':'2,3',
        id:'mg-body-ring-'+b.id}, wbG);
      el('circle', {cx:p.x.toFixed(1), cy:p.y.toFixed(1), r:4.5,
        fill:b.color, opacity:0.6, filter:'url(#mg-glow)',
        id:'mg-body-'+b.id}, wbG);
      txt(wbG, p.x.toFixed(1), (p.y-20).toFixed(1), b.label, b.color, 8.5,
        {opacity:0.85, 'font-weight':'bold'});
      txt(wbG, p.x.toFixed(1), (p.y+24).toFixed(1), b.sub, '#6e7681', 5.5,
        {opacity:0.45, id:'mg-body-val-'+b.id});
    });

    // Product display: IS × WAS × WILLBE = π at triangle center
    var triCx = (bPos.is.x + bPos.was.x + bPos.willbe.x) / 3;
    var triCy = (bPos.is.y + bPos.was.y + bPos.willbe.y) / 3;
    txt(wbG, triCx.toFixed(1), (triCy+6).toFixed(1),
      'IS\u00d7WAS\u00d7WILLBE = \u03c0', '#c9d1d9', 5.5,
      {opacity:0.5, id:'mg-product'});

    // ═══ TRIANGULATION: panel → nearest body ═══
    var triG = el('g', {id:'mg-triangulation', opacity:0}, svg);
    PANELS.forEach(function(p) {
      var g = geo[p.id]; if (!g) return;
      var nearest = bodies[0], minD = Infinity;
      bodies.forEach(function(b) {
        var dx = g.px - bPos[b.id].x, dy = g.py - bPos[b.id].y;
        var d = Math.sqrt(dx*dx + dy*dy);
        if (d < minD) { minD = d; nearest = b; }
      });
      el('line', {x1:g.px.toFixed(1), y1:g.py.toFixed(1),
        x2:bPos[nearest.id].x.toFixed(1), y2:bPos[nearest.id].y.toFixed(1),
        stroke:nearest.color, 'stroke-width':0.3, 'stroke-opacity':0.08,
        'stroke-dasharray':'1,4', id:'mg-tri-'+p.id}, triG);
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
