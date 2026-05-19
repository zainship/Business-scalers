import { useState } from 'react';
import { Globe, Save, Loader2, CheckCircle, Trash2, AlertCircle, Activity } from 'lucide-react';
import { Campaign } from '../types';
import { supabase } from '../lib/supabase';

interface SettingsViewProps {
  campaign: Campaign;
  onCampaignUpdate: (campaign: Campaign) => void;
  onReset: () => void;
}

export default function SettingsView({ campaign, onCampaignUpdate, onReset }: SettingsViewProps) {
  const [form, setForm] = useState({
    business_name: campaign.business_name,
    business_url: campaign.business_url,
    business_description: campaign.business_description,
    industry: campaign.industry,
    target_audience: campaign.target_audience,
    brand_voice: campaign.brand_voice,
  });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [confirmReset, setConfirmReset] = useState(false);

  async function handleSave() {
    setSaving(true);
    await new Promise(r => setTimeout(r, 800));
    const { error } = await supabase.from('campaigns').update({
      ...form,
      updated_at: new Date().toISOString(),
    }).eq('id', campaign.id);

    setSaving(false);
    if (!error) {
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
      onCampaignUpdate({ ...campaign, ...form, updated_at: new Date().toISOString() });
    }
  }

  const industries = ['Technology', 'E-commerce', 'Food & Beverage', 'Fashion', 'Health & Wellness', 'Finance', 'Real Estate', 'Education', 'Travel', 'Entertainment', 'B2B Services', 'Non-profit', 'Other'];
  const brandVoices = ['Professional & Authoritative', 'Fun & Playful', 'Inspirational', 'Educational', 'Conversational', 'Luxury & Premium', 'Casual & Friendly', 'Bold & Edgy'];

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Settings</h1>
          <p className="text-gray-400 text-sm mt-1">Configure your AI marketing agent</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-5 py-3 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl transition-colors disabled:opacity-60 shadow-lg shadow-blue-600/20"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : saved ? <CheckCircle className="w-4 h-4" /> : <Save className="w-4 h-4" />}
          {saving ? 'Saving...' : saved ? 'Saved!' : 'Save Changes'}
        </button>
      </div>

      {/* Business info */}
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 space-y-5">
        <h3 className="text-white font-semibold flex items-center gap-2">
          <Globe className="w-4 h-4 text-blue-400" />
          Business Information
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-gray-400 mb-2">Business Name</label>
            <input
              type="text"
              value={form.business_name}
              onChange={e => setForm(p => ({ ...p, business_name: e.target.value }))}
              className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-blue-500 transition-colors"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-2">Website URL</label>
            <input
              type="url"
              value={form.business_url}
              onChange={e => setForm(p => ({ ...p, business_url: e.target.value }))}
              className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-blue-500 transition-colors"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-2">Industry</label>
            <select
              value={form.industry}
              onChange={e => setForm(p => ({ ...p, industry: e.target.value }))}
              className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-blue-500 transition-colors"
            >
              {industries.map(i => <option key={i} value={i}>{i}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-2">Brand Voice</label>
            <select
              value={form.brand_voice}
              onChange={e => setForm(p => ({ ...p, brand_voice: e.target.value }))}
              className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-blue-500 transition-colors"
            >
              {brandVoices.map(v => <option key={v} value={v}>{v}</option>)}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm text-gray-400 mb-2">Business Description</label>
          <textarea
            value={form.business_description}
            onChange={e => setForm(p => ({ ...p, business_description: e.target.value }))}
            rows={3}
            className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-blue-500 transition-colors resize-none"
            placeholder="Describe your business, products, and unique value proposition..."
          />
        </div>

        <div>
          <label className="block text-sm text-gray-400 mb-2">Target Audience</label>
          <textarea
            value={form.target_audience}
            onChange={e => setForm(p => ({ ...p, target_audience: e.target.value }))}
            rows={2}
            className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-blue-500 transition-colors resize-none"
            placeholder="Describe your ideal customer demographics, interests, and behaviors..."
          />
        </div>
      </div>

      {/* Agent settings */}
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 space-y-4">
        <h3 className="text-white font-semibold flex items-center gap-2">
          <Activity className="w-4 h-4 text-blue-400" />
          Agent Configuration
        </h3>

        {[
          { label: 'Auto-Publish Posts', desc: 'Agent automatically publishes scheduled posts', enabled: true },
          { label: 'AI Content Generation', desc: 'Generate new content batches automatically every week', enabled: true },
          { label: 'Engagement Monitoring', desc: 'Monitor and respond to comments and mentions', enabled: true },
          { label: 'Competitor Tracking', desc: 'Track competitor content and trends weekly', enabled: false },
          { label: 'Performance Reports', desc: 'Receive weekly performance summary emails', enabled: true },
        ].map(setting => (
          <div key={setting.label} className="flex items-center justify-between py-3 border-b border-gray-800 last:border-0">
            <div>
              <p className="text-white text-sm font-medium">{setting.label}</p>
              <p className="text-gray-500 text-xs mt-0.5">{setting.desc}</p>
            </div>
            <div className={`w-11 h-6 rounded-full flex items-center px-0.5 cursor-pointer transition-colors ${setting.enabled ? 'bg-blue-600 justify-end' : 'bg-gray-700 justify-start'}`}>
              <div className="w-5 h-5 rounded-full bg-white shadow" />
            </div>
          </div>
        ))}
      </div>

      {/* Danger zone */}
      <div className="bg-red-500/5 border border-red-500/20 rounded-2xl p-6">
        <h3 className="text-red-400 font-semibold mb-2 flex items-center gap-2">
          <AlertCircle className="w-4 h-4" />
          Danger Zone
        </h3>
        <p className="text-gray-400 text-sm mb-4">Reset the agent and start over with a new business. All data will be cleared.</p>
        {!confirmReset ? (
          <button
            onClick={() => setConfirmReset(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 text-sm font-medium rounded-xl transition-colors border border-red-500/30"
          >
            <Trash2 className="w-4 h-4" />
            Reset Agent
          </button>
        ) : (
          <div className="flex items-center gap-3">
            <p className="text-red-300 text-sm font-medium">Are you sure? This cannot be undone.</p>
            <button onClick={onReset} className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white text-sm font-semibold rounded-xl transition-colors">
              Yes, Reset
            </button>
            <button onClick={() => setConfirmReset(false)} className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 text-sm font-medium rounded-xl transition-colors">
              Cancel
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
