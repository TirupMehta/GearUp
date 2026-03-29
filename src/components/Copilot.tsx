import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, BrainCircuit, Play, Send, Loader2 } from 'lucide-react';
import { useDashboard } from '../context/DashboardContext';
import ReactMarkdown from 'react-markdown';

export const Copilot: React.FC = () => {
  const { llmApiKey, inventory, riskScore, stockMap, updateStock } = useDashboard();
  const [messages, setMessages] = useState<{ role: 'ai' | 'user', text: string }[]>([
    { role: 'ai', text: 'Hello! I am your ShopGenie StockBuddy. Ask me questions about your inventory, or use the buttons below to generate strategic execution plans.' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const fetchGemini = async (prompt: string) => {
    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-lite-latest:generateContent?key=${llmApiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
      });
      const data = await response.json();
      if (data.error) throw new Error(data.error.message);
      return data.candidates?.[0]?.content?.parts?.[0]?.text || "Could not generate strategy.";
    } catch (error: any) {
      return `API Error: ${error.message}`;
    }
  };

  const generateBattleplan = async () => {
    if (!llmApiKey) {
      alert('Please configure your LLM API Key in the settings before generating AI plans.');
      return;
    }
    setMessages(prev => [...prev, { role: 'user', text: 'Generate Strategy' }]);
    setIsTyping(true);

    const prompt = `You are ShopGenie, an elite retail growth partner.
Based on the current inventory data:
- Products: ${inventory.length} SKUs.
- Risk Score: ${riskScore}/100.

Generate a professional, actionable 3-step strategy to improve health. Max 35 words. Use emojis.`;

    const textResponse = await fetchGemini(prompt);
    setMessages(prev => [...prev, { role: 'ai', text: textResponse }]);
    setIsTyping(false);
  };

  const handleSend = async () => {
    if (!input.trim() || !llmApiKey) {
      if (!llmApiKey) alert("Please set your API key in the settings first!");
      return;
    }

    const userText = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userText }]);
    setIsTyping(true);

    const contextPrompt = `
You are ShopGenie, a highly intelligent AI retail partner for small business owners.
Current Business Context:
- Inventory Status: ${inventory.length} products monitored.
- Business Risk Score: ${riskScore}/100.
- Stock Snapshot: ${Object.entries(stockMap).slice(0, 10).map(([n, s]) => `${n}: ${s}`).join(', ')}.

INSTRUCTIONS:
If user wants to UPDATE stock (e.g. "added 10 Maggi"), respond ONLY with:
\`\`\`json
{"intent": "UPDATE_STOCK", "product": "Exact Name", "change": <number>}
\`\`\`
Otherwise, provide short, strategic advice (<50 words). Professional and data-driven.

Recent Chat:
${messages.slice(-3).map(m => `${m.role}: ${m.text}`).join('\n')}

Owner Question: ${userText}
    `;

    const textResponse = await fetchGemini(contextPrompt);

    let finalMessage = textResponse;
    try {
      if (textResponse.includes('"intent": "UPDATE_STOCK"')) {
        const jsonMatch = textResponse.match(/\{[\s\S]*?\}/);
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0]);
          updateStock(parsed.product, parsed.change);
          finalMessage = `✅ Inventory for **${parsed.product}** updated by ${parsed.change} units.`;
        }
      }
    } catch (e) {}

    setMessages(prev => [...prev, { role: 'ai', text: finalMessage }]);
    setIsTyping(false);
  };

  return (
    <aside className="w-[340px] shrink-0 bg-panel border-l border-border flex flex-col h-full relative z-20">
      <div className="h-14 px-6 border-b border-border flex items-center gap-3 bg-background/20 backdrop-blur-sm">
        <Sparkles className="w-3.5 h-3.5 text-accent" />
        <h3 className="text-xs font-bold text-text uppercase tracking-widest leading-none">AI StockBuddy</h3>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 flex flex-col hide-scrollbar">
        {messages.map((m, i) => (
          <div key={i} className={`flex gap-3 ${m.role === 'user' ? 'flex-row-reverse' : ''}`}>
            <div className={`w-6 h-6 rounded-full shrink-0 flex items-center justify-center border border-border ${
              m.role === 'user' ? 'bg-background' : 'bg-accent/10'
            }`}>
              {m.role === 'ai' && <BrainCircuit className="w-3 h-3 text-accent" />}
            </div>
            <div className={`p-4 rounded-xl max-w-[90%] text-sm leading-relaxed ${
              m.role === 'user' 
                ? 'bg-background border border-border text-text' 
                : 'text-text-muted prose prose-sm prose-invert'
            }`}>
              {m.role === 'user' ? (
                m.text
              ) : (
                <ReactMarkdown components={{
                  p: ({ ...props }) => <p className="mb-2 last:mb-0" {...props} />,
                  ul: ({ ...props }) => <ul className="list-disc pl-4 mb-2 space-y-1" {...props} />,
                  strong: ({ ...props }) => <strong className="text-text font-semibold" {...props} />,
                }}>
                  {m.text}
                </ReactMarkdown>
              )}
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex gap-4 p-2">
            <Loader2 className="w-4 h-4 text-accent animate-spin" />
            <span className="text-[10px] uppercase font-bold tracking-widest text-text-muted">Analyzing Data...</span>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <div className="p-4 bg-background/20 border-t border-border">
        <button
          onClick={generateBattleplan}
          disabled={isTyping}
          className="w-full flex items-center justify-center gap-2 bg-background hover:bg-panel text-text font-bold py-2.5 rounded-lg mb-4 border border-border transition-all text-[10px] uppercase tracking-widest disabled:opacity-50"
        >
          <Play className="w-3 h-3" />
          Generate Strategy
        </button>

        <div className="relative group bg-background border border-border rounded-lg focus-within:border-accent/40 transition-all p-1">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
            placeholder="Ask ShopGenie..."
            className="w-full bg-transparent text-text p-3 pr-10 focus:outline-none resize-none text-sm placeholder:text-text-muted/40 min-h-[44px]"
            rows={1}
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isTyping}
            className="absolute right-2 bottom-2 p-2 text-accent hover:bg-accent/10 rounded-lg disabled:text-text-muted transition"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
};
