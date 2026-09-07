import Marca from './Marca.jsx';

const NAVEGACAO = [
  { para: '#beneficios', rotulo: 'Diferenciais' },
  { para: '#processo', rotulo: 'Como funciona' },
  { para: '#imoveis', rotulo: 'Imóveis' },
  { para: '#corretor', rotulo: 'Sobre' },
  { para: '#faq', rotulo: 'Dúvidas' }
];

export default function Cabecalho({ rolou }) {
  return (
    <header className={`header${rolou ? ' is-scrolled' : ''}`} id="header">
      <div className="container header__inner">
        <Marca como="a" href="#topo" aria-label="Página inicial" />

        <nav className="nav" aria-label="Navegação principal">
          {NAVEGACAO.map((item) => (
            <a href={item.para} key={item.para}>
              {item.rotulo}
            </a>
          ))}
        </nav>

        <a href="#formulario" className="btn btn--primary">
          <span className="header__cta-label--full">Falar com um corretor</span>
          <span className="header__cta-label--short">Falar agora</span>
        </a>
      </div>
    </header>
  );
}
