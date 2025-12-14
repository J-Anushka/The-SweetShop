import React, { useEffect, useState, useMemo } from 'react';
import { api } from '../services/api';
import { Sweet } from '../types';
import { SweetCard } from '../components/SweetCard';
import { Search, Filter, SlidersHorizontal } from 'lucide-react';

export const Dashboard: React.FC = () => {
  const [sweets, setSweets] = useState<Sweet[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [processingId, setProcessingId] = useState<string | null>(null);

  const fetchSweets = async () => {
    try {
      const data = await api.sweets.getAll();
      setSweets(data);
    } catch (error) {
      console.error('Failed to fetch sweets', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSweets();
  }, []);

  const categories = useMemo(() => {
    const cats = new Set(sweets.map(s => s.category));
    return ['All', ...Array.from(cats)];
  }, [sweets]);

  const filteredSweets = useMemo(() => {
    return sweets.filter(s => {
      const matchesSearch = s.name.toLowerCase().includes(search.toLowerCase()) || 
                          s.description.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = categoryFilter === 'All' || s.category === categoryFilter;
      return matchesSearch && matchesCategory;
    });
  }, [sweets, search, categoryFilter]);

  const handlePurchase = async (id: string, qty: number) => {
    setProcessingId(id);
    try {
      await api.sweets.purchase(id, qty);
      await fetchSweets(); // Refresh data to show new stock
    } catch (error) {
      alert("Purchase failed: " + (error as Error).message);
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header & Controls */}
      <div className="mb-8 space-y-4">
        <h1 className="text-3xl font-bold text-sweet-primary">Sweet Inventory</h1>
        
        <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-sweet-card p-4 rounded-xl shadow-sm border border-sweet-text/10">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-sweet-text/40" size={20} />
            <input
              type="text"
              placeholder="Search for sweets..."
              className="w-full pl-10 pr-4 py-2 bg-sweet-bg/50 border border-sweet-text/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-sweet-primary focus:border-transparent transition-all placeholder-sweet-text/40 text-sweet-text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
            <Filter size={20} className="text-sweet-text/40 hidden md:block" />
            <div className="flex gap-2">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setCategoryFilter(cat)}
                  className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                    categoryFilter === cat 
                      ? 'bg-sweet-primary text-white shadow-sm' 
                      : 'bg-sweet-bg text-sweet-text/70 hover:bg-sweet-bg/80 border border-sweet-text/5'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="bg-sweet-card h-96 rounded-xl shadow-sm animate-pulse"></div>
          ))}
        </div>
      ) : filteredSweets.length === 0 ? (
        <div className="text-center py-20 bg-sweet-card rounded-xl border border-dashed border-sweet-text/20">
          <SlidersHorizontal className="mx-auto h-12 w-12 text-sweet-text/30 mb-3" />
          <h3 className="text-lg font-medium text-sweet-text">No sweets found</h3>
          <p className="text-sweet-text/50">Try adjusting your search or filters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredSweets.map(sweet => (
            <SweetCard 
              key={sweet.id} 
              sweet={sweet} 
              onPurchase={handlePurchase}
              isProcessing={processingId === sweet.id}
            />
          ))}
        </div>
      )}
    </div>
  );
};