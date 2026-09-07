import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAtraso, useDados } from '../useDados.js';
import { query } from '../api.js';
import { dataHora, numero, tempo } from '../formato.js';
import { Cartao, Dado, Erro, Etiqueta, Gaveta, Paginacao, Periodo, Vazio } from '../componentes/Basicos.jsx';
import Jornada from '../componentes/Jornada.jsx';

export default function Visitantes() {
  const [dias, setDias] = useState(30);
  const [pagina, setPagina] = useState(1);
  const [convertido, setConvertido] = useState('');
  const [busca, setBusca] = useState('');
  const buscaAdiada = useAtraso(busca);
  const [parametros, setParametros] = useSearchParams();
  const aberto = parametros.get('visitante');

  const { dados, carregando, erro, recarregar } = useDados(
    `/api/admin/visitantes${query({ dias, pagina, por_pagina: 25, convertido, busca: buscaAdiada })}`
  );

  function filtrar(acao) {
    setPagina(1);
    acao();
  }

  return (
    <div className="conteudo" style={{ padding: '24px', maxWidth: 1280, margin: '0 auto' }}>
      <div className="secao__titulo">
        <h2>Visitantes</h2>
      </div>
      <p className="secao__ajuda">
        Visitantes anônimos e a campanha que trouxe cada um. Clique na linha para ver a jornada completa.
      </p>

      <div className="filtros">
        <Periodo valor={dias} aoTrocar={(valor) => filtrar(() => setDias(valor))} />
        <select value={convertido} onChange={(evento) => filtrar(() => setConvertido(evento.target.value))}>
          <option value="">Todos</option>
          <option value="true">Só convertidos</option>
          <option value="false">Não convertidos</option>
        </select>
        <input
          type="search"
          placeholder="Buscar campanha ou origem"
          value={busca}
          onChange={(evento) => filtrar(() => setBusca(evento.target.value))}
        />
      </div>

      {erro && <Erro mensagem={erro.message} aoTentarDeNovo={recarregar} />}

      <Cartao>
        <div className="tabela-rolagem">
          <table>
            <thead>
              <tr>
                <th>Visitante</th>
                <th>Campanha</th>
                <th>Origem</th>
                <th>Dispositivo</th>
                <th className="num">Visitas</th>
                <th className="num">Tempo</th>
                <th>Último acesso</th>
                <th>Converteu</th>
              </tr>
            </thead>
            <tbody>
              {carregando && <Vazio colunas={8}>Carregando...</Vazio>}
              {!carregando && !dados?.visitantes.length && (
                <Vazio colunas={8}>Nenhum visitante no período.</Vazio>
              )}

              {dados?.visitantes.map((visitante) => (
                <tr
                  key={visitante.id}
                  className="clicavel"
                  onClick={() => setParametros({ visitante: String(visitante.id) })}
                >
                  <td>
                    <code>{visitante.visitante_uid.slice(0, 8)}</code>
                  </td>
                  <td>
                    <Etiqueta tipo="brand">{visitante.campanha || 'direto'}</Etiqueta>
                  </td>
                  <td>{visitante.origem || '—'}</td>
                  <td>{visitante.dispositivo || '—'}</td>
                  <td className="num">{numero(visitante.total_sessoes)}</td>
                  <td className="num">{tempo(visitante.tempo_total_segundos)}</td>
                  <td>{dataHora(visitante.ultimo_acesso_em)}</td>
                  <td>
                    {visitante.convertido ? (
                      <Etiqueta tipo="ok">{visitante.lead_nome || 'Sim'}</Etiqueta>
                    ) : (
                      <Etiqueta>Não</Etiqueta>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {dados && (
          <Paginacao
            pagina={dados.pagina}
            totalPaginas={dados.total_paginas}
            total={dados.total}
            aoTrocar={setPagina}
          />
        )}
      </Cartao>

      {aberto && <DetalheVisitante id={aberto} aoFechar={() => setParametros({})} />}
    </div>
  );
}

function DetalheVisitante({ id, aoFechar }) {
  const { dados, carregando, erro } = useDados(`/api/admin/visitantes/${id}`);
  const v = dados?.visitante;

  return (
    <Gaveta
      titulo={v ? `Visitante ${v.visitante_uid.slice(0, 8)}` : 'Visitante'}
      subtitulo={v && (v.convertido ? `Converteu em ${dataHora(v.convertido_em)}` : 'Ainda não converteu')}
      aoFechar={aoFechar}
    >
      {carregando && <p className="carregando">Carregando jornada...</p>}
      {erro && <Erro mensagem={erro.message} />}

      {v && (
        <>
          <div className="dados">
            <Dado rotulo="Campanha" valor={v.campanha || 'direto'} />
            <Dado rotulo="Origem" valor={v.origem} />
            <Dado rotulo="Mídia" valor={v.midia} />
            <Dado rotulo="ID da campanha" valor={v.campanha_id} />
            <Dado rotulo="Dispositivo" valor={v.dispositivo} />
            <Dado rotulo="Visitas" valor={numero(v.total_sessoes)} />
            <Dado rotulo="Tempo total" valor={tempo(v.tempo_total_segundos)} />
            <Dado rotulo="Primeiro acesso" valor={dataHora(v.primeiro_acesso_em)} />
          </div>

          {Object.keys(v.utm || {}).length > 0 && (
            <>
              <h3>Parâmetros de campanha</h3>
              <div className="dados">
                {Object.entries(v.utm).map(([chave, valor]) => (
                  <Dado key={chave} rotulo={chave} valor={valor} />
                ))}
              </div>
            </>
          )}

          {dados.lead && (
            <div className="aviso aviso--ok" style={{ marginBottom: 20 }}>
              Convertido: {dados.lead.nome} · {dados.lead.whatsapp}
            </div>
          )}

          <h3>Jornada</h3>
          <br />
          <Jornada sessoes={dados.sessoes} />
        </>
      )}
    </Gaveta>
  );
}
