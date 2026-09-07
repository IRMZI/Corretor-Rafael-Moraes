import { useState } from 'react';
import { api } from '../api.js';

export default function Login({ aoEntrar }) {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [enviando, setEnviando] = useState(false);

  async function enviar(evento) {
    evento.preventDefault();
    setErro('');
    setEnviando(true);
    try {
      const corpo = await api('/api/admin/login', { method: 'POST', body: { email, senha } });
      aoEntrar(corpo.usuario);
    } catch (falha) {
      setErro(falha.status === 401 ? 'E-mail ou senha inválidos.' : falha.message);
      setSenha('');
    } finally {
      setEnviando(false);
    }
  }

  return (
    <div className="login">
      <form className="login__caixa" onSubmit={enviar}>
        <p className="login__marca">Painel administrativo</p>
        <h1>Entrar</h1>
        <p>Acompanhe visitantes, campanhas e conversões da landing page.</p>

        <div className="campo">
          <label htmlFor="email">E-mail</label>
          <input
            id="email"
            type="email"
            autoComplete="username"
            required
            value={email}
            onChange={(evento) => setEmail(evento.target.value)}
          />
        </div>

        <div className="campo">
          <label htmlFor="senha">Senha</label>
          <input
            id="senha"
            type="password"
            autoComplete="current-password"
            required
            value={senha}
            onChange={(evento) => setSenha(evento.target.value)}
          />
        </div>

        <button type="submit" className="btn btn--primario btn--bloco" disabled={enviando}>
          {enviando ? 'Entrando...' : 'Entrar'}
        </button>

        {erro && <div className="aviso aviso--erro">{erro}</div>}
      </form>
    </div>
  );
}
