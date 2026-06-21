import React, { useState, useRef, useEffect } from "react";
import { ChatMessage } from "../types";
import { Send, Sparkles, HelpCircle } from "lucide-react";
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
      const chatHistory = messages.map(m => ({ role: m.role, text: m.text }));
      const res = await fetch("/api/gemini/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: textToSend, history: chatHistory })
      });

      if (!res.ok) throw new Error("HTTP error: " + res.status);
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
    <div id="ai-chat-container" className="max-w-3xl mx-auto px-4 py-2 h-[85vh] flex flex-col justify-between">
      {/* Header View Block */}
      <div className="bg-white rounded-t-3xl p-4 border border-slate-200 flex items-center justify-between shadow-sm shrink-0">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-11 h-11 bg-[#003b5c] text-[#fcb882] rounded-full flex items-center justify-center font-serif font-extrabold text-base shadow-inner">
              N
            </div>
            <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white" />
          </div>
          <div>
            <div className="font-serif font-bold text-sm text-slate-800 flex items-center gap-1.5">
              Nemo AI Co-Pilot
              <span className="bg-amber-50 text-amber-800 border border-amber-200/60 text-[9px] px-2 py-0.5 rounded-md uppercase font-extrabold tracking-wider">
                Coach
              </span>
            </div>
            <p className="text-[11px] text-slate-500">Specialist in Red Sea, Luxury Yachts & Marsa Alam</p>
          </div>
        </div>
        <div className="text-right text-[10px] text-slate-400 font-mono hidden sm:block bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-100">
          Saba Pasha, Alexandria
        </div>
      </div>

      {/* Messaging Stream Window */}
      <div className="flex-1 bg-slate-50 border-x border-slate-200 p-4 overflow-y-auto space-y-4 min-h-0 shadow-inner">
        <AnimatePresence initial={false}>
          {messages.map((m) => {
            const isModel = m.role === "model";
            return (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                key={m.id}
                className={`flex ${isModel ? "justify-start" : "justify-end"} items-start gap-2.5`}
              >
                {isModel && (
                  <div className="w-8 h-8 bg-[#003b5c] text-white rounded-full flex items-center justify-center font-serif font-bold text-xs shrink-0 shadow-md">
                    N
                  </div>
                )}
                <div className={`max-w-[75%] space-y-1 ${!isModel ? 'order-1' : ''}`}>
                  <div
                    className={`p-3.5 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap selection:bg-amber-200 ${isModel
                        ? "bg-white text-slate-800 rounded-tl-none shadow-sm border border-slate-200/50"
                        : "bg-[#003b5c] text-white rounded-tr-none shadow-md shadow-slate-900/5"
                      }`}
                  >
                    {m.text}
                  </div>
                  <div className={`text-[9px] text-slate-400 font-mono px-1 ${!isModel && "text-right"}`}>
                    {m.timestamp}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {isTyping && (
          <div className="flex justify-start items-center gap-2.5">
            <div className="w-8 h-8 bg-[#003b5c] text-white rounded-full flex items-center justify-center font-serif font-bold text-xs shrink-0 shadow-md">
              N
            </div>
            <div className="bg-white px-4 py-3 rounded-2xl rounded-tl-none shadow-sm border border-slate-200/50 flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" />
              <span className="w-1.5 h-1.5 bg-[#003b5c] rounded-full animate-bounce [animation-delay:0.2s]" />
              <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:0.4s]" />
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Suggested Input Actions Panel */}
      <div className="bg-white rounded-b-3xl p-4 border border-slate-200 shadow-md space-y-4 shrink-0">
        {messages.length < 3 && (
          <div className="space-y-1.5 animate-fade-in">
            <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider flex items-center gap-1">
              <HelpCircle className="w-3 h-3 text-slate-400" /> Suggested Queries
            </span>
            <div className="flex flex-wrap gap-2">
              {starterPrompts.map((prompt) => (
                <button
                  key={prompt}
                  onClick={() => handleSendMessage(prompt)}
                  className="bg-slate-50 hover:bg-slate-100 text-[#003b5c] border border-slate-200/80 px-3.5 py-1.5 rounded-full text-xs font-medium transition-all duration-150 active:scale-95 text-left truncate max-w-full shadow-sm"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        )}

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage(inputText);
          }}
          className="flex gap-2 relative items-center"
        >
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Type travel inquiry or catamaran yacht package requests..."
            className="flex-1 bg-slate-50 p-3.5 pr-12 rounded-xl border border-slate-200 text-sm text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#003b5c] transition-all"
          />
          <button
            type="submit"
            disabled={!inputText.trim()}
            className="absolute right-2 p-2 rounded-lg bg-[#003b5c] hover:bg-[#00253b] text-white transition-all disabled:opacity-20 disabled:hover:bg-[#003b5c]"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>

        <p className="text-center text-[10px] text-slate-400 flex items-center justify-center gap-1 select-none leading-none">
          <Sparkles className="w-3 h-3 text-[#fcb882] fill-[#fcb882]" /> Powered server-side by Google Gemini Enterprise Infrastructure
        </p>
      </div>
    </div>
  );
}