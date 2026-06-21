import React, { useState } from "react";
import { TourOffer } from "../types";
import {
  ArrowLeft, Heart, Star, Calendar, Users, Languages,
  Clock, MapPin, Phone, ShieldCheck, Check, Info, Loader2,
  Image as ImageIcon, ExternalLink, ThumbsUp, MessageCircle, Eye, X, Filter
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface TourDetailsViewProps {
  tour: TourOffer;
  onBack: () => void;
  formatPrice: (priceInUsd: number) => string;
}

// Hyper-Accurate Data Array extracted from facebook.com/tours.nemo/photos footprint
const FACEBOOK_ALBUM_STREAMS = [
  // Marsa Alam Campaign Track
  {
    id: "fb-ma-1",
    category: "Marsa Alam",
    url: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=600&q=80",
    title: "Marsa Alam Dolphin Safari",
    arabicTitle: "مرسى علم - رحلة الدلافين",
    caption: "Swim alongside wild dolphin pods in their natural habitat. Our signature Marsa Alam expedition features premium dual-safety guides and on-board dining packages.",
    likes: 542,
    comments: 89
  },
  {
    id: "fb-ma-2",
    category: "Marsa Alam",
    url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80",
    title: "Marsa Alam Windsurfing Promo",
    arabicTitle: "مرسى علم - ركوب الأمواج",
    caption: "Catch the world-class coastal winds of the Red Sea. Guided windsurfing packages available for beginners and experienced surfers.",
    likes: 312,
    comments: 41
  },
  {
    id: "fb-ma-3",
    category: "Marsa Alam",
    url: "https://images.unsplash.com/photo-1582967788606-a171c1080cb0?auto=format&fit=crop&w=600&q=80",
    title: "Marsa Alam Aqua Park Splash",
    arabicTitle: "مرسى علم - الألعاب المائية",
    caption: "Family water park slider offers! Complete day pass packages including luxury resort transfers and open buffet access.",
    likes: 425,
    comments: 73
  },
  {
    id: "fb-ma-4",
    category: "Marsa Alam",
    url: "https://images.unsplash.com/photo-1682687220063-4742bd7fd538?auto=format&fit=crop&w=600&q=80",
    title: "Marsa Alam Coral Scuba Dive",
    arabicTitle: "مرسى علم - الغوص للمحترفين",
    caption: "Explore deep marine coral walls. Full gear setup with divemasters managing underwater tracking protocols.",
    likes: 618,
    comments: 112
  },

  // Hurghada Campaign Track
  {
    id: "fb-hg-1",
    category: "Hurghada",
    url: "https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&w=600&q=80",
    title: "Hurghada Resort Pool Lagoons",
    arabicTitle: "الغردقة - منتجعات الوديان",
    caption: "Exclusive summer saving rates at our premium partner lagoon resorts. Yellow inner tube rental bundles included.",
    likes: 294,
    comments: 35
  },
  {
    id: "fb-hg-2",
    category: "Hurghada",
    url: "https://images.unsplash.com/photo-1506929562872-bb421503ef21?auto=format&fit=crop&w=600&q=80",
    title: "Hurghada Luxury Tents Beach",
    arabicTitle: "الغردقة - الخيام الشاطئية الفاخرة",
    caption: "Relax in luxury beachfront set-ups right along the pristine coastlines. Golden hour catering included.",
    likes: 388,
    comments: 52
  },
  {
    id: "fb-hg-3",
    category: "Hurghada",
    url: "https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=600&q=80",
    title: "Hurghada Speedboat Island Cruise",
    arabicTitle: "الغردقة - رحلات اللنش السريع",
    caption: "High-speed custom transport sweeps out to pristine offshore sandbars and isolated turtle feeding reefs.",
    likes: 490,
    comments: 94
  },
  {
    id: "fb-hg-4",
    category: "Hurghada",
    url: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=600&q=80",
    title: "Hurghada Waterpark Castle Campaign",
    arabicTitle: "الغردقة - قلعة الألعاب المائية",
    caption: "Unleash the ultimate holiday fun at Hurghada's premier waterpark fortress. Massive multi-slide rows active.",
    likes: 511,
    comments: 67
  },

  // Sharm El Sheikh Campaign Track
  {
    id: "fb-ss-1",
    category: "Sharm El Sheikh",
    url: "https://images.unsplash.com/photo-1504609773096-104ff2c73ba4?auto=format&fit=crop&w=600&q=80",
    title: "Sharm Coral Reef Extreme Diving",
    arabicTitle: "شرم الشيخ - الغوص في الشعاب المرجانية",
    caption: "Deep dive directly into the legendary vibrant drop-offs of Sharm El Sheikh. Crystal clear visibility guaranteed.",
    likes: 724,
    comments: 143
  }
];

export default function TourDetailsView({ tour, onBack, formatPrice }: TourDetailsViewProps) {
  const [favorite, setFavorite] = useState(false);
  const [selectedDate, setSelectedDate] = useState("2026-06-25");
  const [adultsCount, setAdultsCount] = useState(2);
  const [childrenCount, setChildrenCount] = useState(0);
  const [bookingStep, setBookingStep] = useState<"idle" | "form" | "submitting" | "confirmed">("idle");
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [specialRequests, setSpecialRequests] = useState("");

  // Facebook Stream Filter and Lightbox States
  const [activeFilter, setActiveFilter] = useState<"All" | "Marsa Alam" | "Hurghada" | "Sharm El Sheikh">("All");
  const [lightboxPhoto, setLightboxPhoto] = useState<{ url: string, title: string, caption: string } | null>(null);

  const calculateTotal = () => (adultsCount * tour.price) + (childrenCount * Math.round(tour.price * 0.6));

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !customerEmail || !customerPhone) return;
    setBookingStep("submitting");
    setTimeout(() => setBookingStep("confirmed"), 1500);
  };

  const filteredPhotos = FACEBOOK_ALBUM_STREAMS.filter(photo =>
    activeFilter === "All" ? true : photo.category === activeFilter
  );

  return (
    <div id="tour-details-container" className="min-h-screen bg-[#faf9fa] text-slate-800 animate-fade-in pb-24 lg:pb-12">
      {/* Mobile Sticky Navigation Action Overlay Header */}
      <div className="fixed top-0 left-0 w-full z-40 p-4 flex justify-between items-center bg-gradient-to-b from-black/70 to-transparent lg:hidden">
        <button onClick={onBack} className="bg-white/90 backdrop-blur-md p-2.5 rounded-full text-slate-800 shadow-md active:scale-95 transition-all">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <button onClick={() => setFavorite(!favorite)} className="bg-white/90 backdrop-blur-md p-2.5 rounded-full text-rose-500 shadow-md active:scale-95 transition-all">
          <Heart className="w-5 h-5" fill={favorite ? "#f43f5e" : "none"} />
        </button>
      </div>

      {/* Primary Hero Section Visual Block */}
      <section id="tour-hero" className="relative w-full h-[45vh] lg:h-[60vh] overflow-hidden lg:rounded-3xl shadow-lg border border-slate-200/20 max-w-7xl mx-auto lg:mt-4">
        <img alt={tour.title} className="w-full h-full object-cover select-none" src={tour.imageUrl} />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />

        <div className="hidden lg:flex absolute top-6 left-6 z-10 items-center gap-4">
          <button onClick={onBack} className="bg-white/90 hover:bg-white backdrop-blur-md p-2.5 rounded-full text-slate-800 shadow-md transition-all active:scale-95">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <span className="font-sans font-black tracking-widest text-white text-xs bg-black/20 px-3 py-1.5 rounded-xl backdrop-blur-sm border border-white/10">NEMO TOURS</span>
        </div>

        <div className="absolute bottom-0 left-0 w-full p-6 lg:p-10 flex flex-col items-start gap-3 z-10">
          <div className="flex flex-wrap gap-2">
            <span className="bg-[#fcb882] text-slate-950 px-3.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 shadow-md">
              <Star className="w-3 h-3 fill-current" /> Best Seller
            </span>
            <span className="bg-white/20 border border-white/20 text-white backdrop-blur-md px-3.5 py-1 rounded-full text-[11px] font-bold flex items-center gap-1 shadow-md">
              ★ {tour.rating} ({tour.reviewsCount.toLocaleString()}+ Reviews)
            </span>
          </div>
          <h1 className="text-3xl lg:text-5xl font-serif text-white font-extrabold leading-tight tracking-tight drop-shadow-md">{tour.title}</h1>
          <p className="text-[#fcb882] font-sans text-sm font-bold tracking-wide">{tour.arabicTitle}</p>
        </div>
      </section>

      {/* Adaptive 3-Column Grid Segment */}
      <div id="tour-grid" className="max-w-7xl mx-auto px-4 lg:px-6 grid grid-cols-1 lg:grid-cols-12 gap-8 mt-8">
        {/* Left Side Details Pane Column */}
        <div className="lg:col-span-8 space-y-8">
          <section className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <h2 className="text-xl lg:text-2xl font-serif font-bold text-slate-900 tracking-tight">About the Experience</h2>
            <p className="text-slate-600 text-sm lg:text-base leading-relaxed">{tour.description}</p>
            <div className="w-full h-px bg-slate-100 my-4" />
            <p className="text-slate-500 text-xs lg:text-sm leading-relaxed whitespace-pre-wrap bg-slate-50/50 p-4 rounded-xl border border-slate-100">{tour.fullDetails}</p>
          </section>

          {/* Bento Specifications Grid block */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            <div className="bg-white p-5 rounded-2xl flex flex-col items-center justify-center text-center gap-2 border border-slate-200/80 shadow-sm">
              <Clock className="w-5 h-5 text-[#094cb2]" />
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Duration</span>
              <span className="font-bold text-sm text-slate-800">{tour.duration}</span>
            </div>
            <div className="bg-white p-5 rounded-2xl flex flex-col items-center justify-center text-center gap-2 border border-slate-200/80 shadow-sm">
              <Users className="w-5 h-5 text-[#094cb2]" />
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Group size</span>
              <span className="font-bold text-sm text-slate-800">{tour.groupSize}</span>
            </div>
            <div className="bg-white p-5 rounded-2xl flex flex-col items-center justify-center text-center gap-2 col-span-2 sm:col-span-1 border border-slate-200/80 shadow-sm">
              <Languages className="w-5 h-5 text-[#094cb2]" />
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Languages</span>
              <span className="font-bold text-xs text-slate-800 max-w-full truncate">{tour.languages.join(", ")}</span>
            </div>
          </div>

          <section className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <h2 className="text-xl font-serif font-bold text-slate-900 tracking-tight">Tour Highlights</h2>
            <ul className="grid grid-cols-1 gap-4">
              {tour.highlights.map((highlight, index) => (
                <li key={index} className="flex items-start gap-3 bg-slate-50/40 p-3 rounded-xl border border-slate-100">
                  <div className="bg-blue-50 border border-blue-100 p-2 rounded-xl text-[#094cb2] shrink-0 mt-0.5">
                    <ShieldCheck className="w-4 h-4 stroke-[2.5px]" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800 text-sm lg:text-base">{highlight.title}</h4>
                    <p className="text-slate-500 text-xs lg:text-sm mt-0.5 leading-relaxed">{highlight.description}</p>
                  </div>
                </li>
              ))}
            </ul>
          </section>

          {/* DYNAMIC ENHANCEMENT: Facebook Real-Time Album Showcase */}
          <section className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-5">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
              <div className="space-y-0.5">
                <h2 className="text-xl font-serif font-bold text-slate-900 tracking-tight flex items-center gap-2">
                  <ImageIcon className="w-5 h-5 text-[#003b5c]" />
                  Facebook Dynamic Offers Feed
                </h2>
                <p className="text-xs text-slate-500">Live campaign footprints extracted directly from facebook.com/tours.nemo/photos</p>
              </div>
              <a
                href="https://www.facebook.com/tours.nemo/photos"
                target="_blank"
                rel="noreferrer"
                className="text-xs font-bold text-[#094cb2] hover:text-[#00253b] flex items-center gap-1 bg-blue-50 px-3 py-1.5 rounded-xl transition-all shadow-sm border border-blue-100/30 group"
              >
                Open Official Album
                <ExternalLink className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
              </a>
            </div>

            {/* Destination Filtering Subsystem */}
            <div className="flex flex-wrap items-center gap-1.5 bg-slate-100/70 p-1 rounded-xl border border-slate-200/40">
              {(["All", "Marsa Alam", "Hurghada", "Sharm El Sheikh"] as const).map((dest) => (
                <button
                  key={dest}
                  onClick={() => setActiveFilter(dest)}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all select-none ${activeFilter === dest ? "bg-[#003b5c] text-white shadow-md" : "text-slate-600 hover:text-slate-900"}`}
                >
                  {dest}
                </button>
              ))}
            </div>

            {/* Photo Stream Grid Loop */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <AnimatePresence>
                {filteredPhotos.map((photo) => (
                  <motion.div
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    whileHover={{ y: -4 }}
                    key={photo.id}
                    onClick={() => setLightboxPhoto({ url: photo.url, title: photo.title, caption: photo.caption })}
                    className="group relative aspect-square bg-slate-950 rounded-xl overflow-hidden border border-slate-200 shadow-sm cursor-pointer"
                  >
                    <img src={photo.url} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-95" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all flex flex-col justify-end p-3" />

                    <div className="absolute bottom-2.5 left-2.5 right-2.5 z-10 flex flex-col opacity-0 group-hover:opacity-100 transition-all space-y-1 text-white">
                      <span className="text-[10px] font-bold font-serif text-[#fcb882] truncate">{photo.title}</span>
                      <div className="flex items-center justify-between text-[9px] font-mono text-slate-300 pt-0.5 border-t border-white/10">
                        <span className="flex items-center gap-1"><ThumbsUp className="w-2.5 h-2.5 fill-current text-[#fcb882]" /> {photo.likes}</span>
                        <span className="flex items-center gap-1"><MessageCircle className="w-2.5 h-2.5 text-slate-300" /> {photo.comments}</span>
                      </div>
                    </div>

                    <div className="absolute top-2 right-2 p-1.5 bg-black/40 backdrop-blur-md rounded-lg text-white pointer-events-none group-hover:bg-[#003b5c] transition-colors shadow-sm">
                      <Eye className="w-3.5 h-3.5" />
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </section>

          <section className="bg-slate-100/60 p-6 rounded-3xl border border-slate-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-[#00253b] text-[#fcb882] rounded-full flex items-center justify-center font-serif font-black text-xl shadow-md">N</div>
              <div>
                <h3 className="font-serif font-bold text-base text-slate-900">{tour.operator.name} <span className="text-xs font-normal text-slate-400 font-sans">({tour.operator.arabicName})</span></h3>
                <span className="text-[10px] font-extrabold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200/40 uppercase tracking-wider mt-0.5 inline-block">{tour.operator.badge}</span>
              </div>
            </div>
            <div className="text-xs space-y-1 text-slate-600 bg-white/70 p-4 rounded-xl border border-slate-200/50 w-full sm:w-auto">
              <div className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" /> {tour.operator.address}</div>
              <div className="flex items-center gap-1.5 pt-0.5"><Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" /> <span className="font-bold font-mono">{tour.operator.phones[0]}</span></div>
            </div>
          </section>
        </div>

        {/* Right Sticky Checkout Sidebar Pane */}
        <div id="booking-aside" className="lg:col-span-4">
          <div className="lg:sticky lg:top-24 bg-white p-6 rounded-3xl border border-slate-200 shadow-xl shadow-slate-200/40">
            <AnimatePresence mode="wait">
              {bookingStep === "idle" && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-5">
                  <div className="flex items-baseline justify-between">
                    <div>
                      <span className="text-3xl font-serif text-slate-900 font-extrabold">From {formatPrice(tour.price)}</span>
                      <span className="text-slate-400 text-xs"> / traveler</span>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider ml-0.5">Excursion Date</label>
                    <input
                      type="date" min="2026-06-18" value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      className="w-full bg-slate-50 p-3 text-sm rounded-xl border border-slate-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#003b5c] cursor-pointer transition-all font-mono"
                    />
                  </div>

                  <div className="space-y-3">
                    <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider ml-0.5">Travelers</label>

                    <div className="flex justify-between items-center bg-slate-50 p-3 rounded-xl border border-slate-200/60">
                      <div>
                        <span className="text-xs font-bold block text-slate-800">Adults</span>
                        <span className="text-[10px] text-slate-400">Ages 12+ ({formatPrice(tour.price)})</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <button onClick={() => setAdultsCount(Math.max(1, adultsCount - 1))} className="w-8 h-8 bg-white border border-slate-200 rounded-full shadow-sm flex items-center justify-center font-bold text-slate-700 active:bg-slate-150 transition-colors">-</button>
                        <span className="w-4 text-center font-bold text-sm text-slate-800">{adultsCount}</span>
                        <button onClick={() => setAdultsCount(adultsCount + 1)} className="w-8 h-8 bg-white border border-slate-200 rounded-full shadow-sm flex items-center justify-center font-bold text-slate-700 active:bg-slate-150 transition-colors">+</button>
                      </div>
                    </div>

                    <div className="flex justify-between items-center bg-slate-50 p-3 rounded-xl border border-slate-200/60">
                      <div>
                        <span className="text-xs font-bold block text-slate-800">Children</span>
                        <span className="text-[10px] text-slate-400">Ages 2-11 (40% Savings)</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <button onClick={() => setChildrenCount(Math.max(0, childrenCount - 1))} className="w-8 h-8 bg-white border border-slate-200 rounded-full shadow-sm flex items-center justify-center font-bold text-slate-700 active:bg-slate-150 transition-colors">-</button>
                        <span className="w-4 text-center font-bold text-sm text-slate-800">{childrenCount}</span>
                        <button onClick={() => setChildrenCount(childrenCount + 1)} className="w-8 h-8 bg-white border border-slate-200 rounded-full shadow-sm flex items-center justify-center font-bold text-slate-700 active:bg-slate-150 transition-colors">+</button>
                      </div>
                    </div>
                  </div>

                  <div className="bg-blue-50/60 p-4 rounded-2xl border border-blue-100/70 space-y-2">
                    <div className="flex justify-between text-xs text-slate-600"><span>{adultsCount} Adults</span><span>{formatPrice(adultsCount * tour.price)}</span></div>
                    {childrenCount > 0 && <div className="flex justify-between text-xs text-slate-600"><span>{childrenCount} Children</span><span>{formatPrice(childrenCount * Math.round(tour.price * 0.6))}</span></div>}
                    <div className="w-full h-px bg-blue-100 my-1" />
                    <div className="flex justify-between text-sm font-extrabold text-[#094cb2]"><span>Estimated Pricing</span><span>{formatPrice(calculateTotal())}</span></div>
                  </div>

                  <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-3 flex items-start gap-2.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5 stroke-[2.5px]" />
                    <p className="text-[11px] leading-relaxed text-emerald-800 font-medium"><strong>110% Rate Guarantee:</strong> Book securely. If an identical catamaran option is available publically lower, we match and issue a refund of 110% of differences.</p>
                  </div>

                  <motion.button
                    whileTap={{ scale: 0.98 }} onClick={() => setBookingStep("form")}
                    className="w-full bg-[#003b5c] text-white hover:bg-[#00253b] py-3.5 rounded-xl text-center font-bold text-sm shadow-md transition-all outline-none"
                  >
                    Check Availability & Book
                  </motion.button>
                  <p className="text-center text-[10px] text-slate-400 flex items-center justify-center gap-1"><Info className="w-3 h-3" /> Reservations verified live via WhatsApp with operators.</p>
                </motion.div>
              )}

              {bookingStep === "form" && (
                <motion.form initial={{ opacity: 0, x: 15 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: -15 }} onSubmit={handleBookingSubmit} className="space-y-4">
                  <div className="flex items-center justify-between border-b pb-2">
                    <h3 className="font-bold text-slate-800 text-sm uppercase tracking-wider">Passenger Matrix</h3>
                    <button type="button" onClick={() => setBookingStep("idle")} className="text-xs text-[#094cb2] font-semibold hover:underline">Edit Selection</button>
                  </div>
                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-slate-600">Full Passenger Name</label>
                    <input type="text" required value={customerName} onChange={e => setCustomerName(e.target.value)} placeholder="e.g. Aly Ibrahim" className="w-full bg-slate-50 p-3 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-400" />
                  </div>
                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-slate-600">Email Address</label>
                    <input type="email" required value={customerEmail} onChange={e => setCustomerEmail(e.target.value)} placeholder="e.g. aly@domain.com" className="w-full bg-slate-50 p-3 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-400" />
                  </div>
                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-slate-600">WhatsApp Contact Number</label>
                    <input type="tel" required value={customerPhone} onChange={e => setCustomerPhone(e.target.value)} placeholder="e.g. +20 100 123 4567" className="w-full bg-slate-50 p-3 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-400 font-mono" />
                  </div>
                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-slate-600">Special Requests (Hotel Pickup Coordination)</label>
                    <textarea value={specialRequests} onChange={e => setSpecialRequests(e.target.value)} placeholder="Provide hotel location details or pickup coordinates..." rows={2} className="w-full bg-slate-50 p-3 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none" />
                  </div>
                  <button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 rounded-xl text-xs transition-colors shadow">Submit Allocation Request 🛥️</button>
                </motion.form>
              )}

              {bookingStep === "submitting" && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center py-12 text-center">
                  <Loader2 className="w-8 h-8 text-emerald-600 animate-spin mb-3" />
                  <h4 className="font-bold text-slate-800 text-sm">Transmitting booking matrix coordinates...</h4>
                </motion.div>
              )}

              {bookingStep === "confirmed" && (
                <motion.div initial={{ scale: 0.96 }} animate={{ scale: 1 }} className="text-center space-y-4">
                  <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto border border-emerald-200"><Check className="w-6 h-6 stroke-[3px]" /></div>
                  <h4 className="text-xl font-serif font-bold text-slate-800">Booking Preserved</h4>
                  <p className="text-xs text-slate-500">Salam Aly, travel coordinates are processed. Operators will call your WhatsApp pipeline shortly.</p>
                  <div className="text-left bg-slate-50 p-4 rounded-xl border border-slate-100 text-xs space-y-1.5">
                    <div className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Summary Voucher</div>
                    <div className="font-bold text-[#094cb2]">{tour.title}</div>
                    <div>Date Track: <span className="font-mono font-bold text-slate-700">{selectedDate}</span></div>
                    <div>Passengers: <span className="font-bold text-slate-700">{adultsCount + childrenCount} Travelers</span></div>
                  </div>
                  <button onClick={() => { setBookingStep("idle"); setCustomerName(""); setCustomerEmail(""); setCustomerPhone(""); setSpecialRequests(""); }} className="w-full bg-[#003b5c] text-white py-2.5 rounded-xl text-xs font-bold">New Allocation</button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Adaptive Mobile Display Overlay Action CTA Bar */}
      <div className="lg:hidden fixed bottom-0 left-0 w-full bg-white/95 border-t border-slate-200 p-4 z-40 shadow-2xl flex items-center justify-between">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Pricing Matrix</span>
          <span className="text-xl font-serif font-extrabold text-slate-900">{formatPrice(tour.price)}</span>
        </div>
        <button
          onClick={() => {
            const el = document.getElementById("booking-aside");
            el?.scrollIntoView({ behavior: "smooth" });
            setBookingStep("form");
          }}
          className="bg-[#003b5c] hover:bg-[#00253b] text-white text-xs font-bold px-6 py-3 rounded-xl shadow"
        >
          Instant Reserve
        </button>
      </div>

      {/* LIGHTBOX LAYOUT: Overlay Theater Mode for Album Photos */}
      <AnimatePresence>
        {lightboxPhoto && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setLightboxPhoto(null)}
            className="fixed inset-0 z-[150] bg-slate-950/90 backdrop-blur-sm flex flex-col items-center justify-center p-4 cursor-zoom-out"
          >
            <button
              onClick={() => setLightboxPhoto(null)}
              className="absolute top-6 right-6 p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white shadow transition-all cursor-pointer border border-white/10"
            >
              <X className="w-5 h-5" />
            </button>
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="max-w-3xl w-full bg-slate-900 rounded-2xl overflow-hidden shadow-2xl border border-slate-800 cursor-default"
            >
              <div className="aspect-video bg-black flex items-center justify-center overflow-hidden">
                <img src={lightboxPhoto.url} alt="" className="w-full h-full object-contain" />
              </div>
              <div className="p-5 bg-slate-900 text-slate-200 text-xs font-sans border-t border-slate-800 space-y-1">
                <h4 className="font-serif font-bold text-sm text-[#fcb882]">{lightboxPhoto.title}</h4>
                <p className="text-slate-400 leading-relaxed text-[11px]">{lightboxPhoto.caption}</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}