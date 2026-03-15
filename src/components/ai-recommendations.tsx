'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { getAIRecommendations } from '@/app/actions';
import { Loader2, Wand2, ChevronRight } from 'lucide-react';

export default function AIRecommendations() {
  const [recommendations, setRecommendations] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [prompt, setPrompt] = useState('');

  const formAction = async (formData: FormData) => {
    setLoading(true);
    setRecommendations([]);
    try {
      const result = await getAIRecommendations(formData);
      setRecommendations(result.products);
    } catch (error) {
      console.error(error);
      setRecommendations(['Ocorreu um erro ao buscar recomendações.']);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-16 md:py-24 bg-secondary">
      <div className="container mx-auto px-4 md:px-6">
        <Card className="max-w-3xl mx-auto shadow-lg">
          <form action={formAction}>
            <CardHeader className="text-center">
              <div className="mx-auto w-fit rounded-full bg-accent/10 p-3">
                <Wand2 className="h-8 w-8 text-accent" />
              </div>
              <CardTitle className="font-headline text-2xl md:text-3xl mt-4">Não sabe o que escolher?</CardTitle>
              <CardDescription className="text-base md:text-lg">
                Descreva o que você procura e nossa IA encontrará os melhores produtos para você.
                <br />
                <span className="text-xs">(Ex: "um presente de tecnologia para meu pai que ama café")</span>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                name="prompt"
                placeholder="Eu estou procurando por..."
                rows={3}
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                required
                className="text-base"
              />
            </CardContent>
            <CardFooter className="flex justify-center">
              <Button type="submit" size="lg" disabled={loading || !prompt}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Buscando...
                  </>
                ) : (
                  <>
                    <Wand2 className="mr-2 h-5 w-5" />
                    Obter Recomendações
                  </>
                )}
              </Button>
            </CardFooter>
          </form>
          {recommendations.length > 0 && (
            <div className="p-6 pt-0">
                <h3 className="text-lg font-semibold mb-2 text-center">Sugestões para você:</h3>
                <ul className="space-y-2">
                {recommendations.map((rec, index) => (
                    <li key={index} className="flex items-center gap-2 rounded-md bg-background p-3">
                        <ChevronRight className="h-5 w-5 text-accent" />
                        <span>{rec}</span>
                    </li>
                ))}
                </ul>
            </div>
          )}
        </Card>
      </div>
    </section>
  );
}
