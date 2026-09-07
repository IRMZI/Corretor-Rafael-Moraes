import { useEffect, useRef, useState } from 'react';
import { API, CONFIG } from './config.js';

/* Carrega o track.js da API uma única vez. Ele identifica o visitante anônimo,
   guarda a campanha de origem e registra a jornada. */
export function useRastreio() {
  useEffect(() => {
    if (!API || !CONFIG.rastrear || window.rastreio) return;
    const script = document.createElement('script');
    script.src = `${API}/track.js`;
    script.defer = true;
    document.head.appendChild(script);
  }, []);
}

/* Header encolhe e botão flutuante aparece conforme a rolagem. */
export function useRolagem() {
  const [rolou, setRolou] = useState(false);
  const [passouDobra, setPassouDobra] = useState(false);

  useEffect(() => {
    const aoRolar = () => {
      setRolou(window.scrollY > 8);
      setPassouDobra(window.scrollY > 480);
    };
    window.addEventListener('scroll', aoRolar, { passive: true });
    aoRolar();
    return () => window.removeEventListener('scroll', aoRolar);
  }, []);

  return { rolou, passouDobra };
}

/* Rolagem suave nas âncoras internas, compensando o header fixo.
   Um listener só, no documento, em vez de um por link. */
export function useAncoras(aoEscolherInteresse) {
  useEffect(() => {
    function aoClicar(evento) {
      const link = evento.target.closest('a[href^="#"]');
      if (!link) return;

      const id = link.getAttribute('href');
      if (!id || id === '#') return;
      const alvo = document.querySelector(id);
      if (!alvo) return;

      evento.preventDefault();
      const header = document.getElementById('header');
      const deslocamento = (header?.offsetHeight || 0) + 16;
      window.scrollTo({
        top: alvo.getBoundingClientRect().top + window.scrollY - deslocamento,
        behavior: 'smooth'
      });

      /* Pré-seleciona o tipo de imóvel quando o clique vem dos cards. */
      if (link.dataset.interesse) aoEscolherInteresse?.(link.dataset.interesse);

      if (id === '#formulario') {
        setTimeout(() => {
          const primeiro = document.getElementById('nome');
          if (primeiro && window.innerWidth >= 992) primeiro.focus({ preventScroll: true });
        }, 600);
      }
    }

    document.addEventListener('click', aoClicar);
    return () => document.removeEventListener('click', aoClicar);
  }, [aoEscolherInteresse]);
}

/* Animação de entrada dos blocos: adiciona .is-in quando o elemento aparece,
   com um pequeno escalonamento entre vizinhos. */
export function useRevelar() {
  useEffect(() => {
    const itens = Array.from(document.querySelectorAll('.reveal:not(.is-in)'));
    if (!itens.length) return undefined;

    if (!('IntersectionObserver' in window)) {
      itens.forEach((item) => item.classList.add('is-in'));
      return undefined;
    }

    let ordem = 0;
    const observador = new IntersectionObserver(
      (entradas) => {
        entradas.forEach((entrada) => {
          if (!entrada.isIntersecting) return;
          entrada.target.style.transitionDelay = `${Math.min((ordem++ % 5) * 70, 280)}ms`;
          entrada.target.classList.add('is-in');
          observador.unobserve(entrada.target);
        });
      },
      { rootMargin: '0px 0px -60px 0px' }
    );

    itens.forEach((item) => observador.observe(item));
    return () => observador.disconnect();
  }, []);
}

/* Acordeão do FAQ: uma pergunta aberta por vez, com altura animada. */
export function useAcordeao() {
  const [aberta, setAberta] = useState(null);
  const alturas = useRef({});

  const alternar = (indice) => setAberta((atual) => (atual === indice ? null : indice));
  return { aberta, alternar, alturas };
}
