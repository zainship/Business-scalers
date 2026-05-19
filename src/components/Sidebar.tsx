import { LayoutDashboard, Calendar, Zap, BarChart2, Settings, Globe, Link2, Lightbulb, ChevronRight, Activity } from 'lucide-react';
import { Campaign } from '../types';
import { PLATFORM_COLORS } from '../lib/mockData';

type View = 'dashboard' | 'strategy' | 'content' | 'schedule' | 'analytics' | 'connections' | 'insights' | 'settings';

interface SidebarProps {
  campaign: Campaign | null;
  currentView: View;
  onViewChange: (view: View) => void;
}

const navItems = [
  { id: 'dashboard' as View, label: 'Dashboard', icon: LayoutDashboard },
  { id: 'strategy' as View, label: 'Strategy', icon: Lightbulb },
  { id: 'content' as View, label: 'Content Studio', icon: Zap },
  { id: 'schedule' as View, label: 'Scheduler', icon: Calendar },
  { id: 'analytics' as View, label: 'Analytics', icon: BarChart2 },
  { id: 'connections' as View, label: 'Connections', icon: Link2 },
  { id: 'insights' as View, label: 'Insights', icon: Globe },
  { id: 'settings' as View, label: 'Settings', icon: Settings },
];

const platformDots = ['instagram', 'tiktok', 'twitter', 'linkedin', 'facebook'] as const;

export default function Sidebar({ campaign, currentView, onViewChange }: SidebarProps) {
  return (
    <aside className="w-64 bg-gray-950 border-r border-gray-800 flex flex-col h-screen fixed left-0 top-0 z-30">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-gray-800">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-blue-500/20">
            <Activity className="w-5 h-5 text-white" />
          </div>
          <div>
            <span className="text-white font-bold text-base tracking-tight">HyperScale</span>
            <span className="block text-[10px] text-gray-500 leading-none mt-0.5">AI Marketing Agent</span>
          </div>
        </div>
      </div>

      {/* Campaign info */}
      {campaign && (
        <div className="mx-3 mt-4 mb-2 px-3 py-3 rounded-xl bg-gray-900 border border-gray-800">
          <div className="flex items-start gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-600/20 border border-blue-500/30 flex items-center justify-center flex-shrink-0 mt-0.5">
              <Globe className="w-4 h-4 text-blue-400" />
            </div>
            <div className="min-w-0">
              <p className="text-white text-xs font-semibold truncate">{campaign.business_name || 'Your Business'}</p>
              <p className="text-gray-500 text-[10px] truncate mt-0.5">{campaign.business_url}</p>
              <div className="flex items-center gap-1.5 mt-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-[10px] text-emerald-400 font-medium">Agent Active</span>
              </div>
            </div>
          </div>
          {/* Platform dots */}
          <div className="flex items-center gap-1.5 mt-3 pt-2.5 border-t border-gray-800">
            {platformDots.map(p => (
              <div
                key={p}
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: PLATFORM_COLORS[p] }}
                title={p}
              />
            ))}
            <span className="text-[10px] text-gray-500 ml-1">5 platforms</span>
          </div>
        </div>
      )}

      {/* Nav */}
      <nav className="flex-1 px-3 py-2 overflow-y-auto">
        {navItems.map(item => {
          const Icon = item.icon;
          const active = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onViewChange(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl mb-0.5 text-sm font-medium transition-all duration-150 group ${
                active
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                  : 'text-gray-400 hover:text-white hover:bg-gray-800'
              }`}
            >
              <Icon className={`w-4 h-4 flex-shrink-0 ${active ? 'text-white' : 'text-gray-500 group-hover:text-gray-300'}`} />
              <span className="flex-1 text-left">{item.label}</span>
              {active && <ChevronRight className="w-3.5 h-3.5 opacity-60" />}
            </button>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-4 py-4 border-t border-gray-800">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-400 to-cyan-300 flex items-center justify-center text-[11px] font-bold text-gray-900">
            AI
          </div>
          <div>
            <p className="text-[11px] text-white font-medium">Auto-Pilot Mode</p>
            <p className="text-[10px] text-gray-500">Running 24/7</p>
          </div>
          <div className="ml-auto w-6 h-3.5 rounded-full bg-blue-600 flex items-center justify-end pr-0.5 cursor-pointer">
            <div className="w-2.5 h-2.5 rounded-full bg-white" />
          </div>
        </div>
      </div>
    </aside>
  );
}
