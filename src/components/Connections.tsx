import { useState } from 'react';
import { Instagram, Youtube, Twitter, Linkedin, Facebook, CheckCircle, XCircle, RefreshCw, Loader2, Users, TrendingUp, FileText, Clock } from 'lucide-react';
import { SocialConnection, Platform } from '../types';
import { PLATFORM_COLORS, PLATFORM_LABELS } from '../lib/mockData';

interface ConnectionsProps {
  connections: SocialConnection[];
  onConnectionsUpdate: (connections: SocialConnection[]) => void;
}

const PLATFORM_ICONS: Record<Platform, React.ReactNode> = {
  instagram: <Instagram className="w-5 h-5" />,
  tiktok: <Youtube className="w-5 h-5" />,
  twitter: <Twitter className="w-5 h-5" />,
  linkedin: <Linkedin className="w-5 h-5" />,
  facebook: <Facebook className="w-5 h-5" />,
};

const PLATFORM_BIOS: Record<Platform, string> = {
  instagram: 'Visual storytelling, reels, and stories for maximum engagement',
  tiktok: 'Short-form viral content targeting younger audiences',
  twitter: 'Real-time conversations, threads, and industry commentary',
  linkedin: 'Professional content, thought leadership, and B2B outreach',
  facebook: 'Community building, long-form content, and live sessions',
};

