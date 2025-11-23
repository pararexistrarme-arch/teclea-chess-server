import { Chess } from "chess.js";

export default async function handler(req, res) {
  const { fen, depth = 2 } = req.query;

  if (!fen) {
    return res.status(400).json({ ok: false, error: "FEN missing" });
  }

  try {
    const apiUrl = "https://lichess.org/api/cloud-eval?fen=" + encodeURIComponent(fen);

    const response = await fetch(apiUrl);

    if (!response.ok) {
      return res.status(500).json({ ok: false, error: "Lichess no responde" });
    }

    const data = await response.json();

    if (!data || !data.pvs || !data.pvs[0] || !data.pvs[0].moves) {
      return res.status(500).json({ ok: false, error: "Sin movimiento de IA" });
    }

    const bestmove = data.pvs[0].moves.split(" ")[0];

    return res.status(200).json({
      ok: true,
      bestmove
    });

  } catch (e) {
    return res.status(500).json({ ok: false, error: e.toString() });
  }
}
