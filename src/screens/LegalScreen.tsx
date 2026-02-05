import { useState } from 'react';
import { ChevronLeft, ChevronRight, Building2, FileText, Shield, Truck, CreditCard, RotateCcw, Phone, Mail, MapPin } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '../store';
import { cn } from '../utils/cn';

interface LegalScreenProps {
  onBack: () => void;
}

type LegalSection = 'main' | 'company' | 'offer' | 'privacy' | 'delivery' | 'payment' | 'returns';

export function LegalScreen({ onBack }: LegalScreenProps) {
  const theme = useStore((s) => s.theme);
  const isNeon = theme === 'neon';
  const [activeSection, setActiveSection] = useState<LegalSection>('main');

  const sections = [
    { id: 'company' as const, icon: Building2, title: 'О компании', subtitle: 'Реквизиты и контакты' },
    { id: 'offer' as const, icon: FileText, title: 'Публичная оферта', subtitle: 'Правила продажи' },
    { id: 'privacy' as const, icon: Shield, title: 'Политика конфиденциальности', subtitle: 'Обработка персональных данных' },
    { id: 'delivery' as const, icon: Truck, title: 'Доставка и самовывоз', subtitle: 'Сроки и условия' },
    { id: 'payment' as const, icon: CreditCard, title: 'Способы оплаты', subtitle: 'СБП, карты, рассрочка' },
    { id: 'returns' as const, icon: RotateCcw, title: 'Возврат и гарантия', subtitle: 'Условия возврата товара' },
  ];

  const renderMainMenu = () => (
    <div className="px-4 py-4 space-y-2">
      {sections.map((section) => (
        <motion.button
          key={section.id}
          onClick={() => setActiveSection(section.id)}
          className={cn(
            'w-full flex items-center gap-4 p-4 rounded-xl transition-all',
            isNeon
              ? 'bg-slate-800/50 border border-purple-500/20 hover:border-cyan-500/40'
              : 'bg-white border border-slate-100 shadow-sm hover:shadow-md'
          )}
          whileTap={{ scale: 0.98 }}
        >
          <div className={cn(
            'w-12 h-12 rounded-xl flex items-center justify-center',
            isNeon ? 'bg-cyan-500/20 text-cyan-400' : 'bg-blue-100 text-blue-600'
          )}>
            <section.icon size={24} />
          </div>
          <div className="flex-1 text-left">
            <h3 className={cn('font-semibold', isNeon ? 'text-white' : 'text-slate-900')}>
              {section.title}
            </h3>
            <p className={cn('text-sm', isNeon ? 'text-slate-400' : 'text-slate-500')}>
              {section.subtitle}
            </p>
          </div>
          <ChevronRight size={20} className={isNeon ? 'text-slate-500' : 'text-slate-400'} />
        </motion.button>
      ))}
    </div>
  );

  const renderCompanyInfo = () => (
    <div className="px-4 py-4 space-y-4">
      {/* Placeholder badge */}
      <div className={cn(
        'rounded-xl p-3 flex items-center gap-2 text-sm',
        isNeon
          ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
          : 'bg-yellow-100 text-yellow-700 border border-yellow-200'
      )}>
        <span>ℹ️</span>
        <span>Заполнится реквизитами продавца</span>
      </div>

      <div className={cn(
        'rounded-xl p-4',
        isNeon ? 'bg-slate-800/50 border border-purple-500/20' : 'bg-white border border-slate-100 shadow-sm'
      )}>
        <h3 className={cn('font-semibold mb-4', isNeon ? 'text-white' : 'text-slate-900')}>
          Реквизиты компании
        </h3>
        <div className="space-y-3">
          {[
            { label: 'Наименование', value: 'ООО «ТехЗона»' },
            { label: 'ИНН', value: '7743012345' },
            { label: 'ОГРН', value: '1177746012345' },
            { label: 'КПП', value: '774301001' },
            { label: 'Юридический адрес', value: '123456, г. Москва, ул. Примерная, д. 1, офис 100' },
          ].map((item, i) => (
            <div key={i} className={cn(
              'flex justify-between py-2',
              i < 4 && (isNeon ? 'border-b border-slate-700' : 'border-b border-slate-100')
            )}>
              <span className={isNeon ? 'text-slate-400' : 'text-slate-500'}>{item.label}</span>
              <span className={cn('font-medium text-right', isNeon ? 'text-white' : 'text-slate-900')}>
                {item.value}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className={cn(
        'rounded-xl p-4',
        isNeon ? 'bg-slate-800/50 border border-purple-500/20' : 'bg-white border border-slate-100 shadow-sm'
      )}>
        <h3 className={cn('font-semibold mb-4', isNeon ? 'text-white' : 'text-slate-900')}>
          Контакты
        </h3>
        <div className="space-y-4">
          <a href="tel:+74951234567" className="flex items-center gap-3">
            <div className={cn(
              'w-10 h-10 rounded-lg flex items-center justify-center',
              isNeon ? 'bg-green-500/20 text-green-400' : 'bg-green-100 text-green-600'
            )}>
              <Phone size={18} />
            </div>
            <div>
              <p className={cn('font-medium', isNeon ? 'text-white' : 'text-slate-900')}>
                +7 (495) 123-45-67
              </p>
              <p className={cn('text-sm', isNeon ? 'text-slate-400' : 'text-slate-500')}>
                Ежедневно с 9:00 до 21:00
              </p>
            </div>
          </a>
          <a href="mailto:info@techzone.ru" className="flex items-center gap-3">
            <div className={cn(
              'w-10 h-10 rounded-lg flex items-center justify-center',
              isNeon ? 'bg-blue-500/20 text-blue-400' : 'bg-blue-100 text-blue-600'
            )}>
              <Mail size={18} />
            </div>
            <div>
              <p className={cn('font-medium', isNeon ? 'text-white' : 'text-slate-900')}>
                info@techzone.ru
              </p>
              <p className={cn('text-sm', isNeon ? 'text-slate-400' : 'text-slate-500')}>
                Ответим в течение часа
              </p>
            </div>
          </a>
          <div className="flex items-center gap-3">
            <div className={cn(
              'w-10 h-10 rounded-lg flex items-center justify-center',
              isNeon ? 'bg-purple-500/20 text-purple-400' : 'bg-purple-100 text-purple-600'
            )}>
              <MapPin size={18} />
            </div>
            <div>
              <p className={cn('font-medium', isNeon ? 'text-white' : 'text-slate-900')}>
                Москва, ТЦ Авиапарк
              </p>
              <p className={cn('text-sm', isNeon ? 'text-slate-400' : 'text-slate-500')}>
                Ходынский бульвар, 4
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderOffer = () => (
    <div className="px-4 py-4">
      <div className={cn(
        'rounded-xl p-4',
        isNeon ? 'bg-slate-800/50 border border-purple-500/20' : 'bg-white border border-slate-100 shadow-sm'
      )}>
        <h3 className={cn('font-semibold mb-4', isNeon ? 'text-white' : 'text-slate-900')}>
          Публичная оферта
        </h3>
        <div className={cn('text-sm space-y-4', isNeon ? 'text-slate-300' : 'text-slate-600')}>
          <p>
            Настоящий документ является официальным предложением (публичной офертой) ООО «ТехЗона» 
            (далее — Продавец) и содержит все существенные условия продажи товаров дистанционным способом.
          </p>
          <p>
            В соответствии со статьёй 437 Гражданского кодекса РФ данный документ является публичной офертой, 
            и в случае принятия изложенных условий лицо, совершающее заказ, обязуется оплатить товар на условиях, 
            изложенных в настоящей оферте.
          </p>
          <h4 className={cn('font-semibold pt-2', isNeon ? 'text-white' : 'text-slate-900')}>
            1. Общие положения
          </h4>
          <p>
            1.1. Продавец осуществляет продажу товаров в соответствии с Законом РФ «О защите прав потребителей», 
            Постановлением Правительства РФ № 2463 от 31.12.2020 «Об утверждении Правил продажи товаров по договору 
            розничной купли-продажи».
          </p>
          <p>
            1.2. Покупатель подтверждает согласие с условиями оферты путём оформления заказа.
          </p>
          <h4 className={cn('font-semibold pt-2', isNeon ? 'text-white' : 'text-slate-900')}>
            2. Предмет договора
          </h4>
          <p>
            2.1. Продавец обязуется передать Покупателю товар, а Покупатель обязуется оплатить и принять товар 
            на условиях настоящей оферты.
          </p>
          <p className={cn('text-xs pt-4', isNeon ? 'text-slate-500' : 'text-slate-400')}>
            Полная версия документа: techzone.ru/legal/offer
          </p>
        </div>
      </div>
    </div>
  );

  const renderPrivacy = () => (
    <div className="px-4 py-4">
      <div className={cn(
        'rounded-xl p-4',
        isNeon ? 'bg-slate-800/50 border border-purple-500/20' : 'bg-white border border-slate-100 shadow-sm'
      )}>
        <h3 className={cn('font-semibold mb-4', isNeon ? 'text-white' : 'text-slate-900')}>
          Политика обработки персональных данных
        </h3>
        <div className={cn('text-sm space-y-4', isNeon ? 'text-slate-300' : 'text-slate-600')}>
          <p>
            Настоящая Политика разработана в соответствии с Федеральным законом от 27.07.2006 № 152-ФЗ 
            «О персональных данных».
          </p>
          <h4 className={cn('font-semibold pt-2', isNeon ? 'text-white' : 'text-slate-900')}>
            Какие данные мы собираем
          </h4>
          <ul className="list-disc pl-5 space-y-1">
            <li>Имя и фамилия</li>
            <li>Номер телефона</li>
            <li>Адрес электронной почты</li>
            <li>Адрес доставки</li>
            <li>Идентификатор Telegram</li>
          </ul>
          <h4 className={cn('font-semibold pt-2', isNeon ? 'text-white' : 'text-slate-900')}>
            Цели обработки
          </h4>
          <ul className="list-disc pl-5 space-y-1">
            <li>Оформление и доставка заказов</li>
            <li>Информирование о статусе заказа</li>
            <li>Программа лояльности</li>
            <li>Улучшение качества сервиса</li>
          </ul>
          <h4 className={cn('font-semibold pt-2', isNeon ? 'text-white' : 'text-slate-900')}>
            Хранение данных
          </h4>
          <p>
            Персональные данные хранятся на серверах, расположенных на территории Российской Федерации, 
            в соответствии с требованиями законодательства (локализация данных с 01.07.2025).
          </p>
          <div className={cn(
            'mt-4 p-3 rounded-lg',
            isNeon ? 'bg-cyan-500/10 border border-cyan-500/20' : 'bg-blue-50 border border-blue-100'
          )}>
            <p className={cn('text-xs', isNeon ? 'text-cyan-400' : 'text-blue-600')}>
              Вы можете запросить удаление ваших данных, написав на privacy@techzone.ru
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderDelivery = () => (
    <div className="px-4 py-4 space-y-4">
      <div className={cn(
        'rounded-xl p-4',
        isNeon ? 'bg-slate-800/50 border border-purple-500/20' : 'bg-white border border-slate-100 shadow-sm'
      )}>
        <h3 className={cn('font-semibold mb-4', isNeon ? 'text-white' : 'text-slate-900')}>
          🚚 Курьерская доставка
        </h3>
        <div className={cn('text-sm space-y-3', isNeon ? 'text-slate-300' : 'text-slate-600')}>
          <div className="flex justify-between">
            <span>По Москве</span>
            <span className={cn('font-medium', isNeon ? 'text-white' : 'text-slate-900')}>от 0 ₽</span>
          </div>
          <div className="flex justify-between">
            <span>По МО</span>
            <span className={cn('font-medium', isNeon ? 'text-white' : 'text-slate-900')}>от 300 ₽</span>
          </div>
          <div className="flex justify-between">
            <span>По России (СДЭК, DPD)</span>
            <span className={cn('font-medium', isNeon ? 'text-white' : 'text-slate-900')}>от 350 ₽</span>
          </div>
          <p className={cn('pt-2', isNeon ? 'text-slate-400' : 'text-slate-500')}>
            Бесплатная доставка при заказе от 10 000 ₽
          </p>
        </div>
      </div>

      <div className={cn(
        'rounded-xl p-4',
        isNeon ? 'bg-slate-800/50 border border-purple-500/20' : 'bg-white border border-slate-100 shadow-sm'
      )}>
        <h3 className={cn('font-semibold mb-4', isNeon ? 'text-white' : 'text-slate-900')}>
          📍 Самовывоз
        </h3>
        <div className={cn('text-sm space-y-3', isNeon ? 'text-slate-300' : 'text-slate-600')}>
          <p>Бесплатно из наших точек выдачи:</p>
          <ul className="space-y-2">
            <li>• ТЦ Авиапарк — Ходынский бульвар, 4</li>
            <li>• ТЦ Метрополис — Ленинградское ш., 16А</li>
            <li>• ТЦ Европолис — пр. Мира, 211</li>
          </ul>
          <p className={cn('pt-2', isNeon ? 'text-slate-400' : 'text-slate-500')}>
            Время работы: ежедневно с 10:00 до 22:00
          </p>
        </div>
      </div>
    </div>
  );

  const renderPayment = () => (
    <div className="px-4 py-4 space-y-4">
      <div className={cn(
        'rounded-xl p-4',
        isNeon
          ? 'bg-gradient-to-r from-cyan-500/10 to-purple-500/10 border border-cyan-500/20'
          : 'bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100'
      )}>
        <div className="flex items-center gap-3 mb-2">
          <span className="text-2xl">⚡</span>
          <h3 className={cn('font-semibold', isNeon ? 'text-white' : 'text-slate-900')}>
            СБП — Система быстрых платежей
          </h3>
        </div>
        <p className={cn('text-sm', isNeon ? 'text-slate-300' : 'text-slate-600')}>
          Мгновенная оплата через мобильный банк. Дополнительно +7% бонусов за оплату СБП!
        </p>
      </div>

      {[
        { icon: '💳', title: 'Банковская карта', desc: 'Visa, Mastercard, МИР, UnionPay' },
        { icon: '📱', title: 'Онлайн-кошельки', desc: 'ЮMoney, QIWI' },
        { icon: '🏦', title: 'Рассрочка', desc: 'От банков-партнёров на 3-24 месяца' },
        { icon: '📄', title: 'Безналичный расчёт', desc: 'Для юридических лиц' },
      ].map((method, i) => (
        <div 
          key={i}
          className={cn(
            'rounded-xl p-4 flex items-center gap-4',
            isNeon ? 'bg-slate-800/50 border border-purple-500/20' : 'bg-white border border-slate-100 shadow-sm'
          )}
        >
          <span className="text-2xl">{method.icon}</span>
          <div>
            <h4 className={cn('font-medium', isNeon ? 'text-white' : 'text-slate-900')}>
              {method.title}
            </h4>
            <p className={cn('text-sm', isNeon ? 'text-slate-400' : 'text-slate-500')}>
              {method.desc}
            </p>
          </div>
        </div>
      ))}

      <div className={cn(
        'rounded-xl p-4',
        isNeon ? 'bg-slate-800/50 border border-purple-500/20' : 'bg-white border border-slate-100 shadow-sm'
      )}>
        <h4 className={cn('font-medium mb-2', isNeon ? 'text-white' : 'text-slate-900')}>
          🧾 Фискальные чеки
        </h4>
        <p className={cn('text-sm', isNeon ? 'text-slate-300' : 'text-slate-600')}>
          Мы работаем по 54-ФЗ. После оплаты вы получите электронный чек на email и в Telegram.
        </p>
      </div>
    </div>
  );

  const renderReturns = () => (
    <div className="px-4 py-4 space-y-4">
      <div className={cn(
        'rounded-xl p-4',
        isNeon ? 'bg-slate-800/50 border border-purple-500/20' : 'bg-white border border-slate-100 shadow-sm'
      )}>
        <h3 className={cn('font-semibold mb-4', isNeon ? 'text-white' : 'text-slate-900')}>
          🔄 Возврат товара
        </h3>
        <div className={cn('text-sm space-y-3', isNeon ? 'text-slate-300' : 'text-slate-600')}>
          <p>
            Вы можете вернуть товар надлежащего качества в течение <strong>14 дней</strong> с момента покупки 
            (ст. 26.1 Закона о защите прав потребителей).
          </p>
          <h4 className={cn('font-medium pt-2', isNeon ? 'text-white' : 'text-slate-900')}>
            Условия возврата:
          </h4>
          <ul className="list-disc pl-5 space-y-1">
            <li>Сохранён товарный вид и потребительские свойства</li>
            <li>Сохранена упаковка и документы</li>
            <li>Товар не был в употреблении</li>
          </ul>
        </div>
      </div>

      <div className={cn(
        'rounded-xl p-4',
        isNeon ? 'bg-slate-800/50 border border-purple-500/20' : 'bg-white border border-slate-100 shadow-sm'
      )}>
        <h3 className={cn('font-semibold mb-4', isNeon ? 'text-white' : 'text-slate-900')}>
          🛡️ Гарантия
        </h3>
        <div className={cn('text-sm space-y-3', isNeon ? 'text-slate-300' : 'text-slate-600')}>
          <p>
            На всю технику действует официальная гарантия производителя от 1 до 3 лет.
          </p>
          <p>
            Гарантийный ремонт осуществляется в авторизованных сервисных центрах.
          </p>
          <div className={cn(
            'mt-4 p-3 rounded-lg',
            isNeon ? 'bg-green-500/10 border border-green-500/20' : 'bg-green-50 border border-green-100'
          )}>
            <p className={cn('text-sm font-medium', isNeon ? 'text-green-400' : 'text-green-700')}>
              💡 Сохраняйте чек и гарантийный талон!
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeSection) {
      case 'company': return renderCompanyInfo();
      case 'offer': return renderOffer();
      case 'privacy': return renderPrivacy();
      case 'delivery': return renderDelivery();
      case 'payment': return renderPayment();
      case 'returns': return renderReturns();
      default: return renderMainMenu();
    }
  };

  const getTitle = () => {
    const section = sections.find(s => s.id === activeSection);
    return section ? section.title : 'О магазине';
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
          onClick={() => activeSection === 'main' ? onBack() : setActiveSection('main')}
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
          {getTitle()}
        </h1>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeSection}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.2 }}
        >
          {renderContent()}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
