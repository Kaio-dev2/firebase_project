import { Service } from '@/lib/data';
import ServiceCard from '@/components/service-card';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';

interface ServiceCarouselProps {
  services: Service[];
  title: string;
  subtitle: string;
}

export default function ServiceCarousel({ services, title, subtitle }: ServiceCarouselProps) {
  return (
    <section id="ofertas" className="w-full py-16 md:py-24 bg-background">
      <div className="container mx-auto px-4 md:px-6">
        <div className="mb-12 text-center">
          <h2 className="font-headline text-3xl font-bold md:text-4xl text-white" style={{ textShadow: '0 0 10px hsla(var(--accent), 0.5)' }}>
            {title}
          </h2>
          <p className="mt-4 text-lg text-muted-foreground md:text-xl max-w-3xl mx-auto">
            {subtitle}
          </p>
        </div>
        <Carousel
          opts={{
            align: 'start',
            loop: true,
          }}
          className="w-full"
        >
          <CarouselContent>
            {services.map((service) => (
              <CarouselItem key={service.id} className="md:basis-1/2 lg:basis-1/3">
                <div className="p-1 h-full">
                  <ServiceCard service={service} />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="hidden sm:flex" />
          <CarouselNext className="hidden sm:flex" />
        </Carousel>
      </div>
    </section>
  );
}
