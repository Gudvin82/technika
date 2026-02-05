import { Heart, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '../store';
import { products } from '../data/products';
import { ProductCard } from '../components/ProductCard';
import { Product } from '../types';
import { cn } from '../utils/cn';

interface FavoritesScreenProps {
  onProductPress: (product: Product) => void;
}

export function FavoritesScreen({ onProductPress }: FavoritesScreenProps) {
  const theme = useStore((s) => s.theme);
  const favorites = useStore((s) => s.favorites);
  const toggleFavorite = useStore((s) => s.toggleFavorite);
  const isNeon = theme === 'neon';

  const favoriteProducts = favorites
    .map((id) => products.find((p) => p.id === id))
    .filter(Boolean) as Product[];

  if (favoriteProducts.length === 0) {
    return (
      <div className={cn(
        'min-h-screen flex flex-col items-center justify-center px-8 pb-24',
        isNeon
          ? 'bg-gradient-to-b from-slate-900 via-slate-900 to-purple-900/50'
          : 'bg-slate-50'
      )}>
        <div className={cn(
          'w-24 h-24 rounded-full flex items-center justify-center mb-6',
          isNeon ? 'bg-slate-800' : 'bg-slate-100'
        )}>
          <Heart size={40} className={isNeon ? 'text-slate-600' : 'text-slate-400'} />
        </div>
        <h2 className={cn(
          'text-xl font-semibold mb-2',
          isNeon ? 'text-white' : 'text-slate-900'
        )}>
          Избранное пусто
        </h2>
        <p className={cn(
          'text-center',
          isNeon ? 'text-slate-400' : 'text-slate-500'
        )}>
          Нажмите ❤️ на товаре, чтобы добавить его в избранное
        </p>
      </div>
    );
  }

  return (
    <div className={cn(
      'min-h-screen pb-24',
      isNeon
        ? 'bg-gradient-to-b from-slate-900 via-slate-900 to-purple-900/50'
        : 'bg-slate-50'
    )}>
      {/* Header */}
      <div className={cn(
        'sticky top-0 z-30 px-4 py-4 flex items-center justify-between',
        isNeon
          ? 'bg-slate-900/95 backdrop-blur-xl'
          : 'bg-white/95 backdrop-blur-xl shadow-sm'
      )}>
        <h1 className={cn(
          'text-xl font-bold',
          isNeon ? 'text-white' : 'text-slate-900'
        )}>
          Избранное ({favoriteProducts.length})
        </h1>
        <button
          onClick={() => favorites.forEach(id => toggleFavorite(id))}
          className={cn(
            'p-2 rounded-xl transition-colors',
            isNeon
              ? 'text-red-400 hover:bg-red-500/10'
              : 'text-red-500 hover:bg-red-50'
          )}
        >
          <Trash2 size={20} />
        </button>
      </div>

      {/* Grid */}
      <div className="px-4 py-2">
        <div className="grid grid-cols-2 gap-3">
          <AnimatePresence mode="popLayout">
            {favoriteProducts.map((product) => (
              <motion.div
                key={product.id}
                layout
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
              >
                <ProductCard
                  product={product}
                  onPress={() => onProductPress(product)}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
