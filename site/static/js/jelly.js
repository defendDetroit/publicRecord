/**
 * JELLY — the thin reactive layer between Zola (static) and Membrane (live).
 *
 * Architecture:
 *   Zola renders <span data-pulse="fleet.total_requests">2,161,837</span>
 *   Jelly finds those elements, connects to the membrane, hydrates them.
 *   The static number is the fallback. If JS is off, the snapshot stands.
 *   If jelly is alive, the page breathes at membrane tempo.
 *
 * Like a cell membrane:
 *   Lipid bilayer   = Zola static HTML (structure, scaffold)
 *   Embedded protein = jelly (selective transport channels)
 *   Transport        = membrane API → SSE → data-pulse elements
 *
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */
;(function () {
  'use strict'

  var MEMBRANE_ORIGIN = 'https://hud.primals.eco'
  var POLL_INTERVAL_MS = 60000
  var MIN_POLL_MS = 10000
  var MAX_POLL_MS = 300000
  var PULSE_GLOW_MS = 600

  var state = null
  var connected = false
  var pulseBar = null
  var tempoMs = POLL_INTERVAL_MS

  // -- Resolve a dot-path against an object --
  function resolve(obj, path) {
    if (!obj || !path) return undefined
    var keys = path.split('.')
    var val = obj
    for (var i = 0; i < keys.length; i++) {
      if (val == null) return undefined
      val = val[keys[i]]
    }
    return val
  }

  // -- Format a value for display --
  function fmt(val) {
    if (val === undefined || val === null) return '—'
    if (typeof val === 'number') {
      if (val > 999999) return (val / 1000000).toFixed(2) + 'M'
      if (val > 9999) return (val / 1000).toFixed(1) + 'K'
      if (Number.isInteger(val)) return val.toLocaleString()
      return val.toFixed(val < 10 ? 2 : 1)
    }
    if (typeof val === 'string') return val
    return String(val)
  }

  // -- Hydrate all data-pulse elements --
  function hydrate(data) {
    if (!data) return
    state = data
    var els = document.querySelectorAll('[data-pulse]')
    for (var i = 0; i < els.length; i++) {
      var el = els[i]
      var path = el.getAttribute('data-pulse')
      var val = resolve(data, path)
      if (val === undefined) continue

      var formatted = fmt(val)
      if (el.textContent !== formatted) {
        el.textContent = formatted
        el.classList.add('jelly-pulsed')
        ;(function (e) {
          setTimeout(function () { e.classList.remove('jelly-pulsed') }, PULSE_GLOW_MS)
        })(el)
      }
    }
    updatePulseBar(data)
  }

  // -- Build or update the membrane pulse bar --
  function updatePulseBar(data) {
    if (!pulseBar) return

    var vitals = pulseBar.querySelector('.pulse-vitals')
    if (!vitals) return

    var items = [
      { key: 'wave', val: resolve(data, 'membrane.wave'), label: 'wave' },
      { key: 'humans', val: resolve(data, 'humans.genuine'), label: 'readers' },
      { key: 'fleet', val: resolve(data, 'fleet.total_requests'), label: 'fleet' },
      { key: 'rps', val: resolve(data, 'fleet.rps'), label: 'rps' },
      { key: 'depth', val: resolve(data, 'dialogue.depth'), label: 'depth' },
      { key: 'dwell', val: resolve(data, 'humans.dwell_median_min'), label: 'min dwell' }
    ]

    var html = ''
    for (var i = 0; i < items.length; i++) {
      var it = items[i]
      if (it.val === undefined) continue
      html += '<span class="pulse-vital" data-key="' + it.key + '">'
      html += '<span class="pulse-val" data-pulse="' +
        (it.key === 'wave' ? 'membrane.wave' :
         it.key === 'humans' ? 'humans.genuine' :
         it.key === 'fleet' ? 'fleet.total_requests' :
         it.key === 'rps' ? 'fleet.rps' :
         it.key === 'depth' ? 'dialogue.depth' :
         'humans.dwell_median_min') + '">' + fmt(it.val) + '</span>'
      html += '<span class="pulse-label">' + it.label + '</span>'
      html += '</span>'
    }

    vitals.innerHTML = html

    var dot = pulseBar.querySelector('.pulse-dot')
    if (dot) {
      dot.classList.remove('pulse-dot-beat')
      void dot.offsetWidth
      dot.classList.add('pulse-dot-beat')
    }
  }

  // -- Create the pulse bar DOM --
  function createPulseBar() {
    pulseBar = document.createElement('div')
    pulseBar.className = 'membrane-pulse'
    pulseBar.setAttribute('aria-label', 'Membrane pulse — live data from the immune system')

    pulseBar.innerHTML =
      '<div class="pulse-inner">' +
        '<span class="pulse-dot" title="Membrane heartbeat"></span>' +
        '<span class="pulse-status">connecting…</span>' +
        '<span class="pulse-vitals"></span>' +
      '</div>'

    var footer = document.querySelector('.site-footer')
    if (footer) {
      footer.parentNode.insertBefore(pulseBar, footer)
    } else {
      document.body.appendChild(pulseBar)
    }
  }

  // -- Set connection status --
  function setStatus(text, alive) {
    if (!pulseBar) return
    var el = pulseBar.querySelector('.pulse-status')
    if (el) el.textContent = text
    connected = alive
    pulseBar.classList.toggle('pulse-alive', alive)
    pulseBar.classList.toggle('pulse-dead', !alive)
  }

  // -- SSE connection --
  function connectSSE() {
    var url = MEMBRANE_ORIGIN + '/api/pulse'
    var source

    try {
      source = new EventSource(url)
    } catch (e) {
      fallbackPoll()
      return
    }

    source.onopen = function () {
      setStatus('live', true)
    }

    source.onmessage = function (e) {
      try {
        var data = JSON.parse(e.data)
        hydrate(data)
        if (data.membrane && data.membrane.tempo) {
          tempoMs = Math.max(MIN_POLL_MS, Math.min(MAX_POLL_MS, data.membrane.tempo * 1000))
        }
      } catch (err) { /* malformed frame, skip */ }
    }

    source.onerror = function () {
      source.close()
      setStatus('polling', false)
      fallbackPoll()
    }
  }

  // -- Polling fallback --
  function fallbackPoll() {
    function poll() {
      var xhr = new XMLHttpRequest()
      xhr.open('GET', MEMBRANE_ORIGIN + '/api/snapshot', true)
      xhr.timeout = 10000
      xhr.onload = function () {
        if (xhr.status === 200) {
          try {
            var data = JSON.parse(xhr.responseText)
            hydrate(data)
            setStatus('live', true)
            if (data.membrane && data.membrane.tempo) {
              tempoMs = Math.max(MIN_POLL_MS, Math.min(MAX_POLL_MS, data.membrane.tempo * 1000))
            }
          } catch (e) { setStatus('parse error', false) }
        } else {
          setStatus('http ' + xhr.status, false)
        }
      }
      xhr.onerror = function () { setStatus('offline', false) }
      xhr.ontimeout = function () { setStatus('timeout', false) }
      xhr.send()
    }

    poll()
    setInterval(poll, tempoMs)
  }

  // -- Inject minimal CSS for pulse effects --
  function injectStyles() {
    var style = document.createElement('style')
    style.textContent =
      /* Pulse glow on updated values */
      '.jelly-pulsed{' +
        'animation:jelly-glow ' + PULSE_GLOW_MS + 'ms ease-out;' +
      '}' +
      '@keyframes jelly-glow{' +
        '0%{color:#60a5fa;text-shadow:0 0 8px rgba(96,165,250,0.6)}' +
        '100%{color:inherit;text-shadow:none}' +
      '}' +

      /* Pulse bar */
      '.membrane-pulse{' +
        'position:relative;' +
        'border-top:1px solid rgba(96,165,250,0.15);' +
        'background:rgba(15,23,42,0.85);' +
        'backdrop-filter:blur(8px);' +
        'padding:0.5rem 1rem;' +
        'font-size:0.75rem;' +
        'color:#94a3b8;' +
        'z-index:100;' +
      '}' +
      '.pulse-inner{' +
        'max-width:72rem;' +
        'margin:0 auto;' +
        'display:flex;' +
        'align-items:center;' +
        'gap:1rem;' +
        'flex-wrap:wrap;' +
      '}' +

      /* Heartbeat dot */
      '.pulse-dot{' +
        'width:8px;height:8px;' +
        'border-radius:50%;' +
        'background:#475569;' +
        'flex-shrink:0;' +
        'transition:background 0.3s;' +
      '}' +
      '.pulse-alive .pulse-dot{background:#34d399}' +
      '.pulse-dead .pulse-dot{background:#ef4444}' +
      '.pulse-dot-beat{' +
        'animation:dot-beat 0.6s ease-out;' +
      '}' +
      '@keyframes dot-beat{' +
        '0%{transform:scale(1.8);box-shadow:0 0 12px rgba(52,211,153,0.5)}' +
        '100%{transform:scale(1);box-shadow:none}' +
      '}' +

      /* Status label */
      '.pulse-status{' +
        'font-family:monospace;' +
        'font-size:0.65rem;' +
        'text-transform:uppercase;' +
        'letter-spacing:0.05em;' +
        'opacity:0.7;' +
        'min-width:4em;' +
      '}' +

      /* Vital items */
      '.pulse-vitals{' +
        'display:flex;' +
        'gap:1.25rem;' +
        'flex-wrap:wrap;' +
      '}' +
      '.pulse-vital{' +
        'display:flex;' +
        'align-items:baseline;' +
        'gap:0.3rem;' +
      '}' +
      '.pulse-val{' +
        'font-family:monospace;' +
        'font-weight:600;' +
        'color:#e2e8f0;' +
        'font-size:0.8rem;' +
      '}' +
      '.pulse-label{' +
        'font-size:0.65rem;' +
        'opacity:0.6;' +
        'text-transform:uppercase;' +
        'letter-spacing:0.04em;' +
      '}' +

      /* Light theme */
      '[data-theme="light"] .membrane-pulse{' +
        'background:rgba(248,250,252,0.9);' +
        'border-top-color:rgba(30,58,95,0.15);' +
      '}' +
      '[data-theme="light"] .pulse-val{color:#1e293b}' +
      '[data-theme="light"] .pulse-label{color:#64748b}' +
      '[data-theme="light"] .pulse-status{color:#64748b}' +
      '[data-theme="light"] .jelly-pulsed{' +
        'animation:jelly-glow-light ' + PULSE_GLOW_MS + 'ms ease-out;' +
      '}' +
      '@keyframes jelly-glow-light{' +
        '0%{color:#2563eb;text-shadow:0 0 8px rgba(37,99,235,0.4)}' +
        '100%{color:inherit;text-shadow:none}' +
      '}' +

      /* Mobile: tighter layout */
      '@media(max-width:640px){' +
        '.membrane-pulse{padding:0.4rem 0.75rem}' +
        '.pulse-vitals{gap:0.75rem}' +
        '.pulse-val{font-size:0.7rem}' +
      '}'

    document.head.appendChild(style)
  }

  // -- Init --
  function init() {
    injectStyles()
    createPulseBar()
    connectSSE()
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init)
  } else {
    init()
  }
})()
