# Landing page — Corretor de Imóveis

Landing page de captação de leads em **HTML, CSS e JavaScript puro**, em arquivo único
(`index.html`), sem frameworks e sem build.

## Como publicar

Basta subir o `index.html` em qualquer hospedagem estática (Hostinger, Vercel,
Netlify, GitHub Pages, cPanel...). Não há dependências para instalar.

## O que editar antes de publicar

Todo o conteúdo variável está no bloco `CONFIG`, no início do `<script>` no fim do arquivo:

```js
const CONFIG = {
  nome:      'Rafael Moraes',
  creci:     '00000',
  regiao:    'Sua cidade e região',
  email:     'contato@seudominio.com.br',
  whatsapp:  '5500000000000',        // 55 + DDD + número (somente dígitos)
  whatsappLabel: '(00) 00000-0000',
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
- bloco de dados estruturados (JSON-LD), no fim do arquivo
- logo: substitua o `<svg class="brand__mark">` por `<img src="logo.png" alt="...">`
- imagens dos cards de imóveis e foto do corretor: cada bloco tem um
  `<!-- <img ...> -->` comentado, pronto para uso
- cor de destaque: variável `--brand` no início do `<style>`
- link da Política de Privacidade no rodapé

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
- Ganchos prontos para GA4 (`gtag('event','generate_lead')`) e Meta Pixel (`fbq('track','Lead')`)
- FAQ em accordion acessível, rolagem suave nos CTAs e botão flutuante de WhatsApp
- Layout mobile-first, sem bibliotecas externas além da fonte Inter
