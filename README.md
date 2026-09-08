# Site e painel — Corretor Rafael Moraes

Projeto **Vite** com duas partes no mesmo deploy:

| Parte | Onde | O que é |
| --- | --- | --- |
| Landing page de captação | `/` | App React: seções em componentes, textos em `src/site/conteudo.js` |
| Painel administrativo | `/admin` | App React que consome a API pela própria origem |

Também fazem parte do site:

- `politica-de-privacidade.html` — linkada no rodapé (exigida pela LGPD e pelas
  políticas de anúncio da Meta e do Google)
- `404.html` — endereço inexistente, servida automaticamente pela Vercel

O painel mostra visitantes anônimos com a jornada completa, campanhas por UTM,
acessos em 7/30/90 dias, tempo médio na página e as conversões — com tags e
registro de venda. Os dados vêm da API do repositório
[corretor-rafael-moraes-back](https://github.com/IRMZI/corretor-rafael-moraes-back).

Tema escuro único, que não acompanha o modo claro/escuro do sistema.

## Rodando local

```bash
npm install
cp .env.example .env.local     # VITE_API_URL apontando para a API
npm run dev                    # http://localhost:5173 e /admin
```

`npm run build` gera o `dist/`; `npm run preview` serve esse build.

Para editar o conteúdo da landing (benefícios, passos, tipos de imóvel, FAQ),
mexa em `src/site/conteudo.js` — são listas de objetos, sem tocar em JSX. Nome,
CRECI, WhatsApp e a URL da API ficam em `src/site/config.js`.

## Publicando na Vercel

O `vercel.json` já traz tudo: build `npm run build`, saída `dist` e dois rewrites:

- `/admin/*` → `admin/index.html`, para as rotas internas do painel
  (`/admin/conversoes`, `/admin/visitantes`) funcionarem ao recarregar a página;
- `/api/admin/*` → a API, para o painel falar com ela **pela própria origem**.

Esse segundo rewrite não é detalhe de organização: é o que mantém o cookie de
sessão como cookie próprio do site. Chamando a API direto no domínio dela, o
cookie vira cookie de terceiros — o Safari bloqueia por padrão, o Chrome bloqueia
em janela anônima — e o login responde 200, mas a requisição seguinte volta 401 e
o painel pisca de volta para a tela de login. Trocando o endereço da API, troque
também no rewrite.

Só falta cadastrar a variável de ambiente no projeto da Vercel:

| Variável | Valor |
| --- | --- |
| `VITE_API_URL` | `https://api-rafael.pushagencia.com.br` |

Ela é lida **no build**, então depois de alterar é preciso um novo deploy. Ela vale
para a landing page (envio do lead e rastreamento); o painel não a usa.

O domínio do site precisa estar no `CORS_ORIGINS` da API — senão o navegador
bloqueia o envio do lead e o rastreamento.

## Estrutura

```
index.html                    casca da landing (meta tags, Meta Pixel, JSON-LD)
src/site/
├── main.jsx  App.jsx         montagem da página e ganchos de rolagem/revelação
├── config.js                 nome, CRECI, WhatsApp, URL da API
├── conteudo.js               textos das seções (benefícios, passos, imóveis, FAQ)
├── lead.js                   máscara, validação, envio do lead e pixels
├── estilo.css                todo o CSS da landing
├── componentes/              cabeçalho, rodapé, marca, ícones, botão de WhatsApp
└── secoes/                   hero, formulário, benefícios, processo, imóveis...
admin/index.html              casca do painel
src/admin/                    páginas, componentes e cliente da API do painel
politica-de-privacidade.html  páginas estáticas, fora do React
404.html
public/uploads/               imagens, logo e favicon (servidos em /uploads/...)
vite.config.js                entradas do build + rota do painel no dev
vercel.json                   build, saída e rewrite do /admin
```

## O que editar antes de publicar

Todo o conteúdo variável da landing está em `src/site/config.js`:

```js
const CONFIG = {
  nome:      'Rafael Moraes',
  logo:      '/uploads/logo.png',
  creci:     '00000',                // <- ainda pendente
  regiao:    'Novo Hamburgo e região',
  email:     'rafaelmoraes@wallstreet.com.br',
  whatsapp:  '5551982606574',        // 55 + DDD + número (somente dígitos, sem o +)
  whatsappLabel: '(51) 98260-6574',
  mensagemWhatsApp: 'Olá! Vim pelo site e gostaria de falar sobre imóveis.',
  api: import.meta.env.VITE_API_URL || 'https://api-rafael.pushagencia.com.br',
  endpoint: '',                      // opcional: outro destino (webhook, CRM, Zapier)
  metodo:   'POST',
  rastrear: true,                    // rastrear visitantes, jornada e campanhas
  abrirWhatsAppAposEnvio: false
};
```

Esses valores são usados no cabeçalho, na seção do corretor, no rodapé e em
todos os botões de WhatsApp — um lugar só, sem repetir em cada componente.

Outros pontos que valem revisar:

- `<title>`, meta description, `og:url` e `link rel="canonical"` (topo do arquivo)
- dados do responsável na `politica-de-privacidade.html` (CRECI, e-mail e, se houver,
  razão social e CNPJ)
- bloco de dados estruturados (JSON-LD), no fim do arquivo
- imagens (logo, favicon, foto do corretor, fotos dos cards): veja `public/uploads/README.md`
  — basta subir os arquivos com os nomes indicados. O logo e o favicon funcionam sozinhos
  assim que o arquivo existir
- imagens dos cards de imóveis e foto do corretor: cada bloco tem um
  `<!-- <img ...> -->` comentado, pronto para uso
- cores: todas as variáveis ficam no bloco `:root`, no início de `src/site/estilo.css` — `--brand`
  (preenchimento dos botões), `--brand-text` (bordô claro usado em textos e ícones sobre
  o fundo escuro), `--bg`, `--bg-soft`, `--surface` (cards) e `--field` (campos)

## Integração com o backend

O `CONFIG.api` aponta para a API do repositório
[corretor-rafael-moraes-back](https://github.com/IRMZI/corretor-rafael-moraes-back)
e liga as três pontas de uma vez:

| O quê | Para onde vai |
| --- | --- |
| Envio do formulário | `POST {api}/api/leads` |
| Rastreamento de visitantes e campanhas | `{api}/track.js` |

O painel (`/admin`) fica neste mesmo site, mas chama `/api/admin/...` na própria
origem: quem repassa para a API é o rewrite do `vercel.json` (e, no `npm run dev`,
o proxy do `vite.config.js`). Para apontar o painel a outra API em
desenvolvimento, use `VITE_ADMIN_API_URL`.

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
- Meta Pixel instalado (ID `1011306658228860`): `PageView` no carregamento e `Lead` no
  envio do formulário, com o objetivo e o tipo de imóvel como metadados — nenhum dado
  pessoal é enviado ao pixel. O ID fica no `fbq('init', ...)`, no `<head>`
- Gancho pronto para GA4 (`gtag('event','generate_lead')`), caso instale o Google Analytics
- FAQ em accordion acessível, rolagem suave nos CTAs e botão flutuante de WhatsApp
- Layout mobile-first, sem bibliotecas externas além da fonte Inter
- Tema escuro em toda a página, com `color-scheme: dark` para os controles nativos
