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

      <div className="cl-campo">
        <div className="cl-campo-row">
          <label className="cl-campo-l" htmlFor="cl-txs">Operaciones al mes</label>
          <span className="cl-campo-v">{txs}</span>
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
          <span className="cl-campo-v">{mxn(avg)}</span>
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
          <span className="cl-campo-v">{tarifa.toFixed(1)}%</span>
        </div>
        <input
          id="cl-tarifa"
          type="range" min="0" max="5" step="0.1"
          value={tarifa} onChange={(e) => setTarifa(Number(e.target.value))}
          className="cl-rango"
        />
        <div className="cl-escala">
          <span>0%</span>
          <span>típico 1.9%–2.5%</span>
          <span>5%</span>
        </div>
      </div>

      <div className="cl-resultado">
        <div className="cl-resultado-label">Ganancia estimada</div>
        <div className="cl-resultado-valor">{mxn(ganancia)}</div>
        <div className="cl-resultado-sub">al mes · {mxn(volumen)} movidos</div>
      </div>

      <style>{`
        .cl-card { background: #fff; border: 1px solid var(--linea); border-radius: 28px; padding: 34px; box-shadow: 0 30px 60px -40px rgba(11,30,38,.4); }
        .cl-t { font-size: 21px; letter-spacing: -.02em; margin-bottom: 26px; }
        .cl-campo { margin-bottom: 24px; }
        .cl-campo-row { display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 10px; }
        .cl-campo-l { font-size: 14px; font-weight: 600; color: var(--gris); white-space: nowrap; }
        .cl-campo-v { font-family: var(--font-display); font-weight: 800; font-size: 18px; color: var(--verde); }
        .cl-rango { width: 100%; -webkit-appearance: none; appearance: none; height: 6px; border-radius: 999px; background: #dce7e3; outline: none; }
        .cl-rango::-webkit-slider-thumb {
          -webkit-appearance: none; width: 24px; height: 24px; border-radius: 50%;
          background: var(--verde); border: 4px solid #fff; box-shadow: 0 2px 8px rgba(0,105,76,.35); cursor: pointer;
        }
        .cl-rango::-moz-range-thumb {
          width: 16px; height: 16px; border-radius: 50%; background: var(--verde); border: 4px solid #fff;
          box-shadow: 0 2px 8px rgba(0,105,76,.35); cursor: pointer;
        }
        .cl-escala {
          display: flex; justify-content: space-between; margin-top: 7px;
          font-size: 11px; color: var(--gris-2); font-weight: 600;
        }
        .cl-resultado {
          background: linear-gradient(140deg, var(--verde), var(--verde-claro));
          border-radius: 22px; padding: 26px; text-align: center; color: #fff;
        }
        .cl-resultado-label { font-size: 13px; font-weight: 700; opacity: .82; margin-bottom: 6px; }
        .cl-resultado-valor { font-family: var(--font-display); font-weight: 800; font-size: 40px; letter-spacing: -.03em; }
        .cl-resultado-sub { font-size: 13px; opacity: .82; margin-top: 4px; }
      `}</style>
    </div>
  );
}
