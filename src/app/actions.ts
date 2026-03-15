'use server';

import { personalizedProductRecommendations, PersonalizedProductRecommendationsInput, PersonalizedProductRecommendationsOutput } from '@/ai/flows/personalized-product-recommendations';

export async function getAIRecommendations(formData: FormData): Promise<PersonalizedProductRecommendationsOutput> {
  const userPrompt = formData.get('prompt') as string;
  if (!userPrompt) {
    return { products: [] };
  }
  const input: PersonalizedProductRecommendationsInput = { userPrompt };
  
  try {
    const result = await personalizedProductRecommendations(input);
    return result;
  } catch(error) {
    console.error("AI recommendation failed:", error);
    return { products: ["Desculpe, não foi possível gerar recomendações no momento."] };
  }
}
