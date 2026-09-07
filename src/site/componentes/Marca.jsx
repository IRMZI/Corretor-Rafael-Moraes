import { useEffect, useState } from 'react';
import { CONFIG } from '../config.js';

/* Logo: usa o arquivo de CONFIG.logo quando ele existe; senão mantém a marca
   provisória em SVG. Mesma regra do site original. */
export default function Marca({ como: Tag = 'div', ...resto }) {
  const [temLogo, setTemLogo] = useState(false);

  useEffect(() => {
    if (!CONFIG.logo) return undefined;
    const teste = new Image();
    teste.onload = () => setTemLogo(true);
    teste.src = CONFIG.logo;
    return () => {
      teste.onload = null;
    };
  }, []);

  return (
    <Tag className="brand" {...resto}>
      {temLogo ? (
        <img className="brand__mark" src={CONFIG.logo} alt={CONFIG.nome} />
      ) : (
        <svg className="brand__mark" viewBox="0 0 40 40" fill="none" aria-hidden="true">
          <path d="M4 34V14l6-4 6 4v6h5v-9l6-4 6 4v23H4Z" stroke="currentColor" strokeWidth="2.2" strokeLinejoin="round" />
          <path d="M9 24h3M9 29h3M25 20h3M25 25h3M25 30h3" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
        </svg>
      )}
      <span className="brand__text">
        <span className="brand__name">{CONFIG.nome}</span>
        <span className="brand__role">Corretor de Imóveis</span>
      </span>
    </Tag>
  );
}
