import { useState } from 'react';
import { Minus, Plus, Trash2, Tag, ChevronRight, ShoppingBag, Truck, MapPin } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '../store';
import { cn } from '../utils/cn';

interface CartScreenProps {
  onCheckout: () => void;
  onProductPress: (productId: string) => void;
}

export function CartScreen({ onCheckout, onProductPress }: CartScreenProps) {
  const theme = useStore((s) => s.theme);
  const cart = useStore((s) => s.cart);
  const updateQuantity = useStore((s) => s.updateQuantity);
  const removeFromCart = useStore((s) => s.removeFromCart);
  const promoCode = useStore((s) => s.promoCode);
  const applyPromoCode = useStore((s) => s.applyPromoCode);
  const user = useStore((s) => s.user);
  const isNeon = theme === 'neon';

  const [promoInput, setPromoInput] = useState('');
  const [promoError, setPromoError] = useState(false);
  const [deliveryType, setDeliveryType] = useState<'delivery' | 'pickup'>('delivery');

  const subtotal = cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const discount = promoCode ? subtotal * 0.1 : 0;
  const bonusDiscount = user?.bonusPoints ? Math.min(user.bonusPoints, subtotal * 0.1) : 0;
  const deliveryCost = deliveryType === 'delivery' ? (subtotal > 10000 ? 0 : 500) : 0;
  const total = subtotal - discount - bonusDiscount + deliveryCost;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ru-RU').format(price) + ' ₽';
  };

  const handleApplyPromo = () => {
    if (applyPromoCode(promoInput)) {
      setPromoError(false);
      setPromoInput('');
    } else {
      setPromoError(true);
    }
  };

  if (cart.length === 0) {
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
          <ShoppingBag size={40} className={isNeon ? 'text-slate-600' : 'text-slate-400'} />
        </div>
        <h2 className={cn(
          'text-xl font-semibold mb-2',
          isNeon ? 'text-white' : 'text-slate-900'
        )}>
          Корзина пуста
        </h2>
        <p className={cn(
          'text-center mb-6',
          isNeon ? 'text-slate-400' : 'text-slate-500'
        )}>
          Добавьте товары из каталога, чтобы оформить заказ
        </p>
      </div>
    );
  }

  return (
    <div className={cn(
      'min-h-screen pb-40',
      isNeon
        ? 'bg-gradient-to-b from-slate-900 via-slate-900 to-purple-900/50'
        : 'bg-slate-50'
    )}>
      {/* Header */}
      <div className={cn(
        'sticky top-0 z-30 px-4 py-4',
        isNeon
          ? 'bg-slate-900/95 backdrop-blur-xl'
          : 'bg-white/95 backdrop-blur-xl shadow-sm'
      )}>
        <h1 className={cn(
          'text-xl font-bold',
          isNeon ? 'text-white' : 'text-slate-900'
        )}>
          Корзина ({cart.length})
        </h1>
      </div>

      {/* Cart items */}
      <div className="px-4 py-2">
        <AnimatePresence mode="popLayout">
          {cart.map((item) => (
            <motion.div
              key={item.product.id}
              layout
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              className={cn(
                'flex gap-3 p-3 rounded-xl mb-3',
                isNeon
                  ? 'bg-slate-800/50 border border-purple-500/20'
                  : 'bg-white border border-slate-100 shadow-sm'
              )}
            >
              {/* Image */}
              <div
                onClick={() => onProductPress(item.product.id)}
                className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 cursor-pointer"
              >
                <img
                  src={item.product.images[0]}
                  alt={item.product.name}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <h3
                  onClick={() => onProductPress(item.product.id)}
                  className={cn(
                    'font-medium text-sm line-clamp-2 mb-1 cursor-pointer',
                    isNeon ? 'text-white' : 'text-slate-900'
                  )}
                >
                  {item.product.name}
                </h3>
                <div className="flex items-center gap-2 mb-2">
                  <span className={cn(
                    'font-bold',
                    isNeon ? 'text-white' : 'text-slate-900'
                  )}>
                    {formatPrice(item.product.price)}
                  </span>
                  {item.product.oldPrice && (
                    <span className={cn(
                      'text-sm line-through',
                      isNeon ? 'text-slate-500' : 'text-slate-400'
                    )}>
                      {formatPrice(item.product.oldPrice)}
                    </span>
                  )}
                </div>

                {/* Quantity controls */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                      className={cn(
                        'w-8 h-8 rounded-lg flex items-center justify-center transition-colors',
                        isNeon
                          ? 'bg-slate-700 text-white hover:bg-slate-600'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      )}
                    >
                      <Minus size={16} />
                    </button>
                    <span className={cn(
                      'w-8 text-center font-medium',
                      isNeon ? 'text-white' : 'text-slate-900'
                    )}>
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                      className={cn(
                        'w-8 h-8 rounded-lg flex items-center justify-center transition-colors',
                        isNeon
                          ? 'bg-slate-700 text-white hover:bg-slate-600'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      )}
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                  <button
                    onClick={() => removeFromCart(item.product.id)}
                    className={cn(
                      'p-2 rounded-lg transition-colors',
                      isNeon
                        ? 'text-red-400 hover:bg-red-500/10'
                        : 'text-red-500 hover:bg-red-50'
                    )}
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Delivery type */}
      <div className="px-4 mb-4">
        <div className={cn(
          'rounded-xl p-1 flex gap-1',
          isNeon ? 'bg-slate-800' : 'bg-slate-100'
        )}>
          <button
            onClick={() => setDeliveryType('delivery')}
            className={cn(
              'flex-1 py-2.5 rounded-lg font-medium text-sm flex items-center justify-center gap-2 transition-all',
              deliveryType === 'delivery'
                ? isNeon
                  ? 'bg-gradient-to-r from-cyan-500 to-purple-500 text-white'
                  : 'bg-white text-slate-900 shadow-sm'
                : isNeon
                ? 'text-slate-400'
                : 'text-slate-500'
            )}
          >
            <Truck size={16} />
            Доставка
          </button>
          <button
            onClick={() => setDeliveryType('pickup')}
            className={cn(
              'flex-1 py-2.5 rounded-lg font-medium text-sm flex items-center justify-center gap-2 transition-all',
              deliveryType === 'pickup'
                ? isNeon
                  ? 'bg-gradient-to-r from-cyan-500 to-purple-500 text-white'
                  : 'bg-white text-slate-900 shadow-sm'
                : isNeon
                ? 'text-slate-400'
                : 'text-slate-500'
            )}
          >
            <MapPin size={16} />
            Самовывоз
          </button>
        </div>
      </div>

      {/* Promo code */}
      <div className="px-4 mb-4">
        <div className={cn(
          'rounded-xl p-4',
          isNeon
            ? 'bg-slate-800/50 border border-purple-500/20'
            : 'bg-white border border-slate-100 shadow-sm'
        )}>
          <div className="flex items-center gap-2 mb-3">
            <Tag size={18} className={isNeon ? 'text-cyan-400' : 'text-blue-600'} />
            <span className={cn(
              'font-medium',
              isNeon ? 'text-white' : 'text-slate-900'
            )}>
              Промокод
            </span>
          </div>
          {promoCode ? (
            <div className={cn(
              'flex items-center justify-between py-2 px-3 rounded-lg',
              isNeon ? 'bg-green-500/10 border border-green-500/30' : 'bg-green-50 border border-green-200'
            )}>
              <span className={isNeon ? 'text-green-400' : 'text-green-600'}>
                {promoCode} применён
              </span>
              <span className={isNeon ? 'text-green-400' : 'text-green-600'}>
                -10%
              </span>
            </div>
          ) : (
            <div className="flex gap-2">
              <input
                type="text"
                value={promoInput}
                onChange={(e) => setPromoInput(e.target.value.toUpperCase())}
                placeholder="Введите промокод"
                className={cn(
                  'flex-1 px-3 py-2 rounded-lg text-sm outline-none transition-all',
                  isNeon
                    ? 'bg-slate-700 text-white placeholder:text-slate-500 border border-slate-600 focus:border-cyan-400'
                    : 'bg-slate-50 text-slate-900 placeholder:text-slate-400 border border-slate-200 focus:border-blue-500',
                  promoError && 'border-red-500'
                )}
              />
              <button
                onClick={handleApplyPromo}
                className={cn(
                  'px-4 py-2 rounded-lg font-medium text-sm',
                  isNeon
                    ? 'bg-cyan-500 text-white'
                    : 'bg-blue-600 text-white'
                )}
              >
                Применить
              </button>
            </div>
          )}
          {promoError && (
            <p className="text-red-500 text-sm mt-2">Неверный промокод</p>
          )}
        </div>
      </div>

      {/* Order summary - fixed at bottom */}
      <div className={cn(
        'fixed bottom-16 left-0 right-0 px-4 py-4 z-30',
        isNeon
          ? 'bg-slate-900/95 backdrop-blur-xl border-t border-purple-500/30'
          : 'bg-white/95 backdrop-blur-xl border-t border-slate-200'
      )}>
        <div className="max-w-lg mx-auto">
          {/* Price breakdown */}
          <div className="space-y-2 mb-4">
            <div className="flex justify-between text-sm">
              <span className={isNeon ? 'text-slate-400' : 'text-slate-500'}>
                Товары ({cart.reduce((acc, i) => acc + i.quantity, 0)})
              </span>
              <span className={isNeon ? 'text-white' : 'text-slate-900'}>
                {formatPrice(subtotal)}
              </span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-sm">
                <span className={isNeon ? 'text-green-400' : 'text-green-600'}>
                  Скидка по промокоду
                </span>
                <span className={isNeon ? 'text-green-400' : 'text-green-600'}>
                  -{formatPrice(discount)}
                </span>
              </div>
            )}
            <div className="flex justify-between text-sm">
              <span className={isNeon ? 'text-slate-400' : 'text-slate-500'}>
                Доставка
              </span>
              <span className={isNeon ? 'text-white' : 'text-slate-900'}>
                {deliveryCost === 0 ? 'Бесплатно' : formatPrice(deliveryCost)}
              </span>
            </div>
          </div>

          {/* Total & checkout */}
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className={cn('text-sm', isNeon ? 'text-slate-400' : 'text-slate-500')}>
                Итого
              </p>
              <p className={cn('text-2xl font-bold', isNeon ? 'text-white' : 'text-slate-900')}>
                {formatPrice(total)}
              </p>
            </div>
            <motion.button
              onClick={onCheckout}
              className={cn(
                'px-6 py-3 rounded-xl font-semibold flex items-center gap-2',
                isNeon
                  ? 'bg-gradient-to-r from-cyan-500 to-purple-500 text-white shadow-[0_0_30px_rgba(6,182,212,0.4)]'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              )}
              whileTap={{ scale: 0.95 }}
            >
              Оформить
              <ChevronRight size={20} />
            </motion.button>
          </div>

          {/* Bonus hint */}
          {user && (
            <p className={cn('text-xs text-center', isNeon ? 'text-slate-500' : 'text-slate-400')}>
              +{Math.floor(total * 0.05)} бонусов за этот заказ
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
