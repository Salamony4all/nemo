import React, { useState, useRef, useEffect } from "react";
import { ChatMessage } from "../types";
import { Send, MapPin, Sparkles, LogOut, Check, Info, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface CompanionAIViewProps {
  onSuggestExcursion: (tourId: string) => void;
}

export default function CompanionAIView({ onSuggestExcursion }: CompanionAIViewProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      role: "model",
      text: "Salam Aly! Welcome to Nemo Tours (نيمو تورز) interactive travel guide. I am your premium AI Travel Coach and counselor for Red Sea experiences. Ask me about Marsa Alam excursions, snorkeling, and our luxury yacht services!",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  const starterPrompts = [
    "Are there wild dolphins in Marsa Alam?",
    "Where is the Nemo Tours office located?",
    "How much is the VIP Catamaran sunset cruise?",
    "Suggest a custom itinerary on the yacht"
  ];

  // Auto scroll to latest message bubble smoothly
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim()) return;

    const userMsg: ChatMessage = {
      id: "user-" + Date.now(),
      role: "user",
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText("");
    setIsTyping(true);

    try {
      const chatHistory = messages.map(m => ({
        role: m.role,
        text: m.text
      }));

      const res = await fetch("/api/gemini/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: textToSend,
          history: chatHistory
        })
      });

      if (!res.ok) {
        throw new Error("HTTP error: " + res.status);
      }

      const data = await res.json();
      
      const modelMsg: ChatMessage = {
        id: "model-" + Date.now(),
        role: "model",
        text: data.text || "I apologize. Our server could not form a response right now.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, modelMsg]);
    } catch (err: any) {
      console.error("AI reply error:", err);
      // Graceful local model mock responses for uninterrupted preview experience
      setTimeout(() => {
        let answer = "Excuse me, Aly. I encountered an error connecting to our Gemini cloud system. But I can tell you that Nemo Tours operates from Saba Pasha, Alexandria, and can arrange hotel pickup for Marsa Alam dolphin swims! We guarantee the lowest price in the market. Just call us at +201100086772.";
        if (textToSend.toLowerCase().includes("dolphin") || textToSend.toLowerCase().includes("wild")) {
          answer = "Yes indeed! Our Marsa Alam Dolphin Safari is an unforgettable 3 Days experience where you can swim alongside wild dolphins. Our rates start at only 1,843 EGP (approx. $38) for the full package, backed by our 110% Lowest Price Guarantee! This includes all gear, dual-safety certified guides, and amazing on-board dining.";
        } else if (textToSend.toLowerCase().includes("sunset") || textToSend.toLowerCase().includes("vip") || textToSend.toLowerCase().includes("cruise")) {
          answer = "The VIP Sunset Cruise is now a magical 2 Days catamaran itinerary priced at only 1,212 EGP ($25) per guest under our Lowest Price Guarantee. We set sail at 2:00 PM, swim in deep-sea turquoise lagoons, and anchor at key scenic reefs for the golden hour, featuring a premier BBQ buffet. You can view & book it directly on our 'Summer Offers' page!";
        } else if (textToSend.toLowerCase().includes("office") || textToSend.toLowerCase().includes("where")) {
          answer = "Our official Nemo Tours office address is 78 Abdel Salam Aref, beside Ibrahim Obeid Hospital, Saba Pasha, Alexandria. You can trace us visually or call 01100086772 for instant booking coordinations.";
        } else if (textToSend.toLowerCase().includes("price") || textToSend.toLowerCase().includes("cheap") || textToSend.toLowerCase().includes("cost")) {
          answer = "Nemo Tours offers a 110% Lowest Price Guarantee! We have amazing options starting under 1,000 EGP, such as our 2 Days Abu Dabbab Coastal Turtle Snorkeling at only 727 EGP ($15), and our Pristine Snorkeling Cruise at 921 EGP ($19). If you find a verified lower rate anywhere else, we'll refund you 110% of the difference!";
        }

        const fallbackMsg: ChatMessage = {
          id: "model-fallback-" + Date.now(),
          role: "model",
          text: answer,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setMessages(prev => [...prev, fallbackMsg]);
      }, 1000);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div id="ai-chat-container" className="max-w-[850px] mx-auto px-4 py-4 lg:py-6 h-[85vh] flex flex-col justify-between">
      
      {/* Companion chat header info card */}
      <div className="bg-white rounded-t-2xl p-4 border border-b-0 border-slate-200/80 shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 bg-[#003b5c] text-[#fcb882] rounded-full flex items-center justify-center font-serif font-extrabold text-base">
              N
            </div>
            <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white" />
          </div>
          <div>
            <div className="font-serif font-bold text-sm text-slate-800 flex items-center gap-1.5">
              Nemo AI Co-Pilot
              <span className="bg-amber-100 text-amber-800 text-[9px] px-1.5 py-0.2 rounded uppercase font-bold tracking-wider">
                Coach
              </span>
            </div>
            <p className="text-[10px] text-slate-500 font-sans">Specialist in Red Sea, Yachts & Marsa Alam</p>
          </div>
        </div>

        <div className="text-right text-[10px] text-slate-400 font-mono hidden sm:block">
          Saba Pasha, Alexandria
        </div>
      </div>

      {/* Bubble Message History wrapper */}
      <div className="flex-1 bg-slate-50 border border-y-0 border-slate-200/80 p-4 overflow-y-auto space-y-4 min-h-0">
        
        {messages.map((m) => {
          const isModel = m.role === "model";
          return (
            <div 
              key={m.id}
              className={`flex ${isModel ? "justify-start" : "justify-end"} items-start gap-2.5`}
            >
              {isModel && (
                <div className="w-7 h-7 bg-[#003b5c] text-white rounded-full flex items-center justify-center font-serif font-bold text-xs shrink-0 self-start shadow-sm">
                  N
                </div>
              )}
              
              <div className="max-w-[85%] space-y-1">
                <div 
                  className={`p-3 rounded-2xl text-xs leading-relaxed whitespace-pre-wrap select-text ${
                    isModel 
                      ? "bg-white text-slate-800 rounded-tl-none shadow-sm border border-slate-100" 
                      : "bg-[#003b5c] text-white rounded-tr-none shadow-sm"
                  }`}
                >
                  {m.text}
                </div>
                <div className={`text-[9px] text-slate-400 font-mono ${!isModel && "text-right"}`}>
                  {m.timestamp}
                </div>
              </div>
            </div>
          );
        })}

        {isTyping && (
          <div className="flex justify-start items-center gap-2.5">
            <div className="w-7 h-7 bg-[#003b5c] text-white rounded-full flex items-center justify-center font-serif font-bold text-xs shrink-0 shadow-sm">
              N
            </div>
            <div className="bg-white p-3.5 rounded-2xl rounded-tl-none shadow-sm border border-slate-100 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" />
              <span className="w-1.5 h-1.5 bg-[#003b5c] rounded-full animate-bounce [animation-delay:0.2s]" />
              <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:0.4s]" />
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Suggested prompts list & Send bar input block */}
      <div className="bg-white rounded-b-2xl p-4 border border-t-0 border-slate-200/80 shadow-sm space-y-3">
        
        {/* Suggestion tags list */}
        {messages.length < 3 && (
          <div className="space-y-1.5">
            <span className="text-[10px] text-slate-500 font-semibold block uppercase tracking-wide">Suggested Queries</span>
            <div className="flex flex-wrap gap-2">
              {starterPrompts.map((prompt) => (
                <button 
                  key={prompt}
                  onClick={() => handleSendMessage(prompt)}
                  className="bg-slate-100 hover:bg-slate-200 text-[#003b5c] border border-slate-200 px-3 py-1.5 rounded-full text-[11px] font-sans transition-all text-left truncate max-w-[280px]"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Real-time keyboard send bar */}
        <form 
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage(inputText);
          }}
          className="flex gap-2"
        >
          <input 
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Type your travel inquiry or customized yacht preference..."
            className="flex-1 bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-[#003b5c]"
          />
          <button 
            type="submit"
            disabled={!inputText.trim()}
            className="bg-[#003b5c] hover:bg-[#00253b] text-white p-3 rounded-xl transition-all cursor-pointer disabled:opacity-40"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
        
        <p className="text-center text-[9px] text-slate-400 flex items-center justify-center gap-1 leading-none select-none">
          <Sparkles className="w-3 h-3 text-[#fcb882]" /> Powered server-side by Google Gemini Pro
        </p>
      </div>

    </div>
  );
}
