import Formulario from './Formulario.jsx';
import { IconeCheque, IconeSeta } from '../componentes/Icones.jsx';

const DIFERENCIAIS = ['Atendimento personalizado', 'Imóveis selecionados', 'Suporte durante toda a negociação'];

const CONFIANCA = [
  { destaque: 'CRECI', texto: ['Profissional', 'registrado'] },
  { destaque: '1:1', texto: ['Atendimento direto', 'com o corretor'] },
  { destaque: 'Sem custo', texto: ['Busca inicial', 'sem compromisso'] }
];

export default function Hero({ tipoPreSelecionado }) {
  return (
    <section className="hero">
      <div className="container hero__grid">
        {/* Coluna esquerda: proposta de valor */}
        <div className="hero__content">
          <span className="eyebrow">Atendimento imobiliário personalizado</span>
          <h1 className="hero__title">
            Encontre o imóvel ideal para o seu <em>próximo passo</em>.
          </h1>
          <p className="hero__lead">
            Atendimento personalizado para ajudar você a encontrar as melhores oportunidades de acordo com o
            seu perfil, objetivo e orçamento.
          </p>

          <ul className="hero__list">
            {DIFERENCIAIS.map((item) => (
              <li key={item}>
                <span className="check" aria-hidden="true">
                  <IconeCheque />
                </span>
                {item}
              </li>
            ))}
          </ul>

          <div className="hero__actions">
            <a href="#formulario" className="btn btn--primary btn--lg">
              Quero encontrar meu imóvel
              <IconeSeta />
            </a>
            <a href="#imoveis" className="btn btn--ghost btn--lg">
              Ver tipos de imóveis
            </a>
          </div>

          <div className="hero__trust">
            {CONFIANCA.map((item) => (
              <div className="hero__trust-item" key={item.destaque}>
                <div className="hero__trust-num">{item.destaque}</div>
                <div className="hero__trust-txt">
                  {item.texto[0]}
                  <br />
                  {item.texto[1]}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Coluna direita: card do formulário */}
        <div className="form-card" id="formulario">
          <div className="form-card__head">
            <h2>Receba opções de imóveis</h2>
            <p>Preencha seus dados e entraremos em contato para entender o que você procura.</p>
          </div>

          <Formulario tipoPreSelecionado={tipoPreSelecionado} />
        </div>
      </div>
    </section>
  );
}
