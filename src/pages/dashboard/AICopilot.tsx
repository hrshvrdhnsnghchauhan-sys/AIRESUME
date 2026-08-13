import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Sparkles, Plus, MessageSquare, Trash2, Zap } from 'lucide-react';
import { collection, query, where, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/context/AuthContext';
import type { AIChat, ChatMessage } from '@/types';
import { Button } from '@/components/ui/Button';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

function uid() {
  return Math.random().toString(36).slice(2, 10);
}
// Local fallback so the AI Copilot always responds, even without an API key
function fallbackCopilotResponse(userMessage: string): string {
  const msg = userMessage.toLowerCase();
  if (/bullet|rewrite|improve my|make my/.test(msg)) {
    return 'Here are 3 rewritten bullet points using the "Action Verb + Context + Result" format:\n\n1. **Led** a cross-functional team of 5 to ship a customer-facing feature that **increased engagement by 30%** in the first quarter.\n2. **Built** an automated CI/CD pipeline that **reduced deployment time by 60%** and eliminated manual release errors.\n3. **Optimized** database queries and added caching, **cutting average response time from 900ms to 180ms** and improving user satisfaction scores.\n\nTip: Always start with a strong action verb and end with a quantified result — recruiters scan for metrics.';
  }
  if (/summary|professional summary/.test(msg)) {
    return 'Here is a professional summary you can tailor to your background:\n\n> Results-driven engineer with 5+ years of experience building scalable web applications. Proven track record of shipping high-impact features, improving performance, and mentoring junior developers. Passionate about clean architecture, automation, and delivering measurable business outcomes.\n\nTip: Keep it to 2-3 sentences, mention your top skills, and include one quantified achievement.';
  }
  if (/ats|score|improve.*score/.test(msg)) {
    return 'To improve your ATS score:\n\n1. **Mirror the job description** — include the exact keywords and phrases used in the JD.\n2. Use **standard section headers** (Experience, Education, Skills) — ATS bots parse these reliably.\n3. Avoid tables, columns, and graphics — plain single-column layouts parse best.\n4. Include your **contact info** (email + phone) at the top.\n5. Quantify results with numbers and percentages.\n\nTry the ATS Simulator tool to test your resume against a specific job description!';
  }
  if (/skill|add.*skill|what skills/.test(msg)) {
    return 'High-demand skills to consider adding (if you have them):\n\n- **React / Next.js** (frontend)\n- **TypeScript**\n- **Node.js / Python** (backend)\n- **AWS / Docker / Kubernetes** (cloud & DevOps)\n- **CI/CD & Testing** (GitHub Actions, Jest, Playwright)\n- **SQL / NoSQL databases**\n\nOnly list skills you can confidently talk about in an interview — honesty beats keyword stuffing.';
  }
  if (/interview|question|prepare/.test(msg)) {
    return 'Great question! Here is how to prepare:\n\n1. **Research the company** — mission, product, recent news.\n2. Prepare **STAR stories** (Situation, Task, Action, Result) for: a challenge, a conflict, a failure, and a big win.\n3. For technical roles, practice **system design** and **coding problems** aloud.\n4. Prepare 3-5 questions to ask the interviewer.\n\nUse the Interview Coach tool to practice with instant feedback!';
  }
  if (/cover letter/.test(msg)) {
    return 'To write a strong cover letter:\n\n1. Open with the specific role and company — show you did your research.\n2. Highlight **1-2 quantified achievements** most relevant to the role.\n3. Connect your skills to the company\'s goals or challenges.\n4. Keep it under one page — recruiters skim.\n\nUse the AI Cover Letter tool to generate one in seconds!';
  }
  return 'Great question! Here are some expert tips to strengthen your resume:\n\n1. **Lead every bullet with a strong action verb** — Led, Built, Optimized, Launched, Reduced.\n2. **Quantify results** — use numbers, percentages, and timeframes (e.g. "increased retention by 25%").\n3. **Tailor your resume to each job** — mirror the job description\'s keywords.\n4. **Keep it to 1-2 pages** with clean, consistent formatting.\n5. **Proofread** — spelling errors get resumes rejected instantly.\n\nAsk me to rewrite your bullet points, write a summary, or improve your ATS score!';
}

async function generateResponse(userMessage: string, contextMessage?: string): Promise<string> {
  try {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    if (!apiKey || apiKey === 'your_gemini_api_key_here' || !apiKey.startsWith('AIza')) {
      return fallbackCopilotResponse(userMessage);
    }
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    const contextPrompt = contextMessage ? `\n\nCurrent Resume Context:\n${contextMessage}\n` : '';
    const prompt = `You are an expert career coach and elite resume writer (a Senior Full-stack Engineer and Product Designer equivalent).
Your goal is to help the user craft a world-class, competition-winning resume that bypasses ATS filters and impresses recruiters.
When asked to rewrite bullet points, always use the 'Action Verb + Context + Result (Quantified)' format. Make them sound extremely impactful, professional, and outcome-driven. 
Avoid fluffy adjectives; stick to concrete achievements.
${contextPrompt}
User request: ${userMessage}`;
    
    const result = await model.generateContent(prompt);
    const text = result.response.text();
    return text && text.trim() ? text : fallbackCopilotResponse(userMessage);
  } catch (error) {
    console.error("Gemini API Error:", error);
    return fallbackCopilotResponse(userMessage);
  }
}

const suggestedPrompts = [
  'Rewrite my bullet points for more impact',
  'Generate a professional summary',
  'How can I improve my ATS score?',
  'What skills should I add?',
];

export default function AICopilot() {
  const { user } = useAuth();
  const [chats, setChats] = useState<AIChat[]>([]);
  const [activeChat, setActiveChat] = useState<AIChat | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchChats();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const fetchChats = async () => {
    if (!user) return;
    try {
      const q = query(collection(db, 'ai_chats'), where('user_id', '==', user.uid));
      const querySnapshot = await getDocs(q);
      const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as AIChat));
      data.sort((a, b) => (b.updated_at || '').localeCompare(a.updated_at || ''));
      setChats(data);
      if (data.length > 0 && !activeChat) {
        setActiveChat(data[0]);
        setMessages(data[0].messages || []);
      }
    } catch (error) {
      console.error('Error fetching AI chats:', error);
    }
  };

  const createNewChat = async () => {
    if (!user) return;
    const newChatData = { 
      title: 'New Chat', 
      messages: [], 
      context: {},
      user_id: user.uid,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    const docRef = await addDoc(collection(db, 'ai_chats'), newChatData);
    const newChat = { id: docRef.id, ...newChatData } as AIChat;
    
    setChats([newChat, ...chats]);
    setActiveChat(newChat);
    setMessages([]);
  };

  const deleteChat = async (chatId: string) => {
    await deleteDoc(doc(db, 'ai_chats', chatId));
    const remaining = chats.filter((c) => c.id !== chatId);
    setChats(remaining);
    if (activeChat?.id === chatId) {
      setActiveChat(remaining[0] || null);
      setMessages(remaining[0]?.messages || []);
    }
  };

  const selectChat = (chat: AIChat) => {
    setActiveChat(chat);
    setMessages(chat.messages || []);
  };

  const send = async () => {
    if (!input.trim() || sending) return;

    const userMsg: ChatMessage = {
      id: uid(),
      role: 'user',
      content: input,
      timestamp: new Date().toISOString(),
    };

    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput('');
    setSending(true);

    // Generate AI response
    const aiResponse = await generateResponse(userMsg.content);
    const aiMsg: ChatMessage = {
      id: uid(),
      role: 'assistant',
      content: aiResponse,
      timestamp: new Date().toISOString(),
    };

    const allMessages = [...newMessages, aiMsg];
    setMessages(allMessages);
    setSending(false);

    // Save to database
    if (activeChat) {
      const title = activeChat.title === 'New Chat' ? userMsg.content.slice(0, 40) : activeChat.title;
      const updatedData = { messages: allMessages, title, updated_at: new Date().toISOString() };
      
      await updateDoc(doc(db, 'ai_chats', activeChat.id), updatedData);
      
      const updatedChat = { ...activeChat, ...updatedData };
      setActiveChat(updatedChat);
      setChats(chats.map((c) => (c.id === activeChat.id ? updatedChat : c)));
    } else {
      if (!user) return;
      const newChatData = {
        title: userMsg.content.slice(0, 40),
        messages: allMessages,
        context: {},
        user_id: user.uid,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      
      const docRef = await addDoc(collection(db, 'ai_chats'), newChatData);
      const newChat = { id: docRef.id, ...newChatData } as AIChat;
      
      setActiveChat(newChat);
      setChats([newChat, ...chats]);
    }
  };

  return (
    <div className="flex h-full">
      {/* Chat list */}
      <div className="hidden w-64 shrink-0 border-r border-ink-200 bg-surface p-3 md:block">
        <Button variant="outline" fullWidth size="sm" onClick={createNewChat} className="mb-3">
          <Plus className="h-4 w-4" />
          New Chat
        </Button>
        <div className="space-y-0.5 overflow-y-auto">
          {chats.map((chat) => (
            <div
              key={chat.id}
              className={cn(
                'group flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm transition-colors',
                activeChat?.id === chat.id ? 'bg-brand-50 text-brand-700' : 'text-ink-600 hover:bg-ink-100',
              )}
            >
              <button onClick={() => selectChat(chat)} className="flex min-w-0 flex-1 items-center gap-2">
                <MessageSquare className="h-4 w-4 shrink-0" />
                <span className="truncate">{chat.title}</span>
              </button>
              <button
                onClick={() => deleteChat(chat.id)}
                className="opacity-0 transition-opacity group-hover:opacity-100"
              >
                <Trash2 className="h-3.5 w-3.5 text-error-500" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Chat area */}
      <div className="flex flex-1 flex-col">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6">
          {messages.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center">
              <span className="grid h-16 w-16 place-items-center rounded-2xl bg-gradient-to-br from-brand-500 to-brand-700 shadow-lg">
                <Sparkles className="h-8 w-8 text-white" />
              </span>
              <h2 className="mt-4 text-xl font-semibold text-ink-900">AI Copilot</h2>
              <p className="mt-1 text-sm text-ink-500">Your AI-powered resume assistant</p>
              <div className="mt-8 grid w-full max-w-lg grid-cols-1 gap-2 sm:grid-cols-2">
                {suggestedPrompts.map((prompt) => (
                  <button
                    key={prompt}
                    onClick={() => setInput(prompt)}
                    className="rounded-xl border border-ink-200 bg-surface p-3 text-left text-sm text-ink-700 transition-all hover:border-brand-300 hover:shadow-sm"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="mx-auto max-w-3xl space-y-4">
              <AnimatePresence initial={false}>
                {messages.map((msg) => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={cn('flex gap-3', msg.role === 'user' && 'flex-row-reverse')}
                  >
                    <span
                      className={cn(
                        'grid h-8 w-8 shrink-0 place-items-center rounded-full text-xs font-semibold text-white',
                        msg.role === 'user' ? 'bg-ink-900' : 'bg-gradient-to-br from-brand-500 to-brand-700',
                      )}
                    >
                      {msg.role === 'user' ? 'You' : <Sparkles className="h-4 w-4" />}
                    </span>
                    <div
                      className={cn(
                        'max-w-[80%] whitespace-pre-wrap rounded-2xl px-4 py-3 text-sm',
                        msg.role === 'user'
                          ? 'rounded-tr-sm bg-brand-600 text-white'
                          : 'rounded-tl-sm bg-surface text-ink-800 shadow-sm ring-1 ring-ink-100',
                      )}
                    >
                      {msg.content}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
              {sending && (
                <div className="flex gap-3">
                  <span className="grid h-8 w-8 place-items-center rounded-full bg-gradient-to-br from-brand-500 to-brand-700">
                    <Sparkles className="h-4 w-4 text-white" />
                  </span>
                  <div className="flex items-center gap-1 rounded-2xl rounded-tl-sm bg-surface px-4 py-3 shadow-sm ring-1 ring-ink-100">
                    {[0, 1, 2].map((i) => (
                      <span
                        key={i}
                        className="h-2 w-2 rounded-full bg-ink-400"
                        style={{ animation: `float 1s ease-in-out ${i * 0.2}s infinite` }}
                      />
                    ))}
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Input */}
        <div className="border-t border-ink-200 bg-surface p-4">
          <div className="mx-auto flex max-w-3xl items-end gap-2">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  send();
                }
              }}
              placeholder="Ask me anything about your resume..."
              rows={1}
              className="max-h-32 flex-1 resize-none rounded-xl border border-ink-300 px-4 py-3 text-sm shadow-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
            />
            <Button onClick={send} loading={sending} disabled={!input.trim()} size="lg">
              <Send className="h-4 w-4" />
            </Button>
          </div>
          <p className="mx-auto mt-2 max-w-3xl text-center text-xs text-ink-400">
            <Zap className="mr-1 inline h-3 w-3" />
            AI Copilot provides resume advice. Always review suggestions before using.
          </p>
        </div>
      </div>
    </div>
  );
}
