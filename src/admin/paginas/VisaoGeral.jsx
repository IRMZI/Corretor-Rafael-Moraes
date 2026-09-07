import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useDados } from '../useDados.js';
import { query } from '../api.js';
import { numero, porcento, dinheiro, tempo } from '../formato.js';
import { Barras, Cartao, Erro, Esqueleto, Kpi, Periodo } from '../componentes/Basicos.jsx';
import GraficoSerie, { LegendaSerie } from '../componentes/GraficoSerie.jsx';

export default function VisaoGeral() {
  const [dias, setDias] = useState(30);

  const metricas = useDados(`/api/admin/metricas${query({ dias })}`);
  const campanhas = useDados(`/api/admin/campanhas${query({ dias })}`);

  const m = metricas.dados?.metricas;
  const janelas = metricas.dados?.janelas;
  const integracoes = metricas.dados?.integracoes;

  const topCampanhas = (campanhas.dados?.campanhas || [])
    .filter((item) => item.leads > 0)
    .slice(0, 8)
    .map((item) => ({
      nome: item.origem && item.origem !== item.campanha ? `${item.campanha} · ${item.origem}` : item.campanha,
      valor: item.leads,
      rotulo: `${numero(item.leads)} lead${item.leads === 1 ? '' : 's'}${
        item.taxa_conversao === null ? '' : ` · ${porcento(item.taxa_conversao)}`
      }`
    }));

  return (
    <div className="conteudo" style={{ padding: '24px', maxWidth: 1280, margin: '0 auto' }}>
      <div className="secao__titulo">
        <h2>Visão geral</h2>
      </div>
      <p className="secao__ajuda">Tráfego anônimo, jornada e conversões da landing page.</p>

      <div className="filtros">
        <Periodo valor={dias} aoTrocar={setDias} />
        {integracoes && !integracoes.meta && !integracoes.ga4 && (
          <span className="resumo-periodo">
            Evento de venda não configurado (META_* / GA4_* na API)
          </span>
        )}
      </div>

      {metricas.erro && <Erro mensagem={metricas.erro.message} aoTentarDeNovo={metricas.recarregar} />}

      {metricas.carregando && !m ? (
        <div className="kpis">
          <Esqueleto tipo="kpi" quantidade={6} />
        </div>
      ) : (
        m && (
          <div className="kpis">
            <Kpi rotulo="Visitantes únicos" valor={numero(m.visitantes)} nota={`nos últimos ${dias} dias`} />
            <Kpi
              rotulo="Acessos"
              valor={numero(m.acessos)}
              nota={`7d: ${numero(janelas.acessos_7)} · 30d: ${numero(janelas.acessos_30)} · 90d: ${numero(janelas.acessos_90)}`}
            />
            <Kpi
              rotulo="Conversões"
              valor={numero(m.conversoes)}
              nota={`7d: ${numero(janelas.conversoes_7)} · 30d: ${numero(janelas.conversoes_30)} · 90d: ${numero(janelas.conversoes_90)}`}
            />
            <Kpi rotulo="Taxa de conversão" valor={porcento(m.taxa_conversao)} nota="leads por acesso" />
            <Kpi
              rotulo="Tempo médio na página"
              valor={tempo(m.tempo_medio_segundos)}
              nota={`mediana: ${tempo(m.tempo_mediano_segundos)}`}
            />
            <Kpi
              rotulo="Vendas"
              valor={numero(m.vendas)}
              nota={m.receita ? `${dinheiro(m.receita)} em vendas` : 'marque a tag "vendido" no lead'}
            />
          </div>
        )
      )}

      <div className="colunas">
        <Cartao
          titulo="Acessos e conversões por dia"
          nota="Cada acesso é uma visita; cada conversão é um formulário enviado."
          acao={<LegendaSerie />}
        >
          {metricas.carregando && !m ? <Esqueleto tipo="grafico" /> : <GraficoSerie dados={m?.serie} />}
        </Cartao>

        <Cartao titulo="Jornada até a conversão" nota="Quantas visitas chegaram a cada etapa no período.">
          {m && (
            <Barras
              itens={[
                { nome: 'Visitas', valor: m.funil.sessoes },
                { nome: 'Rolaram metade da página', valor: m.funil.rolaram_metade },
                { nome: 'Começaram o formulário', valor: m.funil.iniciaram_formulario },
                { nome: 'Clicaram no WhatsApp', valor: m.funil.clicaram_whatsapp },
                { nome: 'Converteram', valor: m.funil.converteram }
              ]}
            />
          )}
        </Cartao>
      </div>

      <Cartao
        titulo="Campanhas que mais geram leads"
        nota="Leads gerados no período, por campanha de origem."
        acao={<Link to="/campanhas">ver todas</Link>}
      >
        {campanhas.carregando ? <Esqueleto quantidade={4} /> : <Barras itens={topCampanhas} conversao />}
      </Cartao>
    </div>
  );
}
