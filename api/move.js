export default async function handler(req, res) {
  try {
    const { fen } = req.query;

    if (!fen) {
      return res.status(400).json({ ok: false, error: "Missing FEN" });
    }

    const url = `https://ajedrez.ceipvalleinclan.org/move.php?fen=${encodeURIComponent(fen)}`;

    const response = await fetch(url);
    const data = await response.json();

    if (!data.ok || !data.bestmove) {
      return res.status(500).json({ ok: false, error: "Engine error", raw: data });
    }

    return res.status(200).json({ ok: true, bestmove: data.bestmove });
  } catch (err) {
    return res.status(500).json({ ok: false, error: err.message });
  }
}
