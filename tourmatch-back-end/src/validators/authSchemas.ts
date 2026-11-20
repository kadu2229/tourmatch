import { z } from "zod";

const email = z
  .string({ error: "Informe o e-mail" })
  .trim()
  .toLowerCase()
  .pipe(z.email({ error: "E-mail inválido" }));

export const registerSchema = z.object({
  email,
  senha: z
    .string({ error: "Informe a senha" })
    .min(8, { error: "A senha deve ter no mínimo 8 caracteres" })
    .max(72, { error: "A senha deve ter no máximo 72 caracteres" }),
});

export const loginSchema = z.object({
  email,
  senha: z.string({ error: "Informe a senha" }).min(1, { error: "Informe a senha" }),
});
