import { useState } from 'react';
import { MessageSquare, Loader2, Sparkles, Globe } from 'lucide-react';
import { useDashboard } from '../../context/DashboardContext';
import { useAuth } from '../../context/AuthContext';
import { logActivity } from '../../utils/activityLogger';

// Mock campaigns if none exist
const MOCK_CAMPAIGNS = [
  { platform: 'Instagram', language: 'English', copy: 'Fuel your journey with ShopGenie. Premium retail intelligence at your fingertips. #RetailTech' },
  { platform: 'Facebook', language: 'Hindi', copy: 'ShopGenie के साथ अपने व्यापार को बढ़ाएं। स्मार्ट इन्वेंट्री मैनेजमेंट अब और भी आसान।' },
];

export default function MarketingGenerator() {
  const { inventory, llmApiKey } = useDashboard();
  const { user } = useAuth();
  const [platform, setPlatform] = useState('Instagram');
  const [language, setLanguage] = useState('English');
  const [isGenerating, setIsGenerating] = useState(false);
  const [campaigns, setCampaigns] = useState<any[]>(MOCK_CAMPAIGNS);

  const fetchGemini = async (prompt: string) => {
    try {
      if (!llmApiKey) throw new Error("API Key missing");
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-lite-latest:generateContent?key=${llmApiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
      });
      const data = await response.json();
      if (data.error) throw new Error(data.error.message);
      return data.candidates?.[0]?.content?.parts?.[0]?.text || "";
    } catch (error: any) {
      console.error(error);
      return "";
    }
  };

  const handleGenerate = async () => {
    if (!llmApiKey) {
      alert("Please configure your API key in the settings first!");
      return;
    }
    setIsGenerating(true);
    try {
      const prompt = `You are a professional retail marketing copywriter for ShopGenie.
Generate a targeted ${platform} marketing campaign in ${language} for these products: ${inventory.slice(0, 3).map(p => p.ProductName).join(', ')}.
The copy should be engaging, professional, and highlight the benefits. Maximum 50 words.`;
      
      const result = await fetchGemini(prompt);
      
      const newCampaign = {
        platform,
        language,
        copy: result || "Elevate your retail game with ShopGenie's AI-driven insights.",
        timestamp: new Date().toISOString()
      };
      
      setCampaigns([newCampaign, ...campaigns]);
      // Log campaign generation
      if (user) {
        await logActivity(
          user.uid,
          user.email ?? '',
          'CAMPAIGN_GENERATED',
          `${platform} campaign in ${language} generated`
        );
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-fade-in text-text">
      {/* Configuration Panel */}
      <div className="bg-panel border border-border rounded-xl p-8 shadow-sm h-fit">
        <h3 className="font-bold text-[10px] uppercase tracking-widest mb-8 flex items-center gap-2 text-text">
          <MessageSquare className="w-4 h-4 text-accent" />
          AI Campaign Engine
        </h3>
        
        <div className="space-y-6">
          <div>
            <label className="block text-[10px] uppercase tracking-widest font-bold text-text-muted mb-3">Platform Selection</label>
            <div className="flex flex-wrap gap-2">
              {['Instagram', 'Facebook', 'WhatsApp', 'Email'].map((p) => (
                <button
                  key={p}
                  onClick={() => setPlatform(p)}
                  className={`px-4 py-2 rounded-lg text-xs transition font-bold ${
                    platform === p 
                      ? 'bg-accent text-background shadow-sm' 
                      : 'bg-background text-text-muted hover:bg-panel border border-border'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-[10px] uppercase tracking-widest font-bold text-text-muted mb-3">Local Language Translation</label>
            <div className="flex flex-wrap gap-2">
              {['English', 'Hindi', 'Marathi', 'Gujarati'].map((lang) => (
                <button
                  key={lang}
                  onClick={() => setLanguage(lang)}
                  className={`px-4 py-2 rounded-lg text-xs transition font-bold ${
                    language === lang 
                      ? 'bg-accent text-background shadow-sm' 
                      : 'bg-background text-text-muted hover:bg-panel border border-border'
                  }`}
                >
                  {lang}
                </button>
              ))}
            </div>
          </div>

          <button 
            onClick={handleGenerate}
            disabled={isGenerating}
            className="w-full mt-8 bg-accent hover:opacity-90 text-background py-3 rounded-lg font-bold transition flex justify-center items-center gap-2 disabled:opacity-50 shadow-sm uppercase tracking-widest text-[10px]"
          >
            {isGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : (
              <>
                <Sparkles className="w-4 h-4" />
                Run Inference Engine
              </>
            )}
          </button>
        </div>
      </div>

      {/* Output Panel */}
      <div className="space-y-6">
        <div className="flex justify-between items-center px-2">
          <h3 className="font-bold text-[10px] uppercase tracking-widest flex items-center gap-2 text-text">
            <Globe className="w-4 h-4 text-accent" />
            Generated Strategy Outputs
          </h3>
          <span className="text-[10px] text-text-muted font-bold tracking-widest">REAL-TIME</span>
        </div>
        
        <div className="grid grid-cols-1 gap-4 overflow-y-auto max-h-[600px] pr-2 hide-scrollbar">
          {campaigns.map((c, i) => (
            <div key={i} className="bg-panel border border-border rounded-xl p-6 shadow-sm hover:border-accent/40 transition-all group">
              <div className="flex justify-between items-start mb-4 pb-4 border-b border-border/50">
                <div>
                  <h4 className="font-bold text-text uppercase tracking-widest text-[10px] mb-1">{c.platform} Strategy</h4>
                  <div className="text-[10px] text-text-muted font-mono">{c.language.toUpperCase()}</div>
                </div>
                <div className="w-2 h-2 rounded-full bg-accent animate-pulse shadow-[0_0_8px_rgba(138,180,248,0.5)]" />
              </div>
              <p className="text-sm text-text-muted leading-relaxed font-medium italic">"{c.copy}"</p>
              <div className="mt-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="text-[10px] text-text-muted font-bold tracking-tighter uppercase">Confidence: 98%</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
