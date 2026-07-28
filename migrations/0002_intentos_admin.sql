-- Freno de fuerza bruta para el acceso al panel /admin.
-- Sin esto, una contraseña se adivina probando sin límite.

CREATE TABLE IF NOT EXISTS intentos_admin (
  id        TEXT PRIMARY KEY,
  ip        TEXT NOT NULL,
  creado_en TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_intentos_ip ON intentos_admin(ip, creado_en);
