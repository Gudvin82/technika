import { useState } from 'react';
import { 
  ChevronLeft, Check, Truck, MapPin, CreditCard, 
  Smartphone, ChevronRight, Clock, Building2
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useStore } from '../store';
import { deliveryPoints } from '../data/products';
import { cn } from '../utils/cn';

interface CheckoutScreenProps {
  onBack: () => void;
  onComplete: (orderId: string) => void;
}

type Step = 'contact' | 'delivery' | 'payment';
type DeliveryMethod = 'delivery' | 'pickup';
type PaymentMethod = 'sbp' | 'card' | 'invoice';

export function CheckoutScreen({ onBack, onComplete }: CheckoutScreenProps) {
  const theme = useStore((s) => s.theme);
  const cart = useStore((s) => s.cart);
  const user = useStore((s) => s.user);
  const promoCode = useStore((s) => s.promoCode);
  const clearCart = useStore((s) => s.clearCart);
  const addOrder = useStore((s) => s.addOrder);
  const isNeon = theme === 'neon';

  const [step, setStep] = useState<Step>('contact');
  const [phone, setPhone] = useState('+7');
  const [name, setName] = useState(user?.firstName || '');
  const [deliveryMethod, setDeliveryMethod] = useState<DeliveryMethod>('delivery');
  const [address, setAddress] = useState('');
  const [selectedPoint, setSelectedPoint] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('sbp');
  const [isProcessing, setIsProcessing] = useState(false);

  const subtotal = cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const discount = promoCode ? subtotal * 0.1 : 0;
  const deliveryCost = deliveryMethod === 'delivery' ? (subtotal > 10000 ? 0 : 500) : 0;
  const total = subtotal - discount + deliveryCost;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ru-RU').format(price) + ' ₽';
  };

  const steps: { id: Step; label: string }[] = [
    { id: 'contact', label: 'Контакты' },
    { id: 'delivery', label: 'Доставка' },
    { id: 'payment', label: 'Оплата' },
  ];

  const handleNext = () => {
    if (step === 'contact') setStep('delivery');
    else if (step === 'delivery') setStep('payment');
    else handleSubmit();
  };

  const handleSubmit = async () => {
    setIsProcessing(true);
    
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000));

    const orderId = `ORD-${Date.now()}`;
    
    addOrder({
      id: orderId,
      items: cart,
      status: 'pending',
      total,
      createdAt: new Date(),
      deliveryAddress: deliveryMethod === 'delivery' ? address : deliveryPoints.find(p => p.id === selectedPoint)?.address,
    });

    clearCart();
    setIsProcessing(false);
    onComplete(orderId);
  };

  const canProceed = () => {
    switch (step) {
      case 'contact':
        return phone.length >= 12 && name.length >= 2;
      case 'delivery':
        return deliveryMethod === 'delivery' ? address.length > 5 : selectedPoint !== null;
      case 'payment':
        return true;
      default:
        return false;
    }
  };

  return (
    <div className={cn(
      'min-h-screen pb-32',
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
        <div className="flex items-center gap-4 mb-4">
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
            Оформление заказа
          </h1>
        </div>

        {/* Progress steps */}
        <div className="flex items-center gap-2">
          {steps.map((s, i) => (
            <div key={s.id} className="flex items-center flex-1">
              <div
                className={cn(
                  'w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all',
                  step === s.id || steps.findIndex(st => st.id === step) > i
                    ? isNeon
                      ? 'bg-gradient-to-r from-cyan-500 to-purple-500 text-white'
                      : 'bg-blue-600 text-white'
                    : isNeon
                    ? 'bg-slate-800 text-slate-500'
                    : 'bg-slate-200 text-slate-500'
                )}
              >
                {steps.findIndex(st => st.id === step) > i ? <Check size={16} /> : i + 1}
              </div>
              {i < steps.length - 1 && (
                <div className={cn(
                  'flex-1 h-0.5 mx-2',
                  steps.findIndex(st => st.id === step) > i
                    ? isNeon ? 'bg-cyan-500' : 'bg-blue-600'
                    : isNeon ? 'bg-slate-700' : 'bg-slate-200'
                )} />
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="px-4 py-4">
        {/* Step: Contact */}
        {step === 'contact' && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-4"
          >
            <div className={cn(
              'rounded-xl p-4',
              isNeon
                ? 'bg-slate-800/50 border border-purple-500/20'
                : 'bg-white border border-slate-100 shadow-sm'
            )}>
              <h2 className={cn('font-semibold mb-4', isNeon ? 'text-white' : 'text-slate-900')}>
                Контактные данные
              </h2>
              
              <div className="space-y-4">
                <div>
                  <label className={cn('text-sm mb-1 block', isNeon ? 'text-slate-400' : 'text-slate-500')}>
                    Имя
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ваше имя"
                    className={cn(
                      'w-full px-4 py-3 rounded-xl text-sm outline-none transition-all',
                      isNeon
                        ? 'bg-slate-700 text-white placeholder:text-slate-500 border border-slate-600 focus:border-cyan-400'
                        : 'bg-slate-50 text-slate-900 placeholder:text-slate-400 border border-slate-200 focus:border-blue-500'
                    )}
                  />
                </div>
                
                <div>
                  <label className={cn('text-sm mb-1 block', isNeon ? 'text-slate-400' : 'text-slate-500')}>
                    Телефон
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+7 (999) 123-45-67"
                    className={cn(
                      'w-full px-4 py-3 rounded-xl text-sm outline-none transition-all',
                      isNeon
                        ? 'bg-slate-700 text-white placeholder:text-slate-500 border border-slate-600 focus:border-cyan-400'
                        : 'bg-slate-50 text-slate-900 placeholder:text-slate-400 border border-slate-200 focus:border-blue-500'
                    )}
                  />
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Step: Delivery */}
        {step === 'delivery' && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-4"
          >
            {/* Delivery method toggle */}
            <div className={cn(
              'rounded-xl p-1 flex gap-1',
              isNeon ? 'bg-slate-800' : 'bg-slate-100'
            )}>
              <button
                onClick={() => setDeliveryMethod('delivery')}
                className={cn(
                  'flex-1 py-3 rounded-lg font-medium text-sm flex items-center justify-center gap-2 transition-all',
                  deliveryMethod === 'delivery'
                    ? isNeon
                      ? 'bg-gradient-to-r from-cyan-500 to-purple-500 text-white'
                      : 'bg-white text-slate-900 shadow-sm'
                    : isNeon
                    ? 'text-slate-400'
                    : 'text-slate-500'
                )}
              >
                <Truck size={18} />
                Доставка
              </button>
              <button
                onClick={() => setDeliveryMethod('pickup')}
                className={cn(
                  'flex-1 py-3 rounded-lg font-medium text-sm flex items-center justify-center gap-2 transition-all',
                  deliveryMethod === 'pickup'
                    ? isNeon
                      ? 'bg-gradient-to-r from-cyan-500 to-purple-500 text-white'
                      : 'bg-white text-slate-900 shadow-sm'
                    : isNeon
                    ? 'text-slate-400'
                    : 'text-slate-500'
                )}
              >
                <MapPin size={18} />
                Самовывоз
              </button>
            </div>

            {deliveryMethod === 'delivery' ? (
              <div className={cn(
                'rounded-xl p-4',
                isNeon
                  ? 'bg-slate-800/50 border border-purple-500/20'
                  : 'bg-white border border-slate-100 shadow-sm'
              )}>
                <h2 className={cn('font-semibold mb-4', isNeon ? 'text-white' : 'text-slate-900')}>
                  Адрес доставки
                </h2>
                
                <textarea
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Город, улица, дом, квартира, подъезд, этаж..."
                  rows={3}
                  className={cn(
                    'w-full px-4 py-3 rounded-xl text-sm outline-none transition-all resize-none',
                    isNeon
                      ? 'bg-slate-700 text-white placeholder:text-slate-500 border border-slate-600 focus:border-cyan-400'
                      : 'bg-slate-50 text-slate-900 placeholder:text-slate-400 border border-slate-200 focus:border-blue-500'
                  )}
                />

                <div className={cn(
                  'mt-4 p-3 rounded-lg flex items-center gap-3',
                  isNeon ? 'bg-cyan-500/10 border border-cyan-500/20' : 'bg-blue-50 border border-blue-100'
                )}>
                  <Clock size={18} className={isNeon ? 'text-cyan-400' : 'text-blue-600'} />
                  <div>
                    <p className={cn('font-medium text-sm', isNeon ? 'text-white' : 'text-slate-900')}>
                      Доставка завтра с 10:00 до 22:00
                    </p>
                    <p className={cn('text-xs', isNeon ? 'text-slate-400' : 'text-slate-500')}>
                      {deliveryCost === 0 ? 'Бесплатно' : formatPrice(deliveryCost)}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className={cn(
                'rounded-xl overflow-hidden',
                isNeon
                  ? 'bg-slate-800/50 border border-purple-500/20'
                  : 'bg-white border border-slate-100 shadow-sm'
              )}>
                <h2 className={cn('font-semibold p-4 pb-2', isNeon ? 'text-white' : 'text-slate-900')}>
                  Выберите пункт выдачи
                </h2>
                
                {deliveryPoints.map((point) => (
                  <button
                    key={point.id}
                    onClick={() => setSelectedPoint(point.id)}
                    className={cn(
                      'w-full p-4 flex items-start gap-3 border-t transition-colors',
                      isNeon ? 'border-slate-700' : 'border-slate-100',
                      selectedPoint === point.id
                        ? isNeon
                          ? 'bg-cyan-500/10'
                          : 'bg-blue-50'
                        : ''
                    )}
                  >
                    <div className={cn(
                      'w-5 h-5 rounded-full border-2 flex items-center justify-center mt-0.5',
                      selectedPoint === point.id
                        ? isNeon
                          ? 'border-cyan-400'
                          : 'border-blue-600'
                        : isNeon
                        ? 'border-slate-600'
                        : 'border-slate-300'
                    )}>
                      {selectedPoint === point.id && (
                        <div className={cn(
                          'w-2.5 h-2.5 rounded-full',
                          isNeon ? 'bg-cyan-400' : 'bg-blue-600'
                        )} />
                      )}
                    </div>
                    <div className="flex-1 text-left">
                      <div className="flex items-center gap-2">
                        <Building2 size={14} className={isNeon ? 'text-slate-400' : 'text-slate-500'} />
                        <span className={cn('font-medium', isNeon ? 'text-white' : 'text-slate-900')}>
                          {point.name}
                        </span>
                      </div>
                      <p className={cn('text-sm mt-1', isNeon ? 'text-slate-400' : 'text-slate-500')}>
                        {point.address}
                      </p>
                      <p className={cn('text-xs mt-1', isNeon ? 'text-slate-500' : 'text-slate-400')}>
                        {point.workHours} • {point.hasStock ? 'Есть в наличии' : 'Под заказ'}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </motion.div>
        )}

        {/* Step: Payment */}
        {step === 'payment' && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-4"
          >
            <div className={cn(
              'rounded-xl overflow-hidden',
              isNeon
                ? 'bg-slate-800/50 border border-purple-500/20'
                : 'bg-white border border-slate-100 shadow-sm'
            )}>
              <h2 className={cn('font-semibold p-4 pb-2', isNeon ? 'text-white' : 'text-slate-900')}>
                Способ оплаты
              </h2>
              
              {([
                { id: 'sbp' as PaymentMethod, icon: Smartphone, label: 'СБП', desc: '+7% бонусов' },
                { id: 'card' as PaymentMethod, icon: CreditCard, label: 'Банковская карта', desc: 'Visa, Mastercard, МИР' },
              ]).map((method) => (
                <button
                  key={method.id}
                  onClick={() => setPaymentMethod(method.id)}
                  className={cn(
                    'w-full p-4 flex items-center gap-3 border-t transition-colors',
                    isNeon ? 'border-slate-700' : 'border-slate-100',
                    paymentMethod === method.id
                      ? isNeon
                        ? 'bg-cyan-500/10'
                        : 'bg-blue-50'
                      : ''
                  )}
                >
                  <div className={cn(
                    'w-10 h-10 rounded-xl flex items-center justify-center',
                    paymentMethod === method.id
                      ? isNeon
                        ? 'bg-cyan-500/20 text-cyan-400'
                        : 'bg-blue-100 text-blue-600'
                      : isNeon
                      ? 'bg-slate-700 text-slate-400'
                      : 'bg-slate-100 text-slate-500'
                  )}>
                    <method.icon size={20} />
                  </div>
                  <div className="flex-1 text-left">
                    <p className={cn('font-medium', isNeon ? 'text-white' : 'text-slate-900')}>
                      {method.label}
                    </p>
                    <p className={cn('text-sm', isNeon ? 'text-slate-400' : 'text-slate-500')}>
                      {method.desc}
                    </p>
                  </div>
                  <div className={cn(
                    'w-5 h-5 rounded-full border-2 flex items-center justify-center',
                    paymentMethod === method.id
                      ? isNeon
                        ? 'border-cyan-400'
                        : 'border-blue-600'
                      : isNeon
                      ? 'border-slate-600'
                      : 'border-slate-300'
                  )}>
                    {paymentMethod === method.id && (
                      <div className={cn(
                        'w-2.5 h-2.5 rounded-full',
                        isNeon ? 'bg-cyan-400' : 'bg-blue-600'
                      )} />
                    )}
                  </div>
                </button>
              ))}
            </div>

            {/* Order summary */}
            <div className={cn(
              'rounded-xl p-4',
              isNeon
                ? 'bg-slate-800/50 border border-purple-500/20'
                : 'bg-white border border-slate-100 shadow-sm'
            )}>
              <h2 className={cn('font-semibold mb-4', isNeon ? 'text-white' : 'text-slate-900')}>
                Ваш заказ
              </h2>
              
              <div className="space-y-2 mb-4">
                {cart.map((item) => (
                  <div key={item.product.id} className="flex justify-between text-sm">
                    <span className={isNeon ? 'text-slate-300' : 'text-slate-600'}>
                      {item.product.name} × {item.quantity}
                    </span>
                    <span className={isNeon ? 'text-white' : 'text-slate-900'}>
                      {formatPrice(item.product.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              <div className={cn('border-t pt-3 space-y-2', isNeon ? 'border-slate-700' : 'border-slate-100')}>
                <div className="flex justify-between text-sm">
                  <span className={isNeon ? 'text-slate-400' : 'text-slate-500'}>Товары</span>
                  <span className={isNeon ? 'text-white' : 'text-slate-900'}>{formatPrice(subtotal)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className={isNeon ? 'text-green-400' : 'text-green-600'}>Скидка</span>
                    <span className={isNeon ? 'text-green-400' : 'text-green-600'}>-{formatPrice(discount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <span className={isNeon ? 'text-slate-400' : 'text-slate-500'}>Доставка</span>
                  <span className={isNeon ? 'text-white' : 'text-slate-900'}>
                    {deliveryCost === 0 ? 'Бесплатно' : formatPrice(deliveryCost)}
                  </span>
                </div>
                <div className={cn('flex justify-between pt-2 border-t', isNeon ? 'border-slate-700' : 'border-slate-100')}>
                  <span className={cn('font-semibold', isNeon ? 'text-white' : 'text-slate-900')}>Итого</span>
                  <span className={cn('font-bold text-lg', isNeon ? 'text-white' : 'text-slate-900')}>
                    {formatPrice(total)}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Fixed bottom CTA */}
      <div className={cn(
        'fixed bottom-16 left-0 right-0 px-4 py-4 z-30',
        isNeon
          ? 'bg-slate-900/95 backdrop-blur-xl border-t border-purple-500/30'
          : 'bg-white/95 backdrop-blur-xl border-t border-slate-200'
      )}>
        <motion.button
          onClick={handleNext}
          disabled={!canProceed() || isProcessing}
          className={cn(
            'w-full py-4 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all',
            !canProceed() && 'opacity-50 cursor-not-allowed',
            isNeon
              ? 'bg-gradient-to-r from-cyan-500 to-purple-500 text-white shadow-[0_0_30px_rgba(6,182,212,0.4)]'
              : 'bg-blue-600 text-white'
          )}
          whileTap={{ scale: 0.95 }}
        >
          {isProcessing ? (
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : step === 'payment' ? (
            <>
              Оплатить {formatPrice(total)}
            </>
          ) : (
            <>
              Продолжить
              <ChevronRight size={20} />
            </>
          )}
        </motion.button>
      </div>
    </div>
  );
}
