import { pool } from "./config/db";

pool
  .query("SELECT to_regclass('public.users') AS tabela, current_database() AS banco")
  .then(({ rows }) => console.log(rows[0]))
  .catch((erro) => console.error("Falha:", erro.message))
  .finally(() => pool.end());