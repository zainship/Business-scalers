import { useState } from 'react';
import { Globe, ArrowRight, Zap, CheckCircle, Loader2, Activity, Instagram, Youtube, Twitter, Linkedin, Facebook, AlertCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Campaign, Platform, SocialConnection } from '../types';
import { generateMockConnections } from '../lib/mockData';

interface OnboardingProps {
  onComplete: (campaign: Campaign, connections: SocialConnection[]) => void;
}

type Step = 'url' | 'analyzing' | 'connections' | 'done';

const PLATFORMS: { id: Platform; label: string; icon: React.ReactNode; color: string; bg: string }[] = [
  { id: 'instagram', label: 'Instagram', icon: <Instagram className="w-5 h-5" />, color: '#E1306C', bg: 'bg-pink-500/10' },
  { id: 'tiktok', label: 'TikTok', icon: <Youtube className="w-5 h-5" />, color: '#010101', bg: 'bg-gray-500/10' },
  { id: 'twitter', label: 'Twitter / X', icon: <Twitter className="w-5 h-5" />, color: '#1DA1F2', bg: 'bg-sky-500/10' },
  { id: 'linkedin', label: 'LinkedIn', icon: <Linkedin className="w-5 h-5" />, color: '#0A66C2', bg: 'bg-blue-500/10' },
  { id: 'facebook', label: 'Facebook', icon: <Facebook className="w-5 h-5" />, color: '#1877F2', bg: 'bg-blue-400/10' },
];

const ANALYSIS_STEPS = [
  'Fetching website content...',
  'Extracting business information...',
  'Identifying target audience...',
  'Analyzing competitors...',
  'Profiling brand voice...',
  'Building knowledge base...',
  'Preparing AI strategy engine...',
];

