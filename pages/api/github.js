/**
 * GitHub 贡献热力图数据（第三方公开接口，服务端取一次缓存 3 小时）
 */
export default async function handler(req, res) {
  const user = process.env.GITHUB_USER || 'publieople'
  res.setHeader('Cache-Control', 's-maxage=10800, stale-while-revalidate=86400')
  try {
    const r = await fetch(
      'https://github-contributions-api.jogruber.de/v4/' + user + '?y=last',
      { headers: { 'User-Agent': 'notionnext-blog' } }
    )
    const j = await r.json()
    const contributions = Array.isArray(j && j.contributions) ? j.contributions : []
    if (!contributions.length) {
      return res.status(200).json({ ok: false })
    }
    return res.status(200).json({
      ok: true,
      user,
      total: (j.total && (j.total.lastYear || Object.values(j.total)[0])) || 0,
      contributions,
      link: 'https://github.com/' + user
    })
  } catch (e) {
    return res.status(200).json({ ok: false, error: String(e && e.message) })
  }
}
