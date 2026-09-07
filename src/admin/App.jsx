import { useEffect, useState } from 'react';
import { NavLink, Navigate, Route, Routes } from 'react-router-dom';
import { api } from './api.js';
import Login from './componentes/Login.jsx';
import VisaoGeral from './paginas/VisaoGeral.jsx';
import Campanhas from './paginas/Campanhas.jsx';
import Visitantes from './paginas/Visitantes.jsx';
import Conversoes from './paginas/Conversoes.jsx';

const ABAS = [
  { para: '/', rotulo: 'Visão geral', fim: true },
  { para: '/campanhas', rotulo: 'Campanhas' },
  { para: '/visitantes', rotulo: 'Visitantes' },
  { para: '/conversoes', rotulo: 'Conversões' }
];

export default function App() {
  const [usuario, setUsuario] = useState(null);
  const [verificando, setVerificando] = useState(true);

  /* Uma sessão válida pode já existir no cookie: confere antes de pedir login. */
  useEffect(() => {
    api('/api/admin/eu')
      .then((corpo) => setUsuario(corpo.usuario))
      .catch(() => setUsuario(null))
      .finally(() => setVerificando(false));
  }, []);

  /* Sessão expirada no meio do uso: qualquer 401 volta para o login. */
  useEffect(() => {
    function aoExpirar() {
      setUsuario(null);
    }
    window.addEventListener('sessao-expirada', aoExpirar);
    return () => window.removeEventListener('sessao-expirada', aoExpirar);
  }, []);

  async function sair() {
    await api('/api/admin/logout', { method: 'POST' }).catch(() => {});
    setUsuario(null);
  }

  if (verificando) return <p className="carregando">Carregando...</p>;
  if (!usuario) return <Login aoEntrar={setUsuario} />;

  return (
    <div className="app">
      <header className="topo">
        <div className="topo__marca">
          Rafael Moraes <span>· painel</span>
        </div>

        <nav className="abas">
          {ABAS.map((aba) => (
            <NavLink
              key={aba.para}
              to={aba.para}
              end={aba.fim}
              className={({ isActive }) => `aba-link${isActive ? ' ativa' : ''}`}
            >
              {aba.rotulo}
            </NavLink>
          ))}
        </nav>

        <div className="topo__direita">
          <span className="topo__usuario">{usuario.email}</span>
          <button type="button" className="btn btn--pequeno" onClick={sair}>
            Sair
          </button>
        </div>
      </header>

      <main className="conteudo">
        <Routes>
          <Route path="/" element={<VisaoGeral />} />
          <Route path="/campanhas" element={<Campanhas />} />
          <Route path="/visitantes" element={<Visitantes />} />
          <Route path="/conversoes" element={<Conversoes />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
}
