import "dotenv/config";

function obrigatoria(nome: string): string {
  const valor = process.env[nome];
  if (!valor) {
    throw new Error(`${nome} não está definida no .env`);
  }
  return valor;
}

export const env = {
  JWT_SECRET: obrigatoria("JWT_SECRET"),
  PORT: Number(process.env.PORT) || 3001,
  CORS_ORIGIN: (process.env.CORS_ORIGIN ?? "http://localhost:3000")
    .split(",")
    .map((origem) => origem.trim()),
};
