export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  const fen = req.query.fen;

  if (!fen) {
    return res.status(400).json({ ok: false, error: "No FEN recibido" });
  }

  try {
    const lichessUrl =
      "https://lichess.org/api/cloud-eval?fen=" + encodeURIComponent(fen);

    const response = await fetch(lichessUrl);
    const data = await response.json();

    if (!data.pvs || !data.pvs[0] || !data.pvs[0].moves) {
      return res
        .status(500)
        .json({ ok: false, error: "Sin respuesta válida de Lichess" });
    }

    const bestmove = data.pvs[0].moves.split(" ")[0];

    return res.json({ ok: true, bestmove });
  } catch (err) {
    return res.status(500).json({
      ok: false,
      error: "Error accediendo a Lichess: " + err.toString(),
    });
  }
}
