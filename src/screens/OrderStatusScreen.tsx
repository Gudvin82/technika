import { 
  ChevronLeft, Check, Package, Truck, MapPin, 
  Copy, ExternalLink, MessageCircle, Home
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useStore } from '../store';
import { cn } from '../utils/cn';

interface OrderStatusScreenProps {
  orderId: string;
  onBack: () => void;
  onHome: () => void;
}

export function OrderStatusScreen({ orderId, onBack, onHome }: OrderStatusScreenProps) {
  const theme = useStore((s) => s.theme);
  const orders = useStore((s) => s.orders);
  const isNeon = theme === 'neon';

  const order = orders.find(o => o.id === orderId);

  const statusSteps = [
    { id: 'pending', label: 'Принят', icon: Check, completed: true },
    { id: 'processing', label: 'Собираем', icon: Package, completed: false },
    { id: 'shipped', label: 'В пути', icon: Truck, completed: false },
    { id: 'delivered', label: 'Доставлен', icon: MapPin, completed: false },
  ];

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ru-RU').format(price) + ' ₽';
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

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
          Заказ оформлен!
        </h1>
      </div>

      <div className="px-4 py-4">
        {/* Success animation */}
        <motion.div
          className="flex justify-center mb-6"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 10 }}
        >
          <div className={cn(
            'w-24 h-24 rounded-full flex items-center justify-center',
            isNeon
              ? 'bg-gradient-to-br from-green-400 to-cyan-500 shadow-[0_0_40px_rgba(34,197,94,0.4)]'
              : 'bg-gradient-to-br from-green-400 to-green-600'
          )}>
            <Check size={48} className="text-white" strokeWidth={3} />
          </div>
        </motion.div>

        <motion.div
          className="text-center mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className={cn(
            'text-2xl font-bold mb-2',
            isNeon ? 'text-white' : 'text-slate-900'
          )}>
            Спасибо за заказ!
          </h2>
          <p className={isNeon ? 'text-slate-400' : 'text-slate-500'}>
            Мы уже начали его собирать
          </p>
        </motion.div>

        {/* Order number */}
        <motion.div
          className={cn(
            'rounded-xl p-4 mb-4',
            isNeon
              ? 'bg-slate-800/50 border border-purple-500/20'
              : 'bg-white border border-slate-100 shadow-sm'
          )}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className={cn('text-sm', isNeon ? 'text-slate-400' : 'text-slate-500')}>
                Номер заказа
              </p>
              <p className={cn('text-lg font-bold', isNeon ? 'text-white' : 'text-slate-900')}>
                {orderId}
              </p>
            </div>
            <button
              onClick={() => copyToClipboard(orderId)}
              className={cn(
                'p-2 rounded-lg transition-colors',
                isNeon
                  ? 'bg-slate-700 text-cyan-400 hover:bg-slate-600'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              )}
            >
              <Copy size={18} />
            </button>
          </div>
        </motion.div>

        {/* Status timeline */}
        <motion.div
          className={cn(
            'rounded-xl p-4 mb-4',
            isNeon
              ? 'bg-slate-800/50 border border-purple-500/20'
              : 'bg-white border border-slate-100 shadow-sm'
          )}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h3 className={cn('font-semibold mb-4', isNeon ? 'text-white' : 'text-slate-900')}>
            Статус заказа
          </h3>
          
          <div className="space-y-4">
            {statusSteps.map((step, i) => (
              <div key={step.id} className="flex items-start gap-3">
                <div className="flex flex-col items-center">
                  <div className={cn(
                    'w-10 h-10 rounded-full flex items-center justify-center transition-all',
                    step.completed
                      ? isNeon
                        ? 'bg-gradient-to-br from-green-400 to-cyan-500 text-white'
                        : 'bg-green-500 text-white'
                      : isNeon
                      ? 'bg-slate-700 text-slate-500'
                      : 'bg-slate-200 text-slate-400'
                  )}>
                    <step.icon size={20} />
                  </div>
                  {i < statusSteps.length - 1 && (
                    <div className={cn(
                      'w-0.5 h-8 my-1',
                      step.completed
                        ? isNeon ? 'bg-cyan-500' : 'bg-green-500'
                        : isNeon ? 'bg-slate-700' : 'bg-slate-200'
                    )} />
                  )}
                </div>
                <div className="pt-2">
                  <p className={cn(
                    'font-medium',
                    step.completed
                      ? isNeon ? 'text-white' : 'text-slate-900'
                      : isNeon ? 'text-slate-500' : 'text-slate-400'
                  )}>
                    {step.label}
                  </p>
                  {step.completed && (
                    <p className={cn('text-sm', isNeon ? 'text-slate-400' : 'text-slate-500')}>
                      {new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Tracking info */}
        <motion.div
          className={cn(
            'rounded-xl p-4 mb-4',
            isNeon
              ? 'bg-cyan-500/10 border border-cyan-500/30'
              : 'bg-blue-50 border border-blue-100'
          )}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <div className="flex items-center gap-3">
            <Truck size={24} className={isNeon ? 'text-cyan-400' : 'text-blue-600'} />
            <div className="flex-1">
              <p className={cn('font-medium', isNeon ? 'text-white' : 'text-slate-900')}>
                Ожидаемая доставка
              </p>
              <p className={cn('text-sm', isNeon ? 'text-slate-400' : 'text-slate-500')}>
                Завтра, 10:00 - 22:00
              </p>
            </div>
            <button className={cn(
              'p-2 rounded-lg',
              isNeon ? 'text-cyan-400' : 'text-blue-600'
            )}>
              <ExternalLink size={18} />
            </button>
          </div>
        </motion.div>

        {/* Order details */}
        {order && (
          <motion.div
            className={cn(
              'rounded-xl p-4 mb-4',
              isNeon
                ? 'bg-slate-800/50 border border-purple-500/20'
                : 'bg-white border border-slate-100 shadow-sm'
            )}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <h3 className={cn('font-semibold mb-3', isNeon ? 'text-white' : 'text-slate-900')}>
              Состав заказа
            </h3>
            
            <div className="space-y-3">
              {order.items.map((item) => (
                <div key={item.product.id} className="flex items-center gap-3">
                  <img
                    src={item.product.images[0]}
                    alt=""
                    className="w-12 h-12 rounded-lg object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <p className={cn(
                      'text-sm font-medium truncate',
                      isNeon ? 'text-white' : 'text-slate-900'
                    )}>
                      {item.product.name}
                    </p>
                    <p className={cn('text-xs', isNeon ? 'text-slate-400' : 'text-slate-500')}>
                      {item.quantity} шт.
                    </p>
                  </div>
                  <p className={cn('font-medium', isNeon ? 'text-white' : 'text-slate-900')}>
                    {formatPrice(item.product.price * item.quantity)}
                  </p>
                </div>
              ))}
            </div>

            <div className={cn(
              'mt-4 pt-3 border-t flex justify-between',
              isNeon ? 'border-slate-700' : 'border-slate-100'
            )}>
              <span className={cn('font-semibold', isNeon ? 'text-white' : 'text-slate-900')}>
                Итого
              </span>
              <span className={cn('font-bold text-lg', isNeon ? 'text-white' : 'text-slate-900')}>
                {formatPrice(order.total)}
              </span>
            </div>
          </motion.div>
        )}

        {/* Actions */}
        <motion.div
          className="space-y-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <button className={cn(
            'w-full py-3 rounded-xl font-medium flex items-center justify-center gap-2',
            isNeon
              ? 'bg-slate-800 text-white border border-slate-700'
              : 'bg-white text-slate-900 border border-slate-200'
          )}>
            <MessageCircle size={18} />
            Связаться с поддержкой
          </button>

          <button
            onClick={onHome}
            className={cn(
              'w-full py-3 rounded-xl font-medium flex items-center justify-center gap-2',
              isNeon
                ? 'bg-gradient-to-r from-cyan-500 to-purple-500 text-white'
                : 'bg-blue-600 text-white'
            )}
          >
            <Home size={18} />
            На главную
          </button>
        </motion.div>
      </div>
    </div>
  );
}
