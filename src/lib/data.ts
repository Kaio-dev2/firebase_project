import { Cpu, Sparkles, Home, Dumbbell, Code, Zap, Target, TrendingUp } from 'lucide-react';

export interface Service {
    id: string;
    nome: string;
    preco: number;
    descricao: string;
    desconto: string;
    animation: string;
    link: string;
}

export interface OfferPage {
  id: string;
  title: string;
  price: number;
  discount: string;
  imageUrl: string;
  imageHint: string;
  timer: string;
  description: string;
  copy: string;
  benefits: string[];
  ctaButton: {
    label: string;
    link: string;
  };
}

export interface Testimonial {
  id: string;
  nome: string;
  image: string;
  avaliacao: number;
  comentario: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  image: string;
}

export interface CaseStudy {
  id: string;
  title: string;
  client: string;
  problem: string;
  technology: string;
  result: string;
  image: string;
}

export const services: Service[] = [
  {
    id: '1',
    nome: "Site Básico",
    preco: 200,
    descricao: "Sua vitrine profissional 24h por dia.",
    desconto: "10%",
    animation: "fade-in",
    link: "/ofertas/1"
  },
  {
    id: '2',
    nome: "Site Intermediário",
    preco: 300,
    descricao: "Design de elite focado em conversão.",
    desconto: "15%",
    animation: "fade-in",
    link: "/ofertas/2"
  },
  {
    id: '3',
    nome: "Loja Virtual Inicial",
    preco: 450,
    descricao: "Comece a vender hoje mesmo.",
    desconto: "20%",
    animation: "slide-up",
    link: "/ofertas/3"
  },
  {
    id: '4',
    nome: "Loja Profissional",
    preco: 600,
    descricao: "E-commerce robusto e otimizado.",
    desconto: "25%",
    animation: "slide-up",
    link: "/ofertas/4"
  },
  {
    id: '5',
    nome: "E-commerce Premium",
    preco: 800,
    descricao: "A solução definitiva para grandes vendas.",
    desconto: "30%",
    animation: "zoom-in",
    link: "/ofertas/5"
  },
  {
    id: '6',
    nome: "Plataforma Avançada",
    preco: 1000,
    descricao: "Sistemas web sob medida para sua empresa.",
    desconto: "20%",
    animation: "zoom-in",
    link: "/ofertas/6"
  },
  {
    id: '7',
    nome: "Projeto Personalizado",
    preco: 1290,
    descricao: "Exclusividade total para sua marca.",
    desconto: "35%",
    animation: "glow",
    link: "/ofertas/7"
  }
];

export const testimonials: Testimonial[] = [
  { id: '1', nome: 'Lucas M.', comentario: 'Meu site ficou incrível! Atendimento rápido e resultado acima do esperado.', image: 'testimonial-1', avaliacao: 5 },
  { id: '2', nome: 'Mariana R.', comentario: 'A Arete Groupp transformou minha ideia em uma loja virtual completa!', image: 'testimonial-2', avaliacao: 5 },
  { id: '3', nome: 'Felipe A.', comentario: 'Excelente custo-benefício, e ainda recebi suporte na configuração!', image: 'testimonial-3', avaliacao: 5 },
];

export const projects: Project[] = [
  {
    id: '1',
    title: 'Portfólio Fotógrafo',
    description: 'Design focado em visualização de imagens em alta resolução e galerias dinâmicas.',
    image: 'project-1'
  },
  {
    id: '2',
    title: 'Agência Criativa',
    description: 'Site institucional com animações fluidas e foco em conversão de leads.',
    image: 'project-2'
  },
  {
    id: '3',
    title: 'Estúdio de Arquitetura',
    description: 'Layout minimalista e elegante para exibição de plantas e projetos 3D.',
    image: 'project-3'
  },
  {
    id: '4',
    title: 'Freelancer Developer',
    description: 'Página pessoal com integração de repositórios e seção de skills técnica.',
    image: 'project-4'
  },
  {
    id: '5',
    title: 'Designer de Interiores',
    description: 'Site clean com foco em paletas de cores e portfólio de ambientes decorados.',
    image: 'project-5'
  }
];

