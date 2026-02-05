import { useState, useMemo } from 'react';
import { Search, X, SlidersHorizontal, ChevronDown, Check, RotateCcw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '../store';
import { products, categories, filterOptions } from '../data/products';
import { ProductCard } from '../components/ProductCard';
import { Product, FilterState } from '../types';
import { cn } from '../utils/cn';

interface SearchScreenProps {
  onProductPress: (product: Product) => void;
  onBack?: () => void;
}

type SortOption = 'popular' | 'price_asc' | 'price_desc' | 'rating' | 'new';

const initialFilters: FilterState = {
  category: null,
  brands: [],
  priceRange: [0, 500000],
  inStockOnly: false,
  cpu: [],
  gpu: [],
  ram: [],
  ramType: [],
  ssd: [],
  screenSize: [],
  refreshRate: [],
};

export function SearchScreen({ onProductPress, onBack }: SearchScreenProps) {
  const theme = useStore((s) => s.theme);
  const isNeon = theme === 'neon';

  const [query, setQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<FilterState>(initialFilters);
  const [sortBy, setSortBy] = useState<SortOption>('popular');
  const [showSortMenu, setShowSortMenu] = useState(false);
  const [expandedSection, setExpandedSection] = useState<string | null>('category');

  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (filters.category) count++;
    if (filters.brands.length > 0) count += filters.brands.length;
    if (filters.inStockOnly) count++;
    if (filters.cpu.length > 0) count += filters.cpu.length;
    if (filters.gpu.length > 0) count += filters.gpu.length;
    if (filters.ram.length > 0) count += filters.ram.length;
    if (filters.ssd.length > 0) count += filters.ssd.length;
    if (filters.screenSize.length > 0) count += filters.screenSize.length;
    if (filters.refreshRate.length > 0) count += filters.refreshRate.length;
    if (filters.priceRange[0] > 0 || filters.priceRange[1] < 500000) count++;
    return count;
  }, [filters]);

  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Search query
    if (query) {
      const q = query.toLowerCase();
      result = result.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        Object.values(p.specs).some(v => v.toLowerCase().includes(q))
      );
    }

    // Category
    if (filters.category) {
      result = result.filter(p => p.category === filters.category);
    }

    // Brands
    if (filters.brands.length > 0) {
      result = result.filter(p => filters.brands.includes(p.brand));
    }

    // Price
    result = result.filter(p => p.price >= filters.priceRange[0] && p.price <= filters.priceRange[1]);

    // In stock
    if (filters.inStockOnly) {
      result = result.filter(p => p.inStock);
    }

    // CPU filter
    if (filters.cpu.length > 0) {
      result = result.filter(p => p.techSpecs.cpu && filters.cpu.includes(p.techSpecs.cpu));
    }

    // GPU filter
    if (filters.gpu.length > 0) {
      result = result.filter(p => p.techSpecs.gpu && filters.gpu.includes(p.techSpecs.gpu));
    }

    // RAM filter
    if (filters.ram.length > 0) {
      result = result.filter(p => p.techSpecs.ram && filters.ram.includes(p.techSpecs.ram));
    }

    // SSD filter
    if (filters.ssd.length > 0) {
      result = result.filter(p => p.techSpecs.ssd && filters.ssd.includes(p.techSpecs.ssd));
    }

    // Screen size filter
    if (filters.screenSize.length > 0) {
      result = result.filter(p => p.techSpecs.screenSize && filters.screenSize.includes(Math.floor(p.techSpecs.screenSize)));
    }

    // Refresh rate filter
    if (filters.refreshRate.length > 0) {
      result = result.filter(p => p.techSpecs.refreshRate && filters.refreshRate.includes(p.techSpecs.refreshRate));
    }

    // Sort
    switch (sortBy) {
      case 'price_asc':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price_desc':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        result.sort((a, b) => b.rating - a.rating);
        break;
      case 'new':
        result.sort((a, b) => (b.badges.includes('new') ? 1 : 0) - (a.badges.includes('new') ? 1 : 0));
        break;
    }

    return result;
  }, [query, filters, sortBy]);

  const sortOptions: { value: SortOption; label: string }[] = [
    { value: 'popular', label: 'По популярности' },
    { value: 'price_asc', label: 'Сначала дешевле' },
    { value: 'price_desc', label: 'Сначала дороже' },
    { value: 'rating', label: 'По рейтингу' },
    { value: 'new', label: 'По новизне' },
  ];

  const presets = [
    { label: '🔥 До 50к', action: () => setFilters(f => ({ ...f, priceRange: [0, 50000] })) },
    { label: '🎮 Для CS2', action: () => { setFilters(f => ({ ...f, category: 'pc', gpu: ['NVIDIA RTX 4080 Super', 'NVIDIA RTX 4090'] })); } },
    { label: '💼 Офис', action: () => setFilters(f => ({ ...f, category: 'laptops', priceRange: [0, 100000] })) },
    { label: '📺 Стриминг', action: () => setFilters(f => ({ ...f, ram: [32, 64] })) },
    { label: '⚡ 144Hz+', action: () => setFilters(f => ({ ...f, refreshRate: [144, 165, 240, 360] })) },
  ];

  const popularQueries = ['RTX 4090', 'MacBook', 'Игровой ПК', 'Монитор 144Hz', 'Механическая клавиатура', 'Беспроводная мышь'];

  const toggleArrayFilter = <K extends keyof FilterState>(key: K, value: FilterState[K] extends (infer T)[] ? T : never) => {
    setFilters(f => {
      const arr = f[key] as any[];
      if (arr.includes(value)) {
        return { ...f, [key]: arr.filter((v: any) => v !== value) };
      }
      return { ...f, [key]: [...arr, value] };
    });
  };

  const resetFilters = () => {
    setFilters(initialFilters);
    setQuery('');
  };

  const FilterSection = ({ 
    id, 
    title, 
    children 
  }: { 
    id: string; 
    title: string; 
    children: React.ReactNode;
  }) => (
    <div className={cn(
      'border-b',
      isNeon ? 'border-slate-700' : 'border-slate-100'
    )}>
      <button
        onClick={() => setExpandedSection(expandedSection === id ? null : id)}
        className="w-full flex items-center justify-between py-3 px-4"
      >
        <span className={cn('font-medium', isNeon ? 'text-white' : 'text-slate-900')}>
          {title}
        </span>
        <ChevronDown 
          size={18} 
          className={cn(
            'transition-transform',
            expandedSection === id && 'rotate-180',
            isNeon ? 'text-slate-400' : 'text-slate-500'
          )} 
        />
      </button>
      <AnimatePresence>
        {expandedSection === id && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );

  const ChipFilter = ({ 
    options, 
    selected, 
    onToggle,
    format,
  }: { 
    options: (string | number)[]; 
    selected: (string | number)[];
    onToggle: (value: any) => void;
    format?: (v: any) => string;
  }) => (
    <div className="flex flex-wrap gap-2">
      {options.map((opt) => (
        <button
          key={opt}
          onClick={() => onToggle(opt)}
          className={cn(
            'px-3 py-1.5 rounded-lg text-sm font-medium transition-all flex items-center gap-1',
            selected.includes(opt)
              ? isNeon
                ? 'bg-cyan-500 text-white'
                : 'bg-blue-600 text-white'
              : isNeon
              ? 'bg-slate-700 text-slate-300'
              : 'bg-slate-100 text-slate-600'
          )}
        >
          {selected.includes(opt) && <Check size={14} />}
          {format ? format(opt) : String(opt)}
        </button>
      ))}
    </div>
  );

  return (
    <div className={cn(
      'min-h-screen pb-24',
      isNeon
        ? 'bg-gradient-to-b from-slate-900 via-slate-900 to-purple-900/50'
        : 'bg-slate-50'
    )}>
      {/* Search header */}
      <div className={cn(
        'sticky top-0 z-30 px-4 pt-4 pb-3',
        isNeon
          ? 'bg-slate-900/95 backdrop-blur-xl'
          : 'bg-white/95 backdrop-blur-xl shadow-sm'
      )}>
        {/* Back button */}
        {onBack && (
          <button
            onClick={onBack}
            className={cn(
              'mb-3 flex items-center gap-2 text-sm font-medium',
              isNeon ? 'text-cyan-400' : 'text-blue-600'
            )}
          >
            ← Назад
          </button>
        )}
      </div>
      <div className={cn(
        'sticky top-0 z-30 px-4 pb-3',
        isNeon
          ? 'bg-slate-900/95 backdrop-blur-xl'
          : 'bg-white/95 backdrop-blur-xl'
      )}>
        <div className="flex gap-2 mb-3">
          <div className={cn(
            'flex-1 flex items-center gap-2 px-4 py-3 rounded-xl',
            isNeon
              ? 'bg-slate-800 border border-purple-500/30'
              : 'bg-slate-100'
          )}>
            <Search size={20} className={isNeon ? 'text-cyan-400' : 'text-slate-400'} />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Поиск по каталогу..."
              autoFocus
              className={cn(
                'flex-1 bg-transparent outline-none',
                isNeon ? 'text-white placeholder:text-slate-500' : 'text-slate-900 placeholder:text-slate-400'
              )}
            />
            {query && (
              <button onClick={() => setQuery('')}>
                <X size={18} className={isNeon ? 'text-slate-400' : 'text-slate-500'} />
              </button>
            )}
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={cn(
              'p-3 rounded-xl transition-colors relative',
              showFilters
                ? isNeon
                  ? 'bg-cyan-500 text-white'
                  : 'bg-blue-600 text-white'
                : isNeon
                ? 'bg-slate-800 text-cyan-400 border border-purple-500/30'
                : 'bg-white text-slate-700 border border-slate-200'
            )}
          >
            <SlidersHorizontal size={20} />
            {activeFiltersCount > 0 && (
              <span className={cn(
                'absolute -top-1 -right-1 w-5 h-5 rounded-full text-xs font-bold flex items-center justify-center',
                isNeon
                  ? 'bg-pink-500 text-white'
                  : 'bg-red-500 text-white'
              )}>
                {activeFiltersCount}
              </span>
            )}
          </button>
        </div>

        {/* Quick presets */}
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {presets.map((preset, i) => (
            <button
              key={i}
              onClick={preset.action}
              className={cn(
                'px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-all',
                isNeon
                  ? 'bg-slate-800 text-slate-300 border border-slate-700 hover:border-cyan-500/50'
                  : 'bg-white text-slate-600 border border-slate-200 hover:border-blue-300'
              )}
            >
              {preset.label}
            </button>
          ))}
        </div>
      </div>

      {/* Filters panel */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className={cn(
              'max-h-[60vh] overflow-y-auto',
              isNeon ? 'bg-slate-800/80' : 'bg-white'
            )}>
              {/* Reset button */}
              {activeFiltersCount > 0 && (
                <button
                  onClick={resetFilters}
                  className={cn(
                    'w-full py-3 px-4 flex items-center justify-center gap-2 text-sm font-medium',
                    isNeon ? 'text-cyan-400 bg-cyan-500/10' : 'text-blue-600 bg-blue-50'
                  )}
                >
                  <RotateCcw size={16} />
                  Сбросить все фильтры ({activeFiltersCount})
                </button>
              )}

              {/* Category */}
              <FilterSection id="category" title="Категория">
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setFilters(f => ({ ...f, category: null }))}
                    className={cn(
                      'px-3 py-1.5 rounded-lg text-sm font-medium transition-all',
                      !filters.category
                        ? isNeon ? 'bg-cyan-500 text-white' : 'bg-blue-600 text-white'
                        : isNeon ? 'bg-slate-700 text-slate-300' : 'bg-slate-100 text-slate-600'
                    )}
                  >
                    Все
                  </button>
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setFilters(f => ({ ...f, category: cat.id }))}
                      className={cn(
                        'px-3 py-1.5 rounded-lg text-sm font-medium transition-all',
                        filters.category === cat.id
                          ? isNeon ? 'bg-cyan-500 text-white' : 'bg-blue-600 text-white'
                          : isNeon ? 'bg-slate-700 text-slate-300' : 'bg-slate-100 text-slate-600'
                      )}
                    >
                      {cat.icon} {cat.name}
                    </button>
                  ))}
                </div>
              </FilterSection>

              {/* Brands */}
              <FilterSection id="brand" title="Бренд">
                <ChipFilter
                  options={filterOptions.brands}
                  selected={filters.brands}
                  onToggle={(v) => toggleArrayFilter('brands', v)}
                />
              </FilterSection>

              {/* Price range */}
              <FilterSection id="price" title={`Цена: ${filters.priceRange[0].toLocaleString()} - ${filters.priceRange[1].toLocaleString()} ₽`}>
                <div className="space-y-4">
                  <div className="flex gap-3">
                    <input
                      type="number"
                      value={filters.priceRange[0]}
                      onChange={(e) => setFilters(f => ({ ...f, priceRange: [Number(e.target.value), f.priceRange[1]] }))}
                      className={cn(
                        'flex-1 px-3 py-2 rounded-lg text-sm',
                        isNeon ? 'bg-slate-700 text-white border border-slate-600' : 'bg-slate-50 border border-slate-200'
                      )}
                      placeholder="От"
                    />
                    <input
                      type="number"
                      value={filters.priceRange[1]}
                      onChange={(e) => setFilters(f => ({ ...f, priceRange: [f.priceRange[0], Number(e.target.value)] }))}
                      className={cn(
                        'flex-1 px-3 py-2 rounded-lg text-sm',
                        isNeon ? 'bg-slate-700 text-white border border-slate-600' : 'bg-slate-50 border border-slate-200'
                      )}
                      placeholder="До"
                    />
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={500000}
                    step={5000}
                    value={filters.priceRange[1]}
                    onChange={(e) => setFilters(f => ({ ...f, priceRange: [f.priceRange[0], parseInt(e.target.value)] }))}
                    className="w-full accent-cyan-500"
                  />
                </div>
              </FilterSection>

              {/* CPU */}
              <FilterSection id="cpu" title="Процессор (CPU)">
                <ChipFilter
                  options={filterOptions.cpu}
                  selected={filters.cpu}
                  onToggle={(v) => toggleArrayFilter('cpu', v)}
                />
              </FilterSection>

              {/* GPU */}
              <FilterSection id="gpu" title="Видеокарта (GPU)">
                <ChipFilter
                  options={filterOptions.gpu}
                  selected={filters.gpu}
                  onToggle={(v) => toggleArrayFilter('gpu', v)}
                />
              </FilterSection>

              {/* RAM */}
              <FilterSection id="ram" title="Оперативная память (RAM)">
                <ChipFilter
                  options={filterOptions.ram}
                  selected={filters.ram}
                  onToggle={(v) => toggleArrayFilter('ram', v)}
                  format={(v) => `${v} GB`}
                />
              </FilterSection>

              {/* RAM Type */}
              <FilterSection id="ramType" title="Тип памяти">
                <ChipFilter
                  options={filterOptions.ramType}
                  selected={filters.ramType}
                  onToggle={(v) => toggleArrayFilter('ramType', v)}
                />
              </FilterSection>

              {/* SSD */}
              <FilterSection id="ssd" title="Накопитель (SSD)">
                <ChipFilter
                  options={filterOptions.ssd}
                  selected={filters.ssd}
                  onToggle={(v) => toggleArrayFilter('ssd', v)}
                  format={(v) => v >= 1000 ? `${v / 1000} TB` : `${v} GB`}
                />
              </FilterSection>

              {/* Screen size */}
              <FilterSection id="screen" title="Диагональ экрана">
                <ChipFilter
                  options={filterOptions.screenSize}
                  selected={filters.screenSize}
                  onToggle={(v) => toggleArrayFilter('screenSize', v)}
                  format={(v) => `${v}"`}
                />
              </FilterSection>

              {/* Refresh rate */}
              <FilterSection id="refresh" title="Частота обновления">
                <ChipFilter
                  options={filterOptions.refreshRate}
                  selected={filters.refreshRate}
                  onToggle={(v) => toggleArrayFilter('refreshRate', v)}
                  format={(v) => `${v} Hz`}
                />
              </FilterSection>

              {/* In stock toggle */}
              <div className="px-4 py-3">
                <label className="flex items-center gap-3 cursor-pointer">
                  <div
                    className={cn(
                      'w-12 h-6 rounded-full relative transition-colors',
                      filters.inStockOnly
                        ? isNeon ? 'bg-cyan-500' : 'bg-blue-600'
                        : isNeon ? 'bg-slate-700' : 'bg-slate-200'
                    )}
                    onClick={() => setFilters(f => ({ ...f, inStockOnly: !f.inStockOnly }))}
                  >
                    <div
                      className={cn(
                        'absolute top-1 w-4 h-4 rounded-full bg-white transition-all',
                        filters.inStockOnly ? 'left-7' : 'left-1'
                      )}
                    />
                  </div>
                  <span className={isNeon ? 'text-white' : 'text-slate-900'}>
                    Только в наличии
                  </span>
                </label>
              </div>

              {/* Apply button */}
              <div className="p-4">
                <button
                  onClick={() => setShowFilters(false)}
                  className={cn(
                    'w-full py-3 rounded-xl font-semibold',
                    isNeon
                      ? 'bg-gradient-to-r from-cyan-500 to-purple-500 text-white'
                      : 'bg-blue-600 text-white'
                  )}
                >
                  Показать {filteredProducts.length} товаров
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* No query - show popular */}
      {!query && activeFiltersCount === 0 && !showFilters && (
        <div className="px-4 py-4">
          <h3 className={cn('font-medium mb-3', isNeon ? 'text-slate-400' : 'text-slate-500')}>
            Популярные запросы
          </h3>
          <div className="flex flex-wrap gap-2">
            {popularQueries.map((q, i) => (
              <button
                key={i}
                onClick={() => setQuery(q)}
                className={cn(
                  'px-4 py-2 rounded-xl text-sm font-medium transition-all',
                  isNeon
                    ? 'bg-slate-800 text-white border border-slate-700 hover:border-cyan-500/50'
                    : 'bg-white text-slate-700 border border-slate-200 hover:border-blue-300'
                )}
              >
                {q}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Results */}
      {(query || activeFiltersCount > 0) && !showFilters && (
        <div className="px-4 py-4">
          {/* Sort & count */}
          <div className="flex items-center justify-between mb-4">
            <span className={cn('text-sm', isNeon ? 'text-slate-400' : 'text-slate-500')}>
              Найдено: {filteredProducts.length}
            </span>
            <div className="relative">
              <button
                onClick={() => setShowSortMenu(!showSortMenu)}
                className={cn(
                  'flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium',
                  isNeon
                    ? 'bg-slate-800 text-white border border-slate-700'
                    : 'bg-white text-slate-700 border border-slate-200'
                )}
              >
                {sortOptions.find(o => o.value === sortBy)?.label}
                <ChevronDown size={16} />
              </button>
              <AnimatePresence>
                {showSortMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className={cn(
                      'absolute right-0 top-full mt-1 w-48 rounded-xl overflow-hidden shadow-lg z-10',
                      isNeon ? 'bg-slate-800 border border-slate-700' : 'bg-white border border-slate-200'
                    )}
                  >
                    {sortOptions.map((option) => (
                      <button
                        key={option.value}
                        onClick={() => {
                          setSortBy(option.value);
                          setShowSortMenu(false);
                        }}
                        className={cn(
                          'w-full px-4 py-3 text-left text-sm flex items-center justify-between transition-colors',
                          sortBy === option.value
                            ? isNeon
                              ? 'bg-cyan-500/20 text-cyan-400'
                              : 'bg-blue-50 text-blue-600'
                            : isNeon
                            ? 'text-white hover:bg-slate-700'
                            : 'text-slate-700 hover:bg-slate-50'
                        )}
                      >
                        {option.label}
                        {sortBy === option.value && <Check size={16} />}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Grid */}
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-2 gap-3">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onPress={() => onProductPress(product)}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className={cn('text-lg font-medium mb-2', isNeon ? 'text-white' : 'text-slate-900')}>
                Ничего не найдено
              </p>
              <p className={isNeon ? 'text-slate-400' : 'text-slate-500'}>
                Попробуйте изменить параметры поиска
              </p>
              <button
                onClick={resetFilters}
                className={cn(
                  'mt-4 px-4 py-2 rounded-lg font-medium',
                  isNeon ? 'text-cyan-400 bg-cyan-500/10' : 'text-blue-600 bg-blue-50'
                )}
              >
                Сбросить фильтры
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
