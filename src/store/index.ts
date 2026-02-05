import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CartItem, Product, User, Order, Theme, Language } from '../types';

interface AppState {
  // User
  user: User | null;
  setUser: (user: User) => void;
  
  // Theme & Language
  theme: Theme;
  language: Language;
  setTheme: (theme: Theme) => void;
  setLanguage: (language: Language) => void;
  
  // Cart
  cart: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  
  // Favorites
  favorites: string[];
  toggleFavorite: (productId: string) => void;
  
  // Recently Viewed
  recentlyViewed: string[];
  addRecentlyViewed: (productId: string) => void;
  
  // Compare
  compareList: string[];
  toggleCompare: (productId: string) => void;
  
  // Orders
  orders: Order[];
  addOrder: (order: Order) => void;
  
  // Quiz
  quizCompleted: boolean;
  quizPreferences: { usage: string; budget: string } | null;
  setQuizCompleted: (prefs: { usage: string; budget: string }) => void;
  
  // Promo
  promoCode: string | null;
  applyPromoCode: (code: string) => boolean;
}

export const useStore = create<AppState>()(
  persist(
    (set, _get) => ({
      // User
      user: null,
      setUser: (user) => set({ user }),
      
      // Theme & Language
      theme: 'light',
      language: 'ru',
      setTheme: (theme) => set({ theme }),
      setLanguage: (language) => set({ language }),
      
      // Cart
      cart: [],
      addToCart: (product) => set((state) => {
        const existing = state.cart.find(item => item.product.id === product.id);
        if (existing) {
          return {
            cart: state.cart.map(item =>
              item.product.id === product.id
                ? { ...item, quantity: item.quantity + 1 }
                : item
            )
          };
        }
        return { cart: [...state.cart, { product, quantity: 1 }] };
      }),
      removeFromCart: (productId) => set((state) => ({
        cart: state.cart.filter(item => item.product.id !== productId)
      })),
      updateQuantity: (productId, quantity) => set((state) => ({
        cart: quantity > 0
          ? state.cart.map(item =>
              item.product.id === productId ? { ...item, quantity } : item
            )
          : state.cart.filter(item => item.product.id !== productId)
      })),
      clearCart: () => set({ cart: [] }),
      
      // Favorites
      favorites: [],
      toggleFavorite: (productId) => set((state) => ({
        favorites: state.favorites.includes(productId)
          ? state.favorites.filter(id => id !== productId)
          : [...state.favorites, productId]
      })),
      
      // Recently Viewed
      recentlyViewed: [],
      addRecentlyViewed: (productId) => set((state) => ({
        recentlyViewed: [productId, ...state.recentlyViewed.filter(id => id !== productId)].slice(0, 20)
      })),
      
      // Compare
      compareList: [],
      toggleCompare: (productId) => set((state) => {
        if (state.compareList.includes(productId)) {
          return { compareList: state.compareList.filter(id => id !== productId) };
        }
        if (state.compareList.length >= 3) return state;
        return { compareList: [...state.compareList, productId] };
      }),
      
      // Orders
      orders: [],
      addOrder: (order) => set((state) => ({ orders: [order, ...state.orders] })),
      
      // Quiz
      quizCompleted: false,
      quizPreferences: null,
      setQuizCompleted: (prefs) => set({ quizCompleted: true, quizPreferences: prefs }),
      
      // Promo
      promoCode: null,
      applyPromoCode: (code) => {
        const validCodes = ['TECHZONE10', 'FIRST20', 'GAMER15'];
        if (validCodes.includes(code.toUpperCase())) {
          set({ promoCode: code.toUpperCase() });
          return true;
        }
        return false;
      },
    }),
    {
      name: 'techzone-storage',
      partialize: (state) => ({
        theme: state.theme,
        language: state.language,
        cart: state.cart,
        favorites: state.favorites,
        recentlyViewed: state.recentlyViewed,
        compareList: state.compareList,
        quizCompleted: state.quizCompleted,
        quizPreferences: state.quizPreferences,
      }),
    }
  )
);
