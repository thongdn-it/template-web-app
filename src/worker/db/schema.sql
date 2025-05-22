CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,                      
  email TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL DEFAULT '',               
  password_hash TEXT,              
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  is_verified BOOLEAN NOT NULL DEFAULT FALSE                         
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);