import { dataHora, tempo, ROTULO_EVENTO } from '../formato.js';
import { Etiqueta } from './Basicos.jsx';

function detalhe(evento) {
  if (evento.tipo === 'scroll') return `${evento.dados?.profundidade}% da página`;
  if (evento.dados?.texto) return `"${evento.dados.texto}"`;
  if (evento.dados?.titulo) return evento.dados.titulo;
  if (evento.dados?.motivo) return evento.dados.motivo;
  return null;
}

/* Linha do tempo das visitas: uma lista por sessão, com os eventos em ordem. */
export default function Jornada({ sessoes }) {
  if (!sessoes?.length) return <p className="carregando">Sem jornada registrada.</p>;

  return sessoes.map((sessao, indice) => (
    <div className="sessao-bloco" key={sessao.id}>
      <div className="sessao-bloco__cabecalho">
        <strong>Visita {indice + 1}</strong> · {dataHora(sessao.iniciada_em)} ·{' '}
        {tempo(sessao.duracao_segundos)} na página <Etiqueta tipo="brand">{sessao.campanha || 'direto'}</Etiqueta>
      </div>

      <ul className="jornada">
        {sessao.eventos?.length ? (
          sessao.eventos.map((evento) => (
            <li key={evento.id} className={['form_envio', 'whatsapp'].includes(evento.tipo) ? 'conversao' : ''}>
              <span className="jornada__hora">{dataHora(evento.ocorrido_em)}</span> ·{' '}
              <span className="jornada__tipo">{ROTULO_EVENTO[evento.tipo] || evento.tipo}</span>
              {detalhe(evento) && <span className="jornada__dados"> {detalhe(evento)}</span>}
            </li>
          ))
        ) : (
          <li>Sem eventos.</li>
        )}
      </ul>
    </div>
  ));
}
