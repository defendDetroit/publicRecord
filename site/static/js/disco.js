/**
 * DISCO — the dance floor widget. Live epitope passages, spinning braids.
 * A little disco ball on the dance rink.
 *
 * Hydrates from hud.primals.eco/dashboard.json + /campfire.json
 * Shows who is dancing, where, and the passages between epitopes.
 * Observer doesn't get this until they blink.
 *
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */
;(function () {
  'use strict'

  var HUD = 'https://hud.primals.eco'
  var POLL_MS = 30000
  var MOVES = ['chassé', 'pivot', 'promenade', 'twirl', 'sway', 'dip', 'glide', 'shimmer', 'spin', 'waltz']

  function get(url) {
    return fetch(url, { credentials: 'omit' }).then(function (r) {
      if (!r.ok) throw new Error(r.status)
      return r.json()
    })
  }

  function settle(p) {
    return p.then(
      function (v) { return { ok: true, v: v } },
      function () { return { ok: false, v: null } }
    )
  }

  function pick(o, path, fb) {
    var cur = o
    var keys = path.split('.')
    for (var i = 0; i < keys.length; i++) {
      if (cur == null) return fb
      cur = cur[keys[i]]
    }
    return cur == null ? fb : cur
  }

  function fmt(n) {
    if (n == null) return '—'
    if (typeof n === 'number') return n.toLocaleString('en-US')
    return String(n)
  }

  function hue(epitope) {
    var map = {
      TOPOLOGY: 200, INVESTIGATION: 30, MEMBRANE: 160,
      OTHER: 280, IMMUNE: 120, SCIENCE: 60, SIGNAL: 320,
      visitor: 50, reader: 100, coder: 200, observer: 300, investigator: 30
    }
    return map[epitope] || 0
  }

  function paint(data) {
    var el = document.getElementById('disco-floor')
    if (!el) return

    var passages = data.passages || []
    var epitopes = data.epitopes || {}
    var totalDancers = data.totalDancers || 0
    var braids = data.braids || []
    var stories = data.stories || []

    var ballEl = el.querySelector('.disco-ball')
    if (ballEl) {
      ballEl.style.animationDuration = (totalDancers > 0 ? Math.max(2, 20 - totalDancers) : 0) + 's'
    }

    var countEl = el.querySelector('.disco-count')
    if (countEl) countEl.textContent = fmt(totalDancers) + ' on the floor'

    var passEl = el.querySelector('.disco-passages')
    if (passEl && passages.length > 0) {
      passEl.innerHTML = passages.map(function (p) {
        var move = p.move || MOVES[Math.floor(Math.random() * MOVES.length)]
        return '<div class="disco-passage">' +
          '<span class="dp-from" style="color:hsl(' + hue(p.from) + ',60%,65%)">' + p.from + '</span>' +
          '<span class="dp-arrow"> →' + fmt(p.humans) + '→ </span>' +
          '<span class="dp-to" style="color:hsl(' + hue(p.to) + ',60%,65%)">' + p.to + '</span>' +
          '<span class="dp-move">' + move + '</span>' +
          '</div>'
      }).join('')
    }

    var epiEl = el.querySelector('.disco-epitopes')
    if (epiEl) {
      var keys = Object.keys(epitopes)
      epiEl.innerHTML = keys.map(function (k) {
        var v = epitopes[k]
        var isCount = typeof v === 'object' ? (v.count || v.is || 0) : v
        return '<span class="disco-epi" style="border-color:hsl(' + hue(k) + ',50%,45%)">' +
          '<strong>' + k + '</strong> ' + fmt(isCount) +
          '</span>'
      }).join('')
    }

    var braidEl = el.querySelector('.disco-braids')
    if (braidEl && braids.length > 0) {
      braidEl.innerHTML = braids.slice(0, 5).map(function (b) {
        var spinning = b.spinning ? ' spinning' : ''
        return '<span class="disco-braid' + spinning + '">' +
          b.from + ' ↔ ' + b.to +
          ' <em>' + fmt(b.humans_total) + '</em>' +
          (b.spinning ? ' ♺' : '') +
          '</span>'
      }).join('')
    }

    var storyEl = el.querySelector('.disco-story')
    if (storyEl && stories.length > 0) {
      var s = stories[Math.floor(Date.now() / 60000) % stories.length]
      var text = typeof s === 'string' ? s : (s.story || s.text || '')
      storyEl.textContent = text
    }
  }

  function load() {
    return Promise.all([
      settle(get(HUD + '/dashboard.json')),
      settle(get(HUD + '/campfire.json')),
      settle(get(HUD + '/braid.json')),
      settle(get(HUD + '/dialogue.json'))
    ]).then(function (parts) {
      var dash = parts[0].ok ? parts[0].v : {}
      var camp = parts[1].ok ? parts[1].v : {}
      var braid = parts[2].ok ? parts[2].v : {}
      var dialog = parts[3].ok ? parts[3].v : {}

      var epitopeData = {}
      if (dash.collision_level2) {
        epitopeData = dash.collision_level2
      }
      if (dash.tense_distribution) {
        epitopeData.is = dash.tense_distribution.is
        epitopeData.was = dash.tense_distribution.was
        epitopeData.will_be = dash.tense_distribution.will_be
      }
      if (dash.anderson_selectivity && dash.anderson_selectivity.modes) {
        dash.anderson_selectivity.modes.forEach(function (m) {
          epitopeData[m.class] = m.count
        })
      }

      var passages = []
      if (dialog && dialog.dance && dialog.dance.passages) {
        passages = dialog.dance.passages
      }
      if (!passages.length && braid && Array.isArray(braid.braids || braid)) {
        var bs = braid.braids || braid
        passages = bs.filter(function (b) { return b.humans_total > 0 }).map(function (b) {
          return { from: b.from, to: b.to, humans: b.humans_total, move: b.spinning ? 'spin' : 'step' }
        })
      }

      var stories = (camp.stories || []).map(function (s) { return s.story || '' }).filter(Boolean)

      var braids = []
      if (Array.isArray(braid.braids || braid)) {
        braids = braid.braids || braid
      }

      paint({
        totalDancers: dash.human_ips || pick(dash, 'collision_level2.genuine', 0),
        epitopes: epitopeData,
        passages: passages,
        braids: braids,
        stories: stories
      })
    })
  }

  function init() {
    if (!document.getElementById('disco-floor')) return
    load()
    setInterval(load, POLL_MS)
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init)
  } else {
    init()
  }
})()
