/* =========================================================
   CONFIGURAÇÃO — edite apenas este arquivo para publicar
   ========================================================= */
export const CONFIG = {
  nome: 'Rafael Moraes',                          // nome exibido no site
  logo: '/uploads/logo.png',                      // arquivo do logo (public/uploads/)
  creci: '00000',                                 // número do CRECI
  regiao: 'Novo Hamburgo e região',               // região de atuação
  email: 'rafaelmoraes@wallstreet.com.br',        // e-mail de contato
  whatsapp: '5551982606574',                      // somente números: 55 + DDD + número
  whatsappLabel: '(51) 98260-6574',               // como o telefone aparece na tela
  mensagemWhatsApp: 'Olá! Vim pelo site e gostaria de falar sobre imóveis.',

  /* INTEGRAÇÃO COM O BACKEND (repositório corretor-rafael-moraes-back)
     URL da API publicada, sem barra no final. Preenchendo, você ganha:
       - envio do lead para POST {api}/api/leads
       - rastreamento de visitantes e campanhas ({api}/track.js)
     Vazio ('') deixa o formulário em modo demonstração: valida, mostra o
     sucesso e registra o lead no console, sem enviar nada para fora.

     Em desenvolvimento, VITE_API_URL do .env.local tem prioridade. */
  api: import.meta.env.VITE_API_URL || 'https://api-rafael.pushagencia.com.br',

  /* Opcional: outro destino para o lead (webhook, Zapier, n8n, CRM).
     Quando preenchido, tem prioridade sobre a api acima. */
  endpoint: '',
  metodo: 'POST',

  /* Rastrear visitantes anônimos, jornada e campanha de origem? */
  rastrear: true,

  /* Após o envio, abrir automaticamente a conversa no WhatsApp? */
  abrirWhatsAppAposEnvio: false
};

export const API = (CONFIG.api || '').replace(/\/+$/, '');

/* Para onde o lead vai: webhook próprio, se houver; senão a API. */
export const ENDPOINT_LEAD = CONFIG.endpoint || (API ? `${API}/api/leads` : '');

export const LINK_WHATSAPP = `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(
  CONFIG.mensagemWhatsApp
)}`;
