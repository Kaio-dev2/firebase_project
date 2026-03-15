'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Logo } from '@/components/icons';
import { useToast } from '@/hooks/use-toast';
import { Lock, Loader2, Eye, EyeOff, Phone, Mail, CheckCircle2, AlertTriangle } from 'lucide-react';
import Link from 'next/link';
import { useAuth, useUser, useFirestore } from '@/firebase';
import { 
  signInWithEmailAndPassword, 
  GoogleAuthProvider, 
  signInWithRedirect, 
  getRedirectResult,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  ConfirmationResult
} from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';

declare global {
  interface Window {
    recaptchaVerifier: RecaptchaVerifier | undefined;
  }
}

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [verificationCode, setVerificationCode] = useState(['', '', '', '', '', '']);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);
  const [step, setStep] = useState<'input' | 'otp'>('input');
  const [billingError, setBillingError] = useState(false);
  
  const router = useRouter();
  const { toast } = useToast();
  const auth = useAuth();
  const db = useFirestore();
  const { user, isUserLoading } = useUser();
  const recaptchaRef = useRef<HTMLDivElement>(null);
  const otpRefs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
  ];

  // Handle successful login or existing session
  useEffect(() => {
    if (!isUserLoading && user) {
      // Check if email verification is required
      const isEmailUser = user.providerData.some(p => p.providerId === 'password');
      if (isEmailUser && !user.emailVerified) {
        router.push('/verify-email');
      } else {
        router.push('/');
      }
    }
  }, [user, isUserLoading, router]);

  // Handle Google Redirect Result
  useEffect(() => {
    const handleRedirect = async () => {
      try {
        const result = await getRedirectResult(auth);
        if (result) {
          setLoading(true);
          const user = result.user;
          const userRef = doc(db, 'user_profiles', user.uid);
          const userSnap = await getDoc(userRef);

          if (!userSnap.exists()) {
            await setDoc(userRef, {
              id: user.uid,
              name: user.displayName || 'Usuário Google',
              email: user.email,
              createdAt: serverTimestamp(),
              updatedAt: serverTimestamp(),
            });
          }

          toast({
            title: "Login com Google realizado!",
            description: `Bem-vindo de volta, ${user.displayName}!`,
          });
          router.push('/');
        }
      } catch (error: any) {
        setLoading(false);
      }
    };

    handleRedirect();
  }, [auth, db, router, toast]);

  const setupRecaptcha = () => {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
        'size': 'invisible',
        'callback': () => {
          console.log('Recaptcha resolved');
        }
      });
    }
  };

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      
      toast({
        title: "Login realizado!",
        description: "Seu acesso foi autorizado com sucesso.",
      });

      // Navigation is handled by the useEffect above
    } catch (error: any) {
      console.error("Login error:", error);
      let errorMessage = "E-mail ou senha incorretos.";
      
      if (error.code === 'auth/invalid-credential' || error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
        errorMessage = "Credenciais inválidas. Verifique seus dados.";
      } else if (error.code === 'auth/too-many-requests') {
        errorMessage = "Muitas tentativas malsucedidas. Tente novamente mais tarde.";
      } else if (error.code === 'auth/user-disabled') {
        errorMessage = "Esta conta foi desativada.";
      }

      toast({
        variant: "destructive",
        title: "Erro na autenticação",
        description: errorMessage,
      });
      setLoading(false);
    }
  };

  const handlePhoneSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setBillingError(false);
    
    if (!phoneNumber.startsWith('+')) {
      toast({
        variant: "destructive",
        title: "Formato Inválido",
        description: "O número deve incluir o código do país (ex: +5547999999999).",
      });
      return;
    }

    setLoading(true);
    setupRecaptcha();

    const appVerifier = window.recaptchaVerifier;

    try {
      if (appVerifier) {
        const confirmation = await signInWithPhoneNumber(auth, phoneNumber, appVerifier);
        setConfirmationResult(confirmation);
        setStep('otp');
        toast({
          title: "Código enviado!",
          description: "Verifique seu SMS para obter o código de 6 dígitos.",
        });
      }
    } catch (error: any) {
      console.error("Auth Error:", error.code, error.message);
      
      let errorMessage = "Verifique o número ou tente novamente mais tarde.";
      
      if (error.code === 'auth/billing-not-enabled') {
        setBillingError(true);
        errorMessage = "O serviço de SMS exige o Plano Blaze no console do Firebase.";
      } else if (error.code === 'auth/quota-exceeded') {
        errorMessage = "Cota de SMS excedida para hoje.";
      } else if (error.code === 'auth/operation-not-allowed') {
        errorMessage = "O método de Telefone não está ativado no Firebase Console.";
      }

      toast({
        variant: "destructive",
        title: "Erro no serviço de SMS",
        description: errorMessage,
      });
      
      if (window.recaptchaVerifier) {
        window.recaptchaVerifier.clear();
        window.recaptchaVerifier = undefined;
      }
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    const code = verificationCode.join('');
    if (code.length !== 6) return;

    setLoading(true);
    try {
      if (confirmationResult) {
        const result = await confirmationResult.confirm(code);
        const user = result.user;
        
        const userRef = doc(db, 'user_profiles', user.uid);
        const userSnap = await getDoc(userRef);

        if (!userSnap.exists()) {
          await setDoc(userRef, {
            id: user.uid,
            name: user.phoneNumber || 'Usuário Telefone',
            email: null,
            phoneNumber: user.phoneNumber,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
          });
        }

        toast({
          title: "Acesso autorizado!",
          description: "Bem-vindo ao Arete Groupp.",
        });
        router.push('/');
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Código Inválido",
        description: "O código inserido está incorreto ou expirou.",
      });
      setLoading(false);
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) value = value.slice(-1);
    const newCode = [...verificationCode];
    newCode[index] = value;
    setVerificationCode(newCode);

    if (value && index < 5) {
      otpRefs[index + 1].current?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !verificationCode[index] && index > 0) {
      otpRefs[index - 1].current?.focus();
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    const provider = new GoogleAuthProvider();
    try {
      await signInWithRedirect(auth, provider);
    } catch (error: any) {
      setLoading(false);
    }
  };

  if (isUserLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <Loader2 className="h-10 w-10 animate-spin text-accent" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4 relative overflow-hidden">
      <div id="recaptcha-container"></div>
      <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
        <div className="absolute h-[500px] w-[500px] rounded-full bg-accent/20 blur-3xl -top-24 -left-24 animate-blob"></div>
        <div className="absolute h-[500px] w-[500px] rounded-full bg-secondary blur-3xl -bottom-24 -right-24 animate-blob [animation-delay:2s]"></div>
      </div>

      <Card className="w-full max-w-md z-10 border-border bg-card/80 backdrop-blur-md shadow-2xl">
        <CardHeader className="space-y-1 flex flex-col items-center">
          <div className="rounded-full bg-accent/10 p-4 mb-4">
            <Logo className="h-10 w-10 text-accent" />
          </div>
          <CardTitle className="text-2xl font-bold font-headline text-white">
            {step === 'otp' ? 'Verificar Código' : 'Bem-vindo de volta'}
          </CardTitle>
          <CardDescription className="text-center text-muted-foreground">
            {step === 'otp' 
              ? `Insira o código enviado para ${phoneNumber}` 
              : 'Acesse sua conta para gerenciar seus projetos.'}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {billingError && (
            <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/20 mb-4 animate-in fade-in slide-in-from-top-2">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-destructive shrink-0" />
                <div className="space-y-1">
                  <p className="text-sm font-bold text-destructive">Plano Blaze Necessário</p>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    A autenticação por SMS exige que você ative o faturamento no Console do Firebase. Vá em <b>Configurações do Projeto > Faturamento</b> e faça o upgrade para o Plano Blaze.
                  </p>
                </div>
              </div>
            </div>
          )}

          {step === 'input' ? (
            <Tabs defaultValue="email" className="w-full">
              <TabsList className="grid w-full grid-cols-2 bg-secondary/50 mb-6">
                <TabsTrigger value="email" className="flex items-center gap-2">
                  <Mail className="h-4 w-4" /> E-mail
                </TabsTrigger>
                <TabsTrigger value="phone" className="flex items-center gap-2">
                  <Phone className="h-4 w-4" /> Telefone
                </TabsTrigger>
              </TabsList>

              <TabsContent value="email">
                <form onSubmit={handleEmailLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">E-mail</Label>
                    <Input 
                      id="email" 
                      type="email" 
                      placeholder="exemplo@email.com" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required 
                      className="bg-secondary/50 border-border"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Senha</Label>
                    <div className="relative">
                      <Input 
                        id="password" 
                        type={showPassword ? "text" : "password"} 
                        placeholder="******"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required 
                        className="bg-secondary/50 border-border pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-accent"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>
                  <Button type="submit" className="w-full bg-accent hover:bg-accent/90 h-12 text-lg font-bold" disabled={loading}>
                    {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : "Entrar com E-mail"}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="phone">
                <form onSubmit={handlePhoneSignIn} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Número de Telefone</Label>
                    <Input 
                      id="phone" 
                      type="tel" 
                      placeholder="+5547999999999" 
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      required 
                      className="bg-secondary/50 border-border"
                    />
                  </div>
                  <Button type="submit" className="w-full bg-accent hover:bg-accent/90 h-12 text-lg font-bold" disabled={loading}>
                    {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : "Enviar Código SMS"}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          ) : (
            <div className="space-y-6">
              <div className="flex justify-between gap-2">
                {verificationCode.map((digit, index) => (
                  <Input
                    key={index}
                    ref={otpRefs[index]}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(index, e)}
                    className="h-12 w-12 text-center text-xl font-bold bg-secondary/50 border-accent/30 focus:border-accent"
                  />
                ))}
              </div>
              <Button 
                onClick={handleVerifyOtp} 
                className="w-full bg-accent hover:bg-accent/90 h-12 text-lg font-bold" 
                disabled={loading || verificationCode.some(d => !d)}
              >
                {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : (
                  <span className="flex items-center gap-2">
                    Confirmar Código <CheckCircle2 className="h-5 w-5" />
                  </span>
                )}
              </Button>
              <button 
                onClick={() => { setStep('input'); setVerificationCode(['','','','','','']); }} 
                className="w-full text-center text-sm text-accent hover:underline"
              >
                Alterar número de telefone
              </button>
            </div>
          )}

          {step === 'input' && (
            <>
              <div className="relative w-full py-2">
                <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-border" /></div>
                <div className="relative flex justify-center text-xs uppercase"><span className="bg-card px-2 text-muted-foreground">Ou</span></div>
              </div>

              <Button 
                type="button" 
                variant="outline" 
                className="w-full border-border bg-transparent hover:bg-secondary/50 h-12"
                onClick={handleGoogleLogin}
                disabled={loading}
              >
                <svg className="mr-2 h-4 w-4" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512">
                  <path fill="currentColor" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"></path>
                </svg>
                Continuar com Google
              </Button>
            </>
          )}
        </CardContent>

        {step === 'input' && (
          <CardFooter className="flex flex-col space-y-4 border-t border-border/50 pt-6">
            <p className="text-sm text-center text-muted-foreground">
              Ainda não tem uma conta?{' '}
              <Link href="/register" className="text-accent hover:underline font-semibold">
                Criar conta gratuita
              </Link>
            </p>
          </CardFooter>
        )}
      </Card>
    </div>
  );
}
