import { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Filter, Calendar, X, SlidersHorizontal, ChevronDown, MapPin } from 'lucide-react';
import { useData } from '../context/DataContext';
import ItemCard from '../components/ItemCard';

const EVENT_TYPES = [
  'All', 'Wedding', 'Engagement', 'Sangeet', 'Festival', 'Puja',
  'Religious Ceremony', 'Party', 'Anniversary', 'Birthday',
  'Corporate Event', 'Cultural Event', 'Reception',
];

const CATEGORIES = [
  'All', 'Necklace Sets', 'Necklaces', 'Earrings', 'Bangles',
  'Bracelets', 'Rings', 'Anklets', 'Maang Tikka', 'Nose Rings', 'Complete Bridal Set',
];

const SORT_OPTIONS = [
  { value: 'relevance', label: 'Most Relevant' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'rating', label: 'Highest Rated' },
  { value: 'availability', label: 'Most Available' },
];

const CITIES = ['All', 'Mumbai', 'Delhi', 'Bengaluru', 'Hyderabad', 'Chennai', 'Kolkata', 'Jaipur', 'Udaipur', 'Pune'];

export default function RenterBrowse() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { items } = useData();

  const [query, setQuery] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedEvent, setSelectedEvent] = useState(searchParams.get('event') || 'All');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedCity, setSelectedCity] = useState('All');
  const [sortBy, setSortBy] = useState('relevance');
  const [maxPrice, setMaxPrice] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const today = new Date().toISOString().split('T')[0];

  const filtered = useMemo(() => {
    let result = [...items];

    if (query.trim()) {
      const q = query.toLowerCase();
      result = result.filter(i =>
        i.name.toLowerCase().includes(q) ||
        i.description?.toLowerCase().includes(q) ||
        i.category.toLowerCase().includes(q) ||
        i.ownerName?.toLowerCase().includes(q)
      );
    }

    if (selectedDate) {
      result = result.filter(i => i.availability.includes(selectedDate));
    }

    if (selectedEvent !== 'All') {
      result = result.filter(i => i.eventTypes.includes(selectedEvent));
    }

    if (selectedCategory !== 'All') {
      result = result.filter(i => i.category === selectedCategory);
    }

    if (selectedCity !== 'All') {
      result = result.filter(i => i.location === selectedCity);
    }

    if (maxPrice) {
      result = result.filter(i => i.pricePerDay <= Number(maxPrice));
    }

    switch (sortBy) {
      case 'price-asc': result.sort((a, b) => a.pricePerDay - b.pricePerDay); break;
      case 'price-desc': result.sort((a, b) => b.pricePerDay - a.pricePerDay); break;
      case 'rating': result.sort((a, b) => b.rating - a.rating); break;
      case 'availability': result.sort((a, b) => b.availability.length - a.availability.length); break;
    }

    return result;
  }, [items, query, selectedDate, selectedEvent, selectedCategory, selectedCity, maxPrice, sortBy]);

  const clearFilters = () => {
    setQuery('');
    setSelectedDate('');
    setSelectedEvent('All');
    setSelectedCategory('All');
    setSelectedCity('All');
    setMaxPrice('');
    setSortBy('relevance');
    setSearchParams({});
  };

  const hasFilters = query || selectedDate || selectedEvent !== 'All' || selectedCategory !== 'All' || selectedCity !== 'All' || maxPrice;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Search Header */}
      <div className="bg-white border-b border-gray-200 sticky top-14 z-30">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex gap-3 items-center">
            {/* Search bar */}
            <div className="flex-1 relative">
              <Search size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                className="input-apple pl-10 pr-4"
                placeholder="Search necklaces, bangles, rings..."
                value={query}
                onChange={e => setQuery(e.target.value)}
              />
              {query && (
                <button onClick={() => setQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  <X size={15} />
                </button>
              )}
            </div>

            {/* Date picker */}
            <div className="relative flex-shrink-0">
              <Calendar size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              <input
                type="date"
                className="input-apple pl-9 w-44 cursor-pointer"
                min={today}
                value={selectedDate}
                onChange={e => setSelectedDate(e.target.value)}
              />
            </div>

            {/* Filter toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-medium transition-all ${
                showFilters || hasFilters
                  ? 'bg-gray-900 text-white border-gray-900'
                  : 'bg-white text-gray-700 border-gray-200 hover:border-gray-400'
              }`}
            >
              <SlidersHorizontal size={15} />
              Filters
              {hasFilters && <span className="bg-yellow-400 text-gray-900 text-xs rounded-full w-4 h-4 flex items-center justify-center font-bold">!</span>}
            </button>
          </div>

          {/* Expanded filters */}
          {showFilters && (
            <div className="mt-4 p-4 bg-gray-50 rounded-xl border border-gray-200 space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1.5">Category</label>
                  <select className="select-apple text-sm" value={selectedCategory} onChange={e => setSelectedCategory(e.target.value)}>
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1.5">City</label>
                  <select className="select-apple text-sm" value={selectedCity} onChange={e => setSelectedCity(e.target.value)}>
                    {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1.5">Max Price / Day (₹)</label>
                  <input
                    type="number"
                    className="input-apple text-sm"
                    placeholder="e.g. 5000"
                    value={maxPrice}
                    onChange={e => setMaxPrice(e.target.value)}
                    min={0}
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1.5">Sort By</label>
                  <select className="select-apple text-sm" value={sortBy} onChange={e => setSortBy(e.target.value)}>
                    {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                  </select>
                </div>
              </div>

              {hasFilters && (
                <button onClick={clearFilters} className="text-sm text-red-600 flex items-center gap-1 hover:underline">
                  <X size={13} /> Clear all filters
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Event category pills */}
        <div className="flex gap-2 overflow-x-auto pb-3 mb-6 scrollbar-none">
          {EVENT_TYPES.map(ev => (
            <button
              key={ev}
              onClick={() => setSelectedEvent(ev)}
              className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all border ${
                selectedEvent === ev
                  ? 'bg-gray-900 text-white border-gray-900'
                  : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400'
              }`}
            >
              {ev}
            </button>
          ))}
        </div>

        {/* Results header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              {selectedEvent !== 'All' ? `${selectedEvent} Jewelry` : 'All Jewelry'}
            </h2>
            <p className="text-sm text-gray-500 mt-0.5">
              {filtered.length} piece{filtered.length !== 1 ? 's' : ''} found
              {selectedDate && ` · Available on ${new Date(selectedDate + 'T00:00:00').toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}`}
            </p>
          </div>

          {selectedDate && (
            <div className="flex items-center gap-2 bg-green-50 border border-green-200 rounded-full px-3 py-1.5 text-xs font-medium text-green-700">
              <span className="available-dot" />
              Showing available on {selectedDate}
              <button onClick={() => setSelectedDate('')} className="ml-1 text-green-600 hover:text-green-800">
                <X size={12} />
              </button>
            </div>
          )}
        </div>

        {/* Grid */}
        {filtered.length === 0 ? (
          <div className="text-center py-24 bg-white rounded-2xl border border-gray-200 border-dashed">
            <Search size={48} className="text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-700 mb-2">No jewelry found</h3>
            <p className="text-gray-500 text-sm mb-4">Try adjusting your filters or search terms</p>
            <button onClick={clearFilters} className="btn-outline">Clear filters</button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filtered.map(item => (
              <ItemCard key={item.id} item={item} selectedDate={selectedDate} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
