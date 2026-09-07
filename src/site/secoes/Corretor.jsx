import { CONFIG, LINK_WHATSAPP } from '../config.js';
import { ICONES, IconeWhatsApp } from '../componentes/Icones.jsx';

export default function Corretor() {
  const dados = [
    { icone: 'local', rotulo: 'Região de atuação:', valor: CONFIG.regiao },
    { icone: 'documento', rotulo: 'Registro profissional:', valor: `CRECI ${CONFIG.creci}` },
    { icone: 'relogio', rotulo: 'Atendimento:', valor: 'Segunda a sábado, horário comercial' }
  ];

  return (
    <section className="section" id="corretor">
      <div className="container broker">
        <div className="broker__photo reveal">
          <img
            src="/uploads/corretor.jpg"
            alt={`${CONFIG.nome} na entrada da Wall Street Imóveis`}
            loading="lazy"
            decoding="async"
            width="785"
            height="784"
            style={{ objectPosition: 'center 30%' }}
          />
          <div className="broker__badge">
            <strong>{CONFIG.nome}</strong>
            <span>Corretor de Imóveis · CRECI {CONFIG.creci}</span>
          </div>
        </div>

        <div className="broker__info reveal">
          <span className="eyebrow">Quem vai te atender</span>
          <h2>Um atendimento mais próximo e personalizado</h2>
          <p style={{ color: 'var(--muted)', fontSize: '1.0625rem' }}>
            Cada cliente possui objetivos diferentes. Por isso, o atendimento é feito de forma personalizada,
            buscando entender suas necessidades antes de apresentar qualquer imóvel.
          </p>

          <div className="broker__meta">
            {dados.map((item) => (
              <div key={item.rotulo}>
                {ICONES[item.icone]}
                <span>{item.rotulo}</span> <b>{item.valor}</b>
              </div>
            ))}
          </div>

          <div className="broker__actions">
            <a href={LINK_WHATSAPP} className="btn btn--primary" target="_blank" rel="noopener">
              <IconeWhatsApp className="icon" />
              Chamar no WhatsApp
            </a>
            <a href="#formulario" className="btn btn--ghost">
              Preencher formulário
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