export const caseStudies: CaseStudy[] = [
  {
    id: '1',
    title: 'Escalabilidade para E-commerce',
    client: 'Loja TechStore',
    problem: 'O cliente perdia 60% das vendas mobile devido à lentidão e checkout complexo.',
    technology: 'Next.js 15, Tailwind CSS, Firebase Auth.',
    result: 'Redução do tempo de carregamento em 70% e aumento de 45% nas conversões mobile no primeiro mês.',
    image: 'project-2'
  },
  {
    id: '2',
    title: 'Presença Digital para Arquitetura',
    client: 'Studio Urbano',
    problem: 'Falta de autoridade visual; o site antigo não transmitia o luxo dos projetos realizados.',
    technology: 'React, Framer Motion, Cloud Firestore.',
    result: 'Aumento de 200% no tempo de permanência no site e 15 novos leads qualificados por semana.',
    image: 'project-3'
  },
  {
    id: '3',
    title: 'Sistema de Agendamento Inteligente',
    client: 'Clínica Bem-Estar',
    problem: 'Processo manual de agendamento gerava erros e desistências constantes.',
    technology: 'Next.js, Firebase Functions, Realtime Database.',
    result: 'Automatização de 90% dos agendamentos e redução de custos operacionais em R$ 2.500/mês.',
    image: 'project-1'
  }
];

