'use client';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "Como funciona o pagamento?",
    answer: "Trabalhamos com 50% de entrada para início do projeto e 50% na entrega final. Aceitamos Pix, Cartão de Crédito (com parcelamento) e Boleto Bancário via Mercado Pago ou Stripe."
  },
  {
    question: "Tenho direito a quantas revisões?",
    answer: "Nossos pacotes incluem de 2 a 5 rodadas de revisões completas, dependendo do plano escolhido. Queremos garantir que o site fique exatamente como você imaginou."
  },
  {
    question: "O código-fonte é meu?",
    answer: "Sim! Após a quitação do projeto, o código-fonte e todos os acessos são 100% seus. Não prendemos nossos clientes com mensalidades obrigatórias de manutenção."
  },
  {
    question: "Qual o prazo de entrega?",
    answer: "Sites básicos levam em média 7 dias úteis. Projetos complexos ou e-commerces premium podem levar de 15 a 30 dias, dependendo da complexidade das integrações."
  },
  {
    question: "O site já vem com hospedagem?",
    answer: "Oferecemos 1 ano de hospedagem gratuita nos planos 'Projeto Personalizado'. Para os demais, auxiliamos na contratação do melhor custo-benefício do mercado."
  }
];

export default function FAQ() {
  return (
    <section id="faq" className="py-16 md:py-24 bg-background">
      <div className="container mx-auto px-4 md:px-6">
        <div className="mb-12 text-center">
          <h2 className="font-headline text-3xl font-bold text-white mb-4" style={{ textShadow: '0 0 10px hsla(var(--accent), 0.5)' }}>
            Dúvidas Frequentes
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Esclareça suas principais dúvidas e sinta-se seguro para começar seu projeto agora.
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`} className="border-border/50">
                <AccordionTrigger className="text-left text-white hover:text-accent font-medium py-4">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}
