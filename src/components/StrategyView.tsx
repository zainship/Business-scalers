import { useState } from 'react';
import { CheckCircle, XCircle, Lightbulb, Target, Calendar, TrendingUp, ArrowRight, Loader2, RefreshCw, BarChart2 } from 'lucide-react';
import { Campaign, Strategy } from '../types';
import { PLATFORM_COLORS, PLATFORM_LABELS, generateMockStrategy } from '../lib/mockData';
import { supabase } from '../lib/supabase';

interface StrategyViewProps {
  campaign: Campaign;
  strategy: Strategy | null;
  onStrategyUpdate: (strategy: Strategy) => void;
}

export default function StrategyView({ campaign, strategy, onStrategyUpdate }: StrategyViewProps) {
  const [generating, setGenerating] = useState(false);
  const [approving, setApproving] = useState(false);

  async function generateStrategy() {
    setGenerating(true);
    await new Promise(r => setTimeout(r, 2000));
    const mockStrategy = generateMockStrategy(campaign.id, campaign.business_name, campaign.industry);
    const newStrategy: Strategy = {
      ...mockStrategy,
      id: crypto.randomUUID(),
      created_at: new Date().toISOString(),
    } as Strategy;

    // Try to save to DB
    const { data } = await supabase.from('strategies').insert({
      campaign_id: newStrategy.campaign_id,
      title: newStrategy.title,
      overview: newStrategy.overview,
      strategy_json: newStrategy.strategy_json,
      posting_schedule: newStrategy.posting_schedule,
      content_pillars: newStrategy.content_pillars,
      target_metrics: newStrategy.target_metrics,
      status: 'pending',
    }).select().maybeSingle();

    setGenerating(false);
    onStrategyUpdate(data as Strategy || newStrategy);
  }

  async function handleApprove() {
    if (!strategy) return;
    setApproving(true);
    await new Promise(r => setTimeout(r, 800));
    const updated = { ...strategy, status: 'approved' as const };
    await supabase.from('strategies').update({ status: 'approved' }).eq('id', strategy.id);
    setApproving(false);
    onStrategyUpdate(updated);
  }

  async function handleReject() {
    if (!strategy) return;
    const updated = { ...strategy, status: 'rejected' as const };
    await supabase.from('strategies').update({ status: 'rejected' }).eq('id', strategy.id);
    onStrategyUpdate(updated);
  }

  if (!strategy || generating) return (
    <div className="p-6">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Strategy</h1>
          <p className="text-gray-400 text-sm mt-1">AI-designed growth strategy for {campaign.business_name}</p>
        </div>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-10 flex flex-col items-center text-center">
        {generating ? (
          <>
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center mb-6 shadow-2xl shadow-blue-500/20">
              <Loader2 className="w-8 h-8 text-white animate-spin" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Generating Strategy...</h3>
            <p className="text-gray-400 text-sm">AI is analyzing your business and designing a personalized growth strategy</p>
          </>
        ) : (
          <>
            <div className="w-16 h-16 rounded-2xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center mb-6">
              <Lightbulb className="w-8 h-8 text-blue-400" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">No Strategy Yet</h3>
            <p className="text-gray-400 text-sm mb-8 max-w-sm">Let our AI design a personalized social media strategy tailored specifically for {campaign.business_name}</p>
            <button
              onClick={generateStrategy}
              className="px-8 py-4 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-bold rounded-xl transition-all shadow-lg shadow-blue-600/20 flex items-center gap-2"
            >
              <Lightbulb className="w-5 h-5" />
              Generate AI Strategy
              <ArrowRight className="w-4 h-4" />
            </button>
          </>
        )}
      </div>
    </div>
  );

  const pillars = Array.isArray(strategy.content_pillars) ? strategy.content_pillars : [];
  const platforms = strategy.strategy_json?.platforms || [];
  const contentMix = strategy.strategy_json?.contentMix || [];
  const goals = strategy.strategy_json?.goals || [];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Strategy</h1>
          <p className="text-gray-400 text-sm mt-1">{strategy.title}</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={generateStrategy}
            className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 text-sm font-medium rounded-xl transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            Regenerate
          </button>
          <div className={`px-3 py-1.5 rounded-xl text-sm font-medium ${
            strategy.status === 'approved' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' :
            strategy.status === 'pending' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30' :
            'bg-red-500/10 text-red-400 border border-red-500/30'
          }`}>
            {strategy.status === 'approved' ? 'Approved & Active' : strategy.status === 'pending' ? 'Awaiting Approval' : 'Rejected'}
          </div>
        </div>
      </div>

      {/* Approval CTA */}
      {strategy.status === 'pending' && (
        <div className="bg-amber-500/5 border border-amber-500/20 rounded-2xl p-5 flex items-center justify-between">
          <div className="flex items-start gap-3">
            <Lightbulb className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-white font-semibold text-sm">Strategy ready for approval</p>
              <p className="text-gray-400 text-xs mt-1">Review the strategy below and approve to start automated posting</p>
            </div>
          </div>
          <div className="flex items-center gap-3 ml-4 flex-shrink-0">
            <button
              onClick={handleReject}
              className="flex items-center gap-1.5 px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 text-sm font-medium rounded-xl transition-colors border border-red-500/20"
            >
              <XCircle className="w-4 h-4" />
              Reject
            </button>
            <button
              onClick={handleApprove}
              disabled={approving}
              className="flex items-center gap-1.5 px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-bold rounded-xl transition-colors shadow-md shadow-emerald-600/20"
            >
              {approving ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
              Approve & Activate
            </button>
          </div>
        </div>
      )}

      {/* Overview */}
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
        <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
          <Target className="w-4 h-4 text-blue-400" />
          Strategy Overview
        </h3>
        <p className="text-gray-400 text-sm leading-relaxed">{strategy.overview}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Goals */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
          <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-emerald-400" />
            90-Day Goals
          </h3>
          <div className="space-y-2.5">
            {goals.map((goal: string, i: number) => (
              <div key={i} className="flex items-start gap-2.5">
                <div className="w-5 h-5 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-emerald-400 text-[10px] font-bold">{i + 1}</span>
                </div>
                <p className="text-gray-300 text-sm leading-relaxed">{goal}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Target metrics */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
          <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
            <BarChart2 className="w-4 h-4 text-blue-400" />
            Target Metrics
          </h3>
          <div className="space-y-3">
            {Object.entries(strategy.target_metrics || {}).map(([k, v]) => (
              <div key={k} className="flex items-center justify-between py-2 border-b border-gray-800 last:border-0">
                <span className="text-gray-400 text-sm capitalize">{k.replace(/([A-Z])/g, ' $1')}</span>
                <span className="text-white text-sm font-semibold">{String(v)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Content pillars */}
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
        <h3 className="text-white font-semibold mb-5">Content Pillars</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {pillars.map(pillar => (
            <div key={pillar.name} className="bg-gray-800 rounded-xl p-4">
              <div className="w-8 h-8 rounded-lg mb-3 flex items-center justify-center text-white text-sm font-bold" style={{ backgroundColor: pillar.color }}>
                {pillar.percentage}%
              </div>
              <p className="text-white text-sm font-semibold mb-1">{pillar.name}</p>
              <p className="text-gray-500 text-xs leading-relaxed">{pillar.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Platform strategies */}
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
        <h3 className="text-white font-semibold mb-5 flex items-center gap-2">
          <Calendar className="w-4 h-4 text-blue-400" />
          Platform Strategies
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {platforms.map(ps => (
            <div key={ps.platform} className="bg-gray-800 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: PLATFORM_COLORS[ps.platform] }} />
                <span className="text-white text-sm font-semibold">{PLATFORM_LABELS[ps.platform]}</span>
                <span className="ml-auto text-xs text-gray-500 bg-gray-700 px-2 py-0.5 rounded-full">{ps.frequency}</span>
              </div>
              <div className="space-y-1.5 text-xs">
                <div className="flex flex-wrap gap-1">
                  {ps.contentTypes.map(ct => (
                    <span key={ct} className="px-2 py-0.5 rounded-md" style={{ backgroundColor: PLATFORM_COLORS[ps.platform] + '15', color: PLATFORM_COLORS[ps.platform] }}>{ct}</span>
                  ))}
                </div>
                <p className="text-gray-400 mt-2">Tone: <span className="text-gray-300">{ps.tone}</span></p>
                <p className="text-gray-400">CTA: <span className="text-gray-300">{ps.cta}</span></p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Content mix */}
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
        <h3 className="text-white font-semibold mb-5">Content Mix</h3>
        <div className="space-y-3">
          {contentMix.map(item => (
            <div key={item.type} className="flex items-center gap-4">
              <span className="w-28 text-sm text-gray-300 flex-shrink-0">{item.type}</span>
              <div className="flex-1 h-2 bg-gray-800 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-blue-500 to-cyan-400"
                  style={{ width: `${item.percentage}%` }}
                />
              </div>
              <span className="w-10 text-right text-sm font-semibold text-white flex-shrink-0">{item.percentage}%</span>
              <span className="text-gray-500 text-xs hidden lg:block flex-1">{item.description}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
