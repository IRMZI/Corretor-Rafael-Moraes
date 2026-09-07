# Landing page — Corretor de Imóveis

Landing page de captação de leads em **HTML, CSS e JavaScript puro**, em arquivo único
(`index.html`), sem frameworks e sem build. Tema escuro único (não acompanha o modo
claro/escuro do sistema).

## Como publicar

Basta subir o `index.html` em qualquer hospedagem estática (Hostinger, Vercel,
Netlify, GitHub Pages, cPanel...). Não há dependências para instalar.

## O que editar antes de publicar

Todo o conteúdo variável está no bloco `CONFIG`, no início do `<script>` no fim do arquivo:

```js
const CONFIG = {
  nome:      'Rafael Moraes',
  logo:      'uploads/logo.png',
  creci:     '00000',                // <- ainda pendente
  regiao:    'Novo Hamburgo e região',
  email:     'rafaelmoraes@wallstreet.com.br',
  whatsapp:  '5551982606574',        // 55 + DDD + número (somente dígitos, sem o +)
  whatsappLabel: '(51) 98260-6574',
  mensagemWhatsApp: 'Olá! Vim pelo site e gostaria de falar sobre imóveis.',
  api: 'https://api-rafael.pushagencia.com.br',  // backend (leads + rastreio + painel)
  endpoint: '',                      // opcional: outro destino (webhook, CRM, Zapier)
  metodo:   'POST',
  rastrear: true,                    // rastrear visitantes, jornada e campanhas
  abrirWhatsAppAposEnvio: false
};
```

Esses valores são aplicados automaticamente no header, na seção do corretor,
no rodapé e em todos os botões de WhatsApp.

Outros pontos que valem revisar:

- `<title>`, meta description, `og:url` e `link rel="canonical"` (topo do arquivo)
- bloco de dados estruturados (JSON-LD), no fim do arquivo
- imagens (logo, favicon, foto do corretor, fotos dos cards): veja `uploads/README.md`
  — basta subir os arquivos com os nomes indicados. O logo e o favicon funcionam sozinhos
  assim que o arquivo existir
- imagens dos cards de imóveis e foto do corretor: cada bloco tem um
  `<!-- <img ...> -->` comentado, pronto para uso
- cores: todas as variáveis ficam no bloco `:root`, no início do `<style>` — `--brand`
  (preenchimento dos botões), `--brand-text` (bordô claro usado em textos e ícones sobre
  o fundo escuro), `--bg`, `--bg-soft`, `--surface` (cards) e `--field` (campos)
- link da Política de Privacidade no rodapé

## Integração com o backend

O `CONFIG.api` aponta para a API do repositório
[corretor-rafael-moraes-back](https://github.com/IRMZI/corretor-rafael-moraes-back)
e liga as três pontas de uma vez:

| O quê | Para onde vai |
| --- | --- |
| Envio do formulário | `POST {api}/api/leads` |
| Rastreamento de visitantes e campanhas | `{api}/track.js` |
| Painel do corretor | `{api}/admin` |

Deixando `api: ''` (e sem `endpoint`), o formulário volta ao modo demonstração:
valida os campos, exibe a mensagem de sucesso e imprime o lead no console.

Para mandar o lead para outro destino (Zapier, Make, n8n, RD Station, Pipedrive),
preencha `CONFIG.endpoint` — ele tem prioridade sobre o `CONFIG.api`. O lead é
enviado via `fetch` em JSON:

```json
{
  "nome": "Maria Souza",
  "whatsapp": "(31) 98765-4321",
  "whatsapp_numeros": "31987654321",
  "email": "maria@exemplo.com",
  "cidade": "Belo Horizonte",
  "objetivo": "comprar",
  "tipo_imovel": "apartamento",
  "faixa_investimento": "500k-800k",
  "origem": "landing-page",
  "pagina": "https://...",
  "referrer": "https://google.com/",
  "utm": { "utm_source": "google", "gclid": "..." },
  "visitante_uid": "id anônimo do visitante (quando o rastreio está ativo)",
  "sessao_uid": "id da visita",
  "enviado_em": "2026-01-01T12:00:00.000Z"
}
```

Para outro formato (FormData, query string, cabeçalho de autenticação), altere apenas
a função `enviarLead()`.

Se quiser abrir a conversa do WhatsApp automaticamente após o envio, use
`abrirWhatsAppAposEnvio: true`.

### Rastreamento de visitantes

Com `CONFIG.api` preenchido e `rastrear: true`, a página carrega o `track.js` do
backend. Ele identifica o visitante anônimo (id aleatório no `localStorage`, sem
cookie e sem dado pessoal), guarda a campanha de origem e registra a jornada:
abriu a página, rolou 25/50/75/100%, começou o formulário, clicou no WhatsApp,
converteu e saiu — junto com o tempo real de permanência.

Quando o formulário é enviado, o lead leva esses ids: no painel dá para ver de
qual campanha veio cada conversão e todo o caminho que a pessoa fez antes.

Para desligar o rastreamento, use `rastrear: false`.

## Recursos já incluídos

- Formulário com validação, máscara de WhatsApp e mensagem de sucesso sem recarregar a página
- Campo honeypot anti-spam e captura de UTMs / gclid / fbclid
- Ganchos prontos para GA4 (`gtag('event','generate_lead')`) e Meta Pixel (`fbq('track','Lead')`)
- FAQ em accordion acessível, rolagem suave nos CTAs e botão flutuante de WhatsApp
- Layout mobile-first, sem bibliotecas externas além da fonte Inter
- Tema escuro em toda a página, com `color-scheme: dark` para os controles nativos
