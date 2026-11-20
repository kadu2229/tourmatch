import { pool } from "../config/db";

export type User = {
  id: string;
  email: string;
  password_hash: string;
  created_at: Date;
};

export type PublicUser = Omit<User, "password_hash">;

export async function findByEmail(email: string): Promise<User | null> {
  const { rows } = await pool.query<User>(
    "SELECT id, email, password_hash, created_at FROM users WHERE email = $1",
    [email]
  );
  return rows[0] ?? null;
}

export async function findById(id: string): Promise<PublicUser | null> {
  const { rows } = await pool.query<PublicUser>(
    "SELECT id, email, created_at FROM users WHERE id = $1",
    [id]
  );
  return rows[0] ?? null;
}

export async function create(email: string, passwordHash: string): Promise<PublicUser> {
  const { rows } = await pool.query<PublicUser>(
    "INSERT INTO users (email, password_hash) VALUES ($1, $2) RETURNING id, email, created_at",
    [email, passwordHash]
  );
  return rows[0];
}
