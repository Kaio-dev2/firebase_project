import { Button } from '@/components/ui/button';
import TypingEffect from './typing-effect';
import Link from 'next/link';

export default function Hero() {

  return (
    <section className="relative h-[90vh] min-h-[700px] w-full text-white overflow-hidden bg-background">
      <div className="absolute inset-0 z-0 opacity-40">
        <div className="absolute h-[500px] w-[500px] rounded-full bg-accent/20 blur-3xl -top-24 -left-24 animate-pulse"></div>
        <div className="absolute h-[500px] w-[500px] rounded-full bg-secondary blur-3xl -bottom-24 -right-24 animate-pulse [animation-delay:-4s]"></div>
      </div>
      <div className="absolute inset-0 bg-gradient-to-b from-background via-transparent to-background" />

      <div className="container relative z-10 mx-auto flex h-full flex-col items-center justify-center text-center">
        <div className="max-w-4xl">
          <h1 className="font-headline text-4xl font-bold leading-tight tracking-tighter md:text-6xl lg:text-7xl" style={{ textShadow: '0 0 15px hsla(var(--accent), 0.7)' }}>
            <TypingEffect text="Transforme sua ideia em um site profissional e lucrativo" />
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-white/80 md:text-xl">
            Criação de sites, lojas online e sistemas com performance e design modernos.
          </p>
        </div>
        <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row">
            <Link href="#ofertas" passHref>
                <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 text-lg px-8 py-6 rounded-full font-bold shadow-lg shadow-accent/40 transition-transform duration-300 hover:scale-105">
                    PEÇA SEU SITE AGORA
                </Button>
            </Link>
             <Link href="https://wa.me/5547984538664" target="_blank" passHref>
                <Button size="lg" variant="outline" className="text-lg px-8 py-6 rounded-full font-bold border-accent/50 hover:bg-accent/10 hover:border-accent hover:text-white transition-all duration-300">
                    Falar com os especialistas
                </Button>
            </Link>
        </div>
      </div>
    </section>
  );
}
