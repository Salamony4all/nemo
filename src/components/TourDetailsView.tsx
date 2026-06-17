import React, { useState } from "react";
import { TourOffer, BookingDetails } from "../types";
import { 
  ArrowLeft, Heart, Star, Calendar, Users, Languages, 
  Clock, Utensils, MapPin, Phone, ShieldCheck, Check, 
  Info, Loader2, Sparkles 
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface TourDetailsViewProps {
  tour: TourOffer;
  onBack: () => void;
  formatPrice: (priceInUsd: number) => string;
}

export default function TourDetailsView({ tour, onBack, formatPrice }: TourDetailsViewProps) {
  const [favorite, setFavorite] = useState(false);
  const [selectedDate, setSelectedDate] = useState("2026-06-25");
  const [adultsCount, setAdultsCount] = useState(2);
  const [childrenCount, setChildrenCount] = useState(0);
  
  // Checkout state
  const [bookingStep, setBookingStep] = useState<"idle" | "form" | "submitting" | "confirmed">("idle");
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [specialRequests, setSpecialRequests] = useState("");

  const calculateTotal = () => {
    return (adultsCount * tour.price) + (childrenCount * Math.round(tour.price * 0.6));
  };

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !customerEmail || !customerPhone) return;

    setBookingStep("submitting");
    setTimeout(() => {
      setBookingStep("confirmed");
    }, 1200);
  };

  return (
    <div id="tour-details-container" className="min-h-screen bg-[#faf9fa] text-[#1b1c1d] animate-fade-in-up pb-24 lg:pb-12">
      {/* Mobile Top Actions Floating bar */}
      <div className="fixed top-0 left-0 w-full z-40 p-4 flex justify-between items-center bg-gradient-to-b from-black/60 to-transparent lg:hidden">
        <button 
          id="btn-back-floating"
          onClick={onBack}
          className="bg-white/90 backdrop-blur-md p-2.5 rounded-full text-[#1b1c1d] shadow-md active:scale-95 transition-transform"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <button 
          id="btn-fav-floating"
          onClick={() => setFavorite(!favorite)}
          className="bg-white/90 backdrop-blur-md p-2.5 rounded-full text-red-500 shadow-md active:scale-95 transition-transform"
        >
          <Heart className="w-5 h-5" fill={favorite ? "#ef4444" : "none"} />
        </button>
      </div>

      {/* Hero Head Banner */}
      <section id="tour-hero" className="relative w-full h-[50vh] lg:h-[65vh] overflow-hidden lg:rounded-2xl shadow-md lg:mb-8">
        <img 
          alt={tour.title} 
          className="w-full h-full object-cover select-none" 
          src={tour.imageUrl} 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
        
        {/* Desktop Header bar floating back */}
        <div className="hidden lg:flex absolute top-6 left-6 z-10 items-center gap-4">
          <button 
            id="btn-back-desktop"
            onClick={onBack}
            className="bg-white/80 hover:bg-white/100 backdrop-blur-md p-2.5 rounded-full text-[#1b1c1d] shadow-sm transition-all active:scale-95"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <span className="font-display font-bold tracking-wider text-white text-sm">NEMO TOURS</span>
        </div>

        {/* Hero content details aligned at bottom */}
        <div className="absolute bottom-0 left-0 w-full p-6 lg:p-10 flex flex-col items-start gap-4">
          <div className="flex flex-wrap gap-2">
            <div className="bg-[#fcb882] text-[#2f1500] px-3.5 py-1 rounded-full text-xs font-label font-semibold flex items-center gap-1 shadow-sm">
              <Star className="w-3.5 h-3.5 fill-current" />
              Best Seller
            </div>
            <div className="bg-white/85 backdrop-blur-md text-[#191c1d] px-3.5 py-1 rounded-full text-xs font-label font-medium flex items-center gap-1 shadow-sm">
              <Star className="w-3.5 h-3.5 text-[#7e5705] fill-[#7e5705]" />
              {tour.rating} ({tour.reviewsCount.toLocaleString()}+ Reviews)
            </div>
          </div>
          
          <h1 className="text-2xl lg:text-5xl font-serif text-white font-bold leading-tight drop-shadow-sm select-none">
            {tour.title}
          </h1>
          <p className="text-amber-300 font-display text-sm tracking-wide font-medium">
            {tour.arabicTitle}
          </p>
        </div>
      </section>

      {/* Main content grid */}
      <div id="tour-grid" className="max-w-7xl mx-auto px-4 lg:px-6 grid grid-cols-1 lg:grid-cols-3 gap-8 mt-6">
        
        {/* Left main details column */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Detailed About */}
          <section id="tour-about" className="bg-white p-6 rounded-2xl shadow-sm border border-[#e1e3e4]/40">
            <h2 className="text-xl lg:text-2xl font-serif font-semibold text-[#191c1d] mb-4">About the Experience</h2>
            <p className="font-sans text-[#42474e] leading-relaxed text-base">
              {tour.description}
            </p>
            <div className="w-full h-[1px] bg-slate-100 my-4" />
            <p className="font-sans text-[#42474e] leading-relaxed text-sm">
              {tour.fullDetails}
            </p>
          </section>

          {/* Quick Info Bento Grid */}
          <section id="tour-bento" className="space-y-4">
            <h2 className="text-lg font-serif font-semibold text-[#191c1d]">Quick Information</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div className="bg-slate-50 p-4 rounded-xl flex flex-col items-center justify-center text-center gap-2 border border-slate-100">
                <Clock className="w-6 h-6 text-[#094cb2]" />
                <span className="font-label text-xs text-[#72787e]">Duration</span>
                <span className="font-sans font-semibold text-sm text-[#191c1d]">{tour.duration}</span>
              </div>
              <div className="bg-slate-50 p-4 rounded-xl flex flex-col items-center justify-center text-center gap-2 border border-slate-100">
                <Users className="w-6 h-6 text-[#094cb2]" />
                <span className="font-label text-xs text-[#72787e]">Group Size</span>
                <span className="font-sans font-semibold text-sm text-[#191c1d]">{tour.groupSize}</span>
              </div>
              <div className="bg-slate-50 p-4 rounded-xl flex flex-col items-center justify-center text-center gap-2 col-span-2 md:col-span-1 border border-slate-100">
                <Languages className="w-6 h-6 text-[#094cb2]" />
                <span className="font-label text-xs text-[#72787e]">Languages</span>
                <span className="font-sans font-semibold text-xs text-[#191c1d] leading-tight">
                  {tour.languages.join(", ")}
                </span>
              </div>
            </div>
          </section>

          {/* Highlights Checklist */}
          <section id="tour-highlights" className="bg-white p-6 rounded-2xl shadow-sm border border-[#e1e3e4]/40">
            <h2 className="text-xl font-serif font-semibold text-[#191c1d] mb-4">Tour Highlights</h2>
            <ul className="space-y-5">
              {tour.highlights.map((highlight, index) => (
                <li key={index} className="flex items-start gap-4">
                  <div className="bg-blue-50 p-2 rounded-full text-[#094cb2] mt-0.5 border border-blue-100">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-sans font-medium text-[#191c1d] text-base">{highlight.title}</h4>
                    <p className="font-sans text-sm text-[#42474e] mt-1">{highlight.description}</p>
                  </div>
                </li>
              ))}
            </ul>
          </section>

          {/* Verified Operator Info */}
          <section id="tour-operator" className="bg-[#edeeef]/60 p-6 rounded-2xl border border-slate-200">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-[#00253b] rounded-full flex items-center justify-center text-[#ffdcc3] font-serif font-bold text-lg shadow-sm">
                  N
                </div>
                <div>
                  <h3 className="font-serif font-bold text-lg text-[#191c1d]">
                    {tour.operator.name} <span className="text-xs font-normal text-slate-500 font-sans">({tour.operator.arabicName})</span>
                  </h3>
                  <p className="font-label text-xs text-[#795200] font-semibold uppercase tracking-wider">
                    {tour.operator.badge}
                  </p>
                </div>
              </div>
              <div className="bg-emerald-50 text-emerald-800 text-xs font-semibold px-2.5 py-1 rounded border border-emerald-200">
                ● Operator Active
              </div>
            </div>
            
            <p className="font-sans text-sm text-[#42474e] mb-6 italic bg-white/55 p-3 rounded-xl border border-slate-100 leading-relaxed">
              "{tour.operator.bio}"
            </p>

            <div className="space-y-4 text-xs font-sans text-slate-700">
              <div className="flex items-start gap-3">
                <MapPin className="w-4.5 h-4.5 text-[#00253b] shrink-0 mt-0.5" />
                <span>{tour.operator.address}</span>
              </div>
              <div className="flex flex-wrap gap-4 pt-1 items-center">
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-[#00253b]" />
                  <span className="font-semibold">{tour.operator.phones[0]}</span>
                </div>
                {tour.operator.phones[1] && (
                  <div className="flex items-center gap-2 font-semibold">
                    <span className="text-slate-300">|</span>
                    <span>{tour.operator.phones[1]}</span>
                  </div>
                )}
              </div>
            </div>
          </section>
        </div>

        {/* Right column Booking state block (Sticky on Desktop) */}
        <div id="booking-aside" className="relative lg:col-span-1">
          <div className="lg:sticky lg:top-24 bg-white p-6 rounded-2xl shadow-lg border border-slate-200/80">
            
            <AnimatePresence mode="wait">
              {bookingStep === "idle" && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  key="booking-selector"
                  className="space-y-5"
                >
                  <div className="flex items-baseline justify-between">
                    <div>
                      <span className="font-serif text-3xl font-extrabold text-[#191c1d]">From {formatPrice(tour.price)}</span>
                      <span className="font-sans text-[#42474e] text-xs"> / person</span>
                    </div>
                    <span className="text-xs text-amber-700 font-semibold bg-amber-50 px-2 py-0.5 rounded">Special Rate</span>
                  </div>

                  {/* Calendar / Date Selector */}
                  <div className="space-y-2">
                    <label className="block text-xs font-semibold text-slate-600 font-label">Select Excursion Date</label>
                    <div className="relative">
                      <input 
                        type="date"
                        min="22026-06-18"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        className="w-full bg-[#f3f4f5] p-3 text-sm rounded-lg border border-slate-200 focus:outline-[#094cb2]"
                      />
                    </div>
                  </div>

                  {/* Guests incrementers */}
                  <div className="space-y-3">
                    <label className="block text-xs font-semibold text-slate-600 font-label">Passengers / Travelers</label>
                    
                    {/* Adults */}
                    <div className="flex justify-between items-center bg-[#f3f4f5]/65 p-3 rounded-lg border border-slate-100">
                      <div>
                        <span className="text-xs font-bold block text-slate-800">Adults</span>
                        <span className="text-[10px] text-slate-500">Age 12+ ({formatPrice(tour.price)})</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <button 
                          onClick={() => setAdultsCount(Math.max(1, adultsCount - 1))}
                          className="w-7 h-7 bg-white rounded-full shadow flex items-center justify-center font-bold text-slate-700"
                        >
                          -
                        </button>
                        <span className="w-4 text-center font-bold text-sm text-slate-800">{adultsCount}</span>
                        <button 
                          onClick={() => setAdultsCount(adultsCount + 1)}
                          className="w-7 h-7 bg-white rounded-full shadow flex items-center justify-center font-bold text-slate-700"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    {/* Children */}
                    <div className="flex justify-between items-center bg-[#f3f4f5]/65 p-3 rounded-lg border border-slate-100">
                      <div>
                        <span className="text-xs font-bold block text-slate-800">Children</span>
                        <span className="text-[10px] text-slate-500">Under 12 (40% discount)</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <button 
                          onClick={() => setChildrenCount(Math.max(0, childrenCount - 1))}
                          className="w-7 h-7 bg-white rounded-full shadow flex items-center justify-center font-bold text-slate-700"
                        >
                          -
                        </button>
                        <span className="w-4 text-center font-bold text-sm text-slate-800">{childrenCount}</span>
                        <button 
                          onClick={() => setChildrenCount(childrenCount + 1)}
                          className="w-7 h-7 bg-white rounded-full shadow flex items-center justify-center font-bold text-slate-700"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Summary math */}
                  <div className="bg-blue-50/50 p-4 rounded-xl space-y-2 border border-blue-100">
                    <div className="flex justify-between text-xs text-slate-600">
                      <span>{adultsCount} Adults</span>
                      <span>{formatPrice(adultsCount * tour.price)}</span>
                    </div>
                    {childrenCount > 0 && (
                      <div className="flex justify-between text-xs text-slate-600">
                        <span>{childrenCount} Children</span>
                        <span>{formatPrice(childrenCount * Math.round(tour.price * 0.6))}</span>
                      </div>
                    )}
                    <div className="w-full h-[1px] bg-blue-100 my-2" />
                    <div className="flex justify-between text-sm font-bold text-[#094cb2]">
                      <span>Total Price Estimate</span>
                      <span>{formatPrice(calculateTotal())}</span>
                    </div>
                  </div>

                  {/* Lowest rate badge */}
                  <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-3 flex items-start gap-2.5">
                    <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                    <div className="space-y-0.5">
                      <span className="text-[11px] font-bold text-slate-800 uppercase block tracking-wider">110% Lowest Price Guarantee</span>
                      <p className="text-[10px] leading-relaxed text-slate-600">
                        Book with confidence! If you find a cheaper public rate for the exact same catamaran excursion, we will match it and return 110% of the difference.
                      </p>
                    </div>
                  </div>

                  <button 
                    id="btn-trigger-checkout"
                    onClick={() => setBookingStep("form")}
                    className="w-full bg-[#003b5c] text-white hover:bg-[#00253b] font-display font-semibold transition-all py-3.5 rounded-xl text-center cursor-pointer shadow-md active:scale-98"
                  >
                    Check Availability & Book
                  </button>
                  <p className="text-center font-sans text-[10px] text-slate-500 flex items-center justify-center gap-1">
                    <Info className="w-3 h-3 inline" /> No charge until confirmed with Nemo crew via WhatsApp
                  </p>
                </motion.div>
              )}

              {/* Booking checkout details Form */}
              {bookingStep === "form" && (
                <motion.form 
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: -20 }}
                  key="booking-form"
                  onSubmit={handleBookingSubmit}
                  className="space-y-4"
                >
                  <div className="flex items-center justify-between border-b pb-2">
                    <h3 className="font-serif font-bold text-lg text-slate-800">Traveler Details</h3>
                    <button 
                      type="button"
                      onClick={() => setBookingStep("idle")}
                      className="text-xs text-[#094cb2] underline font-medium"
                    >
                      Change selection
                    </button>
                  </div>

                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-slate-700">Full Name</label>
                    <input 
                      type="text"
                      required
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="e.g. Aly Ibrahim"
                      className="w-full bg-slate-50 p-2.5 text-xs rounded border border-slate-200 focus:ring-1 focus:ring-blue-400 focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-slate-700">Email Address</label>
                    <input 
                      type="email"
                      required
                      value={customerEmail}
                      onChange={(e) => setCustomerEmail(e.target.value)}
                      placeholder="e.g. ibrahim@gmail.com"
                      className="w-full bg-slate-50 p-2.5 text-xs rounded border border-slate-200 focus:ring-1 focus:ring-blue-400 focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-slate-700">WhatsApp / Phone Number</label>
                    <input 
                      type="tel"
                      required
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      placeholder="e.g. +20 100 123 4567"
                      className="w-full bg-slate-50 p-2.5 text-xs rounded border border-slate-200 focus:ring-1 focus:ring-blue-400 focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-slate-700">Special Notes (Optional)</label>
                    <textarea 
                      value={specialRequests}
                      onChange={(e) => setSpecialRequests(e.target.value)}
                      placeholder="e.g. Preferred menu, pick up coordinate..."
                      rows={2}
                      className="w-full bg-slate-50 p-2 text-xs rounded border border-slate-200 focus:ring-1 focus:ring-blue-400 focus:outline-none resize-none"
                    />
                  </div>

                  <div className="bg-slate-100 p-2.5 rounded text-[11px] text-slate-600">
                    <div>Selected: <span className="font-bold text-slate-800">{selectedDate}</span></div>
                    <div>Travelers: <span className="font-bold text-slate-800">{adultsCount} Adults, {childrenCount} Children</span></div>
                    <div className="mt-1">Estimated Total: <span className="font-bold text-[#094cb2]">{formatPrice(calculateTotal())}</span></div>
                  </div>

                  <button 
                    type="submit"
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-display font-medium py-3 rounded-lg text-xs leading-none shadow transition-colors block text-center"
                  >
                    Send Reservation Request 🛥️
                  </button>
                </motion.form>
              )}

              {/* Loading progress spinner */}
              {bookingStep === "submitting" && (
                <motion.div 
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  key="booking-loader"
                  className="flex flex-col items-center justify-center py-12 text-center"
                >
                  <Loader2 className="w-10 h-10 text-emerald-600 animate-spin mb-4" />
                  <h4 className="font-serif font-bold text-base text-slate-800">Transmitting details to Nemo Tours...</h4>
                  <p className="text-xs text-slate-500 mt-2">Checking boat slot allocation for {selectedDate}</p>
                </motion.div>
              )}

              {/* Confirmed booking card */}
              {bookingStep === "confirmed" && (
                <motion.div 
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  key="booking-success"
                  className="flex flex-col items-center justify-center p-3 text-center space-y-4"
                >
                  <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-1">
                    <Check className="w-8 h-8" />
                  </div>
                  <h4 className="font-serif font-bold text-xl text-slate-800">Booking Reserved!</h4>
                  <p className="text-xs text-slate-600">
                    Salam Aly, your tour request for <span className="font-bold text-slate-800">{selectedDate}</span> is pre-allocated successfully.
                  </p>
                  
                  <div className="text-left bg-slate-50 p-4 rounded-xl w-full text-xs space-y-1.5 border border-slate-100">
                    <div className="text-slate-500 text-[10px] tracking-wider uppercase">Voucher Summary</div>
                    <div className="font-bold text-[#094cb2] text-sm">{tour.title}</div>
                    <div>Name: <span className="font-bold text-slate-800">{customerName}</span></div>
                    <div>Passengers: <span className="font-bold text-slate-800">{adultsCount + childrenCount} Passengers</span></div>
                    <div>We will message you at <span className="font-bold text-emerald-700">{customerPhone}</span> to finalize custom pickups.</div>
                  </div>

                  <button 
                    onClick={() => {
                      setBookingStep("idle");
                      setCustomerName("");
                      setCustomerEmail("");
                      setCustomerPhone("");
                      setSpecialRequests("");
                    }}
                    className="w-full bg-[#003b5c] text-white hover:bg-[#00253b] font-display font-medium text-xs py-2.5 rounded-lg shadow"
                  >
                    Book another excursion
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

          </div>
        </div>

      </div>

      {/* Mobile Sticky CTA bar overlay */}
      <div className="lg:hidden fixed bottom-0 left-0 w-full bg-white/95 backdrop-blur-md border-t border-slate-200 p-4 z-40 pb-safe shadow-xl">
        <div className="flex justify-between items-center max-w-md mx-auto">
          <div>
            <span className="font-sans text-[10px] text-slate-500 uppercase tracking-widest block">Excursion Cost</span>
            <span className="font-serif font-extrabold text-[#191c1d] text-xl">From {formatPrice(tour.price)}</span>
          </div>
          <button 
            id="btn-mob-sticky-book"
            onClick={() => {
              // Scrolls to booking widget on mobile or displays checkout
              const widget = document.getElementById("booking-aside");
              if (widget) {
                widget.scrollIntoView({ behavior: "smooth" });
              }
              setBookingStep("form");
            }}
            className="bg-[#003b5c] text-white font-label font-bold text-xs px-8 py-3.5 rounded-xl shadow-lg active:scale-95"
          >
            Instant Reserve
          </button>
        </div>
      </div>
    </div>
  );
}
