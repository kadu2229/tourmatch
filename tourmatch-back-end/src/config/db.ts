import "dotenv/config";
import { Pool } from "pg";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL não está definida no .env");
}

export const pool = new Pool({ connectionString });

pool.on("error", (erro) => {
  console.error("Erro inesperado no pool do banco:", erro.message);
});

export async function testConnection() {
  const client = await pool.connect();
  try {
    await client.query("SELECT 1");
  } finally {
    client.release();
  }
}