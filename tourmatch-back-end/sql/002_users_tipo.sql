ALTER TABLE users
  ADD COLUMN IF NOT EXISTS tipo TEXT NOT NULL DEFAULT 'turista'
  CHECK (tipo IN ('turista', 'guia'));
