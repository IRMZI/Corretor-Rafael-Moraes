import { useRef, useState } from 'react';
import { PERGUNTAS } from '../conteudo.js';
import { IconeChevron } from '../componentes/Icones.jsx';

/* Acordeão: uma pergunta aberta por vez. A altura é medida no elemento para a
   transição funcionar (CSS não anima de 0 até auto). */
export default function Faq() {
  const [aberta, setAberta] = useState(null);
  const respostas = useRef([]);

  return (
    <section className="section section--soft" id="faq">
      <div className="container">
        <div className="section-head section-head--center reveal">
          <span className="eyebrow">Dúvidas frequentes</span>
          <h2>Perguntas que recebemos com frequência</h2>
        </div>

        <div className="faq">
          {PERGUNTAS.map((item, indice) => {
            const estaAberta = aberta === indice;
            const altura = respostas.current[indice]?.scrollHeight ?? 0;

            return (
              <article className={`faq__item${estaAberta ? ' is-open' : ''}`} key={item.pergunta}>
                <h3 style={{ margin: 0 }}>
                  <button
                    className="faq__q"
                    type="button"
                    aria-expanded={estaAberta}
                    aria-controls={`faq-a${indice}`}
                    id={`faq-q${indice}`}
                    onClick={() => setAberta(estaAberta ? null : indice)}
                  >
                    {item.pergunta}
                    <span className="faq__icon" aria-hidden="true">
                      <IconeChevron />
                    </span>
                  </button>
                </h3>

                <div
                  className="faq__a"
                  id={`faq-a${indice}`}
                  role="region"
                  aria-labelledby={`faq-q${indice}`}
                  ref={(elemento) => {
                    respostas.current[indice] = elemento;
                  }}
                  style={{ height: estaAberta ? altura : 0 }}
                >
                  <p>{item.resposta}</p>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
