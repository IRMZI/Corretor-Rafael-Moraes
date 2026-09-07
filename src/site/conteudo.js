/* Textos das seções. Editar o site é editar estes arrays — a estrutura
   das seções não muda. */

export const BENEFICIOS = [
  {
    icone: 'busca',
    titulo: 'Seleção personalizada',
    texto: 'Receba imóveis compatíveis com o seu perfil, localização desejada e orçamento.'
  },
  {
    icone: 'conversa',
    titulo: 'Atendimento próximo',
    texto: 'Tenha acompanhamento desde a primeira conversa até a conclusão da negociação.'
  },
  {
    icone: 'grafico',
    titulo: 'Oportunidades',
    texto: 'Conheça imóveis e condições que podem fazer sentido para o seu momento.'
  },
  {
    icone: 'escudo',
    titulo: 'Negociação segura',
    texto: 'Conte com orientação durante cada etapa da compra, venda ou investimento.'
  }
];

export const PASSOS = [
  { numero: '01', titulo: 'Conte o que você procura', texto: 'Preencha o formulário com suas preferências.' },
  {
    numero: '02',
    titulo: 'Receba opções selecionadas',
    texto: 'Analisamos seu perfil e buscamos oportunidades compatíveis.'
  },
  { numero: '03', titulo: 'Agende uma visita', texto: 'Escolha os imóveis que mais gostou e organize sua visita.' }
];

export const TIPOS_IMOVEL = [
  {
    interesse: 'apartamento',
    etiqueta: 'Apartamentos',
    titulo: 'Apartamentos',
    texto: 'Opções de 1 a 4 dormitórios, com diferentes padrões de lazer, localização e metragem.',
    imagem: {
      src: '/uploads/apartamentos.jpg',
      alt: 'Prédio residencial em Novo Hamburgo',
      largura: 781,
      altura: 755
    }
  },
  {
    interesse: 'casa',
    etiqueta: 'Casas',
    titulo: 'Casas',
    texto: 'Casas em bairros consolidados ou em condomínio fechado, para quem busca mais espaço.',
    imagem: {
      src: '/uploads/casas.jpeg',
      alt: 'Casa de dois pavimentos com pátio',
      largura: 900,
      altura: 1200,
      /* foto em pé: o enquadramento privilegia a parte de cima da casa */
      posicao: 'center 55%'
    }
  },
  {
    interesse: 'terreno',
    etiqueta: 'Terrenos',
    titulo: 'Terrenos',
    texto: 'Lotes para construir do seu jeito ou para investir com potencial de valorização.',
    imagem: {
      src: '/uploads/terrenos.jpeg',
      alt: 'Vista aérea de loteamento em Novo Hamburgo',
      largura: 1200,
      altura: 901
    }
  }
];

export const PERGUNTAS = [
  {
    pergunta: 'Preciso pagar para receber as opções de imóveis?',
    resposta: 'Não. O primeiro atendimento e a busca inicial de imóveis são realizados sem custo para você.'
  },
  {
    pergunta: 'Vocês atendem quais regiões?',
    resposta: 'O atendimento pode ser personalizado conforme a região de atuação do corretor.'
  },
  {
    pergunta: 'Posso cadastrar meu imóvel para venda?',
    resposta:
      'Sim. Entre em contato e envie as principais informações do imóvel para uma avaliação inicial.'
  },
  {
    pergunta: 'Quanto tempo demora para entrarem em contato?',
    resposta: 'Normalmente o atendimento acontece o mais rápido possível durante o horário comercial.'
  }
];

/* Campos do formulário de captação. */
export const OBJETIVOS = [
  { valor: 'comprar', rotulo: 'Comprar um imóvel' },
  { valor: 'vender', rotulo: 'Vender meu imóvel' },
  { valor: 'investir', rotulo: 'Investir em imóveis' },
  { valor: 'alugar', rotulo: 'Alugar um imóvel' },
  { valor: 'pesquisando', rotulo: 'Ainda estou pesquisando' }
];

export const TIPOS = [
  { valor: 'apartamento', rotulo: 'Apartamento' },
  { valor: 'casa', rotulo: 'Casa' },
  { valor: 'terreno', rotulo: 'Terreno' },
  { valor: 'comercial', rotulo: 'Imóvel comercial' },
  { valor: 'condominio', rotulo: 'Condomínio' },
  { valor: 'outro', rotulo: 'Outro' }
];

export const FAIXAS = [
  { valor: 'ate-300k', rotulo: 'Até R$ 300 mil' },
  { valor: '300k-500k', rotulo: 'R$ 300 mil a R$ 500 mil' },
  { valor: '500k-800k', rotulo: 'R$ 500 mil a R$ 800 mil' },
  { valor: '800k-1.5mi', rotulo: 'R$ 800 mil a R$ 1,5 milhão' },
  { valor: 'acima-1.5mi', rotulo: 'Acima de R$ 1,5 milhão' }
];
