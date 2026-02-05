import { useState, useRef, useEffect } from 'react';
import { ChevronLeft, Send, Bot, Clock, Check, CheckCheck, Image } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '../store';
import { Product } from '../types';
import { cn } from '../utils/cn';

interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'support';
  timestamp: Date;
  status?: 'sent' | 'delivered' | 'read';
  productContext?: Product;
}

interface ChatScreenProps {
  onBack: () => void;
  productContext?: Product | null;
}

export function ChatScreen({ onBack, productContext }: ChatScreenProps) {
  const theme = useStore((s) => s.theme);
  const isNeon = theme === 'neon';

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      text: 'Здравствуйте! 👋 Чем могу помочь?',
      sender: 'support',
      timestamp: new Date(Date.now() - 60000),
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Add product context message if provided
  useEffect(() => {
    if (productContext) {
      const contextMsg: ChatMessage = {
        id: 'product-context',
        text: `Интересует товар: ${productContext.name}`,
        sender: 'user',
        timestamp: new Date(Date.now() - 30000),
        productContext,
      };
      setMessages(prev => {
        if (!prev.find(m => m.id === 'product-context')) {
          return [...prev, contextMsg];
        }
        return prev;
      });
    }
  }, [productContext]);

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
  };

  const handleSend = () => {
    if (!input.trim()) return;

    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      text: input.trim(),
      sender: 'user',
      timestamp: new Date(),
      status: 'sent',
    };

    setMessages(prev => [...prev, newMessage]);
    setInput('');

    // Simulate typing
    setIsTyping(true);

    // Update status to delivered
    setTimeout(() => {
      setMessages(prev => prev.map(m => 
        m.id === newMessage.id ? { ...m, status: 'delivered' } : m
      ));
    }, 500);

    // Update status to read
    setTimeout(() => {
      setMessages(prev => prev.map(m => 
        m.id === newMessage.id ? { ...m, status: 'read' } : m
      ));
    }, 1000);

    // Simulate response
    setTimeout(() => {
      setIsTyping(false);
      
      const responses = [
        'Спасибо за ваш вопрос! Уточняю информацию...',
        'Да, этот товар есть в наличии. Могу помочь с оформлением?',
        'Отличный выбор! Доставка возможна уже завтра.',
        'Конечно! Подскажу всё, что вас интересует.',
        'Этот товар очень популярен среди наших покупателей!',
      ];
      
      const response: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: responses[Math.floor(Math.random() * responses.length)],
        sender: 'support',
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, response]);
    }, 2000);
  };

  const quickReplies = [
    'Есть ли в наличии?',
    'Когда доставка?',
    'Есть рассрочка?',
    'Можно забрать сегодня?',
  ];

  const handleQuickReply = (text: string) => {
    setInput(text);
  };

  return (
    <div className={cn(
      'min-h-screen flex flex-col',
      isNeon
        ? 'bg-gradient-to-b from-slate-900 via-slate-900 to-purple-900/50'
        : 'bg-slate-50'
    )}>
      {/* Header */}
      <div className={cn(
        'sticky top-0 z-30 px-4 py-4 flex items-center gap-4',
        isNeon
          ? 'bg-slate-900/95 backdrop-blur-xl border-b border-purple-500/30'
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
        
        <div className="flex items-center gap-3 flex-1">
          <div className={cn(
            'w-10 h-10 rounded-full flex items-center justify-center',
            isNeon
              ? 'bg-gradient-to-br from-cyan-500 to-purple-500'
              : 'bg-gradient-to-br from-blue-500 to-indigo-600'
          )}>
            <Bot size={20} className="text-white" />
          </div>
          <div>
            <h1 className={cn(
              'font-semibold',
              isNeon ? 'text-white' : 'text-slate-900'
            )}>
              Поддержка TechZone
            </h1>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-green-500" />
              <span className={cn(
                'text-xs',
                isNeon ? 'text-slate-400' : 'text-slate-500'
              )}>
                Онлайн • отвечаем за 5 мин
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {messages.map((message) => (
          <motion.div
            key={message.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn(
              'flex',
              message.sender === 'user' ? 'justify-end' : 'justify-start'
            )}
          >
            <div className={cn(
              'max-w-[80%] rounded-2xl px-4 py-3',
              message.sender === 'user'
                ? isNeon
                  ? 'bg-gradient-to-r from-cyan-500 to-purple-500 text-white'
                  : 'bg-blue-600 text-white'
                : isNeon
                ? 'bg-slate-800 text-white border border-purple-500/20'
                : 'bg-white text-slate-900 border border-slate-100 shadow-sm'
            )}>
              {/* Product context card */}
              {message.productContext && (
                <div className={cn(
                  'flex items-center gap-2 p-2 rounded-lg mb-2',
                  isNeon ? 'bg-white/10' : 'bg-slate-100'
                )}>
                  <img 
                    src={message.productContext.images[0]} 
                    alt="" 
                    className="w-10 h-10 rounded-lg object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium truncate">
                      {message.productContext.name}
                    </p>
                    <p className={cn(
                      'text-xs',
                      isNeon ? 'text-white/60' : 'text-slate-500'
                    )}>
                      ID: {message.productContext.id}
                    </p>
                  </div>
                </div>
              )}
              
              <p className="text-sm whitespace-pre-wrap">{message.text}</p>
              
              <div className={cn(
                'flex items-center justify-end gap-1 mt-1',
                message.sender === 'user' ? 'text-white/60' : isNeon ? 'text-slate-500' : 'text-slate-400'
              )}>
                <span className="text-[10px]">{formatTime(message.timestamp)}</span>
                {message.sender === 'user' && message.status && (
                  message.status === 'read' 
                    ? <CheckCheck size={12} className="text-cyan-300" />
                    : message.status === 'delivered'
                    ? <CheckCheck size={12} />
                    : <Check size={12} />
                )}
              </div>
            </div>
          </motion.div>
        ))}

        {/* Typing indicator */}
        <AnimatePresence>
          {isTyping && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="flex justify-start"
            >
              <div className={cn(
                'rounded-2xl px-4 py-3',
                isNeon
                  ? 'bg-slate-800 border border-purple-500/20'
                  : 'bg-white border border-slate-100 shadow-sm'
              )}>
                <div className="flex items-center gap-1">
                  <motion.div
                    className={cn('w-2 h-2 rounded-full', isNeon ? 'bg-cyan-400' : 'bg-blue-500')}
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 0.6, repeat: Infinity }}
                  />
                  <motion.div
                    className={cn('w-2 h-2 rounded-full', isNeon ? 'bg-cyan-400' : 'bg-blue-500')}
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
                  />
                  <motion.div
                    className={cn('w-2 h-2 rounded-full', isNeon ? 'bg-cyan-400' : 'bg-blue-500')}
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }}
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div ref={messagesEndRef} />
      </div>

      {/* Quick replies */}
      {messages.length < 4 && (
        <div className="px-4 pb-2">
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {quickReplies.map((reply, i) => (
              <button
                key={i}
                onClick={() => handleQuickReply(reply)}
                className={cn(
                  'px-3 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all',
                  isNeon
                    ? 'bg-slate-800 text-cyan-400 border border-cyan-500/30 hover:bg-slate-700'
                    : 'bg-white text-blue-600 border border-blue-200 hover:bg-blue-50'
                )}
              >
                {reply}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <div className={cn(
        'sticky bottom-0 px-4 py-4',
        isNeon
          ? 'bg-slate-900/95 backdrop-blur-xl border-t border-purple-500/30'
          : 'bg-white/95 backdrop-blur-xl border-t border-slate-200'
      )}>
        <div className="flex items-center gap-2">
          <button className={cn(
            'p-3 rounded-xl transition-colors',
            isNeon ? 'bg-slate-800 text-slate-400' : 'bg-slate-100 text-slate-500'
          )}>
            <Image size={20} />
          </button>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Введите сообщение..."
            className={cn(
              'flex-1 px-4 py-3 rounded-xl text-sm outline-none transition-all',
              isNeon
                ? 'bg-slate-800 text-white placeholder:text-slate-500 border border-slate-700 focus:border-cyan-400'
                : 'bg-slate-100 text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500'
            )}
          />
          <motion.button
            onClick={handleSend}
            disabled={!input.trim()}
            className={cn(
              'p-3 rounded-xl transition-all',
              input.trim()
                ? isNeon
                  ? 'bg-gradient-to-r from-cyan-500 to-purple-500 text-white shadow-[0_0_20px_rgba(6,182,212,0.4)]'
                  : 'bg-blue-600 text-white'
                : isNeon
                ? 'bg-slate-800 text-slate-600'
                : 'bg-slate-100 text-slate-400'
            )}
            whileTap={{ scale: 0.95 }}
          >
            <Send size={20} />
          </motion.button>
        </div>

        {/* Response time hint */}
        <div className="flex items-center justify-center gap-1 mt-2">
          <Clock size={12} className={isNeon ? 'text-slate-600' : 'text-slate-400'} />
          <span className={cn('text-xs', isNeon ? 'text-slate-600' : 'text-slate-400')}>
            Обычно отвечаем за 5 минут
          </span>
        </div>
      </div>
    </div>
  );
}
