/**
 * MicoPay — Worker del sitio.
 *
 * Sirve los archivos estáticos y atiende POST /api/contacto: el único
 * formulario de la landing, que cubre los tres tipos de interés (usuario,
 * proveedor, inversión/prensa) en un solo lead con el campo `interes`.
 *
 * El buzón entrante y el hilo de respuesta (como en motelabs) quedan para
 * cuando haya volumen suficiente para justificarlos — ver PLAN.md.
 */

export interface Env {
  ASSETS: Fetcher;
  DB: D1Database;
  MAILGUN_API_KEY: string;
  MAILGUN_DOMAIN: string;
  /** Base de la API de Mailgun. Las cuentas europeas usan api.eu.mailgun.net. */
  MAILGUN_BASE?: string;
  NOTIFY_TO: string;
  TURNSTILE_SECRET: string;
  /** Contraseña del panel /admin. Sin ella el panel responde 404 para todos. */
  ADMIN_PASSWORD?: string;
}

import { manejarAdmin } from './admin';

const INTERESES_VALIDOS = ['usuario', 'proveedor', 'inversion'] as const;

interface Contacto {
  nombre: string;
  email: string;
  ciudad?: string;
  interes: string[];
  mensaje?: string;
  utm: Record<string, string>;
  turnstileToken: string;
  /** Campo trampa: los humanos no lo ven, los bots sí lo llenan. */
  sitio: string;
}

const MAX = { nombre: 120, email: 254, ciudad: 80, mensaje: 3000 };
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const json = (data: unknown, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8' },
  });

/** Valida la forma del envío. Devuelve los errores por campo, vacío si todo bien. */
function validar(c: Partial<Contacto>): Record<string, string> {
  const e: Record<string, string> = {};
  const nombre = (c.nombre ?? '').trim();
  const email = (c.email ?? '').trim();
  const ciudad = (c.ciudad ?? '').trim();
  const mensaje = (c.mensaje ?? '').trim();
  const interes = Array.isArray(c.interes) ? c.interes.filter((i) => INTERESES_VALIDOS.includes(i as any)) : [];

  if (!nombre) e.nombre = 'Escribe tu nombre.';
  else if (nombre.length > MAX.nombre) e.nombre = 'El nombre es demasiado largo.';

  if (!email) e.email = 'Escribe tu correo.';
  else if (!EMAIL_RE.test(email) || email.length > MAX.email) e.email = 'Ese correo no parece válido.';

  if (ciudad.length > MAX.ciudad) e.ciudad = 'La ciudad es demasiado larga.';
  if (mensaje.length > MAX.mensaje) e.mensaje = 'El mensaje es demasiado largo.';
  if (interes.length === 0) e.interes = 'Elige al menos una opción.';

  return e;
}

/** Confirma con Cloudflare que el visitante resolvió el reto anti-spam. */
async function turnstileOk(token: string, secret: string, ip: string | null): Promise<boolean> {
  if (!secret) return true; // Sin secreto configurado, no bloqueamos el formulario.
  if (!token) return false;

  const body = new FormData();
  body.append('secret', secret);
  body.append('response', token);
  if (ip) body.append('remoteip', ip);

  try {
    const r = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      body,
    });
    const data = (await r.json()) as { success?: boolean };
    return data.success === true;
  } catch {
    return false; // Ante un fallo de red, preferimos rechazar que dejar pasar spam.
  }
}

/** Envía un correo por la API de Mailgun. */
export async function enviarCorreo(
  env: Env,
  msg: { to: string; subject: string; text: string; replyTo?: string }
): Promise<{ ok: boolean; id: string | null }> {
  const form = new FormData();
  form.append('from', `MicoPay <hola@${env.MAILGUN_DOMAIN}>`);
  form.append('to', msg.to);
  form.append('subject', msg.subject);
  form.append('text', msg.text);
  if (msg.replyTo) form.append('h:Reply-To', msg.replyTo);

  const base = env.MAILGUN_BASE || 'https://api.mailgun.net';
  try {
    const r = await fetch(`${base}/v3/${env.MAILGUN_DOMAIN}/messages`, {
      method: 'POST',
      headers: { Authorization: 'Basic ' + btoa(`api:${env.MAILGUN_API_KEY}`) },
      body: form,
    });
    if (!r.ok) {
      console.error(`Mailgun ${r.status} en ${base}:`, await r.text());
      return { ok: false, id: null };
    }
    const data = (await r.json().catch(() => null)) as { id?: string } | null;
    return { ok: true, id: data?.id ?? null };
  } catch (err) {
    console.error('Mailgun falló', err);
    return { ok: false, id: null };
  }
}

