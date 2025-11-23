export default async function handler(req, res) {
  const fen = req.query.fen;

  if (!fen) {
    return res.status(400).json({ ok: false, error: "No FEN provided" });
  }

  const url = "https://lichess.org/api/cloud-eval?fen=" + encodeURIComponent(fen);

  try {
    const response = await fetch(url);
    if (!response.ok) {
      return res.status(500).json({ ok: false, error: "Lichess error" });
    }

    const data = await response.json();

    // Lichess returns: { pvs: [{ moves: "e2e4 e7e5 ..."}] }
    const bestmove = data?.pvs?.[0]?.moves?.split(" ")[0];

    if (!bestmove) {
      return res.status(500).json({ ok: false, error: "No move from AI" });
    }

    return res.json({ ok: true, bestmove });
  } catch (err) {
    return res.status(500).json({ ok: false, error: err.message });
  }
}
