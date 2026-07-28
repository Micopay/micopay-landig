/* MicoPay — acordeón de preguntas frecuentes. */
import React from 'react';

const FAQS = [
  ['¿Cómo funciona el escrow?', 'Al iniciar la operación tus USDC quedan bloqueados en un contrato inteligente. El proveedor solo los cobra cuando confirmas que recibiste tu efectivo. Si no se concreta, el reembolso es automático y completo.'],
  ['¿Cuánto me cuesta?', 'La tarifa la pone cada proveedor, normalmente entre 1.9% y 3%. MicoPay cobra una comisión de plataforma pequeña, ya incluida en el monto que ves antes de aceptar.'],
  ['¿Necesito cuenta bancaria o INE?', 'No. MicoPay está diseñado para quien no tiene acceso bancario: solo necesitas una billetera, y la app te ayuda a crearla en un minuto.'],
  ['¿Qué pasa si el proveedor no aparece?', 'Cancelas desde la app y tus USDC regresan íntegros. El incidente afecta la reputación en cadena del proveedor, que es pública.'],
  ['¿Sirve para recibir remesas?', 'Sí. Quien te envía manda USDC desde cualquier país y tú retiras pesos en efectivo cerca de casa, sin las comisiones de las casas de cambio tradicionales.'],
  ['¿Cuándo abre en mi ciudad?', 'Estamos activando ciudad por ciudad según el interés registrado. Déjanos tu correo abajo y te avisamos apenas abra la tuya.'],
];

export default function Faq() {
  const [open, setOpen] = React.useState(-1);

  return (
    <div className="lista">
      {FAQS.map(([q, a], i) => {
        const abierto = open === i;
        return (
          <div key={q} className="item">
            <button
              type="button"
              className="pregunta"
              onClick={() => setOpen(abierto ? -1 : i)}
              aria-expanded={abierto}
            >
              <span className="q-t">{q}</span>
              <span className="ms icono" style={{ transform: abierto ? 'rotate(180deg)' : 'rotate(0deg)' }}>expand_more</span>
            </button>
            <div
              className="respuesta"
              style={{
                maxHeight: abierto ? '300px' : '0px',
                opacity: abierto ? 1 : 0,
                paddingBottom: abierto ? '22px' : '0px',
              }}
            >
              <p className="a-t">{a}</p>
            </div>
          </div>
        );
      })}

      <style>{`
        .lista { display: grid; gap: 12px; }
        .item { border: 1px solid var(--linea); border-radius: 20px; overflow: hidden; background: #F9FCFB; }
        .pregunta {
          width: 100%; display: flex; align-items: center; justify-content: space-between; gap: 20px;
          padding: 22px 26px; background: transparent; border: none; cursor: pointer; text-align: left;
        }
        .q-t { font-family: var(--font-display); font-weight: 700; font-size: 17px; color: var(--tinta); }
        .icono { color: var(--verde-claro); font-size: 24px; flex-shrink: 0; transition: transform .25s; }
        .respuesta { padding: 0 26px; overflow: hidden; transition: all .28s ease; }
        .a-t { color: var(--gris); font-size: 15.5px; }
      `}</style>
    </div>
  );
}
