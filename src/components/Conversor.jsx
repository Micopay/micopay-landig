/* MicoPay — mini simulador del conversor USDC→MXN en el hero.
   Tipo de cambio fijo por ahora (sin backend de precios todavía); solo
   ilustra la mecánica del producto para captar interés.

   OJO: el <style> de una isla React NO tiene scope (a diferencia de un
   .astro). Todas las clases de aquí van prefijadas con `cv-` para no pisar
   las de otros componentes — un `.punto` o `.tarjeta` suelto se aplica a
   toda la página. */
import React from 'react';

const TIPO_CAMBIO = 18.7; // referencial, no es precio en vivo todavía

/* La tarifa NO es fija: cada proveedor pone la suya (típicamente 1.9%–2.5%)
   y encima va la comisión de plataforma. Mostrar solo el 0.5% de plataforma
   inflaba el monto que el usuario creería recibir, así que se comunica el
   rango total y el monto se marca como aproximado. */
const TARIFA_MIN = 2.4;
const TARIFA_MAX = 3.0;
const TARIFA_TIPICA = (TARIFA_MIN + TARIFA_MAX) / 2;

function mxn(n) {
  return '$' + Math.round(n).toLocaleString('es-MX') + ' MXN';
}

export default function Conversor() {
  const [usdc, setUsdc] = React.useState(250);

  const onChange = (e) => {
    const v = parseFloat(String(e.target.value).replace(/[^0-9.]/g, ''));
    setUsdc(Number.isNaN(v) ? 0 : Math.min(v, 100000));
  };

  const recibes = usdc * TIPO_CAMBIO * (1 - TARIFA_TIPICA / 100);

  return (
    <div className="cv-wrap">
      <div className="cv-glow cv-glow-1" />
      <div className="cv-glow cv-glow-2" />

      <div className="cv-card">
        <div className="cv-mapa">
          <div className="cv-grid-lines" />
          <div className="cv-halo" />

          <div className="cv-pin-centro">
            <span className="cv-pin-ping" />
            <span className="cv-pin-nucleo">
              <span className="ms">person_pin_circle</span>
            </span>
          </div>

          <div className="cv-chip cv-chip-1">
            <span className="cv-chip-icon"><span className="ms">storefront</span></span>
            <span className="cv-chip-t">0.3 km</span>
          </div>
          <div className="cv-chip cv-chip-2">
            <span className="cv-chip-icon cv-chip-icon--alt"><span className="ms">storefront</span></span>
            <span className="cv-chip-t">0.5 km</span>
          </div>
          {/* Hongo del mapa: cada proveedor es un nodo de la red micelial.
              Proporciones clásicas para que se reconozca a ~60px — sombrero
              alto que sobresale, tallo grueso con base ensanchada. El tallo
              va primero para que el sombrero lo tape y el borde quede limpio.
              Adorno, no contenido. */}
          <div className="cv-nodo">
            <svg className="cv-hongo" viewBox="0 0 64 64" fill="none" aria-hidden="true" focusable="false">
              <path d="M23 30v17a9 7 0 0 0 18 0V30Z" fill="#1D9E75" />
              <path d="M4 33C4 16 17 5 32 5s28 11 28 28Z" fill="#5DCAA5" />
              <circle cx="20" cy="21" r="3.4" fill="#0C2119" opacity=".38" />
              <circle cx="41" cy="16" r="4.2" fill="#0C2119" opacity=".38" />
            </svg>
            <span className="cv-nodo-t">Red micelial MicoPay</span>
          </div>
        </div>

        <div className="cv-panel">
          <div className="cv-panel-row">
            <span className="cv-panel-label">Retirar</span>
            <span className="cv-panel-rate">1 USDC ≈ {TIPO_CAMBIO.toFixed(2)} MXN</span>
          </div>
          <div className="cv-input-row">
            <span className="cv-moneda">USDC</span>
            <input
              value={usdc}
              onChange={onChange}
              inputMode="decimal"
              aria-label="Monto en USDC"
              className="cv-input"
            />
          </div>
          <div className="cv-resumen">
            <div>
              <div className="cv-resumen-label">Recibes aprox.</div>
              <div className="cv-resumen-valor">{mxn(recibes)}</div>
            </div>
            <div className="cv-resumen-derecha">
              <div className="cv-resumen-label">Tarifa total</div>
              <div className="cv-resumen-comision">{TARIFA_MIN}%–{TARIFA_MAX}%</div>
            </div>
          </div>
          <p className="cv-nota">
            Estimado con tipo de cambio referencial. Cada proveedor pone su tarifa: ves el
            monto exacto antes de aceptar.
          </p>
        </div>
      </div>

      <style>{`
        .cv-wrap { position: relative; }
        .cv-glow { position: absolute; border-radius: 999px; filter: blur(60px); }
        .cv-glow-1 { top: -30px; right: -20px; width: 180px; height: 180px; background: rgba(93,202,165,.35); }
        .cv-glow-2 { bottom: -40px; left: -30px; width: 220px; height: 220px; background: rgba(0,105,76,.2); filter: blur(70px); }

        .cv-card {
          position: relative; background: #0B1420; border-radius: 32px; padding: 18px;
          box-shadow: 0 40px 80px -30px rgba(11,30,38,.55); border: 1px solid rgba(93,202,165,.18);
        }
        .cv-mapa {
          position: relative; height: 300px; border-radius: 22px; overflow: hidden;
          background: linear-gradient(135deg, #123326 0%, #0C2119 55%, #143A2B 100%);
        }
        .cv-grid-lines {
          position: absolute; inset: 0;
          background-image: linear-gradient(rgba(93,202,165,.14) 1px, transparent 1px), linear-gradient(90deg, rgba(93,202,165,.14) 1px, transparent 1px);
          background-size: 52px 52px;
        }
        .cv-halo { position: absolute; inset: 0; background: radial-gradient(circle at 50% 50%, rgba(93,202,165,.22), transparent 62%); }
        .cv-pin-centro { position: absolute; top: 50%; left: 50%; transform: translate(-50%,-50%); display: flex; align-items: center; justify-content: center; }
        .cv-pin-ping { position: absolute; width: 64px; height: 64px; border-radius: 999px; background: rgba(93,202,165,.35); animation: ping 2.8s cubic-bezier(0,0,.2,1) infinite; }
        .cv-pin-nucleo { position: relative; width: 56px; height: 56px; border-radius: 999px; background: #0B1420; border: 3px solid #5DCAA5; display: flex; align-items: center; justify-content: center; color: #5DCAA5; font-size: 26px; }
        .cv-chip {
          position: absolute; display: flex; align-items: center; gap: 8px; padding: 7px 12px 7px 8px;
          border-radius: 999px; background: rgba(11,20,32,.9); border: 1px solid rgba(93,202,165,.3);
          animation: floaty 6s ease-in-out infinite;
        }
        .cv-chip-1 { top: 22%; left: 26%; }
        .cv-chip-2 { bottom: 26%; right: 16%; animation-duration: 7.5s; }
        .cv-chip-icon { width: 24px; height: 24px; border-radius: 999px; background: #5DCAA5; display: flex; align-items: center; justify-content: center; font-size: 15px; color: #0B1420; }
        .cv-chip-icon--alt { background: #1D9E75; color: #fff; }
        .cv-chip-t { font-size: 12px; font-weight: 800; color: #5DCAA5; }
        .cv-nodo {
          position: absolute; bottom: 8%; left: 8%;
          display: flex; flex-direction: column; align-items: center; gap: 5px;
          animation: floaty 8s ease-in-out infinite;
        }
        .cv-hongo { width: 58px; height: auto; }
        .cv-nodo-t {
          font-size: 9.5px; font-weight: 800; letter-spacing: .08em; text-transform: uppercase;
          color: #5DCAA5; white-space: nowrap; opacity: .85;
        }

        .cv-panel { padding: 22px 8px 8px; }
        .cv-panel-row { display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px; }
        .cv-panel-label { font-size: 12px; font-weight: 700; letter-spacing: .08em; text-transform: uppercase; color: #6E8794; }
        .cv-panel-rate { font-size: 12px; font-weight: 700; color: #5DCAA5; }
        .cv-input-row {
          display: flex; align-items: center; gap: 12px; background: #111C28;
          border: 1px solid rgba(93,202,165,.2); border-radius: 18px; padding: 14px 18px;
        }
        .cv-moneda { font-size: 13px; font-weight: 800; color: #5DCAA5; background: rgba(93,202,165,.14); padding: 6px 10px; border-radius: 10px; }
        .cv-input {
          flex: 1; min-width: 0; background: transparent; border: none; outline: none;
          color: #E8F0F5; font-size: 26px; font-weight: 800; font-family: var(--font-display); text-align: right;
        }
        .cv-resumen { display: flex; align-items: center; justify-content: space-between; padding: 16px 4px 4px; }
        .cv-resumen-label { font-size: 12px; color: #6E8794; font-weight: 600; }
        .cv-resumen-valor { font-family: var(--font-display); font-weight: 800; font-size: 30px; color: #fff; letter-spacing: -.02em; }
        .cv-resumen-derecha { text-align: right; }
        .cv-resumen-comision { font-size: 16px; font-weight: 800; color: #5DCAA5; }
        .cv-nota { margin: 12px 4px 0; font-size: 11.5px; line-height: 1.5; color: #6E8794; }
      `}</style>
    </div>
  );
}
