'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/header';
import Footer from '@/components/footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useCart } from '@/components/cart-context';
import { useUser } from '@/firebase';
import { Loader2, CheckCircle, CreditCard, ShieldCheck } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function CheckoutPage() {
  const { cart, totalPrice, clearCart } = useCart();
  const { user, isUserLoading } = useUser();
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);

  useEffect(() => {
    if (!isUserLoading) {
      if (!user) {
        router.push('/login');
      } else if (user.providerData.some(p => p.providerId === 'password') && !user.emailVerified) {
        router.push('/verify-email');
      }
    }
  }, [user, isUserLoading, router]);

  if (isUserLoading || !user) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <Loader2 className="h-10 w-10 animate-spin text-accent" />
      </div>
    );
  }

  if (cart.length === 0 && !orderComplete) {
    return (
      <div className="flex min-h-screen flex-col bg-background">
        <Header />
        <main className="flex-1 flex flex-col items-center justify-center p-4">
          <Card className="max-w-md w-full text-center p-8 bg-card border-border">
            <CardTitle className="mb-4">Seu carrinho está vazio</CardTitle>
            <p className="text-muted-foreground mb-6">Adicione algum serviço para prosseguir com o checkout.</p>
            <Button onClick={() => router.push('/')} className="bg-accent">
              Ver Planos
            </Button>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  const handleFinish = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simulate payment processing
    setTimeout(() => {
      setLoading(false);
      setOrderComplete(true);
      clearCart();
      toast({
        title: "Pedido recebido!",
        description: "Em instantes um especialista entrará em contato via WhatsApp.",
      });
    }, 2000);
  };

  if (orderComplete) {
    return (
      <div className="flex min-h-screen flex-col bg-background">
        <Header />
        <main className="flex-1 flex flex-col items-center justify-center p-4">
          <Card className="max-w-2xl w-full text-center p-12 bg-card border-border shadow-2xl">
            <div className="mx-auto w-20 h-20 rounded-full bg-green-500/10 flex items-center justify-center mb-6">
              <CheckCircle className="h-12 w-12 text-green-500" />
            </div>
            <CardHeader>
              <CardTitle className="text-3xl font-headline text-white">Obrigado pela confiança!</CardTitle>
              <p className="text-xl text-muted-foreground mt-4">
                Seu pedido foi processado com sucesso. Nossa equipe já está analisando seus requisitos.
              </p>
            </CardHeader>
            <CardContent className="space-y-4 pt-6">
              <p className="text-sm text-muted-foreground">
                Um e-mail de confirmação foi enviado para <strong>{user.email}</strong>.
                Você será redirecionado para o WhatsApp para os próximos passos.
              </p>
            </CardContent>
            <CardFooter className="flex justify-center pt-8">
              <Button size="lg" onClick={() => router.push('/')} className="bg-accent">
                Voltar para o Início
              </Button>
            </CardFooter>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1 py-12 md:py-20">
        <div className="container mx-auto px-4 md:px-6">
          <h1 className="font-headline text-3xl md:text-4xl font-bold text-white mb-8" style={{ textShadow: '0 0 10px hsla(var(--accent), 0.5)' }}>
            Checkout
          </h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="text-xl">Informações de Contato</CardTitle>
                </CardHeader>
                <CardContent className="grid gap-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Nome Completo</Label>
                      <Input id="name" defaultValue={user.displayName || ''} className="bg-secondary/50" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">E-mail</Label>
                      <Input id="email" defaultValue={user.email || ''} readOnly className="bg-secondary/20" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="whatsapp">WhatsApp (com DDD)</Label>
                    <Input id="whatsapp" placeholder="(00) 00000-0000" className="bg-secondary/50" required />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="text-xl flex items-center gap-2">
                    <CreditCard className="text-accent" />
                    Forma de Pagamento
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="p-4 rounded-lg border border-accent/20 bg-accent/5 flex items-center gap-4">
                    <div className="w-4 h-4 rounded-full border-4 border-accent"></div>
                    <div>
                      <p className="font-bold text-white text-lg">Pagamento na Entrega (50/50)</p>
                      <p className="text-sm text-muted-foreground">Inicie agora pagando apenas metade. O restante na entrega.</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <Card className="bg-card border-border sticky top-24">
                <CardHeader>
                  <CardTitle className="text-xl">Resumo do Pedido</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {cart.map((item) => (
                    <div key={item.id} className="flex justify-between items-center text-sm">
                      <span className="text-muted-foreground">{item.nome}</span>
                      <span className="text-white font-medium">R$ {item.preco.toFixed(2)}</span>
                    </div>
                  ))}
                  <div className="border-t border-border pt-4 mt-4 flex justify-between items-center">
                    <span className="text-lg font-bold">Total</span>
                    <span className="text-2xl font-bold text-accent">R$ {totalPrice.toFixed(2)}</span>
                  </div>
                </CardContent>
                <CardFooter className="flex flex-col gap-4">
                  <Button 
                    className="w-full bg-accent hover:bg-accent/90 text-white font-bold h-14 text-lg shadow-lg shadow-accent/20"
                    onClick={handleFinish}
                    disabled={loading}
                  >
                    {loading ? (
                      <Loader2 className="animate-spin h-5 w-5" />
                    ) : (
                      "Confirmar Pedido"
                    )}
                  </Button>
                  <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
                    <ShieldCheck className="h-4 w-4 text-green-500" />
                    Seus dados estão protegidos
                  </div>
                </CardFooter>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
