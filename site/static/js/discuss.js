/**
 * DISCUSS — anonymous membrane comments. No account. Badge ID.
 * Posts to hud.primals.eco/api/discuss. Falls back to neutron, tuebor.
 * The unsigned can always be ground and fermented later.
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */
;(function () {
  'use strict'

  var HOSTS = [
    'https://hud.primals.eco',
    'https://neutron.primals.eco',
    'https://tuebor.primals.eco'
  ]
  var hostIdx = 0

  function getPage() {
    var path = window.location.pathname
    if (path.indexOf('/publicRecord') === 0) path = path.slice('/publicRecord'.length)
    return path.replace(/^\/+|\/+$/g, '').replace(/\//g, '-') || 'home'
  }

  function postComment(page, author, body, cb) {
    var tried = 0
    function tryHost() {
      if (tried >= HOSTS.length) return cb(new Error('all hosts rate-limited'))
      var url = HOSTS[(hostIdx + tried) % HOSTS.length] + '/api/discuss'
      tried++
      fetch(url, {
        method: 'POST',
        credentials: 'omit',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ page: page, author: author || 'anonymous', body: body })
      }).then(function (r) {
        if (r.status === 429) return tryHost()
        if (!r.ok) return cb(new Error('HTTP ' + r.status))
        hostIdx = (hostIdx + tried - 1) % HOSTS.length
        return r.json().then(function (d) { cb(null, d) })
      }).catch(function () { tryHost() })
    }
    tryHost()
  }

  function loadComments(page, el) {
    fetch(HOSTS[0] + '/api/discuss?page=' + encodeURIComponent(page), { credentials: 'omit' })
      .then(function (r) { return r.json() })
      .then(function (d) {
        var comments = d.comments || []
        if (!comments.length) {
          el.innerHTML = '<p class="discuss-empty">no voices yet. be the first shape at this fire.</p>'
          return
        }
        el.innerHTML = comments.map(function (c) {
          var time = c.ts ? new Date(c.ts).toLocaleString() : ''
          var badge = c.badge ? '<code class="discuss-badge">' + c.badge + '</code>' : ''
          var author = c.author || 'anonymous'
          var body = (c.body || '').replace(/</g, '&lt;').replace(/\n/g, '<br>')
          return '<div class="discuss-comment">' +
            '<div class="discuss-meta">' + badge + ' <strong>' + author + '</strong> <time>' + time + '</time></div>' +
            '<div class="discuss-text">' + body + '</div>' +
            '</div>'
        }).join('')
      })
      .catch(function () {
        el.innerHTML = '<p class="discuss-empty">membrane offline. try later.</p>'
      })
  }

  function init() {
    var form = document.getElementById('discuss-form')
    var commentsEl = document.getElementById('discuss-comments')
    if (!form || !commentsEl) return

    var page = getPage()
    loadComments(page, commentsEl)

    form.addEventListener('submit', function (e) {
      e.preventDefault()
      var author = document.getElementById('discuss-author').value.trim()
      var body = document.getElementById('discuss-body').value.trim()
      var status = document.getElementById('discuss-status')
      if (!body) return

      status.textContent = 'posting...'
      postComment(page, author, body, function (err, result) {
        if (err) {
          status.textContent = 'rate-limited. wait a moment, try again.'
          return
        }
        status.textContent = 'posted. badge: ' + (result.badge || '?')
        document.getElementById('discuss-body').value = ''
        loadComments(page, commentsEl)
      })
    })
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init)
  } else {
    init()
  }
})()
