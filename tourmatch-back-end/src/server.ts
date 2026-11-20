import { env } from "./config/env";
import { pool, testConnection } from "./config/db";
import app from "./app";

async function iniciar() {
  try {
    await testConnection();
  } catch (erro) {
    console.error("Falha ao conectar ao banco:", erro instanceof Error ? erro.message : erro);
    await pool.end();
    process.exit(1);
  }

  app.listen(env.PORT, () => {
    console.log(`API rodando na porta ${env.PORT}`);
  });
}

iniciar();