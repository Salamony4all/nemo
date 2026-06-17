import { useState, useEffect } from "react";
import { TourOffer, MediaAsset } from "./types";
import { PRESEEDED_OFFERS, PRESEEDED_MEDIA } from "./data";
import TourDetailsView from "./components/TourDetailsView";
import MediaHubView from "./components/MediaHubView";
import CompanionAIView from "./components/CompanionAIView";
import { 
  Compass, Sparkles, Film, Bookmark, Star, Calendar, 
  MapPin, Phone, MessageSquare, Download, Check, Trash2, Globe, Settings, X, Menu, ShieldCheck, Award
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

const EXCHANGE_RATE = 48.5;

export default function App() {
  // Navigation tabs
  const [activeTab, setActiveTab] = useState<"offers" | "media" | "ai" | "board">("offers");
  
  // Selected Tour for detail view modal
  const [selectedTour, setSelectedTour] = useState<TourOffer | null>(null);

  // Saved/Bookmarked media board IDs
  const [savedAssetIds, setSavedAssetIds] = useState<string[]>([]);
  const [bookmarkedTourIds, setBookmarkedTourIds] = useState<string[]>([]);

  // Filter state for Offers feed
  const [maxPrice, setMaxPrice] = useState<number>(25000);
  const [currency, setCurrency] = useState<"USD" | "EGP">("EGP");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const formatPrice = (priceInUsd: number) => {
    if (currency === "EGP") {
      const egpPrice = Math.round(priceInUsd * EXCHANGE_RATE);
      return `${egpPrice.toLocaleString()} EGP`;
    }
    return `$${priceInUsd}`;
  };

  const handleCurrencyChange = (newCurrency: "USD" | "EGP") => {
    if (newCurrency === currency) return;
    let computedMaxPrice = maxPrice;
    if (newCurrency === "EGP") {
      computedMaxPrice = Math.round(maxPrice * EXCHANGE_RATE / 500) * 500;
    } else {
      computedMaxPrice = Math.round(maxPrice / EXCHANGE_RATE / 10) * 10;
    }
    setMaxPrice(computedMaxPrice);
    setCurrency(newCurrency);
    try {
      localStorage.setItem("nemo_preferred_currency", newCurrency);
      localStorage.setItem("nemo_max_price", computedMaxPrice.toString());
    } catch (_) {}
  };

  const handleMaxPriceChange = (val: number) => {
    setMaxPrice(val);
    try {
      localStorage.setItem("nemo_max_price", val.toString());
    } catch (_) {}
  };

  // Luxury preferences and settings panel states
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [highContrast, setHighContrast] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState<"en" | "ar">("en");

  // Load bookmarks and configuration on startup
  useEffect(() => {
    try {
      const storedAssets = localStorage.getItem("nemo_saved_assets");
      const storedTours = localStorage.getItem("nemo_saved_tours");
      const storedCurrency = localStorage.getItem("nemo_preferred_currency");
      const storedMaxPrice = localStorage.getItem("nemo_max_price");
      
      if (storedAssets) setSavedAssetIds(JSON.parse(storedAssets));
      if (storedTours) setBookmarkedTourIds(JSON.parse(storedTours));
      
      if (storedCurrency === "EGP" || storedCurrency === "USD") {
        setCurrency(storedCurrency);
        if (storedMaxPrice) {
          setMaxPrice(Number(storedMaxPrice));
        } else {
          setMaxPrice(storedCurrency === "EGP" ? 25000 : 500);
        }
      } else if (storedMaxPrice) {
        setMaxPrice(Number(storedMaxPrice));
      }
    } catch (e) {
      console.warn("Storage reading failed", e);
    }
  }, []);

  const handleSaveAssetToBoard = (asset: MediaAsset) => {
    let updated: string[];
    if (savedAssetIds.includes(asset.id)) {
      updated = savedAssetIds.filter(id => id !== asset.id);
    } else {
      updated = [...savedAssetIds, asset.id];
    }
    setSavedAssetIds(updated);
    localStorage.setItem("nemo_saved_assets", JSON.stringify(updated));
  };

  const handleToggleTourBookmark = (tourId: string) => {
    let updated: string[];
    if (bookmarkedTourIds.includes(tourId)) {
      updated = bookmarkedTourIds.filter(id => id !== tourId);
    } else {
      updated = [...bookmarkedTourIds, tourId];
    }
    setBookmarkedTourIds(updated);
    localStorage.setItem("nemo_saved_tours", JSON.stringify(updated));
  };

  const handleNativeSaveFromBoard = (asset: MediaAsset) => {
    const downloadUrl = `/api/download?url=${encodeURIComponent(asset.sourceUrl)}&name=${encodeURIComponent(asset.id)}`;
    const link = document.createElement("a");
    link.href = downloadUrl;
    link.setAttribute("download", `${asset.id}.mp4`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredOffers = PRESEEDED_OFFERS.filter(tour => {
    const tourPrice = currency === "EGP" ? tour.price * EXCHANGE_RATE : tour.price;
    const matchesPrice = tourPrice <= maxPrice;
    const matchesSearch = tour.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          tour.arabicTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          tour.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesPrice && matchesSearch;
  });

  return (
    <div id="full-app-root" className={`min-h-screen font-sans flex flex-col justify-between transition-colors duration-300 ${highContrast ? "bg-slate-950 text-slate-100" : "bg-[#f8f9fa] text-[#191c1d]"}`}>
      
      {/* 1. Header Section - Stable sticky header to avoid layout shifts or flicker */}
      <header id="brand-header" className="bg-white/95 backdrop-blur-xl border-b border-slate-200/50 sticky top-0 z-30 shadow-sm py-2">
        <div className="max-w-7xl mx-auto px-4 lg:px-6 flex flex-col md:flex-row md:items-center md:justify-between gap-2.5 md:gap-4 relative">
          
          {/* Top Row for Mobile (Settings button + Branding identity) / Becomes normal item on Desktop */}
          <div className="flex items-center justify-between w-full md:w-auto relative">
            {/* Settings Menu button wrapped in local relative container so that dropdown aligns perfectly */}
            <div className="relative flex items-center">
              <button 
                onClick={() => setSettingsOpen(!settingsOpen)}
                className={`bg-[#003b5c] text-white hover:bg-[#00253b] p-2 rounded-full xs:p-2.5 transition-all flex items-center justify-center shadow-sm cursor-pointer hover:scale-105 active:scale-95 ${settingsOpen ? "ring-2 ring-emerald-400" : ""}`}
                aria-label="Settings Action Toggle"
              >
                <Menu className="w-4 h-4 transition-transform duration-200" />
              </button>

              <AnimatePresence>
                {/* Active Settings Preference Dropdown Panel - positioned right beneath settings button */}
                {settingsOpen && (
                  <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute left-0 top-full mt-2 w-72 bg-white rounded-2xl shadow-xl border border-slate-200 px-5 py-4 z-50 space-y-4 text-slate-800"
                  >
                    <div className="flex items-center justify-between border-b pb-2">
                      <span className="font-serif font-extrabold text-sm text-slate-800">Travel Coordinator options</span>
                      <button onClick={() => setSettingsOpen(false)} className="p-1 hover:bg-slate-100 rounded text-slate-500 cursor-pointer">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                    
                    <div className="space-y-3 text-xs">
                      {/* Budget Limit Slider */}
                      <div className="space-y-1">
                        <div className="flex justify-between font-semibold">
                          <span className="text-slate-600">Max Excursion Budget:</span>
                          <span className="text-[#094cb2] font-bold">{currency === "EGP" ? `${maxPrice.toLocaleString()} EGP` : `$${maxPrice}`}</span>
                        </div>
                        <input 
                          type="range"
                          min={currency === "EGP" ? 500 : 10}
                          max={currency === "EGP" ? 25000 : 500}
                          step={currency === "EGP" ? 100 : 10}
                          value={maxPrice}
                          onChange={(e) => handleMaxPriceChange(Number(e.target.value))}
                          className="w-full accent-[#094cb2] bg-slate-200 h-1 rounded appearance-none cursor-pointer"
                        />
                      </div>

                      {/* High Contrast Color/Layout Toggler */}
                      <div className="flex items-center justify-between py-1 border-t border-slate-100">
                        <span className="font-semibold text-slate-600">High Contrast Mode</span>
                        <button 
                          onClick={() => setHighContrast(!highContrast)}
                          className={`w-9 h-5 rounded-full p-0.5 transition-colors cursor-pointer ${highContrast ? "bg-emerald-600" : "bg-slate-300"}`}
                        >
                          <div className={`w-4 h-4 rounded-full bg-white transition-transform duration-200 ${highContrast ? "translate-x-4" : ""}`} />
                        </button>
                      </div>

                      {/* Currency Toggler */}
                      <div className="flex items-center justify-between py-1 border-t border-slate-100">
                        <span className="font-semibold text-slate-600">Preferred Currency</span>
                        <select 
                          value={currency}
                          onChange={(e) => handleCurrencyChange(e.target.value as "USD" | "EGP")}
                          className="bg-slate-100 text-slate-700 text-[11px] p-1.5 rounded border-none outline-none font-medium cursor-pointer"
                        >
                          <option value="USD">USD ($)</option>
                          <option value="EGP">EGP (ج.م)</option>
                        </select>
                      </div>

                      {/* Language Setting */}
                      <div className="flex items-center justify-between py-1 border-t border-slate-100">
                        <span className="font-semibold text-slate-600">Language Setting</span>
                        <select 
                          value={selectedLanguage}
                          onChange={(e) => setSelectedLanguage(e.target.value as "en" | "ar")}
                          className="bg-slate-100 text-slate-700 text-[11px] p-1.5 rounded border-none outline-none font-medium cursor-pointer"
                        >
                          <option value="en">English (US)</option>
                          <option value="ar">العربية (EG)</option>
                        </select>
                      </div>

                      {/* Reset storage action */}
                      <div className="pt-2 border-t border-slate-100">
                        <button 
                          onClick={() => {
                            if (confirm("Are you sure you want to clear your saved board bookmarks?")) {
                              setSavedAssetIds([]);
                              setBookmarkedTourIds([]);
                              localStorage.removeItem("nemo_saved_assets");
                              localStorage.removeItem("nemo_saved_tours");
                              setSettingsOpen(false);
                            }
                          }}
                          className="w-full bg-slate-100 hover:bg-rose-50 hover:text-rose-600 text-slate-600 font-bold py-2 rounded text-[11px] text-center transition-colors cursor-pointer"
                        >
                          Clear Saved Board State
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Mobile-only Branding Identity (Replaced desktop logo on mobile screens) */}
            <div className="flex items-center gap-2 md:hidden">
              <div className="text-right">
                <span className="text-[10px] font-extrabold text-[#00253b] font-serif block">NEMO TOURS</span>
                <span className="text-[7px] text-slate-400 font-sans tracking-wide uppercase font-bold">Alexandria</span>
              </div>
              <img 
                src="https://lh3.googleusercontent.com/aida/AP1WRLverbP5Y2f7iH1QOIxJk-890Q0mVcoZN_ecj3lzkEdJS8QSMxTeZlj04Lql5tWmRn374BbKROKvEnkKMp0Mht74mz9teE5hFPTAnjoIPYBrth5q57UJk5Z7GwctZe34GRgIWMMx2BOc-lO8NbvG5HTAjaZYrtx2afcckVRR5EuRb6ki1BRsuRLDdXAf-hiRKLtzQSZkYKzCAQw-UTDNukjMgBcFsD0e_HJZb9enSlIAKno9QHZBfntaZuw" 
                alt="Nemo Avatar badge logo" 
                className="h-8 w-8 object-contain rounded-full border border-slate-200/50 shadow-sm"
              />
            </div>
          </div>

          {/* Centered navigation tabs - Spans full width on mobile, and standard max-w-xl on desktop */}
          <nav className="w-full md:flex-1 md:max-w-xl flex items-center justify-around bg-slate-100 p-0.5 xs:p-1 rounded-xl md:rounded-2xl border border-slate-200">
            <button 
              id="tab-summer-offers"
              onClick={() => { setActiveTab("offers"); setSelectedTour(null); }}
              className={`flex-1 py-1.5 px-1 xs:px-2 md:py-2.5 md:px-3 rounded-lg md:rounded-xl text-[11px] xs:text-xs font-semibold flex items-center justify-center gap-1 xs:gap-1.5 transition-all outline-none border-none select-none cursor-pointer ${
                activeTab === "offers" && !selectedTour 
                  ? "bg-white text-[#00253b] font-extrabold shadow-sm" 
                  : "text-[#42474e] hover:bg-slate-200/50"
              }`}
            >
              <Compass className="w-3.5 h-3.5 text-[#094cb2]" />
              <span className="hidden xs:inline">Summer Offers</span>
              <span className="inline xs:hidden">Offers</span>
            </button>
            <button 
              id="tab-media-downloader"
              onClick={() => { setActiveTab("media"); setSelectedTour(null); }}
              className={`flex-1 py-1.5 px-1 xs:px-2 md:py-2.5 md:px-3 rounded-lg md:rounded-xl text-[11px] xs:text-xs font-semibold flex items-center justify-center gap-1 xs:gap-1.5 transition-all outline-none border-none select-none cursor-pointer ${
                activeTab === "media" 
                  ? "bg-white text-[#00253b] font-extrabold shadow-sm" 
                  : "text-[#42474e] hover:bg-slate-200/50"
              }`}
            >
              <Film className="w-3.5 h-3.5 text-[#094cb2]" />
              <span className="hidden xs:inline">Media Hub</span>
              <span className="inline xs:hidden">Media</span>
            </button>
            <button 
              id="tab-ai-companion"
              onClick={() => { setActiveTab("ai"); setSelectedTour(null); }}
              className={`flex-1 py-1.5 px-1 xs:px-2 md:py-2.5 md:px-3 rounded-lg md:rounded-xl text-[11px] xs:text-xs font-semibold flex items-center justify-center gap-1 xs:gap-1.5 transition-all outline-none border-none select-none cursor-pointer ${
                activeTab === "ai" 
                  ? "bg-white text-[#00253b] font-extrabold shadow-sm" 
                  : "text-[#42474e] hover:bg-slate-200/50"
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-[#094cb2]" />
              <span className="hidden xs:inline">AI Coach</span>
              <span className="inline xs:hidden">Coach</span>
            </button>
            <button 
              id="tab-saved-board"
              onClick={() => { setActiveTab("board"); setSelectedTour(null); }}
              className={`flex-1 py-1.5 px-1 xs:px-2 md:py-2.5 md:px-3 rounded-lg md:rounded-xl text-[11px] xs:text-xs font-semibold flex items-center justify-center gap-1 xs:gap-1.5 transition-all outline-none border-none select-none cursor-pointer relative ${
                activeTab === "board" 
                  ? "bg-white text-[#00253b] font-extrabold shadow-sm" 
                  : "text-[#42474e] hover:bg-slate-200/50"
              }`}
            >
              <Bookmark className="w-3.5 h-3.5 text-[#094cb2]" />
              <span className="hidden xs:inline">Saved Board</span>
              <span className="inline xs:hidden">Board</span>
              {(savedAssetIds.length > 0 || bookmarkedTourIds.length > 0) && (
                <span className="absolute -top-1.5 -right-1 bg-[#fcb882] text-slate-950 font-bold text-[9px] w-4.5 h-4.5 rounded-full flex items-center justify-center border-2 border-white">
                  {savedAssetIds.length + bookmarkedTourIds.length}
                </span>
              )}
            </button>
          </nav>

          {/* Company Logo shown on the right (Desktop only, since mobile has its branding next to Settings) */}
          <div className="hidden md:flex items-center gap-2 shrink-0">
            <div className="text-right">
              <span className="text-[10px] font-extrabold text-[#00253b] font-serif block">NEMO TOURS</span>
              <span className="text-[7px] text-slate-400 font-sans tracking-wide uppercase font-bold">Alexandria</span>
            </div>
            <img 
              src="https://lh3.googleusercontent.com/aida/AP1WRLverbP5Y2f7iH1QOIxJk-890Q0mVcoZN_ecj3lzkEdJS8QSMxTeZlj04Lql5tWmRn374BbKROKvEnkKMp0Mht74mz9teE5hFPTAnjoIPYBrth5q57UJk5Z7GwctZe34GRgIWMMx2BOc-lO8NbvG5HTAjaZYrtx2afcckVRR5EuRb6ki1BRsuRLDdXAf-hiRKLtzQSZkYKzCAQw-UTDNukjMgBcFsD0e_HJZb9enSlIAKno9QHZBfntaZuw" 
              alt="Nemo Avatar badge logo" 
              className="h-9 w-9 md:h-10 md:w-10 object-contain rounded-full border border-slate-200/50 shadow-sm"
            />
          </div>

        </div>
      </header>

      {/* 2. Primary Tabs Content Layout Area */}
      <main className="flex-1 w-full bg-[#faf9fa] transition-all">
        
        {/* Huge Header Hero Banner Logo & coordinates address badge - Scrolls naturally, so zero layout shift, zero flicker! */}
        {!selectedTour && (
          <div className="w-full bg-white border-b border-slate-200/50 py-6 md:py-8 mb-2">
            <div className="max-w-7xl mx-auto px-4 lg:px-6 flex flex-col items-center gap-3">
              {/* Center elegant address pill badge */}
              <div className="flex items-center justify-center gap-1.5 px-4 py-1.5 bg-gradient-to-r from-teal-50 to-amber-50 hover:from-teal-100 hover:to-amber-100/70 transition-all rounded-full border border-amber-100 shadow-sm">
                <MapPin className="w-3.5 h-3.5 text-[#094cb2]" />
                <span className="text-[11px] font-medium uppercase tracking-widest text-[#003b5c]">
                  {selectedLanguage === "en" ? "Saba Pasha, Alexandria" : "سابا باشا، الإسكندرية"}
                </span>
              </div>

              {/* Huge Header Hero Banner Logo */}
              <div className="w-full flex justify-center max-w-5xl px-4">
                <img 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuAFEd82RMtU69keM-gUm-kiI7Ik8JyhZOOsfNK3azeD5w9sjck662F86RH3z_-C-sB1yPpioLpyMTXnXR4LCIAWaI7Int9Yx3aMcSGbLG8ZnC3DAaO2QIc2vyXDbvM_ABuPQzxfe2WdsuN8fx5JWUFcgIltCMgDQUT_7ImqRFz5SzBHKEzd32h-xyyfC4fdqMlaT0DwfoX9gXMlGdIk8jvAr71pSyVui2LRuiFa7FJuXkgP3L_i7wusfKoDBvKYqqdF-uAYP6Vt1AM" 
                  alt="Nemo Tours Official Banner Logo" 
                  className="w-full h-auto max-h-56 md:max-h-72 object-contain"
                />
              </div>
            </div>
          </div>
        )}
        
        <AnimatePresence mode="wait">
          
          {/* A. If details view option is ACTIVE */}
          {selectedTour ? (
            <motion.div
              key="details-view-panel"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <TourDetailsView 
                tour={selectedTour} 
                onBack={() => setSelectedTour(null)} 
                formatPrice={formatPrice}
              />
            </motion.div>
          ) : (
            // Regular Tabs
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
            >
              
              {/* TAB 1: Available Summer Excursion Offers */}
              {activeTab === "offers" && (
                <div id="offers-list-container" className="max-w-4xl mx-auto px-4 py-6 space-y-6">
                  
                  {/* Filter & Search Bar */}
                  <div className="bg-white p-4 rounded-2xl border border-slate-200/60 shadow-sm space-y-4">
                    <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                      <div className="w-full md:w-1/2">
                        <label className="block text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-1">Search Nemo Expeditions</label>
                        <input 
                          type="text" 
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          placeholder="e.g. dolphin, Marsa Alam, catamaran..."
                          className="w-full bg-[#f3f4f5] p-2.5 rounded-xl border border-slate-200 text-xs focus:outline-[#094cb2]"
                        />
                      </div>
                      
                      <div className="w-full md:w-1/3">
                        <div className="flex justify-between text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-1">
                          <span>Max Budget</span>
                          <span className="text-[#094cb2]">Under {currency === "EGP" ? `${maxPrice.toLocaleString()} EGP` : `$${maxPrice}`}</span>
                        </div>
                        <input 
                          type="range"
                          min={currency === "EGP" ? 500 : 10}
                          max={currency === "EGP" ? 25000 : 500}
                          step={currency === "EGP" ? 100 : 10}
                          value={maxPrice}
                          onChange={(e) => handleMaxPriceChange(Number(e.target.value))}
                          className="w-full accent-[#094cb2] bg-slate-200 h-1.5 rounded-lg appearance-none cursor-pointer"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Lowest Price Guarantee Trust Banner */}
                  <div className="bg-gradient-to-r from-emerald-50 to-teal-50/50 border border-emerald-100 p-4 rounded-2xl flex items-start gap-3.5 shadow-sm">
                    <div className="bg-emerald-500 text-white p-2 rounded-xl shrink-0">
                      <ShieldCheck className="w-5 h-5 text-white" />
                    </div>
                    <div className="space-y-1">
                      <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                        <span>Lowest Price Guaranteed</span>
                        <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded-md font-semibold normal-case">110% Refund Difference</span>
                      </h4>
                      <p className="text-slate-600 text-[11px] leading-relaxed">
                        We scan local Egyptian operators to guarantee the absolute lowest rate on Marsa Alam luxury catamaran and snorkeling tours. Find a lower verified public offer and we'll instantly match it plus refund <strong className="text-emerald-700 font-extrabold">110% of the difference</strong>!
                      </p>
                    </div>
                  </div>

                  {/* Vertical Feed - matches original html elements list with modern enhancements */}
                  <div className="space-y-6">
                    {filteredOffers.map((tour) => {
                      const isPinned = bookmarkedTourIds.includes(tour.id);
                      return (
                        <div 
                          key={tour.id} 
                          className="w-full bg-white rounded-3xl overflow-hidden shadow-md hover:shadow-lg transition-all border border-slate-200/50 flex flex-col group"
                        >
                          {/* Image boxaspect aspect-[4/3] */}
                          <div className="relative w-full aspect-square md:aspect-[16/10] overflow-hidden">
                            <img 
                              alt={tour.title} 
                              className="w-full h-full object-cover group-hover:scale-101 transition-transform duration-300" 
                              src={tour.imageUrl} 
                            />
                            {/* Badges Overlay */}
                            <div className="absolute top-4 left-4 flex flex-col gap-2">
                              <span className="bg-[#00253b] text-white text-[10px] uppercase font-bold tracking-widest px-3 py-1 rounded-full shadow">
                                {tour.duration}
                              </span>
                            </div>

                            <button 
                              onClick={() => handleToggleTourBookmark(tour.id)}
                              className="absolute top-4 right-4 bg-white/80 backdrop-blur-md p-2 rounded-full cursor-pointer hover:bg-white text-rose-500 shadow active:scale-90"
                            >
                              <Bookmark className="w-4 h-4" fill={isPinned ? "#f43f5e" : "none"} />
                            </button>

                            <div className="absolute bottom-0 inset-x-0 h-28 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                            
                            <div className="absolute bottom-4 left-4 text-white">
                              <div className="flex items-center gap-1.5 text-xs text-[#fcb882] font-semibold">
                                <Star className="w-3.5 h-3.5 fill-current" />
                                <span>{tour.rating} Verified Operator</span>
                              </div>
                              <h3 className="font-serif font-extrabold text-base lg:text-xl drop-shadow-sm leading-tight">
                                {tour.title}
                              </h3>
                            </div>
                          </div>

                          {/* Extra info & CTA */}
                          <div className="p-4 lg:p-6 space-y-4">
                            <div className="flex justify-between items-center bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                              <span className="font-label text-[#7e5705] font-extrabold text-xs">
                                {tour.arabicTitle}
                              </span>
                              <span className="font-serif font-extrabold text-[#00253b] text-md">
                                From {formatPrice(tour.price)} <span className="text-[10px] text-slate-500 font-sans font-normal">/person</span>
                              </span>
                            </div>

                            <div className="flex items-center justify-between text-[11px] px-1">
                              <div className="flex items-center gap-1.5 text-emerald-600 font-semibold bg-emerald-50 px-2 py-1 rounded-md">
                                <ShieldCheck className="w-3.5 h-3.5" />
                                <span>Best Price Guaranteed</span>
                              </div>
                              <span className="text-slate-500 text-[11px] font-medium flex items-center gap-1">
                                <Award className="w-3.5 h-3.5 text-amber-500" /> High Class Captain
                              </span>
                            </div>

                            <p className="text-xs text-[#42474e] font-sans line-clamp-3 leading-relaxed">
                              {tour.description}
                            </p>

                            <div className="flex gap-2">
                              {/* Open Detail action */}
                              <button 
                                id={`btn-details-${tour.id}`}
                                onClick={() => setSelectedTour(tour)}
                                className="flex-1 bg-[#003b5c] text-[#ffffff] font-display font-semibold py-3.5 rounded-xl shadow hover:bg-[#00253b] active:scale-[0.98] transition-all flex justify-center items-center gap-2 group cursor-pointer"
                              >
                                <span>Book Now</span>
                                <span className="group-hover:translate-x-1 transition-transform ml-1">→</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}

                    {filteredOffers.length === 0 && (
                      <div className="bg-white p-12 text-center rounded-2xl border border-slate-200 text-slate-400">
                        No available tours matches your search query or pricing filters.
                      </div>
                    )}
                  </div>

                  {/* Skip Option from original Page 1 */}
                  <div className="mt-8 text-center pb-8 border-t pt-6 select-none">
                    <button 
                      onClick={() => setActiveTab("media")}
                      className="font-label text-xs font-semibold text-slate-500 hover:text-[#094cb2] transition-colors underline decoration-transparent hover:decoration-[#094cb2] underline-offset-4 cursor-pointer"
                    >
                      Skip offers for now and explore our video reels
                    </button>
                  </div>

                </div>
              )}

              {/* TAB 2: Facebook Media Downloader Hub */}
              {activeTab === "media" && (
                <MediaHubView 
                  onSaveToBoard={handleSaveAssetToBoard} 
                  savedAssetIds={savedAssetIds} 
                />
              )}

              {/* TAB 3: Client Gemini Co-Pilot Chat coach */}
              {activeTab === "ai" && (
                <CompanionAIView 
                  onSuggestExcursion={(tourId) => {
                    const match = PRESEEDED_OFFERS.find(t => t.id === tourId);
                    if (match) setSelectedTour(match);
                  }} 
                />
              )}

              {/* TAB 4: Client personal saved collection list */}
              {activeTab === "board" && (
                <div id="board-saved-list" className="max-w-4xl mx-auto px-4 py-6 space-y-6">
                  
                  {/* Bookmarked Excursions header */}
                  <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                    <h2 className="font-serif font-bold text-lg text-[#191c1d] flex items-center gap-2 border-b pb-3">
                      <Bookmark className="w-5 h-5 text-[#094cb2]" />
                      My Bookmarked Excursions ({bookmarkedTourIds.length})
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {PRESEEDED_OFFERS.filter(t => bookmarkedTourIds.includes(t.id)).map((tour) => (
                        <div key={tour.id} className="bg-slate-50 p-4 rounded-xl border border-slate-200/60 flex items-center justify-between gap-4">
                          <div className="flex items-center gap-3">
                            <img src={tour.imageUrl} className="w-12 h-12 rounded-lg object-cover" alt="" />
                            <div>
                              <h4 className="font-sans font-bold text-xs text-slate-800 line-clamp-1">{tour.title}</h4>
                              <span className="text-[10px] text-emerald-700 font-semibold">{formatPrice(tour.price)}</span>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-1 shrink-0">
                            <button 
                              onClick={() => setSelectedTour(tour)}
                              className="bg-[#003b5c] text-white px-2.5 py-1.5 rounded font-display font-semibold text-[10px]"
                            >
                              Details
                            </button>
                            <button 
                              onClick={() => handleToggleTourBookmark(tour.id)}
                              className="text-red-500 p-1 hover:bg-slate-100 rounded"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>

                    {bookmarkedTourIds.length === 0 && (
                      <p className="text-xs text-slate-500 italic py-2">No excursions bookmarked yet. Click the bookmark icon list in the 'Summer Offers' catalog to save tours.</p>
                    )}
                  </div>

                  {/* Bookmarked facebook reels / images board catalog */}
                  <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                    <h2 className="font-serif font-bold text-lg text-[#191c1d] flex items-center gap-2 border-b pb-3">
                      <Film className="w-5 h-5 text-[#094cb2]" />
                      Saved Facebook Post Media ({savedAssetIds.length})
                    </h2>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {PRESEEDED_MEDIA.filter(m => savedAssetIds.includes(m.id)).map((asset) => (
                        <div key={asset.id} className="bg-slate-50 p-3 rounded-xl border border-slate-200 flex flex-col justify-between">
                          <div className="space-y-2">
                            <div className="aspect-video relative rounded-lg overflow-hidden bg-slate-900">
                              {asset.type === "reel" ? (
                                <video src={asset.sourceUrl} muted className="w-full h-full object-cover opacity-85" />
                              ) : (
                                <img src={asset.sourceUrl} className="w-full h-full object-cover opacity-95" alt="" />
                              )}
                              <span className="absolute top-1.5 left-1.5 bg-black/60 text-white text-[9px] px-1.5 py-0.5 rounded font-label uppercase">
                                {asset.type}
                              </span>
                            </div>
                            <h4 className="font-sans font-bold text-xs text-slate-800 line-clamp-1">{asset.title}</h4>
                            <p className="font-sans text-[10px] text-slate-500 line-clamp-2">{asset.caption}</p>
                          </div>

                          <div className="flex gap-2 pt-3 border-t border-slate-200/50 mt-2">
                            <button 
                              onClick={() => handleNativeSaveFromBoard(asset)}
                              className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-1.5 rounded text-[10px] flex items-center justify-center gap-1"
                            >
                              <Download className="w-3.5 h-3.5" /> Save Natively
                            </button>
                            <button 
                              onClick={() => handleSaveAssetToBoard(asset)}
                              className="text-slate-500 hover:bg-slate-200 p-1 rounded"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>

                    {savedAssetIds.length === 0 && (
                      <p className="text-xs text-slate-500 italic py-2">No reels or photos added to board yet. Select the Nemo Media Hub tab and save posts to list here.</p>
                    )}
                  </div>

                </div>
              )}

            </motion.div>
          )}

        </AnimatePresence>

      </main>

      {/* 3. Footer Coordinates Section (With verified operator address and contacts) */}
      <footer id="brand-footer" className="bg-[#001d31] text-white py-10 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 lg:px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
          
          <div className="space-y-3">
            <h3 className="font-serif font-extrabold text-[#f3be68] text-lg uppercase tracking-wide">
              Nemo Tours (نيمو تورز)
            </h3>
            <p className="text-xs text-slate-400 font-sans leading-relaxed">
              Premium Red Sea Expeditions. Providing elite yacht charters, dolphin snorkeling safely, and family cruising packages with absolute Egyptian hospitality. 
            </p>
          </div>

          <div className="space-y-3 text-xs font-sans text-slate-300">
            <h4 className="text-[#f3be68] font-bold text-xs uppercase tracking-widest font-label">Official Headquarters</h4>
            <div className="flex items-start gap-2.5">
              <MapPin className="w-4.5 h-4.5 text-[#fcb882] shrink-0 mt-0.5" />
              <span>78 Abdel Salam Aref, beside Ibrahim Obeid Hospital, Saba Pasha, Alexandria.</span>
            </div>
            <div className="flex items-center gap-2.5">
              <Phone className="w-4.5 h-4.5 text-[#fcb882]" />
              <span>01100086772 / 01100086796 / 01032212504</span>
            </div>
          </div>

          <div className="space-y-3 text-xs font-sans text-slate-400 md:text-right flex flex-col justify-between">
            <div className="flex gap-4 md:justify-end text-slate-300">
              <span className="hover:text-white transition-colors cursor-pointer select-none">Terms of use</span>
              <span>|</span>
              <span className="hover:text-white transition-colors cursor-pointer select-none">Privacy policies</span>
            </div>
            <span>
              © 2026 Nemo Tours. Egypt Oceanic Ventures. All rights reserved. Registered Operator.
            </span>
          </div>

        </div>
      </footer>

    </div>
  );
}
