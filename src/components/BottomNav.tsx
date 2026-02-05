import { Home, ShoppingCart, Heart, User, Package } from 'lucide-react';
import { useStore } from '../store';
import { cn } from '../utils/cn';

type Tab = 'home' | 'cart' | 'favorites' | 'profile';

interface BottomNavProps {
  activeTab: string;
  onTabChange: (tab: Tab) => void;
  hasActiveOrder?: boolean;
  onOrderPress?: () => void;
}

export function BottomNav({ activeTab, onTabChange, hasActiveOrder, onOrderPress }: BottomNavProps) {
  const theme = useStore((s) => s.theme);
  const cart = useStore((s) => s.cart);
  const favorites = useStore((s) => s.favorites);
  const isNeon = theme === 'neon';

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  const tabs: { id: Tab; icon: typeof Home; label: string; badge?: number }[] = [
    { id: 'home', icon: Home, label: 'Главная' },
    { id: 'cart', icon: ShoppingCart, label: 'Корзина', badge: cartCount },
    { id: 'favorites', icon: Heart, label: 'Избранное', badge: favorites.length },
    { id: 'profile', icon: User, label: 'Профиль' },
  ];

  return (
    <nav
      className={cn(
        'fixed bottom-0 left-0 right-0 z-40 px-2 pb-safe',
        isNeon
          ? 'bg-slate-900/95 backdrop-blur-xl border-t border-purple-500/30'
          : 'bg-white/95 backdrop-blur-xl border-t border-slate-200'
      )}
      style={isNeon ? { boxShadow: '0 -4px 30px rgba(147, 51, 234, 0.15)' } : {}}
    >
      {/* Active order indicator */}
      {hasActiveOrder && (
        <button
          onClick={onOrderPress}
          className={cn(
            'absolute -top-12 left-1/2 -translate-x-1/2 px-4 py-2 rounded-full flex items-center gap-2 shadow-lg',
            isNeon
              ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white'
              : 'bg-green-500 text-white'
          )}
          style={isNeon ? { 
            boxShadow: '0 0 20px rgba(16, 185, 129, 0.5), 0 0 40px rgba(16, 185, 129, 0.3)' 
          } : {}}
        >
          <Package size={16} className="animate-pulse" />
          <span className="text-sm font-medium">Ваш заказ в пути</span>
        </button>
      )}

      <div className="flex justify-around items-center h-16 max-w-lg mx-auto">
        {tabs.map(({ id, icon: Icon, label, badge }) => {
          const isActive = activeTab === id;
          return (
            <button
              key={id}
              onClick={() => onTabChange(id)}
              className={cn(
                'flex flex-col items-center justify-center flex-1 h-full relative transition-all',
                isActive
                  ? isNeon
                    ? 'text-cyan-400'
                    : 'text-blue-600'
                  : isNeon
                  ? 'text-slate-400'
                  : 'text-slate-500'
              )}
            >
              <div className="relative">
                <Icon
                  size={22}
                  className={cn(
                    'transition-transform',
                    isActive && 'scale-110'
                  )}
                  style={
                    isActive && isNeon
                      ? { filter: 'drop-shadow(0 0 10px rgba(6, 182, 212, 0.9))' }
                      : {}
                  }
                />
                {badge !== undefined && badge > 0 && (
                  <span
                    className={cn(
                      'absolute -top-2 -right-2 min-w-[18px] h-[18px] flex items-center justify-center text-[10px] font-bold rounded-full',
                      isNeon
                        ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white'
                        : 'bg-red-500 text-white'
                    )}
                    style={
                      isNeon
                        ? { boxShadow: '0 0 12px rgba(236, 72, 153, 0.7)' }
                        : {}
                    }
                  >
                    {badge > 99 ? '99+' : badge}
                  </span>
                )}
              </div>
              <span className="text-[10px] mt-1 font-medium">{label}</span>
              {isActive && (
                <div
                  className={cn(
                    'absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 rounded-full',
                    isNeon
                      ? 'bg-cyan-400'
                      : 'bg-blue-600'
                  )}
                  style={isNeon ? { 
                    boxShadow: '0 0 15px rgba(6, 182, 212, 1), 0 0 30px rgba(6, 182, 212, 0.5)' 
                  } : {}}
                />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
