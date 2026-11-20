import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/env";

export function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const cabecalho = req.headers.authorization;

  if (!cabecalho?.startsWith("Bearer ")) {
    res.status(401).json({ erro: "Token não informado" });
    return;
  }

  try {
    const payload = jwt.verify(cabecalho.slice(7), env.JWT_SECRET);

    if (typeof payload === "string" || typeof payload.sub !== "string") {
      res.status(401).json({ erro: "Token inválido" });
      return;
    }

    res.locals.userId = payload.sub;
    next();
  } catch {
    res.status(401).json({ erro: "Token inválido ou expirado" });
  }
}
