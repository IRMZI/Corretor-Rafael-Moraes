import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { api, query } from '../api.js';
import { useAtraso, useDados } from '../useDados.js';
import { dataHora, dinheiro, linkWhatsApp, numero, ROTULO_STATUS } from '../formato.js';
import { Cartao, Erro, Etiqueta, Paginacao, Vazio } from '../componentes/Basicos.jsx';
import DetalheLead from './DetalheLead.jsx';

const POR_PAGINA = 25;

export default function Conversoes() {
  const [pagina, setPagina] = useState(1);
  const [status, setStatus] = useState('');
  const [tag, setTag] = useState('');
  const [busca, setBusca] = useState('');
  const buscaAdiada = useAtraso(busca);
  const [exportando, setExportando] = useState(false);
  const [parametros, setParametros] = useSearchParams();
  const aberto = parametros.get('lead');

  const filtros = { status, tag, busca: buscaAdiada };
  const lista = useDados(`/api/leads${query({ pagina, por_pagina: POR_PAGINA, ...filtros })}`);
  const tags = useDados('/api/leads/tags');

  function filtrar(acao) {
    setPagina(1);
    acao();
  }

  /* Exporta o que está filtrado, não só a página aberta. */
  async function exportarCsv() {
    setExportando(true);
    try {
      const linhas = [];
      let paginaAtual = 1;
      let totalPaginas = 1;

      do {
        const corpo = await api(`/api/leads${query({ pagina: paginaAtual, por_pagina: 100, ...filtros })}`);
        linhas.push(...corpo.leads);
        totalPaginas = corpo.total_paginas;
        paginaAtual += 1;
      } while (paginaAtual <= totalPaginas && paginaAtual <= 20);

      const colunas = [
        'id', 'nome', 'email', 'whatsapp', 'cidade', 'objetivo', 'tipo_imovel',
        'faixa_investimento', 'campanha', 'origem_trafego', 'midia', 'campanha_id',
        'status', 'tags', 'valor_venda', 'vendido_em', 'criado_em'
      ];

      const celula = (valor) => {
        const texto = Array.isArray(valor) ? valor.join(' ') : valor ?? '';
        return `"${String(texto).replace(/"/g, '""')}"`;
      };

      const csv = [
        colunas.join(';'),
        ...linhas.map((lead) => colunas.map((coluna) => celula(lead[coluna])).join(';'))
      ].join('\n');

      const url = URL.createObjectURL(new Blob([`﻿${csv}`], { type: 'text/csv;charset=utf-8' }));
      const link = document.createElement('a');
      link.href = url;
      link.download = `leads-${new Date().toISOString().slice(0, 10)}.csv`;
      link.click();
      URL.revokeObjectURL(url);
    } finally {
      setExportando(false);
    }
  }

  return (
    <div className="conteudo" style={{ padding: '24px', maxWidth: 1280, margin: '0 auto' }}>
      <div className="secao__titulo">
        <h2>Conversões</h2>
      </div>
      <p className="secao__ajuda">Quem preencheu o formulário. Marque tags e registre a venda.</p>

      <div className="filtros">
        <select value={status} onChange={(evento) => filtrar(() => setStatus(evento.target.value))}>
          <option value="">Todos os status</option>
          {Object.entries(ROTULO_STATUS).map(([chave, rotulo]) => (
            <option key={chave} value={chave}>
              {rotulo}
            </option>
          ))}
        </select>

        <select value={tag} onChange={(evento) => filtrar(() => setTag(evento.target.value))}>
          <option value="">Todas as tags</option>
          {tags.dados?.tags.map((item) => (
            <option key={item.tag} value={item.tag}>
              {item.tag} ({item.total})
            </option>
          ))}
        </select>

        <input
          type="search"
          placeholder="Nome, e-mail, WhatsApp ou cidade"
          value={busca}
          onChange={(evento) => filtrar(() => setBusca(evento.target.value))}
        />

        <div className="barra-acoes">
          <button type="button" className="btn btn--pequeno" onClick={exportarCsv} disabled={exportando}>
            {exportando ? 'Exportando...' : 'Exportar CSV'}
          </button>
        </div>
      </div>

      {lista.erro && <Erro mensagem={lista.erro.message} aoTentarDeNovo={lista.recarregar} />}

      <Cartao>
        <div className="tabela-rolagem">
          <table>
            <thead>
              <tr>
                <th>Lead</th>
                <th>Contato</th>
                <th>Interesse</th>
                <th>Campanha</th>
                <th>Status</th>
                <th>Tags</th>
                <th>Recebido</th>
              </tr>
            </thead>
            <tbody>
              {lista.carregando && <Vazio colunas={7}>Carregando...</Vazio>}
              {!lista.carregando && !lista.dados?.leads.length && (
                <Vazio colunas={7}>Nenhuma conversão encontrada.</Vazio>
              )}

              {lista.dados?.leads.map((lead) => (
                <tr key={lead.id} className="clicavel" onClick={() => setParametros({ lead: String(lead.id) })}>
                  <td>
                    <strong>{lead.nome}</strong>
                    <br />
                    <span className="kpi__nota">{lead.cidade}</span>
                  </td>
                  <td>
                    <div className="contato-linha">
                      {lead.whatsapp}
                      <a
                        className="icone-link"
                        href={linkWhatsApp(lead.whatsapp_numeros)}
                        target="_blank"
                        rel="noreferrer"
                        onClick={(evento) => evento.stopPropagation()}
                      >
                        abrir
                      </a>
                    </div>
                    <span className="kpi__nota">{lead.email}</span>
                  </td>
                  <td>
                    {lead.objetivo}
                    <br />
                    <span className="kpi__nota">{lead.tipo_imovel}</span>
                  </td>
                  <td>
                    <Etiqueta tipo="brand">{lead.campanha || 'direto'}</Etiqueta>
                  </td>
                  <td>
                    <Etiqueta tipo={lead.status === 'convertido' ? 'ok' : undefined}>
                      {ROTULO_STATUS[lead.status] || lead.status}
                    </Etiqueta>
                  </td>
                  <td>
                    <div className="etiquetas">
                      {lead.tags?.length
                        ? lead.tags.map((item) => (
                            <Etiqueta key={item} tipo={item === 'vendido' ? 'ok' : undefined}>
                              {item}
                            </Etiqueta>
                          ))
                        : '—'}
                    </div>
                    {lead.valor_venda && <span className="kpi__nota">{dinheiro(lead.valor_venda)}</span>}
                  </td>
                  <td>{dataHora(lead.criado_em)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {lista.dados && (
          <Paginacao
            pagina={lista.dados.pagina}
            totalPaginas={lista.dados.total_paginas}
            total={lista.dados.total}
            aoTrocar={setPagina}
          />
        )}
      </Cartao>

      {aberto && (
        <DetalheLead
          id={aberto}
          aoFechar={() => setParametros({})}
          aoMudar={() => {
            lista.recarregar();
            tags.recarregar();
          }}
        />
      )}
    </div>
  );
}
