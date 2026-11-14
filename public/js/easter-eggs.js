/* 博客彩蛋合集：点击粒子 / 控制台彩蛋 / 建站天数徽章 / 季节特效 / 光标光晕 / Konami
   由 Notion Config 的 GLOBAL_JS 动态加载，不参与 React 渲染，失败也不影响主站 */
(function () {
  if (window.__pubEasterEggs) return
  window.__pubEasterEggs = true
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches
  var finePointer = window.matchMedia && window.matchMedia('(pointer: fine)').matches
  var SINCE = new Date('2024-10-28T00:00:00+08:00')

  var css = ''
  css += '.eg-p{position:fixed;pointer-events:none;z-index:9997;line-height:1;animation:eg-fly .72s cubic-bezier(.2,.7,.3,1) forwards;will-change:transform,opacity}'
  css += '@keyframes eg-fly{to{transform:translate(var(--dx),var(--dy)) scale(.25) rotate(90deg);opacity:0}}'
  css += '.eg-badge{position:fixed;left:12px;bottom:12px;z-index:60;padding:3px 9px;border-radius:999px;font-size:11px;line-height:1.7;color:#9ca3af;background:rgba(17,24,39,.42);backdrop-filter:blur(6px);border:1px solid rgba(255,255,255,.07);opacity:.4;transition:opacity .25s;user-select:none;font-variant-numeric:tabular-nums;pointer-events:auto}'
  css += '.eg-badge:hover{opacity:1}'
  css += '.eg-badge b{color:#a5b4fc;font-weight:600}'
  css += '.eg-fx{position:fixed;inset:0;pointer-events:none;z-index:9996}'
  css += '.eg-glow{position:fixed;left:0;top:0;width:340px;height:340px;margin:-170px 0 0 -170px;border-radius:50%;pointer-events:none;z-index:1;opacity:.5;background:radial-gradient(circle,rgba(129,140,248,.28),rgba(129,140,248,.06) 45%,transparent 70%);transition:opacity .3s;will-change:transform}'
  css += 'html.eg-konami{animation:eg-shake .42s ease-in-out 7;filter:hue-rotate(-140deg) saturate(1.3)}'
  css += '@keyframes eg-shake{0%,100%{transform:translate(0,0)}25%{transform:translate(-3px,2px) rotate(-.25deg)}75%{transform:translate(3px,-2px) rotate(.25deg)}}'
  var style = document.createElement('style')
  style.setAttribute('data-eg', '1')
  style.textContent = css
  document.head.appendChild(style)

  /* ---------- 1. 控制台彩蛋 ---------- */
  try {
    console.log('%c Publieople%c\'s Blog ', 'background:#0f172a;color:#fff;padding:5px 7px;border-radius:6px 0 0 6px;font-weight:600', 'background:#6366f1;color:#fff;padding:5px 7px;border-radius:0 6px 6px 0;font-weight:600')
    console.log('%c为人民服务。你打开了开发者工具，那我们大概是同一类人。', 'color:#8b93a7;font-size:12px')
    console.log('%c 试试 ↑ ↑ ↓ ↓ ← → ← → B A', 'color:#a5b4fc;font-size:12px')
  } catch (e) {}

  /* ---------- 2. 点击粒子 ---------- */
  var palette = ['#f472b6', '#fbbf24', '#5eead4', '#a5b4fc', '#fca5a5']
  function spawn(x, y) {
    for (var i = 0; i < 7; i++) {
      var p = document.createElement('span')
      p.className = 'eg-p'
      p.textContent = i % 3 === 0 ? '✦' : '•'
      var a = Math.random() * Math.PI * 2
      var d = 24 + Math.random() * 50
      p.style.left = x + 'px'
      p.style.top = y + 'px'
      p.style.color = palette[i % palette.length]
      p.style.fontSize = 8 + Math.random() * 9 + 'px'
      p.style.setProperty('--dx', Math.cos(a) * d + 'px')
      p.style.setProperty('--dy', Math.sin(a) * d + 'px')
      document.body.appendChild(p)
      ;(function (node) { setTimeout(function () { node.remove() }, 760) })(p)
    }
  }
  document.addEventListener('click', function (e) {
    if (reduce) return
    var t = e.target
    if (t && t.closest && t.closest('a,button,input,textarea,select,label,[role="button"],[contenteditable]')) return
    spawn(e.clientX, e.clientY)
  }, { passive: true })

  /* ---------- 3. 建站天数徽章 ---------- */
  function uptimeDays() {
    return Math.max(1, Math.floor((Date.now() - SINCE.getTime()) / 86400000))
  }
  var badge = document.createElement('div')
  badge.className = 'eg-badge'
  badge.title = '建站于 2024-10-28'
  badge.innerHTML = '已运行 <b>' + uptimeDays() + '</b> 天'
  document.body.appendChild(badge)
  // 访客数（不蒜子，失败就只显示天数）
  try {
    var uv = document.createElement('span')
    uv.id = 'busuanzi_value_site_uv'
    uv.style.display = 'none'
    document.body.appendChild(uv)
    var bs = document.createElement('script')
    bs.src = 'https://busuanzi.ibruce.info/busuanzi/2.3/busuanzi.pure.mini.js'
    bs.async = true
    bs.onload = function () {
      setTimeout(function () {
        var n = parseInt((uv.textContent || '').replace(/[^0-9]/g, ''), 10)
        if (n > 0) badge.innerHTML += ' · 访客 <b>' + n.toLocaleString() + '</b>'
      }, 1500)
    }
    document.head.appendChild(bs)
  } catch (e) {}

  /* ---------- 4. 季节特效 ---------- */
  function season() {
    var now = new Date()
    var m = now.getMonth() + 1
    var d = now.getDate()
    if (m === 12 || (m === 1 && d <= 15)) return 'snow'
    if ((m === 3 && d >= 15) || (m === 4 && d <= 20)) return 'sakura'
    return null
  }
  var kind = reduce ? null : season()
  if (kind) {
    var canvas = document.createElement('canvas')
    canvas.className = 'eg-fx'
    document.body.appendChild(canvas)
    var ctx = canvas.getContext('2d')
    var W = 0, H = 0, flakes = []
    function resize() {
      W = canvas.width = window.innerWidth
      H = canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)
    var N = kind === 'snow' ? 70 : 45
    for (var i = 0; i < N; i++) {
      flakes.push({
        x: Math.random() * W,
        y: Math.random() * H,
        r: kind === 'snow' ? 1 + Math.random() * 2.4 : 3 + Math.random() * 4,
        vy: kind === 'snow' ? 0.35 + Math.random() * 0.7 : 0.5 + Math.random() * 0.6,
        vx: -0.25 + Math.random() * 0.5,
        a: 0.35 + Math.random() * 0.5,
        t: Math.random() * Math.PI * 2
      })
    }
    function draw() {
      ctx.clearRect(0, 0, W, H)
      for (var i = 0; i < flakes.length; i++) {
        var f = flakes[i]
        f.t += 0.01
        f.x += f.vx + Math.sin(f.t) * 0.4
        f.y += f.vy
        if (f.y > H + 8) { f.y = -8; f.x = Math.random() * W }
        if (f.x > W + 8) f.x = -8
        if (f.x < -8) f.x = W + 8
        if (kind === 'snow') {
          ctx.beginPath()
          ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2)
          ctx.fillStyle = 'rgba(255,255,255,' + f.a + ')'
          ctx.fill()
        } else {
          ctx.save()
          ctx.translate(f.x, f.y)
          ctx.rotate(f.t)
          ctx.beginPath()
          ctx.ellipse(0, 0, f.r, f.r * 0.55, 0, 0, Math.PI * 2)
          ctx.fillStyle = 'rgba(255,183,206,' + f.a + ')'
          ctx.fill()
          ctx.restore()
        }
      }
      raf = requestAnimationFrame(draw)
    }
    var raf = requestAnimationFrame(draw)
    document.addEventListener('visibilitychange', function () {
      if (document.hidden) { cancelAnimationFrame(raf) } else { raf = requestAnimationFrame(draw) }
    })
  }

  /* ---------- 5. 光标光晕 ---------- */
  if (finePointer && !reduce) {
    var glow = document.createElement('div')
    glow.className = 'eg-glow'
    document.body.appendChild(glow)
    var gx = window.innerWidth / 2, gy = window.innerHeight / 2, tx = gx, ty = gy
    window.addEventListener('mousemove', function (e) { tx = e.clientX; ty = e.clientY }, { passive: true })
    ;(function loop() {
      gx += (tx - gx) * 0.12
      gy += (ty - gy) * 0.12
      glow.style.transform = 'translate(' + gx + 'px,' + gy + 'px)'
      requestAnimationFrame(loop)
    })()
  }

  /* ---------- 6. Konami 彩蛋 ---------- */
  var seq = ['arrowup', 'arrowup', 'arrowdown', 'arrowdown', 'arrowleft', 'arrowright', 'arrowleft', 'arrowright', 'b', 'a']
  var idx = 0
  function party() {
    document.documentElement.classList.add('eg-konami')
    for (var i = 0; i < 36; i++) {
      ;(function (k) {
        setTimeout(function () {
          spawn(Math.random() * window.innerWidth, window.innerHeight * (0.25 + Math.random() * 0.5))
        }, k * 45)
      })(i)
    }
    setTimeout(function () { document.documentElement.classList.remove('eg-konami') }, 3200)
    try { console.log('%c 恭喜你找到了这个彩蛋 🎉', 'color:#f472b6;font-size:13px') } catch (e) {}
  }
  document.addEventListener('keydown', function (e) {
    var k = e.key.length === 1 ? e.key.toLowerCase() : e.key.toLowerCase()
    if (k === seq[idx]) {
      idx++
      if (idx === seq.length) { idx = 0; party() }
    } else {
      idx = k === seq[0] ? 1 : 0
    }
  })
})()
