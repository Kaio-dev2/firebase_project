import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Rocket, ShieldCheck, Zap, Cog } from 'lucide-react';

const benefits = [
  {
    icon: Rocket,
    title: 'Velocidade',
    description: 'Sites otimizados para performance, garantindo a melhor experiência para o usuário.',
  },
  {
    icon: ShieldCheck,
    title: 'Segurança',
    description: 'Seus dados e de seus clientes protegidos com as melhores práticas de segurança.',
  },
  {
    icon: Zap,
    title: 'Personalização',
    description: 'Designs únicos e totalmente personalizados para a identidade da sua marca.',
  },
  {
    icon: Cog,
    title: 'Suporte Contínuo',
    description: 'Acompanhamento e suporte técnico para garantir o sucesso do seu projeto online.',
  },
];

export default function Benefits() {
  return (
    <section className="py-16 md:py-24 bg-secondary">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {benefits.map((benefit, index) => (
            <Card key={index} className="transform-gpu border-border bg-card text-center shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-accent/30">
              <CardHeader className="flex flex-col items-center gap-4">
                <div className="rounded-full bg-accent/10 p-4 text-accent transition-colors duration-300 group-hover:bg-accent group-hover:text-accent-foreground">
                  <benefit.icon className="h-8 w-8" />
                </div>
                <CardTitle className="font-headline text-xl">{benefit.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{benefit.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
