import { pool, testConnection } from "./config/db";

testConnection()
  .then(() => console.log("Conectado ao banco"))
  .catch((erro) => console.error("Falha ao conectar:", erro.message))
  .finally(() => pool.end());