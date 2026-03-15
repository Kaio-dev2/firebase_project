'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Logo } from '@/components/icons';
import { useToast } from '@/hooks/use-toast';
import { Mail, Loader2, CheckCircle2, RefreshCw, LogOut } from 'lucide-react';
import { useAuth, useUser } from '@/firebase';
import { sendEmailVerification, signOut } from 'firebase/auth';

export default function VerifyEmailPage() {
  const { user, isUserLoading } = useUser();
  const auth = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);

  useEffect(() => {
    if (!isUserLoading && !user) {
      router.push('/login');
    }
    if (user?.emailVerified) {
      router.push('/');
    }
  }, [user, isUserLoading, router]);

  const handleReload = async () => {
    if (!user) return;
    setLoading(true);
    try {
      await user.reload();
      if (user.emailVerified) {
        toast({
          title: "E-mail verificado!",
          description: "Bem-vindo ao Arete Groupp.",
        });
        router.push('/');
      } else {
        toast({
          variant: "destructive",
          title: "Ainda não verificado",
          description: "Por favor, clique no link enviado para o seu e-mail.",
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro ao atualizar",
        description: "Tente novamente em instantes.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (!user) return;
    setResending(true);
    try {
      await sendEmailVerification(user);
      toast({
        title: "E-mail reenviado!",
        description: "Verifique sua caixa de entrada e spam.",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erro ao enviar",
        description: "Muitas tentativas. Tente novamente mais tarde.",
      });
    } finally {
      setResending(false);
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    router.push('/login');
  };

  if (isUserLoading || !user) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <Loader2 className="h-10 w-10 animate-spin text-accent" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4 relative overflow-hidden">
      <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
        <div className="absolute h-[500px] w-[500px] rounded-full bg-accent/20 blur-3xl -top-24 -left-24 animate-blob"></div>
        <div className="absolute h-[500px] w-[500px] rounded-full bg-secondary blur-3xl -bottom-24 -right-24 animate-blob [animation-delay:2s]"></div>
      </div>

      <Card className="w-full max-w-md z-10 border-border bg-card/80 backdrop-blur-md shadow-2xl">
        <CardHeader className="space-y-1 flex flex-col items-center">
          <div className="rounded-full bg-accent/10 p-4 mb-4">
            <Mail className="h-10 w-10 text-accent" />
          </div>
          <CardTitle className="text-2xl font-bold font-headline text-white text-center">Verifique seu E-mail</CardTitle>
          <CardDescription className="text-center text-muted-foreground">
            Enviamos um link de confirmação para <br />
            <strong className="text-white">{user.email}</strong>
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4 text-center">
          <p className="text-sm text-muted-foreground leading-relaxed">
            Por favor, clique no link dentro do e-mail para ativar sua conta e acessar todos os recursos da Arete Groupp.
          </p>
        </CardContent>

        <CardFooter className="flex flex-col gap-3 pt-6 border-t border-border/50">
          <Button onClick={handleReload} className="w-full bg-accent h-12 text-lg font-bold" disabled={loading}>
            {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : (
              <span className="flex items-center gap-2">
                Já confirmei <CheckCircle2 className="h-5 w-5" />
              </span>
            )}
          </Button>
          
          <Button variant="outline" onClick={handleResend} className="w-full h-11 border-border bg-transparent" disabled={resending}>
            {resending ? <Loader2 className="h-4 w-4 animate-spin" /> : (
              <span className="flex items-center gap-2">
                Reenviar E-mail <RefreshCw className="h-4 w-4" />
              </span>
            )}
          </Button>

          <Button variant="ghost" onClick={handleLogout} className="w-full text-muted-foreground hover:text-white">
            <LogOut className="mr-2 h-4 w-4" /> Sair
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
