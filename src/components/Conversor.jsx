/* MicoPay — mini simulador del conversor USDC→MXN en el hero.
   Tipo de cambio fijo por ahora (sin backend de precios todavía); solo
   ilustra la mecánica del producto para captar interés. */
import React from 'react';

const TIPO_CAMBIO = 18.7;
const COMISION = 0.5; // % de plataforma

function mxn(n) {
  return '$' + Math.round(n).toLocaleString('es-MX') + ' MXN';
}

export default function Conversor() {
  const [usdc, setUsdc] = React.useState(250);

  const onChange = (e) => {
    const v = parseFloat(String(e.target.value).replace(/[^0-9.]/g, ''));
    setUsdc(Number.isNaN(v) ? 0 : Math.min(v, 100000));
  };

  const recibes = usdc * TIPO_CAMBIO * (1 - COMISION / 100);

  return (
    <div className="conversor-wrap">
      <div className="glow glow-1" />
      <div className="glow glow-2" />

      <div className="tarjeta">
        <div className="mapa">
          <div className="grid-lines" />
          <div className="halo" />

          <div className="pin-centro">
            <span className="pin-ping" />
            <span className="pin-nucleo">
              <span className="ms">person_pin_circle</span>
            </span>
          </div>

          <div className="chip chip-1">
            <span className="chip-icon"><span className="ms">storefront</span></span>
            <span className="chip-t">0.3 km</span>
          </div>
          <div className="chip chip-2">
            <span className="chip-icon chip-icon--alt"><span className="ms">storefront</span></span>
            <span className="chip-t">0.5 km</span>
          </div>
          <div className="punto" />
        </div>

        <div className="panel">
          <div className="panel-row">
            <span className="panel-label">Retirar</span>
            <span className="panel-rate">1 USDC = {TIPO_CAMBIO.toFixed(2)} MXN</span>
          </div>
          <div className="input-row">
            <span className="moneda">USDC</span>
            <input
              value={usdc}
              onChange={onChange}
              inputMode="decimal"
              aria-label="Monto en USDC"
              className="input-usdc"
            />
          </div>
          <div className="resumen">
            <div>
              <div className="resumen-label">Recibes en efectivo</div>
              <div className="resumen-valor">{mxn(recibes)}</div>
            </div>
            <div className="resumen-derecha">
              <div className="resumen-label">Comisión</div>
              <div className="resumen-comision">{COMISION}%</div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .conversor-wrap { position: relative; }
        .glow { position: absolute; border-radius: 999px; filter: blur(60px); }
        .glow-1 { top: -30px; right: -20px; width: 180px; height: 180px; background: rgba(93,202,165,.35); }
        .glow-2 { bottom: -40px; left: -30px; width: 220px; height: 220px; background: rgba(0,105,76,.2); filter: blur(70px); }

        .tarjeta {
          position: relative; background: #0B1420; border-radius: 32px; padding: 18px;
          box-shadow: 0 40px 80px -30px rgba(11,30,38,.55); border: 1px solid rgba(93,202,165,.18);
        }
        .mapa {
          position: relative; height: 300px; border-radius: 22px; overflow: hidden;
          background: linear-gradient(135deg, #123326 0%, #0C2119 55%, #143A2B 100%);
        }
        .grid-lines {
          position: absolute; inset: 0;
          background-image: linear-gradient(rgba(93,202,165,.14) 1px, transparent 1px), linear-gradient(90deg, rgba(93,202,165,.14) 1px, transparent 1px);
          background-size: 52px 52px;
        }
        .halo { position: absolute; inset: 0; background: radial-gradient(circle at 50% 50%, rgba(93,202,165,.22), transparent 62%); }
        .pin-centro { position: absolute; top: 50%; left: 50%; transform: translate(-50%,-50%); display: flex; align-items: center; justify-content: center; }
        .pin-ping { position: absolute; width: 64px; height: 64px; border-radius: 999px; background: rgba(93,202,165,.35); animation: ping 2.8s cubic-bezier(0,0,.2,1) infinite; }
        .pin-nucleo { position: relative; width: 56px; height: 56px; border-radius: 999px; background: #0B1420; border: 3px solid #5DCAA5; display: flex; align-items: center; justify-content: center; color: #5DCAA5; font-size: 26px; }
        .chip {
          position: absolute; display: flex; align-items: center; gap: 8px; padding: 7px 12px 7px 8px;
          border-radius: 999px; background: rgba(11,20,32,.9); border: 1px solid rgba(93,202,165,.3);
          animation: floaty 6s ease-in-out infinite;
        }
        .chip-1 { top: 22%; left: 26%; }
        .chip-2 { bottom: 26%; right: 16%; animation-duration: 7.5s; }
        .chip-icon { width: 24px; height: 24px; border-radius: 999px; background: #5DCAA5; display: flex; align-items: center; justify-content: center; font-size: 15px; color: #0B1420; }
        .chip-icon--alt { background: #1D9E75; color: #fff; }
        .chip-t { font-size: 12px; font-weight: 800; color: #5DCAA5; }
        .punto { position: absolute; bottom: 18%; left: 18%; width: 30px; height: 30px; border-radius: 999px; background: rgba(93,202,165,.25); border: 1px solid rgba(93,202,165,.45); }

        .panel { padding: 22px 8px 8px; }
        .panel-row { display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px; }
        .panel-label { font-size: 12px; font-weight: 700; letter-spacing: .08em; text-transform: uppercase; color: #6E8794; }
        .panel-rate { font-size: 12px; font-weight: 700; color: #5DCAA5; }
        .input-row {
          display: flex; align-items: center; gap: 12px; background: #111C28;
          border: 1px solid rgba(93,202,165,.2); border-radius: 18px; padding: 14px 18px;
        }
        .moneda { font-size: 13px; font-weight: 800; color: #5DCAA5; background: rgba(93,202,165,.14); padding: 6px 10px; border-radius: 10px; }
        .input-usdc {
          flex: 1; min-width: 0; background: transparent; border: none; outline: none;
          color: #E8F0F5; font-size: 26px; font-weight: 800; font-family: var(--font-display); text-align: right;
        }
        .resumen { display: flex; align-items: center; justify-content: space-between; padding: 16px 4px 4px; }
        .resumen-label { font-size: 12px; color: #6E8794; font-weight: 600; }
        .resumen-valor { font-family: var(--font-display); font-weight: 800; font-size: 30px; color: #fff; letter-spacing: -.02em; }
        .resumen-derecha { text-align: right; }
        .resumen-comision { font-size: 16px; font-weight: 800; color: #5DCAA5; }
      `}</style>
    </div>
  );
}
