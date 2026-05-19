import { useState } from 'react';
import { Globe, TrendingUp, Users, Zap, Search, Loader2, RefreshCw, ExternalLink } from 'lucide-react';
import { Campaign, BusinessInsight } from '../types';
import { generateMockInsights } from '../lib/mockData';
import { supabase } from '../lib/supabase';

interface InsightsProps {
  campaign: Campaign;
  insights: BusinessInsight[];
  onInsightsUpdate: (insights: BusinessInsight[]) => void;
}

const INSIGHT_ICONS: Record<string, React.ReactNode> = {
  website: <Globe className="w-5 h-5" />,
  competitor: <Search className="w-5 h-5" />,
  audience: <Users className="w-5 h-5" />,
  trend: <TrendingUp className="w-5 h-5" />,
};

const INSIGHT_COLORS: Record<string, string> = {
  website: '#2563eb',
  competitor: '#e11d48',
  audience: '#0891b2',
  trend: '#16a34a',
};

export default function Insights({ campaign, insights, onInsightsUpdate }: InsightsProps) {
  const [scanning, setScanning] = useState(false);

  async function scanWebsite() {
    setScanning(true);
    await new Promise(r => setTimeout(r, 2500));
    const newInsights = generateMockInsights(campaign.id, campaign.business_name, campaign.industry);
    const created: BusinessInsight[] = newInsights.map(i => ({
      ...i,
      id: crypto.randomUUID(),
      created_at: new Date().toISOString(),
    }));

    for (const insight of created) {
      await supabase.from('business_insights').insert({
        campaign_id: insight.campaign_id,
        insight_type: insight.insight_type,
        title: insight.title,
        content: insight.content,
        source_url: insight.source_url,
        metadata: insight.metadata,
      });
    }

    setScanning(false);
    onInsightsUpdate([...insights, ...created]);
  }

  const categories = ['website', 'competitor', 'audience', 'trend'];

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Business Insights</h1>
          <p className="text-gray-400 text-sm mt-1">AI-gathered intelligence about your business and market</p>
        </div>
        <button
          onClick={scanWebsite}
          disabled={scanning}
          className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-semibold rounded-xl transition-all shadow-lg shadow-blue-600/20 disabled:opacity-60"
        >
          {scanning ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
          {scanning ? 'Scanning...' : 'Rescan Website'}
        </button>
      </div>

      {/* Business info card */}
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
        <div className="flex items-start gap-4">
          <div className="w-16 h-16 rounded-2xl bg-blue-600/10 border border-blue-500/20 flex items-center justify-center flex-shrink-0">
            <Globe className="w-8 h-8 text-blue-400" />
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-bold text-white">{campaign.business_name}</h3>
            <a href={campaign.business_url} target="_blank" rel="noopener noreferrer" className="text-blue-400 text-sm flex items-center gap-1 hover:text-blue-300 transition-colors mt-1">
              {campaign.business_url}
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
            <div className="flex items-center gap-4 mt-3">
              <div>
                <p className="text-xs text-gray-500">Industry</p>
                <p className="text-sm text-white font-medium">{campaign.industry || 'Technology'}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Brand Voice</p>
                <p className="text-sm text-white font-medium">{campaign.brand_voice || 'Professional'}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Target Audience</p>
                <p className="text-sm text-white font-medium">{campaign.target_audience || '25-40 year olds'}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {scanning && (
        <div className="bg-blue-600/5 border border-blue-500/20 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <Loader2 className="w-5 h-5 text-blue-400 animate-spin" />
            <p className="text-blue-400 font-medium">AI scanning in progress...</p>
          </div>
          <div className="space-y-2">
            {['Crawling website pages', 'Extracting business data', 'Analyzing competitors', 'Identifying market trends', 'Building insight report'].map((s, i) => (
              <div key={s} className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" style={{ animationDelay: `${i * 200}ms` }} />
                <span className="text-gray-400 text-sm">{s}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {insights.length === 0 && !scanning ? (
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-16 flex flex-col items-center text-center">
          <div className="w-16 h-16 rounded-2xl bg-blue-600/10 border border-blue-500/20 flex items-center justify-center mb-6">
            <Zap className="w-8 h-8 text-blue-400" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">No Insights Yet</h3>
          <p className="text-gray-400 text-sm mb-8 max-w-sm">Scan your website to gather business intelligence, competitor analysis, and market trends</p>
          <button onClick={scanWebsite} className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl transition-colors">
            Start Scanning
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {categories.map(cat => {
            const catInsights = insights.filter(i => i.insight_type === cat);
            if (catInsights.length === 0) return null;
            return catInsights.map(insight => (
              <div key={insight.id} className="bg-gray-900 border border-gray-800 rounded-2xl p-5 hover:border-gray-700 transition-colors">
                <div className="flex items-start gap-3 mb-3">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: INSIGHT_COLORS[insight.insight_type] + '15', color: INSIGHT_COLORS[insight.insight_type] }}
                  >
                    {INSIGHT_ICONS[insight.insight_type]}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <p className="text-white font-semibold text-sm">{insight.title}</p>
                      <span
                        className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full capitalize"
                        style={{ backgroundColor: INSIGHT_COLORS[insight.insight_type] + '15', color: INSIGHT_COLORS[insight.insight_type] }}
                      >
                        {insight.insight_type}
                      </span>
                    </div>
                  </div>
                </div>
                <p className="text-gray-400 text-sm leading-relaxed">{insight.content}</p>
                {insight.metadata && Object.keys(insight.metadata).length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t border-gray-800">
                    {Object.entries(insight.metadata).slice(0, 3).map(([k, v]) => (
                      <div key={k} className="bg-gray-800 rounded-lg px-2.5 py-1">
                        <span className="text-gray-500 text-[10px] capitalize">{k.replace(/([A-Z])/g, ' $1')}: </span>
                        <span className="text-gray-300 text-[10px] font-medium">{String(v)}</span>
                      </div>
                    ))}
                  </div>
                )}
                <p className="text-gray-600 text-[10px] mt-2">{new Date(insight.created_at).toLocaleDateString()}</p>
              </div>
            ));
          })}
        </div>
      )}
    </div>
  );
}
