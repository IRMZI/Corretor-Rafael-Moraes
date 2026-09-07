/* Cliente da API. O painel roda em outro dominio (Vercel) e a sessao vive num
   cookie do dominio da API, entao toda chamada precisa de credentials. */
export const URL_API = (import.meta.env.VITE_API_URL || 'https://api-rafael.pushagencia.com.br').replace(/\/+$/, '');

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
