import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Bot, X, Send, Sparkles, RefreshCw, 
  ChevronDown, ExternalLink, HelpCircle,
  GraduationCap, Calendar, Calculator
} from 'lucide-react';
import { useEduTrack } from '../../context/EduTrackContext';
import { saveChatbotQueryToSupabase } from '../../lib/supabase';

interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
  actionPath?: string;
  actionLabel?: string;
}

const QUICK_PROMPTS = [
  { label: 'Calculate target GPA', text: 'How do I calculate my target GPA to graduate with honors?' },
  { label: 'Timetable collision radar', text: 'How does the timetable radar detect room and professor collisions?' },
  { label: 'Attendance requirement', text: 'What is the institutional attendance minimum percentage and absence warning?' },
  { label: 'Role permissions', text: 'What are the permission differences between Student, Teacher, and Admin?' },
];

export const AIChatbot: React.FC = () => {
  const { navigate, currentUser, courses, settings } = useEduTrack();
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'ai',
      text: `Hello! I'm **EduTrack AI**, your academic assistant powered by Gemini. Ask me anything about course timetables, GPA targets, attendance tracking, or portal navigation.`,
      timestamp: 'Just now'
    }
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 150);
      scrollToBottom();
    }
  }, [isOpen, messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Offline / Static fallback response generator when server API is unavailable
  const generateOfflineResponse = (query: string): { text: string; actionPath?: string; actionLabel?: string } => {
    const q = query.toLowerCase();
    
    if (q.includes('gpa') || q.includes('grade') || q.includes('honor') || q.includes('planner')) {
      return {
        text: `### GPA & Honors Calculator\n\nEduTrack computes cumulative grade point averages using credit-weighted formulas on a **4.0 Scale**:\n\n* **Summa Cum Laude**: GPA ≥ 3.90\n* **Magna Cum Laude**: GPA ≥ 3.75\n* **Cum Laude**: GPA ≥ 3.50\n\nYou can simulate target marks and exam weights in the interactive GPA Planner.`,
        actionPath: '/planner',
        actionLabel: 'Open GPA Target Planner'
      };
    }

    if (q.includes('timetable') || q.includes('schedule') || q.includes('room') || q.includes('collision')) {
      return {
        text: `### Interactive Timetable Radar\n\nThe Timetable Radar scans weekly schedules across **48 Lecture Halls** to prevent double-booking:\n\n* **Room Overlaps**: Flags when two courses are assigned to the same hall.\n* **Faculty Clashes**: Alerts if a professor is booked in multiple sessions.\n* **Available Courses**: ${courses.map(c => `${c.code} (${c.room})`).slice(0, 3).join(', ')} and more.`,
        actionPath: '/timetable',
        actionLabel: 'View Timetable Radar'
      };
    }

    if (q.includes('attendance') || q.includes('absent') || q.includes('warning') || q.includes('threshold')) {
      return {
        text: `### Attendance Policy & Warnings\n\n* **Minimum Threshold**: **${settings.attendanceThreshold}%** mandatory compliance.\n* **10-Second Digital Roll Call**: Instructors log *Present*, *Late*, *Absent*, or *Excused*.\n* **Early Intervention**: Students dropping below ${settings.attendanceThreshold}% automatically generate an advisor flag.`,
        actionPath: currentUser?.role === 'student' ? '/student' : '/features',
        actionLabel: 'Check Attendance Policy'
      };
    }

    if (q.includes('role') || q.includes('admin') || q.includes('teacher') || q.includes('ferpa') || q.includes('student')) {
      return {
        text: `### Role-Governed Access (FERPA Compliance)\n\n* **Students**: Private GPA radar, course grades, personal attendance rate, and report cards.\n* **Faculty (Teachers)**: Roster roll calls, assessment weighting, and student progress flags.\n* **Administrators**: Cross-department metrics, student CSV enrollment, and room scheduling.`,
        actionPath: '/how-it-works',
        actionLabel: 'View Architecture Guide'
      };
    }

    return {
      text: `I'm happy to help you with that! As your **EduTrack AI Advisor**, I can assist with:\n\n* **Timetable & Scheduling**: Room locations, lecture hours, and collision checks.\n* **GPA & Grades**: 4.0 weighted scale, quiz weights, and degree projections.\n* **Campus Modules**: Student roster imports, faculty desks, and administrative policy.\n\nTry exploring one of the quick suggestions below or let me know what you'd like to check!`,
      actionPath: '/features',
      actionLabel: 'Explore Platform Features'
    };
  };

  const handleSend = async (messageText?: string) => {
    const textToSend = (messageText || input).trim();
    if (!textToSend || isTyping) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    try {
      // 1. Attempt server-side Gemini 3.8 Flash call
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: textToSend }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.text) {
          const aiMessage: ChatMessage = {
            id: `ai-${Date.now()}`,
            sender: 'ai',
            text: data.text,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          };
          setMessages(prev => [...prev, aiMessage]);
          setIsTyping(false);

          // Save question & answer into Supabase chatbot_queries table
          saveChatbotQueryToSupabase({
            query: textToSend,
            response: data.text,
            userId: currentUser?.id,
            userName: currentUser?.name,
            userRole: currentUser?.role,
          }).catch(err => {
            console.warn('[Supabase Chatbot Save Warning]:', err);
          });

          return;
        }
      }
      throw new Error('Server route unavailable');
    } catch {
      // 2. Seamless client-side intelligent fallback (ensures 100% uptime on static hosts / GitHub Pages / Vercel)
      setTimeout(() => {
        const fallback = generateOfflineResponse(textToSend);
        const aiMessage: ChatMessage = {
          id: `ai-${Date.now()}`,
          sender: 'ai',
          text: fallback.text,
          actionPath: fallback.actionPath,
          actionLabel: fallback.actionLabel,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setMessages(prev => [...prev, aiMessage]);
        setIsTyping(false);

        // Save question & answer into Supabase chatbot_queries table
        saveChatbotQueryToSupabase({
          query: textToSend,
          response: fallback.text,
          userId: currentUser?.id,
          userName: currentUser?.name,
          userRole: currentUser?.role,
        }).catch(err => {
          console.warn('[Supabase Chatbot Save Warning]:', err);
        });
      }, 500);
    }
  };

  const clearChat = () => {
    setMessages([
      {
        id: 'welcome',
        sender: 'ai',
        text: `Chat cleared! How can I assist you with your academic inquiries today?`,
        timestamp: 'Just now'
      }
    ]);
  };

  return (
    <>
      {/* ======================================================== */}
      {/* FLOATING ACTION BUTTON WITH BOUNCE & EXPANDING WAVE RINGS */}
      {/* ======================================================== */}
      <div className="fixed bottom-6 right-6 z-50 flex items-center justify-end select-none">
        
        {/* Unopened Floating Callout Pill */}
        {!isOpen && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5, duration: 0.4 }}
            className="hidden sm:flex items-center gap-2 mr-3 px-3 py-1.5 rounded-full bg-white dark:bg-slate-900 border border-indigo-200 dark:border-indigo-800/80 shadow-lg cursor-pointer"
            onClick={() => setIsOpen(true)}
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
              Ask EduTrack AI
            </span>
            <span className="text-xs text-indigo-500 font-mono">✦</span>
          </motion.div>
        )}

        {/* Floating Button Container with Bouncing Motion & Wave Ripples */}
        <div className="relative flex items-center justify-center">
          
          {/* Wave Ripple Ring 1 (Smooth expanding concentric wave) */}
          <span 
            className="absolute w-16 h-16 rounded-full bg-indigo-500/25 dark:bg-indigo-400/20 animate-ping pointer-events-none" 
            style={{ animationDuration: '2.8s' }}
          />

          {/* Wave Ripple Ring 2 (Outer delayed wave ring) */}
          <span 
            className="absolute w-20 h-20 rounded-full border border-indigo-400/30 dark:border-indigo-400/20 animate-pulse pointer-events-none" 
            style={{ animationDuration: '3.4s' }}
          />

          {/* Wave Ripple Ring 3 (Soft ambient aura) */}
          <span className="absolute w-14 h-14 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 blur-md opacity-40 -z-10" />

          {/* Bouncing Core Floating Button */}
          <motion.button
            type="button"
            onClick={() => setIsOpen(prev => !prev)}
            animate={{ y: [0, -7, 0] }}
            transition={{ 
              repeat: Infinity, 
              duration: 3.2, 
              ease: "easeInOut" 
            }}
            whileHover={{ scale: 1.1, transition: { duration: 0.2 } }}
            whileTap={{ scale: 0.94 }}
            className="relative w-14 h-14 rounded-full bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-600 text-white shadow-xl hover:shadow-indigo-500/30 flex items-center justify-center cursor-pointer border-2 border-white/30 dark:border-white/20 transition-all duration-200"
            aria-label={isOpen ? "Close AI Chatbot" : "Open AI Chatbot"}
            title="EduTrack Academic AI"
          >
            {isOpen ? (
              <X className="w-6 h-6 text-white transition-transform duration-200" />
            ) : (
              <div className="relative flex items-center justify-center">
                <Bot className="w-7 h-7 text-white" />
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-indigo-600" />
              </div>
            )}
          </motion.button>
        </div>
      </div>

      {/* ======================================================== */}
      {/* EXPANDABLE CHATBOT DRAWER / MODAL */}
      {/* ======================================================== */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="fixed bottom-24 right-4 sm:right-6 z-50 w-[calc(100vw-2rem)] sm:w-[400px] h-[550px] max-h-[82vh] rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col overflow-hidden backdrop-blur-xl"
          >
            {/* Header */}
            <div className="px-4 py-3.5 bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-700 text-white flex items-center justify-between shrink-0 shadow-xs">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-white/15 border border-white/20 flex items-center justify-center shadow-xs">
                  <Bot className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h3 className="text-sm font-bold leading-tight">EduTrack AI</h3>
                    <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-emerald-400/20 text-emerald-300 font-mono font-medium border border-emerald-400/30">
                      Online
                    </span>
                  </div>
                  <p className="text-[11px] text-indigo-100 flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-indigo-300" />
                    <span>Gemini 3.8 Flash Academic Guide</span>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={clearChat}
                  title="Clear conversation"
                  aria-label="Clear conversation history"
                  className="p-1.5 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  title="Minimize chatbot"
                  aria-label="Minimize chatbot"
                  className="p-1.5 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
                >
                  <ChevronDown className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Quick Suggestion Pills */}
            <div className="px-3 py-2 bg-slate-50 dark:bg-slate-950/70 border-b border-slate-100 dark:border-slate-800/80 overflow-x-auto flex items-center gap-1.5 scrollbar-none shrink-0">
              {QUICK_PROMPTS.map((prompt, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSend(prompt.text)}
                  className="px-2.5 py-1 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-indigo-500 dark:hover:border-indigo-400 text-[11px] font-medium text-slate-700 dark:text-slate-300 whitespace-nowrap transition-colors cursor-pointer shadow-2xs hover:text-indigo-600 dark:hover:text-indigo-400 shrink-0"
                >
                  {prompt.label}
                </button>
              ))}
            </div>

            {/* Messages Scroll Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-slate-50/50 dark:bg-slate-900/40">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed shadow-2xs ${
                      msg.sender === 'user'
                        ? 'bg-indigo-600 text-white rounded-br-xs'
                        : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200/80 dark:border-slate-700/80 rounded-bl-xs'
                    }`}
                  >
                    {/* Message Content formatted with bold and linebreaks */}
                    <div className="space-y-1.5 whitespace-pre-wrap">
                      {msg.text.split('\n').map((line, i) => {
                        if (line.startsWith('### ')) {
                          return <p key={i} className="font-bold text-[13px] text-indigo-600 dark:text-indigo-400 mt-1">{line.replace('### ', '')}</p>;
                        }
                        if (line.startsWith('* ')) {
                          return (
                            <p key={i} className="flex items-start gap-1.5 pl-1">
                              <span className="text-indigo-500 font-bold shrink-0">•</span>
                              <span>{line.replace('* ', '')}</span>
                            </p>
                          );
                        }
                        return <p key={i}>{line}</p>;
                      })}
                    </div>

                    {/* Optional Interactive Shortcut Action Pill */}
                    {msg.actionPath && (
                      <div className="mt-2.5 pt-2 border-t border-slate-100 dark:border-slate-700">
                        <button
                          type="button"
                          onClick={() => {
                            if (msg.actionPath) {
                              navigate(msg.actionPath);
                              setIsOpen(false);
                            }
                          }}
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 text-[11px] font-semibold transition-colors cursor-pointer"
                        >
                          <span>{msg.actionLabel || 'View in Portal'}</span>
                          <ExternalLink className="w-3 h-3" />
                        </button>
                      </div>
                    )}
                  </div>
                  <span className="text-[10px] text-slate-400 mt-1 px-1">
                    {msg.timestamp}
                  </span>
                </div>
              ))}

              {/* Typing indicator */}
              {isTyping && (
                <div className="flex items-center gap-1.5 p-3 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 w-fit">
                  <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-bounce" style={{ animationDelay: '300ms' }} />
                  <span className="text-[11px] text-slate-400 ml-1">EduTrack AI is thinking...</span>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input Footer */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="p-3 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 shrink-0"
            >
              <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800/80 rounded-2xl px-3 py-1.5 border border-slate-200 dark:border-slate-700 focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500/20 transition-all">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask about GPA, timetable, courses, rules..."
                  className="flex-1 bg-transparent text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none"
                  disabled={isTyping}
                />
                <button
                  type="submit"
                  disabled={!input.trim() || isTyping}
                  className="w-8 h-8 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 disabled:hover:bg-indigo-600 text-white flex items-center justify-center transition-all cursor-pointer shrink-0 shadow-xs"
                  aria-label="Send message"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>
              <div className="mt-1.5 flex items-center justify-between text-[10px] text-slate-400 px-1">
                <span>Gemini 3.8 Flash</span>
                <span>Press Enter to send</span>
              </div>
            </form>

          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
