/**
 * LAMPOON — clown reflection on top, live ledger underneath.
 * Same numbers. Two perceptions. The joke is the data.
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */
;(function () {
  'use strict'

  var HUD = 'https://hud.primals.eco'
  var POLL_MS = 60000

  function fmt(n) {
    if (n == null || n === '') return '—'
    if (typeof n !== 'number') return String(n)
    return Math.round(n).toLocaleString('en-US')
  }

  function hours(min) {
    if (min == null) return '—'
    if (min >= 120) return Math.round(min / 60) + ' hours'
    return Math.round(min) + ' min'
  }

  function cityHits(geo, name) {
    var total = 0
    ;(geo || []).forEach(function (c) {
      ;(c.regions || []).forEach(function (r) {
        ;(r.cities || []).forEach(function (x) {
          if (x.city === name) total += x.requests || 0
        })
      })
    })
    return total
  }

  function get(url) {
    return fetch(url, { credentials: 'omit' }).then(function (r) {
      if (!r.ok) throw new Error(r.status + ' ' + url)
      return r.json()
    })
  }

  function getMaze() {
    var el = document.getElementById('curious-perception')
    var preferred = el && el.getAttribute('data-maze')
    var prefix = window.location.pathname.indexOf('/publicRecord') === 0 ? '/publicRecord' : ''
    var urls = [
      preferred,
      prefix + '/maze-honeypots.json',
      'https://defenddetroit.github.io/publicRecord/maze-honeypots.json',
      'https://detroit.primals.eco/maze-honeypots.json'
    ].filter(Boolean)

    var chain = Promise.reject(new Error('no maze url'))
    urls.forEach(function (u) {
      chain = chain.catch(function () { return get(u) })
    })
    return chain
  }

  function settle(p) {
    return p.then(
      function (v) { return { ok: true, v: v } },
      function () { return { ok: false, v: null } }
    )
  }

  function pick(obj, path, fallback) {
    var cur = obj
    var keys = path.split('.')
    for (var i = 0; i < keys.length; i++) {
      if (cur == null) return fallback
      cur = cur[keys[i]]
    }
    return cur == null ? fallback : cur
  }

  function paint(m) {
    var clown = document.getElementById('lampoon-clown')
    var rows = document.getElementById('lampoon-ledger-rows')
    var stamp = document.getElementById('lampoon-stamp')
    if (!clown || !rows) return

    var lines = [
      'A $1.5 trillion circus sent ' + fmt(m.meta) + ' clowns in leftover Chrome noses to a tent that costs twelve dollars a month.',
      'Dublin took ' + fmt(m.dublin) + ' curtain calls. Menlo Park sent ' + fmt(m.menlo) + '. The intern stayed home.',
      'They photocopied the license ' + fmt(m.license) + ' times. It is still the same license. It still says they owe source. Honk.',
      fmt(m.humans) + ' humans sat down without being assigned Shakespeare. Median sit: ' + hours(m.dwell) + '. That is a campfire, not engagement.',
      'AI crawlers this window: ' + fmt(m.ai) + '. Honest name-tags vs red noses. The membrane sorted them in a blink.',
      'Maze: ' + fmt(m.hot) + ' bananas of 49. After the colony comes, the banana walks. The QR does not. Their map is already a joke.'
    ]
    if (m.nextMix) {
      lines.push('Next mix: ' + m.nextMix + '. π hours. They have time to come home.')
    }

    clown.innerHTML = lines.map(function (t) {
      return '<p>' + t.replace(/</g, '') + '</p>'
    }).join('')

    var ledger = [
      ['Meta UA this window', m.meta, HUD + '/silicon-eye.json'],
      ['Dublin DC requests', m.dublin, HUD + '/dashboard.json'],
      ['Menlo Park', m.menlo, HUD + '/dashboard.json'],
      ['LICENSE / commit hits (top offender)', m.license, HUD + '/seo.json'],
      ['Humans (dashboard)', m.humans, HUD + '/dashboard.json'],
      ['Median dwell', hours(m.dwell), HUD + '/dashboard.json'],
      ['AI crawler hits this window', m.ai, HUD + '/silicon-eye.json'],
      ['Hot maze cells', m.hot + ' / 49', '/maze-honeypots.json']
    ]

    rows.innerHTML = ledger.map(function (row) {
      var shown = typeof row[1] === 'number' ? fmt(row[1]) : String(row[1])
      return '<tr><th scope="row">' + row[0] + '</th><td>' + shown + '</td><td><a href="' + row[2] + '">live</a></td></tr>'
    }).join('')

    if (stamp) {
      stamp.textContent = 'underneath: live feeds · ' + (m.utc || new Date().toISOString())
    }
  }

  function load() {
    return Promise.all([
      settle(get(HUD + '/dashboard.json')),
      settle(get(HUD + '/seo.json')),
      settle(get(HUD + '/silicon-eye.json')),
      settle(get(HUD + '/now.json')),
      settle(getMaze())
    ]).then(function (parts) {
      var dash = parts[0].ok ? parts[0].v : {}
      var seo = parts[1].ok ? parts[1].v : {}
      var eye = parts[2].ok ? parts[2].v : {}
      var now = parts[3].ok ? parts[3].v : {}
      var maze = parts[4].ok ? parts[4].v : {}

      var license = pick(seo, 'top_offenders.0.top_paths.commit', null)
      if (license == null) license = pick(dash, 'top_offenders.0.top_paths.commit', 421238)

      paint({
        meta: pick(eye, 'accumulator.ua_classes.meta', null),
        ai: pick(eye, 'accumulator.ua_classes.ai_crawler', null),
        dublin: cityHits(dash.geography || seo.geography, 'Dublin DC'),
        menlo: cityHits(dash.geography || seo.geography, 'Menlo Park'),
        license: license,
        humans: dash.human_ips || pick(now, 'flow.human', null),
        dwell: pick(dash, 'membrane_delta.dwell.median_min', null),
        hot: maze.hot_count != null ? maze.hot_count : 7,
        nextMix: maze.next_mix ? String(maze.next_mix).replace(/\.\d+/, '').replace('T', ' ').replace('+00:00', 'Z') : '',
        utc: dash.utc || pick(now, 'instant.utc', '') || pick(eye, 'timestamp', '')
      })
    })
  }

  function init() {
    if (!document.getElementById('curious-perception')) return
    load()
    setInterval(load, POLL_MS)
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init)
  } else {
    init()
  }
})()
