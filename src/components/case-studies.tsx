import { caseStudies } from '@/lib/data';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Code, CheckCircle2, AlertCircle } from 'lucide-react';

export default function CaseStudies() {
  return (
    <section id="cases" className="py-16 md:py-24 bg-secondary">
      <div className="container mx-auto px-4 md:px-6">
        <div className="mb-12 text-center">
          <h2 className="font-headline text-3xl font-bold text-white mb-4" style={{ textShadow: '0 0 10px hsla(var(--accent), 0.5)' }}>
            Estudos de Caso e Resultados
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Veja como resolvemos problemas complexos e geramos valor real para nossos clientes.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {caseStudies.map((caseStudy) => {
            const caseImage = PlaceHolderImages.find((img) => img.id === caseStudy.image);
            return (
              <Card key={caseStudy.id} className="overflow-hidden border-border bg-card shadow-xl transition-all duration-300 hover:shadow-accent/10">
                <div className="aspect-video relative overflow-hidden bg-secondary/20">
                  {caseImage && (
                    <Image
                      src={caseImage.imageUrl}
                      alt={caseStudy.title}
                      fill
                      className="object-cover transition-transform duration-500 hover:scale-105"
                      data-ai-hint={caseImage.imageHint}
                    />
                  )}
                  <div className="absolute top-3 left-3">
                    <Badge variant="secondary" className="bg-accent/90 text-white backdrop-blur-sm">
                      {caseStudy.client}
                    </Badge>
                  </div>
                </div>
                <CardHeader className="pb-2">
                  <CardTitle className="font-headline text-xl text-white">{caseStudy.title}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-start gap-2">
                      <AlertCircle className="h-5 w-5 text-destructive mt-0.5 shrink-0" />
                      <div>
                        <p className="text-xs uppercase font-bold text-muted-foreground">O Problema</p>
                        <p className="text-sm text-foreground/90">{caseStudy.problem}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <Code className="h-5 w-5 text-accent mt-0.5 shrink-0" />
                      <div>
                        <p className="text-xs uppercase font-bold text-muted-foreground">Tecnologia</p>
                        <p className="text-sm text-foreground/90">{caseStudy.technology}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 shrink-0" />
                      <div>
                        <p className="text-xs uppercase font-bold text-muted-foreground">O Resultado</p>
                        <p className="text-sm font-semibold text-white">{caseStudy.result}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
