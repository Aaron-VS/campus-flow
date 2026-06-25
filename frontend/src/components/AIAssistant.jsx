/**
 * AIAssistant — CampusFlow
 * Calls POST /ask with { question } — RAG-backed Groq response.
 * Maintains a local chat history for UX only; each API call is stateless.
 */

import React, { useState, useRef, useEffect } from "react";
import { askAI } from "../api/campusflow";

const STARTER_QUESTIONS = [
  "What should I focus on this week?",
  "Which subject needs the most attention?",
  "Summarise my pending tasks",
  "Am I at risk of low attendance?",
];

export default function AIAssistant() {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      text: "Hi! I'm your CampusFlow AI. Ask me anything about your tasks, attendance, or study plan.",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const send = async (question) => {
    if (!question.trim() || loading) return;
    const userMsg = { role: "user", text: question.trim() };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const data = await askAI({ question: question.trim() });
      const answer = data?.answer || data?.response || JSON.stringify(data);
      setMessages((prev) => [...prev, { role: "assistant", text: answer }]);
    } catch (e) {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", text: `⚠️ ${e.message}`, isError: true },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send(input);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden flex flex-col h-[520px]">
      {/* Header */}
      <div className="bg-gradient-to-r from-violet-600 to-purple-700 px-6 py-4 flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center text-lg">🧠</div>
          <div>
            <h2 className="text-white font-bold text-lg leading-tight">AI Academic Assistant</h2>
            <p className="text-violet-200 text-xs mt-0.5">RAG-powered · Groq LLM</p>
          </div>
          <div className="ml-auto flex items-center gap-1.5">
            <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
            <span className="text-white/70 text-xs">Live</span>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3 bg-slate-50">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            {msg.role === "assistant" && (
              <div className="w-7 h-7 rounded-full bg-violet-100 flex items-center justify-center text-sm flex-shrink-0 mr-2 mt-0.5">
                🤖
              </div>
            )}
            <div
              className={`max-w-[78%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed shadow-sm ${
                msg.role === "user"
                  ? "bg-violet-600 text-white rounded-tr-sm"
                  : msg.isError
                  ? "bg-red-50 text-red-700 border border-red-200"
                  : "bg-white text-slate-700 border border-slate-100 rounded-tl-sm"
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="w-7 h-7 rounded-full bg-violet-100 flex items-center justify-center text-sm flex-shrink-0 mr-2">🤖</div>
            <div className="bg-white border border-slate-100 rounded-2xl rounded-tl-sm px-4 py-3 flex items-center gap-1.5 shadow-sm">
              <span className="w-2 h-2 bg-violet-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
              <span className="w-2 h-2 bg-violet-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
              <span className="w-2 h-2 bg-violet-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Starter questions */}
      {messages.length <= 1 && (
        <div className="px-5 py-3 flex flex-wrap gap-2 border-t border-slate-100 bg-white flex-shrink-0">
          {STARTER_QUESTIONS.map((q) => (
            <button
              key={q}
              onClick={() => send(q)}
              className="text-xs bg-violet-50 hover:bg-violet-100 text-violet-700 border border-violet-200 px-3 py-1.5 rounded-full transition"
            >
              {q}
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      <div className="px-4 py-3 border-t border-slate-100 bg-white flex gap-2 flex-shrink-0">
        <textarea
          rows={1}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask about your tasks, deadlines, attendance…"
          className="flex-1 resize-none px-4 py-2.5 rounded-xl border border-slate-200 text-slate-800 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-transparent transition"
        />
        <button
          onClick={() => send(input)}
          disabled={!input.trim() || loading}
          className="bg-violet-600 hover:bg-violet-700 disabled:opacity-50 text-white rounded-xl px-4 py-2.5 transition flex items-center justify-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 rotate-90" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="19" x2="12" y2="5"/>
            <polyline points="5 12 12 5 19 12"/>
          </svg>
        </button>
      </div>
    </div>
  );
}
