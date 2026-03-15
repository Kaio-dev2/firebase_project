'use client';

import Image from 'next/image';
import * as Tone from 'tone';
import { Product } from '@/lib/data';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Star, ShoppingCart } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { toast } = useToast();
  const productImage = PlaceHolderImages.find((img) => img.id === product.image);

  const playAddToCartSound = () => {
    if (typeof window !== 'undefined') {
      try {
        Tone.start();
        const synth = new Tone.Synth().toDestination();
        synth.triggerAttackRelease('C5', '8n', Tone.now());
        synth.triggerAttackRelease('G5', '8n', Tone.now() + 0.2);
      } catch (error) {
        console.error("Could not play sound:", error);
      }
    }
  };

  const handleAddToCart = () => {
    playAddToCartSound();
    toast({
      title: 'Produto Adicionado!',
      description: `${product.name} foi adicionado ao seu carrinho.`,
    });
  };

  return (
    <Card className="group w-full overflow-hidden border-none shadow-md transition-all duration-300 hover:shadow-2xl hover:-translate-y-2">
      <CardContent className="relative p-0">
        {product.isBestseller && (
          <Badge className="absolute left-3 top-3 z-10 bg-accent text-accent-foreground">Mais Vendido</Badge>
        )}
        {productImage && (
          <div className="aspect-square overflow-hidden">
            <Image
              src={productImage.imageUrl}
              alt={product.name}
              width={600}
              height={600}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
              data-ai-hint={productImage.imageHint}
            />
          </div>
        )}
        <div className="p-4 bg-card">
          <h3 className="truncate font-headline text-lg font-semibold text-foreground">
            {product.name}
          </h3>
          <div className="mt-2 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <p className="text-xl font-bold text-accent">
                R${product.price.toFixed(2)}
              </p>
              {product.originalPrice && (
                <p className="text-sm text-muted-foreground line-through">
                  R${product.originalPrice.toFixed(2)}
                </p>
              )}
            </div>
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span className="text-sm font-medium">{product.rating}</span>
              <span className="text-xs text-muted-foreground">({product.reviewCount})</span>
            </div>
          </div>
          <Button
            onClick={handleAddToCart}
            className={cn(
              'mt-4 w-full bg-primary text-primary-foreground transition-all duration-300 hover:bg-accent hover:text-accent-foreground',
              'group-hover:bg-accent group-hover:text-accent-foreground'
            )}
          >
            <ShoppingCart className="mr-2 h-4 w-4" />
            Adicionar ao carrinho
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
