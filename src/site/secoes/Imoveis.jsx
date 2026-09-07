import { TIPOS_IMOVEL } from '../conteudo.js';

export default function Imoveis() {
  return (
    <section className="section section--soft" id="imoveis">
      <div className="container">
        <div className="section-head section-head--center reveal">
          <span className="eyebrow">Perfis de imóvel</span>
          <h2>Encontre imóveis para todos os momentos</h2>
          <p>
            Seja para morar, investir ou dar o próximo passo, existe uma opção compatível com o seu objetivo.
          </p>
        </div>

        <div className="props">
          {TIPOS_IMOVEL.map((tipo) => (
            <article className="prop reveal" key={tipo.interesse}>
              <div className="prop__media">
                <span className="prop__tag">{tipo.etiqueta}</span>
                <img
                  src={tipo.imagem.src}
                  alt={tipo.imagem.alt}
                  loading="lazy"
                  decoding="async"
                  width={tipo.imagem.largura}
                  height={tipo.imagem.altura}
                  style={tipo.imagem.posicao ? { objectPosition: tipo.imagem.posicao } : undefined}
                />
              </div>
              <div className="prop__body">
                <h3>{tipo.titulo}</h3>
                <p>{tipo.texto}</p>
                {/* data-interesse pré-seleciona o tipo no formulário */}
                <a href="#formulario" className="btn btn--ghost" data-interesse={tipo.interesse}>
                  Tenho interesse
                </a>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
