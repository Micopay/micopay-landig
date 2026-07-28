/* MicoPay — acordeón de preguntas frecuentes.

   OJO: el <style> de una isla React NO tiene scope. Clases prefijadas con
   `fq-` para no pisar las de otros componentes. */
import React from 'react';

const FAQS = [
  ['¿Cómo funciona el escrow?', 'Al iniciar la operación tus USDC quedan bloqueados en un contrato inteligente. El proveedor solo los cobra cuando confirmas que recibiste tu efectivo. Si no se concreta, el reembolso es automático y completo.'],
  ['¿Cuánto me cuesta?', 'No hay una tarifa única: cada proveedor pone la suya, normalmente entre 1.9% y 2.5%, más una comisión de plataforma pequeña. Antes de aceptar ves el monto exacto en pesos que vas a recibir, ya con todo descontado — nunca hay cobros después.'],
  ['¿Necesito cuenta bancaria?', 'No. MicoPay está diseñado para quien no tiene acceso bancario: solo necesitas una billetera, y la app te ayuda a crearla en un minuto.'],
  ['¿Qué pasa si el proveedor no aparece?', 'Cancelas desde la app y tus USDC regresan íntegros. El incidente afecta la reputación en cadena del proveedor, que es pública.'],
  ['¿Sirve para recibir remesas?', 'Sí. Quien te envía manda USDC desde cualquier país y tú retiras pesos en efectivo cerca de casa, sin las comisiones de las casas de cambio tradicionales.'],
  ['¿Cuándo abre en mi ciudad?', 'Estamos activando ciudad por ciudad según el interés registrado. Déjanos tu correo abajo y te avisamos apenas abra la tuya.'],
];

export default function Faq() {
  const [open, setOpen] = React.useState(-1);

  return (
    <div className="fq-lista">
      {FAQS.map(([q, a], i) => {
        const abierto = open === i;
        return (
          <div key={q} className="fq-item">
            <button
              type="button"
              className="fq-pregunta"
              onClick={() => setOpen(abierto ? -1 : i)}
              aria-expanded={abierto}
            >
              <span className="fq-q">{q}</span>
              <span className="ms fq-icono" style={{ transform: abierto ? 'rotate(180deg)' : 'rotate(0deg)' }}>expand_more</span>
            </button>
            <div
              className="fq-respuesta"
              style={{
                maxHeight: abierto ? '300px' : '0px',
                opacity: abierto ? 1 : 0,
                paddingBottom: abierto ? '22px' : '0px',
              }}
            >
              <p className="fq-a">{a}</p>
            </div>
          </div>
        );
      })}

      <style>{`
        .fq-lista { display: grid; gap: 12px; }
        .fq-item { border: 1px solid var(--linea); border-radius: 20px; overflow: hidden; background: #F9FCFB; }
        .fq-pregunta {
          width: 100%; display: flex; align-items: center; justify-content: space-between; gap: 20px;
          padding: 22px 26px; background: transparent; border: none; cursor: pointer; text-align: left;
        }
        .fq-q { font-family: var(--font-display); font-weight: 700; font-size: 17px; color: var(--tinta); }
        .fq-icono { color: var(--verde-claro); font-size: 24px; flex-shrink: 0; transition: transform .25s; }
        .fq-respuesta { padding: 0 26px; overflow: hidden; transition: all .28s ease; }
        .fq-a { color: var(--gris); font-size: 15.5px; }
      `}</style>
    </div>
  );
}
