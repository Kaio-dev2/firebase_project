import { Deal } from '@/lib/data';
import CountdownTimer from './countdown-timer';
import ProductCard from './product-card';

interface DealsProps {
  deals: Deal[];
}

export default function Deals({ deals }: DealsProps) {
  return (
    <section id="deals" className="py-16 md:py-24 bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 md:px-6">
        <div className="mb-12 text-center">
          <h2 className="font-headline text-3xl font-bold md:text-4xl">
            ⚡ Ofertas Relâmpago
          </h2>
          <p className="mt-4 text-lg text-primary-foreground/70 md:text-xl">
            Aproveite antes que o tempo acabe!
          </p>
        </div>
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          {deals.map((deal) => (
            <div key={deal.id} className="flex flex-col-reverse items-center gap-8 rounded-lg bg-card/5 p-6 md:flex-row">
              <div className="flex-1 text-center md:text-left">
                <h3 className="font-headline text-2xl font-bold">{deal.product.name}</h3>
                <p className="mt-2 text-primary-foreground/70">Oferta exclusiva por tempo limitado.</p>
                <div className="mt-4">
                  <CountdownTimer endDate={deal.endDate} />
                </div>
              </div>
              <div className="w-full max-w-sm flex-1">
                <ProductCard product={deal.product} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
