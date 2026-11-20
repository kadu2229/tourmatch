import type { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import type { ZodType } from "zod";
import { env } from "../config/env";
import * as userModel from "../models/userModel";
import type { PublicUser } from "../models/userModel";
import { loginSchema, registerSchema } from "../validators/authSchemas";

const HASH_FALSO = bcrypt.hashSync("senha-falsa-para-igualar-o-tempo", 10);

function gerarToken(userId: string) {
  return jwt.sign({ sub: userId }, env.JWT_SECRET, { expiresIn: "7d" });
}

function validar<T>(schema: ZodType<T>, corpo: unknown, res: Response): T | null {
  const resultado = schema.safeParse(corpo ?? {});
  if (resultado.success) return resultado.data;

  res.status(400).json({
    erro: "Dados inválidos",
    detalhes: resultado.error.issues.map((issue) => ({
      campo: issue.path.join("."),
      mensagem: issue.message,
    })),
  });
  return null;
}

function violacaoDeUnicidade(erro: unknown) {
  return typeof erro === "object" && erro !== null && "code" in erro && erro.code === "23505";
}

export async function register(req: Request, res: Response) {
  const dados = validar(registerSchema, req.body, res);
  if (!dados) return;

  if (await userModel.findByEmail(dados.email)) {
    res.status(409).json({ erro: "E-mail já cadastrado" });
    return;
  }

  const hash = await bcrypt.hash(dados.senha, 10);

  let usuario: PublicUser;
  try {
    usuario = await userModel.create(dados.email, hash);
  } catch (erro) {
    if (violacaoDeUnicidade(erro)) {
      res.status(409).json({ erro: "E-mail já cadastrado" });
      return;
    }
    throw erro;
  }

  res.status(201).json({ token: gerarToken(usuario.id), usuario });
}

export async function login(req: Request, res: Response) {
  const dados = validar(loginSchema, req.body, res);
  if (!dados) return;

  const usuario = await userModel.findByEmail(dados.email);
  const senhaCorreta = await bcrypt.compare(dados.senha, usuario?.password_hash ?? HASH_FALSO);

  if (!usuario || !senhaCorreta) {
    res.status(401).json({ erro: "E-mail ou senha inválidos" });
    return;
  }

  res.json({
    token: gerarToken(usuario.id),
    usuario: { id: usuario.id, email: usuario.email, created_at: usuario.created_at },
  });
}

export async function me(_req: Request, res: Response) {
  const usuario = await userModel.findById(res.locals.userId);

  if (!usuario) {
    res.status(404).json({ erro: "Usuário não encontrado" });
    return;
  }

  res.json({ usuario });
}
