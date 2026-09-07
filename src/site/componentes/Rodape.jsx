import { CONFIG, LINK_WHATSAPP } from '../config.js';
import Marca from './Marca.jsx';

export default function Rodape() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer__grid">
          <div>
            <Marca style={{ marginBottom: 14 }} />
            <p>
              Atendimento imobiliário personalizado para quem quer comprar, vender ou investir com segurança.
            </p>
            <p>CRECI {CONFIG.creci}</p>
          </div>

          <div>
            <h4>Contato</h4>
            <ul>
              <li>
                <a href={LINK_WHATSAPP} target="_blank" rel="noopener">
                  {CONFIG.whatsappLabel} · WhatsApp
                </a>
              </li>
              <li>
                <a href={`mailto:${CONFIG.email}`}>{CONFIG.email}</a>
              </li>
              <li>{CONFIG.regiao}</li>
            </ul>
          </div>

          <div>
            <h4>Navegação</h4>
            <ul>
              <li>
                <a href="#formulario">Receber opções de imóveis</a>
              </li>
              <li>
                <a href="#imoveis">Tipos de imóveis</a>
              </li>
              <li>
                <a href="#faq">Dúvidas frequentes</a>
              </li>
              <li>
                <a href="/politica-de-privacidade.html">Política de Privacidade</a>
              </li>
            </ul>
          </div>
        </div>

        <div className="footer__bottom">
          <span>© {new Date().getFullYear()} {CONFIG.nome}. Todos os direitos reservados.</span>
          <a href="/politica-de-privacidade.html">Política de Privacidade</a>
        </div>
      </div>
    </footer>
  );
}
