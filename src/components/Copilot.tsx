import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, BrainCircuit, Play, Send } from 'lucide-react';
import { useDashboard } from '../context/DashboardContext';
import ReactMarkdown from 'react-markdown';

export const Copilot: React.FC = () => {
  const { llmApiKey, inventory, riskScore, stockMap, updateStock } = useDashboard();
  const [messages, setMessages] = useState<{role: 'ai'|'user', text: string}[]>([
    { role: 'ai', text: 'Hello! I am your ShopGenie Copilot. Ask me questions about your inventory, or use the buttons below to generate strategic execution plans.' }
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
    setMessages(prev => [...prev, { role: 'user', text: 'Generate Weekly Battleplan' }]);
    setIsTyping(true);
    
    const prompt = `You are a GenAI Copilot for MSME retail. 
Generate a 3-step actionable Weekly Battleplan. 
CRITICAL RULE: STRICTLY UNDER 10 WORDS TOTAL. Brutally short. 11TH WORD IS NEVER WRITTEN.`;

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

    // Build context behind the scenes
    const deadWeightCount = inventory.filter(i => i.Status === 'Dead Weight').length;
    let fastMovingStr = inventory.filter(i => i.Status === 'Fast Moving').slice(0,3).map(i => i.ProductName).join(", ");
    
    const contextPrompt = `
You are ShopGenie, an AI acting as a business dashboard copilot.
Context Data: You currently have ${deadWeightCount} items marked as slow-selling Dead Weight. 
Your fast moving products include: ${fastMovingStr}. The overall Risk Score is ${riskScore}/100.

IMPORTANT INSTRUCTION FOR INVENTORY UPDATES:
If the user's message is commanding you to update, add, or deduct inventory/stock (e.g., "added 50 units of sugar", "sold 10 milks"), you MUST reply ONLY with a JSON block in this exact format, with no extra text:
\`\`\`json
{
  "intent": "UPDATE_STOCK",
  "product": "Exact Product Name",
  "change": <number>
}
\`\`\`
The "change" should be positive if stock is added, and negative if stock is sold/removed.
You must map their fuzzy product name to the closest EXACT name from this database: ${Object.keys(stockMap).join(', ')}.

CRITICAL RULE FOR ALL NON-INVENTORY ANSWERS: Answer normally but be AS SHORT AS POSSIBLE. If it can be answered under 10 words, the 11th word is forbidden. Use minimal formatting. Keep it brutally brief.

Recent Chat:
${messages.slice(-4).map(m => `${m.role === 'user' ? 'BO' : 'AI'}: ${m.text}`).join('\n')}

User Question: ${userText}
    `;

    const textResponse = await fetchGemini(contextPrompt);
    
    // Check if Gemini returned a JSON stock update intent
    let finalMessage = textResponse;
    try {
      if (textResponse.includes('"intent": "UPDATE_STOCK"')) {
        const jsonMatch = textResponse.match(/```json\n([\s\S]*?)\n```/) || textResponse.match(/```\n([\s\S]*?)\n```/);
        
        let jsonStr = textResponse;
        if (jsonMatch && jsonMatch[1]) {
           jsonStr = jsonMatch[1];
        } else {
           // Fallback if no markdown blocks used
           const startIndex = textResponse.indexOf('{');
           const endIndex = textResponse.lastIndexOf('}');
           if (startIndex !== -1 && endIndex !== -1) {
             jsonStr = textResponse.substring(startIndex, endIndex + 1);
           }
        }

        const parsed = JSON.parse(jsonStr);
        if (parsed.intent === 'UPDATE_STOCK' && parsed.product && typeof parsed.change === 'number') {
          updateStock(parsed.product, parsed.change);
          finalMessage = `✅ I have successfully updated the inventory for **${parsed.product}**. The stock has been modified by ${parsed.change} units.`;
        }
      }
    } catch (e) {
      console.error("Failed to parse stock intent", e);
      // Fallback to whatever Gemini generated
    }
    
    setMessages(prev => [...prev, { role: 'ai', text: finalMessage }]);
    setIsTyping(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  const simulateVoice = () => {
    setInput("I just received a shipment of 50 units of Maggi. Add it to stock.");
  };

  return (
    <aside className="w-[360px] shrink-0 bg-[#000000]/40 backdrop-blur-xl border border-white/5 rounded-3xl border-l border-white/5 flex flex-col h-full right-0 top-0 hidden xl:flex absolute xl:relative z-20">
      <div className="p-4 border-b border-white/5 flex items-center gap-2 bg-[#000000]/30 backdrop-blur-sm">
        <Sparkles className="w-5 h-5 text-accent" />
        <h3 className="font-semibold text-slate-100">AI Copilot</h3>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 flex flex-col hide-scrollbar">
        {messages.map((m, i) => (
          <div key={i} className={`flex gap-3 ${m.role === 'user' ? 'flex-row-reverse' : ''}`}>
            <div className={`w-8 h-8 rounded-full shrink-0 flex items-center justify-center ${
              m.role === 'user' ? 'bg-primary' : 'bg-slate-700'
            }`}>
              {m.role === 'user' ? null : <BrainCircuit className="w-4 h-4 text-accent" />}
            </div>
            <div className={`p-3 rounded-2xl max-w-[85%] text-sm ${
              m.role === 'user' 
                ? 'bg-primary text-white rounded-tr-none' 
                : 'bg-white/5 text-zinc-300 rounded-tl-none border border-white/5 prose prose-invert prose-sm'
            }`}>
              {m.role === 'user' ? (
                m.text
              ) : (
                <ReactMarkdown components={{
                  p: ({node, ...props}) => <p className="mb-2 last:mb-0" {...props} />,
                  ul: ({node, ...props}) => <ul className="list-disc pl-4 mb-2 space-y-1" {...props} />,
                  ol: ({node, ...props}) => <ol className="list-decimal pl-4 mb-2 space-y-1" {...props} />,
                  strong: ({node, ...props}) => <strong className="text-white font-semibold" {...props} />,
                }}>
                  {m.text}
                </ReactMarkdown>
              )}
            </div>
          </div>
        ))}
        {isTyping && (
           <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full shrink-0 flex items-center justify-center bg-slate-700">
                <BrainCircuit className="w-4 h-4 text-accent" />
              </div>
              <div className="p-3 py-4 rounded-2xl bg-white/5 rounded-tl-none border border-white/5 flex gap-1 items-center">
                <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"></div>
              </div>
           </div>
        )}
        <div ref={bottomRef} />
      </div>

      <div className="p-4 border-t border-white/5 bg-[#000000]/40">
        
        <button 
          onClick={generateBattleplan}
          disabled={isTyping}
          className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-primary to-accent hover:opacity-90 text-white font-medium py-2 rounded-2xl mb-4 shadow-[0_0_20px_rgba(255,255,255,0.05)] shadow-primary/20 transition-all text-sm disabled:opacity-50"
        >
          <Play className="w-4 h-4" />
          Generate Weekly Battleplan
        </button>

        <div className="relative flex items-center gap-2">
          {/* Voice Feature */}
          <button 
            onClick={simulateVoice}
            className="p-2 shrink-0 text-zinc-400 hover:text-accent hover:bg-white/5 rounded-2xl border border-white/5 transition"
            title="Voice-to-Action Simulation"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" x2="12" y1="19" y2="22"/></svg>
          </button>

          <input 
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask Copilot..."
            className="w-full bg-white/5 border border-white/5 rounded-full py-2 pl-4 pr-10 text-sm focus:outline-none focus:border-primary text-white"
          />
          <button 
            onClick={handleSend}
            disabled={!input.trim() || isTyping}
            className="absolute right-1 top-1 p-1.5 bg-primary text-white rounded-full hover:bg-primaryHover disabled:bg-slate-600 transition"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
};
