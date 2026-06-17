import React, { useState, useRef, useEffect } from "react";
import { MediaAsset } from "../types";
import { PRESEEDED_MEDIA } from "../data";
import { 
  Download, Heart, Share2, Play, Volume2, VolumeX, 
  Bookmark, Link, Check, Search, AlertCircle, Loader2, Sparkles,
  Maximize2, X, Pause
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface MediaHubViewProps {
  onSaveToBoard: (asset: MediaAsset) => void;
  savedAssetIds: string[];
}

export default function MediaHubView({ onSaveToBoard, savedAssetIds }: MediaHubViewProps) {
  const [mediaList, setMediaList] = useState<MediaAsset[]>(PRESEEDED_MEDIA);
  const [activeReel, setActiveReel] = useState<MediaAsset | null>(PRESEEDED_MEDIA[0]);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [filterType, setFilterType] = useState<"all" | "reel" | "photo">("all");
  const [expandedAsset, setExpandedAsset] = useState<MediaAsset | null>(null);

  const videoRef = useRef<HTMLVideoElement | null>(null);

  // Synchronize actual video playback with external states
  useEffect(() => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.play().catch(err => {
          console.warn("Autoplay or live play was prevented or failed:", err);
        });
      } else {
        videoRef.current.pause();
      }
    }
  }, [isPlaying, activeReel, isMuted]);

  const filteredMedia = mediaList.filter(item => 
    filterType === "all" ? true : item.type === filterType
  );

  const [shareStatus, setShareStatus] = useState<{[key: string]: boolean}>({});

  // Share link to clipboard
  const handleShare = (asset: MediaAsset) => {
    const urlToShare = asset.facebookUrl || asset.sourceUrl;
    navigator.clipboard.writeText(urlToShare).then(() => {
      setShareStatus(prev => ({ ...prev, [asset.id]: true }));
      setTimeout(() => {
        setShareStatus(prev => ({ ...prev, [asset.id]: false }));
      }, 2000);
    }).catch(err => {
      console.error("Failed to copy link: ", err);
    });
  };

  return (
    <div id="media-hub-container" className="max-w-7xl mx-auto px-4 lg:px-6 py-6 space-y-8 animate-fade-in-up">
      
      {/* Intro Banner */}
      <section className="bg-gradient-to-r from-[#003b5c] to-[#001d31] text-white rounded-2xl p-6 lg:p-8 shadow-md">
        <div className="max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-1.5 bg-[#fcb882]/20 text-[#fcb882] px-3 py-1 rounded-full text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            Nautilus Media Hub
          </div>
          <h1 className="text-2xl lg:text-3xl font-serif font-bold tracking-tight">
            Nemo Tours Facebook Reels & Posts
          </h1>
          <p className="text-xs lg:text-sm text-slate-300 leading-relaxed font-sans">
            Directly browse vertical travel reels and high-resolution island photography published on 
            <a href="https://www.facebook.com/tours.nemo/" target="_blank" rel="noreferrer" className="text-[#fcb882] underline ml-1 font-semibold">
              facebook.com/tours.nemo/
            </a>. Click to watch embedded reels, pin, or share them directly with your crew!
          </p>
        </div>
      </section>

      {/* Main interactive segment: split view. Vertical interactive Reel player on Left, Gallery list on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Interactive Reel Autoplay Player - simulated mobile height */}
        <div className="lg:col-span-5 flex flex-col items-center">
          <div className="w-full max-w-[340px] aspect-[9/16] bg-slate-900 rounded-[28px] overflow-hidden relative shadow-2xl border-4 border-slate-800 flex flex-col justify-between">
            {activeReel ? (
              <>
                {/* Embedded custom video or photo simulation */}
                <div className="absolute inset-0 z-0 bg-slate-950 flex items-center justify-center overflow-hidden">
                  {activeReel.type === "reel" && activeReel.embedIframeUrl ? (
                    <iframe 
                      src={activeReel.embedIframeUrl} 
                      title={activeReel.title}
                      className="w-[267px] h-[476px] max-w-full max-h-full border-none overflow-hidden rounded-xl shadow-lg"
                      scrolling="no" 
                      frameBorder="0" 
                      allowFullScreen={true} 
                      allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
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
                    <img 
                      src={activeReel.sourceUrl} 
                      alt={activeReel.title} 
                      className="w-full h-full object-cover"
                    />
                  )}
                  {/* Subtle dark bottom shade to readable labels */}
                  <div className="absolute inset-x-0 bottom-0 h-44 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
                </div>

                {/* Top overlay controls */}
                <div className="relative z-10 p-4 flex justify-between items-center w-full bg-gradient-to-b from-black/55 to-transparent">
                  <span className="bg-red-500 text-white font-label font-bold text-[10px] uppercase tracking-widest px-2.5 py-0.5 rounded-full">
                    {activeReel.type.toUpperCase()}
                  </span>
                  <div className="flex items-center gap-2">
                    {activeReel.type === "reel" && (
                      <button 
                        onClick={() => setIsMuted(!isMuted)}
                        className="bg-black/40 hover:bg-black/60 text-white p-2 rounded-full cursor-pointer transition-colors"
                        title={isMuted ? "Unmute Sound" : "Mute Sound"}
                      >
                        {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                      </button>
                    )}
                    <button 
                      onClick={() => setIsPlaying(!isPlaying)}
                      className="bg-black/40 hover:bg-black/60 text-white p-2 rounded-full cursor-pointer transition-colors"
                      title={isPlaying ? "Pause Playback" : "Resume Playback"}
                    >
                      {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" fill="currentColor" />}
                    </button>
                    <button 
                      onClick={() => setExpandedAsset(activeReel)}
                      className="bg-[#094cb2] hover:bg-[#073ca1] text-white p-2 rounded-full cursor-pointer transition-colors"
                      title="Watch in Theater Mode"
                    >
                      <Maximize2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Bottom metadata details */}
                <div className="relative z-10 p-5 mt-auto text-white space-y-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 bg-[#fcb882] rounded-full text-[#391b00] flex items-center justify-center font-bold text-xs shadow">
                      N
                    </div>
                    <div>
                      <div className="text-xs font-bold leading-none">Nemo Tours (Verified)</div>
                      <div className="text-[9px] text-slate-300">facebook.com/tours.nemo</div>
                    </div>
                  </div>

                  <p className="text-xs font-sans text-slate-200 line-clamp-3 leading-relaxed whitespace-pre-line">
                    {activeReel.caption}
                  </p>

                  <div className="flex items-center justify-between pt-1 border-t border-white/10">
                    <div className="flex items-center gap-3 text-[10px] text-slate-300">
                      <span>{activeReel.likesCount.toLocaleString()} likes</span>
                      <span>•</span>
                      <span>{activeReel.sharesCount} shares</span>
                    </div>
                    <span className="text-[10px] text-slate-400 font-mono">{activeReel.publishDate}</span>
                  </div>

                  {/* Share and save widgets */}
                  <div className="flex gap-2">
                    <button 
                      onClick={() => handleShare(activeReel)}
                      className="flex-1 bg-[#fcb882] text-slate-900 hover:bg-[#e5a26c] py-2.5 px-3 rounded-xl font-display font-medium text-[11px] flex items-center justify-center gap-1.5 shadow cursor-pointer transition-all active:scale-95"
                    >
                      <Share2 className="w-3.5 h-3.5" /> 
                      {shareStatus[activeReel.id] ? "Link Copied!" : "Share Reel"}
                    </button>
                    {activeReel.facebookUrl && (
                      <a 
                        href={activeReel.facebookUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="p-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center cursor-pointer transition-colors"
                        title="Watch Original Reel on Facebook"
                      >
                        <svg className="w-4 h-4 fill-current text-white" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                      </a>
                    )}
                    <button 
                      onClick={() => onSaveToBoard(activeReel)}
                      className={`p-2.5 rounded-xl flex items-center justify-center cursor-pointer transition-colors ${
                        savedAssetIds.includes(activeReel.id) 
                          ? "bg-emerald-600 text-white" 
                          : "bg-white/15 text-white hover:bg-white/25"
                      }`}
                    >
                      <Bookmark className="w-4 h-4" fill={savedAssetIds.includes(activeReel.id) ? "white" : "none"} />
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-slate-400 p-6 text-center">
                <Play className="w-12 h-12 text-slate-600 mb-3" />
                <p className="text-xs">Select a post or reel from our gallery feed on the right to load into live player</p>
              </div>
            )}
          </div>
          <div className="max-w-[340px] text-center mt-2">
            <span className="text-[11px] font-sans text-slate-500 italic">Autoplay simulation with customized loop playback control</span>
          </div>
        </div>

        {/* Right Gallery Listing & Feeds */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-100 p-2 rounded-xl">
            <div className="flex gap-1.5">
              <button 
                onClick={() => setFilterType("all")} 
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold select-none transition-all ${
                  filterType === "all" ? "bg-[#003b5c] text-white font-bold" : "text-slate-600 hover:bg-slate-200"
                }`}
              >
                All Feed ({mediaList.length})
              </button>
              <button 
                onClick={() => setFilterType("reel")} 
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold select-none transition-all ${
                  filterType === "reel" ? "bg-[#003b5c] text-white font-bold" : "text-slate-600 hover:bg-slate-200"
                }`}
              >
                Reels only
              </button>
              <button 
                onClick={() => setFilterType("photo")} 
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold select-none transition-all ${
                  filterType === "photo" ? "bg-[#003b5c] text-white font-bold" : "text-slate-600 hover:bg-slate-200"
                }`}
              >
                Photos only
              </button>
            </div>
            
            <div className="text-slate-500 text-[10px] font-mono select-none">
              Verified catalog
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {filteredMedia.map((asset) => {
              const isActive = activeReel?.id === asset.id;
              const isPinned = savedAssetIds.includes(asset.id);

              return (
                <div 
                  key={asset.id} 
                  className={`bg-white rounded-xl overflow-hidden border p-3 flex flex-col justify-between transition-all duration-200 ${
                    isActive 
                      ? "border-[#003b5c] ring-2 ring-[#003b5c]/20 shadow-md" 
                      : "border-slate-100 hover:border-slate-300 shadow-sm"
                  }`}
                >
                  <div className="space-y-2">
                    {/* Media Thumbnail */}
                    <div className="relative aspect-video rounded-lg overflow-hidden bg-slate-900 group">
                      {asset.type === "reel" ? (
                        <video src={asset.sourceUrl} muted playsInline className="w-full h-full object-cover opacity-80" />
                      ) : (
                        <img src={asset.sourceUrl} alt={asset.title} className="w-full h-full object-cover opacity-90 group-hover:scale-105 transition-transform" referrerPolicy="no-referrer" />
                      )}
                      
                      {/* Play action indicator */}
                      <button 
                        onClick={() => {
                          setExpandedAsset(asset);
                        }}
                        className="absolute inset-0 bg-black/25 group-hover:bg-black/40 flex items-center justify-center transition-colors text-white cursor-pointer"
                        title={asset.type === "reel" ? "Watch Video Popup" : "View Photo Popup"}
                      >
                        {asset.type === "reel" ? (
                          <div className="bg-[#fcb882] hover:bg-[#e5a26c] text-slate-900 p-3 rounded-full shadow-lg hover:scale-110 active:scale-95 transition-transform">
                            <Play className="w-5 h-5 fill-current" />
                          </div>
                        ) : (
                          <div className="bg-white/95 hover:bg-white text-slate-800 text-[11px] font-bold px-3 py-1.5 rounded-lg shadow transition-all hover:scale-105">
                            View photo
                          </div>
                        )}
                      </button>

                      {/* Play directly in Fullscreen Theater mode */}
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          setExpandedAsset(asset);
                        }}
                        className="absolute top-2 right-2 bg-black/60 hover:bg-[#094cb2] text-white p-1.5 rounded-lg z-10 transition-colors shadow-sm cursor-pointer"
                        title="Watch in Fullscreen Theater Mode"
                      >
                        <Maximize2 className="w-3.5 h-3.5" />
                      </button>

                      {asset.type === "reel" && (
                        <span className="absolute bottom-1.5 right-1.5 bg-black/75 text-white font-mono text-[9px] px-1.5 py-0.5 rounded">
                          {asset.duration}
                        </span>
                      )}
                    </div>

                    {/* Metadata summary */}
                    <div>
                      <h4 className="font-sans font-bold text-xs text-slate-800 line-clamp-1">{asset.title}</h4>
                      <p className="font-sans text-[10px] text-slate-500 line-clamp-2 mt-0.5 leading-snug">{asset.caption}</p>
                    </div>
                  </div>

                  {/* Interactive share and save actions */}
                  <div className="flex gap-1.5 mt-3 pt-2.5 border-t border-slate-100">
                    <button 
                      onClick={() => handleShare(asset)}
                      className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold py-1.5 rounded-lg text-[10px] flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <Share2 className="w-3 h-3" />
                      {shareStatus[asset.id] ? "Copied!" : "Share Link"}
                    </button>
                    {asset.facebookUrl && (
                      <a 
                        href={asset.facebookUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="bg-blue-50 hover:bg-blue-100 text-blue-700 font-semibold px-2.5 py-1.5 rounded-lg text-[10px] flex items-center justify-center gap-1 transition-colors"
                        title="Watch Original on Facebook"
                      >
                        <svg className="w-3.5 h-3.5 fill-current text-blue-600" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                      </a>
                    )}
                    <button 
                      onClick={() => onSaveToBoard(asset)}
                      className={`px-2 py-1 rounded-lg flex items-center justify-center border transition-colors ${
                        isPinned 
                          ? "bg-emerald-50 text-emerald-700 border-emerald-200" 
                          : "bg-white hover:bg-slate-50 text-slate-600 border-slate-200"
                      }`}
                    >
                      <Bookmark className="w-3 h-3" fill={isPinned ? "currentColor" : "none"} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {filteredMedia.length === 0 && (
            <div className="bg-slate-50 p-12 text-center rounded-xl text-slate-400">
              No matching assets found in feed.
            </div>
          )}
        </div>

      </div>

      <AnimatePresence>
        {expandedAsset && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-950/95 backdrop-blur-md z-[100] flex items-center justify-center p-3 sm:p-6"
            onClick={() => setExpandedAsset(null)}
          >
            <motion.div 
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="relative max-w-4xl w-full bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl flex flex-col md:flex-row max-h-[90vh] md:max-h-[80vh]"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button 
                onClick={() => setExpandedAsset(null)}
                className="absolute top-4 right-4 bg-black/60 hover:bg-black/95 text-white p-2.5 rounded-full z-20 cursor-pointer transition-colors shadow"
                title="Close Theater Mode"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Theater Visual Area (Left side) */}
              <div className="flex-1 bg-slate-950 flex items-center justify-center relative min-h-[350px] md:min-h-0 aspect-video md:aspect-auto p-4 overflow-hidden">
                {expandedAsset.type === "reel" && expandedAsset.embedIframeUrl ? (
                  <iframe 
                    src={expandedAsset.embedIframeUrl} 
                    title={expandedAsset.title}
                    className="w-[267px] h-[476px] max-h-[60vh] md:max-h-full border-none overflow-hidden rounded-xl shadow-lg"
                    scrolling="no" 
                    frameBorder="0" 
                    allowFullScreen={true} 
                    allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                  />
                ) : expandedAsset.type === "reel" ? (
                  <video 
                    src={expandedAsset.sourceUrl} 
                    controls 
                    autoPlay 
                    playsInline 
                    className="w-full h-full max-h-[45vh] md:max-h-full object-contain"
                  />
                ) : (
                  <img 
                    src={expandedAsset.sourceUrl} 
                    alt={expandedAsset.title} 
                    className="w-full h-full max-h-[45vh] md:max-h-full object-contain"
                    referrerPolicy="no-referrer"
                  />
                )}
              </div>

              {/* Sidebar details (Right side) */}
              <div className="w-full md:w-80 p-5 shrink-0 bg-slate-900 flex flex-col justify-between border-t md:border-t-0 md:border-l border-slate-800 text-slate-100 overflow-y-auto">
                <div className="space-y-4">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 bg-[#fcb882] rounded-full text-[#391b00] flex items-center justify-center font-extrabold text-sm shadow">
                      N
                    </div>
                    <div>
                      <div className="text-xs font-bold leading-none">Nemo Tours (Verified)</div>
                      <span className="text-[10px] text-slate-400 font-mono">@tours.nemo</span>
                    </div>
                  </div>

                  <div>
                    <span className="bg-red-500 text-white font-label font-extrabold text-[9px] uppercase tracking-wider px-2 py-0.5 rounded mr-2 align-middle">
                      {expandedAsset.type.toUpperCase()}
                    </span>
                    <span className="text-[11px] text-slate-400 align-middle">{expandedAsset.publishDate}</span>
                    <h3 className="text-sm font-bold text-white mt-1.5 leading-snug">{expandedAsset.title}</h3>
                  </div>

                  <p className="text-xs text-slate-300 font-sans leading-relaxed whitespace-pre-line bg-slate-950/40 p-3 rounded-xl border border-slate-800/30">
                    {expandedAsset.caption}
                  </p>

                  <div className="flex items-center gap-3 text-[10px] text-slate-400">
                    <span className="bg-slate-800 px-2.5 py-1 rounded-full">{expandedAsset.likesCount.toLocaleString()} likes</span>
                    <span className="bg-slate-800 px-2.5 py-1 rounded-full">{expandedAsset.sharesCount} shares</span>
                  </div>
                </div>

                <div className="space-y-2 mt-6 pt-4 border-t border-slate-800/55">
                  <div className="flex gap-2 text-xs">
                    <button 
                      onClick={() => handleShare(expandedAsset)}
                      className="flex-1 bg-[#fcb882] hover:bg-[#e5a26c] text-slate-950 font-bold py-2 px-3 rounded-lg flex items-center justify-center gap-1.5 cursor-pointer transition-all active:scale-95 shadow-sm"
                    >
                      <Share2 className="w-3.5 h-3.5" />
                      {shareStatus[expandedAsset.id] ? "Copied Share Link!" : "Share Link"}
                    </button>
                    <button 
                      onClick={() => onSaveToBoard(expandedAsset)}
                      className={`px-3 py-2 rounded-lg flex items-center justify-center cursor-pointer transition-colors ${
                        savedAssetIds.includes(expandedAsset.id) 
                          ? "bg-emerald-600 text-white" 
                          : "bg-slate-800 hover:bg-slate-750 text-slate-300"
                      }`}
                      title="Pin to Saved Board"
                    >
                      <Bookmark className="w-4 h-4" fill={savedAssetIds.includes(expandedAsset.id) ? "white" : "none"} />
                    </button>
                  </div>
                  {expandedAsset.facebookUrl && (
                    <a 
                      href={expandedAsset.facebookUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-1.5 rounded-lg text-[11px] flex items-center justify-center gap-1.5 transition-colors text-center"
                    >
                      <svg className="w-3.5 h-3.5 fill-current inline-block mr-1" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                      Open Link on Facebook
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
