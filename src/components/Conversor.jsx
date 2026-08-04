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
      <div className="cv-card">
        <div className="cv-mapa">
          <div className="cv-grid-lines" />
          <div className="cv-halo" />

          <div className="cv-pin-centro">
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
              <path d="M23 30v17a9 7 0 0 0 18 0V30Z" fill="#F5F1E8" stroke="#16130F" stroke-width="2" />
              <path d="M4 33C4 16 17 5 32 5s28 11 28 28Z" fill="#D9420B" stroke="#16130F" stroke-width="2" />
              <circle cx="20" cy="21" r="3.4" fill="#16130F" />
              <circle cx="41" cy="16" r="4.2" fill="#16130F" />
            </svg>
            <span className="cv-nodo-t" translate="no">Red micelial MicoPay</span>
          </div>
        </div>

        <div className="cv-panel">
          <div className="cv-panel-row">
            <span className="cv-panel-label">Retirar</span>
            {/* translate="no" + una sola interpolación: el traductor del
                navegador rompe React si parte el texto en varios nodos, y
                además corrompe cifras (18.70 -> 18,70). */}
            <span className="cv-panel-rate" translate="no">{`1 USDC ≈ ${TIPO_CAMBIO.toFixed(2)} MXN`}</span>
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
              <div className="cv-resumen-valor" translate="no">{mxn(recibes)}</div>
            </div>
            <div className="cv-resumen-derecha">
              <div className="cv-resumen-label">Tarifa total</div>
              <div className="cv-resumen-comision" translate="no">{`${TARIFA_MIN}%–${TARIFA_MAX}%`}</div>
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

        .cv-card {
          position: relative; background: var(--papel); border-radius: var(--r-sm); padding: 14px;
          box-shadow: 8px 8px 0 var(--tinta); border: var(--borde);
        }
        .cv-mapa {
          position: relative; height: 300px; border-radius: var(--r-sm); overflow: hidden;
          background: var(--verde); border: 2px solid var(--tinta);
        }
        .cv-grid-lines {
          position: absolute; inset: 0;
          background-image: linear-gradient(rgba(245,241,232,.16) 1px, transparent 1px), linear-gradient(90deg, rgba(245,241,232,.16) 1px, transparent 1px);
          background-size: 44px 44px;
        }
        .cv-halo { display: none; }
        .cv-pin-centro { position: absolute; top: 50%; left: 50%; transform: translate(-50%,-50%); display: flex; align-items: center; justify-content: center; }
        .cv-pin-nucleo { position: relative; width: 54px; height: 54px; border-radius: var(--r-full); background: var(--naranja); border: 2px solid var(--tinta); display: flex; align-items: center; justify-content: center; color: var(--papel); font-size: 26px; }
        .cv-chip {
          position: absolute; display: flex; align-items: center; gap: 8px; padding: 5px 10px 5px 6px;
          border-radius: var(--r-sm); background: var(--papel); border: 2px solid var(--tinta);
          box-shadow: var(--sombra-sm);
        }
        .cv-chip-1 { top: 20%; left: 24%; }
        .cv-chip-2 { bottom: 24%; right: 14%; }
        .cv-chip-icon { width: 22px; height: 22px; border-radius: var(--r-sm); background: var(--tinta); display: flex; align-items: center; justify-content: center; font-size: 14px; color: var(--papel); }
        .cv-chip-icon--alt { background: var(--naranja); color: var(--papel); }
        .cv-chip-t { font-size: 12px; font-weight: 700; color: var(--tinta); }
        .cv-nodo {
          position: absolute; bottom: 8%; left: 8%;
          display: flex; flex-direction: column; align-items: center; gap: 5px;
        }
        .cv-hongo { width: 58px; height: auto; }
        .cv-nodo-t {
          font-size: 9px; font-weight: 700; letter-spacing: .12em; text-transform: uppercase;
          color: var(--papel); background: var(--tinta); padding: 3px 6px; white-space: nowrap;
        }

        .cv-panel { padding: 20px 6px 6px; }
        .cv-panel-row { display: flex; align-items: center; justify-content: space-between; margin-bottom: 10px; }
        .cv-panel-label { font-size: 11px; font-weight: 700; letter-spacing: .14em; text-transform: uppercase; color: var(--papel); background: var(--tinta); padding: 3px 8px; }
        .cv-panel-rate { font-size: 12px; font-weight: 700; color: var(--gris); }
        .cv-input-row {
          display: flex; align-items: center; gap: 12px; background: var(--fondo);
          border: var(--borde); border-radius: var(--r-sm); padding: 12px 16px;
        }
        .cv-moneda { font-size: 12px; font-weight: 700; color: var(--papel); background: var(--verde); padding: 5px 9px; border-radius: var(--r-sm); }
        .cv-input {
          flex: 1; min-width: 0; background: transparent; border: none; outline: none;
          color: var(--tinta); font-size: 26px; font-weight: 700; font-family: var(--font-display);
          font-variation-settings: "wdth" 100; text-align: right;
        }
        /* La cifra en pesos es lo único naranja del panel: es el efectivo */
        .cv-resumen {
          display: flex; align-items: center; justify-content: space-between;
          margin-top: 14px; padding: 14px 16px; background: var(--tinta);
        }
        .cv-resumen-label { font-size: 11px; color: var(--gris-3); font-weight: 600; letter-spacing: .04em; text-transform: uppercase; }
        .cv-resumen-valor { font-family: var(--font-display); font-weight: 800; font-size: 30px; color: var(--naranja-claro); letter-spacing: -.02em; font-variation-settings: "wdth" 108; }
        .cv-resumen-derecha { text-align: right; }
        .cv-resumen-comision { font-size: 16px; font-weight: 700; color: var(--papel); }
        .cv-nota { margin: 12px 2px 0; font-size: 11.5px; line-height: 1.5; color: var(--gris-2); }
      `}</style>
    </div>
  );
}
