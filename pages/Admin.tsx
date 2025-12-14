import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { Sweet, SweetInput } from '../types';
import { Plus, Trash2, Edit2, RotateCcw, Save, X } from 'lucide-react';
import { Logo } from '../components/Logo';

export const AdminPanel: React.FC = () => {
  const [sweets, setSweets] = useState<Sweet[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  // Generic sweet image for default
  const DEFAULT_IMAGE = 'https://images.unsplash.com/photo-1581798459219-318e76aecc7b?auto=format&fit=crop&w=500&q=80';

  // Form State
  const [formData, setFormData] = useState<SweetInput>({
    name: '', category: '', price: 0, quantity: 0, description: '', image: DEFAULT_IMAGE
  });

  const fetchSweets = async () => {
    const data = await api.sweets.getAll();
    setSweets(data);
  };

  useEffect(() => {
    fetchSweets();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await api.sweets.update(editingId, formData);
      } else {
        await api.sweets.create(formData);
      }
      setIsModalOpen(false);
      resetForm();
      fetchSweets();
    } catch (err) {
      alert("Error saving sweet");
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this sweet?')) {
      await api.sweets.delete(id);
      fetchSweets();
    }
  };

  const handleRestock = async (id: string) => {
    const qty = prompt("How many units to add?");
    if (qty && !isNaN(parseInt(qty))) {
      await api.sweets.restock(id, parseInt(qty));
      fetchSweets();
    }
  };

  const openEdit = (sweet: Sweet) => {
    setEditingId(sweet.id);
    setFormData({
      name: sweet.name,
      category: sweet.category,
      price: sweet.price,
      quantity: sweet.quantity,
      description: sweet.description,
      image: sweet.image || DEFAULT_IMAGE
    });
    setIsModalOpen(true);
  };

  const resetForm = () => {
    setEditingId(null);
    setFormData({ name: '', category: '', price: 0, quantity: 0, description: '', image: DEFAULT_IMAGE });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-4">
            <Logo className="h-16 w-16 drop-shadow-sm" />
            <div>
              <h1 className="text-3xl font-bold text-sweet-primary">Admin Dashboard</h1>
              <p className="text-sweet-text/70">Manage inventory and product details</p>
            </div>
        </div>
        <button 
          onClick={() => { resetForm(); setIsModalOpen(true); }}
          className="flex items-center gap-2 bg-sweet-primary text-white px-4 py-2 rounded-lg hover:bg-sweet-primary/90 transition-colors shadow-sm"
        >
          <Plus size={20} />
          Add Sweet
        </button>
      </div>

      <div className="bg-sweet-card rounded-xl shadow-sm border border-sweet-text/10 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-sweet-text/10">
            <thead className="bg-sweet-bg/50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-sweet-text/70 uppercase tracking-wider">Product</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-sweet-text/70 uppercase tracking-wider">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-sweet-text/70 uppercase tracking-wider">Price</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-sweet-text/70 uppercase tracking-wider">Stock</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-sweet-text/70 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-sweet-card divide-y divide-sweet-text/10">
              {sweets.map((sweet) => (
                <tr key={sweet.id} className="hover:bg-sweet-bg/30 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 flex-shrink-0">
                        <img className="h-10 w-10 rounded-full object-cover border border-sweet-text/10" src={sweet.image} alt="" />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-sweet-text">{sweet.name}</div>
                        <div className="text-xs text-sweet-text/60 truncate max-w-[200px]">{sweet.description}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-sweet-primary/10 text-sweet-primary border border-sweet-primary/20">
                      {sweet.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-sweet-text/80">
                    ${sweet.price.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className={`text-sm font-medium ${sweet.quantity === 0 ? 'text-red-600' : 'text-sweet-text'}`}>
                      {sweet.quantity} units
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end gap-2">
                      <button onClick={() => handleRestock(sweet.id)} className="text-green-600 hover:text-green-800 p-1" title="Restock">
                        <RotateCcw size={18} />
                      </button>
                      <button onClick={() => openEdit(sweet)} className="text-blue-600 hover:text-blue-800 p-1" title="Edit">
                        <Edit2 size={18} />
                      </button>
                      <button onClick={() => handleDelete(sweet.id)} className="text-red-600 hover:text-red-800 p-1" title="Delete">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-sweet-text/20 p-4 backdrop-blur-sm">
          <div className="bg-sweet-card rounded-xl shadow-xl w-full max-w-lg p-6 animate-in fade-in zoom-in duration-200 border border-sweet-text/10">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-sweet-text">{editingId ? 'Edit Sweet' : 'Add New Sweet'}</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-sweet-text/40 hover:text-sweet-text">
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-sweet-text/80 mb-1">Name</label>
                    <input 
                    required type="text" 
                    value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})}
                    className="w-full p-2 border border-sweet-text/20 bg-white/80 rounded-lg focus:ring-2 focus:ring-sweet-primary focus:outline-none" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-sweet-text/80 mb-1">Category</label>
                    <input 
                    required type="text" 
                    value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}
                    className="w-full p-2 border border-sweet-text/20 bg-white/80 rounded-lg focus:ring-2 focus:ring-sweet-primary focus:outline-none" />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-sweet-text/80 mb-1">Price ($)</label>
                    <input 
                    required type="number" step="0.01" min="0"
                    value={formData.price} onChange={e => setFormData({...formData, price: parseFloat(e.target.value)})}
                    className="w-full p-2 border border-sweet-text/20 bg-white/80 rounded-lg focus:ring-2 focus:ring-sweet-primary focus:outline-none" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-sweet-text/80 mb-1">Initial Quantity</label>
                    <input 
                    required type="number" min="0"
                    value={formData.quantity} onChange={e => setFormData({...formData, quantity: parseInt(e.target.value)})}
                    className="w-full p-2 border border-sweet-text/20 bg-white/80 rounded-lg focus:ring-2 focus:ring-sweet-primary focus:outline-none" />
                </div>
              </div>

              <div>
                  <label className="block text-sm font-medium text-sweet-text/80 mb-1">Description</label>
                  <textarea 
                  required
                  value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})}
                  className="w-full p-2 border border-sweet-text/20 bg-white/80 rounded-lg focus:ring-2 focus:ring-sweet-primary focus:outline-none h-24" />
              </div>

              <div>
                  <label className="block text-sm font-medium text-sweet-text/80 mb-1">Image URL</label>
                  <input 
                  type="url"
                  value={formData.image} onChange={e => setFormData({...formData, image: e.target.value})}
                  className="w-full p-2 border border-sweet-text/20 bg-white/80 rounded-lg focus:ring-2 focus:ring-sweet-primary focus:outline-none text-sm text-sweet-text/70" />
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-sweet-text/80 hover:bg-sweet-bg/50 rounded-lg transition-colors"
                >Cancel</button>
                <button 
                  type="submit" 
                  className="px-4 py-2 bg-sweet-primary text-white rounded-lg hover:bg-sweet-primary/90 shadow-sm flex items-center gap-2"
                >
                  <Save size={18} /> Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};