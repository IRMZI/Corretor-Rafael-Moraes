import { PASSOS } from '../conteudo.js';

export default function Processo() {
  return (
    <section className="section" id="processo">
      <div className="container">
        <div className="section-head section-head--center reveal">
          <span className="eyebrow">Como funciona</span>
          <h2>Encontrar seu próximo imóvel pode ser simples.</h2>
          <p>Três passos para sair da pesquisa e chegar à visita.</p>
        </div>

        <div className="steps">
          {PASSOS.map((passo) => (
            <article className="step reveal" key={passo.numero}>
              <div className="step__num">{passo.numero}</div>
              <h3>{passo.titulo}</h3>
              <p>{passo.texto}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
