
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/header';
import Hero from '@/components/hero';
import ServiceCarousel from '@/components/service-carousel';
import Benefits from '@/components/benefits';
import AboutUs from '@/components/about-us';
import ProjectsSection from '@/components/projects-section';
import CaseStudies from '@/components/case-studies';
import Testimonials from '@/components/testimonials';
import CountdownSection from '@/components/countdown-section';
import Newsletter from '@/components/newsletter';
import FAQ from '@/components/faq';
import Footer from '@/components/footer';
import { services, testimonials } from '@/lib/data';
import { Loader2 } from 'lucide-react';
import { useUser } from '@/firebase';

export default function Home() {
  const router = useRouter();
  const { user, isUserLoading } = useUser();

  useEffect(() => {
    if (!isUserLoading) {
      if (!user) {
        router.push('/login');
      } else if (user.providerData.some(p => p.providerId === 'password') && !user.emailVerified) {
        router.push('/verify-email');
      }
    }
  }, [user, isUserLoading, router]);

  // Trava de renderização: Não mostra nada se estiver carregando, se não houver usuário ou se o e-mail não estiver verificado (para contas de senha)
  const isNotVerified = user && user.providerData.some(p => p.providerId === 'password') && !user.emailVerified;

  if (isUserLoading || !user || isNotVerified) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <Loader2 className="h-10 w-10 animate-spin text-accent" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1">
        <Hero />
        <AboutUs />
        <ServiceCarousel
          services={services}
          title="Planos e Ofertas Especiais"
          subtitle="Escolha o pacote ideal e transforme sua ideia em lucro hoje mesmo."
        />
        <Benefits />
        <CaseStudies />
        <ProjectsSection />
        <CountdownSection />
        <Testimonials testimonials={testimonials} />
        <FAQ />
        <Newsletter />
      </main>
      <Footer />
    </div>
  );
}
