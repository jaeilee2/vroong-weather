export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');

  const { nx, ny } = req.query;
  if (!nx || !ny) return res.status(400).json({ error: 'nx, ny 필요' });

  const KMA_KEY = process.env.KMA_KEY;
  const now = new Date(Date.now() - 10 * 60 * 1000);
  const pad = n => String(n).padStart(2, '0');
  const base_date = `${now.getFullYear()}${pad(now.getMonth()+1)}${pad(now.getDate())}`;
  const m = Math.floor(now.getMinutes() / 10) * 10;
  const base_time = `${pad(now.getHours())}${pad(m)}`;

  const params = new URLSearchParams({
    serviceKey: KMA_KEY,
    pageNo: '1', numOfRows: '1000', dataType: 'JSON',
    base_date, base_time, nx, ny,
  });

  try {
    const apiRes = await fetch(
      `https://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getUltraSrtNcst?${params}`
    );
    const data = await apiRes.json();
    res.status(200).json(data);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
