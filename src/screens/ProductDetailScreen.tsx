import { useState, useEffect } from 'react';
import { 
  ChevronLeft, Heart, Share2, ShoppingCart, Check, Star, 
  Truck, Shield, MessageCircle, GitCompare, ChevronDown, ChevronUp,
  Zap, Award, RotateCcw, Clock, CheckCircle2, Box,
  BadgeCheck, Sparkles, ChevronRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Product } from '../types';
import { useStore } from '../store';
import { products } from '../data/products';
import { ProductCard } from '../components/ProductCard';
import { cn } from '../utils/cn';

interface ProductDetailScreenProps {
  product: Product;
  onBack: () => void;
  onProductPress: (product: Product) => void;
  onOpenChat?: (product: Product) => void;
}

export function ProductDetailScreen({ product, onBack, onProductPress, onOpenChat }: ProductDetailScreenProps) {
  const theme = useStore((s) => s.theme);
  const addToCart = useStore((s) => s.addToCart);
  const toggleFavorite = useStore((s) => s.toggleFavorite);
  const toggleCompare = useStore((s) => s.toggleCompare);
  const favorites = useStore((s) => s.favorites);
  const compareList = useStore((s) => s.compareList);
  const cart = useStore((s) => s.cart);
  const addRecentlyViewed = useStore((s) => s.addRecentlyViewed);
  const isNeon = theme === 'neon';

  const [showFullSpecs, setShowFullSpecs] = useState(false);
  const [currentImage, setCurrentImage] = useState(0);
  const [showChat, setShowChat] = useState(false);
  const [flyingCart, setFlyingCart] = useState(false);

  const isFavorite = favorites.includes(product.id);
  const isCompare = compareList.includes(product.id);
  const inCart = cart.some((item) => item.product.id === product.id);

  useEffect(() => {
    addRecentlyViewed(product.id);
  }, [product.id, addRecentlyViewed]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ru-RU').format(price) + ' ₽';
  };

  const relatedProducts = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  const compatibleProducts = product.compatible
    .map(id => products.find(p => p.id === id))
    .filter(Boolean) as Product[];

  const handleAddToCart = () => {
    if (product.inStock) {
      setFlyingCart(true);
      setTimeout(() => {
        addToCart(product);
        setFlyingCart(false);
      }, 400);
    }
  };

  const trustBadges = [
    { icon: Shield, label: `Гарантия ${product.warranty}`, color: 'green' },
    { icon: RotateCcw, label: 'Возврат 14 дней', color: 'blue' },
    { icon: Truck, label: product.deliveryDate === 'Сегодня' ? 'Доставка сегодня' : `Доставка ${product.deliveryDate.toLowerCase()}`, color: 'cyan' },
    { icon: BadgeCheck, label: 'Оригинал 100%', color: 'purple' },
  ];

  return (
    <div className={cn(
      'min-h-screen pb-28',
      isNeon
        ? 'bg-gradient-to-b from-slate-900 via-slate-900 to-purple-900/50'
        : 'bg-slate-50'
    )}>
      {/* Header */}
      <div className={cn(
        'sticky top-0 z-30 flex items-center justify-between px-4 py-3',
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
        <div className="flex gap-2">
          <motion.button
            onClick={() => toggleFavorite(product.id)}
            className={cn(
              'p-2 rounded-xl transition-colors relative',
              isFavorite
                ? 'bg-red-500/20 text-red-500'
                : isNeon
                ? 'bg-slate-800 text-white'
                : 'bg-slate-100 text-slate-700'
            )}
            whileTap={{ scale: 0.9 }}
          >
            <Heart 
              size={20} 
              fill={isFavorite ? 'currentColor' : 'none'}
              className={cn(isFavorite && isNeon && 'drop-shadow-[0_0_8px_rgba(239,68,68,0.8)]')}
            />
            {isFavorite && (
              <motion.div
                initial={{ scale: 1.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="absolute inset-0 rounded-xl bg-red-500/20"
              />
            )}
          </motion.button>
          <button className={cn(
            'p-2 rounded-xl transition-colors',
            isNeon ? 'bg-slate-800 text-white' : 'bg-slate-100 text-slate-700'
          )}>
            <Share2 size={20} />
          </button>
        </div>
      </div>

      {/* Image gallery */}
      <div className="relative">
        <div className="aspect-square overflow-hidden bg-white">
          <AnimatePresence mode="wait">
            <motion.img
              key={currentImage}
              src={product.images[currentImage]}
              alt={product.name}
              className="w-full h-full object-contain"
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            />
          </AnimatePresence>
        </div>
        
        {/* Thumbnails */}
        {product.images.length > 1 && (
          <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
            {product.images.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentImage(i)}
                className={cn(
                  'w-2.5 h-2.5 rounded-full transition-all',
                  currentImage === i
                    ? isNeon
                      ? 'bg-cyan-400 w-8 shadow-[0_0_10px_rgba(6,182,212,0.6)]'
                      : 'bg-blue-600 w-8'
                    : 'bg-black/30'
                )}
              />
            ))}
          </div>
        )}

        {/* Flying cart animation */}
        <AnimatePresence>
          {flyingCart && (
            <motion.div
              initial={{ scale: 1, opacity: 1, x: 0, y: 0 }}
              animate={{ scale: 0.3, opacity: 0, x: 100, y: -200 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
            >
              <div className={cn(
                'w-20 h-20 rounded-2xl flex items-center justify-center',
                isNeon ? 'bg-cyan-500' : 'bg-blue-600'
              )}>
                <ShoppingCart size={32} className="text-white" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Content */}
      <div className="px-4 py-4">
        {/* Brand & Rating */}
        <div className="flex items-center justify-between mb-2">
          <span className={cn(
            'text-sm font-medium px-2 py-0.5 rounded',
            isNeon ? 'text-cyan-400 bg-cyan-400/10' : 'text-blue-600 bg-blue-50'
          )}>
            {product.brand}
          </span>
          <button className="flex items-center gap-1">
            <Star size={16} className="text-yellow-400 fill-yellow-400" />
            <span className={cn('font-medium', isNeon ? 'text-white' : 'text-slate-900')}>
              {product.rating}
            </span>
            <span className={cn('text-sm underline', isNeon ? 'text-slate-400' : 'text-slate-500')}>
              {product.reviewsCount} отзывов
            </span>
          </button>
        </div>

        {/* Name */}
        <h1 className={cn(
          'text-xl font-bold mb-3',
          isNeon ? 'text-white' : 'text-slate-900'
        )}>
          {product.name}
        </h1>

        {/* Price */}
        <div className="flex items-center gap-3 mb-4">
          <span className={cn(
            'text-3xl font-bold',
            isNeon ? 'text-white' : 'text-slate-900'
          )}>
            {formatPrice(product.price)}
          </span>
          {product.oldPrice && (
            <>
              <span className={cn(
                'text-lg line-through',
                isNeon ? 'text-slate-500' : 'text-slate-400'
              )}>
                {formatPrice(product.oldPrice)}
              </span>
              <span className={cn(
                'px-2 py-1 rounded-lg text-sm font-bold',
                isNeon
                  ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-[0_0_15px_rgba(236,72,153,0.4)]'
                  : 'bg-red-500 text-white'
              )}>
                -{Math.round((1 - product.price / product.oldPrice) * 100)}%
              </span>
            </>
          )}
        </div>

        {/* Stock & Delivery badges */}
        <div className="flex flex-wrap gap-2 mb-4">
          {product.inStock ? (
            <span className={cn(
              'px-3 py-1.5 rounded-lg text-sm font-medium flex items-center gap-1.5',
              isNeon
                ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                : 'bg-green-100 text-green-700'
            )}>
              <CheckCircle2 size={14} />
              В наличии ({product.stockCount} шт.)
            </span>
          ) : (
            <span className={cn(
              'px-3 py-1.5 rounded-lg text-sm font-medium',
              isNeon ? 'bg-slate-700 text-slate-400' : 'bg-slate-100 text-slate-500'
            )}>
              Нет в наличии
            </span>
          )}
          <span className={cn(
            'px-3 py-1.5 rounded-lg text-sm font-medium flex items-center gap-1.5',
            product.deliveryDate === 'Сегодня'
              ? isNeon
                ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                : 'bg-cyan-100 text-cyan-700'
              : isNeon
              ? 'bg-blue-500/20 text-blue-400'
              : 'bg-blue-100 text-blue-700'
          )}>
            <Truck size={14} />
            {product.deliveryDate}
          </span>
        </div>

        {/* Trust badges row */}
        <div className={cn(
          'rounded-xl p-4 mb-4 grid grid-cols-2 gap-3',
          isNeon
            ? 'bg-slate-800/50 border border-purple-500/20'
            : 'bg-white border border-slate-100 shadow-sm'
        )}>
          {trustBadges.map((badge, i) => (
            <div key={i} className="flex items-center gap-2">
              <div className={cn(
                'w-8 h-8 rounded-lg flex items-center justify-center',
                badge.color === 'green' && (isNeon ? 'bg-green-500/20 text-green-400' : 'bg-green-100 text-green-600'),
                badge.color === 'blue' && (isNeon ? 'bg-blue-500/20 text-blue-400' : 'bg-blue-100 text-blue-600'),
                badge.color === 'cyan' && (isNeon ? 'bg-cyan-500/20 text-cyan-400' : 'bg-cyan-100 text-cyan-600'),
                badge.color === 'purple' && (isNeon ? 'bg-purple-500/20 text-purple-400' : 'bg-purple-100 text-purple-600'),
              )}>
                <badge.icon size={16} />
              </div>
              <span className={cn(
                'text-xs font-medium',
                isNeon ? 'text-slate-300' : 'text-slate-600'
              )}>
                {badge.label}
              </span>
            </div>
          ))}
        </div>

        {/* Why buy - Features */}
        {product.features.length > 0 && (
          <div className={cn(
            'rounded-xl p-4 mb-4',
            isNeon
              ? 'bg-gradient-to-r from-cyan-500/10 to-purple-500/10 border border-cyan-500/20'
              : 'bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100'
          )}>
            <div className="flex items-center gap-2 mb-3">
              <Sparkles size={18} className={isNeon ? 'text-cyan-400' : 'text-blue-600'} />
              <h3 className={cn('font-semibold', isNeon ? 'text-white' : 'text-slate-900')}>
                Почему стоит купить
              </h3>
            </div>
            <ul className="space-y-2">
              {product.features.map((feature, i) => (
                <li key={i} className="flex items-start gap-2">
                  <Check size={16} className={cn(
                    'mt-0.5 flex-shrink-0',
                    isNeon ? 'text-cyan-400' : 'text-blue-600'
                  )} />
                  <span className={cn('text-sm', isNeon ? 'text-slate-300' : 'text-slate-600')}>
                    {feature}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Specs toggle */}
        <div className={cn(
          'rounded-xl overflow-hidden mb-4',
          isNeon
            ? 'bg-slate-800/50 border border-purple-500/20'
            : 'bg-white border border-slate-100 shadow-sm'
        )}>
          <button
            onClick={() => setShowFullSpecs(!showFullSpecs)}
            className={cn(
              'w-full flex items-center justify-between p-4 transition-colors',
              isNeon ? 'hover:bg-slate-700/30' : 'hover:bg-slate-50'
            )}
          >
            <span className={cn('font-semibold', isNeon ? 'text-white' : 'text-slate-900')}>
              {showFullSpecs ? 'Все характеристики' : 'Краткие характеристики'}
            </span>
            {showFullSpecs ? (
              <ChevronUp size={20} className={isNeon ? 'text-slate-400' : 'text-slate-500'} />
            ) : (
              <ChevronDown size={20} className={isNeon ? 'text-slate-400' : 'text-slate-500'} />
            )}
          </button>
          
          <motion.div
            initial={false}
            animate={{ height: showFullSpecs ? 'auto' : 200 }}
            className="overflow-hidden relative"
          >
            <div className="px-4 pb-4 space-y-0">
              {Object.entries(product.specs).map(([key, value], i) => (
                <div 
                  key={key} 
                  className={cn(
                    'flex justify-between py-2.5',
                    i < Object.entries(product.specs).length - 1 && (
                      isNeon ? 'border-b border-slate-700/50' : 'border-b border-slate-100'
                    )
                  )}
                >
                  <span className={isNeon ? 'text-slate-400' : 'text-slate-500'}>
                    {key}
                  </span>
                  <span className={cn('font-medium text-right max-w-[60%]', isNeon ? 'text-white' : 'text-slate-900')}>
                    {value}
                  </span>
                </div>
              ))}
            </div>
            {!showFullSpecs && (
              <div className={cn(
                'absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t pointer-events-none',
                isNeon ? 'from-slate-800/90' : 'from-white'
              )} />
            )}
          </motion.div>
        </div>

        {/* What's included */}
        {product.included.length > 0 && (
          <div className={cn(
            'rounded-xl p-4 mb-4',
            isNeon
              ? 'bg-slate-800/50 border border-purple-500/20'
              : 'bg-white border border-slate-100 shadow-sm'
          )}>
            <div className="flex items-center gap-2 mb-3">
              <Box size={18} className={isNeon ? 'text-purple-400' : 'text-purple-600'} />
              <h3 className={cn('font-semibold', isNeon ? 'text-white' : 'text-slate-900')}>
                В комплекте
              </h3>
            </div>
            <ul className="space-y-2">
              {product.included.map((item, i) => (
                <li key={i} className="flex items-center gap-2">
                  <div className={cn(
                    'w-1.5 h-1.5 rounded-full',
                    isNeon ? 'bg-purple-400' : 'bg-purple-500'
                  )} />
                  <span className={cn('text-sm', isNeon ? 'text-slate-300' : 'text-slate-600')}>
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Description */}
        <div className={cn(
          'rounded-xl p-4 mb-4',
          isNeon
            ? 'bg-slate-800/50 border border-purple-500/20'
            : 'bg-white border border-slate-100 shadow-sm'
        )}>
          <h3 className={cn('font-semibold mb-2', isNeon ? 'text-white' : 'text-slate-900')}>
            Описание
          </h3>
          <p className={cn('text-sm leading-relaxed', isNeon ? 'text-slate-300' : 'text-slate-600')}>
            {product.description}
          </p>
        </div>

        {/* Actions row */}
        <div className="flex gap-2 mb-6">
          <motion.button
            onClick={() => toggleCompare(product.id)}
            className={cn(
              'flex-1 py-3 rounded-xl font-medium text-sm flex items-center justify-center gap-2 transition-all',
              isCompare
                ? isNeon
                  ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                  : 'bg-purple-50 text-purple-600 border border-purple-200'
                : isNeon
                ? 'bg-slate-800 text-white border border-slate-700'
                : 'bg-white text-slate-700 border border-slate-200'
            )}
            whileTap={{ scale: 0.95 }}
          >
            <GitCompare size={16} />
            {isCompare ? 'В сравнении' : 'Сравнить'}
          </motion.button>
          <motion.button 
            onClick={() => onOpenChat ? onOpenChat(product) : setShowChat(true)}
            className={cn(
              'flex-1 py-3 rounded-xl font-medium text-sm flex items-center justify-center gap-2',
              isNeon
                ? 'bg-slate-800 text-white border border-slate-700'
                : 'bg-white text-slate-700 border border-slate-200'
            )}
            whileTap={{ scale: 0.95 }}
          >
            <MessageCircle size={16} />
            Задать вопрос
          </motion.button>
        </div>

        {/* Bonuses banner */}
        <div className={cn(
          'rounded-xl p-4 mb-6 flex items-center gap-3',
          isNeon
            ? 'bg-gradient-to-r from-cyan-500/10 to-purple-500/10 border border-cyan-500/30'
            : 'bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100'
        )}>
          <div className={cn(
            'w-12 h-12 rounded-full flex items-center justify-center',
            isNeon 
              ? 'bg-gradient-to-br from-cyan-500 to-purple-500 shadow-[0_0_20px_rgba(6,182,212,0.4)]' 
              : 'bg-gradient-to-br from-blue-500 to-indigo-500'
          )}>
            <Award size={24} className="text-white" />
          </div>
          <div className="flex-1">
            <p className={cn('font-bold text-lg', isNeon ? 'text-white' : 'text-slate-900')}>
              +{Math.floor(product.price * 0.05).toLocaleString()} бонусов
            </p>
            <p className={cn('text-sm', isNeon ? 'text-slate-400' : 'text-slate-500')}>
              +7% дополнительно при оплате СБП
            </p>
          </div>
          <ChevronRight size={20} className={isNeon ? 'text-slate-500' : 'text-slate-400'} />
        </div>

        {/* Compatible/Accessories */}
        {compatibleProducts.length > 0 && (
          <section className="mb-6">
            <h3 className={cn(
              'font-semibold text-lg mb-3',
              isNeon ? 'text-white' : 'text-slate-900'
            )}>
              🔌 Совместимые аксессуары
            </h3>
            <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
              {compatibleProducts.map((p) => (
                <div key={p.id} className="w-40 flex-shrink-0">
                  <ProductCard product={p} onPress={() => onProductPress(p)} />
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Related products */}
        {relatedProducts.length > 0 && (
          <section>
            <h3 className={cn(
              'font-semibold text-lg mb-3',
              isNeon ? 'text-white' : 'text-slate-900'
            )}>
              С этим покупают
            </h3>
            <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
              {relatedProducts.map((p) => (
                <div key={p.id} className="w-40 flex-shrink-0">
                  <ProductCard product={p} onPress={() => onProductPress(p)} />
                </div>
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Fixed bottom CTA */}
      <div className={cn(
        'fixed bottom-16 left-0 right-0 px-4 py-4 z-30',
        isNeon
          ? 'bg-slate-900/95 backdrop-blur-xl border-t border-purple-500/30'
          : 'bg-white/95 backdrop-blur-xl border-t border-slate-200'
      )}>
        <div className="max-w-lg mx-auto flex gap-3">
          <motion.button
            onClick={handleAddToCart}
            disabled={!product.inStock}
            className={cn(
              'flex-1 py-4 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all',
              !product.inStock && 'opacity-50 cursor-not-allowed',
              inCart
                ? isNeon
                  ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                  : 'bg-green-50 text-green-600 border border-green-200'
                : isNeon
                ? 'bg-slate-800 text-white border border-slate-700'
                : 'bg-slate-100 text-slate-900'
            )}
            whileTap={{ scale: 0.95 }}
          >
            {inCart ? (
              <>
                <Check size={20} />
                В корзине
              </>
            ) : (
              <>
                <ShoppingCart size={20} />
                В корзину
              </>
            )}
          </motion.button>
          <motion.button
            onClick={handleAddToCart}
            disabled={!product.inStock}
            className={cn(
              'flex-1 py-4 rounded-xl font-semibold flex items-center justify-center gap-2',
              !product.inStock && 'opacity-50 cursor-not-allowed',
              isNeon
                ? 'bg-gradient-to-r from-cyan-500 to-purple-500 text-white shadow-[0_0_30px_rgba(6,182,212,0.4)]'
                : 'bg-blue-600 text-white'
            )}
            whileTap={{ scale: 0.95 }}
          >
            <Zap size={20} />
            Купить сейчас
          </motion.button>
        </div>
      </div>

      {/* Chat modal */}
      <AnimatePresence>
        {showChat && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-end justify-center"
            onClick={() => setShowChat(false)}
          >
            <div className="absolute inset-0 bg-black/50" />
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className={cn(
                'relative w-full max-h-[80vh] rounded-t-3xl overflow-hidden',
                isNeon ? 'bg-slate-900' : 'bg-white'
              )}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Handle */}
              <div className="flex justify-center py-3">
                <div className={cn(
                  'w-10 h-1 rounded-full',
                  isNeon ? 'bg-slate-700' : 'bg-slate-300'
                )} />
              </div>

              {/* Chat content */}
              <div className="px-4 pb-8">
                <h3 className={cn('text-lg font-bold mb-2', isNeon ? 'text-white' : 'text-slate-900')}>
                  Вопрос по товару
                </h3>
                
                {/* Product preview */}
                <div className={cn(
                  'flex items-center gap-3 p-3 rounded-xl mb-4',
                  isNeon ? 'bg-slate-800' : 'bg-slate-50'
                )}>
                  <img 
                    src={product.images[0]} 
                    alt="" 
                    className="w-12 h-12 rounded-lg object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <p className={cn(
                      'text-sm font-medium truncate',
                      isNeon ? 'text-white' : 'text-slate-900'
                    )}>
                      {product.name}
                    </p>
                    <p className={cn('text-xs', isNeon ? 'text-slate-400' : 'text-slate-500')}>
                      ID: {product.id}
                    </p>
                  </div>
                </div>

                {/* Quick questions */}
                <div className="space-y-2 mb-4">
                  {[
                    'Есть ли в наличии?',
                    'Когда будет доставка?',
                    'Можно ли забрать сегодня?',
                    'Есть ли рассрочка?',
                  ].map((q, i) => (
                    <button
                      key={i}
                      className={cn(
                        'w-full py-3 px-4 rounded-xl text-left text-sm font-medium transition-colors',
                        isNeon
                          ? 'bg-slate-800 text-white hover:bg-slate-700'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      )}
                    >
                      {q}
                    </button>
                  ))}
                </div>

                {/* Input */}
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Введите ваш вопрос..."
                    className={cn(
                      'flex-1 px-4 py-3 rounded-xl text-sm outline-none',
                      isNeon
                        ? 'bg-slate-800 text-white placeholder:text-slate-500 border border-slate-700 focus:border-cyan-400'
                        : 'bg-slate-100 text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500'
                    )}
                  />
                  <button className={cn(
                    'px-4 py-3 rounded-xl font-medium',
                    isNeon
                      ? 'bg-cyan-500 text-white'
                      : 'bg-blue-600 text-white'
                  )}>
                    Отправить
                  </button>
                </div>

                <div className="flex items-center gap-2 mt-4 justify-center">
                  <Clock size={14} className={isNeon ? 'text-slate-500' : 'text-slate-400'} />
                  <span className={cn('text-xs', isNeon ? 'text-slate-500' : 'text-slate-400')}>
                    Обычно отвечаем за 5 минут
                  </span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
