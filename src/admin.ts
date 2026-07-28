/**
 * MicoPay — Panel privado `/admin`.
 *
 * Mismo patrón de seguridad que motelabs (ver su PANEL.md):
 *  - Fallar cerrado: sin credencial válida, `manejarAdmin` devuelve `null`
 *    y el Worker cae al 404 real del sitio — nunca un 403 propio, que ya
 *    confirmaría que la ruta existe.
 *  - Sesión por contraseña: cookie firmada con HMAC derivado de la
 *    contraseña, sin estado en el servidor. Cambiar la contraseña cierra
 *    todas las sesiones abiertas.
 *  - Comparación en tiempo constante, freno de fuerza bruta por IP.
 *  - Todo dato de D1 se escapa al renderizar.
 */

import type { Env } from './worker';

const COOKIE = 'mp_sesion';
const DURACION_MS = 12 * 60 * 60 * 1000;
const MAX_INTENTOS = 8;
const VENTANA_MIN = 15;

function igualSeguro(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let dif = 0;
  for (let i = 0; i < a.length; i++) dif |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return dif === 0;
}

async function claveSesion(password: string): Promise<CryptoKey> {
  const material = await crypto.subtle.digest(
    'SHA-256',
    new TextEncoder().encode(password + '|sesion-panel-micopay')
  );
  return crypto.subtle.importKey('raw', material, { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
}

async function firmar(valor: string, password: string): Promise<string> {
  const mac = await crypto.subtle.sign('HMAC', await claveSesion(password), new TextEncoder().encode(valor));
  return [...new Uint8Array(mac)].map((b) => b.toString(16).padStart(2, '0')).join('');
}

function leerCookie(request: Request, nombre: string): string | null {
  const crudo = request.headers.get('Cookie');
  if (!crudo) return null;
  for (const parte of crudo.split(';')) {
    const [k, ...v] = parte.trim().split('=');
    if (k === nombre) return v.join('=');
  }
  return null;
}

async function sesionValida(request: Request, env: Env): Promise<boolean> {
  if (!env.ADMIN_PASSWORD) return false;
  const cookie = leerCookie(request, COOKIE);
  if (!cookie) return false;

  const corte = cookie.lastIndexOf('.');
  if (corte < 1) return false;
  const vence = cookie.slice(0, corte);
  const firma = cookie.slice(corte + 1);

  const venceEn = Number(vence);
  if (!Number.isFinite(venceEn) || venceEn <= Date.now()) return false;

  try {
    return igualSeguro(await firmar(vence, env.ADMIN_PASSWORD), firma);
  } catch {
    return false;
  }
}

async function bloqueadoPorIntentos(env: Env, ip: string): Promise<boolean> {
  try {
    const r = await env.DB.prepare(
      `SELECT COUNT(*) AS n FROM intentos_admin
       WHERE ip = ? AND creado_en > datetime('now', '-${VENTANA_MIN} minutes')`
    )
      .bind(ip)
      .first<{ n: number }>();
    return (r?.n ?? 0) >= MAX_INTENTOS;
  } catch {
    return false;
  }
}

async function registrarIntento(env: Env, ip: string): Promise<void> {
  try {
    await env.DB.prepare('INSERT INTO intentos_admin (id, ip) VALUES (?, ?)').bind(crypto.randomUUID(), ip).run();
    await env.DB.prepare(`DELETE FROM intentos_admin WHERE creado_en < datetime('now', '-1 day')`).run();
  } catch (err) {
    console.error('No se pudo registrar el intento fallido', err);
  }
}

/* ─── Utilidades de render ────────────────────────────────────────────── */

function esc(v: unknown): string {
  return String(v ?? '').replace(
    /[&<>"']/g,
    (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!
  );
}

function fecha(iso: unknown): string {
  if (!iso) return '—';
  const d = new Date(String(iso).replace(' ', 'T') + 'Z');
  if (Number.isNaN(d.getTime())) return String(iso);
  return d.toLocaleString('es-MX', { dateStyle: 'medium', timeStyle: 'short', timeZone: 'America/Mexico_City' });
}

const ETIQUETA_INTERES: Record<string, string> = {
  usuario: 'Usuario',
  proveedor: 'Proveedor',
  inversion: 'Inversión/prensa',
};

function interesesTxt(json: string | null): string {
  try {
    const arr = JSON.parse(json ?? '[]');
    if (!Array.isArray(arr) || !arr.length) return '—';
    return arr.map((k: string) => ETIQUETA_INTERES[k] ?? k).join(', ');
  } catch {
    return '—';
  }
}

// Tokens de color tomados de src/styles/mp-styles.css — se copian aquí porque
// el Worker no pasa por el build de Astro.
const PANEL_CSS = `
:root{
--bg:#0B1E26;--bg-2:#12242E;--card:#16303B;--line:#1E3540;--line-soft:#1A2C34;
--fg:#EAF3F0;--fg-2:#9FB4BD;--fg-3:#7E96A1;--accent:#5DCAA5;--accent-soft:rgba(93,202,165,.12);
--accent-line:rgba(93,202,165,.32);--accent-fg:#06231A;--rojo:#e57373;--rojo-soft:rgba(229,115,115,.12);
--sans:"Manrope",system-ui,sans-serif;--display:"Plus Jakarta Sans",system-ui,sans-serif;
--mono:ui-monospace,"SF Mono",monospace;
}
*{box-sizing:border-box}
html,body{margin:0;padding:0}
html{background:var(--bg);color:var(--fg);font-family:var(--sans);font-size:15px;line-height:1.5}
a{color:var(--accent);text-decoration:none}
a:hover{color:var(--fg)}
.wrap{max-width:1100px;margin:0 auto;padding:28px 24px 80px}
header.top{display:flex;align-items:baseline;justify-content:space-between;gap:16px;margin-bottom:28px;padding-bottom:18px;border-bottom:1px solid var(--line-soft)}
header.top a.brand{font-family:var(--display);font-weight:800;font-size:20px;color:var(--fg)}
h1{font-family:var(--display);font-weight:800;font-size:26px;margin:0 0 4px}
h2{font-family:var(--display);font-weight:800;font-size:18px;margin:0 0 12px}
.resumen{display:flex;gap:14px;margin-bottom:24px;flex-wrap:wrap}
.stat{background:var(--card);border:1px solid var(--line-soft);border-radius:12px;padding:14px 18px;min-width:140px}
.stat .n{font-family:var(--display);font-weight:800;font-size:24px;color:var(--fg)}
.stat .t{font-size:11px;color:var(--fg-3);letter-spacing:.04em;text-transform:uppercase}
table{width:100%;border-collapse:collapse;background:var(--card);border:1px solid var(--line-soft);border-radius:12px;overflow:hidden}
th,td{text-align:left;padding:11px 14px;border-bottom:1px solid var(--line-soft);font-size:13.5px}
th{font-size:11px;letter-spacing:.06em;text-transform:uppercase;color:var(--fg-3);background:var(--bg-2)}
tr:last-child td{border-bottom:none}
tbody tr:hover{background:var(--bg-2)}
td.num{color:var(--fg-3)}
.badge{display:inline-flex;align-items:center;padding:3px 9px;border-radius:99px;font-size:11px;letter-spacing:.02em;border:1px solid transparent}
.badge.nuevo{background:var(--accent-soft);color:var(--accent);border-color:var(--accent-line)}
.badge.contactado{background:rgba(255,255,255,.06);color:var(--fg-2)}
.badge.activo{background:var(--bg-2);color:var(--fg);border-color:var(--line)}
.badge.cerrado{background:transparent;color:var(--fg-3);border-color:var(--line-soft)}
.vacio{padding:48px 24px;text-align:center;color:var(--fg-3);background:var(--card);border:1px dashed var(--line);border-radius:12px}
.panel{background:var(--card);border:1px solid var(--line-soft);border-radius:12px;padding:22px;margin-bottom:20px}
.dl{display:grid;grid-template-columns:auto 1fr;gap:6px 16px;font-size:14px}
.dl dt{color:var(--fg-3);font-size:11px;text-transform:uppercase;letter-spacing:.04em;align-self:center}
.dl dd{margin:0;color:var(--fg)}
select{background:var(--bg-2);border:1px solid var(--line);color:var(--fg);border-radius:8px;padding:8px 10px;font-family:var(--sans);font-size:14px}
.btn{display:inline-flex;align-items:center;gap:8px;padding:9px 16px;font-size:14px;font-weight:600;border:1px solid var(--line);background:transparent;color:var(--fg);border-radius:8px;cursor:pointer}
.btn:hover{border-color:var(--accent-line);color:var(--accent)}
.btn--primary{background:var(--accent);border-color:var(--accent);color:var(--accent-fg)}
.btn--primary:hover{background:#7fe0bd;border-color:#7fe0bd;color:var(--accent-fg)}
.error{background:var(--rojo-soft);border:1px solid var(--rojo);color:var(--fg);border-radius:8px;padding:12px 14px;margin-bottom:16px;font-size:14px}
form.estado{display:flex;gap:10px;align-items:center;margin-top:10px}
`;

function layout(titulo: string, cuerpo: string): string {
  return `<!doctype html>
<html lang="es">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="robots" content="noindex,nofollow">
<title>${esc(titulo)} · Panel MicoPay</title>
<style>${PANEL_CSS}</style>
</head>
<body>
<div class="wrap">
<header class="top">
  <a class="brand" href="/admin">MicoPay</a>
  <form method="post" action="/admin/salir"><button class="btn" type="submit">Salir</button></form>
</header>
${cuerpo}
</div>
</body>
</html>`;
}

const ESTADOS = ['nuevo', 'contactado', 'activo', 'cerrado'] as const;
type Estado = (typeof ESTADOS)[number];

function badge(estado: string): string {
  const e = ESTADOS.includes(estado as Estado) ? estado : 'nuevo';
  return `<span class="badge ${e}">${esc(estado)}</span>`;
}

function panel404(): Response {
  return new Response(
    layout('No encontrado', `<div class="vacio"><h2>404</h2><p>Eso no existe.</p><p><a href="/admin">Volver a la lista</a></p></div>`),
    { status: 404, headers: { 'content-type': 'text/html; charset=utf-8' } }
  );
}

/* ─── Pantalla — lista de prospectos ─────────────────────────────────── */

interface FilaLead {
  id: string;
  nombre: string;
  email: string;
  ciudad: string | null;
  interes: string;
  estado: string;
  creado_en: string;
}

async function pantallaLista(env: Env): Promise<Response> {
  const [filas, resumen] = await Promise.all([
    env.DB.prepare(
      `SELECT id, nombre, email, ciudad, interes, estado, creado_en
       FROM leads ORDER BY creado_en DESC LIMIT 200`
    ).all<FilaLead>(),
    env.DB.prepare(
      `SELECT
         (SELECT COUNT(*) FROM leads) AS total,
         (SELECT COUNT(*) FROM leads WHERE estado = 'nuevo') AS sin_contestar,
         (SELECT COUNT(*) FROM leads WHERE creado_en >= datetime('now','-7 days')) AS semana,
         (SELECT COUNT(*) FROM leads WHERE interes LIKE '%proveedor%') AS proveedores,
         (SELECT COUNT(*) FROM leads WHERE interes LIKE '%inversion%') AS inversion`
    ).first<{ total: number; sin_contestar: number; semana: number; proveedores: number; inversion: number }>(),
  ]);

  const leads = filas.results ?? [];

  const filasHtml = leads.length
    ? leads
        .map(
          (l) => `<tr>
        <td>${esc(l.nombre)}</td>
        <td>${esc(l.email)}</td>
        <td>${esc(l.ciudad || '—')}</td>
        <td>${esc(interesesTxt(l.interes))}</td>
        <td>${badge(l.estado)}</td>
        <td class="num">${fecha(l.creado_en)}</td>
        <td>
          <form class="estado" method="post" action="/admin/estado">
            <input type="hidden" name="lead_id" value="${esc(l.id)}">
            <select name="estado">
              ${ESTADOS.map((e) => `<option value="${e}" ${e === l.estado ? 'selected' : ''}>${e}</option>`).join('')}
            </select>
            <button class="btn" type="submit">Guardar</button>
          </form>
        </td>
      </tr>`
        )
        .join('')
    : '';

  const tabla = leads.length
    ? `<table>
        <thead><tr><th>Nombre</th><th>Correo</th><th>Ciudad</th><th>Interés</th><th>Estado</th><th>Alta</th><th></th></tr></thead>
        <tbody>${filasHtml}</tbody>
      </table>`
    : `<div class="vacio">
        <h2>Todavía no hay prospectos</h2>
        <p>Llegarán aquí en cuanto alguien llene el formulario de micopay.com.mx.</p>
      </div>`;

  const cuerpo = `
    <h1>Prospectos</h1>
    <div class="resumen">
      <div class="stat"><div class="n">${resumen?.total ?? 0}</div><div class="t">Total</div></div>
      <div class="stat"><div class="n">${resumen?.sin_contestar ?? 0}</div><div class="t">Sin contestar</div></div>
      <div class="stat"><div class="n">${resumen?.semana ?? 0}</div><div class="t">Esta semana</div></div>
      <div class="stat"><div class="n">${resumen?.proveedores ?? 0}</div><div class="t">Interés proveedor</div></div>
      <div class="stat"><div class="n">${resumen?.inversion ?? 0}</div><div class="t">Inversión / prensa</div></div>
    </div>
    ${tabla}
  `;

  return new Response(layout('Prospectos', cuerpo), { headers: { 'content-type': 'text/html; charset=utf-8' } });
}

/* ─── Acción — cambiar estado ────────────────────────────────────────── */

async function accionEstado(request: Request, env: Env): Promise<Response> {
  const form = await request.formData();
  const leadId = String(form.get('lead_id') ?? '').trim();
  const estado = String(form.get('estado') ?? '').trim();

  if (!ESTADOS.includes(estado as Estado)) return panel404();

  const resultado = await env.DB.prepare('UPDATE leads SET estado = ? WHERE id = ?').bind(estado, leadId).run();
  if (!resultado.meta.changes) return panel404();

  await env.DB.prepare(`INSERT INTO events (id, lead_id, tipo, metadata) VALUES (?, ?, 'estado_cambiado', ?)`)
    .bind(crypto.randomUUID(), leadId, JSON.stringify({ estado }))
    .run();

  return Response.redirect(new URL('/admin', request.url).toString(), 303);
}

/* ─── Pantalla de acceso ─────────────────────────────────────────────── */

function pantallaAcceso(aviso?: string, status = 200): Response {
  const html = `<!doctype html>
<html lang="es-MX"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex, nofollow">
<title>Acceso</title>
<style>${PANEL_CSS}
.acc{min-height:100vh;display:flex;align-items:center;justify-content:center;padding:24px}
.acc-caja{width:100%;max-width:360px;display:flex;flex-direction:column;gap:22px}
.acc-t{font-family:var(--display);font-weight:800;font-size:24px}
.acc-f{display:flex;flex-direction:column;gap:12px}
.acc-aviso{padding:11px 13px;border:1px solid var(--rojo);background:var(--rojo-soft);border-radius:8px;font-size:12.5px;line-height:1.5}
.campo{width:100%;padding:13px 15px;background:var(--bg-2);border:1px solid var(--line);border-radius:8px;color:var(--fg);font-family:var(--sans);font-size:15px;outline:none}
.campo:focus{border-color:var(--accent)}
.acc-f .btn{justify-content:center}
</style></head>
<body><div class="acc"><div class="acc-caja">
  <div><div class="acc-t">MicoPay</div><p style="margin-top:6px;color:var(--fg-3)">Panel privado</p></div>
  ${aviso ? `<div class="acc-aviso" role="alert">${esc(aviso)}</div>` : ''}
  <form class="acc-f" method="POST" action="/admin/entrar">
    <input class="campo" type="password" name="password" placeholder="Contraseña"
           autocomplete="current-password" autofocus required aria-label="Contraseña">
    <button class="btn btn--primary" type="submit">Entrar</button>
  </form>
</div></div></body></html>`;

  return new Response(html, {
    status,
    headers: { 'content-type': 'text/html; charset=utf-8', 'cache-control': 'no-store', 'x-robots-tag': 'noindex, nofollow' },
  });
}

async function accionEntrar(request: Request, env: Env): Promise<Response> {
  const ip = request.headers.get('CF-Connecting-IP') ?? 'desconocida';

  if (await bloqueadoPorIntentos(env, ip)) {
    return pantallaAcceso(`Demasiados intentos fallidos. Espera ${VENTANA_MIN} minutos.`, 429);
  }

  let password = '';
  try {
    password = ((await request.formData()).get('password') ?? '').toString();
  } catch {
    return pantallaAcceso('No pudimos leer el formulario.', 400);
  }

  if (!password || !igualSeguro(password, env.ADMIN_PASSWORD!)) {
    await registrarIntento(env, ip);
    return pantallaAcceso('Contraseña incorrecta.', 401);
  }

  const vence = String(Date.now() + DURACION_MS);
  const cookie = `${vence}.${await firmar(vence, env.ADMIN_PASSWORD!)}`;

  return new Response(null, {
    status: 303,
    headers: {
      Location: new URL('/admin', request.url).toString(),
      'Set-Cookie': `${COOKIE}=${cookie}; HttpOnly; Secure; SameSite=Strict; Path=/admin; Max-Age=${DURACION_MS / 1000}`,
    },
  });
}

/* ─── Punto de entrada ───────────────────────────────────────────────── */

export async function manejarAdmin(request: Request, env: Env): Promise<Response | null> {
  const url = new URL(request.url);
  const partes = url.pathname.split('/').filter(Boolean); // ['admin', ...]

  if (!env.ADMIN_PASSWORD) return null;

  const autenticado = await sesionValida(request, env);

  if (!autenticado) {
    if (partes.length === 1 && request.method === 'GET') return pantallaAcceso();
    if (partes.length === 2 && partes[1] === 'entrar' && request.method === 'POST') return accionEntrar(request, env);
    return null;
  }

  if (partes.length === 2 && partes[1] === 'salir' && request.method === 'POST') {
    return new Response(null, {
      status: 303,
      headers: {
        Location: new URL('/admin', request.url).toString(),
        'Set-Cookie': `${COOKIE}=; HttpOnly; Secure; SameSite=Strict; Path=/admin; Max-Age=0`,
      },
    });
  }

  try {
    if (partes.length === 1 && request.method === 'GET') return await pantallaLista(env);
    if (partes.length === 2 && partes[1] === 'estado' && request.method === 'POST') return await accionEstado(request, env);
  } catch (err) {
    console.error('Error en el panel /admin', err);
    return panel404();
  }

  return panel404();
}
