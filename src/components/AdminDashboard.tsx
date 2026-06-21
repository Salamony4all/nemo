import React, { useState } from 'react';
import { motion } from 'motion/react';
import { TourOffer, MediaAsset } from '../types';
import { Plus, Trash2, Image as ImageIcon, Film, Save, Star, Clock, FileText, Layers, Video } from 'lucide-react';

interface AdminDashboardProps {
  offers: TourOffer[];
  setOffers: React.Dispatch<React.SetStateAction<TourOffer[]>>;
  media: MediaAsset[];
  setMedia: React.Dispatch<React.SetStateAction<MediaAsset[]>>;
}

export default function AdminDashboard({ offers, setOffers, media, setMedia }: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState<'offers' | 'media'>('offers');

  const [offerForm, setOfferForm] = useState<Partial<TourOffer>>({
    title: '', arabicTitle: '', description: '', fullDetails: '',
    price: 0, rating: 5, reviewsCount: 0, duration: '',
    groupSize: '', imageUrl: '', languages: ['English', 'Arabic'],
  });

  const [mediaForm, setMediaForm] = useState<Partial<MediaAsset>>({
    type: 'photo', title: '', sourceUrl: '', fallbackUrl: '', caption: '',
    publishDate: new Date().toISOString().split('T')[0], likesCount: 0, sharesCount: 0,
  });

  const handleAddOffer = (e: React.FormEvent) => {
    e.preventDefault();
    const newOffer: TourOffer = {
      ...offerForm as TourOffer,
      id: `offer-${Date.now()}`,
      highlights: [],
      operator: {
        name: "Nemo Tours", arabicName: "نيمو تورز", badge: "Verified Operator",
        bio: "Premium Egyptian Expeditions.", address: "Saba Pasha, Alexandria", phones: ["01100086772"]
      }
    };
    setOffers([...offers, newOffer]);
    setOfferForm({
      title: '', arabicTitle: '', description: '', fullDetails: '',
      price: 0, rating: 5, reviewsCount: 0, duration: '',
      groupSize: '', imageUrl: '', languages: ['English', 'Arabic'],
    });
  };

  const handleAddMedia = (e: React.FormEvent) => {
    e.preventDefault();
    const newMedia: MediaAsset = { ...mediaForm as MediaAsset, id: `media-${Date.now()}` };
    setMedia([...media, newMedia]);
    setMediaForm({
      type: 'photo', title: '', sourceUrl: '', fallbackUrl: '', caption: '',
      publishDate: new Date().toISOString().split('T')[0], likesCount: 0, sharesCount: 0,
    });
  };

  const deleteOffer = (id: string) => {
    if (confirm('Are you sure you want to delete this tour offer permanently?')) {
      setOffers(offers.filter(o => o.id !== id));
    }
  };

  const deleteMedia = (id: string) => {
    if (confirm('Are you sure you want to delete this media asset permanently?')) {
      setMedia(media.filter(m => m.id !== id));
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-4 lg:p-8 space-y-8 bg-slate-50/30 min-h-screen">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <h2 className="text-3xl font-serif font-extrabold text-[#003b5c] tracking-tight">Admin Control Panel</h2>
          <p className="text-sm text-slate-500 mt-1">Manage luxury travel catalogs, active excursion bundles, and media content pipelines.</p>
        </div>
        <div className="flex bg-slate-200/70 p-1.5 rounded-2xl shadow-inner border border-slate-300/30 shrink-0">
          <button
            onClick={() => setActiveTab('offers')}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold tracking-wide transition-all duration-200 flex items-center gap-2 ${activeTab === 'offers' ? 'bg-white text-[#003b5c] shadow-md' : 'text-slate-600 hover:text-slate-900'}`}
          >
            <Layers className="w-3.5 h-3.5" /> Manage Offers
          </button>
          <button
            onClick={() => setActiveTab('media')}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold tracking-wide transition-all duration-200 flex items-center gap-2 ${activeTab === 'media' ? 'bg-white text-[#003b5c] shadow-md' : 'text-slate-600 hover:text-slate-900'}`}
          >
            <Video className="w-3.5 h-3.5" /> Manage Media
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Form Module Column */}
        <div className="lg:col-span-5">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xl shadow-slate-200/50 space-y-6"
          >
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <div className="p-2 bg-slate-100 text-[#094cb2] rounded-xl">
                <Plus className="w-4 h-4 stroke-[3px]" />
              </div>
              <h3 className="font-bold text-slate-800 text-base">Add New {activeTab === 'offers' ? 'Tour Offer' : 'Media Asset'}</h3>
            </div>

            {activeTab === 'offers' ? (
              <form onSubmit={handleAddOffer} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-600 uppercase tracking-wider ml-0.5">English Title</label>
                  <input
                    className="w-full p-3 text-sm bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:ring-2 focus:ring-[#094cb2] focus:border-transparent transition-all"
                    value={offerForm.title}
                    onChange={e => setOfferForm({ ...offerForm, title: e.target.value })}
                    placeholder="e.g. Luxury Catamaran Cruise"
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-600 uppercase tracking-wider ml-0.5">Arabic Title</label>
                  <input
                    className="w-full p-3 text-sm bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:ring-2 focus:ring-[#094cb2] focus:border-transparent transition-all"
                    value={offerForm.arabicTitle}
                    onChange={e => setOfferForm({ ...offerForm, arabicTitle: e.target.value })}
                    placeholder="رحلة الكاتاماران الفاخرة"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-600 uppercase tracking-wider ml-0.5">Price (USD)</label>
                    <input
                      type="number"
                      className="w-full p-3 text-sm bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:ring-2 focus:ring-[#094cb2] focus:border-transparent transition-all"
                      value={offerForm.price || ''}
                      onChange={e => setOfferForm({ ...offerForm, price: Number(e.target.value) })}
                      placeholder="99"
                      required
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-600 uppercase tracking-wider ml-0.5">Rating (Max 5)</label>
                    <input
                      type="number" step="0.1" max="5" min="1"
                      className="w-full p-3 text-sm bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:ring-2 focus:ring-[#094cb2] focus:border-transparent transition-all"
                      value={offerForm.rating || ''}
                      onChange={e => setOfferForm({ ...offerForm, rating: Number(e.target.value) })}
                      placeholder="5.0"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-600 uppercase tracking-wider ml-0.5">Duration</label>
                    <input
                      className="w-full p-3 text-sm bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:ring-2 focus:ring-[#094cb2] focus:border-transparent transition-all"
                      value={offerForm.duration}
                      onChange={e => setOfferForm({ ...offerForm, duration: e.target.value })}
                      placeholder="e.g. 3 Days"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-600 uppercase tracking-wider ml-0.5">Group Size</label>
                    <input
                      className="w-full p-3 text-sm bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:ring-2 focus:ring-[#094cb2] focus:border-transparent transition-all"
                      value={offerForm.groupSize || ''}
                      onChange={e => setOfferForm({ ...offerForm, groupSize: e.target.value })}
                      placeholder="Max 12 People"
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-600 uppercase tracking-wider ml-0.5">Image Asset URL</label>
                  <input
                    className="w-full p-3 text-sm bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:ring-2 focus:ring-[#094cb2] focus:border-transparent transition-all"
                    value={offerForm.imageUrl}
                    onChange={e => setOfferForm({ ...offerForm, imageUrl: e.target.value })}
                    placeholder="https://images.unsplash.com/..."
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-600 uppercase tracking-wider ml-0.5">Teaser Description</label>
                  <textarea
                    className="w-full p-3 text-sm bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:ring-2 focus:ring-[#094cb2] focus:border-transparent transition-all h-20 resize-none"
                    value={offerForm.description}
                    onChange={e => setOfferForm({ ...offerForm, description: e.target.value })}
                    placeholder="Provide standard marketing overview sentence..."
                  />
                </div>
                <motion.button
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className="w-full py-3.5 bg-[#003b5c] text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-[#00253b] shadow-md transition-all pt-4"
                >
                  <Save className="w-4 h-4" /> Save Tour Offer
                </motion.button>
              </form>
            ) : (
              <form onSubmit={handleAddMedia} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-600 uppercase tracking-wider ml-0.5">Asset Type</label>
                  <select
                    className="w-full p-3 text-sm bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:ring-2 focus:ring-[#094cb2] focus:border-transparent transition-all cursor-pointer"
                    value={mediaForm.type}
                    onChange={e => setMediaForm({ ...mediaForm, type: e.target.value as 'photo' | 'reel' })}
                  >
                    <option value="photo">High-Resolution Photo</option>
                    <option value="reel">Vertical Facebook Reel / Video</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-600 uppercase tracking-wider ml-0.5">Asset Title Identifier</label>
                  <input
                    className="w-full p-3 text-sm bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:ring-2 focus:ring-[#094cb2] focus:border-transparent transition-all"
                    value={mediaForm.title}
                    onChange={e => setMediaForm({ ...mediaForm, title: e.target.value })}
                    placeholder="e.g. Dolphin Lagoon Swim Highlights"
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-600 uppercase tracking-wider ml-0.5">Source Stream / Facebook URL</label>
                  <input
                    className="w-full p-3 text-sm bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:ring-2 focus:ring-[#094cb2] focus:border-transparent transition-all"
                    value={mediaForm.sourceUrl}
                    onChange={e => setMediaForm({ ...mediaForm, sourceUrl: e.target.value })}
                    placeholder="https://..."
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-600 uppercase tracking-wider ml-0.5">Caption Details</label>
                  <textarea
                    className="w-full p-3 text-sm bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:ring-2 focus:ring-[#094cb2] focus:border-transparent transition-all h-24 resize-none"
                    value={mediaForm.caption}
                    onChange={e => setMediaForm({ ...mediaForm, caption: e.target.value })}
                    placeholder="Type raw copy content or post text parameters..."
                  />
                </div>
                <motion.button
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className="w-full py-3.5 bg-[#003b5c] text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-[#00253b] shadow-md transition-all pt-4"
                >
                  <Save className="w-4 h-4" /> Save Media Asset
                </motion.button>
              </form>
            )}
          </motion.div>
        </div>

        {/* Dynamic Display Catalog Grid */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between px-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Active Items ({activeTab === 'offers' ? offers.length : media.length})</span>
            <span className="text-xs text-slate-400 font-mono">Live Sync</span>
          </div>

          <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {activeTab === 'offers' ? (
              offers.map(offer => (
                <motion.div
                  layout
                  key={offer.id}
                  className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex gap-4 items-center group hover:border-slate-300 hover:shadow-md transition-all duration-200"
                >
                  <img src={offer.imageUrl} alt="" className="w-16 h-16 rounded-xl object-cover shrink-0 bg-slate-100" />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-bold text-slate-800 truncate">{offer.title}</h4>
                    <p className="text-xs font-semibold text-[#094cb2] mt-0.5">${offer.price} USD</p>
                    <div className="flex items-center gap-2 mt-1 text-[10px] text-slate-400 font-medium">
                      <span className="flex items-center gap-0.5"><Clock className="w-3 h-3" /> {offer.duration || 'N/A'}</span>
                      <span>•</span>
                      <span className="flex items-center gap-0.5"><Star className="w-3 h-3 text-amber-500 fill-amber-500" /> {offer.rating}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => deleteOffer(offer.id)}
                    className="p-2.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all"
                    title="Remove Item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </motion.div>
              ))
            ) : (
              media.map(item => (
                <motion.div
                  layout
                  key={item.id}
                  className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex gap-4 items-center group hover:border-slate-300 hover:shadow-md transition-all duration-200"
                >
                  <div className="w-16 h-16 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 shrink-0 group-hover:bg-slate-100 transition-colors">
                    {item.type === 'photo' ? <ImageIcon className="w-5 h-5 text-[#003b5c]" /> : <Film className="w-5 h-5 text-indigo-600" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-bold text-slate-800 truncate">{item.title}</h4>
                    <span className={`inline-block text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded mt-1 ${item.type === 'photo' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/50' : 'bg-indigo-50 text-indigo-700 border border-indigo-200/50'}`}>
                      {item.type}
                    </span>
                    <p className="text-[10px] text-slate-400 font-mono mt-1">{item.publishDate}</p>
                  </div>
                  <button
                    onClick={() => deleteMedia(item.id)}
                    className="p-2.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all"
                    title="Remove Item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </motion.div>
              ))
            )}
          </motion.div>

          {((activeTab === 'offers' ? offers.length : media.length) === 0) && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-24 bg-white rounded-3xl border border-dashed border-slate-200 text-slate-400 text-sm">
              <FileText className="w-8 h-8 mx-auto text-slate-300 mb-2" />
              No records detected in active view state. Add items above.
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}