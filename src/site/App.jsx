import { useCallback, useState } from 'react';
import Cabecalho from './componentes/Cabecalho.jsx';
import Rodape from './componentes/Rodape.jsx';
import BotaoWhatsApp from './componentes/BotaoWhatsApp.jsx';
import Hero from './secoes/Hero.jsx';
import Beneficios from './secoes/Beneficios.jsx';
import Processo from './secoes/Processo.jsx';
import Imoveis from './secoes/Imoveis.jsx';
import Corretor from './secoes/Corretor.jsx';
import Faq from './secoes/Faq.jsx';
import CtaFinal from './secoes/CtaFinal.jsx';
import { useAncoras, useRastreio, useRevelar, useRolagem } from './ganchos.js';

export default function App() {
  const [tipoPreSelecionado, setTipoPreSelecionado] = useState('');
  const { rolou, passouDobra } = useRolagem();

  useRastreio();
  useRevelar();
  useAncoras(useCallback((interesse) => setTipoPreSelecionado(interesse), []));

  return (
    <>
      <Cabecalho rolou={rolou} />

      <main id="topo">
        <Hero tipoPreSelecionado={tipoPreSelecionado} />
        <Beneficios />
        <Processo />
        <Imoveis />
        <Corretor />
        <Faq />
        <CtaFinal />
      </main>

      <Rodape />
      <BotaoWhatsApp visivel={passouDobra} />
    </>
  );
}
