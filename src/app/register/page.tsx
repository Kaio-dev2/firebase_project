
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
import { UserPlus, Loader2, Eye, EyeOff, Phone, Mail, CheckCircle2, AlertTriangle } from 'lucide-react';
import Link from 'next/link';
import { useAuth, useFirestore, useUser } from '@/firebase';
import { 
  createUserWithEmailAndPassword, 
  updateProfile, 
  GoogleAuthProvider, 
  signInWithRedirect, 
  getRedirectResult,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  ConfirmationResult,
  sendEmailVerification
} from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';

declare global {
  interface Window {
    recaptchaVerifier: RecaptchaVerifier | undefined;
  }
}

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [verificationCode, setVerificationCode] = useState(['', '', '', '', '', '']);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<'input' | 'otp'>('input');
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);
  const [billingError, setBillingError] = useState(false);
  
  const router = useRouter();
  const { toast } = useToast();
  const auth = useAuth();
  const db = useFirestore();
  const { user, isUserLoading } = useUser();
  const otpRefs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
  ];

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
          router.push('/');
        }
      } catch (error: any) {
        setLoading(false);
      }
    };
    handleRedirect();
  }, [auth, db, router]);

  useEffect(() => {
    if (!isUserLoading && user) {
      if (user.providerData.some(p => p.providerId === 'password') && !user.emailVerified) {
        router.push('/verify-email');
      } else {
        router.push('/');
      }
    }
  }, [user, isUserLoading, router]);

  const setupRecaptcha = () => {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
        'size': 'invisible'
      });
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast({ variant: "destructive", title: "Erro na validação", description: "As senhas não coincidem." });
      return;
    }
    setLoading(true);

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // Enviar verificação de e-mail imediatamente no cadastro
      try {
        await sendEmailVerification(user);
        toast({
          title: "Conta criada!",
          description: "Enviamos um e-mail de verificação. Por favor, verifique sua caixa de entrada.",
        });
      } catch (emailErr: any) {
        console.error("Email verification failed to send:", emailErr);
        toast({
          variant: "destructive",
          title: "Erro no envio de e-mail",
          description: "Sua conta foi criada, mas não conseguimos enviar o link de verificação agora. Tente reenviar na próxima tela.",
        });
      }
      
      await updateProfile(user, { displayName: name });
      await setDoc(doc(db, 'user_profiles', user.uid), {
        id: user.uid,
        name: name,
        email: email,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      
      router.push('/verify-email');
    } catch (error: any) {
      let errorMessage = "O e-mail já está em uso ou é inválido.";
      if (error.code === 'auth/email-already-in-use') {
        errorMessage = "Este usuário já possui cadastro. Faça login.";
      }
      toast({ variant: "destructive", title: "Erro no cadastro", description: errorMessage });
      setLoading(false);
    }
  };

  const handlePhoneSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setBillingError(false);
    
    if (!phoneNumber.startsWith('+')) {
      toast({ variant: "destructive", title: "Formato Inválido", description: "Use o formato +5547999999999" });
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
      }
    } catch (error: any) {
      console.error("SMS Error:", error.code, error.message);
      let errorMessage = "Erro ao enviar código de verificação.";
      
      if (error.code === 'auth/billing-not-enabled') {
        setBillingError(true);
        errorMessage = "O serviço de SMS exige a ativação do Plano Blaze no Console do Firebase.";
      } else if (error.code === 'auth/operation-not-allowed') {
        errorMessage = "Login por Telefone não ativado nas configurações do Firebase.";
      }

      toast({ variant: "destructive", title: "Erro SMS", description: errorMessage });
      if (window.recaptchaVerifier) window.recaptchaVerifier.clear();
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    const code = verificationCode.join('');
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
            name: name || user.phoneNumber || 'Usuário Telefone',
            email: null,
            phoneNumber: user.phoneNumber,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
          });
        }
        router.push('/');
      }
    } catch (error: any) {
      toast({ variant: "destructive", title: "Erro", description: "Código de verificação inválido." });
      setLoading(false);
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) value = value.slice(-1);
    const newCode = [...verificationCode];
    newCode[index] = value;
    setVerificationCode(newCode);
    if (value && index < 5) otpRefs[index + 1].current?.focus();
  };

  const handleGoogleRegister = async () => {
    setLoading(true);
    const provider = new GoogleAuthProvider();
    try { await signInWithRedirect(auth, provider); } catch (error) { setLoading(false); }
  };

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
          <CardTitle className="text-2xl font-bold font-headline text-white">Criar Conta</CardTitle>
          <CardDescription className="text-center text-muted-foreground">
            {step === 'otp' ? 'Confirme o SMS recebido' : 'Junte-se à Arete Groupp hoje.'}
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
                    O envio de SMS exige o <b>Plano Blaze</b> ativo no Console do Firebase (Configurações do Projeto > Faturamento).
                  </p>
                </div>
              </div>
            </div>
          )}

          {step === 'input' ? (
            <Tabs defaultValue="email" className="w-full">
              <TabsList className="grid w-full grid-cols-2 bg-secondary/50 mb-6">
                <TabsTrigger value="email" className="flex items-center gap-2"><Mail className="h-4 w-4" /> E-mail</TabsTrigger>
                <TabsTrigger value="phone" className="flex items-center gap-2"><Phone className="h-4 w-4" /> Telefone</TabsTrigger>
              </TabsList>

              <TabsContent value="email">
                <form onSubmit={handleRegister} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nome Completo</Label>
                    <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required className="bg-secondary/50" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">E-mail</Label>
                    <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="bg-secondary/50" />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-2">
                      <Label htmlFor="password">Senha</Label>
                      <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="bg-secondary/50" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirm">Confirmar</Label>
                      <Input id="confirm" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required className="bg-secondary/50" />
                    </div>
                  </div>
                  <Button type="submit" className="w-full bg-accent" disabled={loading}>
                    {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Criar com E-mail"}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="phone">
                <form onSubmit={handlePhoneSignUp} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name-phone">Nome Completo</Label>
                    <Input id="name-phone" value={name} onChange={(e) => setName(e.target.value)} required className="bg-secondary/50" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Telefone (+55...)</Label>
                    <Input id="phone" type="tel" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} required className="bg-secondary/50" />
                    <div className="flex items-start gap-2 p-3 rounded-lg bg-accent/10 border border-accent/20 mt-2">
                      <AlertTriangle className="h-4 w-4 text-accent shrink-0 mt-0.5" />
                      <p className="text-[10px] text-muted-foreground leading-tight">O serviço de SMS exige o Plano Blaze no Console do Firebase.</p>
                    </div>
                  </div>
                  <Button type="submit" className="w-full bg-accent" disabled={loading}>
                    {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Enviar SMS de Validação"}
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
                    className="h-12 w-12 text-center text-xl font-bold bg-secondary/50"
                  />
                ))}
              </div>
              <Button onClick={handleVerifyOtp} className="w-full bg-accent h-12" disabled={loading}>
                {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : "Concluir Cadastro"}
              </Button>
            </div>
          )}

          {step === 'input' && (
            <Button variant="outline" className="w-full border-border bg-transparent h-12" onClick={handleGoogleRegister} disabled={loading}>
              Google
            </Button>
          )}
        </CardContent>

        <CardFooter className="flex flex-col space-y-4 pt-6">
          <p className="text-sm text-center text-muted-foreground">
            Já tem uma conta? <Link href="/login" className="text-accent hover:underline font-semibold">Entre aqui</Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
