import { LINK_WHATSAPP } from '../config.js';
import { IconeWhatsApp } from './Icones.jsx';

/* Botão flutuante, que aparece depois da primeira dobra. */
export default function BotaoWhatsApp({ visivel }) {
  return (
    <a
      href={LINK_WHATSAPP}
      className={`wa-float${visivel ? ' is-visible' : ''}`}
      target="_blank"
      rel="noopener"
      aria-label="Falar no WhatsApp"
    >
      <IconeWhatsApp />
      <span>WhatsApp</span>
    </a>
  );
}
