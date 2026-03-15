
import { offerPages } from '@/lib/data';
import { notFound } from 'next/navigation';
import Header from '@/components/header';
import Footer from '@/components/footer';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Clock } from 'lucide-react';
import CountdownTimer from '@/components/countdown-timer';
import Link from 'next/link';

export async function generateStaticParams() {
  return offerPages.map((offer) => ({
    id: offer.id,
  }));
}

export default async function OfferPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const offer = offerPages.find((p) => p.id === id);

  if (!offer) {
    notFound();
  }

  const promotionEndDate = new Date();
  promotionEndDate.setHours(promotionEndDate.getHours() + 72);

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1 py-16 md:py-24">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12">
            <div className="flex flex-col gap-6">
              <div className="aspect-video overflow-hidden rounded-lg border border-border shadow-lg bg-secondary/20">
                <Image
                  src={offer.imageUrl}
                  alt={offer.title}
                  width={1280}
                  height={720}
                  className="h-full w-full object-cover"
                  priority
                />
              </div>
               <div className="rounded-lg border border-accent/20 bg-card p-6 shadow-lg">
                <div className="flex items-center gap-4 text-accent mb-4">
                  <Clock className="h-6 w-6" />
                  <h3 className="text-xl font-headline font-semibold">Oferta por Tempo Limitado!</h3>
                </div>
                <CountdownTimer endDate={promotionEndDate.toISOString()} />
              </div>
            </div>

            <div className="flex flex-col gap-4">
                <div className="flex justify-between items-start">
                    <h1 className="font-headline text-3xl md:text-4xl font-bold text-white" style={{ textShadow: '0 0 10px hsla(var(--accent), 0.5)' }}>
                        {offer.title}
                    </h1>
                    {offer.discount && (
                        <Badge variant="destructive" className="bg-accent text-accent-foreground text-lg whitespace-nowrap">
                            {offer.discount} OFF
                        </Badge>
                    )}
                </div>

              <p className="text-muted-foreground text-lg">{offer.description}</p>
              
              <div className="flex items-baseline gap-4">
                <p className="text-4xl font-bold text-accent">R$ {offer.price.toFixed(2)}</p>
              </div>

              <p className="text-foreground/90 whitespace-pre-line">{offer.copy}</p>

              <div className="my-4 space-y-3">
                <h3 className="font-headline text-xl font-semibold">Benefícios inclusos:</h3>
                <ul className="space-y-2">
                  {offer.benefits.map((benefit, index) => (
                    <li key={index} className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-accent" />
                      <span className="text-muted-foreground">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <Link href={offer.ctaButton.link} target="_blank" className="w-full mt-4">
                <Button size="lg" className="w-full bg-accent text-accent-foreground hover:bg-accent/90 text-lg py-7 rounded-lg font-bold shadow-lg shadow-accent/40 transition-transform duration-300 hover:scale-105">
                  {offer.ctaButton.label}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
