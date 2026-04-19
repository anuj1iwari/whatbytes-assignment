"use client";
import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { 
  Search, ShoppingCart, Star, ChevronRight, 
  User, Plus, Minus, Trash2, CheckCircle, Truck 
} from 'lucide-react';

const CartContext = createContext();

const PRODUCTS = [
  { id: 1, name: "Running Shoes", price: 99, rating: 4.5, category: "Clothing", img: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80" },
  { id: 2, name: "Wireless Headphones", price: 159, rating: 4.8, category: "Electronics", img: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&q=80" },
  { id: 3, name: "Backpack", price: 129, rating: 4.2, category: "Home", img: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&q=80" },
  { id: 4, name: "Smortwatch", price: 249, rating: 4.7, category: "Electronics", img: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=80" },
  { id: 5, name: "Sunglasses", price: 149, rating: 4.0, category: "Clothing", img: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=600&q=80" },
  { id: 6, name: "Digital Camera", price: 499, rating: 4.9, category: "Electronics", img: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=600&q=80" },
  { id: 7, name: "T-shirt", price: 29, rating: 4.1, category: "Clothing", img: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&q=80" },
  { id: 8, name: "Smartphone", price: 699, rating: 4.6, category: "Electronics", isFeatured: true, description: "Experience flagship performance with a stunning bezel-less display.", img: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&q=80" },
];

function CartProvider({ children }) {
  const [items, setItems] = useState([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem('wb_cart_final_v10');
    if (saved) setItems(JSON.parse(saved));
  }, []);

  useEffect(() => {
    if (mounted) {
      localStorage.setItem('wb_cart_final_v10', JSON.stringify(items));
    }
  }, [items, mounted]);

  const add = (p) => {
    setItems(curr => {
      const exists = curr.find(i => i.id === p.id);
      if (exists) return curr.map(i => i.id === p.id ? { ...i, qty: i.qty + 1 } : i);
      return [...curr, { ...p, qty: 1 }];
    });
  };

  const update = (id, delta) => setItems(curr => curr.map(i => i.id === id ? { ...i, qty: Math.max(1, i.qty + delta) } : i));
  const remove = (id) => setItems(curr => curr.filter(i => i.id !== id));

  if (!mounted) return <div className="min-h-screen bg-[#f8faff]" />;

  return <CartContext.Provider value={{ items, add, update, remove }}>{children}</CartContext.Provider>;
}

const Header = ({ setView, query, setQuery }) => {
  const { items } = useContext(CartContext);
  return (
    <header className="bg-[#005bb7] text-white py-4 px-6 sticky top-0 z-50 shadow-md">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        <div className="text-3xl font-bold cursor-pointer" onClick={() => setView({ t: 'home' })}>Logo</div>
        <div className="flex-1 max-w-xl relative">
          <input 
            type="text" 
            placeholder="Search for products..." 
            value={query} 
            onChange={(e) => setQuery(e.target.value)} 
            className="w-full bg-[#004a96] border-none rounded-md py-2.5 px-10 text-white placeholder-blue-200 outline-none focus:ring-1 focus:ring-white/30" 
          />
          <Search className="absolute left-3 top-2.5 w-5 h-5 text-blue-200" />
        </div>
        <div className="flex items-center gap-4">
          <button onClick={() => setView({ t: 'cart' })} className="bg-[#002d5b] px-6 py-2 rounded-md flex items-center gap-2 font-semibold relative hover:bg-[#001a35] transition-colors">
            <ShoppingCart className="w-5 h-5" /> Cart
            {items.length > 0 && <span className="absolute -top-2 -right-2 bg-white text-[#002d5b] text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-bold shadow-sm">{items.reduce((a, b) => a + b.qty, 0)}</span>}
          </button>
          <User className="w-6 h-6 cursor-pointer hidden sm:block" />
        </div>
      </div>
    </header>
  );
};

const ProductListing = ({ setView, query, setQuery }) => {
  const { add } = useContext(CartContext);
  const [cat, setCat] = useState('All');
  const [price, setPrice] = useState(1000);

  const filtered = useMemo(() => PRODUCTS.filter(p => {
    const s = p.name.toLowerCase().includes(query.toLowerCase());
    const c = cat === 'All' || p.category === cat;
    const pr = p.price <= price;
    return s && c && pr;
  }), [query, cat, price]);

  return (
    <div className="flex flex-col md:flex-row items-start gap-8">
      <aside className="w-full md:w-64 flex-shrink-0 flex flex-col gap-6">
        <div className="bg-[#005bb7] text-white p-6 rounded-xl shadow-sm">
          <h3 className="text-xl font-bold mb-6">Category</h3>
          <div className="space-y-4">
            {['All', 'Electronics', 'Clothing', 'Home'].map(c => (
              <label key={c} className="flex items-center gap-3 cursor-pointer group">
                <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all ${cat === c ? 'bg-white border-white' : 'border-white/50 group-hover:border-white'}`}>
                  {cat === c && <div className="w-1.5 h-1.5 bg-[#005bb7] rounded-full" />}
                </div>
                <input type="radio" checked={cat === c} onChange={() => setCat(c)} className="hidden" />
                <span className="text-sm font-medium">{c}</span>
              </label>
            ))}
            <div className="pt-6 border-t border-white/10 mt-4">
              <p className="font-bold text-lg mb-4">Price</p>
              <input type="range" min="0" max="1000" value={price} onChange={(e) => setPrice(parseInt(e.target.value))} className="w-full accent-white h-1 bg-blue-400 rounded-lg appearance-none cursor-pointer" />
              <div className="flex justify-between text-[10px] mt-2 font-bold uppercase">
                <span>0</span><span>{price}</span>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
          <h3 className="text-lg font-bold mb-5 text-gray-900 tracking-tight">Category</h3>
          <div className="space-y-4">
            {['All', 'Electronics', 'Clothing', 'Home'].map(c => (
              <label key={c} className="flex items-center gap-3 cursor-pointer text-gray-600">
                <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all ${cat === c ? 'bg-blue-600 border-blue-600' : 'border-gray-200'}`}>
                  {cat === c && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                </div>
                <input type="radio" checked={cat === c} onChange={() => setCat(c)} className="hidden" />
                <span className="text-sm font-medium">{c}</span>
              </label>
            ))}
          </div>
          <div className="pt-6 mt-4 border-t border-gray-50">
            <p className="font-bold text-[10px] mb-2.5 text-gray-400 uppercase tracking-widest">Price</p>
            <input type="number" value={price} onChange={(e) => setPrice(parseInt(e.target.value) || 0)} className="w-full border border-gray-100 rounded-md px-3 py-2 text-sm text-gray-900 outline-none focus:border-blue-500" />
          </div>
        </div>
      </aside>

      <div className="flex-1 w-full">
        <h2 className="text-3xl font-bold mb-8 text-[#002d5b]">Product Listing</h2>
        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map(p => p.isFeatured ? (
              <div key={p.id} onClick={() => setView({ t: 'product', id: p.id })} className="col-span-1 sm:col-span-2 bg-white rounded-xl p-6 flex flex-col sm:flex-row gap-8 cursor-pointer shadow-sm group relative min-h-[400px]">
                <div className="w-full sm:w-1/2 flex items-center justify-center bg-white"><img src={p.img} alt={p.name} className="max-h-full max-w-full object-contain group-hover:scale-105 transition-all" /></div>
                <div className="flex-1 flex flex-col justify-start pt-6 text-left">
                  <h3 className="text-3xl font-bold text-gray-900 mb-1">{p.name}</h3>
                  <p className="text-xl font-bold text-gray-900 mb-3">${p.price}</p>
                  <div className="flex gap-1 text-blue-900 mb-4">{[1,2,3,4,5].map(s => <Star key={s} className={`w-4 h-4 ${s <= 4 ? 'fill-current' : 'text-gray-300'}`} />)}</div>
                  <p className="text-gray-500 text-sm mb-6 leading-relaxed line-clamp-3">{p.description}</p>
                  <div className="mb-4"><p className="text-[10px] font-bold text-gray-400 uppercase mb-1">Category</p><p className="text-sm text-gray-700 font-semibold">{p.category}</p></div>
                  <button onClick={(e) => { e.stopPropagation(); add(p); }} className="absolute bottom-6 right-6 bg-[#005bb7] text-white py-2.5 px-10 rounded-md font-bold hover:bg-[#004a96] transition-colors shadow-sm">Add to Cart</button>
                </div>
              </div>
            ) : (
              <div key={p.id} onClick={() => setView({ t: 'product', id: p.id })} className="bg-white p-6 rounded-xl flex flex-col shadow-sm group cursor-pointer transition-all">
                <div className="h-44 flex items-center justify-center mb-6 bg-white overflow-hidden"><img src={p.img} alt={p.name} className="max-h-full max-w-full object-contain group-hover:scale-105 transition-all" /></div>
                <div className="space-y-1 mb-4"><h3 className="font-bold text-gray-800 text-sm">{p.name}</h3><p className="font-bold text-gray-900 text-base">${p.price}</p></div>
                <button onClick={(e) => { e.stopPropagation(); add(p); }} className="mt-auto bg-[#005bb7] text-white py-2 rounded-md font-bold hover:bg-[#004a96] transition-colors">Add to Cart</button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-xl border border-dashed border-gray-200">
            <p className="text-xl font-medium text-gray-400 uppercase tracking-widest px-4">No products found matching your filters.</p>
            <button onClick={() => { setCat('All'); setPrice(1000); setQuery(''); }} className="mt-4 text-[#005bb7] font-bold hover:underline">Clear all filters</button>
          </div>
        )}
      </div>
    </div>
  );
};

const CartPage = ({ setView }) => {
  const { items, update, remove } = useContext(CartContext);
  const total = items.reduce((a, b) => a + (b.price * b.qty), 0);
  return (
    <div className="max-w-4xl mx-auto py-10 px-4">
      <h1 className="text-4xl font-bold mb-10 text-gray-800 tracking-tight">Shopping Cart</h1>
      {items.length > 0 ? (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            {items.map(i => (
              <div key={i.id} className="p-8 border-b last:border-0 border-gray-50 flex flex-col sm:flex-row items-center gap-10">
                <div className="w-20 h-20 flex items-center justify-center bg-white"><img src={i.img} className="max-h-full object-contain" alt={i.name} /></div>
                <div className="flex-1 text-center sm:text-left"><h3 className="font-bold text-xl text-gray-800">{i.name}</h3><p className="text-blue-600 font-bold">${i.price}</p></div>
                <div className="flex items-center bg-gray-50 rounded-lg p-1 border border-gray-100">
                  <button onClick={() => update(i.id, -1)} className="p-2 hover:bg-white rounded transition-colors"><Minus className="w-4 h-4" /></button>
                  <span className="w-10 text-center font-bold">{i.qty}</span>
                  <button onClick={() => update(i.id, 1)} className="p-2 hover:bg-white rounded transition-colors"><Plus className="w-4 h-4" /></button>
                </div>
                <button onClick={() => remove(i.id)} className="text-red-400 hover:text-red-600 p-2 transition-all"><Trash2 className="w-5 h-5" /></button>
              </div>
            ))}
          </div>
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex justify-between items-center">
            <div><p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Total Payable</p><h2 className="text-4xl font-black text-gray-900">${total.toLocaleString()}</h2></div>
            <button className="bg-green-600 text-white px-12 py-4 rounded-xl font-bold text-xl hover:bg-green-700">Checkout</button>
          </div>
        </div>
      ) : (
        <div className="text-center py-40 bg-white rounded-3xl border border-gray-100">
          <p className="text-3xl font-black text-gray-200 uppercase tracking-widest mb-8 text-center px-4">Your cart is empty</p>
          <button onClick={() => setView({ t: 'home' })} className="bg-blue-600 text-white px-10 py-3 rounded-xl font-bold hover:scale-105 transition-all shadow-lg">Start Shopping</button>
        </div>
      )}
    </div>
  );
};

const ProductDetail = ({ id, setView }) => {
  const { add } = useContext(CartContext);
  const p = PRODUCTS.find(x => x.id === id);
  if (!p) return null;
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-7xl mx-auto px-6">
      <button onClick={() => setView({ t: 'home' })} className="flex items-center gap-2 text-[#005bb7] font-bold mb-10 hover:translate-x-[-5px] transition-transform"><ChevronRight className="w-5 h-5 rotate-180" /> Back to Products</button>
      <div className="bg-white rounded-3xl p-10 flex flex-col md:flex-row gap-16 border border-gray-50 shadow-sm">
        <div className="w-full md:w-1/2 flex items-center justify-center bg-white rounded-2xl overflow-hidden min-h-[400px]"><img src={p.img} alt={p.name} className="max-h-full max-w-full object-contain hover:scale-105 transition-transform duration-700" /></div>
        <div className="flex-1 space-y-8 flex flex-col justify-center">
          <div><h1 className="text-5xl font-bold text-gray-900 mb-2 tracking-tight">{p.name}</h1><div className="flex items-center gap-2 text-blue-900"><Star className="w-5 h-5 fill-current text-yellow-400" /><span className="font-bold text-xl">4.8</span></div></div>
          <div className="text-6xl font-black text-[#005bb7] tracking-tighter">${p.price}</div>
          <p className="text-gray-500 leading-relaxed text-lg">{p.description}</p>
          <div className="grid grid-cols-2 gap-8 py-8 border-y border-gray-50 font-bold uppercase tracking-wider text-xs"><div className="flex items-center gap-3 text-green-600"><CheckCircle className="w-6 h-6" /> IN STOCK</div><div className="flex items-center gap-3 text-blue-500"><Truck className="w-6 h-6" /> FREE SHIPPING</div></div>
          <button onClick={() => { add(p); setView({ t: 'cart' }); }} className="bg-[#005bb7] text-white py-4 rounded-xl font-bold text-xl hover:bg-[#004a96] shadow-lg">Add to Cart</button>
        </div>
      </div>
    </div>
  );
};

export default function App() {
  const [view, setView] = useState({ t: 'home', id: null });
  const [query, setQuery] = useState('');

  return (
    <CartProvider>
      <div className="min-h-screen bg-[#f8faff] text-[#002d5b]">
        <Header setView={setView} query={query} setQuery={setQuery} />
        <main className="py-10 min-h-[80vh] max-w-7xl mx-auto px-6">
          {view.t === 'home' ? <ProductListing setView={setView} query={query} setQuery={setQuery} /> : 
           view.t === 'product' ? <ProductDetail id={view.id} setView={setView} /> : 
           <CartPage setView={setView} />}
        </main>
        <footer className="bg-[#002d5b] text-white py-16 px-6 mt-20">
          <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-16">
            <div className="space-y-6"><h4 className="text-lg font-bold border-b border-white/10 pb-4">Filters</h4><div className="space-y-2 text-blue-200 text-sm"><p>All</p><p>Electronics</p><p className="mt-12 text-[10px] opacity-40 font-black">© 2026 WHATBYTES AMERICAN</p></div></div>
            <div className="space-y-6"><h4 className="text-lg font-bold border-b border-white/10 pb-4">About Us</h4><div className="space-y-2 text-blue-200 text-sm"><p>About Us</p><p>Contact Support</p></div></div>
            <div className="space-y-6"><h4 className="text-lg font-bold border-b border-white/10 pb-4">Follow Us</h4>
              <div className="flex gap-4">
                <div className="bg-[#005bb7] p-2 rounded-full cursor-pointer hover:bg-blue-400 transition-all">
                  <svg className="w-5 h-5 fill-white" viewBox="0 0 24 24"><path d="M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.325 1.324h11.495v-9.294h-3.128v-3.622h3.128v-2.671c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12v9.293h6.116c.73 0 1.323-.593 1.323-1.325v-21.35c0-.732-.593-1.325-1.325-1.325z"></path></svg>
                </div>
                <div className="bg-[#005bb7] p-2 rounded-full cursor-pointer hover:bg-blue-400 transition-all">
                  <svg className="w-5 h-5 fill-white" viewBox="0 0 24 24"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"></path></svg>
                </div>
                <div className="bg-[#005bb7] p-2 rounded-full cursor-pointer hover:bg-blue-400 transition-all">
                  <svg className="w-5 h-5 fill-white" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4.162 4.162 0 1 1 0-8.324 4.162 4.162 0 0 1 0 8.324zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"></path></svg>
                </div>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </CartProvider>
  );
}