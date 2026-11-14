/**
 * B 站 UP 主数据（服务端缓存，避免浏览器直连 CORS 与风控）
 * 返回：昵称、头像、签名、粉丝数、投稿数、获赞数
 */
export default async function handler(req, res) {
  const mid = process.env.BILIBILI_MID || '324858924'
  res.setHeader('Cache-Control', 's-maxage=1800, stale-while-revalidate=86400')
  try {
    const r = await fetch(
      'https://api.bilibili.com/x/web-interface/card?mid=' + mid,
      {
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0 Safari/537.36',
          Referer: 'https://www.bilibili.com/'
        }
      }
    )
    const j = await r.json()
    if (!j || j.code !== 0 || !j.data) {
      return res.status(200).json({ ok: false, code: j && j.code })
    }
    const card = j.data.card || {}
    return res.status(200).json({
      ok: true,
      mid,
      name: card.name || '',
      face: card.face || '',
      sign: card.sign || '',
      follower: j.data.follower || 0,
      archive: j.data.archive_count || 0,
      like: j.data.like_num || 0,
      link: 'https://space.bilibili.com/' + mid
    })
  } catch (e) {
    return res.status(200).json({ ok: false, error: String(e && e.message) })
  }
}
