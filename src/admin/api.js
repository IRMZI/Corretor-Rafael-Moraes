/* Cliente da API.
 *
 * As chamadas do painel saem para a PROPRIA origem (/api/admin/...), e a Vercel
 * as reescreve para a API (vercel.json). Isso e o que mantem o cookie de sessao
 * como cookie proprio do site.
 *
 * Chamando a API direto no dominio dela, o cookie vira cookie de terceiros: o
 * Safari bloqueia por padrao, e o Chrome bloqueia em janela anonima e para quem
 * desliga cookies de terceiros. O login respondia 200, o navegador descartava o
 * cookie, a requisicao seguinte voltava 401 e o painel piscava de volta para a
 * tela de login - so para algumas pessoas, dependendo do navegador.
 *
 * VITE_ADMIN_API_URL existe para apontar o painel para outra API em
 * desenvolvimento. Vazio (o padrao) significa mesma origem. */
export const URL_API = (import.meta.env.VITE_ADMIN_API_URL || '').replace(/\/+$/, '');

export class ErroApi extends Error {
  constructor(mensagem, status, detalhes) {
    super(mensagem);
    this.status = status;
    this.detalhes = detalhes;
  }
}

export async function api(rota, opcoes = {}) {
  let resposta;
  try {
    resposta = await fetch(URL_API + rota, {
      method: opcoes.method || 'GET',
      headers: opcoes.body ? { 'Content-Type': 'application/json' } : undefined,
      body: opcoes.body ? JSON.stringify(opcoes.body) : undefined,
      credentials: 'include',
      signal: opcoes.signal
    });
  } catch {
    throw new ErroApi('Não foi possível falar com a API. Verifique a conexão.', 0);
  }

  const corpo = await resposta.json().catch(() => ({}));

  if (resposta.status === 401 && !rota.endsWith('/login')) {
    /* Sessao caiu no meio do uso: o App ouve isso e volta para a tela de login. */
    window.dispatchEvent(new CustomEvent('sessao-expirada'));
  }
  if (!resposta.ok) throw new ErroApi(corpo.erro || 'Falha na requisição.', resposta.status, corpo.detalhes);
  return corpo;
}

/* Monta a query string ignorando filtro vazio. */
export function query(parametros) {
  const busca = new URLSearchParams();
  for (const [chave, valor] of Object.entries(parametros)) {
    if (valor !== '' && valor !== null && valor !== undefined) busca.set(chave, valor);
  }
  const texto = busca.toString();
  return texto ? `?${texto}` : '';
}
