import { TrendingUp, Users, Eye, Heart, Calendar, Zap, ArrowUpRight, Clock, CheckCircle, Activity, BarChart2 } from 'lucide-react';
import { Campaign, SocialConnection, ContentPost, Strategy } from '../types';
import { PLATFORM_COLORS, PLATFORM_LABELS } from '../lib/mockData';

interface DashboardProps {
  campaign: Campaign;
  connections: SocialConnection[];
  posts: ContentPost[];
  strategy: Strategy | null;
  onNavigate: (view: string) => void;
}

function StatCard({ label, value, sub, icon: Icon, color, trend }: { label: string; value: string; sub: string; icon: React.ElementType; color: string; trend?: string }) {
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
      <div className="flex items-start justify-between mb-4">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center`} style={{ backgroundColor: color + '20' }}>
          <Icon className="w-5 h-5" style={{ color }} />
        </div>
        {trend && (
          <div className="flex items-center gap-1 text-emerald-400 text-xs font-semibold bg-emerald-400/10 px-2 py-1 rounded-full">
            <ArrowUpRight className="w-3 h-3" />
            {trend}
          </div>
        )}
      </div>
      <p className="text-2xl font-bold text-white mb-1">{value}</p>
      <p className="text-sm font-medium text-gray-300">{label}</p>
      <p className="text-xs text-gray-500 mt-0.5">{sub}</p>
    </div>
  );
}

export default function Dashboard({ campaign, connections, posts, strategy, onNavigate }: DashboardProps) {
  const connected = connections.filter(c => c.connected);
  const totalFollowers = connected.reduce((s, c) => s + c.followers, 0);
  const scheduledPosts = posts.filter(p => p.status === 'scheduled');
  const publishedPosts = posts.filter(p => p.status === 'published');
  const totalReach = publishedPosts.reduce((s, p) => s + p.reach, 0);
  const totalEngagement = publishedPosts.reduce((s, p) => s + p.likes + p.comments + p.shares, 0);

  const upcomingPosts = scheduledPosts
    .sort((a, b) => new Date(a.scheduled_at!).getTime() - new Date(b.scheduled_at!).getTime())
    .slice(0, 4);

  const platformStats = connected.map(c => ({
    platform: c.platform,
    followers: c.followers,
    engagement: c.avg_engagement_rate,
  }));

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Dashboard</h1>
          <p className="text-gray-400 text-sm mt-1">
            {campaign.business_name} &bull; Agent running 24/7
          </p>
        </div>
        <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 rounded-xl px-4 py-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-emerald-400 text-sm font-semibold">Agent Active</span>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Total Followers"
          value={totalFollowers >= 1000 ? `${(totalFollowers / 1000).toFixed(1)}K` : totalFollowers.toString()}
          sub={`Across ${connected.length} platforms`}
          icon={Users}
          color="#2563eb"
          trend="+12.4%"
        />
        <StatCard
          label="Total Reach"
          value={totalReach >= 1000 ? `${(totalReach / 1000).toFixed(1)}K` : totalReach.toString()}
          sub="Last 7 days"
          icon={Eye}
          color="#0891b2"
          trend="+28.1%"
        />
        <StatCard
          label="Engagements"
          value={totalEngagement >= 1000 ? `${(totalEngagement / 1000).toFixed(1)}K` : totalEngagement.toString()}
          sub="Likes + comments + shares"
          icon={Heart}
          color="#e11d48"
          trend="+8.3%"
        />
        <StatCard
          label="Posts Scheduled"
          value={scheduledPosts.length.toString()}
          sub="Ready to publish"
          icon={Calendar}
          color="#16a34a"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Platform overview */}
        <div className="lg:col-span-2 bg-gray-900 border border-gray-800 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-white font-semibold">Platform Performance</h3>
            <button onClick={() => onNavigate('analytics')} className="text-xs text-blue-400 hover:text-blue-300 transition-colors">View all</button>
          </div>
          <div className="space-y-3">
            {platformStats.length > 0 ? platformStats.map(ps => (
              <div key={ps.platform} className="flex items-center gap-4">
                <div className="w-24 flex-shrink-0">
                  <span className="text-sm text-gray-300 capitalize">{PLATFORM_LABELS[ps.platform]}</span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-gray-500">{ps.followers.toLocaleString()} followers</span>
                    <span className="text-xs text-gray-400">{ps.engagement}% eng.</span>
                  </div>
                  <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{
                        width: `${Math.min((ps.followers / Math.max(...platformStats.map(p => p.followers))) * 100, 100)}%`,
                        backgroundColor: PLATFORM_COLORS[ps.platform],
                      }}
                    />
                  </div>
                </div>
              </div>
            )) : (
              <p className="text-gray-500 text-sm">No connected platforms yet</p>
            )}
          </div>
        </div>

        {/* Strategy status */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-white font-semibold">Strategy Status</h3>
            <button onClick={() => onNavigate('strategy')} className="text-xs text-blue-400 hover:text-blue-300 transition-colors">View</button>
          </div>
          {strategy ? (
            <div className="space-y-3">
              <div className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm ${
                strategy.status === 'approved' ? 'bg-emerald-500/10 text-emerald-400' :
                strategy.status === 'pending' ? 'bg-amber-500/10 text-amber-400' :
                'bg-red-500/10 text-red-400'
              }`}>
                <Activity className="w-4 h-4" />
                <span className="font-medium capitalize">{strategy.status}</span>
              </div>
              <p className="text-gray-400 text-xs leading-relaxed">{strategy.title}</p>
              <div className="space-y-1.5">
                {(strategy.target_metrics ? Object.entries(strategy.target_metrics) : []).slice(0, 3).map(([k, v]) => (
                  <div key={k} className="flex items-center justify-between">
                    <span className="text-xs text-gray-500 capitalize">{k.replace(/([A-Z])/g, ' $1')}</span>
                    <span className="text-xs text-white font-medium">{String(v)}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-6">
              <BarChart2 className="w-8 h-8 text-gray-700 mx-auto mb-2" />
              <p className="text-gray-500 text-sm">No strategy yet</p>
              <button onClick={() => onNavigate('strategy')} className="mt-3 text-blue-400 text-xs hover:text-blue-300">Generate Strategy</button>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming posts */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-white font-semibold">Upcoming Posts</h3>
            <button onClick={() => onNavigate('schedule')} className="text-xs text-blue-400 hover:text-blue-300 transition-colors">View all</button>
          </div>
          {upcomingPosts.length > 0 ? (
            <div className="space-y-3">
              {upcomingPosts.map(post => (
                <div key={post.id} className="flex items-start gap-3 p-3 rounded-xl bg-gray-800/50">
                  <div
                    className="w-2 h-2 rounded-full mt-2 flex-shrink-0"
                    style={{ backgroundColor: PLATFORM_COLORS[post.platform] }}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-gray-300 text-xs line-clamp-2">{post.content_text}</p>
                    <div className="flex items-center gap-2 mt-1.5">
                      <Clock className="w-3 h-3 text-gray-500" />
                      <span className="text-gray-500 text-[10px]">
                        {post.scheduled_at ? new Date(post.scheduled_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : ''}
                      </span>
                      <span className="text-[10px] capitalize px-1.5 py-0.5 rounded-md bg-blue-500/10 text-blue-400">{post.platform}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-6">
              <Calendar className="w-8 h-8 text-gray-700 mx-auto mb-2" />
              <p className="text-gray-500 text-sm">No scheduled posts</p>
              <button onClick={() => onNavigate('content')} className="mt-3 text-blue-400 text-xs hover:text-blue-300">Generate Content</button>
            </div>
          )}
        </div>

        {/* Recent activity */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
          <h3 className="text-white font-semibold mb-5">Recent Activity</h3>
          <div className="space-y-3">
            {[
              { icon: CheckCircle, text: 'Business analysis completed', time: '2m ago', color: 'text-emerald-400' },
              { icon: Users, text: `${connected.length} social accounts connected`, time: '5m ago', color: 'text-blue-400' },
              { icon: Zap, text: 'Strategy generated by AI', time: '8m ago', color: 'text-amber-400' },
              { icon: Calendar, text: `${scheduledPosts.length} posts scheduled`, time: '10m ago', color: 'text-cyan-400' },
              { icon: Activity, text: 'Agent started 24/7 monitoring', time: '15m ago', color: 'text-emerald-400' },
            ].map((item, i) => {
              const Icon = item.icon;
              return (
                <div key={i} className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 flex-shrink-0 ${item.color}`} />
                  <span className="text-gray-300 text-xs flex-1">{item.text}</span>
                  <span className="text-gray-600 text-[10px]">{item.time}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
