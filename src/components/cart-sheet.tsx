'use client';

import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle, 
  SheetFooter,
  SheetTrigger 
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Trash2, ArrowRight } from "lucide-react";
import { useCart } from "./cart-context";
import { Badge } from "./ui/badge";
import Link from "next/link";

export default function CartSheet() {
  const { cart, removeFromCart, totalItems, totalPrice } = useCart();

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="relative text-white hover:text-accent">
          <ShoppingCart className="h-6 w-6" />
          {totalItems > 0 && (
            <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-accent text-white border-none text-[10px]">
              {totalItems}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="bg-card border-border w-full sm:max-w-md flex flex-col">
        <SheetHeader className="pb-6 border-b border-border">
          <SheetTitle className="text-2xl font-headline text-white flex items-center gap-2">
            <ShoppingCart className="text-accent" />
            Seu Carrinho
          </SheetTitle>
        </SheetHeader>

        <div className="flex-grow overflow-y-auto py-6 space-y-4">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-60">
              <ShoppingCart className="h-16 w-16" />
              <p>Seu carrinho está vazio.</p>
              <Button variant="outline" className="border-accent text-accent hover:bg-accent/10">
                Ver Ofertas
              </Button>
            </div>
          ) : (
            cart.map((item) => (
              <div key={item.id} className="flex justify-between items-center p-4 rounded-lg bg-secondary/50 border border-border group">
                <div className="flex flex-col">
                  <span className="font-semibold text-white">{item.nome}</span>
                  <span className="text-accent font-bold">R$ {item.preco.toFixed(2)}</span>
                </div>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => removeFromCart(item.id)}
                  className="text-muted-foreground hover:text-destructive transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))
          )}
        </div>

        {cart.length > 0 && (
          <SheetFooter className="pt-6 border-t border-border flex flex-col gap-4">
            <div className="flex justify-between items-center w-full mb-4">
              <span className="text-muted-foreground">Total:</span>
              <span className="text-2xl font-bold text-white">R$ {totalPrice.toFixed(2)}</span>
            </div>
            <Link href="/checkout" className="w-full">
              <Button className="w-full bg-accent hover:bg-accent/90 text-white h-12 text-lg font-bold">
                Finalizar Pedido
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </SheetFooter>
        )}
      </SheetContent>
    </Sheet>
  );
}
