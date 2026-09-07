# Landing page — Corretor de Imóveis

Landing page de captação de leads em **HTML, CSS e JavaScript puro**, sem frameworks e
sem build. São três páginas independentes:

- `index.html` — a landing page
- `politica-de-privacidade.html` — página linkada no rodapé (exigida pela LGPD e pelas
  políticas de anúncio da Meta e do Google)
- `404.html` — endereço inexistente, servida automaticamente pela Vercel Tema escuro único (não acompanha o modo
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
  endpoint: '',                      // webhook / CRM que vai receber os leads
  metodo:   'POST',
  abrirWhatsAppAposEnvio: false
};
```

Esses valores são aplicados automaticamente no header, na seção do corretor,
no rodapé e em todos os botões de WhatsApp.

Outros pontos que valem revisar:

- `<title>`, meta description, `og:url` e `link rel="canonical"` (topo do arquivo)
- dados do responsável na `politica-de-privacidade.html` (CRECI, e-mail e, se houver,
  razão social e CNPJ)
- bloco de dados estruturados (JSON-LD), no fim do arquivo
- imagens (logo, favicon, foto do corretor, fotos dos cards): veja `uploads/README.md`
  — basta subir os arquivos com os nomes indicados. O logo e o favicon funcionam sozinhos
  assim que o arquivo existir
- imagens dos cards de imóveis e foto do corretor: cada bloco tem um
  `<!-- <img ...> -->` comentado, pronto para uso
- cores: todas as variáveis ficam no bloco `:root`, no início do `<style>` — `--brand`
  (preenchimento dos botões), `--brand-text` (bordô claro usado em textos e ícones sobre
  o fundo escuro), `--bg`, `--bg-soft`, `--surface` (cards) e `--field` (campos)

## Integração do formulário

Sem `CONFIG.endpoint`, o formulário funciona em modo demonstração: valida os campos,
exibe a mensagem de sucesso e imprime o lead no console do navegador.

Preenchendo `CONFIG.endpoint` com a URL de um webhook (Zapier, Make, n8n, RD Station,
Pipedrive, API própria etc.), o lead é enviado via `fetch` em JSON:

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
  "enviado_em": "2026-01-01T12:00:00.000Z"
}
```

Para outro formato (FormData, query string, cabeçalho de autenticação), altere apenas
a função `enviarLead()`.

Se quiser abrir a conversa do WhatsApp automaticamente após o envio, use
`abrirWhatsAppAposEnvio: true`.

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
