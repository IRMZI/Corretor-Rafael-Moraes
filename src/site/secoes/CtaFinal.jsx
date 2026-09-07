import { IconeSeta } from '../componentes/Icones.jsx';

export default function CtaFinal() {
  return (
    <section className="cta-final">
      <div className="container">
        <div className="cta-final__inner">
          <span className="eyebrow">Vamos começar</span>
          <h2>Seu próximo imóvel pode estar mais perto do que você imagina.</h2>
          <p>Conte o que você procura e receba um atendimento personalizado.</p>
          <a href="#formulario" className="btn btn--light btn--lg">
            Quero falar com um corretor
            <IconeSeta />
          </a>
        </div>
      </div>
    </section>
  );
}
