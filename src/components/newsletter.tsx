import { Button } from "./ui/button";
import { Input } from "./ui/input";

export default function Newsletter() {
  return (
    <section className="relative overflow-hidden py-16 md:py-24 bg-background">
      <div className="absolute inset-0 z-0 opacity-30">
        <div className="absolute h-96 w-96 rounded-full bg-accent/50 blur-3xl -top-24 -left-24 animate-pulse"></div>
        <div className="absolute h-96 w-96 rounded-full bg-secondary blur-3xl -bottom-24 -right-24 animate-pulse [animation-delay:-4s]"></div>
      </div>
      <div className="container relative z-10 mx-auto px-4 md:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="mt-4 font-headline text-3xl font-bold md:text-4xl text-white" style={{ textShadow: '0 0 10px hsla(var(--accent), 0.5)' }}>
            Quer receber nossas próximas ofertas?
          </h2>
          <p className="mt-4 text-lg text-muted-foreground md:text-xl">
            Cadastre-se para ter acesso a descontos e novidades exclusivas.
          </p>
          <form className="mt-8 flex flex-col gap-4 sm:flex-row">
            <Input 
              type="email" 
              placeholder="Seu melhor e-mail" 
              className="h-12 flex-1 text-base bg-secondary border-border focus:ring-accent focus:border-accent" 
              required 
            />
            <Button 
              type="submit" 
              size="lg" 
              className="relative h-12 overflow-hidden bg-accent text-accent-foreground transition-all duration-300 hover:bg-accent/90 hover:shadow-lg hover:shadow-accent/40"
            >
              <span className="relative z-10">Cadastrar</span>
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
}
