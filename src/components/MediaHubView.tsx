import React, { useState, useRef, useEffect } from "react";
import { MediaAsset } from "../types";
import { PRESEEDED_MEDIA } from "../data";
import { Download, Heart, Share2, Play, Volume2, VolumeX, Bookmark, Maximize2, X, Pause, Sparkles, Image as ImageIcon, Film } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface MediaHubViewProps {
  onSaveToBoard: (asset: MediaAsset) => void;
  savedAssetIds: string[];
}

export default function MediaHubView({ onSaveToBoard, savedAssetIds }: MediaHubViewProps) {
  const [mediaList] = useState<MediaAsset[]>(PRESEEDED_MEDIA);
  const [activeReel, setActiveReel] = useState<MediaAsset | null>(PRESEEDED_MEDIA[0]);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [filterType, setFilterType] = useState<"all" | "reel" | "photo">("all");
  const [expandedAsset, setExpandedAsset] = useState<MediaAsset | null>(null);
  const [shareStatus, setShareStatus] = useState<{ [key: string]: boolean }>({});

  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.play().catch(err => console.warn("Playback blocked:", err));
      } else {
        videoRef.current.pause();
      }
    }
  }, [isPlaying, activeReel]);

  const filteredMedia = mediaList.filter(item => filterType === "all" ? true : item.type === filterType);

  const handleShare = (asset: MediaAsset) => {
    const urlToShare = asset.facebookUrl || asset.sourceUrl;
    navigator.clipboard.writeText(urlToShare).then(() => {
      setShareStatus(prev => ({ ...prev, [asset.id]: true }));
      setTimeout(() => setShareStatus(prev => ({ ...prev, [asset.id]: false })), 2000);
    });
  };

  return (
    <div id="media-hub-container" className="max-w-7xl mx-auto px-4 lg:px-6 py-6 space-y-8 animate-fade-in-up">
      <section className="bg-gradient-to-r from-[#003b5c] to-[#001d31] text-white rounded-3xl p-6 lg:p-8 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-1.5 bg-white/10 border border-white/10 text-[#fcb882] px-3.5 py-1 rounded-full text-xs font-semibold backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 fill-current" /> Nautilus Media Hub
          </div>
          <h1 className="text-3xl font-serif font-extrabold tracking-tight">Nemo Tours Live Stream</h1>
          <p className="text-sm text-slate-300 leading-relaxed max-w-2xl">
            Browse vertical travel reels and high-resolution expeditions published directly on
            <a href="https://www.facebook.com/tours.nemo/" target="_blank" rel="noreferrer" className="text-[#fcb882] hover:text-[#fcb882]/80 underline ml-1 font-semibold transition-colors">facebook.com/tours.nemo/</a>.
          </p>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Side Reel Simulation Component */}
        <div className="lg:col-span-5 flex flex-col items-center">
          <div className="w-full max-w-[340px] aspect-[9/16] bg-slate-950 rounded-[36px] overflow-hidden relative shadow-2xl border-[6px] border-slate-900 flex flex-col justify-between">
            {activeReel ? (
              <>
                <div className="absolute inset-0 bg-slate-950 flex items-center justify-center">
                  {activeReel.type === "reel" && activeReel.embedIframeUrl ? (
                    <iframe
                      src={activeReel.embedIframeUrl}
                      title={activeReel.title}
                      className="w-full h-full border-none"
                      scrolling="no"
                      allowFullScreen
                      allow="autoplay; encrypted-media;"
                    />
                  ) : activeReel.type === "reel" ? (
                    <video
                      ref={videoRef}
                      key={activeReel.id}
                      src={activeReel.sourceUrl}
                      autoPlay={isPlaying}
                      loop
                      muted={isMuted}
                      playsInline
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <img src={activeReel.sourceUrl} alt={activeReel.title} className="w-full h-full object-cover" />
                  )}
                  <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-black/90 via-black/40 to-transparent z-10" />
                </div>

                {/* Video Top Floating Widgets overlay */}
                <div className="relative z-20 p-4 flex justify-between items-center w-full bg-gradient-to-b from-black/60 to-transparent">
                  <span className="bg-[#fcb882] text-slate-950 font-bold text-[10px] uppercase tracking-wider px-2.5 py-1 rounded-md shadow-sm">
                    {activeReel.type}
                  </span>
                  <div className="flex items-center gap-1.5">
                    {activeReel.type === "reel" && (
                      <button onClick={() => setIsMuted(!isMuted)} className="bg-black/40 hover:bg-black/60 text-white p-2 rounded-full transition-colors backdrop-blur-md">
                        {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                      </button>
                    )}
                    <button onClick={() => setIsPlaying(!isPlaying)} className="bg-black/40 hover:bg-black/60 text-white p-2 rounded-full transition-colors backdrop-blur-md">
                      {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
                    </button>
                    <button onClick={() => setExpandedAsset(activeReel)} className="bg-[#094cb2] hover:bg-[#073ca1] text-white p-2 rounded-full transition-colors backdrop-blur-md">
                      <Maximize2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Bottom Video Metadata Overlays */}
                <div className="relative z-20 p-5 mt-auto text-white space-y-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 bg-[#fcb882] text-slate-950 rounded-full flex items-center justify-center font-extrabold text-sm shadow-md">N</div>
                    <div>
                      <div className="text-xs font-bold leading-tight">Nemo Tours (Verified)</div>
                      <div className="text-[10px] text-slate-300 font-mono">@tours.nemo</div>
                    </div>
                  </div>

                  <p className="text-xs text-slate-200 line-clamp-2 leading-relaxed font-sans">{activeReel.caption}</p>

                  <div className="flex items-center justify-between pt-2 border-t border-white/10 text-[10px] text-slate-300 font-medium">
                    <span>{activeReel.likesCount.toLocaleString()} likes • {activeReel.sharesCount} shares</span>
                    <span className="font-mono text-slate-400">{activeReel.publishDate}</span>
                  </div>

                  <div className="flex gap-2 pt-1">
                    <motion.button
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleShare(activeReel)}
                      className="flex-1 bg-[#fcb882] hover:bg-[#e5a26c] text-slate-950 py-2.5 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow"
                    >
                      <Share2 className="w-3.5 h-3.5" />
                      {shareStatus[activeReel.id] ? "Link Copied!" : "Share Content"}
                    </motion.button>
                    <button
                      onClick={() => onSaveToBoard(activeReel)}
                      className={`p-2.5 rounded-xl border transition-all ${savedAssetIds.includes(activeReel.id) ? "bg-emerald-600 border-transparent text-white" : "bg-white/10 border-white/10 hover:bg-white/20 text-white"}`}
                    >
                      <Bookmark className="w-4 h-4" fill={savedAssetIds.includes(activeReel.id) ? "currentColor" : "none"} />
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-slate-400 p-6 text-center space-y-2">
                <Play className="w-10 h-10 text-slate-600 animate-pulse" />
                <p className="text-xs font-medium">Select an asset card from the timeline gallery to initialize stream media loop.</p>
              </div>
            )}
          </div>
        </div>

        {/* Right Grid Catalog Stream */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between bg-slate-100/80 p-1.5 rounded-2xl border border-slate-200/40">
            <div className="flex gap-1">
              {(["all", "reel", "photo"] as const).map((type) => (
                <button
                  key={type}
                  onClick={() => setFilterType(type)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold tracking-wide uppercase transition-all select-none ${filterType === type ? 'bg-[#003b5c] text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
                >
                  {type}
                </button>
              ))}
            </div>
            <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest px-3 hidden sm:block">Feed Archive</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {filteredMedia.map((asset) => {
              const isActive = activeReel?.id === asset.id;
              const isPinned = savedAssetIds.includes(asset.id);

              return (
                <div
                  key={asset.id}
                  onClick={() => setActiveReel(asset)}
                  className={`bg-white rounded-2xl overflow-hidden border p-3 flex flex-col justify-between transition-all duration-300 cursor-pointer ${isActive ? "border-[#003b5c] ring-4 ring-[#003b5c]/5 shadow-md" : "border-slate-200/70 hover:border-slate-300 hover:shadow-md"}`}
                >
                  <div className="space-y-3">
                    <div className="relative aspect-video rounded-xl overflow-hidden bg-slate-950 group shadow-inner">
                      {asset.type === "reel" ? (
                        <video src={asset.sourceUrl} muted playsInline className="w-full h-full object-cover opacity-80" />
                      ) : (
                        <img src={asset.sourceUrl} alt={asset.title} className="w-full h-full object-cover opacity-95 group-hover:scale-102 transition-transform duration-500" />
                      )}
                      <div className="absolute inset-0 bg-black/10 group-hover:bg-black/30 flex items-center justify-center transition-colors">
                        <div className="bg-white/95 p-2.5 rounded-xl text-slate-900 shadow-xl opacity-0 group-hover:opacity-100 transition-all scale-95 group-hover:scale-100 flex items-center gap-1.5 text-xs font-bold">
                          {asset.type === 'reel' ? <Play className="w-3.5 h-3.5 fill-current" /> : <ImageIcon className="w-3.5 h-3.5" />} Load Media
                        </div>
                      </div>
                      {asset.type === "reel" && (
                        <span className="absolute bottom-2 right-2 bg-black/70 backdrop-blur-md text-white font-mono text-[9px] px-2 py-0.5 rounded-md font-bold">
                          {asset.duration}
                        </span>
                      )}
                    </div>

                    <div className="px-1">
                      <h4 className="font-sans font-bold text-xs text-slate-800 line-clamp-1">{asset.title}</h4>
                      <p className="font-sans text-[11px] text-slate-500 line-clamp-2 mt-0.5 leading-relaxed">{asset.caption}</p>
                    </div>
                  </div>

                  <div className="flex gap-2 mt-4 pt-3 border-t border-slate-100" onClick={e => e.stopPropagation()}>
                    <button onClick={() => handleShare(asset)} className="flex-1 bg-slate-50 border border-slate-200 hover:bg-slate-100 text-slate-700 font-bold py-2 rounded-xl text-[11px] flex items-center justify-center gap-1.5 transition-colors">
                      <Share2 className="w-3.5 h-3.5" /> {shareStatus[asset.id] ? "Copied!" : "Share link"}
                    </button>
                    <button onClick={() => onSaveToBoard(asset)} className={`px-3 py-2 rounded-xl border transition-colors ${isPinned ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-white hover:bg-slate-50 text-slate-500 border-slate-200"}`}>
                      <Bookmark className="w-3.5 h-3.5" fill={isPinned ? "currentColor" : "none"} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Theater View Modal Overlay Layer */}
      <AnimatePresence>
        {expandedAsset && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-950/95 backdrop-blur-md z-[100] flex items-center justify-center p-4"
            onClick={() => setExpandedAsset(null)}
          >
            <motion.div
              initial={{ scale: 0.96, y: 15 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.96, y: 15 }}
              className="relative max-w-4xl w-full bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row max-h-[90vh] md:max-h-[80vh]"
              onClick={e => e.stopPropagation()}
            >
              <button onClick={() => setExpandedAsset(null)} className="absolute top-4 right-4 bg-black/50 hover:bg-black/80 text-white p-2.5 rounded-full z-30 shadow transition-colors">
                <X className="w-4 h-4" />
              </button>

              <div className="flex-1 bg-slate-950 flex items-center justify-center p-4 relative aspect-video md:aspect-auto">
                {expandedAsset.type === "reel" && expandedAsset.embedIframeUrl ? (
                  <iframe src={expandedAsset.embedIframeUrl} title={expandedAsset.title} className="w-full h-full max-h-[60vh] md:max-h-full rounded-xl border-none" />
                ) : expandedAsset.type === "reel" ? (
                  <video src={expandedAsset.sourceUrl} controls autoPlay className="w-full h-full object-contain" />
                ) : (
                  <img src={expandedAsset.sourceUrl} alt={expandedAsset.title} className="w-full h-full object-contain" />
                )}
              </div>

              <div className="w-full md:w-80 p-6 bg-slate-900 flex flex-col justify-between border-t md:border-t-0 md:border-l border-slate-800 text-slate-100 overflow-y-auto">
                <div className="space-y-4">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 bg-[#fcb882] text-slate-950 rounded-full flex items-center justify-center font-extrabold text-xs shadow-md">N</div>
                    <div>
                      <div className="text-xs font-bold leading-none">Nemo Tours (Verified)</div>
                      <span className="text-[10px] text-slate-400 font-mono">@tours.nemo</span>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <span className="bg-red-500 text-white font-extrabold text-[9px] uppercase tracking-wider px-2 py-0.5 rounded align-middle">{expandedAsset.type}</span>
                    <span className="text-xs font-mono text-slate-400 align-middle ml-2">{expandedAsset.publishDate}</span>
                    <h3 className="text-base font-bold text-white leading-snug pt-1">{expandedAsset.title}</h3>
                  </div>

                  <p className="text-xs text-slate-300 font-sans leading-relaxed whitespace-pre-line bg-slate-950/50 p-4 rounded-xl border border-slate-800/40 shadow-inner">{expandedAsset.caption}</p>
                </div>

                <div className="space-y-3 pt-4 border-t border-slate-800 mt-6">
                  <div className="flex gap-2">
                    <button onClick={() => handleShare(expandedAsset)} className="flex-1 bg-[#fcb882] hover:bg-[#e5a26c] text-slate-950 font-bold py-3 px-4 rounded-xl text-xs flex items-center justify-center gap-1.5 shadow transition-all active:scale-95">
                      <Share2 className="w-3.5 h-3.5" /> {shareStatus[expandedAsset.id] ? "Copied!" : "Share Content Link"}
                    </button>
                    <button onClick={() => onSaveToBoard(expandedAsset)} className={`p-3 rounded-xl border transition-colors ${savedAssetIds.includes(expandedAsset.id) ? "bg-emerald-600 border-transparent text-white" : "bg-slate-800 border-slate-700 text-slate-400"}`}>
                      <Bookmark className="w-4 h-4" fill={savedAssetIds.includes(expandedAsset.id) ? "currentColor" : "none"} />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}