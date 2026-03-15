import { Category } from '@/lib/data';
import Link from 'next/link';

interface CategoryGridProps {
  categories: Category[];
}

export default function CategoryGrid({ categories }: CategoryGridProps) {
  return (
    <section id="categories" className="py-16 md:py-24 bg-background">
      <div className="container mx-auto px-4 md:px-6">
        <h2 className="text-center font-headline text-3xl font-bold md:text-4xl">
          Navegue por Categorias
        </h2>
        <p className="mt-4 text-center text-lg text-muted-foreground md:text-xl">
          Encontre exatamente o que você precisa.
        </p>
        <div className="mt-12 grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-8">
          {categories.map((category) => (
            <Link
              href="#"
              key={category.id}
              className="group flex flex-col items-center justify-center gap-4 rounded-lg border bg-card p-6 text-center shadow-sm transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-accent/20"
            >
              <div className="rounded-full bg-accent/10 p-4 transition-colors group-hover:bg-accent">
                <category.icon className="h-8 w-8 text-accent transition-colors group-hover:text-accent-foreground" />
              </div>
              <h3 className="font-headline text-lg font-semibold text-foreground">
                {category.name}
              </h3>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