export default function Connections({ connections, onConnectionsUpdate }: ConnectionsProps) {
  const [scanning, setScanning] = useState<string | null>(null);
  const [disconnecting, setDisconnecting] = useState<string | null>(null);

  async function scanProfile(connectionId: string) {
    setScanning(connectionId);
    await new Promise(r => setTimeout(r, 2000));
    const updated = connections.map(c => {
      if (c.id !== connectionId) return c;
      return {
        ...c,
        followers: c.followers + Math.floor(Math.random() * 50),
        avg_engagement_rate: parseFloat((c.avg_engagement_rate + (Math.random() * 0.5 - 0.2)).toFixed(1)),
      };
    });
    setScanning(null);
    onConnectionsUpdate(updated);
  }

  async function disconnectAccount(connectionId: string) {
    setDisconnecting(connectionId);
    await new Promise(r => setTimeout(r, 800));
    const updated = connections.map(c =>
      c.id === connectionId ? { ...c, connected: false, status: 'disconnected' as const, followers: 0 } : c
    );
    setDisconnecting(null);
    onConnectionsUpdate(updated);
  }

  const connected = connections.filter(c => c.connected);
  const disconnected = connections.filter(c => !c.connected);
  const totalFollowers = connected.reduce((s, c) => s + c.followers, 0);

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Connections</h1>
          <p className="text-gray-400 text-sm mt-1">Manage your connected social media accounts</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-400 bg-gray-900 border border-gray-800 rounded-xl px-4 py-2">
          <CheckCircle className="w-4 h-4 text-emerald-400" />
          <span>{connected.length} of {connections.length} connected</span>
        </div>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Connected', value: connected.length.toString(), icon: CheckCircle, color: '#16a34a' },
          { label: 'Total Followers', value: totalFollowers >= 1000 ? `${(totalFollowers / 1000).toFixed(1)}K` : totalFollowers.toString(), icon: Users, color: '#2563eb' },
          { label: 'Avg Engagement', value: connected.length > 0 ? `${(connected.reduce((s, c) => s + c.avg_engagement_rate, 0) / connected.length).toFixed(1)}%` : '0%', icon: TrendingUp, color: '#0891b2' },
        ].map(s => {
          const Icon = s.icon;
          return (
            <div key={s.label} className="bg-gray-900 border border-gray-800 rounded-2xl p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: s.color + '20' }}>
                <Icon className="w-5 h-5" style={{ color: s.color }} />
              </div>
              <div>
                <p className="text-xl font-bold text-white">{s.value}</p>
                <p className="text-xs text-gray-500">{s.label}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Connected accounts */}
      {connected.length > 0 && (
        <div>
          <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-400" />
            Connected Accounts
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {connected.map(conn => (
              <div key={conn.id} className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-12 h-12 rounded-2xl flex items-center justify-center"
                      style={{ backgroundColor: PLATFORM_COLORS[conn.platform] + '15', color: PLATFORM_COLORS[conn.platform] }}
                    >
                      {PLATFORM_ICONS[conn.platform]}
                    </div>
                    <div>
                      <p className="text-white font-semibold">{PLATFORM_LABELS[conn.platform]}</p>
                      <p className="text-gray-500 text-sm">{conn.account_handle}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 text-emerald-400 text-xs font-medium bg-emerald-400/10 px-2.5 py-1 rounded-full">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    Active
                  </div>
                </div>

                <p className="text-gray-500 text-xs mb-4">{PLATFORM_BIOS[conn.platform]}</p>

                <div className="grid grid-cols-3 gap-3 mb-4">
                  {[
                    { label: 'Followers', value: conn.followers >= 1000 ? `${(conn.followers / 1000).toFixed(1)}K` : conn.followers.toString(), icon: Users },
                    { label: 'Engagement', value: `${conn.avg_engagement_rate}%`, icon: TrendingUp },
                    { label: 'Posts', value: '42', icon: FileText },
                  ].map(s => {
                    const Icon = s.icon;
                    return (
                      <div key={s.label} className="bg-gray-800 rounded-xl p-3 text-center">
                        <Icon className="w-3.5 h-3.5 text-gray-500 mx-auto mb-1" />
                        <p className="text-white text-sm font-bold">{s.value}</p>
                        <p className="text-gray-600 text-[10px]">{s.label}</p>
                      </div>
                    );
                  })}
                </div>

                {/* Best times */}
                {conn.best_posting_times.length > 0 && (
                  <div className="mb-4">
                    <p className="text-gray-500 text-xs mb-2 flex items-center gap-1.5">
                      <Clock className="w-3 h-3" />
                      Best posting times
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {conn.best_posting_times.map(t => (
                        <span key={t} className="px-2.5 py-1 bg-gray-800 text-gray-300 text-[11px] rounded-lg">{t}</span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => scanProfile(conn.id)}
                    disabled={scanning === conn.id}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 text-xs font-medium rounded-xl transition-colors disabled:opacity-50"
                  >
                    {scanning === conn.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <RefreshCw className="w-3.5 h-3.5" />}
                    {scanning === conn.id ? 'Scanning...' : 'Sync Profile'}
                  </button>
                  <button
                    onClick={() => disconnectAccount(conn.id)}
                    disabled={disconnecting === conn.id}
                    className="flex items-center gap-1.5 px-3 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs font-medium rounded-xl transition-colors border border-red-500/20 disabled:opacity-50"
                  >
                    {disconnecting === conn.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <XCircle className="w-3.5 h-3.5" />}
                    Disconnect
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Disconnected */}
      {disconnected.length > 0 && (
        <div>
          <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
            <XCircle className="w-4 h-4 text-gray-500" />
            Not Connected
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {disconnected.map(conn => (
              <div key={conn.id} className="bg-gray-900 border border-gray-800 rounded-2xl p-5 opacity-60">
                <div className="flex items-center gap-3 mb-3">
                  <div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center"
                    style={{ backgroundColor: PLATFORM_COLORS[conn.platform] + '10', color: PLATFORM_COLORS[conn.platform] + '80' }}
                  >
                    {PLATFORM_ICONS[conn.platform]}
                  </div>
                  <div>
                    <p className="text-gray-400 font-semibold">{PLATFORM_LABELS[conn.platform]}</p>
                    <p className="text-gray-600 text-xs">Not connected</p>
                  </div>
                </div>
                <p className="text-gray-600 text-xs mb-4">{PLATFORM_BIOS[conn.platform]}</p>
                <button className="w-full py-2 bg-gray-800 hover:bg-gray-700 text-gray-400 text-sm font-medium rounded-xl transition-colors">
                  Connect Account
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
