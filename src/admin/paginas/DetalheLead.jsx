import { useEffect, useState } from 'react';
import { api } from '../api.js';
import { useDados } from '../useDados.js';
import { dataCompleta, dinheiro, linkWhatsApp, ROTULO_STATUS } from '../formato.js';
import { Dado, Erro, Gaveta } from '../componentes/Basicos.jsx';
import Jornada from '../componentes/Jornada.jsx';

const TAG_VENDIDO = 'vendido';
const SUGESTOES = ['quente', 'morno', 'frio', 'visita-agendada', 'proposta', TAG_VENDIDO, 'perdido'];

function rotuloIntegracao(resultado) {
  if (!resultado) return 'não enviado';
  if (resultado.status === 'enviado') return 'enviado ✓';
  if (resultado.status === 'nao_configurado') return 'não configurado';
  return `falhou (${resultado.http || resultado.erro || '?'})`;
}

export default function DetalheLead({ id, aoFechar, aoMudar }) {
  const { dados, carregando, erro, recarregar } = useDados(`/api/leads/${id}`);
  const lead = dados?.lead;
  const venda = dados?.venda;

  const [tags, setTags] = useState(null);
  const [valorVenda, setValorVenda] = useState('');
  const [novaTag, setNovaTag] = useState('');
  const [salvando, setSalvando] = useState(false);
  const [aviso, setAviso] = useState(null);

  /* Espelha o lead carregado no formulário, sem perder edição em andamento. */
  useEffect(() => {
    if (!lead) return;
    setTags(lead.tags || []);
    setValorVenda(lead.valor_venda ?? '');
  }, [lead?.id, lead?.atualizado_em]);

  function alternar(tag) {
    setTags((atuais) => (atuais.includes(tag) ? atuais.filter((item) => item !== tag) : [...atuais, tag]));
  }

  function adicionarTag(evento) {
    evento.preventDefault();
    const limpa = novaTag.trim().toLowerCase();
    if (!limpa) return;
    setTags((atuais) => (atuais.includes(limpa) ? atuais : [...atuais, limpa]));
    setNovaTag('');
  }

  async function salvarTags() {
    setSalvando(true);
    setAviso(null);
    try {
      const corpo = await api(`/api/leads/${id}/tags`, {
        method: 'PUT',
        body: { tags, valor_venda: valorVenda === '' ? null : Number(valorVenda) }
      });

      let mensagem = 'Tags salvas.';
      if (corpo.integracoes) {
        mensagem += ` Evento de venda: Meta ${rotuloIntegracao(corpo.integracoes.meta)} · GA4 ${rotuloIntegracao(
          corpo.integracoes.ga4
        )}.`;
      }
      setAviso({ ok: true, mensagem });
      recarregar();
      aoMudar?.();
    } catch (falha) {
      setAviso({ ok: false, mensagem: falha.message });
    } finally {
      setSalvando(false);
    }
  }

  async function trocarStatus(status) {
    setAviso(null);
    try {
      await api(`/api/leads/${id}`, { method: 'PATCH', body: { status } });
      setAviso({ ok: true, mensagem: 'Status atualizado.' });
      recarregar();
      aoMudar?.();
    } catch (falha) {
      setAviso({ ok: false, mensagem: falha.message });
    }
  }

  async function reenviarVenda() {
    setSalvando(true);
    setAviso(null);
    try {
      const corpo = await api(`/api/leads/${id}/venda/reenviar`, { method: 'POST' });
      setAviso({
        ok: true,
        mensagem: `Reenviado. Meta ${rotuloIntegracao(corpo.integracoes.meta)} · GA4 ${rotuloIntegracao(
          corpo.integracoes.ga4
        )}.`
      });
      recarregar();
    } catch (falha) {
      setAviso({ ok: false, mensagem: falha.message });
    } finally {
      setSalvando(false);
    }
  }

  const sugestoes = [...SUGESTOES, ...(tags || []).filter((tag) => !SUGESTOES.includes(tag))];

  return (
    <Gaveta
      titulo={lead?.nome || 'Conversão'}
      subtitulo={lead && `${lead.email} · ${lead.whatsapp}`}
      aoFechar={aoFechar}
    >
      {carregando && !lead && <p className="carregando">Carregando conversão...</p>}
      {erro && <Erro mensagem={erro.message} aoTentarDeNovo={recarregar} />}

      {lead && (
        <>
          <div className="acoes-gaveta">
            <a
              className="btn btn--pequeno"
              href={linkWhatsApp(lead.whatsapp_numeros)}
              target="_blank"
              rel="noreferrer"
            >
              Falar no WhatsApp
            </a>
            <a className="btn btn--pequeno" href={`mailto:${lead.email}`}>
              Enviar e-mail
            </a>
          </div>

          <div className="dados">
            <Dado rotulo="Cidade" valor={lead.cidade} />
            <Dado rotulo="Objetivo" valor={lead.objetivo} />
            <Dado rotulo="Tipo de imóvel" valor={lead.tipo_imovel} />
            <Dado rotulo="Faixa" valor={lead.faixa_investimento || 'não informada'} />
            <Dado rotulo="Campanha" valor={lead.campanha || 'direto'} />
            <Dado rotulo="Origem" valor={lead.origem_trafego} />
            <Dado rotulo="Mídia" valor={lead.midia} />
            <Dado rotulo="ID da campanha" valor={lead.campanha_id} />
            <Dado rotulo="Recebido em" valor={dataCompleta(lead.criado_em)} />
            <Dado rotulo="Página de origem" valor={lead.pagina} />
          </div>

          <h3>Status</h3>
          <br />
          <select value={lead.status} onChange={(evento) => trocarStatus(evento.target.value)}>
            {Object.entries(ROTULO_STATUS).map(([chave, rotulo]) => (
              <option key={chave} value={chave}>
                {rotulo}
              </option>
            ))}
          </select>

          <h3 style={{ marginTop: 22 }}>Tags</h3>
          <p className="cartao__nota">
            Marcar <strong>vendido</strong> registra a venda e dispara o evento de conversão.
          </p>

          <div className="editor-tags">
            {sugestoes.map((tag) => (
              <button
                key={tag}
                type="button"
                className={`tag-alternavel${tags?.includes(tag) ? ' marcada' : ''}${
                  tag === TAG_VENDIDO ? ' venda' : ''
                }`}
                onClick={() => alternar(tag)}
              >
                {tag}
              </button>
            ))}
          </div>

          <form onSubmit={adicionarTag} className="campo">
            <label htmlFor="novaTag">Nova tag</label>
            <input
              id="novaTag"
              type="text"
              placeholder="Digite e pressione Enter"
              value={novaTag}
              onChange={(evento) => setNovaTag(evento.target.value)}
            />
          </form>

          <div className="campo">
            <label htmlFor="valorVenda">Valor da venda (opcional)</label>
            <input
              id="valorVenda"
              type="number"
              min="0"
              step="0.01"
              placeholder="Ex.: 450000"
              value={valorVenda}
              onChange={(evento) => setValorVenda(evento.target.value)}
            />
          </div>

          <button
            type="button"
            className="btn btn--primario btn--bloco"
            onClick={salvarTags}
            disabled={salvando}
          >
            {salvando ? 'Salvando...' : 'Salvar tags'}
          </button>

          {aviso && <div className={`aviso aviso--${aviso.ok ? 'ok' : 'erro'}`}>{aviso.mensagem}</div>}

          {venda && (
            <div style={{ marginTop: 26 }}>
              <h3>Evento de venda</h3>
              <p className="cartao__nota">
                Disparado quando a tag "vendido" foi marcada. O mesmo ID evita contagem dupla no pixel.
              </p>
              <div className="dados">
                <Dado rotulo="ID do evento" valor={venda.evento_uid} />
                <Dado rotulo="Valor" valor={venda.valor ? dinheiro(venda.valor) : 'não informado'} />
                <Dado rotulo="Meta (API de conversões)" valor={rotuloIntegracao(venda.integracoes?.meta)} />
                <Dado rotulo="Google Analytics 4" valor={rotuloIntegracao(venda.integracoes?.ga4)} />
              </div>
              <button type="button" className="btn btn--pequeno" onClick={reenviarVenda} disabled={salvando}>
                Reenviar evento
              </button>

              <h3 style={{ marginTop: 22 }}>Pixel de venda (navegador)</h3>
              <p className="cartao__nota">
                Opcional: cole numa página de obrigado se quiser disparar também pelo navegador.
              </p>
              <pre className="codigo">
{`fbq('track', 'Purchase', { value: ${Number(venda.valor || 0)}, currency: '${venda.moeda || 'BRL'}' },
     { eventID: '${venda.evento_uid}' });`}
              </pre>
            </div>
          )}

          <h3 style={{ marginTop: 26 }}>Jornada até a conversão</h3>
          <br />
          {dados.jornada ? (
            <Jornada sessoes={dados.jornada.sessoes} />
          ) : (
            <p className="carregando">Este lead chegou sem rastreamento de jornada.</p>
          )}
        </>
      )}
    </Gaveta>
  );
}
