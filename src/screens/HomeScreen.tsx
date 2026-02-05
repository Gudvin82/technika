import { useState, useEffect } from 'react';
import { Search, SlidersHorizontal, ChevronRight, Clock, TrendingUp, Gift, Zap, Phone, X, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '../store';
import { products, categories, bundles } from '../data/products';
import { ProductCard } from '../components/ProductCard';
import { Product } from '../types';
import { cn } from '../utils/cn';

interface HomeScreenProps {
  onProductPress: (product: Product) => void;
  onSearchPress: () => void;
}

export function HomeScreen({ onProductPress, onSearchPress }: HomeScreenProps) {
  const theme = useStore((s) => s.theme);
  const recentlyViewed = useStore((s) => s.recentlyViewed);
  const isNeon = theme === 'neon';
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [promoTimeLeft, setPromoTimeLeft] = useState({ hours: 23, minutes: 45, seconds: 12 });
  
  // Callback form state
  const [showCallbackForm, setShowCallbackForm] = useState(false);
  const [callbackForm, setCallbackForm] = useState({ name: '', phone: '' });
  const [callbackSubmitted, setCallbackSubmitted] = useState(false);
  const [callbackError, setCallbackError] = useState('');

  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  // Promo countdown
  useEffect(() => {
    const interval = setInterval(() => {
      setPromoTimeLeft(prev => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return prev;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const filteredProducts = selectedCategory
    ? products.filter((p) => p.category === selectedCategory)
    : products;

  const hitProducts = products.filter((p) => p.badges.includes('hit'));
  const saleProducts = products.filter((p) => p.badges.includes('sale'));
  const recentProducts = recentlyViewed
    .map((id) => products.find((p) => p.id === id))
    .filter(Boolean) as Product[];

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ru-RU').format(price) + ' ₽';
  };

  // Handle callback form submit
  const handleCallbackSubmit = async () => {
    setCallbackError('');
    
    if (!callbackForm.name.trim()) {
      setCallbackError('Укажите ваше имя');
      return;
    }
    
    if (!callbackForm.phone.trim() || callbackForm.phone.replace(/\D/g, '').length < 11) {
      setCallbackError('Укажите корректный номер телефона');
      return;
    }

    // Заглушка для отправки в Telegram
    // В реальном приложении здесь будет вызов API
    /*
    const TELEGRAM_BOT_TOKEN = 'YOUR_BOT_TOKEN';
    const TELEGRAM_CHAT_ID = 'YOUR_CHAT_ID';
    
    const message = `📞 Заявка на звонок\n\nИмя: ${callbackForm.name}\nТелефон: ${callbackForm.phone}\nДата: ${new Date().toLocaleString('ru-RU')}`;
    
    try {
      await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: TELEGRAM_CHAT_ID,
          text: message,
          parse_mode: 'HTML'
        })
      });
    } catch (error) {
      console.error('Failed to send callback request:', error);
    }
    */

    // Имитация отправки
    await new Promise(resolve => setTimeout(resolve, 500));
    
    setCallbackSubmitted(true);
    setTimeout(() => {
      setShowCallbackForm(false);
      setCallbackSubmitted(false);
      setCallbackForm({ name: '', phone: '' });
    }, 2000);
  };

  // Format phone input
  const handlePhoneChange = (value: string) => {
    const digits = value.replace(/\D/g, '');
    let formatted = '';
    
    if (digits.length > 0) {
      formatted = '+7';
      if (digits.length > 1) {
        formatted += ' (' + digits.substring(1, 4);
      }
      if (digits.length > 4) {
        formatted += ') ' + digits.substring(4, 7);
      }
      if (digits.length > 7) {
        formatted += '-' + digits.substring(7, 9);
      }
      if (digits.length > 9) {
        formatted += '-' + digits.substring(9, 11);
      }
    }
    
    setCallbackForm(prev => ({ ...prev, phone: formatted }));
  };

  // Skeleton loader component
  const SkeletonCard = () => (
    <div className={cn(
      'rounded-2xl overflow-hidden',
      isNeon ? 'bg-slate-800/50' : 'bg-white'
    )}>
      <div className={cn(
        'aspect-square shimmer',
        isNeon ? 'bg-slate-700' : 'bg-slate-200'
      )} />
      <div className="p-3 space-y-2">
        <div className={cn('h-3 rounded shimmer', isNeon ? 'bg-slate-700' : 'bg-slate-200')} />
        <div className={cn('h-3 w-2/3 rounded shimmer', isNeon ? 'bg-slate-700' : 'bg-slate-200')} />
        <div className={cn('h-8 rounded-xl shimmer', isNeon ? 'bg-slate-700' : 'bg-slate-200')} />
      </div>
    </div>
  );

  return (
    <div className={cn(
      'min-h-screen pb-24',
      isNeon
        ? 'bg-gradient-to-b from-slate-900 via-slate-900 to-purple-900/50'
        : 'bg-slate-50'
    )}>
      {/* Header */}
      <div className={cn(
        'sticky top-0 z-30 px-4 pt-4 pb-3',
        isNeon
          ? 'bg-slate-900/95 backdrop-blur-xl'
          : 'bg-white/95 backdrop-blur-xl shadow-sm'
      )}>
        {/* Search bar */}
        <div
          onClick={onSearchPress}
          className={cn(
            'flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-all',
            isNeon
              ? 'bg-slate-800 border border-purple-500/30 hover:border-cyan-400/50'
              : 'bg-slate-100 hover:bg-slate-200'
          )}
          style={isNeon ? { boxShadow: '0 0 20px rgba(147, 51, 234, 0.1)' } : {}}
        >
          <Search size={20} className={isNeon ? 'text-cyan-400' : 'text-slate-400'} />
          <span className={isNeon ? 'text-slate-400' : 'text-slate-500'}>
            Поиск по каталогу...
          </span>
          <button className={cn(
            'ml-auto p-2 rounded-lg transition-colors',
            isNeon
              ? 'bg-slate-700 text-cyan-400 hover:bg-slate-600'
              : 'bg-white text-slate-600 hover:bg-slate-50 shadow-sm'
          )}>
            <SlidersHorizontal size={18} />
          </button>
        </div>
      </div>

      {/* Categories horizontal scroll */}
      <div className="px-4 py-3">
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          <motion.button
            onClick={() => setSelectedCategory(null)}
            className={cn(
              'flex items-center gap-2 px-4 py-2 rounded-xl whitespace-nowrap font-medium text-sm transition-all',
              !selectedCategory
                ? isNeon
                  ? 'bg-gradient-to-r from-cyan-500 to-purple-500 text-white'
                  : 'bg-blue-600 text-white'
                : isNeon
                ? 'bg-slate-800 text-slate-300 border border-slate-700'
                : 'bg-white text-slate-700 border border-slate-200'
            )}
            style={!selectedCategory && isNeon ? { boxShadow: '0 0 25px rgba(6, 182, 212, 0.5)' } : {}}
            whileTap={{ scale: 0.95 }}
          >
            Все
          </motion.button>
          {categories.map((cat) => (
            <motion.button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={cn(
                'flex items-center gap-2 px-4 py-2 rounded-xl whitespace-nowrap font-medium text-sm transition-all',
                selectedCategory === cat.id
                  ? isNeon
                    ? 'bg-gradient-to-r from-cyan-500 to-purple-500 text-white'
                    : 'bg-blue-600 text-white'
                  : isNeon
                  ? 'bg-slate-800 text-slate-300 border border-slate-700'
                  : 'bg-white text-slate-700 border border-slate-200'
              )}
              style={selectedCategory === cat.id && isNeon ? { boxShadow: '0 0 25px rgba(6, 182, 212, 0.5)' } : {}}
              whileTap={{ scale: 0.95 }}
            >
              <span>{cat.icon}</span>
              {cat.name}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Promo Banner - FIXED LAYOUT */}
      <div className="px-4 mb-4">
        <motion.div
          className={cn(
            'relative rounded-2xl overflow-hidden',
            isNeon
              ? 'bg-gradient-to-br from-purple-600 via-pink-500 to-cyan-400'
              : 'bg-gradient-to-r from-blue-600 to-indigo-600'
          )}
          style={isNeon ? { boxShadow: '0 0 50px rgba(147, 51, 234, 0.5), 0 0 100px rgba(6, 182, 212, 0.2)' } : {}}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {/* Content */}
          <div className="relative z-10 p-5">
            <div className="flex items-center gap-2 mb-2">
              <Zap size={18} className="text-yellow-300" />
              <span className="text-white/90 text-sm font-bold uppercase tracking-wide">Акция дня</span>
            </div>
            <h2 className="text-white text-xl font-bold mb-2">Скидка 20% на игровые ПК</h2>
            <p className="text-white/80 text-sm mb-4">
              Промокод: <span className="font-mono font-bold text-white bg-white/20 px-2 py-0.5 rounded">GAMER20</span>
            </p>
            <button className="bg-white text-slate-900 px-5 py-2.5 rounded-xl font-semibold text-sm flex items-center gap-2 hover:bg-white/90 transition-colors">
              Смотреть товары
              <ChevronRight size={16} />
            </button>
          </div>
          
          {/* Timer - separate block at bottom */}
          <div className={cn(
            'relative z-10 px-5 py-3 flex items-center justify-between',
            'bg-black/20 backdrop-blur-sm border-t border-white/10'
          )}>
            <span className="text-white/70 text-sm">До конца акции:</span>
            <div className="flex items-center gap-1.5 font-mono font-bold text-white text-lg">
              <span className="bg-black/30 px-2 py-1 rounded-lg min-w-[36px] text-center">
                {String(promoTimeLeft.hours).padStart(2, '0')}
              </span>
              <span className="text-white/50">:</span>
              <span className="bg-black/30 px-2 py-1 rounded-lg min-w-[36px] text-center">
                {String(promoTimeLeft.minutes).padStart(2, '0')}
              </span>
              <span className="text-white/50">:</span>
              <span className="bg-black/30 px-2 py-1 rounded-lg min-w-[36px] text-center">
                {String(promoTimeLeft.seconds).padStart(2, '0')}
              </span>
            </div>
          </div>

          {/* Decorative elements */}
          {isNeon && (
            <>
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl" />
              <div className="absolute bottom-10 left-0 w-24 h-24 bg-cyan-400/20 rounded-full blur-2xl" />
            </>
          )}
        </motion.div>
      </div>

      {/* Bundles section */}
      <section className="mb-6">
        <div className="flex items-center justify-between px-4 mb-3">
          <div className="flex items-center gap-2">
            <Gift size={18} className={isNeon ? 'text-pink-400' : 'text-pink-500'} />
            <h2 className={cn(
              'font-semibold text-lg',
              isNeon ? 'text-white' : 'text-slate-900'
            )}>
              Выгодные комплекты
            </h2>
          </div>
        </div>
        <div className="flex gap-3 px-4 overflow-x-auto pb-2 scrollbar-hide">
          {bundles.map((bundle) => (
            <motion.div
              key={bundle.id}
              className={cn(
                'w-64 flex-shrink-0 rounded-xl p-4',
                isNeon
                  ? 'bg-gradient-to-br from-pink-500/20 to-purple-500/20 border border-pink-500/30'
                  : 'bg-gradient-to-br from-pink-50 to-purple-50 border border-pink-100'
              )}
              style={isNeon ? { boxShadow: '0 0 30px rgba(236, 72, 153, 0.2)' } : {}}
              whileTap={{ scale: 0.98 }}
            >
              <div className={cn(
                'inline-block px-2 py-0.5 rounded text-xs font-bold mb-2',
                isNeon ? 'bg-pink-500 text-white' : 'bg-pink-500 text-white'
              )}
              style={isNeon ? { boxShadow: '0 0 15px rgba(236, 72, 153, 0.5)' } : {}}
              >
                Скидка {bundle.discount}%
              </div>
              <h3 className={cn(
                'font-bold mb-1',
                isNeon ? 'text-white' : 'text-slate-900'
              )}>
                {bundle.name}
              </h3>
              <p className={cn(
                'text-sm mb-3 line-clamp-2',
                isNeon ? 'text-slate-400' : 'text-slate-500'
              )}>
                {bundle.description}
              </p>
              <div className="flex items-center gap-2">
                <span className={cn('font-bold', isNeon ? 'text-white' : 'text-slate-900')}>
                  {formatPrice(bundle.bundlePrice)}
                </span>
                <span className={cn('text-sm line-through', isNeon ? 'text-slate-500' : 'text-slate-400')}>
                  {formatPrice(bundle.originalPrice)}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Callback request section */}
      <div className="px-4 mb-4">
        <motion.div
          className={cn(
            'rounded-2xl p-4',
            isNeon
              ? 'bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30'
              : 'bg-gradient-to-r from-green-50 to-emerald-50 border border-green-100'
          )}
          style={isNeon ? { boxShadow: '0 0 30px rgba(16, 185, 129, 0.15)' } : {}}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center gap-3 mb-3">
            <div className={cn(
              'w-10 h-10 rounded-full flex items-center justify-center',
              isNeon ? 'bg-green-500/30' : 'bg-green-100'
            )}
            style={isNeon ? { boxShadow: '0 0 20px rgba(16, 185, 129, 0.4)' } : {}}
            >
              <Phone size={20} className={isNeon ? 'text-green-400' : 'text-green-600'} />
            </div>
            <div>
              <h3 className={cn(
                'font-semibold',
                isNeon ? 'text-white' : 'text-slate-900'
              )}>
                Нужна консультация?
              </h3>
              <p className={cn(
                'text-sm',
                isNeon ? 'text-slate-400' : 'text-slate-500'
              )}>
                Перезвоним за 5 минут
              </p>
            </div>
          </div>
          <button 
            onClick={() => setShowCallbackForm(true)}
            className={cn(
              'w-full py-2.5 rounded-xl font-medium text-sm flex items-center justify-center gap-2',
              isNeon
                ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white'
                : 'bg-green-600 text-white'
            )}
            style={isNeon ? { boxShadow: '0 0 25px rgba(16, 185, 129, 0.4)' } : {}}
          >
            <Phone size={16} />
            Заказать звонок
          </button>
        </motion.div>
      </div>

      {/* Recently viewed */}
      {recentProducts.length > 0 && (
        <section className="mb-6">
          <div className="flex items-center justify-between px-4 mb-3">
            <div className="flex items-center gap-2">
              <Clock size={18} className={isNeon ? 'text-cyan-400' : 'text-blue-600'} />
              <h2 className={cn(
                'font-semibold text-lg',
                isNeon ? 'text-white' : 'text-slate-900'
              )}>
                Вы смотрели
              </h2>
            </div>
            <button className={cn(
              'text-sm font-medium flex items-center gap-1',
              isNeon ? 'text-cyan-400' : 'text-blue-600'
            )}>
              Все <ChevronRight size={16} />
            </button>
          </div>
          <div className="flex gap-3 px-4 overflow-x-auto pb-2 scrollbar-hide">
            {recentProducts.slice(0, 5).map((product) => (
              <div key={product.id} className="w-40 flex-shrink-0">
                <ProductCard product={product} onPress={() => onProductPress(product)} />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Hits section */}
      <section className="mb-6">
        <div className="flex items-center justify-between px-4 mb-3">
          <div className="flex items-center gap-2">
            <TrendingUp size={18} className={isNeon ? 'text-orange-400' : 'text-orange-500'} />
            <h2 className={cn(
              'font-semibold text-lg',
              isNeon ? 'text-white' : 'text-slate-900'
            )}>
              Хиты продаж
            </h2>
          </div>
          <button className={cn(
            'text-sm font-medium flex items-center gap-1',
            isNeon ? 'text-cyan-400' : 'text-blue-600'
          )}>
            Все <ChevronRight size={16} />
          </button>
        </div>
        <div className="flex gap-3 px-4 overflow-x-auto pb-2 scrollbar-hide">
          {isLoading ? (
            [1, 2, 3].map(i => (
              <div key={i} className="w-44 flex-shrink-0">
                <SkeletonCard />
              </div>
            ))
          ) : (
            hitProducts.map((product) => (
              <div key={product.id} className="w-44 flex-shrink-0">
                <ProductCard product={product} onPress={() => onProductPress(product)} />
              </div>
            ))
          )}
        </div>
      </section>

      {/* Sale section */}
      <section className="mb-6">
        <div className="flex items-center justify-between px-4 mb-3">
          <h2 className={cn(
            'font-semibold text-lg',
            isNeon ? 'text-white' : 'text-slate-900'
          )}>
            🔥 Скидки
          </h2>
          <button className={cn(
            'text-sm font-medium flex items-center gap-1',
            isNeon ? 'text-cyan-400' : 'text-blue-600'
          )}>
            Все <ChevronRight size={16} />
          </button>
        </div>
        <div className="flex gap-3 px-4 overflow-x-auto pb-2 scrollbar-hide">
          {isLoading ? (
            [1, 2, 3].map(i => (
              <div key={i} className="w-44 flex-shrink-0">
                <SkeletonCard />
              </div>
            ))
          ) : (
            saleProducts.map((product) => (
              <div key={product.id} className="w-44 flex-shrink-0">
                <ProductCard product={product} onPress={() => onProductPress(product)} />
              </div>
            ))
          )}
        </div>
      </section>

      {/* Collections */}
      <section className="px-4 mb-6">
        <h2 className={cn(
          'font-semibold text-lg mb-3',
          isNeon ? 'text-white' : 'text-slate-900'
        )}>
          Подборки
        </h2>
        <div className="grid grid-cols-2 gap-3">
          {[
            { title: 'Игровые ПК', emoji: '🎮', color: 'from-purple-500 to-pink-500', shadow: 'rgba(168,85,247,0.4)' },
            { title: 'Для работы', emoji: '💼', color: 'from-blue-500 to-cyan-500', shadow: 'rgba(59,130,246,0.4)' },
            { title: 'Мониторы 144Hz+', emoji: '🖥️', color: 'from-green-500 to-emerald-500', shadow: 'rgba(34,197,94,0.4)' },
            { title: 'Сборки до 100к', emoji: '💰', color: 'from-orange-500 to-red-500', shadow: 'rgba(249,115,22,0.4)' },
          ].map((col, i) => (
            <motion.div
              key={i}
              className={cn(
                'p-4 rounded-xl cursor-pointer relative overflow-hidden',
                isNeon
                  ? `bg-gradient-to-br ${col.color}`
                  : 'bg-white border border-slate-100 shadow-sm hover:shadow-md'
              )}
              style={isNeon ? { boxShadow: `0 0 35px ${col.shadow}` } : {}}
              whileTap={{ scale: 0.98 }}
              whileHover={{ scale: 1.02 }}
            >
              <span className="text-3xl mb-2 block">{col.emoji}</span>
              <span className={cn(
                'font-semibold text-sm',
                isNeon ? 'text-white' : 'text-slate-900'
              )}>
                {col.title}
              </span>
              {isNeon && (
                <div className="absolute top-0 right-0 w-16 h-16 bg-white/20 rounded-full blur-xl" />
              )}
            </motion.div>
          ))}
        </div>
      </section>

      {/* All products grid */}
      <section className="px-4">
        <h2 className={cn(
          'font-semibold text-lg mb-3',
          isNeon ? 'text-white' : 'text-slate-900'
        )}>
          {selectedCategory
            ? categories.find((c) => c.id === selectedCategory)?.name
            : 'Все товары'}
        </h2>
        <div className="grid grid-cols-2 gap-3">
          <AnimatePresence mode="popLayout">
            {isLoading ? (
              [1, 2, 3, 4].map(i => (
                <SkeletonCard key={i} />
              ))
            ) : (
              filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onPress={() => onProductPress(product)}
                />
              ))
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* Callback Form Modal */}
      <AnimatePresence>
        {showCallbackForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={() => setShowCallbackForm(false)}
          >
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className={cn(
                'relative w-full max-w-sm rounded-2xl p-6',
                isNeon 
                  ? 'bg-slate-900 border border-purple-500/30' 
                  : 'bg-white'
              )}
              style={isNeon ? { boxShadow: '0 0 50px rgba(147, 51, 234, 0.3)' } : {}}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close button */}
              <button
                onClick={() => setShowCallbackForm(false)}
                className={cn(
                  'absolute top-4 right-4 p-2 rounded-full',
                  isNeon ? 'bg-slate-800 text-slate-400' : 'bg-slate-100 text-slate-500'
                )}
              >
                <X size={18} />
              </button>

              {callbackSubmitted ? (
                <div className="text-center py-8">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className={cn(
                      'w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4',
                      isNeon ? 'bg-green-500/20' : 'bg-green-100'
                    )}
                    style={isNeon ? { boxShadow: '0 0 30px rgba(16, 185, 129, 0.4)' } : {}}
                  >
                    <CheckCircle size={32} className={isNeon ? 'text-green-400' : 'text-green-600'} />
                  </motion.div>
                  <h3 className={cn(
                    'text-xl font-bold mb-2',
                    isNeon ? 'text-white' : 'text-slate-900'
                  )}>
                    Заявка отправлена!
                  </h3>
                  <p className={cn(
                    'text-sm',
                    isNeon ? 'text-slate-400' : 'text-slate-500'
                  )}>
                    Мы перезвоним вам в ближайшее время
                  </p>
                </div>
              ) : (
                <>
                  <div className="flex items-center gap-3 mb-6">
                    <div className={cn(
                      'w-12 h-12 rounded-full flex items-center justify-center',
                      isNeon ? 'bg-green-500/20' : 'bg-green-100'
                    )}
                    style={isNeon ? { boxShadow: '0 0 20px rgba(16, 185, 129, 0.3)' } : {}}
                    >
                      <Phone size={24} className={isNeon ? 'text-green-400' : 'text-green-600'} />
                    </div>
                    <div>
                      <h3 className={cn(
                        'font-bold text-lg',
                        isNeon ? 'text-white' : 'text-slate-900'
                      )}>
                        Заказать звонок
                      </h3>
                      <p className={cn(
                        'text-sm',
                        isNeon ? 'text-slate-400' : 'text-slate-500'
                      )}>
                        Перезвоним за 5 минут
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className={cn(
                        'block text-sm font-medium mb-1.5',
                        isNeon ? 'text-slate-300' : 'text-slate-700'
                      )}>
                        Ваше имя
                      </label>
                      <input
                        type="text"
                        value={callbackForm.name}
                        onChange={(e) => setCallbackForm(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="Введите имя"
                        className={cn(
                          'w-full px-4 py-3 rounded-xl text-base',
                          isNeon
                            ? 'bg-slate-800 border border-slate-700 text-white placeholder-slate-500 focus:border-cyan-500'
                            : 'bg-slate-100 border border-slate-200 text-slate-900 placeholder-slate-400 focus:border-blue-500'
                        )}
                      />
                    </div>
                    <div>
                      <label className={cn(
                        'block text-sm font-medium mb-1.5',
                        isNeon ? 'text-slate-300' : 'text-slate-700'
                      )}>
                        Номер телефона
                      </label>
                      <input
                        type="tel"
                        value={callbackForm.phone}
                        onChange={(e) => handlePhoneChange(e.target.value)}
                        placeholder="+7 (___) ___-__-__"
                        className={cn(
                          'w-full px-4 py-3 rounded-xl text-base',
                          isNeon
                            ? 'bg-slate-800 border border-slate-700 text-white placeholder-slate-500 focus:border-cyan-500'
                            : 'bg-slate-100 border border-slate-200 text-slate-900 placeholder-slate-400 focus:border-blue-500'
                        )}
                      />
                    </div>

                    {callbackError && (
                      <p className="text-red-500 text-sm">{callbackError}</p>
                    )}

                    <button
                      onClick={handleCallbackSubmit}
                      className={cn(
                        'w-full py-3 rounded-xl font-semibold text-base flex items-center justify-center gap-2',
                        isNeon
                          ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white'
                          : 'bg-green-600 text-white'
                      )}
                      style={isNeon ? { boxShadow: '0 0 30px rgba(16, 185, 129, 0.4)' } : {}}
                    >
                      <Phone size={18} />
                      Жду звонка
                    </button>
                  </div>

                  <p className={cn(
                    'text-xs text-center mt-4',
                    isNeon ? 'text-slate-500' : 'text-slate-400'
                  )}>
                    Нажимая кнопку, вы соглашаетесь с политикой конфиденциальности
                  </p>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
