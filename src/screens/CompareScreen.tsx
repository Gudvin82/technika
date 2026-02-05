import { ChevronLeft, X, ShoppingCart, Check } from 'lucide-react';
import { motion } from 'framer-motion';
import { useStore } from '../store';
import { products } from '../data/products';
import { Product } from '../types';
import { cn } from '../utils/cn';

interface CompareScreenProps {
  onBack: () => void;
  onProductPress: (product: Product) => void;
}

export function CompareScreen({ onBack, onProductPress }: CompareScreenProps) {
  const theme = useStore((s) => s.theme);
  const compareList = useStore((s) => s.compareList);
  const toggleCompare = useStore((s) => s.toggleCompare);
  const addToCart = useStore((s) => s.addToCart);
  const cart = useStore((s) => s.cart);
  const isNeon = theme === 'neon';

  const compareProducts = compareList
    .map(id => products.find(p => p.id === id))
    .filter(Boolean) as Product[];

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ru-RU').format(price) + ' ₽';
  };

  // Get all unique spec keys from compared products
  const allSpecKeys = Array.from(
    new Set(compareProducts.flatMap(p => Object.keys(p.specs)))
  );

  if (compareProducts.length === 0) {
    return (
      <div className={cn(
        'min-h-screen pb-24',
        isNeon
          ? 'bg-gradient-to-b from-slate-900 via-slate-900 to-purple-900/50'
          : 'bg-slate-50'
      )}>
        {/* Header */}
        <div className={cn(
          'sticky top-0 z-30 px-4 py-4 flex items-center gap-4',
          isNeon
            ? 'bg-slate-900/95 backdrop-blur-xl'
            : 'bg-white/95 backdrop-blur-xl shadow-sm'
        )}>
          <button
            onClick={onBack}
            className={cn(
              'p-2 rounded-xl transition-colors',
              isNeon ? 'bg-slate-800 text-white' : 'bg-slate-100 text-slate-700'
            )}
          >
            <ChevronLeft size={22} />
          </button>
          <h1 className={cn(
            'text-xl font-bold',
            isNeon ? 'text-white' : 'text-slate-900'
          )}>
            Сравнение товаров
          </h1>
        </div>

        <div className="flex flex-col items-center justify-center px-8 pt-20">
          <div className={cn(
            'w-24 h-24 rounded-full flex items-center justify-center mb-6',
            isNeon ? 'bg-slate-800' : 'bg-slate-100'
          )}>
            <span className="text-4xl">⚖️</span>
          </div>
          <h2 className={cn(
            'text-xl font-semibold mb-2 text-center',
            isNeon ? 'text-white' : 'text-slate-900'
          )}>
            Добавьте товары для сравнения
          </h2>
          <p className={cn(
            'text-center',
            isNeon ? 'text-slate-400' : 'text-slate-500'
          )}>
            Нажмите кнопку «Сравнить» на карточке товара, чтобы добавить его сюда
          </p>
        </div>
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
        'sticky top-0 z-30 px-4 py-4 flex items-center gap-4',
        isNeon
          ? 'bg-slate-900/95 backdrop-blur-xl'
          : 'bg-white/95 backdrop-blur-xl shadow-sm'
      )}>
        <button
          onClick={onBack}
          className={cn(
            'p-2 rounded-xl transition-colors',
            isNeon ? 'bg-slate-800 text-white' : 'bg-slate-100 text-slate-700'
          )}
        >
          <ChevronLeft size={22} />
        </button>
        <h1 className={cn(
          'text-xl font-bold',
          isNeon ? 'text-white' : 'text-slate-900'
        )}>
          Сравнение ({compareProducts.length})
        </h1>
      </div>

      {/* Horizontal scroll container */}
      <div className="overflow-x-auto">
        <div className="min-w-max">
          {/* Product headers (sticky) */}
          <div className={cn(
            'sticky top-[72px] z-20 flex',
            isNeon ? 'bg-slate-900/95 backdrop-blur-xl' : 'bg-white/95 backdrop-blur-xl'
          )}>
            {/* Empty cell for labels */}
            <div className="w-32 flex-shrink-0" />
            
            {/* Product cards */}
            {compareProducts.map((product) => (
              <div key={product.id} className="w-44 flex-shrink-0 p-2">
                <div className={cn(
                  'rounded-xl p-3 relative',
                  isNeon
                    ? 'bg-slate-800/80 border border-purple-500/20'
                    : 'bg-white border border-slate-100 shadow-sm'
                )}>
                  {/* Remove button */}
                  <button
                    onClick={() => toggleCompare(product.id)}
                    className={cn(
                      'absolute -top-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center z-10',
                      isNeon
                        ? 'bg-slate-700 text-slate-400 hover:bg-red-500 hover:text-white'
                        : 'bg-slate-200 text-slate-500 hover:bg-red-500 hover:text-white'
                    )}
                  >
                    <X size={14} />
                  </button>

                  {/* Image */}
                  <div 
                    className="aspect-square rounded-lg overflow-hidden mb-2 cursor-pointer"
                    onClick={() => onProductPress(product)}
                  >
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Name */}
                  <h3 
                    className={cn(
                      'text-xs font-medium line-clamp-2 mb-2 cursor-pointer',
                      isNeon ? 'text-white' : 'text-slate-900'
                    )}
                    onClick={() => onProductPress(product)}
                  >
                    {product.name}
                  </h3>

                  {/* Price */}
                  <div className="mb-2">
                    <span className={cn(
                      'font-bold text-sm',
                      isNeon ? 'text-white' : 'text-slate-900'
                    )}>
                      {formatPrice(product.price)}
                    </span>
                    {product.oldPrice && (
                      <span className={cn(
                        'text-xs line-through ml-1',
                        isNeon ? 'text-slate-500' : 'text-slate-400'
                      )}>
                        {formatPrice(product.oldPrice)}
                      </span>
                    )}
                  </div>

                  {/* Add to cart */}
                  <motion.button
                    onClick={() => product.inStock && addToCart(product)}
                    disabled={!product.inStock}
                    className={cn(
                      'w-full py-2 rounded-lg text-xs font-medium flex items-center justify-center gap-1',
                      !product.inStock && 'opacity-50 cursor-not-allowed',
                      cart.some(i => i.product.id === product.id)
                        ? isNeon
                          ? 'bg-green-500/20 text-green-400'
                          : 'bg-green-100 text-green-600'
                        : isNeon
                        ? 'bg-cyan-500 text-white'
                        : 'bg-blue-600 text-white'
                    )}
                    whileTap={{ scale: 0.95 }}
                  >
                    {cart.some(i => i.product.id === product.id) ? (
                      <>
                        <Check size={12} />
                        В корзине
                      </>
                    ) : (
                      <>
                        <ShoppingCart size={12} />
                        В корзину
                      </>
                    )}
                  </motion.button>
                </div>
              </div>
            ))}
          </div>

          {/* Specs comparison table */}
          <div className="px-2">
            {/* Rating row */}
            <div className={cn(
              'flex items-center border-b',
              isNeon ? 'border-slate-700' : 'border-slate-100'
            )}>
              <div className={cn(
                'w-32 flex-shrink-0 py-3 px-2 text-xs font-medium',
                isNeon ? 'text-slate-400' : 'text-slate-500'
              )}>
                Рейтинг
              </div>
              {compareProducts.map((product) => (
                <div key={product.id} className="w-44 flex-shrink-0 py-3 px-2">
                  <div className="flex items-center gap-1">
                    <span className="text-yellow-400">★</span>
                    <span className={cn(
                      'text-sm font-medium',
                      isNeon ? 'text-white' : 'text-slate-900'
                    )}>
                      {product.rating}
                    </span>
                    <span className={cn(
                      'text-xs',
                      isNeon ? 'text-slate-500' : 'text-slate-400'
                    )}>
                      ({product.reviewsCount})
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Stock row */}
            <div className={cn(
              'flex items-center border-b',
              isNeon ? 'border-slate-700' : 'border-slate-100'
            )}>
              <div className={cn(
                'w-32 flex-shrink-0 py-3 px-2 text-xs font-medium',
                isNeon ? 'text-slate-400' : 'text-slate-500'
              )}>
                Наличие
              </div>
              {compareProducts.map((product) => (
                <div key={product.id} className="w-44 flex-shrink-0 py-3 px-2">
                  <span className={cn(
                    'text-xs font-medium px-2 py-1 rounded',
                    product.inStock
                      ? isNeon
                        ? 'bg-green-500/20 text-green-400'
                        : 'bg-green-100 text-green-700'
                      : isNeon
                      ? 'bg-red-500/20 text-red-400'
                      : 'bg-red-100 text-red-700'
                  )}>
                    {product.inStock ? `В наличии (${product.stockCount})` : 'Нет'}
                  </span>
                </div>
              ))}
            </div>

            {/* Warranty row */}
            <div className={cn(
              'flex items-center border-b',
              isNeon ? 'border-slate-700' : 'border-slate-100'
            )}>
              <div className={cn(
                'w-32 flex-shrink-0 py-3 px-2 text-xs font-medium',
                isNeon ? 'text-slate-400' : 'text-slate-500'
              )}>
                Гарантия
              </div>
              {compareProducts.map((product) => (
                <div key={product.id} className="w-44 flex-shrink-0 py-3 px-2">
                  <span className={cn(
                    'text-sm',
                    isNeon ? 'text-white' : 'text-slate-900'
                  )}>
                    {product.warranty}
                  </span>
                </div>
              ))}
            </div>

            {/* Specs rows */}
            {allSpecKeys.map((key, i) => (
              <div 
                key={key} 
                className={cn(
                  'flex items-center border-b',
                  isNeon ? 'border-slate-700' : 'border-slate-100',
                  i % 2 === 0 && (isNeon ? 'bg-slate-800/30' : 'bg-slate-50/50')
                )}
              >
                <div className={cn(
                  'w-32 flex-shrink-0 py-3 px-2 text-xs font-medium',
                  isNeon ? 'text-slate-400' : 'text-slate-500'
                )}>
                  {key}
                </div>
                {compareProducts.map((product) => (
                  <div key={product.id} className="w-44 flex-shrink-0 py-3 px-2">
                    <span className={cn(
                      'text-xs',
                      product.specs[key]
                        ? isNeon ? 'text-white' : 'text-slate-900'
                        : isNeon ? 'text-slate-600' : 'text-slate-300'
                    )}>
                      {product.specs[key] || '—'}
                    </span>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
