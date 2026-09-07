import { BENEFICIOS } from '../conteudo.js';
import { ICONES } from '../componentes/Icones.jsx';

export default function Beneficios() {
  return (
    <section className="section section--soft" id="beneficios">
      <div className="container">
        <div className="section-head reveal">
          <span className="eyebrow">Por que contar com um corretor</span>
          <h2>Mais segurança para encontrar o imóvel certo</h2>
          <p>
            Da primeira conversa à assinatura, cada etapa acompanhada de perto por quem conhece o mercado da
            região.
          </p>
        </div>

        <div className="cards cards--4">
          {BENEFICIOS.map((beneficio) => (
            <article className="card reveal" key={beneficio.titulo}>
              <div className="card__icon" aria-hidden="true">
                {ICONES[beneficio.icone]}
              </div>
              <h3>{beneficio.titulo}</h3>
              <p>{beneficio.texto}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
