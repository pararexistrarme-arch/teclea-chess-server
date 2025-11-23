import fetch from "node-fetch";
import express from "express";

const app = express();
app.use(express.json());

// Endpoint principal
app.get("/move", async (req, res) => {
  const fen = req.query.fen;
  if (!fen) {
    return res.json({ ok: false, error: "No FEN recibido" });
  }

  try {
    const url =
      "https://lichess.org/api/cloud-eval?fen=" +
      encodeURIComponent(fen) +
      "&depth=18";

    const response = await fetch(url);
    const data = await response.json();

    const best = data?.pvs?.[0]?.moves?.split(" ")[0];

    if (!best) {
      return res.json({ ok: false, error: "Sin respuesta Lichess" });
    }

    res.json({ ok: true, bestmove: best });
  } catch (e) {
    res.json({ ok: false, error: "Error servidor: " + e.message });
  }
});

export default app;
