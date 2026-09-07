import { useState } from 'react';
import { CONFIG } from '../config.js';
import { OBJETIVOS, TIPOS, FAIXAS } from '../conteudo.js';
import {
  REGRAS,
  abrirWhatsAppComContexto,
  enviarLead,
  mascaraTelefone,
  montarPayload,
  registrarConversao
} from '../lead.js';
import { IconeCadeado, IconeCerto, IconeWhatsApp } from '../componentes/Icones.jsx';
import { LINK_WHATSAPP } from '../config.js';

const VAZIO = {
  nome: '',
  whatsapp: '',
  email: '',
  cidade: '',
  objetivo: '',
  tipo_imovel: '',
  faixa_investimento: '',
  empresa: '' // honeypot anti-spam
};

export default function Formulario({ tipoPreSelecionado }) {
  const [campos, setCampos] = useState(VAZIO);
  const [erros, setErros] = useState({});
  const [enviando, setEnviando] = useState(false);
  const [enviado, setEnviado] = useState(false);

  /* O clique em "tenho interesse" nos cards pré-seleciona o tipo de imóvel. */
  const tipoImovel = tipoPreSelecionado && !campos.tipo_imovel ? tipoPreSelecionado : campos.tipo_imovel;

  function mudar(nome, valor) {
    setCampos((atuais) => ({ ...atuais, [nome]: valor }));
    /* O erro some assim que o campo fica válido. */
    if (erros[nome] && REGRAS[nome]?.(valor)) {
      setErros((atuais) => {
        const proximo = { ...atuais };
        delete proximo[nome];
        return proximo;
      });
    }
  }

  function validar(valores) {
    const encontrados = {};
    for (const [nome, regra] of Object.entries(REGRAS)) {
      if (!regra(valores[nome] || '')) encontrados[nome] = true;
    }
    return encontrados;
  }

  async function enviar(evento) {
    evento.preventDefault();
    if (campos.empresa) return; // provável robô: ignora em silêncio

    const valores = { ...campos, tipo_imovel: tipoImovel };
    const encontrados = validar(valores);
    setErros(encontrados);

    const primeiro = Object.keys(encontrados)[0];
    if (primeiro) {
      const campo = document.getElementById(primeiro);
      campo?.focus({ preventScroll: true });
      campo?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    setEnviando(true);
    const { empresa, ...limpos } = valores;
    const payload = montarPayload(limpos);

    try {
      await enviarLead(payload);
      setEnviado(true);
      registrarConversao(payload);
      if (CONFIG.abrirWhatsAppAposEnvio) abrirWhatsAppComContexto(payload);
    } catch (erro) {
      console.error(erro);
      alert('Não foi possível enviar agora. Tente novamente ou fale conosco pelo WhatsApp.');
    } finally {
      setEnviando(false);
    }
  }

  if (enviado) {
    return (
      <div className="form-success is-visible" role="status" aria-live="polite">
        <div className="form-success__icon" aria-hidden="true">
          <IconeCerto />
        </div>
        <h3>Recebemos seus dados!</h3>
        <p>Em breve entraremos em contato pelo WhatsApp para entender melhor o que você procura.</p>
        <a href={LINK_WHATSAPP} className="btn btn--primary btn--block" target="_blank" rel="noopener">
          <IconeWhatsApp className="icon" />
          Falar agora no WhatsApp
        </a>
      </div>
    );
  }

  const campo = (nome) => `field${erros[nome] ? ' has-error' : ''}`;

  return (
    <form id="leadForm" className="form-grid" noValidate onSubmit={enviar}>
      {/* Campo anti-spam (não remova) */}
      <div className="hp" aria-hidden="true">
        <label htmlFor="empresa">Não preencha este campo</label>
        <input
          type="text"
          id="empresa"
          name="empresa"
          tabIndex={-1}
          autoComplete="off"
          value={campos.empresa}
          onChange={(evento) => mudar('empresa', evento.target.value)}
        />
      </div>

      <div className={campo('nome')}>
        <label htmlFor="nome">Nome completo</label>
        <input
          type="text"
          id="nome"
          name="nome"
          placeholder="Seu nome e sobrenome"
          autoComplete="name"
          required
          value={campos.nome}
          onChange={(evento) => mudar('nome', evento.target.value)}
        />
        <span className="error-msg">Informe seu nome completo.</span>
      </div>

      <div className="form-grid form-grid--2" style={{ gap: 14 }}>
        <div className={campo('whatsapp')}>
          <label htmlFor="whatsapp">WhatsApp</label>
          <input
            type="tel"
            id="whatsapp"
            name="whatsapp"
            placeholder="(00) 00000-0000"
            inputMode="numeric"
            autoComplete="tel"
            maxLength={15}
            required
            value={campos.whatsapp}
            onChange={(evento) => mudar('whatsapp', mascaraTelefone(evento.target.value))}
          />
          <span className="error-msg">Informe um WhatsApp válido com DDD.</span>
        </div>

        <div className={campo('email')}>
          <label htmlFor="email">E-mail</label>
          <input
            type="email"
            id="email"
            name="email"
            placeholder="seu@email.com"
            autoComplete="email"
            required
            value={campos.email}
            onChange={(evento) => mudar('email', evento.target.value)}
          />
          <span className="error-msg">Informe um e-mail válido.</span>
        </div>
      </div>

      <div className={campo('cidade')}>
        <label htmlFor="cidade">Cidade ou região de interesse</label>
        <input
          type="text"
          id="cidade"
          name="cidade"
          placeholder="Ex.: Centro, Zona Sul, sua cidade..."
          autoComplete="address-level2"
          required
          value={campos.cidade}
          onChange={(evento) => mudar('cidade', evento.target.value)}
        />
        <span className="error-msg">Informe a cidade ou região desejada.</span>
      </div>

      <div className={campo('objetivo')}>
        <label htmlFor="objetivo">O que você procura?</label>
        <select
          id="objetivo"
          name="objetivo"
          required
          value={campos.objetivo}
          onChange={(evento) => mudar('objetivo', evento.target.value)}
        >
          <option value="" disabled>
            Selecione uma opção
          </option>
          {OBJETIVOS.map((opcao) => (
            <option key={opcao.valor} value={opcao.valor}>
              {opcao.rotulo}
            </option>
          ))}
        </select>
        <span className="error-msg">Selecione o que você procura.</span>
      </div>

      <div className={campo('tipo_imovel')}>
        <label htmlFor="tipo_imovel">Tipo de imóvel</label>
        <select
          id="tipo_imovel"
          name="tipo_imovel"
          required
          value={tipoImovel}
          onChange={(evento) => mudar('tipo_imovel', evento.target.value)}
        >
          <option value="" disabled>
            Selecione uma opção
          </option>
          {TIPOS.map((opcao) => (
            <option key={opcao.valor} value={opcao.valor}>
              {opcao.rotulo}
            </option>
          ))}
        </select>
        <span className="error-msg">Selecione o tipo de imóvel.</span>
      </div>

      <div className="field">
        <label htmlFor="faixa_investimento">
          Faixa de investimento <span className="opt">(opcional)</span>
        </label>
        <select
          id="faixa_investimento"
          name="faixa_investimento"
          value={campos.faixa_investimento}
          onChange={(evento) => mudar('faixa_investimento', evento.target.value)}
        >
          <option value="" disabled>
            Prefiro não informar agora
          </option>
          {FAIXAS.map((opcao) => (
            <option key={opcao.valor} value={opcao.valor}>
              {opcao.rotulo}
            </option>
          ))}
        </select>
      </div>

      <button
        type="submit"
        className={`btn btn--primary btn--lg btn--block${enviando ? ' is-loading' : ''}`}
        id="submitBtn"
        disabled={enviando}
      >
        {enviando && <span className="spinner" aria-hidden="true" />}
        <span className="btn__label">{enviando ? 'Enviando...' : 'Quero receber oportunidades'}</span>
      </button>

      <p className="form-note">
        <IconeCadeado />
        Seus dados estão seguros. Não enviamos spam.
      </p>
    </form>
  );
}
