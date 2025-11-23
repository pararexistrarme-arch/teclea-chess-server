export default async function handler(req, res) {
  const fen = req.query.fen;

  if (!fen) {
    return res.status(400).json({ ok: false, error: "No FEN provided" });
  }

  const url = "https://lichess.org/api/cloud-eval?fen=" + encodeURIComponent(fen);

  try {
    const lichess = await fetch(url);
    const data = await lichess.json();

    if (!data.pvs || !data.pvs[0] || !data.pvs[0].moves) {
      return res.status(500).json({ ok: false, error: "No move from Lichess" });
    }

    return res.json({
      ok: true,
      bestmove: data.pvs[0].moves.split(" ")[0]
    });

  } catch (err) {
    return res.status(500).json({ ok: false, error: "Lichess error" });
  }
}
