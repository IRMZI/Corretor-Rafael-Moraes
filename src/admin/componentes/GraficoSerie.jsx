import { useRef, useState } from 'react';
import { numero, diaCurto } from '../formato.js';

/* Série temporal com duas linhas (acessos e conversões), grade discreta e
   cruz + tooltip no hover. SVG puro: sem biblioteca de gráfico. */
const L = 760;
const A = 260;
const MARGEM = { topo: 16, direita: 14, baixo: 28, esquerda: 44 };
const largura = L - MARGEM.esquerda - MARGEM.direita;
const altura = A - MARGEM.topo - MARGEM.baixo;

const SERIES = [
  { campo: 'acessos', nome: 'Acessos', cor: 'var(--serie-acessos)' },
  { campo: 'conversoes', nome: 'Conversões', cor: 'var(--serie-conversoes)' }
];

export default function GraficoSerie({ dados }) {
  const svgRef = useRef(null);
  const [ativo, setAtivo] = useState(null);

  if (!dados?.length) return <p className="carregando">Sem acessos no período.</p>;

  /* Topo arredondado para um número "redondo", para a grade ficar legível. */
  let maximo = Math.max(4, ...dados.flatMap((ponto) => [ponto.acessos, ponto.conversoes]));
  const passo = 10 ** Math.floor(Math.log10(maximo));
  maximo = Math.ceil(maximo / passo) * passo;

  const x = (indice) =>
    MARGEM.esquerda + (dados.length === 1 ? largura / 2 : (indice / (dados.length - 1)) * largura);
  const y = (valor) => MARGEM.topo + altura - (valor / maximo) * altura;

  const caminho = (campo) =>
    dados.map((ponto, indice) => `${indice ? 'L' : 'M'}${x(indice).toFixed(1)} ${y(ponto[campo]).toFixed(1)}`).join(' ');

  const salto = Math.max(1, Math.ceil(dados.length / 7));

  function mover(evento) {
    const caixa = svgRef.current.getBoundingClientRect();
    const proporcao = L / caixa.width;
    const posicao = (evento.clientX - caixa.left) * proporcao;
    const bruto = Math.round(((posicao - MARGEM.esquerda) / largura) * (dados.length - 1));
    setAtivo(Math.max(0, Math.min(dados.length - 1, bruto)));
  }

  const ponto = ativo === null ? null : dados[ativo];

  return (
    <div className="gr">
      <svg ref={svgRef} viewBox={`0 0 ${L} ${A}`} role="img" aria-label="Acessos e conversões por dia">
        {[0, 1, 2, 3, 4].map((passoGrade) => {
          const valor = (maximo / 4) * passoGrade;
          return (
            <g key={passoGrade}>
              <line className="gr__grade" x1={MARGEM.esquerda} y1={y(valor)} x2={L - MARGEM.direita} y2={y(valor)} />
              <text className="gr__eixo" x={MARGEM.esquerda - 8} y={y(valor) + 4} textAnchor="end">
                {numero(Math.round(valor))}
              </text>
            </g>
          );
        })}

        {dados.map((item, indice) =>
          indice % salto === 0 || indice === dados.length - 1 ? (
            <text key={item.dia} className="gr__eixo" x={x(indice)} y={A - 8} textAnchor="middle">
              {diaCurto(item.dia)}
            </text>
          ) : null
        )}

        {SERIES.map((serie) => (
          <path key={serie.campo} className="gr__linha" d={caminho(serie.campo)} stroke={serie.cor} />
        ))}

        {ponto && (
          <>
            <line className="gr__cruz" x1={x(ativo)} x2={x(ativo)} y1={MARGEM.topo} y2={MARGEM.topo + altura} />
            {SERIES.map((serie) => (
              <circle
                key={serie.campo}
                className="gr__ponto"
                r="5"
                fill={serie.cor}
                cx={x(ativo)}
                cy={y(ponto[serie.campo])}
              />
            ))}
          </>
        )}

        <rect
          className="gr__toque"
          x={MARGEM.esquerda}
          y={MARGEM.topo}
          width={largura}
          height={altura}
          onMouseMove={mover}
          onMouseLeave={() => setAtivo(null)}
        />
      </svg>

      {ponto && (
        <div
          className="dica"
          style={{
            left: `${Math.min(Math.max(0, (x(ativo) / L) * 100 + 2), 72)}%`,
            top: '8px'
          }}
        >
          <div className="dica__dia">{diaCurto(ponto.dia)}</div>
          {SERIES.map((serie) => (
            <div key={serie.campo} className="dica__linha">
              <span className="legenda__cor" style={{ background: serie.cor }} />
              {serie.nome}
              <span className="dica__valor">{numero(ponto[serie.campo])}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export function LegendaSerie() {
  return (
    <div className="legenda">
      {SERIES.map((serie) => (
        <span key={serie.campo} className="legenda__item">
          <span className="legenda__cor" style={{ background: serie.cor }} />
          {serie.nome}
        </span>
      ))}
    </div>
  );
}