const ETIQUETA: Record<string, string> = {
  usuario: 'Quiere cambiar efectivo',
  proveedor: 'Quiere ser proveedor',
  inversion: 'Inversión / prensa',
};

async function manejarContacto(request: Request, env: Env): Promise<Response> {
  let body: Partial<Contacto>;
  try {
    body = await request.json();
  } catch {
    return json({ error: 'No pudimos leer el formulario.' }, 400);
  }

  // Trampa para bots: si viene lleno, respondemos 200 para no darles señal.
  if (body.sitio) return json({ ok: true });

  const errores = validar(body);
  if (Object.keys(errores).length) return json({ errores }, 422);

  const ip = request.headers.get('CF-Connecting-IP');
  if (!(await turnstileOk(body.turnstileToken ?? '', env.TURNSTILE_SECRET, ip)))
    return json({ error: 'No pudimos verificar que no eres un bot. Recarga e inténtalo de nuevo.' }, 403);

  const nombre = body.nombre!.trim();
  const email = body.email!.trim();
  const ciudad = (body.ciudad ?? '').trim();
  const mensaje = (body.mensaje ?? '').trim();
  const interes = (body.interes ?? []).filter((i) => INTERESES_VALIDOS.includes(i as any));
  const utm = body.utm ?? {};
  const id = crypto.randomUUID();

  // Guardar primero: si el correo falla, el lead no se pierde.
  try {
    await env.DB.prepare(
      `INSERT INTO leads (id, email, nombre, ciudad, interes, mensaje, utm_source, utm_medium, utm_campaign)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
    )
      .bind(
        id,
        email,
        nombre,
        ciudad || null,
        JSON.stringify(interes),
        mensaje || null,
        utm.utm_source ?? null,
        utm.utm_medium ?? null,
        utm.utm_campaign ?? null
      )
      .run();

    await env.DB.prepare(`INSERT INTO events (id, lead_id, tipo, metadata) VALUES (?, ?, 'form_submit', ?)`)
      .bind(crypto.randomUUID(), id, JSON.stringify({ ip, ua: request.headers.get('User-Agent') }))
      .run();
  } catch (err) {
    console.error('D1 falló al guardar el lead', err);
    return json({ error: 'Algo falló de nuestro lado. Escríbenos directo a hola@micopay.com.mx.' }, 500);
  }

  const interesTxt = interes.length ? interes.map((i) => ETIQUETA[i] ?? i).join(', ') : 'sin especificar';

  // Aviso para Eric. Reply-To apunta al prospecto para poder contestar de una.
  const aviso = enviarCorreo(env, {
    to: env.NOTIFY_TO,
    replyTo: email,
    subject: `Nuevo interés en MicoPay: ${nombre} (${interesTxt})`,
    text: [
      `Nombre:   ${nombre}`,
      `Correo:   ${email}`,
      `Ciudad:   ${ciudad || '—'}`,
      `Interés:  ${interesTxt}`,
      utm.utm_source ? `Origen:   ${utm.utm_source} / ${utm.utm_medium ?? '—'} / ${utm.utm_campaign ?? '—'}` : null,
      '',
      mensaje || '(sin mensaje adicional)',
      '',
      `— id ${id}`,
    ]
      .filter(Boolean)
      .join('\n'),
  });

  // Acuse para el prospecto.
  const acuse = enviarCorreo(env, {
    to: email,
    subject: 'Gracias por registrarte — MicoPay',
    text: [
      `Hola ${nombre.split(' ')[0]},`,
      '',
      'Recibimos tu registro. Te avisamos por este correo apenas haya movimiento para ti.',
      '',
      `Interés registrado: ${interesTxt}`,
      '',
      '—',
      'MicoPay · México',
      'https://micopay.com.mx',
    ].join('\n'),
  });

  // El lead ya está guardado; si un correo falla lo vemos en los logs.
  await Promise.allSettled([aviso, acuse]);

  return json({ ok: true });
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    // Una sola URL canónica: www manda al dominio pelón conservando ruta y query.
    if (url.hostname.startsWith('www.')) {
      url.hostname = url.hostname.slice(4);
      return Response.redirect(url.toString(), 301);
    }

    if (url.pathname === '/api/contacto') {
      if (request.method !== 'POST') return json({ error: 'Método no permitido.' }, 405);
      return manejarContacto(request, env);
    }

    // Panel privado. `manejarAdmin` devuelve null sin credencial válida —
    // en ese caso cae al fetch de ASSETS de abajo, que responde el mismo
    // 404 que cualquier ruta inexistente (fallar cerrado).
    if (url.pathname === '/admin' || url.pathname.startsWith('/admin/')) {
      const resp = await manejarAdmin(request, env);
      if (resp) return resp;
    }

    return env.ASSETS.fetch(request);
  },
} satisfies ExportedHandler<Env>;
