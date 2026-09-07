# uploads

Pasta onde ficam todas as imagens do site. Suba os arquivos aqui **com estes nomes
exatos** — a página já aponta para eles.

| Arquivo | Onde aparece | Tamanho sugerido |
|---|---|---|
| `logo.png` | header e rodapé (substitui a marca provisória automaticamente) | altura de 72px a 144px, fundo transparente |
| `favicon.png` | ícone da aba do navegador | 192×192 |
| `favicon.ico` | ícone da aba (navegadores antigos) | 32×32 |
| `apple-touch-icon.png` | ícone ao salvar na tela inicial do iPhone | 180×180 |
| `og-image.jpg` | prévia ao compartilhar no WhatsApp e redes sociais | 1200×630 |
| `corretor.jpg` | foto na seção "Quem vai te atender" | 840×1050 (retrato 4:5) |
| `apartamentos.jpg` | card de apartamentos | 800×550 (16:11) |
| `casas.jpg` | card de casas | 800×550 (16:11) |
| `terrenos.jpg` | card de terrenos | 800×550 (16:11) |

## Importante

- **`logo.png`, `favicon.*`, `apple-touch-icon.png` e `og-image.jpg`**: é só subir o arquivo,
  nada mais precisa ser alterado no `index.html`.
- **`corretor.jpg` e as fotos dos cards de imóveis**: além de subir o arquivo, descomente
  a linha `<!-- <img src="uploads/..."> -->` correspondente no `index.html`. Cada bloco
  já tem a tag pronta, logo acima do ícone de placeholder.
- Comprima as fotos antes de subir (ex.: [squoosh.app](https://squoosh.app)) — o ideal é
  cada imagem ficar abaixo de 200 KB, para a página continuar rápida.
- No rodapé escuro o logo é exibido em branco por um filtro CSS. Para manter as cores
  originais, remova a regra `.footer img.brand__mark{filter:...}` do `index.html`.
