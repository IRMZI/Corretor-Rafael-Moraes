import { useMemo, useState } from 'react';
import { useDados } from '../useDados.js';
import { query } from '../api.js';
import { dinheiro, numero, porcento, tempo } from '../formato.js';
import { Cartao, Erro, Esqueleto, Etiqueta, Periodo, Vazio } from '../componentes/Basicos.jsx';

const COLUNAS = [
  { chave: 'campanha', rotulo: 'Campanha', texto: true },
  { chave: 'origem', rotulo: 'Origem', texto: true },
  { chave: 'midia', rotulo: 'Mídia', texto: true },
  { chave: 'acessos', rotulo: 'Acessos' },
  { chave: 'visitantes', rotulo: 'Visitantes' },
  { chave: 'leads', rotulo: 'Leads' },
  { chave: 'taxa_conversao', rotulo: 'Conversão' },
  { chave: 'tempo_medio_segundos', rotulo: 'Tempo médio' },
  { chave: 'vendas', rotulo: 'Vendas' }
];

export default function Campanhas() {
  const [dias, setDias] = useState(30);
  const [ordem, setOrdem] = useState({ chave: 'leads', crescente: false });
  const { dados, carregando, erro, recarregar } = useDados(`/api/admin/campanhas${query({ dias })}`);

  const linhas = useMemo(() => {
    const lista = [...(dados?.campanhas || [])];
    const { chave, crescente } = ordem;
    lista.sort((a, b) => {
      const valorA = a[chave] ?? (typeof a[chave] === 'string' ? '' : -1);
      const valorB = b[chave] ?? (typeof b[chave] === 'string' ? '' : -1);
      const comparacao =
        typeof valorA === 'string' ? valorA.localeCompare(valorB, 'pt-BR') : Number(valorA) - Number(valorB);
      return crescente ? comparacao : -comparacao;
    });
    return lista;
  }, [dados, ordem]);

  const totais = useMemo(
    () =>
      linhas.reduce(
        (soma, item) => ({
          acessos: soma.acessos + item.acessos,
          visitantes: soma.visitantes + item.visitantes,
          leads: soma.leads + item.leads,
          vendas: soma.vendas + item.vendas,
          receita: soma.receita + Number(item.receita || 0)
        }),
        { acessos: 0, visitantes: 0, leads: 0, vendas: 0, receita: 0 }
      ),
    [linhas]
  );

  function ordenarPor(chave) {
    setOrdem((atual) =>
      atual.chave === chave ? { chave, crescente: !atual.crescente } : { chave, crescente: false }
    );
  }

  return (
    <div className="conteudo" style={{ padding: '24px', maxWidth: 1280, margin: '0 auto' }}>
      <div className="secao__titulo">
        <h2>Campanhas</h2>
      </div>
      <p className="secao__ajuda">
        Identificadas pela UTM da URL (ou por gclid/fbclid quando a UTM não vem). Clique no título da
        coluna para ordenar.
      </p>

      <div className="filtros">
        <Periodo valor={dias} aoTrocar={setDias} />
      </div>

      {erro && <Erro mensagem={erro.message} aoTentarDeNovo={recarregar} />}

      <Cartao>
        <div className="tabela-rolagem">
          <table>
            <thead>
              <tr>
                {COLUNAS.map((coluna) => (
                  <th
                    key={coluna.chave}
                    className={`ordenavel${coluna.texto ? '' : ' num'}`}
                    onClick={() => ordenarPor(coluna.chave)}
                  >
                    {coluna.rotulo}{' '}
                    {ordem.chave === coluna.chave && (
                      <span className="seta">{ordem.crescente ? '▲' : '▼'}</span>
                    )}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {carregando && <Vazio colunas={9}>Carregando...</Vazio>}
              {!carregando && !linhas.length && <Vazio colunas={9}>Nenhum acesso registrado no período.</Vazio>}

              {linhas.map((item) => (
                <tr key={`${item.campanha}-${item.origem}-${item.midia}`}>
                  <td>
                    <Etiqueta tipo="brand">{item.campanha}</Etiqueta>
                  </td>
                  <td>{item.origem}</td>
                  <td>{item.midia}</td>
                  <td className="num">{numero(item.acessos)}</td>
                  <td className="num">{numero(item.visitantes)}</td>
                  <td className="num">{numero(item.leads)}</td>
                  <td className="num">{porcento(item.taxa_conversao)}</td>
                  <td className="num">{tempo(item.tempo_medio_segundos)}</td>
                  <td className="num">
                    {item.vendas ? `${numero(item.vendas)} · ${dinheiro(item.receita)}` : '—'}
                  </td>
                </tr>
              ))}

              {linhas.length > 1 && (
                <tr className="linha-total">
                  <td colSpan={3}>Total</td>
                  <td className="num">{numero(totais.acessos)}</td>
                  <td className="num">{numero(totais.visitantes)}</td>
                  <td className="num">{numero(totais.leads)}</td>
                  <td className="num">
                    {porcento(totais.acessos ? Number(((totais.leads / totais.acessos) * 100).toFixed(2)) : null)}
                  </td>
                  <td className="num">—</td>
                  <td className="num">
                    {totais.vendas ? `${numero(totais.vendas)} · ${dinheiro(totais.receita)}` : '—'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Cartao>
    </div>
  );
}
