import cors from "cors";
import express from "express";
import type { NextFunction, Request, Response } from "express";
import { env } from "./config/env";
import authRoutes from "./routes/authRoutes";

const app = express();

app.use(cors({ origin: env.CORS_ORIGIN }));
app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use("/auth", authRoutes);

app.use((_req, res) => {
  res.status(404).json({ erro: "Rota não encontrada" });
});

app.use((erro: unknown, _req: Request, res: Response, _next: NextFunction) => {
  if (typeof erro === "object" && erro !== null && "type" in erro && erro.type === "entity.parse.failed") {
    res.status(400).json({ erro: "JSON inválido" });
    return;
  }

  console.error(erro);
  res.status(500).json({ erro: "Erro interno do servidor" });
});

export default app;