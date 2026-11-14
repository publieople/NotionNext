import { useEffect, useState } from 'react'
import Card from './Card'

const LEVELS = [
  'rgba(148,163,184,.16)',
  'rgba(52,211,153,.35)',
  'rgba(52,211,153,.55)',
  'rgba(52,211,153,.75)',
  'rgba(52,211,153,.95)'
]

const short = n => (n >= 10000 ? (n / 10000).toFixed(1) + 'w' : String(n))

/**
 * 右侧栏个人卡片：B 站数据 + GitHub 贡献热力图
 * 数据走 /api/bili 与 /api/github（服务端缓存），失败则不渲染
 */
export default function WidgetPersonal() {
  const [bili, setBili] = useState(null)
  const [gh, setGh] = useState(null)

  useEffect(() => {
    let alive = true
    fetch('/api/bili')
      .then(r => r.json())
      .then(d => {
        if (alive && d && d.ok) setBili(d)
      })
      .catch(() => {})
    fetch('/api/github')
      .then(r => r.json())
      .then(d => {
        if (alive && d && d.ok) setGh(d)
      })
      .catch(() => {})
    return () => {
      alive = false
    }
  }, [])

  if (!bili && !gh) return <></>

  // 把连续日期排成 7 行（周日→周六）的列
  let cells = []
  if (gh) {
    const days = gh.contributions
    const pad = new Date(days[0].date + 'T00:00:00').getDay()
    for (let i = 0; i < pad; i++) cells.push(null)
    days.forEach(d => cells.push(d))
    while (cells.length % 7 !== 0) cells.push(null)
  }

  return (
    <>
      {bili && (
        <Card>
          <div className='flex items-center gap-3'>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={bili.face}
              alt={bili.name}
              referrerPolicy='no-referrer'
              className='w-11 h-11 rounded-full object-cover border border-white/10'
            />
            <div className='min-w-0'>
              <a
                href={bili.link}
                target='_blank'
                rel='noreferrer'
                className='block font-semibold truncate hover:text-indigo-500 duration-100'>
                {bili.name}
              </a>
              <div className='text-xs opacity-60 truncate'>
                B 站 UP 主
              </div>
            </div>
          </div>
          <div className='mt-3 grid grid-cols-3 gap-1 text-center text-xs'>
            <div>
              <div className='text-base font-semibold'>{short(bili.follower)}</div>
              <div className='opacity-50'>粉丝</div>
            </div>
            <div>
              <div className='text-base font-semibold'>{short(bili.archive)}</div>
              <div className='opacity-50'>投稿</div>
            </div>
            <div>
              <div className='text-base font-semibold'>{short(bili.like)}</div>
              <div className='opacity-50'>获赞</div>
            </div>
          </div>
          {bili.sign && (
            <div className='mt-2 text-xs opacity-50 line-clamp-2'>{bili.sign}</div>
          )}
        </Card>
      )}

      {gh && (
        <Card>
          <div className='flex items-baseline justify-between'>
            <a
              href={gh.link}
              target='_blank'
              rel='noreferrer'
              className='font-semibold hover:text-indigo-500 duration-100'>
              GitHub
            </a>
            <span className='text-xs opacity-50'>近一年 {gh.total} 次提交</span>
          </div>
          <div className='mt-3'>
            <div
              className='grid'
              style={{
                gridAutoFlow: 'column',
                gridTemplateRows: 'repeat(7, auto)',
                gridAutoColumns: 'minmax(0, 1fr)',
                gap: 2
              }}>
              {cells.map((c, i) => (
                <div
                  key={i}
                  title={c ? c.date + '：' + c.count + ' 次' : ''}
                  style={{
                    aspectRatio: '1 / 1',
                    borderRadius: 1.5,
                    background: c ? LEVELS[Math.min(c.level || 0, 4)] : 'transparent'
                  }}
                />
              ))}
            </div>
          </div>
          <div className='mt-2 text-[11px] opacity-40'>
            @{gh.user}
          </div>
        </Card>
      )}
    </>
  )
}
