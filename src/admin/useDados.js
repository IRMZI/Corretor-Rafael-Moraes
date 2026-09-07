import { useCallback, useEffect, useState } from 'react';
import { api } from './api.js';

/* Busca dados da API cuidando de carregando / erro / recarregar, e ignorando
   resposta de requisição antiga quando o filtro muda no meio do caminho. */
export function useDados(rota, dependencias = []) {
  const [dados, setDados] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);
  const [versao, setVersao] = useState(0);

  const recarregar = useCallback(() => setVersao((atual) => atual + 1), []);

  useEffect(() => {
    if (!rota) return undefined;
    const controle = new AbortController();
    let valendo = true;

    setCarregando(true);
    setErro(null);

    api(rota, { signal: controle.signal })
      .then((corpo) => valendo && setDados(corpo))
      .catch((falha) => {
        if (falha.name === 'AbortError' || !valendo) return;
        setErro(falha);
      })
      .finally(() => valendo && setCarregando(false));

    return () => {
      valendo = false;
      controle.abort();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rota, versao, ...dependencias]);

  return { dados, carregando, erro, recarregar };
}

/* Adia a busca enquanto o usuário digita. */
export function useAtraso(valor, milissegundos = 400) {
  const [adiado, setAdiado] = useState(valor);

  useEffect(() => {
    const relogio = setTimeout(() => setAdiado(valor), milissegundos);
    return () => clearTimeout(relogio);
  }, [valor, milissegundos]);

  return adiado;
}
