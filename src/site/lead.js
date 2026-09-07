import { CONFIG, ENDPOINT_LEAD } from './config.js';

/* Máscara de WhatsApp: (00) 00000-0000 */
export function mascaraTelefone(valor) {
  const n = valor.replace(/\D/g, '').slice(0, 11);
  if (n.length <= 2) return n.replace(/^(\d{0,2})/, '($1');
  if (n.length <= 6) return n.replace(/^(\d{2})(\d{0,4})/, '($1) $2');
  if (n.length <= 10) return n.replace(/^(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3');
  return n.replace(/^(\d{2})(\d{5})(\d{0,4})/, '($1) $2-$3');
}

/* As mesmas regras de antes: nome e sobrenome, DDD, e-mail plausível. */
export const REGRAS = {
  nome: (v) => v.trim().split(/\s+/).length >= 2 && v.trim().length >= 5,
  whatsapp: (v) => v.replace(/\D/g, '').length >= 10,
  email: (v) => /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i.test(v.trim()),
  cidade: (v) => v.trim().length >= 2,
  objetivo: (v) => v !== '',
  tipo_imovel: (v) => v !== ''
};

const CAMPOS_UTM = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'utm_id', 'gclid', 'fbclid'];

function lerUtm() {
  const parametros = new URLSearchParams(window.location.search);
  const utm = {};
  CAMPOS_UTM.forEach((campo) => {
    const valor = parametros.get(campo);
    if (valor) utm[campo] = valor;
  });
  /* Sem UTM na URL, aproveita a que o rastreamento guardou na entrada. */
  if (!Object.keys(utm).length && window.rastreio) return window.rastreio.utm();
  return utm;
}

export function montarPayload(campos) {
  return {
    ...campos,
    whatsapp_numeros: campos.whatsapp.replace(/\D/g, ''),
    origem: 'landing-page',
    pagina: window.location.href,
    referrer: document.referrer || null,
    utm: lerUtm(),
    /* Liga a conversão ao visitante anônimo e à jornada dele no painel. */
    ...(window.rastreio ? window.rastreio.ids() : {}),
    enviado_em: new Date().toISOString()
  };
}

export async function enviarLead(payload) {
  if (!ENDPOINT_LEAD) {
    /* Modo demonstração: nenhum dado é enviado para fora. */
    console.info('[LEAD] Nenhuma API configurada. Payload gerado:', payload);
    await new Promise((resolve) => setTimeout(resolve, 700));
    return { ok: true, demo: true };
  }

  const resposta = await fetch(ENDPOINT_LEAD, {
    method: CONFIG.metodo || 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  if (!resposta.ok) throw new Error(`Falha no envio: ${resposta.status}`);
  return { ok: true };
}

/* Conversão: dispara o Lead no Meta Pixel (e no GA4, se existir) e marca a
   jornada do visitante. Só metadados do formulário — nenhum dado pessoal. */
export function registrarConversao(payload) {
  if (typeof window.fbq === 'function') {
    window.fbq('track', 'Lead', {
      content_name: 'Formulário landing page',
      content_category: payload.objetivo,
      property_type: payload.tipo_imovel
    });
  }
  if (typeof window.gtag === 'function') window.gtag('event', 'generate_lead');
  if (window.rastreio) window.rastreio.conversao({ objetivo: payload.objetivo });
}

/* Abre a conversa já com o contexto do que a pessoa preencheu. */
export function abrirWhatsAppComContexto(payload) {
  const mensagem = `Olá! Meu nome é ${payload.nome}. Acabei de preencher o formulário do site procurando ${payload.tipo_imovel} em ${payload.cidade}.`;
  window.open(`https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(mensagem)}`, '_blank');
}
