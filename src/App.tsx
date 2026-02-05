import { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { useStore } from './store';
import { products } from './data/products';
import { Product } from './types';
import { cn } from './utils/cn';

// Components
import { Splash } from './components/Splash';
import { BottomNav } from './components/BottomNav';

// Screens
import { HomeScreen } from './screens/HomeScreen';
import { SearchScreen } from './screens/SearchScreen';
import { CartScreen } from './screens/CartScreen';
import { FavoritesScreen } from './screens/FavoritesScreen';
import { ProfileScreen } from './screens/ProfileScreen';
import { ProductDetailScreen } from './screens/ProductDetailScreen';
import { CheckoutScreen } from './screens/CheckoutScreen';
import { OrderStatusScreen } from './screens/OrderStatusScreen';
import { CompareScreen } from './screens/CompareScreen';
import { LegalScreen } from './screens/LegalScreen';
import { ChatScreen } from './screens/ChatScreen';

type Tab = 'home' | 'cart' | 'favorites' | 'profile';
type Screen = 'splash' | 'main' | 'product' | 'checkout' | 'orderStatus' | 'compare' | 'legal' | 'chat' | 'search';

declare global {
  interface Window {
    Telegram?: {
      WebApp?: {
        ready: () => void;
        expand: () => void;
        initDataUnsafe?: {
          user?: {
            id: number;
            first_name: string;
            last_name?: string;
            username?: string;
            language_code?: string;
            photo_url?: string;
          };
        };
        themeParams?: {
          bg_color?: string;
          text_color?: string;
          hint_color?: string;
          link_color?: string;
          button_color?: string;
          button_text_color?: string;
        };
        colorScheme?: 'light' | 'dark';
      };
    };
  }
}

export function App() {
  const theme = useStore((s) => s.theme);
  const setUser = useStore((s) => s.setUser);
  const compareList = useStore((s) => s.compareList);
  const orders = useStore((s) => s.orders);
  const isNeon = theme === 'neon';

  const [showSplash, setShowSplash] = useState(true);
  const [currentScreen, setCurrentScreen] = useState<Screen>('splash');
  const [activeTab, setActiveTab] = useState<Tab>('home');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [completedOrderId, setCompletedOrderId] = useState<string | null>(null);
  const [chatProductContext, setChatProductContext] = useState<Product | null>(null);

  // Check for active orders
  const activeOrders = orders.filter(o => o.status !== 'delivered');
  const hasActiveOrder = activeOrders.length > 0;

  // Initialize Telegram WebApp
  useEffect(() => {
    const tg = window.Telegram?.WebApp;
    if (tg) {
      tg.ready();
      tg.expand();

      // Get user data - NOTE: В продакшене нужна серверная валидация initData
      const user = tg.initDataUnsafe?.user;
      if (user) {
        setUser({
          id: String(user.id),
          firstName: user.first_name,
          lastName: user.last_name,
          username: user.username,
          photoUrl: user.photo_url,
          languageCode: user.language_code || 'ru',
          loyaltyLevel: 'bronze',
          bonusPoints: 0,
          totalSpent: 0,
        });
      } else {
        // Fallback when not in Telegram
        setUser({
          id: 'user-1',
          firstName: 'Гость',
          languageCode: 'ru',
          loyaltyLevel: 'bronze',
          bonusPoints: 0,
          totalSpent: 0,
        });
      }
    } else {
      // Fallback when not in Telegram
      setUser({
        id: 'user-1',
        firstName: 'Гость',
        languageCode: 'ru',
        loyaltyLevel: 'bronze',
        bonusPoints: 0,
        totalSpent: 0,
      });
    }
  }, [setUser]);

  // Handle splash complete
  const handleSplashComplete = () => {
    setShowSplash(false);
    setCurrentScreen('main');
  };

  // Handle product press
  const handleProductPress = (product: Product) => {
    setSelectedProduct(product);
    setCurrentScreen('product');
  };

  // Handle back from product
  const handleBackFromProduct = () => {
    setCurrentScreen('main');
    setSelectedProduct(null);
  };

  // Handle search press
  const handleSearchPress = () => {
    setCurrentScreen('search');
  };

  // Handle checkout
  const handleCheckout = () => {
    setCurrentScreen('checkout');
  };

  // Handle back from checkout
  const handleBackFromCheckout = () => {
    setCurrentScreen('main');
    setActiveTab('cart');
  };

  // Handle order complete
  const handleOrderComplete = (orderId: string) => {
    setCompletedOrderId(orderId);
    setCurrentScreen('orderStatus');
  };

  // Handle home from order status
  const handleHomeFromOrderStatus = () => {
    setCurrentScreen('main');
    setActiveTab('home');
    setCompletedOrderId(null);
  };

  // Handle compare screen
  const handleOpenCompare = () => {
    setCurrentScreen('compare');
  };

  // Handle legal screen
  const handleOpenLegal = () => {
    setCurrentScreen('legal');
  };

  // Handle chat screen
  const handleOpenChat = (product?: Product) => {
    setChatProductContext(product || null);
    setCurrentScreen('chat');
  };

  // Handle order status press
  const handleOrderStatusPress = () => {
    if (activeOrders.length > 0) {
      setCompletedOrderId(activeOrders[0].id);
      setCurrentScreen('orderStatus');
    }
  };

  // Handle tab change
  const handleTabChange = (tab: Tab) => {
    setActiveTab(tab);
    if (currentScreen !== 'main') {
      setCurrentScreen('main');
    }
  };

  // Render current screen
  const renderScreen = () => {
    if (showSplash || currentScreen === 'splash') {
      return <Splash onComplete={handleSplashComplete} />;
    }

    if (currentScreen === 'product' && selectedProduct) {
      return (
        <ProductDetailScreen
          product={selectedProduct}
          onBack={handleBackFromProduct}
          onProductPress={(p) => {
            setSelectedProduct(p);
          }}
          onOpenChat={(product) => handleOpenChat(product)}
        />
      );
    }

    if (currentScreen === 'search') {
      return (
        <SearchScreen
          onProductPress={handleProductPress}
          onBack={() => setCurrentScreen('main')}
        />
      );
    }

    if (currentScreen === 'checkout') {
      return (
        <CheckoutScreen
          onBack={handleBackFromCheckout}
          onComplete={handleOrderComplete}
        />
      );
    }

    if (currentScreen === 'orderStatus' && completedOrderId) {
      return (
        <OrderStatusScreen
          orderId={completedOrderId}
          onBack={handleHomeFromOrderStatus}
          onHome={handleHomeFromOrderStatus}
        />
      );
    }

    if (currentScreen === 'compare') {
      return (
        <CompareScreen
          onBack={() => setCurrentScreen('main')}
          onProductPress={handleProductPress}
        />
      );
    }

    if (currentScreen === 'legal') {
      return (
        <LegalScreen
          onBack={() => setCurrentScreen('main')}
        />
      );
    }

    if (currentScreen === 'chat') {
      return (
        <ChatScreen
          onBack={() => setCurrentScreen('main')}
          productContext={chatProductContext}
        />
      );
    }

    // Main screens based on tab
    switch (activeTab) {
      case 'home':
        return (
          <HomeScreen
            onProductPress={handleProductPress}
            onSearchPress={handleSearchPress}
          />
        );
      case 'cart':
        return (
          <CartScreen
            onCheckout={handleCheckout}
            onProductPress={(id) => {
              const product = products.find(p => p.id === id);
              if (product) handleProductPress(product);
            }}
          />
        );
      case 'favorites':
        return (
          <FavoritesScreen
            onProductPress={handleProductPress}
          />
        );
      case 'profile':
        return (
          <ProfileScreen 
            onOpenCompare={handleOpenCompare}
            onOpenLegal={handleOpenLegal}
            onOpenChat={() => handleOpenChat()}
            onOpenOrderStatus={handleOrderStatusPress}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className={cn(
      'min-h-screen font-sans antialiased',
      isNeon
        ? 'bg-slate-900 text-white'
        : 'bg-slate-50 text-slate-900'
    )}>
      <AnimatePresence mode="wait">
        {renderScreen()}
      </AnimatePresence>

      {/* Compare floating button */}
      {currentScreen === 'main' && compareList.length > 0 && (
        <button
          onClick={handleOpenCompare}
          className={cn(
            'fixed bottom-24 right-4 z-40 px-4 py-3 rounded-full font-medium text-sm flex items-center gap-2 shadow-lg',
            isNeon
              ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
              : 'bg-purple-600 text-white'
          )}
          style={isNeon ? { boxShadow: '0 0 30px rgba(168, 85, 247, 0.5)' } : {}}
        >
          ⚖️ Сравнить ({compareList.length})
        </button>
      )}

      {/* Bottom navigation - show only on main screens */}
      {currentScreen === 'main' && !showSplash && (
        <BottomNav
          activeTab={activeTab}
          onTabChange={handleTabChange}
          hasActiveOrder={hasActiveOrder}
          onOrderPress={handleOrderStatusPress}
        />
      )}
    </div>
  );
}
