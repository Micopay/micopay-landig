/* MicoPay — calculadora de ganancia estimada para proveedores.
   Las tres variables son editables porque la tarifa la fija cada proveedor:
   dejarla fija comunicaba que MicoPay la impone, que es justo lo contrario
   del modelo.

   OJO: el <style> de una isla React NO tiene scope. Clases prefijadas con
   `cl-` para no pisar las de otros componentes (Contact.jsx también usaba
   `.campo`, y se pisaban entre sí). */
import React from 'react';

function mxn(n) {
  return '$' + Math.round(n).toLocaleString('es-MX') + ' MXN';
}

export default function Calculadora() {
  const [txs, setTxs] = React.useState(100);
  const [avg, setAvg] = React.useState(1200);
  const [tarifa, setTarifa] = React.useState(2);

  const volumen = txs * avg;
  const ganancia = volumen * (tarifa / 100);

  return (
    <div className="cl-card">
      <h3 className="cl-t">Calcula tu ganancia</h3>
      <p className="cl-nota">
        Proyección ilustrativa — no hay operaciones reales todavía; los números cambian cuando
        el producto esté en operación.
      </p>

      <div className="cl-campo">
        <div className="cl-campo-row">
          <label className="cl-campo-l" htmlFor="cl-txs">Operaciones al mes</label>
          <span className="cl-campo-v" translate="no">{txs}</span>
        </div>
        <input
          id="cl-txs"
          type="range" min="10" max="500" step="10"
          value={txs} onChange={(e) => setTxs(Number(e.target.value))}
          className="cl-rango"
        />
      </div>

      <div className="cl-campo">
        <div className="cl-campo-row">
          <label className="cl-campo-l" htmlFor="cl-avg">Monto promedio</label>
          <span className="cl-campo-v" translate="no">{mxn(avg)}</span>
        </div>
        <input
          id="cl-avg"
          type="range" min="200" max="5000" step="100"
          value={avg} onChange={(e) => setAvg(Number(e.target.value))}
          className="cl-rango"
        />
      </div>

      <div className="cl-campo">
        <div className="cl-campo-row">
          <label className="cl-campo-l" htmlFor="cl-tarifa">Tu comisión por operación</label>
          <span className="cl-campo-v" translate="no">{`${tarifa.toFixed(1)}%`}</span>
        </div>
        <input
          id="cl-tarifa"
          type="range" min="0" max="5" step="0.1"
          value={tarifa} onChange={(e) => setTarifa(Number(e.target.value))}
          className="cl-rango"
        />
        <div className="cl-escala" translate="no">
          <span>0%</span>
          <span>típico 1.9%–2.5%</span>
          <span>5%</span>
        </div>
      </div>

      <div className="cl-resultado">
        <div className="cl-resultado-label">Ganancia estimada</div>
        <div className="cl-resultado-valor" translate="no">{mxn(ganancia)}</div>
        <div className="cl-resultado-sub">{`al mes · ${mxn(volumen)} movidos`}</div>
      </div>

      <style>{`
        .cl-card {
          background: var(--papel); border: var(--borde); border-radius: var(--r-sm);
          padding: 30px; box-shadow: 8px 8px 0 var(--tinta);
        }
        .cl-t { font-size: 21px; letter-spacing: -.01em; margin-bottom: 8px; }
        .cl-nota { font-size: 13px; color: var(--gris); margin-bottom: 22px; }
        .cl-campo { margin-bottom: 22px; }
        .cl-campo-row { display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 9px; }
        .cl-campo-l { font-size: 14px; font-weight: 600; color: var(--gris); white-space: nowrap; }
        .cl-campo-v { font-family: var(--font-display); font-weight: 800; font-size: 18px; color: var(--tinta); }
        .cl-rango {
          width: 100%; -webkit-appearance: none; appearance: none; height: 8px;
          border-radius: 0; background: var(--fondo); border: 2px solid var(--tinta); outline: none;
        }
        .cl-rango::-webkit-slider-thumb {
          -webkit-appearance: none; width: 20px; height: 20px; border-radius: 0;
          background: var(--naranja); border: 2px solid var(--tinta); cursor: pointer;
        }
        .cl-rango::-moz-range-thumb {
          width: 16px; height: 16px; border-radius: 0; background: var(--naranja);
          border: 2px solid var(--tinta); cursor: pointer;
        }
        .cl-escala {
          display: flex; justify-content: space-between; margin-top: 7px;
          font-size: 11px; color: var(--gris); font-weight: 600;
        }
        /* El resultado es dinero: tinta sólida y la cifra en naranja */
        .cl-resultado {
          background: var(--tinta); border-radius: var(--r-sm);
          padding: 24px; text-align: center; color: var(--papel);
        }
        .cl-resultado-label { font-size: 11px; font-weight: 700; letter-spacing: .12em; text-transform: uppercase; color: var(--gris-3); margin-bottom: 6px; }
        .cl-resultado-valor { font-family: var(--font-display); font-weight: 800; font-size: 40px; letter-spacing: -.03em; color: var(--naranja-claro); font-variation-settings: "wdth" 110; }
        .cl-resultado-sub { font-size: 13px; color: var(--gris-3); margin-top: 4px; }
      `}</style>
    </div>
  );
}
