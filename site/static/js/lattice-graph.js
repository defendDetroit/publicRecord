// Anderson Localization lattice visualization for detroit.primals.eco
// Renders courts as lattice sites, judges as disorder potential,
// and case types as electron paths that localize at captured sites.
//
// Data source: window.DETROIT_NETWORK.benches + .latticePaths

(function() {
  'use strict';

  var DN = window.DETROIT_NETWORK || {};
  var BENCHES = DN.benches || [];
  var LATTICE_PATHS = DN.latticePaths || {};

  // Only render if the lattice container exists on the page
  var container = document.getElementById('lattice-graph');
  if (!container) return;

  // ── Filter to active (non-retired) benches ─────────────────────────
  var activeBenches = BENCHES.filter(function(b) { return !b.retired; });
  if (activeBenches.length === 0) return;

  // ── Collect unique courts and case types ───────────────────────────
  var courtIds = [];
  var courtLabels = {};
  activeBenches.forEach(function(b) {
    if (courtIds.indexOf(b.court) === -1) {
      courtIds.push(b.court);
      courtLabels[b.court] = b.court.replace('court_', '').replace('_', ' ');
    }
  });

  var caseTypes = Object.keys(LATTICE_PATHS).sort(function(a, b) {
    var la = LATTICE_PATHS[a].localizationLength;
    var lb = LATTICE_PATHS[b].localizationLength;
    if (la === Infinity && lb === Infinity) return a < b ? -1 : 1;
    if (la === Infinity) return 1;
    if (lb === Infinity) return -1;
    return la - lb;
  });

  // ── Layout constants ──────────────────────────────────────────────
  var CELL_W = 160;
  var CELL_H = 58;
  var HEADER_W = 130;
  var HEADER_H = 38;
  var PAD = 20;
  var TOP_PAD = 60;
  var JUDGE_R = 6;

  var totalW = HEADER_W + caseTypes.length * CELL_W + PAD * 2;
  var totalH = TOP_PAD + courtIds.length * CELL_H + PAD + 120;

  // ── Create canvas ─────────────────────────────────────────────────
  var canvas = document.createElement('canvas');
  canvas.width = totalW;
  canvas.height = totalH;
  canvas.style.width = '100%';
  canvas.style.maxWidth = totalW + 'px';
  canvas.style.display = 'block';
  canvas.style.margin = '0 auto';
  canvas.style.background = '#0d1117';
  canvas.style.borderRadius = '8px';
  container.appendChild(canvas);

  var ctx = canvas.getContext('2d');

  // ── Color palette ─────────────────────────────────────────────────
  var BG = '#0d1117';
  var GRID_COLOR = '#21262d';
  var LABEL_COLOR = '#c9d1d9';
  var HEADER_COLOR = '#e6edf3';
  var SAFE_COLOR = '#238636';
  var CAPTURED_LOW = '#d29922';
  var CAPTURED_HIGH = '#da3633';
  var FLOW_COLOR = '#58a6ff';
  var DECAY_COLOR = '#da3633';

  function captureColor(ratio) {
    if (ratio === 0) return SAFE_COLOR;
    if (ratio < 0.1) return CAPTURED_LOW;
    return CAPTURED_HIGH;
  }

  function cellBgColor(ratio) {
    if (ratio === 0) return 'rgba(35, 134, 54, 0.08)';
    var alpha = Math.min(0.35, ratio * 1.5);
    return 'rgba(218, 54, 51, ' + alpha.toFixed(2) + ')';
  }

  // ── Build bench lookup: (court, caseType) → bench ─────────────────
  var benchGrid = {};
  activeBenches.forEach(function(b) {
    b.caseTypes.forEach(function(ct) {
      var key = b.court + ':' + ct;
      benchGrid[key] = b;
    });
  });

  // ── Draw ───────────────────────────────────────────────────────────

  function draw() {
    ctx.clearRect(0, 0, totalW, totalH);
    ctx.fillStyle = BG;
    ctx.fillRect(0, 0, totalW, totalH);

    // Title
    ctx.fillStyle = HEADER_COLOR;
    ctx.font = 'bold 16px "Inter", system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Anderson Localization Lattice — Wayne County Courts', totalW / 2, 24);
    ctx.font = '11px "Inter", system-ui, sans-serif';
    ctx.fillStyle = LABEL_COLOR;
    ctx.fillText('Rows = court divisions  ·  Columns = case types (sorted by localization length, shortest first)', totalW / 2, 42);

    var originX = PAD + HEADER_W;
    var originY = TOP_PAD;

    // Column headers (case types)
    ctx.font = '10px "Inter", system-ui, sans-serif';
    ctx.textAlign = 'center';
    caseTypes.forEach(function(ct, ci) {
      var x = originX + ci * CELL_W + CELL_W / 2;
      ctx.save();
      ctx.translate(x, originY - 6);
      ctx.rotate(-0.45);
      ctx.fillStyle = LABEL_COLOR;
      ctx.textAlign = 'right';
      ctx.fillText(ct, 0, 0);
      ctx.restore();
    });

    // Row headers (courts)
    courtIds.forEach(function(crt, ri) {
      var y = originY + ri * CELL_H + CELL_H / 2;
      ctx.fillStyle = HEADER_COLOR;
      ctx.font = 'bold 12px "Inter", system-ui, sans-serif';
      ctx.textAlign = 'right';
      var label = courtLabels[crt];
      label = label.charAt(0).toUpperCase() + label.slice(1);
      ctx.fillText(label, PAD + HEADER_W - 10, y + 4);
    });

    // Grid cells
    courtIds.forEach(function(crt, ri) {
      caseTypes.forEach(function(ct, ci) {
        var x = originX + ci * CELL_W;
        var y = originY + ri * CELL_H;
        var key = crt + ':' + ct;
        var bench = benchGrid[key];

        // Grid line
        ctx.strokeStyle = GRID_COLOR;
        ctx.lineWidth = 0.5;
        ctx.strokeRect(x, y, CELL_W, CELL_H);

        if (!bench) {
          // Empty cell — no jurisdiction
          ctx.fillStyle = 'rgba(255,255,255,0.02)';
          ctx.fillRect(x + 1, y + 1, CELL_W - 2, CELL_H - 2);
          ctx.fillStyle = '#484f58';
          ctx.font = '10px "Inter", system-ui, sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText('—', x + CELL_W / 2, y + CELL_H / 2 + 3);
          return;
        }

        // Filled cell — jurisdiction exists
        ctx.fillStyle = cellBgColor(bench.captureRatio);
        ctx.fillRect(x + 1, y + 1, CELL_W - 2, CELL_H - 2);

        // Judge dots: left-aligned row of circles
        var dotX = x + 14;
        var dotY = y + CELL_H / 2;
        var total = Math.min(bench.totalJudges, 12);
        var captured = bench.capturedJudges.length;

        for (var j = 0; j < total; j++) {
          ctx.beginPath();
          ctx.arc(dotX + j * (JUDGE_R * 2 + 3), dotY - 6, JUDGE_R, 0, Math.PI * 2);
          if (j < captured) {
            ctx.fillStyle = CAPTURED_HIGH;
            ctx.fill();
            ctx.strokeStyle = '#fff';
            ctx.lineWidth = 1.5;
            ctx.stroke();
          } else {
            ctx.fillStyle = SAFE_COLOR;
            ctx.globalAlpha = 0.4;
            ctx.fill();
            ctx.globalAlpha = 1;
          }
        }

        // If more judges than we drew dots for
        if (bench.totalJudges > 12) {
          ctx.fillStyle = LABEL_COLOR;
          ctx.font = '9px "Inter", system-ui, sans-serif';
          ctx.textAlign = 'left';
          ctx.fillText('+' + (bench.totalJudges - 12), dotX + 12 * (JUDGE_R * 2 + 3) + 4, dotY - 3);
        }

        // Capture ratio label
        ctx.fillStyle = captureColor(bench.captureRatio);
        ctx.font = 'bold 11px "Inter", system-ui, sans-serif';
        ctx.textAlign = 'center';
        var pct = (bench.captureRatio * 100).toFixed(1) + '%';
        ctx.fillText(pct, x + CELL_W / 2, y + CELL_H - 6);
      });
    });

    // ── Localization length bar at bottom ────────────────────────────
    var barY = originY + courtIds.length * CELL_H + 30;
    ctx.fillStyle = HEADER_COLOR;
    ctx.font = 'bold 12px "Inter", system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Localization Length (ξ) — lower = more captured', totalW / 2, barY);

    ctx.font = '10px "Inter", system-ui, sans-serif';
    barY += 16;

    var maxLocLen = 0;
    caseTypes.forEach(function(ct) {
      var ll = LATTICE_PATHS[ct].localizationLength;
      if (ll !== Infinity && ll > maxLocLen) maxLocLen = ll;
    });

    caseTypes.forEach(function(ct, ci) {
      var x = originX + ci * CELL_W;
      var lp = LATTICE_PATHS[ct];
      var ll = lp.localizationLength;
      var barMaxH = 50;

      if (ll === Infinity) {
        ctx.fillStyle = '#484f58';
        ctx.textAlign = 'center';
        ctx.fillText('∞', x + CELL_W / 2, barY + barMaxH / 2 + 3);
        return;
      }

      var barH = (ll / maxLocLen) * barMaxH;
      var color = ll < 5 ? CAPTURED_HIGH : ll < 10 ? CAPTURED_LOW : SAFE_COLOR;

      ctx.fillStyle = color;
      ctx.globalAlpha = 0.7;
      ctx.fillRect(x + CELL_W / 2 - 12, barY + barMaxH - barH, 24, barH);
      ctx.globalAlpha = 1;

      // Value label
      ctx.fillStyle = LABEL_COLOR;
      ctx.textAlign = 'center';
      ctx.fillText(ll.toFixed(1), x + CELL_W / 2, barY + barMaxH + 12);
    });

    // ── Legend ───────────────────────────────────────────────────────
    var legY = barY + 75;
    ctx.fillStyle = LABEL_COLOR;
    ctx.font = '11px "Inter", system-ui, sans-serif';
    ctx.textAlign = 'left';

    // Captured dot
    ctx.beginPath();
    ctx.arc(PAD + 10, legY, 5, 0, Math.PI * 2);
    ctx.fillStyle = CAPTURED_HIGH;
    ctx.fill();
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 1;
    ctx.stroke();
    ctx.fillStyle = LABEL_COLOR;
    ctx.fillText('Captured judge', PAD + 22, legY + 4);

    // Safe dot
    ctx.beginPath();
    ctx.arc(PAD + 150, legY, 5, 0, Math.PI * 2);
    ctx.fillStyle = SAFE_COLOR;
    ctx.globalAlpha = 0.4;
    ctx.fill();
    ctx.globalAlpha = 1;
    ctx.fillStyle = LABEL_COLOR;
    ctx.fillText('Independent judge', PAD + 162, legY + 4);

    // ξ explanation
    ctx.fillText('ξ = −1/ln(1 − p)  where p = captured/total across benches handling that case type', PAD + 310, legY + 4);
  }

  draw();

  // ── Tooltip on hover ──────────────────────────────────────────────
  var tooltip = document.createElement('div');
  tooltip.style.cssText = 'position:absolute;display:none;background:#161b22;border:1px solid #30363d;' +
    'border-radius:6px;padding:8px 12px;color:#c9d1d9;font:12px "Inter",system-ui,sans-serif;' +
    'pointer-events:none;z-index:100;max-width:320px;line-height:1.4;';
  container.style.position = 'relative';
  container.appendChild(tooltip);

  canvas.addEventListener('mousemove', function(e) {
    var rect = canvas.getBoundingClientRect();
    var scaleX = canvas.width / rect.width;
    var mx = (e.clientX - rect.left) * scaleX;
    var my = (e.clientY - rect.top) * scaleX;

    var originX = PAD + HEADER_W;
    var originY = TOP_PAD;

    var ci = Math.floor((mx - originX) / CELL_W);
    var ri = Math.floor((my - originY) / CELL_H);

    if (ci < 0 || ci >= caseTypes.length || ri < 0 || ri >= courtIds.length) {
      tooltip.style.display = 'none';
      return;
    }

    var ct = caseTypes[ci];
    var crt = courtIds[ri];
    var bench = benchGrid[crt + ':' + ct];

    if (!bench) {
      tooltip.style.display = 'none';
      return;
    }

    var lp = LATTICE_PATHS[ct] || {};
    var html = '<strong>' + bench.label + '</strong><br>' +
      'Case type: <em>' + ct + '</em><br>' +
      'Judges: ' + bench.capturedJudges.length + ' captured / ' + bench.totalJudges + ' total<br>' +
      'Capture ratio: <strong style="color:' + captureColor(bench.captureRatio) + '">' +
      (bench.captureRatio * 100).toFixed(1) + '%</strong><br>';

    if (lp.localizationLength !== undefined) {
      var ll = lp.localizationLength;
      var llStr = ll === Infinity ? '∞' : ll.toFixed(1);
      html += 'Localization length (ξ): <strong>' + llStr + '</strong>';
      if (ll < 5) html += ' <span style="color:#da3633">⚠ strongly localized</span>';
      else if (ll < 10) html += ' <span style="color:#d29922">⚠ moderately localized</span>';
    }

    html += '<br><span style="color:#8b949e;font-size:11px">' + bench.note + '</span>';

    tooltip.innerHTML = html;
    tooltip.style.display = 'block';
    tooltip.style.left = (e.clientX - rect.left + 16) + 'px';
    tooltip.style.top = (e.clientY - rect.top + 16) + 'px';
  });

  canvas.addEventListener('mouseleave', function() {
    tooltip.style.display = 'none';
  });

})();
