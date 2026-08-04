/* MicoPay — formulario de leads. Un solo formulario para los tres tipos de
   interés (usuario, proveedor, inversión/prensa) en vez de tres formularios
   separados: el campo "interes" es lo que después permite responder "¿en qué
   hay demanda real?" desde el panel /admin y la tabla `leads` en D1.
   Envía a POST /api/contacto (ver src/worker.ts).

   OJO: el <style> de una isla React NO tiene scope. Clases prefijadas con
   `ct-` para no pisar las de otros componentes (`.campo` chocaba con las de
   Calculadora.jsx, y `.h2` con las de los .astro). */
import React from 'react';

/* Clave pública del widget anti-spam de Turnstile. No es secreta: viaja al
   navegador. Su contraparte privada vive como TURNSTILE_SECRET en el Worker.
   Widget en modo "managed" para micopay.com.mx y www.micopay.com.mx. */
const TURNSTILE_SITE_KEY = '0x4AAAAAAECVQ_UG_9RUXc9q';

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
    <section id="lead" className="ct-section">
      <div className="container">
        <div className="ct-grid">
          <div>
            <span className="ct-waitlist-badge">
              <span className="ms">bolt</span>Únete a la lista de espera
            </span>
            <div className="label">Regístrate</div>
            <h2 className="ct-h2">Dinos qué te interesa de MicoPay</h2>
            <p className="ct-lead-p">
              Un solo formulario, cero compromiso: nos sirve para saber dónde y con quién abrir
              primero. Te escribimos apenas haya movimiento en tu ciudad.
            </p>
          </div>

          {!enviado ? (
            <form className="card ct-form" onSubmit={enviar}>
              <input
                ref={trampa}
                type="text"
                name="sitio"
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
                className="ct-trampa"
              />

              <div className="ct-fila-2">
                <div className="ct-campo">
                  <label className="ct-campo-l">Nombre</label>
                  <input
                    className="ct-input"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    onBlur={() => setTouched((t) => ({ ...t, nombre: 1 }))}
                    placeholder="tu nombre"
                  />
                  {touched.nombre && errores.nombre && <span className="ct-err">{errores.nombre}</span>}
                </div>
                <div className="ct-campo">
                  <label className="ct-campo-l">Correo</label>
                  <input
                    className="ct-input"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onBlur={() => setTouched((t) => ({ ...t, email: 1 }))}
                    placeholder="tu@correo.com"
                  />
                  {touched.email && errores.email && <span className="ct-err">{errores.email}</span>}
                </div>
              </div>

              <div className="ct-campo">
                <label className="ct-campo-l">Ciudad (opcional)</label>
                <input
                  className="ct-input"
                  value={ciudad}
                  onChange={(e) => setCiudad(e.target.value)}
                  placeholder="CDMX, Guadalajara, Monterrey…"
                />
              </div>

              <div className="ct-campo">
                <label className="ct-campo-l">Me interesa</label>
                <div className="ct-opciones">
                  {INTERESES.map((op) => (
                    <button
                      key={op.key}
                      type="button"
                      className="pill ct-pill"
                      data-on={interes.includes(op.key)}
                      onClick={() => alternar(op.key)}
                    >
                      <span className="ms">{op.icon}</span>{op.label}
                    </button>
                  ))}
                </div>
                {touched.interes && errores.interes && <span className="ct-err">{errores.interes}</span>}
              </div>

              <div className="ct-campo">
                <label className="ct-campo-l">Cuéntanos algo más (opcional)</label>
                <textarea
                  className="ct-input ct-textarea"
                  value={mensaje}
                  onChange={(e) => setMensaje(e.target.value)}
                  placeholder="Si eres proveedor: qué negocio tienes. Si es prensa o inversión: en qué estás interesado."
                />
              </div>

              <div ref={captchaRef} />
              {captchaRoto && (
                <p className="ct-captcha-aviso">
                  No cargó la verificación anti-spam. Si no puedes enviar, escríbenos directo a hola@micopay.com.mx.
                </p>
              )}

              {fallo && <div className="ct-alerta" role="alert">{fallo}</div>}

              <button type="submit" className="btn btn--primary" disabled={!valido || enviando}>
                {enviando ? 'Enviando…' : 'Unirme a la lista de espera'}
                {!enviando && <span className="ms">arrow_forward</span>}
              </button>

              {/* La LFPDPPP pide que el aviso sea visible en el momento de
                  recabar los datos, no solo enlazado desde el pie. */}
              <p className="ct-legal">
                Al registrarte aceptas los <a href="/terms">Términos de uso</a> y el <a href="/privacy">Aviso de privacidad</a>. Puedes pedir que borremos tus datos cuando quieras.
              </p>
            </form>
          ) : (
            <div className="card ct-gracias">
              <span className="ct-gracias-tag">Ya estás en la lista</span>
              <h3 className="ct-gracias-t">{`Gracias, ${nombre.split(' ')[0]}.`}</h3>
              <p className="ct-gracias-p">Estás en la lista de espera. Te avisamos por correo apenas haya movimiento para ti.</p>
              <div className="ct-gracias-detalle">
                <div>→ confirmación a <span translate="no">{email}</span></div>
                <div>{`→ interés: ${interes.map((k) => INTERESES.find((o) => o.key === k)?.label).join(', ')}`}</div>
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
        .ct-section { padding: 88px 0; background: var(--papel); border-top: 2px solid var(--tinta); }
        .ct-waitlist-badge {
          display: inline-flex; align-items: center; gap: 8px; padding: 6px 12px 6px 10px;
          border-radius: var(--r-sm); background: var(--naranja-suave); border: 2px solid var(--tinta);
          color: var(--tinta); font-size: 12.5px; font-weight: 700; margin-bottom: 16px;
        }
        .ct-waitlist-badge .ms { font-size: 16px; }
        .ct-grid { display: grid; grid-template-columns: minmax(0,1fr) minmax(0,1.2fr); gap: clamp(36px,6vw,80px); align-items: start; }
        .ct-h2 { font-family: var(--font-display); font-weight: 800; letter-spacing: -.02em; font-size: clamp(28px, 3.2vw, 38px); line-height: 1.04; text-transform: uppercase; font-variation-settings: "wdth" 112; margin-bottom: 16px; }
        .ct-lead-p { color: var(--gris); font-size: 16px; max-width: 30em; }

        .ct-form { display: flex; flex-direction: column; gap: 20px; box-shadow: 8px 8px 0 var(--tinta); }
        .ct-trampa { position: absolute; left: -9999px; width: 1px; height: 1px; opacity: 0; }
        .ct-fila-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
        .ct-campo { display: flex; flex-direction: column; gap: 7px; }
        .ct-campo-l { font-size: 12.5px; font-weight: 700; color: var(--gris-2); letter-spacing: .02em; }
        .ct-input {
          width: 100%; background: var(--fondo); border: 2px solid var(--tinta); color: var(--tinta);
          font-size: 15px; padding: 12px 14px; border-radius: var(--r-sm); outline: none; transition: border-color .15s ease;
        }
        .ct-input:focus { border-color: var(--naranja); }
        .ct-textarea { min-height: 110px; resize: vertical; line-height: 1.55; }
        .ct-err { font-size: 12px; color: #c0392b; }

        .ct-opciones { display: flex; gap: 8px; flex-wrap: wrap; }
        .ct-pill { display: inline-flex; align-items: center; gap: 8px; }
        .ct-pill .ms { font-size: 18px; }

        .ct-captcha-aviso { font-size: 12.5px; color: var(--gris-2); line-height: 1.6; }
        .ct-legal { font-size: 12.5px; color: var(--gris-2); line-height: 1.6; margin-top: -6px; }
        .ct-legal a { color: var(--verde); font-weight: 700; }
        .ct-alerta { padding: 12px 14px; border: 2px solid var(--tinta); background: #fdecec; border-radius: var(--r-sm); font-size: 13.5px; color: var(--tinta); }

        .ct-gracias { display: flex; flex-direction: column; gap: 16px; align-items: flex-start; box-shadow: 8px 8px 0 var(--tinta); }
        .ct-gracias-tag { color: var(--papel); background: var(--naranja); padding: 3px 8px; letter-spacing: .12em; text-transform: uppercase; font-size: 10px; font-weight: 700; }
        .ct-gracias-t { font-size: clamp(22px, 2.4vw, 28px); }
        .ct-gracias-p { color: var(--gris); }
        .ct-gracias-detalle { color: var(--gris-2); font-size: 13.5px; line-height: 1.9; }

        @media (max-width: 880px) { .ct-grid { grid-template-columns: 1fr; } }
        @media (max-width: 520px) { .ct-fila-2 { grid-template-columns: 1fr; } }
      `}</style>
    </section>
  );
}
