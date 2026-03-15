import { Target, Zap, Shield, TrendingUp } from 'lucide-react';

const values = [
  {
    icon: Target,
    title: 'Nossa Missão',
    description: 'Transformar ideias em ativos digitais lucrativos, democratizando o acesso à tecnologia de ponta para empresas de todos os tamanhos.'
  },
  {
    icon: Zap,
    title: 'Inovação',
    description: 'Utilizamos o que há de mais moderno em Next.js e Firebase para garantir que seu site seja o mais rápido e seguro do mercado.'
  },
  {
    icon: Shield,
    title: 'Compromisso',
    description: 'Não entregamos apenas código; entregamos suporte, segurança e o acompanhamento necessário para seu sucesso online.'
  },
  {
    icon: TrendingUp,
    title: 'Resultados',
    description: 'Nosso foco é o seu ROI. Cada pixel é desenhado estrategicamente para converter visitantes em clientes pagantes.'
  }
];

export default function AboutUs() {
  return (
    <section id="about" className="py-16 md:py-24 bg-background">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h2 className="font-headline text-3xl md:text-4xl font-bold text-white" style={{ textShadow: '0 0 10px hsla(var(--accent), 0.5)' }}>
              Sobre a Arete Groupp
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Fundada com o propósito de elevar o nível digital de negócios brasileiros, a Arete Groupp nasceu da percepção de que muitos empreendedores possuem ótimos produtos, mas pecam na apresentação digital.
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Nossa equipe é composta por especialistas em UX Design, Copywriting e Engenharia de Software. Não fazemos apenas sites; construímos pontes entre marcas e seus clientes ideais. Na Arete Groupp, a "excelência" (aretê) é a nossa bússola diária.
            </p>
            <div className="grid grid-cols-2 gap-4 pt-4">
              <div className="p-4 rounded-lg bg-secondary/50 border border-border">
                <p className="text-2xl font-bold text-accent">+150</p>
                <p className="text-sm text-muted-foreground">Projetos Entregues</p>
              </div>
              <div className="p-4 rounded-lg bg-secondary/50 border border-border">
                <p className="text-2xl font-bold text-accent">98%</p>
                <p className="text-sm text-muted-foreground">Clientes Satisfeitos</p>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {values.map((value, index) => (
              <div key={index} className="p-6 rounded-xl border border-border bg-card shadow-lg transition-all hover:border-accent/30 group">
                <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center text-accent mb-4 group-hover:bg-accent group-hover:text-white transition-colors">
                  <value.icon className="h-6 w-6" />
                </div>
                <h3 className="font-headline text-lg font-semibold mb-2">{value.title}</h3>
                <p className="text-sm text-muted-foreground">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
