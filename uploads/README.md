# uploads

Pasta onde ficam todas as imagens do site. Suba os arquivos aqui **com estes nomes
exatos** — a página já aponta para eles.

| Arquivo | Onde aparece | Tamanho sugerido |
|---|---|---|
| `logo.png` | header e rodapé (substitui a marca provisória automaticamente) | altura de 72px a 144px, fundo transparente |
| `favicon.png` | ícone da aba do navegador e ícone do iPhone | 256×256 |
| `corretor.jpg` | foto na seção "Quem vai te atender" | recorte 4:5 |
| `apartamentos.jpg` | card de apartamentos | recorte 16:11 |
| `casas.jpeg` | card de casas | recorte 16:11 |
| `terrenos.jpeg` | card de terrenos | recorte 16:11 |
| `og-image.jpg` | prévia ao compartilhar (ainda não existe) | 1200×630 |

## Importante

- **Trocar uma foto**: suba o arquivo novo com o mesmo nome e pronto. Se o nome ou a
  extensão mudarem, atualize o `src` da tag `<img>` correspondente no `index.html`.
- **Enquadramento**: as fotos dos cards entram num recorte 16:11 e a do corretor num 4:5,
  sempre pelo centro. Quando o assunto não está no meio da foto, dá para ajustar com
  `style="object-position:center 55%"` na própria tag — é o que a foto da casa usa, para
  mostrar a casa em vez do céu.
- **Peso**: comprima antes de subir (ex.: [squoosh.app](https://squoosh.app)). O ideal é
  cada foto ficar abaixo de 200 KB e não passar de 1200px no maior lado — acima disso a
  página fica lenta no celular sem ganho nenhum de qualidade na tela.
- **`og-image.jpg`** (1200×630) ainda não existe: enquanto isso, a prévia ao compartilhar
  usa `apartamentos.jpg`.
- No rodapé escuro o logo é exibido em branco por um filtro CSS. Para manter as cores
  originais, remova a regra `.footer img.brand__mark{filter:...}` do `index.html`.
