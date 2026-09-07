export const numero = (valor) => (Number(valor) || 0).toLocaleString('pt-BR');

export const porcento = (valor) =>
  valor === null || valor === undefined ? '—' : `${Number(valor).toLocaleString('pt-BR')}%`;

export const dinheiro = (valor) =>
  (Number(valor) || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

export function tempo(segundos) {
  const total = Math.round(Number(segundos) || 0);
  if (!total) return '—';
  if (total < 60) return `${total}s`;
  const minutos = Math.floor(total / 60);
  const resto = total % 60;
  if (minutos < 60) return `${minutos}min${resto ? ` ${resto}s` : ''}`;
  return `${Math.floor(minutos / 60)}h ${minutos % 60}min`;
}

export const dataHora = (iso) =>
  iso ? new Date(iso).toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' }) : '—';

export const dataCompleta = (iso) =>
  iso ? new Date(iso).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' }) : '—';

export const diaCurto = (dia) => {
  const [, mes, diaDoMes] = String(dia).split('-');
  return `${diaDoMes}/${mes}`;
};

export const ROTULO_STATUS = {
  novo: 'Novo',
  em_contato: 'Em contato',
  qualificado: 'Qualificado',
  convertido: 'Convertido',
  descartado: 'Descartado'
};

export const ROTULO_EVENTO = {
  pageview: 'Abriu a página',
  scroll: 'Rolou a página',
  clique: 'Clicou',
  form_inicio: 'Começou o formulário',
  form_envio: 'Enviou o formulário',
  whatsapp: 'Clicou no WhatsApp',
  heartbeat: 'Continuou na página',
  saida: 'Saiu da página'
};

/* Só os dígitos, no formato que o wa.me espera. */
export const linkWhatsApp = (numeros) => {
  const limpo = String(numeros || '').replace(/\D/g, '');
  if (!limpo) return null;
  return `https://wa.me/${limpo.startsWith('55') ? limpo : `55${limpo}`}`;
};
