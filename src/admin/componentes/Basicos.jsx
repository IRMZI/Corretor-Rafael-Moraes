import { useEffect } from 'react';

/* Peças pequenas usadas por todas as telas. */

export function Kpi({ rotulo, valor, nota }) {
  return (
    <div className="kpi">
      <div className="kpi__rotulo">{rotulo}</div>
      <div className="kpi__valor">{valor}</div>
      {nota && <div className="kpi__nota">{nota}</div>}
    </div>
  );
}

export function Cartao({ titulo, nota, acao, children }) {
  return (
    <div className="cartao">
      {(titulo || acao) && (
        <div className="cartao__cabecalho">
          {titulo && <h3>{titulo}</h3>}
          {acao}
        </div>
      )}
      {nota && <p className="cartao__nota">{nota}</p>}
      {children}
    </div>
  );
}

export function Etiqueta({ children, tipo }) {
  return <span className={`etiqueta${tipo ? ` etiqueta--${tipo}` : ''}`}>{children}</span>;
}

export function Vazio({ colunas, children }) {
  return (
    <tr>
      <td className="vazio" colSpan={colunas}>
        {children}
      </td>
    </tr>
  );
}

export function Esqueleto({ tipo = 'linha', quantidade = 1 }) {
  return Array.from({ length: quantidade }, (_, indice) => (
    <div key={indice} className={`esqueleto esqueleto--${tipo}`} />
  ));
}

export function Erro({ mensagem, aoTentarDeNovo }) {
  return (
    <div className="erro-caixa">
      <span>{mensagem}</span>
      {aoTentarDeNovo && (
        <button type="button" className="btn btn--pequeno" onClick={aoTentarDeNovo}>
          Tentar de novo
        </button>
      )}
    </div>
  );
}

/* Seletor de período usado na visão geral, campanhas e visitantes. */
export function Periodo({ valor, aoTrocar, opcoes = [7, 30, 90] }) {
  return (
    <div className="periodo">
      {opcoes.map((dias) => (
        <button
          key={dias}
          type="button"
          className={dias === valor ? 'ativo' : ''}
          onClick={() => aoTrocar(dias)}
        >
          {dias} dias
        </button>
      ))}
    </div>
  );
}

export function Paginacao({ pagina, totalPaginas, total, aoTrocar }) {
  if (totalPaginas <= 1) return null;
  return (
    <div className="paginacao">
      <button
        type="button"
        className="btn btn--pequeno"
        disabled={pagina <= 1}
        onClick={() => aoTrocar(pagina - 1)}
      >
        Anterior
      </button>
      <span>
        Página {pagina} de {totalPaginas} · {total.toLocaleString('pt-BR')} no total
      </span>
      <button
        type="button"
        className="btn btn--pequeno"
        disabled={pagina >= totalPaginas}
        onClick={() => aoTrocar(pagina + 1)}
      >
        Próxima
      </button>
    </div>
  );
}

/* Painel lateral. Fecha no Esc, no clique fora e no botão. */
export function Gaveta({ titulo, subtitulo, aoFechar, children }) {
  /* Esc fecha, e a rolagem da pagina de tras fica travada enquanto aberta. */
  useEffect(() => {
    const aoTeclar = (evento) => evento.key === 'Escape' && aoFechar();
    document.addEventListener('keydown', aoTeclar);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', aoTeclar);
      document.body.style.overflow = '';
    };
  }, [aoFechar]);

  return (
    <div
      className="gaveta"
      onClick={(evento) => {
        if (evento.target === evento.currentTarget) aoFechar();
      }}
    >
      <div className="gaveta__painel" role="dialog" aria-modal="true" aria-label={titulo}>
        <div className="gaveta__topo">
          <div>
            <h2>{titulo}</h2>
            {subtitulo && <div className="gaveta__sub">{subtitulo}</div>}
          </div>
          <button type="button" className="fechar" aria-label="Fechar" onClick={aoFechar}>
            &times;
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

export function Dado({ rotulo, valor }) {
  return (
    <div>
      <span className="dado__rotulo">{rotulo}</span>
      <div className="dado__valor">{valor ?? '—'}</div>
    </div>
  );
}

export function Barras({ itens, conversao }) {
  if (!itens.length) return <p className="carregando">Sem dados no período.</p>;
  const maximo = Math.max(...itens.map((item) => item.valor)) || 1;

  return (
    <div className="barras">
      {itens.map((item) => (
        <div key={item.nome}>
          <div className="barra__topo">
            <span className="barra__nome" title={item.nome}>
              {item.nome}
            </span>
            <span className="barra__valor">{item.rotulo ?? item.valor.toLocaleString('pt-BR')}</span>
          </div>
          <div className="barra__trilho">
            <div
              className={`barra__preenche${conversao ? ' barra__preenche--conversao' : ''}`}
              style={{ width: `${Math.max(1.5, (item.valor / maximo) * 100).toFixed(1)}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
