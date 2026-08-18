/* MicoPay — acordeón de preguntas frecuentes.

   OJO: el <style> de una isla React NO tiene scope. Clases prefijadas con
   `fq-` para no pisar las de otros componentes. */
import React from 'react';
import { FAQS } from '../data/faqs.js';


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
        .fq-item { border: var(--borde); border-radius: var(--r-sm); overflow: hidden; background: var(--papel); }
        .fq-pregunta {
          width: 100%; display: flex; align-items: center; justify-content: space-between; gap: 20px;
          padding: 22px 26px; background: transparent; border: none; cursor: pointer; text-align: left;
        }
        .fq-q { font-family: var(--font-display); font-weight: 700; font-size: 16.5px; color: var(--tinta); }
        .fq-icono { color: var(--naranja); font-size: 24px; flex-shrink: 0; transition: transform .25s; }
        .fq-respuesta { padding: 0 26px; overflow: hidden; transition: all .28s ease; }
        .fq-a { color: var(--gris); font-size: 15.5px; }
      `}</style>
    </div>
  );
}
