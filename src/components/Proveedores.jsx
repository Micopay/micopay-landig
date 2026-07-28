/* MicoPay — vitrina de proveedores de ejemplo (datos ilustrativos, no reales
   todavía: el objetivo en esta etapa es comunicar el producto, no listar
   proveedores en operación). Filtro client-side simple. */
import React from 'react';

const TIPO_CAMBIO = 18.7;
const COMISION = 0.5;
const USDC_EJEMPLO = 250;

const BASE = [
  { id: '1', name: 'Farmacia Guadalupe', km: 0.3, walk: 5, rate: 2.1, completion: 98, trades: 312, tier: 'Maestro', icon: 'storefront' },
  { id: '2', name: 'Tienda Don Pepe', km: 0.5, walk: 8, rate: 2.3, completion: 95, trades: 187, tier: 'Avanzado', icon: 'storefront' },
  { id: '3', name: 'Café El Parque', km: 0.8, walk: 12, rate: 2.5, completion: 92, trades: 89, tier: 'Inicial', icon: 'person' },
  { id: '4', name: 'OXXO Roma Norte', km: 1.2, walk: 15, rate: 1.9, completion: 99, trades: 1024, tier: 'Maestro', icon: 'storefront' },
];

const FILTROS = [
  ['todos', 'Todos'],
  ['cerca', 'Más cerca'],
  ['tarifa', 'Mejor tarifa'],
  ['reputacion', 'Mejor reputación'],
];

const TIER_CLASS = { Maestro: 'tier-maestro', Avanzado: 'tier-avanzado', Inicial: 'tier-inicial' };

function mxn(n) {
  return '$' + Math.round(n).toLocaleString('es-MX') + ' MXN';
}

export default function Proveedores() {
  const [filtro, setFiltro] = React.useState('todos');

  const ordenados = React.useMemo(() => {
    const copia = BASE.slice();
    if (filtro === 'cerca') copia.sort((a, b) => a.km - b.km);
    else if (filtro === 'tarifa') copia.sort((a, b) => a.rate - b.rate);
    else if (filtro === 'reputacion') copia.sort((a, b) => b.completion - a.completion || b.trades - a.trades);
    return copia;
  }, [filtro]);

  return (
    <div>
      <div className="filtros">
        {FILTROS.map(([key, label]) => (
          <button
            key={key}
            type="button"
            className="pill"
            data-on={filtro === key}
            onClick={() => setFiltro(key)}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="grid">
        {ordenados.map((m) => {
          const payout = USDC_EJEMPLO * TIPO_CAMBIO * (1 - (m.rate + COMISION) / 100);
          return (
            <div key={m.id} className="tarjeta">
              <div className="tarjeta-top">
                <div className="icono"><span className="ms">{m.icon}</span></div>
                <span className={`badge-tier ${TIER_CLASS[m.tier]}`}>{m.tier}</span>
              </div>
              <div>
                <h3 className="nombre">{m.name}</h3>
                <div className="meta"><span className="ms">location_on</span>{m.km} km · {m.walk} min a pie</div>
              </div>
              <div className="recibes">
                <div className="recibes-label">Recibes con {USDC_EJEMPLO} USDC</div>
                <div className="recibes-valor">{mxn(payout)}</div>
              </div>
              <div className="datos">
                <div><span className="datos-k">Tarifa </span><strong>{m.rate}%</strong></div>
                <div><span className="datos-k">Éxito </span><strong>{m.completion}%</strong></div>
              </div>
              <div className="pie">
                <span className="pie-t">{m.trades.toLocaleString('es-MX')} operaciones</span>
              </div>
            </div>
          );
        })}
      </div>

      <style>{`
        .filtros { display: flex; flex-wrap: wrap; gap: 10px; margin-bottom: 28px; }
        .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 18px; }
        .tarjeta {
          background: #fff; border: 1px solid var(--linea); border-radius: 24px; padding: 24px;
          display: flex; flex-direction: column; gap: 16px; transition: box-shadow .25s, transform .25s;
        }
        .tarjeta:hover { box-shadow: 0 24px 44px -26px rgba(11,30,38,.35); transform: translateY(-3px); }
        .tarjeta-top { display: flex; align-items: flex-start; justify-content: space-between; gap: 12px; }
        .icono { width: 44px; height: 44px; border-radius: 14px; background: var(--verde-suave); display: flex; align-items: center; justify-content: center; color: var(--verde); }
        .badge-tier { padding: 5px 11px; font-size: 11px; font-weight: 800; border-radius: 999px; letter-spacing: .03em; }
        .tier-maestro { background: var(--verde); color: #fff; }
        .tier-avanzado { background: var(--verde-suave); color: var(--verde); }
        .tier-inicial { background: #f0f4f2; color: #5f7681; }
        .nombre { font-size: 17px; letter-spacing: -.015em; margin-bottom: 4px; }
        .meta { display: flex; align-items: center; gap: 6px; font-size: 13px; color: var(--gris-2); font-weight: 600; }
        .meta .ms { font-size: 15px; }
        .recibes { background: var(--fondo); border-radius: 16px; padding: 14px 16px; }
        .recibes-label { font-size: 11px; font-weight: 800; letter-spacing: .06em; text-transform: uppercase; color: var(--gris-2); margin-bottom: 2px; }
        .recibes-valor { font-family: var(--font-display); font-weight: 800; font-size: 21px; letter-spacing: -.02em; color: var(--verde); }
        .datos { display: flex; gap: 18px; font-size: 13px; }
        .datos-k { color: var(--gris-2); font-weight: 600; }
        .pie { padding-top: 14px; border-top: 1px solid var(--linea-suave); }
        .pie-t { font-size: 12px; color: var(--gris-2); font-weight: 600; }
      `}</style>
    </div>
  );
}
