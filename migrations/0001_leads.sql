-- Almacén de leads del sitio. Un solo formulario cubre los tres tipos de
-- interés (usuario / proveedor / inversión-prensa); `interes` guarda el
-- arreglo elegido como JSON, así se puede consultar qué hay más demanda.

CREATE TABLE IF NOT EXISTS leads (
  id          TEXT PRIMARY KEY,
  email       TEXT NOT NULL,
  nombre      TEXT NOT NULL,
  ciudad      TEXT,
  interes     TEXT NOT NULL,     -- JSON: ["usuario","proveedor","inversion"]
  mensaje     TEXT,
  fuente      TEXT DEFAULT 'formulario',
  utm_source  TEXT,
  utm_medium  TEXT,
  utm_campaign TEXT,
  estado      TEXT NOT NULL DEFAULT 'nuevo',   -- nuevo | contactado | activo | cerrado
  creado_en   TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_leads_email ON leads(email);
CREATE INDEX IF NOT EXISTS idx_leads_creado ON leads(creado_en DESC);
CREATE INDEX IF NOT EXISTS idx_leads_estado ON leads(estado);

CREATE TABLE IF NOT EXISTS events (
  id        TEXT PRIMARY KEY,
  lead_id   TEXT REFERENCES leads(id),
  tipo      TEXT NOT NULL,        -- form_submit | estado_cambiado | ...
  metadata  TEXT,                 -- JSON libre
  creado_en TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_events_lead ON events(lead_id, creado_en);
