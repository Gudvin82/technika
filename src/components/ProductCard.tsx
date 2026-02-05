import { useState } from 'react';
import { Heart, ShoppingCart, Check, Zap, Star, Flame } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Product } from '../types';
import { useStore } from '../store';
import { cn } from '../utils/cn';

interface ProductCardProps {
  product: Product;
  onPress: () => void;
}

export function ProductCard({ product, onPress }: ProductCardProps) {
  const theme = useStore((s) => s.theme);
  const addToCart = useStore((s) => s.addToCart);
  const toggleFavorite = useStore((s) => s.toggleFavorite);
  const favorites = useStore((s) => s.favorites);
  const cart = useStore((s) => s.cart);
  const isNeon = theme === 'neon';
  
  const isFavorite = favorites.includes(product.id);
  const inCart = cart.some((item) => item.product.id === product.id);
  
  const [isAnimating, setIsAnimating] = useState(false);
  const [heartPulse, setHeartPulse] = useState(false);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ru-RU').format(price) + ' ₽';
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (product.inStock && !inCart) {
      setIsAnimating(true);
      setTimeout(() => {
        addToCart(product);
        setIsAnimating(false);
      }, 300);
    }
  };

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    setHeartPulse(true);
    toggleFavorite(product.id);
    setTimeout(() => setHeartPulse(false), 300);
  };

  const getBadgeIcon = (badge: string) => {
    switch (badge) {
      case 'hit': return <Flame size={10} />;
      case 'sale': return <span className="text-[10px]">%</span>;
      case 'new': return <Star size={10} />;
      case 'fastDelivery': return <Zap size={10} />;
      default: return null;
    }
  };

  const getBadgeLabel = (badge: string) => {
    switch (badge) {
      case 'hit': return 'Хит';
      case 'sale': return 'Скидка';
      case 'new': return 'Новинка';
      case 'fastDelivery': return 'Сегодня';
      default: return '';
    }
  };

  const getBadgeStyle = (badge: string) => {
    if (isNeon) {
      switch (badge) {
        case 'hit': return 'bg-gradient-to-r from-orange-500 to-red-500 shadow-[0_0_10px_rgba(249,115,22,0.6)]';
        case 'sale': return 'bg-gradient-to-r from-pink-500 to-purple-500 shadow-[0_0_10px_rgba(236,72,153,0.6)]';
        case 'new': return 'bg-gradient-to-r from-cyan-500 to-blue-500 shadow-[0_0_10px_rgba(6,182,212,0.6)]';
        case 'fastDelivery': return 'bg-gradient-to-r from-green-500 to-emerald-500 shadow-[0_0_10px_rgba(34,197,94,0.6)]';
        default: return '';
      }
    }
    switch (badge) {
      case 'hit': return 'bg-orange-500';
      case 'sale': return 'bg-red-500';
      case 'new': return 'bg-blue-500';
      case 'fastDelivery': return 'bg-green-500';
      default: return '';
    }
  };

  return (
    <motion.div
      className={cn(
        'rounded-2xl overflow-hidden transition-all relative',
        isNeon
          ? 'bg-slate-800/50 border border-purple-500/20 hover:border-cyan-400/40'
          : 'bg-white shadow-sm hover:shadow-lg border border-slate-100'
      )}
      whileTap={{ scale: 0.98 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      layout
    >
      {/* Image */}
      <div 
        className="relative aspect-square cursor-pointer overflow-hidden"
        onClick={onPress}
      >
        <img
          src={product.images[0]}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
        />
        
        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-wrap gap-1">
          {product.badges.map((badge) => (
            <motion.span
              key={badge}
              className={cn(
                'px-2 py-0.5 rounded-full text-[10px] font-bold text-white flex items-center gap-1',
                getBadgeStyle(badge)
              )}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 500, damping: 30 }}
            >
              {getBadgeIcon(badge)}
              {getBadgeLabel(badge)}
            </motion.span>
          ))}
        </div>

        {/* Favorite button */}
        <motion.button
          onClick={handleToggleFavorite}
          className={cn(
            'absolute top-2 right-2 w-8 h-8 rounded-full flex items-center justify-center transition-all',
            isNeon
              ? 'bg-slate-900/60 backdrop-blur-sm'
              : 'bg-white/80 backdrop-blur-sm shadow-sm',
            isFavorite && 'text-red-500'
          )}
          animate={heartPulse ? { scale: [1, 1.3, 1] } : {}}
          transition={{ duration: 0.3 }}
        >
          <Heart
            size={18}
            fill={isFavorite ? 'currentColor' : 'none'}
            className={cn(
              isFavorite && isNeon && 'drop-shadow-[0_0_8px_rgba(239,68,68,0.8)]'
            )}
          />
        </motion.button>

        {/* Out of stock overlay */}
        {!product.inStock && (
          <div className={cn(
            'absolute inset-0 flex items-center justify-center',
            isNeon ? 'bg-slate-900/70' : 'bg-white/70'
          )}>
            <span className={cn(
              'px-3 py-1 rounded-full text-sm font-medium',
              isNeon ? 'bg-slate-700 text-slate-300' : 'bg-slate-200 text-slate-600'
            )}>
              Нет в наличии
            </span>
          </div>
        )}

        {/* Cart animation overlay */}
        <AnimatePresence>
          {isAnimating && (
            <motion.div
              className="absolute inset-0 flex items-center justify-center bg-black/30"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className={cn(
                  'w-12 h-12 rounded-full flex items-center justify-center',
                  isNeon ? 'bg-cyan-500' : 'bg-blue-600'
                )}
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                exit={{ scale: 0, y: -50, opacity: 0 }}
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              >
                <ShoppingCart size={24} className="text-white" />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Content */}
      <div className="p-3" onClick={onPress}>
        {/* Brand & Rating */}
        <div className="flex items-center justify-between mb-1">
          <span className={cn(
            'text-xs font-medium',
            isNeon ? 'text-cyan-400' : 'text-blue-600'
          )}>
            {product.brand}
          </span>
          <div className="flex items-center gap-1">
            <Star size={12} className="text-yellow-400 fill-yellow-400" />
            <span className={cn(
              'text-xs font-medium',
              isNeon ? 'text-white' : 'text-slate-700'
            )}>
              {product.rating}
            </span>
            <span className={cn(
              'text-xs',
              isNeon ? 'text-slate-400' : 'text-slate-400'
            )}>
              ({product.reviewsCount})
            </span>
          </div>
        </div>

        {/* Name */}
        <h3 className={cn(
          'font-medium text-sm line-clamp-2 mb-2 min-h-[40px]',
          isNeon ? 'text-white' : 'text-slate-900'
        )}>
          {product.name}
        </h3>

        {/* Short specs */}
        <div className="flex flex-wrap gap-1 mb-3">
          {product.shortSpecs.slice(0, 3).map((spec, i) => (
            <span
              key={i}
              className={cn(
                'px-2 py-0.5 rounded text-[10px]',
                isNeon
                  ? 'bg-slate-700 text-slate-300'
                  : 'bg-slate-100 text-slate-600'
              )}
            >
              {spec}
            </span>
          ))}
        </div>

        {/* Price */}
        <div className="flex items-center gap-2 mb-3">
          <span className={cn(
            'font-bold text-lg',
            isNeon ? 'text-white' : 'text-slate-900'
          )}>
            {formatPrice(product.price)}
          </span>
          {product.oldPrice && (
            <span className={cn(
              'text-sm line-through',
              isNeon ? 'text-slate-500' : 'text-slate-400'
            )}>
              {formatPrice(product.oldPrice)}
            </span>
          )}
        </div>

        {/* Add to cart button */}
        <motion.button
          onClick={handleAddToCart}
          disabled={!product.inStock}
          className={cn(
            'w-full py-2.5 rounded-xl font-medium text-sm flex items-center justify-center gap-2 transition-all',
            !product.inStock && 'opacity-50 cursor-not-allowed',
            inCart
              ? isNeon
                ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                : 'bg-green-50 text-green-600 border border-green-200'
              : isNeon
              ? 'bg-gradient-to-r from-cyan-500 to-purple-500 text-white shadow-[0_0_20px_rgba(6,182,212,0.4)]'
              : 'bg-blue-600 text-white hover:bg-blue-700'
          )}
          whileTap={{ scale: 0.95 }}
        >
          {inCart ? (
            <>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              >
                <Check size={16} />
              </motion.div>
              В корзине
            </>
          ) : (
            <>
              <ShoppingCart size={16} />
              В корзину
            </>
          )}
        </motion.button>
      </div>
    </motion.div>
  );
}