export const offerPages: OfferPage[] = [
  {
    id: "1",
    title: "Site Básico",
    price: 200,
    discount: "10%",
    imageUrl: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f",
    imageHint: "simple website",
    timer: "72h",
    description: "Sua vitrine profissional 24h por dia.",
    copy: "Cansado de perder clientes por não ter um endereço digital? O Site Básico é a solução ideal para quem precisa de credibilidade imediata. Transformamos sua ideia em uma página profissional, rápida e otimizada para ser encontrada pelo seu público-alvo.",
    benefits: [
      "Layout Moderno e Responsivo (PC, Tablet e Celular)",
      "Botão de WhatsApp Direto para Conversão",
      "Otimização de SEO Inicial (Para ser achado no Google)",
      "Certificado SSL de Segurança Incluso",
      "Página de 'Link na Bio' Personalizada"
    ],
    ctaButton: {
      label: "Quero meu site agora!",
      link: "https://wa.me/5547984538664"
    }
  },
  {
    id: "2",
    title: "Site Intermediário",
    price: 300,
    discount: "15%",
    imageUrl: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d",
    imageHint: "modern website",
    timer: "72h",
    description: "Design de elite focado em conversão de leads.",
    copy: "Não basta estar na internet, é preciso convencer. O Site Intermediário utiliza técnicas de Copywriting e UX Design para guiar seu cliente até a compra. É a escolha de profissionais que querem se destacar da concorrência com um visual premium.",
    benefits: [
      "Design Exclusivo e Personalizado",
      "Até 5 Seções Estratégicas (Sobre, Serviços, Galeria, etc)",
      "Integração com Google Analytics e Pixel do Facebook",
      "Formulário de Contato Inteligente",
      "Velocidade de Carregamento Ultra-Rápida"
    ],
    ctaButton: {
      label: "Quero minha landing page agora!",
      link: "https://wa.me/5547984538664"
    }
  },
  {
    id: "3",
    title: "Loja Virtual Inicial",
    price: 450,
    discount: "20%",
    imageUrl: "https://images.unsplash.com/photo-1498050108023-c5249f4df085",
    imageHint: "ecommerce start",
    timer: "72h",
    description: "Comece a vender hoje mesmo com segurança.",
    copy: "O dropshipping e o e-commerce nunca foram tão acessíveis. Criamos uma estrutura completa para você cadastrar seus produtos e receber pagamentos online sem dor de cabeça. Ideal para quem quer iniciar sua jornada no comércio eletrônico.",
    benefits: [
      "Cadastro de até 50 Produtos Iniciais",
      "Integração com Meios de Pagamento (Mercado Pago/Stripe)",
      "Sistema de Cálculo de Frete Automático",
      "Painel de Gerenciamento Simples para o Lojista",
      "Layout Focado em Mobile Commerce"
    ],
    ctaButton: {
      label: "Quero minha loja agora!",
      link: "https://wa.me/5547984538664"
    }
  },
  {
    id: "4",
    title: "Loja Profissional",
    price: 600,
    discount: "25%",
    imageUrl: "https://images.unsplash.com/photo-1487014679447-9f8336841d58",
    imageHint: "professional store",
    timer: "72h",
    description: "E-commerce robusto para quem busca escala.",
    copy: "Sua loja está crescendo e você precisa de mais? A Loja Profissional oferece ferramentas avançadas de marketing e automação. Otimizada para SEO pesado e alta carga de acessos, garantindo que você nunca perca uma venda.",
    benefits: [
      "Produtos Ilimitados",
      "Integração com ERP e Sistemas de Estoque",
      "Sistema de Cupons de Desconto e Promoções",
      "Blog Integrado para SEO de Conteúdo",
      "Relatórios de Vendas Detalhados"
    ],
    ctaButton: {
      label: "Quero escalar minhas vendas!",
      link: "https://wa.me/5547984538664"
    }
  },
  {
    id: "5",
    title: "E-commerce Premium",
    price: 800,
    discount: "30%",
    imageUrl: "https://images.unsplash.com/photo-1531497865144-0464ef8fb9c2",
    imageHint: "premium ecommerce",
    timer: "72h",
    description: "A solução definitiva para grandes operações de vendas.",
    copy: "Sua marca merece o melhor. Um e-commerce premium com checkout em uma página, recuperação de carrinho abandonado e design que grita autoridade. Tudo o que as grandes marcas usam para faturar milhões, agora ao seu alcance.",
    benefits: [
      "Checkout de Uma Única Página (Aumenta Conversão)",
      "Sistema de Recuperação de Carrinho Via WhatsApp",
      "Suporte VIP Prioritário por 60 Dias",
      "Consultoria de Marketing Digital Inclusa",
      "Integração com Marketplace (Amazon, Mercado Livre)"
    ],
    ctaButton: {
      label: "Quero a solução premium!",
      link: "https://wa.me/5547984538664"
    }
  },
  {
    id: "6",
    title: "Plataforma Avançada",
    price: 1000,
    discount: "20%",
    imageUrl: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d",
    imageHint: "advanced platform",
    timer: "72h",
    description: "Sistemas web complexos sob medida para sua empresa.",
    copy: "Precisa de algo que não existe no mercado? Desenvolvemos plataformas SaaS, sistemas de agendamento ou dashboards de gestão personalizados. Tecnologia de ponta para automatizar e escalar seu negócio físico ou digital.",
    benefits: [
      "Desenvolvimento em Next.js e Firebase",
      "Área de Login Segura para Clientes",
      "Banco de Dados em Tempo Real",
      "Integração com APIs Externas",
      "Infraestrutura Escalável em Nuvem"
    ],
    ctaButton: {
      label: "Quero meu sistema exclusivo!",
      link: "https://wa.me/5547984538664"
    }
  },
  {
    id: "7",
    title: "Projeto Personalizado",
    price: 1290,
    discount: "35%",
    imageUrl: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7",
    imageHint: "custom project",
    timer: "72h",
    description: "Exclusividade total: Branding, Site e Estratégia.",
    copy: "O pacote completo para quem quer dominar o mercado. Além do site, entregamos toda a identidade visual e a estratégia de lançamento. Você não recebe apenas um site, recebe uma máquina de vendas pronta para ligar.",
    benefits: [
      "Identidade Visual Completa (Logo, Cores, Fontes)",
      "Site Profissional + Landing Page de Venda",
      "Configuração de Campanhas (Google/Meta Ads)",
      "Treinamento de Gestão da Plataforma",
      "Hospedagem Grátis por 1 Ano"
    ],
    ctaButton: {
      label: "Quero o pacote completo!",
      link: "https://wa.me/5547984538664"
    }
  }
];

export const categories = [];
export const products = [];
export const deals = [];