export default function Onboarding({ onComplete }: OnboardingProps) {
  const [step, setStep] = useState<Step>('url');
  const [url, setUrl] = useState('');
  const [urlError, setUrlError] = useState('');
  const [analysisStep, setAnalysisStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [handles, setHandles] = useState<Partial<Record<Platform, string>>>({});
  const [connecting, setConnecting] = useState<Platform | null>(null);
  const [connectedPlatforms, setConnectedPlatforms] = useState<Platform[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  function normalizeUrl(raw: string) {
    let u = raw.trim();
    if (!u.startsWith('http://') && !u.startsWith('https://')) u = 'https://' + u;
    return u;
  }

  async function handleUrlSubmit() {
    setUrlError('');
    if (!url.trim()) { setUrlError('Please enter your website URL'); return; }
    setLoading(true);
    setStep('analyzing');
    setAnalysisStep(0);
    setCompletedSteps([]);

    const businessUrl = normalizeUrl(url);
    let hostname = '';
    try { hostname = new URL(businessUrl).hostname.replace('www.', ''); } catch { hostname = url; }
    const businessName = hostname.split('.')[0].replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());

    // Simulate progressive analysis
    for (let i = 0; i < ANALYSIS_STEPS.length; i++) {
      await new Promise(r => setTimeout(r, 600 + Math.random() * 400));
      setAnalysisStep(i + 1);
      setCompletedSteps(prev => [...prev, i]);
    }

    await new Promise(r => setTimeout(r, 500));

    // Create campaign in Supabase (with anonymous/guest session fallback)
    const { data: { user } } = await supabase.auth.getUser();

    let campaignData: Campaign | null = null;

    if (user) {
      const { data, error: err } = await supabase.from('campaigns').insert({
        user_id: user.id,
        business_url: businessUrl,
        business_name: businessName,
        industry: 'Technology',
        status: 'connecting',
      }).select().maybeSingle();
      if (!err && data) campaignData = data as Campaign;
    }

    if (!campaignData) {
      // Local fallback for demo
      campaignData = {
        id: crypto.randomUUID(),
        user_id: 'demo',
        business_url: businessUrl,
        business_name: businessName,
        business_description: `Leading ${businessName} business providing innovative solutions.`,
        industry: 'Technology',
        target_audience: 'Young professionals aged 25-40',
        brand_voice: 'Professional yet approachable',
        logo_url: '',
        primary_color: '#2563eb',
        status: 'connecting',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
    }

    setLoading(false);
    setStep('connections');
    // pass campaign up temporarily through state
    (window as unknown as Record<string, unknown>).__pendingCampaign = campaignData;
  }

  async function handleConnect(platform: Platform) {
    const handle = handles[platform]?.trim();
    if (!handle) return;
    setConnecting(platform);
    await new Promise(r => setTimeout(r, 1200 + Math.random() * 800));
    setConnecting(null);
    setConnectedPlatforms(prev => [...prev, platform]);
  }

  async function handleLaunch() {
    setLoading(true);
    const campaign = (window as unknown as Record<string, Campaign>).__pendingCampaign as Campaign;
    const mockConns = generateMockConnections(campaign.id);
    const connections: SocialConnection[] = mockConns.map((c, i) => ({
      ...c,
      id: crypto.randomUUID(),
      platform: c.platform as Platform,
      account_handle: handles[c.platform as Platform] || `@${campaign.business_name.toLowerCase().replace(/\s+/g, '')}`,
      connected: connectedPlatforms.includes(c.platform as Platform),
      status: connectedPlatforms.includes(c.platform as Platform) ? 'connected' : 'disconnected',
      followers: connectedPlatforms.includes(c.platform as Platform) ? [12400, 8200, 34700, 5900, 22100][i] : 0,
      avg_engagement_rate: connectedPlatforms.includes(c.platform as Platform) ? [4.2, 6.8, 2.1, 3.5, 2.9][i] : 0,
      best_posting_times: ['9:00 AM', '12:00 PM', '6:00 PM'],
    } as SocialConnection));

    await new Promise(r => setTimeout(r, 800));
    setLoading(false);
    onComplete(campaign, connections);
  }

  if (step === 'url') return (
    <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background glows */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-blue-600/10 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-cyan-600/8 blur-3xl" />
      </div>

      <div className="relative w-full max-w-lg">
        {/* Logo */}
        <div className="flex items-center justify-center gap-3 mb-12">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center shadow-2xl shadow-blue-500/30">
            <Activity className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">HyperScale</h1>
            <p className="text-xs text-gray-500">AI Marketing Agent</p>
          </div>
        </div>

        {/* Hero */}
        <div className="text-center mb-10">
          <h2 className="text-4xl font-bold text-white mb-4 leading-tight">
            Scale Your Business<br />
            <span className="bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">24/7 on Autopilot</span>
          </h2>
          <p className="text-gray-400 text-lg">Enter your website URL and let our AI agent generate hype, create content, and grow your social presence autonomously.</p>
        </div>

        {/* Features */}
        <div className="grid grid-cols-3 gap-3 mb-10">
          {[
            { icon: '🔍', text: 'Website Analysis' },
            { icon: '🤖', text: 'AI Content Gen' },
            { icon: '📅', text: 'Auto Scheduling' },
          ].map(f => (
            <div key={f.text} className="bg-gray-900 border border-gray-800 rounded-xl p-3 text-center">
              <div className="text-2xl mb-1">{f.icon}</div>
              <p className="text-xs text-gray-400 font-medium">{f.text}</p>
            </div>
          ))}
        </div>

        {/* URL Input */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
          <label className="block text-sm font-medium text-gray-300 mb-3">
            Your Business Website
          </label>
          <div className="flex gap-3">
            <div className="flex-1 flex items-center bg-gray-800 border border-gray-700 rounded-xl px-4 gap-2 focus-within:border-blue-500 transition-colors">
              <Globe className="w-4 h-4 text-gray-500 flex-shrink-0" />
              <input
                type="url"
                value={url}
                onChange={e => { setUrl(e.target.value); setUrlError(''); }}
                onKeyDown={e => e.key === 'Enter' && handleUrlSubmit()}
                placeholder="https://yourbusiness.com"
                className="flex-1 bg-transparent py-3 text-white text-sm outline-none placeholder-gray-600"
              />
            </div>
            <button
              onClick={handleUrlSubmit}
              disabled={loading}
              className="px-5 py-3 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl transition-colors flex items-center gap-2 disabled:opacity-50"
            >
              <Zap className="w-4 h-4" />
              <span>Launch</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
          {urlError && (
            <div className="mt-2 flex items-center gap-1.5 text-red-400 text-xs">
              <AlertCircle className="w-3.5 h-3.5" />
              {urlError}
            </div>
          )}
          {error && (
            <div className="mt-2 flex items-center gap-1.5 text-red-400 text-xs">
              <AlertCircle className="w-3.5 h-3.5" />
              {error}
            </div>
          )}
          <p className="text-xs text-gray-600 mt-3">We'll analyze your site and build a complete marketing strategy</p>
        </div>
      </div>
    </div>
  );

  if (step === 'analyzing') return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-blue-500/30">
            <Activity className="w-8 h-8 text-white animate-pulse" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Analyzing Your Business</h2>
          <p className="text-gray-500 text-sm">Our AI is learning everything about your business...</p>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 space-y-3">
          {ANALYSIS_STEPS.map((s, i) => {
            const done = completedSteps.includes(i);
            const active = analysisStep === i + 1 && !done;
            return (
              <div key={i} className={`flex items-center gap-3 transition-all duration-300 ${i > analysisStep ? 'opacity-30' : 'opacity-100'}`}>
                <div className="w-5 h-5 flex-shrink-0">
                  {done ? (
                    <CheckCircle className="w-5 h-5 text-emerald-400" />
                  ) : active ? (
                    <Loader2 className="w-5 h-5 text-blue-400 animate-spin" />
                  ) : (
                    <div className="w-5 h-5 rounded-full border-2 border-gray-700" />
                  )}
                </div>
                <span className={`text-sm ${done ? 'text-gray-400 line-through' : active ? 'text-white font-medium' : 'text-gray-600'}`}>{s}</span>
              </div>
            );
          })}
        </div>

        <div className="mt-6 bg-gray-900 border border-gray-800 rounded-xl p-4">
          <div className="flex justify-between text-xs text-gray-500 mb-2">
            <span>Analysis Progress</span>
            <span>{Math.round((completedSteps.length / ANALYSIS_STEPS.length) * 100)}%</span>
          </div>
          <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full transition-all duration-500"
              style={{ width: `${(completedSteps.length / ANALYSIS_STEPS.length) * 100}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );

  if (step === 'connections') return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center p-6">
      <div className="w-full max-w-lg">
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center mx-auto mb-4 shadow-xl shadow-blue-500/20">
            <CheckCircle className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Connect Your Accounts</h2>
          <p className="text-gray-400 text-sm">Connect your social media accounts so HyperScale can manage and grow them autonomously.</p>
        </div>

        <div className="space-y-3 mb-6">
          {PLATFORMS.map(p => {
            const isConnected = connectedPlatforms.includes(p.id);
            const isConnecting = connecting === p.id;
            return (
              <div key={p.id} className={`bg-gray-900 border rounded-xl p-4 transition-all ${isConnected ? 'border-emerald-500/40' : 'border-gray-800'}`}>
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl ${p.bg} flex items-center justify-center`} style={{ color: p.color }}>
                    {p.icon}
                  </div>
                  <div className="flex-1">
                    <p className="text-white text-sm font-medium">{p.label}</p>
                    {isConnected ? (
                      <p className="text-emerald-400 text-xs">Connected as @{handles[p.id]}</p>
                    ) : (
                      <input
                        type="text"
                        value={handles[p.id] || ''}
                        onChange={e => setHandles(prev => ({ ...prev, [p.id]: e.target.value }))}
                        placeholder="@username"
                        className="mt-1 bg-transparent text-gray-400 text-xs outline-none placeholder-gray-600 w-full"
                      />
                    )}
                  </div>
                  {isConnected ? (
                    <CheckCircle className="w-5 h-5 text-emerald-400" />
                  ) : (
                    <button
                      onClick={() => handleConnect(p.id)}
                      disabled={isConnecting || !handles[p.id]?.trim()}
                      className="px-3 py-1.5 bg-gray-800 hover:bg-gray-700 text-gray-300 text-xs font-medium rounded-lg transition-colors disabled:opacity-40 flex items-center gap-1.5"
                    >
                      {isConnecting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : null}
                      {isConnecting ? 'Connecting...' : 'Connect'}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <button
          onClick={handleLaunch}
          disabled={loading || connectedPlatforms.length === 0}
          className="w-full py-4 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-bold rounded-xl transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-blue-600/20"
        >
          {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Zap className="w-5 h-5" />}
          {loading ? 'Launching Agent...' : `Launch AI Agent (${connectedPlatforms.length} platform${connectedPlatforms.length !== 1 ? 's' : ''})`}
        </button>
        <p className="text-center text-xs text-gray-600 mt-3">Connect at least 1 platform to continue</p>
      </div>
    </div>
  );

  return null;
}
