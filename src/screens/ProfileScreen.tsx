import { useState } from 'react';
import { 
  User, Settings, ShoppingBag, Heart, GitCompare, MapPin, Bell, 
  HelpCircle, FileText, Shield, Moon, Sun, ChevronRight,
  Award, Gift, Star, Sparkles, MessageCircle, Phone, X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '../store';
import { cn } from '../utils/cn';

interface ProfileScreenProps {
  onOpenCompare: () => void;
  onOpenLegal: () => void;
  onOpenChat: () => void;
  onOpenOrderStatus?: () => void;
}

export function ProfileScreen({ onOpenCompare, onOpenLegal, onOpenChat, onOpenOrderStatus }: ProfileScreenProps) {
  const theme = useStore((s) => s.theme);
  const setTheme = useStore((s) => s.setTheme);
  const user = useStore((s) => s.user);
  const favorites = useStore((s) => s.favorites);
  const orders = useStore((s) => s.orders);
  const compareList = useStore((s) => s.compareList);
  const isNeon = theme === 'neon';
  
  const [showHelpCenter, setShowHelpCenter] = useState(false);

  const loyaltyLevels = {
    bronze: { name: 'Бронза', color: 'from-orange-400 to-orange-600', next: 'Серебро', threshold: 50000, cashback: 3 },
    silver: { name: 'Серебро', color: 'from-slate-300 to-slate-500', next: 'Золото', threshold: 150000, cashback: 5 },
    gold: { name: 'Золото', color: 'from-yellow-400 to-yellow-600', next: null, threshold: null, cashback: 7 },
  };

  const currentLevel = user?.loyaltyLevel || 'bronze';
  const levelInfo = loyaltyLevels[currentLevel];
  const progress = user ? (user.totalSpent / (levelInfo.threshold || user.totalSpent)) * 100 : 0;

  // Check for active orders
  const activeOrders = orders.filter(o => o.status !== 'delivered');

  const menuSections = [
    {
      title: 'Заказы и покупки',
      items: [
        { icon: ShoppingBag, label: 'История заказов', badge: orders.length, action: onOpenOrderStatus || (() => {}) },
        { icon: Heart, label: 'Избранное', badge: favorites.length, action: () => {} },
        { icon: GitCompare, label: 'Сравнение товаров', badge: compareList.length, action: onOpenCompare },
        { icon: MapPin, label: 'Адреса доставки', action: () => {} },
      ],
    },
    {
      title: 'Настройки',
      items: [
        { 
          icon: isNeon ? Sun : Moon, 
          label: isNeon ? 'Светлая тема' : 'Неоновая тема',
          action: () => setTheme(isNeon ? 'light' : 'neon'),
          toggle: true,
        },
        { icon: Bell, label: 'Уведомления', action: () => {} },
      ],
    },
    {
      title: 'Помощь и информация',
      items: [
        { icon: HelpCircle, label: 'Центр помощи', action: () => setShowHelpCenter(true) },
        { icon: MessageCircle, label: 'Чат с поддержкой', action: onOpenChat },
        { icon: FileText, label: 'О магазине', action: onOpenLegal },
        { icon: Shield, label: 'Политика конфиденциальности', action: onOpenLegal },
      ],
    },
  ];

  const faqItems = [
    { q: 'Как отслеживать заказ?', a: 'Статус заказа отображается в разделе "История заказов". Вы также получите уведомления о всех изменениях.' },
    { q: 'Как вернуть товар?', a: 'Возврат возможен в течение 14 дней. Напишите в поддержку или оформите возврат в разделе заказа.' },
    { q: 'Как использовать бонусы?', a: 'Бонусы можно списать при оформлении заказа. 1 бонус = 1 рубль. Максимум 30% от суммы.' },
    { q: 'Где посмотреть гарантию?', a: 'Гарантийный талон доступен в карточке заказа. Срок гарантии указан на странице товара.' },
    { q: 'Как связаться с поддержкой?', a: 'Напишите нам в чат или позвоните по номеру +7 (495) 123-45-67' },
  ];

  return (
    <div className={cn(
      'min-h-screen pb-24',
      isNeon
        ? 'bg-gradient-to-b from-slate-900 via-slate-900 to-purple-900/50'
        : 'bg-slate-50'
    )}>
      {/* Header */}
      <div className={cn(
        'px-4 pt-6 pb-4',
        isNeon
          ? 'bg-gradient-to-b from-purple-900/50 to-transparent'
          : ''
      )}>
        {/* Active order notification */}
        {activeOrders.length > 0 && (
          <motion.button
            onClick={onOpenOrderStatus}
            className={cn(
              'w-full mb-4 px-4 py-3 rounded-xl flex items-center gap-3',
              isNeon
                ? 'bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/40'
                : 'bg-green-50 border border-green-200'
            )}
            style={isNeon ? { boxShadow: '0 0 25px rgba(16, 185, 129, 0.3)' } : {}}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className={cn(
              'w-10 h-10 rounded-full flex items-center justify-center',
              isNeon ? 'bg-green-500/30' : 'bg-green-100'
            )}>
              <ShoppingBag size={20} className={cn(
                'animate-pulse',
                isNeon ? 'text-green-400' : 'text-green-600'
              )} />
            </div>
            <div className="flex-1 text-left">
              <p className={cn(
                'font-semibold text-sm',
                isNeon ? 'text-white' : 'text-slate-900'
              )}>
                Активный заказ
              </p>
              <p className={cn(
                'text-xs',
                isNeon ? 'text-green-400' : 'text-green-600'
              )}>
                {activeOrders[0]?.status === 'processing' && 'Собираем ваш заказ'}
                {activeOrders[0]?.status === 'shipped' && 'В пути к вам'}
                {activeOrders[0]?.status === 'pending' && 'Ожидает подтверждения'}
              </p>
            </div>
            <ChevronRight size={20} className={isNeon ? 'text-green-400' : 'text-green-600'} />
          </motion.button>
        )}

        {/* User info */}
        <div className="flex items-center gap-4 mb-6">
          <div className={cn(
            'w-16 h-16 rounded-full flex items-center justify-center overflow-hidden',
            isNeon
              ? 'bg-gradient-to-br from-cyan-500 to-purple-500'
              : 'bg-gradient-to-br from-blue-500 to-indigo-600'
          )}
          style={isNeon ? { boxShadow: '0 0 30px rgba(6, 182, 212, 0.5)' } : {}}
          >
            {user?.photoUrl ? (
              <img src={user.photoUrl} alt="" className="w-full h-full object-cover" />
            ) : (
              <User size={28} className="text-white" />
            )}
          </div>
          <div>
            <h1 className={cn(
              'text-xl font-bold',
              isNeon ? 'text-white' : 'text-slate-900'
            )}>
              {user?.firstName || 'Гость'}
            </h1>
            <p className={cn(
              'text-sm',
              isNeon ? 'text-slate-400' : 'text-slate-500'
            )}>
              {user?.username ? `@${user.username}` : 'Войдите для полного доступа'}
            </p>
          </div>
          <button className={cn(
            'ml-auto p-2 rounded-xl',
            isNeon ? 'bg-slate-800 text-slate-400' : 'bg-white text-slate-600 shadow-sm'
          )}>
            <Settings size={20} />
          </button>
        </div>

        {/* Loyalty card */}
        <motion.div
          className={cn(
            'rounded-2xl p-5 relative overflow-hidden',
            isNeon
              ? 'bg-gradient-to-br from-slate-800 to-slate-900 border border-purple-500/40'
              : 'bg-gradient-to-br from-slate-800 to-slate-900'
          )}
          style={isNeon ? { boxShadow: '0 0 50px rgba(147, 51, 234, 0.3)' } : {}}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-500/20 to-transparent rounded-full blur-2xl" />
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-cyan-500/20 to-transparent rounded-full blur-2xl" />

          <div className="relative z-10">
            {/* Level badge */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className={cn(
                  'w-10 h-10 rounded-full flex items-center justify-center bg-gradient-to-br',
                  levelInfo.color
                )}
                style={isNeon ? { boxShadow: '0 0 20px rgba(251, 146, 60, 0.5)' } : {}}
                >
                  <Award size={20} className="text-white" />
                </div>
                <div>
                  <p className="text-white font-bold">{levelInfo.name}</p>
                  <p className="text-slate-400 text-xs">Кэшбэк {levelInfo.cashback}%</p>
                </div>
              </div>
              <div className="text-right">
                <p className={cn(
                  'font-bold text-lg',
                  isNeon ? 'text-cyan-400' : 'text-cyan-400'
                )}
                style={isNeon ? { textShadow: '0 0 20px rgba(6, 182, 212, 0.8)' } : {}}
                >
                  {user?.bonusPoints?.toLocaleString() || 0}
                </p>
                <p className="text-slate-400 text-xs">бонусов</p>
              </div>
            </div>

            {/* Progress to next level */}
            {levelInfo.next && levelInfo.threshold && (
              <div className="mb-4">
                <div className="flex justify-between text-xs text-slate-400 mb-1">
                  <span>До уровня {levelInfo.next}</span>
                  <span>{(levelInfo.threshold - (user?.totalSpent || 0)).toLocaleString()} ₽</span>
                </div>
                <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-cyan-500 to-purple-500"
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(progress, 100)}%` }}
                    transition={{ duration: 1, ease: 'easeOut' }}
                    style={isNeon ? { boxShadow: '0 0 10px rgba(6, 182, 212, 0.6)' } : {}}
                  />
                </div>
              </div>
            )}

            {/* Quick actions */}
            <div className="flex gap-2">
              <button className={cn(
                'flex-1 py-2 rounded-lg text-white text-sm font-medium flex items-center justify-center gap-2 transition-colors',
                isNeon ? 'bg-white/10 hover:bg-white/20' : 'bg-white/10 hover:bg-white/20'
              )}>
                <Gift size={16} />
                Обменять баллы
              </button>
              <button className={cn(
                'flex-1 py-2 rounded-lg text-white text-sm font-medium flex items-center justify-center gap-2 transition-colors',
                isNeon ? 'bg-white/10 hover:bg-white/20' : 'bg-white/10 hover:bg-white/20'
              )}>
                <Sparkles size={16} />
                Мои предложения
              </button>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Referral banner */}
      <div className="px-4 mb-4">
        <motion.div
          className={cn(
            'rounded-xl p-4 flex items-center gap-4',
            isNeon
              ? 'bg-gradient-to-r from-pink-500/20 to-purple-500/20 border border-pink-500/40'
              : 'bg-gradient-to-r from-pink-50 to-purple-50 border border-pink-100'
          )}
          style={isNeon ? { boxShadow: '0 0 25px rgba(236, 72, 153, 0.2)' } : {}}
          whileTap={{ scale: 0.98 }}
        >
          <div className={cn(
            'w-12 h-12 rounded-full flex items-center justify-center',
            isNeon ? 'bg-pink-500/30' : 'bg-pink-100'
          )}
          style={isNeon ? { boxShadow: '0 0 20px rgba(236, 72, 153, 0.4)' } : {}}
          >
            <Star size={24} className={isNeon ? 'text-pink-400' : 'text-pink-500'} />
          </div>
          <div className="flex-1">
            <h3 className={cn(
              'font-semibold',
              isNeon ? 'text-white' : 'text-slate-900'
            )}>
              Приглашай друзей
            </h3>
            <p className={cn(
              'text-sm',
              isNeon ? 'text-slate-400' : 'text-slate-500'
            )}>
              500 бонусов тебе и другу
            </p>
          </div>
          <ChevronRight size={20} className={isNeon ? 'text-slate-500' : 'text-slate-400'} />
        </motion.div>
      </div>

      {/* Phone number banner */}
      <div className="px-4 mb-4">
        <a 
          href="tel:+74951234567"
          className={cn(
            'rounded-xl p-4 flex items-center gap-4 block',
            isNeon
              ? 'bg-green-500/15 border border-green-500/40'
              : 'bg-green-50 border border-green-100'
          )}
          style={isNeon ? { boxShadow: '0 0 25px rgba(16, 185, 129, 0.2)' } : {}}
        >
          <div className={cn(
            'w-12 h-12 rounded-full flex items-center justify-center',
            isNeon ? 'bg-green-500/30' : 'bg-green-100'
          )}
          style={isNeon ? { boxShadow: '0 0 20px rgba(16, 185, 129, 0.4)' } : {}}
          >
            <Phone size={24} className={isNeon ? 'text-green-400' : 'text-green-600'} />
          </div>
          <div className="flex-1">
            <h3 className={cn(
              'font-semibold',
              isNeon ? 'text-white' : 'text-slate-900'
            )}>
              +7 (495) 123-45-67
            </h3>
            <p className={cn(
              'text-sm',
              isNeon ? 'text-slate-400' : 'text-slate-500'
            )}>
              Ежедневно с 9:00 до 21:00
            </p>
          </div>
          <ChevronRight size={20} className={isNeon ? 'text-slate-500' : 'text-slate-400'} />
        </a>
      </div>

      {/* Menu sections */}
      {menuSections.map((section, sectionIndex) => (
        <div key={sectionIndex} className="px-4 mb-4">
          <h2 className={cn(
            'text-sm font-medium mb-2 px-1',
            isNeon ? 'text-slate-400' : 'text-slate-500'
          )}>
            {section.title}
          </h2>
          <div className={cn(
            'rounded-xl overflow-hidden',
            isNeon
              ? 'bg-slate-800/50 border border-purple-500/30'
              : 'bg-white border border-slate-100 shadow-sm'
          )}>
            {section.items.map((item, itemIndex) => (
              <motion.button
                key={itemIndex}
                onClick={item.action}
                className={cn(
                  'w-full flex items-center gap-3 px-4 py-3.5 transition-colors',
                  itemIndex !== section.items.length - 1 && (
                    isNeon ? 'border-b border-slate-700/50' : 'border-b border-slate-100'
                  ),
                  isNeon ? 'hover:bg-slate-700/30' : 'hover:bg-slate-50'
                )}
                whileTap={{ scale: 0.98 }}
              >
                <item.icon size={20} className={isNeon ? 'text-cyan-400' : 'text-blue-600'} 
                  style={isNeon ? { filter: 'drop-shadow(0 0 6px rgba(6, 182, 212, 0.6))' } : {}}
                />
                <span className={cn(
                  'flex-1 text-left font-medium',
                  isNeon ? 'text-white' : 'text-slate-900'
                )}>
                  {item.label}
                </span>
                {'badge' in item && item.badge !== undefined && item.badge > 0 && (
                  <span className={cn(
                    'px-2 py-0.5 rounded-full text-xs font-medium',
                    isNeon
                      ? 'bg-cyan-500/20 text-cyan-400'
                      : 'bg-blue-100 text-blue-600'
                  )}
                  style={isNeon ? { boxShadow: '0 0 10px rgba(6, 182, 212, 0.3)' } : {}}
                  >
                    {item.badge}
                  </span>
                )}
                {!('toggle' in item && item.toggle) && (
                  <ChevronRight size={18} className={isNeon ? 'text-slate-500' : 'text-slate-400'} />
                )}
              </motion.button>
            ))}
          </div>
        </div>
      ))}

      {/* Version */}
      <p className={cn(
        'text-center text-xs py-4',
        isNeon ? 'text-slate-600' : 'text-slate-400'
      )}>
        TechZone Mini App v1.0.0
      </p>

      {/* Help Center Modal */}
      <AnimatePresence>
        {showHelpCenter && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-end justify-center"
            onClick={() => setShowHelpCenter(false)}
          >
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className={cn(
                'relative w-full max-h-[85vh] rounded-t-3xl overflow-hidden',
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

              {/* Header */}
              <div className="flex items-center justify-between px-4 pb-4">
                <h3 className={cn('text-xl font-bold', isNeon ? 'text-white' : 'text-slate-900')}>
                  Центр помощи
                </h3>
                <button
                  onClick={() => setShowHelpCenter(false)}
                  className={cn(
                    'p-2 rounded-full',
                    isNeon ? 'bg-slate-800 text-slate-400' : 'bg-slate-100 text-slate-500'
                  )}
                >
                  <X size={20} />
                </button>
              </div>

              {/* Content */}
              <div className="px-4 pb-8 overflow-y-auto max-h-[calc(85vh-100px)]">
                {/* Quick contact */}
                <div className={cn(
                  'rounded-xl p-4 mb-4 flex items-center gap-3',
                  isNeon
                    ? 'bg-cyan-500/15 border border-cyan-500/40'
                    : 'bg-blue-50 border border-blue-100'
                )}
                style={isNeon ? { boxShadow: '0 0 20px rgba(6, 182, 212, 0.15)' } : {}}
                >
                  <MessageCircle size={20} className={isNeon ? 'text-cyan-400' : 'text-blue-600'} />
                  <div className="flex-1">
                    <p className={cn('font-medium text-sm', isNeon ? 'text-white' : 'text-slate-900')}>
                      Нужна помощь?
                    </p>
                    <p className={cn('text-xs', isNeon ? 'text-slate-400' : 'text-slate-500')}>
                      Отвечаем за 5 минут в часы работы
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setShowHelpCenter(false);
                      onOpenChat();
                    }}
                    className={cn(
                      'px-4 py-2 rounded-lg text-sm font-medium',
                      isNeon ? 'bg-cyan-500 text-white' : 'bg-blue-600 text-white'
                    )}
                    style={isNeon ? { boxShadow: '0 0 20px rgba(6, 182, 212, 0.4)' } : {}}
                  >
                    Написать
                  </button>
                </div>

                {/* FAQ */}
                <h4 className={cn('font-semibold mb-3', isNeon ? 'text-white' : 'text-slate-900')}>
                  Частые вопросы
                </h4>
                <div className="space-y-2">
                  {faqItems.map((item, i) => (
                    <details
                      key={i}
                      className={cn(
                        'rounded-xl overflow-hidden group',
                        isNeon ? 'bg-slate-800' : 'bg-slate-50'
                      )}
                    >
                      <summary className={cn(
                        'px-4 py-3 font-medium cursor-pointer list-none flex items-center justify-between',
                        isNeon ? 'text-white' : 'text-slate-900'
                      )}>
                        {item.q}
                        <ChevronRight size={16} className={cn(
                          'transition-transform group-open:rotate-90',
                          isNeon ? 'text-slate-500' : 'text-slate-400'
                        )} />
                      </summary>
                      <p className={cn(
                        'px-4 pb-3 text-sm',
                        isNeon ? 'text-slate-400' : 'text-slate-600'
                      )}>
                        {item.a}
                      </p>
                    </details>
                  ))}
                </div>

                {/* Contact info */}
                <div className={cn(
                  'mt-6 rounded-xl p-4',
                  isNeon ? 'bg-slate-800' : 'bg-slate-50'
                )}>
                  <h4 className={cn('font-semibold mb-3', isNeon ? 'text-white' : 'text-slate-900')}>
                    Контакты
                  </h4>
                  <div className="space-y-3 text-sm">
                    <a href="tel:+74951234567" className="flex items-center gap-2">
                      <Phone size={16} className={isNeon ? 'text-cyan-400' : 'text-blue-600'} />
                      <span className={isNeon ? 'text-white' : 'text-slate-900'}>+7 (495) 123-45-67</span>
                    </a>
                    <p className={cn('text-xs', isNeon ? 'text-slate-500' : 'text-slate-400')}>
                      Ежедневно с 9:00 до 21:00
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
