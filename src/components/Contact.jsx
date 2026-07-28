/* MicoPay — formulario de leads. Un solo formulario para los tres tipos de
   interés (usuario, proveedor, inversión/prensa) en vez de tres formularios
   separados: el campo "interes" es lo que después permite responder "¿en qué
   hay demanda real?" desde el panel /admin y la tabla `leads` en D1.
   Envía a POST /api/contacto (ver src/worker.ts). */
import React from 'react';

/* Clave pública del widget anti-spam de Turnstile. No es secreta: viaja al
   navegador. TODO: reemplazar con la site key real una vez creado el widget
   para micopay.com.mx en el dashboard de Cloudflare Turnstile. */
const TURNSTILE_SITE_KEY = '1x00000000000000000000AA';

function leerUtm() {
  if (typeof window === 'undefined') return {};
  const p = new URLSearchParams(window.location.search);
  const utm = {};
  for (const k of ['utm_source', 'utm_medium', 'utm_campaign']) {
    const v = p.get(k);
    if (v) utm[k] = v.slice(0, 120);
  }
  return utm;
}

const INTERESES = [
  { key: 'usuario', label: 'Quiero cambiar efectivo', icon: 'account_balance_wallet' },
  { key: 'proveedor', label: 'Quiero ser proveedor', icon: 'storefront' },
  { key: 'inversion', label: 'Inversión / prensa', icon: 'campaign' },
];

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function Contact() {
  const [nombre, setNombre] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [ciudad, setCiudad] = React.useState('');
  const [interes, setInteres] = React.useState([]);
  const [mensaje, setMensaje] = React.useState('');
  const [touched, setTouched] = React.useState({});
  const [enviando, setEnviando] = React.useState(false);
  const [enviado, setEnviado] = React.useState(false);
  const [fallo, setFallo] = React.useState(null);
  const trampa = React.useRef(null);

  const captchaRef = React.useRef(null);
  const widgetId = React.useRef(null);
  const [captchaToken, setCaptchaToken] = React.useState('');
  const [captchaRoto, setCaptchaRoto] = React.useState(false);

  React.useEffect(() => {
    let vivo = true;
    let intervalo, expira;

    const dibujar = () => {
      if (!vivo || !captchaRef.current || !window.turnstile) return;
      try {
        widgetId.current = window.turnstile.render(captchaRef.current, {
          sitekey: TURNSTILE_SITE_KEY,
          theme: 'light',
          callback: (t) => setCaptchaToken(t),
          'expired-callback': () => setCaptchaToken(''),
          'error-callback': () => setCaptchaRoto(true),
        });
      } catch {
        setCaptchaRoto(true);
      }
    };

    if (window.turnstile) {
      dibujar();
    } else {
      intervalo = setInterval(() => {
        if (window.turnstile) { clearInterval(intervalo); dibujar(); }
      }, 200);
      expira = setTimeout(() => {
        clearInterval(intervalo);
        if (!window.turnstile) setCaptchaRoto(true);
      }, 10000);
    }

    return () => {
      vivo = false;
      clearInterval(intervalo);
      clearTimeout(expira);
      if (widgetId.current && window.turnstile) {
        try { window.turnstile.remove(widgetId.current); } catch {}
      }
    };
  }, []);

  const errores = {
    nombre: !nombre.trim() ? 'requerido' : null,
    email: !email.trim() ? 'requerido' : !EMAIL_RE.test(email) ? 'correo inválido' : null,
    interes: interes.length === 0 ? 'elige al menos una opción' : null,
  };
  const valido = !errores.nombre && !errores.email && !errores.interes;

  const alternar = (key) => {
    setInteres((prev) => (prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]));
  };

  const enviar = async (e) => {
    e.preventDefault();
    setTouched({ nombre: 1, email: 1, interes: 1 });
    if (!valido || enviando) return;

    setEnviando(true);
    setFallo(null);
    try {
      const r = await fetch('/api/contacto', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          nombre,
          email,
          ciudad,
          interes,
          mensaje,
          utm: leerUtm(),
          sitio: trampa.current?.value || '',
          turnstileToken: captchaToken,
        }),
      });
      if (r.ok) {
        setEnviado(true);
      } else {
        if (widgetId.current && window.turnstile) {
          try { window.turnstile.reset(widgetId.current); } catch {}
        }
        setCaptchaToken('');
        const data = await r.json().catch(() => ({}));
        setFallo(
          data.error ||
            Object.values(data.errores || {})[0] ||
            'No pudimos registrar tu interés. Escríbenos directo a hola@micopay.com.mx.'
        );
      }
    } catch {
      setFallo('No hay conexión. Revisa tu internet e inténtalo de nuevo.');
    } finally {
      setEnviando(false);
    }
  };

  return (
    <section id="lead" className="lead-section">
      <div className="container">
        <div className="lead-grid">
          <div>
            <div className="label">Regístrate</div>
            <h2 className="h2">Dinos qué te interesa de MicoPay</h2>
            <p className="lead-p">
              Un solo formulario, cero compromiso: nos sirve para saber dónde y con quién abrir
              primero. Te escribimos apenas haya movimiento en tu ciudad.
            </p>
          </div>

          {!enviado ? (
            <form className="card lead-form" onSubmit={enviar}>
              <input
                ref={trampa}
                type="text"
                name="sitio"
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
                className="trampa"
              />

              <div className="fila-2">
                <div className="campo">
                  <label className="campo-l">Nombre</label>
                  <input
                    className="campo-input"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    onBlur={() => setTouched((t) => ({ ...t, nombre: 1 }))}
                    placeholder="tu nombre"
                  />
                  {touched.nombre && errores.nombre && <span className="campo-err">{errores.nombre}</span>}
                </div>
                <div className="campo">
                  <label className="campo-l">Correo</label>
                  <input
                    className="campo-input"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onBlur={() => setTouched((t) => ({ ...t, email: 1 }))}
                    placeholder="tu@correo.com"
                  />
                  {touched.email && errores.email && <span className="campo-err">{errores.email}</span>}
                </div>
              </div>

              <div className="campo">
                <label className="campo-l">Ciudad (opcional)</label>
                <input
                  className="campo-input"
                  value={ciudad}
                  onChange={(e) => setCiudad(e.target.value)}
                  placeholder="CDMX, Guadalajara, Monterrey…"
                />
              </div>

              <div className="campo">
                <label className="campo-l">Me interesa</label>
                <div className="opciones">
                  {INTERESES.map((op) => (
                    <button
                      key={op.key}
                      type="button"
                      className="pill pill--interes"
                      data-on={interes.includes(op.key)}
                      onClick={() => alternar(op.key)}
                    >
                      <span className="ms">{op.icon}</span>{op.label}
                    </button>
                  ))}
                </div>
                {touched.interes && errores.interes && <span className="campo-err">{errores.interes}</span>}
              </div>

              <div className="campo">
                <label className="campo-l">Cuéntanos algo más (opcional)</label>
                <textarea
                  className="campo-input campo-textarea"
                  value={mensaje}
                  onChange={(e) => setMensaje(e.target.value)}
                  placeholder="Si eres proveedor: qué negocio tienes. Si es prensa o inversión: en qué estás interesado."
                />
              </div>

              <div ref={captchaRef} />
              {captchaRoto && (
                <p className="captcha-aviso">
                  No cargó la verificación anti-spam. Si no puedes enviar, escríbenos directo a hola@micopay.com.mx.
                </p>
              )}

              {fallo && <div className="alerta" role="alert">{fallo}</div>}

              <button type="submit" className="btn btn--primary" disabled={!valido || enviando}>
                {enviando ? 'Enviando…' : 'Registrar mi interés'}
                {!enviando && <span className="ms">arrow_forward</span>}
              </button>
            </form>
          ) : (
            <div className="card lead-gracias">
              <span className="gracias-tag">Recibido</span>
              <h3 className="gracias-t">Gracias, {nombre.split(' ')[0]}.</h3>
              <p className="gracias-p">Te avisamos por correo apenas haya movimiento para ti.</p>
              <div className="gracias-detalle">
                <div>→ confirmación a {email}</div>
                <div>→ interés: {interes.map((k) => INTERESES.find((o) => o.key === k)?.label).join(', ')}</div>
              </div>
              <button
                type="button"
                className="btn btn--ghost"
                onClick={() => {
                  setEnviado(false); setNombre(''); setEmail(''); setCiudad('');
                  setInteres([]); setMensaje(''); setTouched({});
                }}
              >
                Enviar otro
              </button>
            </div>
          )}
        </div>
      </div>

      <style>{`
        .lead-section { padding: 96px 0; background: #fff; border-top: 1px solid var(--linea); }
        .lead-grid { display: grid; grid-template-columns: minmax(0,1fr) minmax(0,1.2fr); gap: clamp(36px,6vw,80px); align-items: start; }
        .h2 { font-size: clamp(28px, 3.2vw, 38px); line-height: 1.1; margin-bottom: 16px; }
        .lead-p { color: var(--gris); font-size: 16px; max-width: 30em; }

        .lead-form { display: flex; flex-direction: column; gap: 20px; box-shadow: 0 30px 60px -40px rgba(11,30,38,.4); }
        .trampa { position: absolute; left: -9999px; width: 1px; height: 1px; opacity: 0; }
        .fila-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
        .campo { display: flex; flex-direction: column; gap: 7px; }
        .campo-l { font-size: 12.5px; font-weight: 700; color: var(--gris-2); letter-spacing: .02em; }
        .campo-input {
          width: 100%; background: var(--fondo); border: 1px solid var(--linea); color: var(--tinta);
          font-size: 15px; padding: 13px 15px; border-radius: 12px; outline: none; transition: border-color .15s ease;
        }
        .campo-input:focus { border-color: var(--verde-claro); }
        .campo-textarea { min-height: 110px; resize: vertical; line-height: 1.55; }
        .campo-err { font-size: 12px; color: #c0392b; }

        .opciones { display: flex; gap: 8px; flex-wrap: wrap; }
        .pill--interes { display: inline-flex; align-items: center; gap: 8px; }
        .pill--interes .ms { font-size: 18px; }

        .captcha-aviso { font-size: 12.5px; color: var(--gris-2); line-height: 1.6; }
        .alerta { padding: 13px 15px; border: 1px solid #e6a5a5; background: #fdecec; border-radius: 12px; font-size: 13.5px; color: var(--tinta); }

        .lead-gracias { display: flex; flex-direction: column; gap: 16px; align-items: flex-start; box-shadow: 0 30px 60px -40px rgba(11,30,38,.4); }
        .gracias-tag { color: var(--verde-claro); letter-spacing: .08em; text-transform: uppercase; font-size: 11px; font-weight: 800; }
        .gracias-t { font-size: clamp(22px, 2.4vw, 28px); }
        .gracias-p { color: var(--gris); }
        .gracias-detalle { color: var(--gris-2); font-size: 13.5px; line-height: 1.9; }

        @media (max-width: 880px) { .lead-grid { grid-template-columns: 1fr; } }
        @media (max-width: 520px) { .fila-2 { grid-template-columns: 1fr; } }
      `}</style>
    </section>
  );
}
