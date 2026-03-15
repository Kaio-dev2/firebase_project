import Image from 'next/image';
import { Testimonial } from '@/lib/data';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Card, CardContent } from '@/components/ui/card';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { Star } from 'lucide-react';

interface TestimonialsProps {
  testimonials: Testimonial[];
}

export default function Testimonials({ testimonials }: TestimonialsProps) {
  return (
    <section id="testimonials" className="py-16 md:py-24 bg-gradient-to-br from-background via-secondary to-background">
      <div className="container mx-auto px-4 md:px-6">
        <div className="mb-12 text-center">
          <h2 className="font-headline text-3xl font-bold md:text-4xl text-white" style={{ textShadow: '0 0 10px hsla(var(--accent), 0.5)' }}>
            O que nossos clientes dizem
          </h2>
          <p className="mt-4 text-lg text-muted-foreground md:text-xl">
            A confiança de quem já transformou seu negócio conosco.
          </p>
        </div>
        <Carousel
          opts={{ align: 'start', loop: true }}
          className="mx-auto w-full max-w-4xl"
        >
          <CarouselContent>
            {testimonials.map((testimonial) => {
              const testimonialImage = PlaceHolderImages.find((img) => img.id === testimonial.image);
              return (
                <CarouselItem key={testimonial.id}>
                  <div className="p-1">
                    <Card className="border-border bg-card/80 shadow-lg backdrop-blur-sm">
                      <CardContent className="flex flex-col items-center justify-center p-8 text-center">
                        <div className="mb-4 flex">
                          {[...Array(testimonial.avaliacao)].map((_, i) => (
                            <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                          ))}
                           {[...Array(5 - testimonial.avaliacao)].map((_, i) => (
                            <Star key={`empty-${i}`} className="h-5 w-5 fill-muted text-muted" />
                          ))}
                        </div>
                        <p className="mb-6 text-lg italic text-foreground">
                          “{testimonial.comentario}”
                        </p>
                        {testimonialImage && (
                          <Image
                            src={testimonialImage.imageUrl}
                            alt={testimonial.nome}
                            width={80}
                            height={80}
                            className="mb-2 rounded-full border-4 border-accent"
                            data-ai-hint={testimonialImage.imageHint}
                          />
                        )}
                        <h3 className="font-headline text-lg font-semibold text-foreground">
                          {testimonial.nome}
                        </h3>
                      </CardContent>
                    </Card>
                  </div>
                </CarouselItem>
              );
            })}
          </CarouselContent>
          <CarouselPrevious className="hidden sm:flex" />
          <CarouselNext className="hidden sm:flex" />
        </Carousel>
      </div>
    </section>
  );
}
