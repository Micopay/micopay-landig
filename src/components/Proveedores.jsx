/* MicoPay — vitrina de proveedores de ejemplo (datos ilustrativos, no reales
   todavía: el objetivo en esta etapa es comunicar el producto, no listar
   proveedores en operación). Filtro client-side simple.

   OJO: el <style> de una isla React NO tiene scope. Clases prefijadas con
   `pv-` para no pisar las de otros componentes. */
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

const TIER_CLASS = { Maestro: 'pv-tier-maestro', Avanzado: 'pv-tier-avanzado', Inicial: 'pv-tier-inicial' };

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
      <div className="pv-filtros">
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

      <div className="pv-grid">
        {ordenados.map((m) => {
          const payout = USDC_EJEMPLO * TIPO_CAMBIO * (1 - (m.rate + COMISION) / 100);
          return (
            <div key={m.id} className="pv-card">
              <div className="pv-card-top">
                <div className="pv-icono"><span className="ms">{m.icon}</span></div>
                <span className={`pv-badge-tier ${TIER_CLASS[m.tier]}`}>{m.tier}</span>
              </div>
              <div className="pv-cuerpo">
                <div>
                  <h3 className="pv-nombre" translate="no">{m.name}</h3>
                  <div className="pv-meta"><span className="ms">location_on</span>{`${m.km} km · ${m.walk} min a pie`}</div>
                </div>
                <div className="pv-recibes">
                  <div className="pv-recibes-label">{`Recibes con ${USDC_EJEMPLO} USDC`}</div>
                  <div className="pv-recibes-valor" translate="no">{mxn(payout)}</div>
                </div>
                <div className="pv-datos">
                  <div><span className="pv-datos-k">Tarifa </span><strong translate="no">{`${m.rate}%`}</strong></div>
                  <div><span className="pv-datos-k">Éxito </span><strong translate="no">{`${m.completion}%`}</strong></div>
                </div>
              </div>
              <div className="pv-pie">
                <span className="pv-pie-t">{`${m.trades.toLocaleString('es-MX')} operaciones`}</span>
              </div>
            </div>
          );
        })}
      </div>

      <style>{`
        .pv-filtros { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 28px; }
        .pv-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 20px; }
        /* Cada tarjeta es un letrero: canto vivo, borde de tinta, sombra sólida */
        .pv-card {
          background: var(--papel); border: var(--borde); border-radius: var(--r-sm); padding: 0;
          display: flex; flex-direction: column; box-shadow: var(--sombra);
          transition: transform .12s ease-out, box-shadow .12s ease-out;
        }
        .pv-card-top {
          display: flex; align-items: center; justify-content: space-between; gap: 12px;
          padding: 10px 14px; border-bottom: 2px solid var(--tinta); background: var(--verde-suave);
        }
        /* El ícono ya no vive en un tile redondeado propio */
        .pv-icono { display: flex; align-items: center; color: var(--verde); font-size: 20px; }
        .pv-badge-tier {
          padding: 3px 9px; font-size: 10px; font-weight: 700; border-radius: var(--r-sm);
          letter-spacing: .1em; text-transform: uppercase; border: 1.5px solid var(--tinta);
        }
        .pv-tier-maestro { background: var(--tinta); color: var(--papel); }
        .pv-tier-avanzado { background: var(--naranja-suave); color: var(--tinta); }
        .pv-tier-inicial { background: var(--papel); color: var(--tinta); }
        .pv-cuerpo { padding: 16px 14px; display: flex; flex-direction: column; gap: 14px; }
        .pv-nombre { font-size: 17px; letter-spacing: -.01em; margin-bottom: 3px; }
        .pv-meta { display: flex; align-items: center; gap: 5px; font-size: 12.5px; color: var(--gris); font-weight: 600; }
        .pv-meta .ms { font-size: 15px; }
        /* La cifra en pesos, invertida: es el renglón que se lee de lejos */
        .pv-recibes { background: var(--tinta); border-radius: var(--r-sm); padding: 12px 14px; }
        .pv-recibes-label { font-size: 10px; font-weight: 700; letter-spacing: .1em; text-transform: uppercase; color: var(--gris-3); margin-bottom: 2px; }
        .pv-recibes-valor { font-family: var(--font-display); font-weight: 800; font-size: 22px; letter-spacing: -.02em; color: var(--naranja-claro); font-variation-settings: "wdth" 108; }
        .pv-datos { display: flex; gap: 16px; font-size: 13px; }
        .pv-datos-k { color: var(--gris-2); font-weight: 600; }
        .pv-pie { padding: 9px 14px; border-top: 2px solid var(--tinta); background: var(--fondo); }
        .pv-pie-t { font-size: 11.5px; color: var(--gris); font-weight: 600; }

        @media (hover: hover) and (pointer: fine) {
          .pv-card:hover { transform: translate(-2px, -2px); box-shadow: 6px 6px 0 var(--tinta); }
        }
      `}</style>
    </div>
  );
}
