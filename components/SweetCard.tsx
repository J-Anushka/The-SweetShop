import React, { useState } from 'react';
import { Sweet } from '../types';
import { ShoppingCart, Check } from 'lucide-react';

interface SweetCardProps {
  sweet: Sweet;
  onPurchase: (id: string, qty: number) => Promise<void>;
  isProcessing: boolean;
}

export const SweetCard: React.FC<SweetCardProps> = ({ sweet, onPurchase, isProcessing }) => {
  const [buyQty, setBuyQty] = useState(1);
  const [justPurchased, setJustPurchased] = useState(false);

  const isOutOfStock = sweet.quantity === 0;

  const handlePurchase = async () => {
    if (buyQty > sweet.quantity) return;
    await onPurchase(sweet.id, buyQty);
    setJustPurchased(true);
    setBuyQty(1);
    setTimeout(() => setJustPurchased(false), 2000);
  };

  return (
    <div className="bg-sweet-card rounded-xl shadow-sm border border-sweet-text/10 overflow-hidden hover:shadow-md transition-shadow duration-300 flex flex-col h-full">
      <div className="relative h-48 bg-sweet-bg overflow-hidden group">
        <img 
          src={sweet.image} 
          alt={sweet.name} 
          className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
        />
        {isOutOfStock && (
          <div className="absolute inset-0 bg-sweet-text/60 flex items-center justify-center backdrop-blur-sm">
            <span className="bg-sweet-primary text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg border border-white/20">
              SOLD OUT
            </span>
          </div>
        )}
        <div className="absolute top-2 right-2 bg-sweet-card/90 backdrop-blur px-2 py-1 rounded-md text-xs font-semibold text-sweet-text shadow-sm border border-sweet-text/10">
          {sweet.category}
        </div>
      </div>
      
      <div className="p-5 flex-1 flex flex-col">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-bold text-sweet-text line-clamp-1">{sweet.name}</h3>
          <span className="text-lg font-bold text-sweet-primary">${sweet.price.toFixed(2)}</span>
        </div>
        
        <p className="text-sweet-text/70 text-sm mb-4 line-clamp-2 flex-1">{sweet.description}</p>
        
        <div className="mt-auto">
          <div className="flex items-center justify-between text-sm text-sweet-text/60 mb-3">
            <span className={sweet.quantity < 10 && sweet.quantity > 0 ? "text-sweet-primary font-medium" : ""}>
              {isOutOfStock ? "Restocking soon" : `${sweet.quantity} in stock`}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center border border-sweet-text/20 rounded-lg bg-sweet-bg/50">
               <button 
                onClick={() => setBuyQty(Math.max(1, buyQty - 1))}
                disabled={isOutOfStock || isProcessing}
                className="px-3 py-1 hover:bg-sweet-text/5 disabled:opacity-50 text-sweet-text"
               >-</button>
               <span className="w-8 text-center text-sm font-medium text-sweet-text">{buyQty}</span>
               <button 
                onClick={() => setBuyQty(Math.min(sweet.quantity, buyQty + 1))}
                disabled={isOutOfStock || isProcessing || buyQty >= sweet.quantity}
                className="px-3 py-1 hover:bg-sweet-text/5 disabled:opacity-50 text-sweet-text"
               >+</button>
            </div>

            <button
              onClick={handlePurchase}
              disabled={isOutOfStock || isProcessing}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                justPurchased 
                  ? 'bg-green-600 text-white' 
                  : isOutOfStock 
                    ? 'bg-sweet-bg text-sweet-text/30 cursor-not-allowed border border-sweet-text/10'
                    : 'bg-sweet-primary text-white hover:bg-sweet-primary/90 shadow-sm hover:shadow active:scale-95'
              }`}
            >
              {justPurchased ? (
                <>
                  <Check size={18} />
                  <span>Added</span>
                </>
              ) : (
                <>
                  <ShoppingCart size={18} />
                  <span>{isOutOfStock ? 'No Stock' : 'Buy'}</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};