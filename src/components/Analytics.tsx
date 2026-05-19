import { TrendingUp, Users, Eye, Heart, Share2, MessageCircle, ArrowUpRight, BarChart2 } from 'lucide-react';
import { Campaign, ContentPost, SocialConnection } from '../types';
import { PLATFORM_COLORS, PLATFORM_LABELS } from '../lib/mockData';
import { Platform } from '../types';

interface AnalyticsProps {
  campaign: Campaign;
  connections: SocialConnection[];
  posts: ContentPost[];
}

const DAYS_SHORT = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

function MiniChart({ data, color }: { data: number[]; color: string }) {
  const max = Math.max(...data, 1);
  return (
    <div className="flex items-end gap-0.5 h-10">
      {data.map((v, i) => (
        <div
          key={i}
          className="flex-1 rounded-sm opacity-80 hover:opacity-100 transition-opacity"
          style={{ height: `${(v / max) * 100}%`, backgroundColor: color, minHeight: 2 }}
        />
      ))}
    </div>
  );
}

export default function Analytics({ campaign, connections, posts }: AnalyticsProps) {
  const published = posts.filter(p => p.status === 'published');
  const totalLikes = published.reduce((s, p) => s + p.likes, 0);
  const totalComments = published.reduce((s, p) => s + p.comments, 0);
  const totalShares = published.reduce((s, p) => s + p.shares, 0);
  const totalReach = published.reduce((s, p) => s + p.reach, 0);
  const totalImpressions = published.reduce((s, p) => s + p.impressions, 0);

  const connected = connections.filter(c => c.connected);
  const totalFollowers = connected.reduce((s, c) => s + c.followers, 0);

  // Mock weekly data
  const weeklyReach = [1200, 1800, 1400, 2200, 1900, 2800, 3100];
  const weeklyEngagement = [45, 72, 58, 89, 67, 110, 134];
  const weeklyFollowers = [12200, 12350, 12410, 12580, 12720, 12900, 13050];

  const platformBreakdown: { platform: Platform; followers: number; engagement: number; posts: number }[] = connected.map(c => ({
    platform: c.platform,
    followers: c.followers,
    engagement: c.avg_engagement_rate,
    posts: posts.filter(p => p.platform === c.platform).length,
  }));

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Analytics</h1>
          <p className="text-gray-400 text-sm mt-1">{campaign.business_name} performance overview</p>
        </div>
        <div className="text-xs text-gray-500 bg-gray-900 border border-gray-800 rounded-xl px-3 py-2">
          Last 30 days
        </div>
      </div>

      {/* Top stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Followers', value: totalFollowers >= 1000 ? `${(totalFollowers / 1000).toFixed(1)}K` : totalFollowers.toString(), icon: Users, color: '#2563eb', trend: '+12.4%', sub: 'All platforms' },
          { label: 'Total Reach', value: totalReach >= 1000 ? `${(totalReach / 1000).toFixed(1)}K` : totalReach.toString(), icon: Eye, color: '#0891b2', trend: '+28.1%', sub: 'Published posts' },
          { label: 'Engagements', value: (totalLikes + totalComments + totalShares).toLocaleString(), icon: Heart, color: '#e11d48', trend: '+8.3%', sub: 'Likes + comments + shares' },
          { label: 'Impressions', value: totalImpressions >= 1000 ? `${(totalImpressions / 1000).toFixed(1)}K` : totalImpressions.toString(), icon: BarChart2, color: '#16a34a', trend: '+19.7%', sub: 'Total views' },
        ].map(stat => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
              <div className="flex items-start justify-between mb-4">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: stat.color + '20' }}>
                  <Icon className="w-5 h-5" style={{ color: stat.color }} />
                </div>
                <div className="flex items-center gap-1 text-emerald-400 text-xs font-semibold bg-emerald-400/10 px-2 py-0.5 rounded-full">
                  <ArrowUpRight className="w-3 h-3" />
                  {stat.trend}
                </div>
              </div>
              <p className="text-2xl font-bold text-white mb-1">{stat.value}</p>
              <p className="text-sm font-medium text-gray-300">{stat.label}</p>
              <p className="text-xs text-gray-500 mt-0.5">{stat.sub}</p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Weekly charts */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-white font-semibold">Weekly Reach</h3>
              <span className="text-emerald-400 text-xs font-semibold bg-emerald-400/10 px-2 py-1 rounded-full flex items-center gap-1">
                <ArrowUpRight className="w-3 h-3" />+{Math.round(((weeklyReach[6] - weeklyReach[0]) / weeklyReach[0]) * 100)}%
              </span>
            </div>
            <div className="flex items-end gap-2 h-32 mb-2">
              {weeklyReach.map((v, i) => {
                const max = Math.max(...weeklyReach);
                return (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1">
                    <div
                      className="w-full rounded-t-sm bg-gradient-to-t from-blue-600 to-cyan-400 transition-all"
                      style={{ height: `${(v / max) * 100}%` }}
                    />
                  </div>
                );
              })}
            </div>
            <div className="flex justify-between">
              {DAYS_SHORT.map(d => <span key={d} className="flex-1 text-center text-[10px] text-gray-600">{d}</span>)}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
              <h4 className="text-white text-sm font-semibold mb-4">Engagement This Week</h4>
              <MiniChart data={weeklyEngagement} color="#e11d48" />
              <div className="flex justify-between mt-2">
                {DAYS_SHORT.map(d => <span key={d} className="flex-1 text-center text-[10px] text-gray-600">{d}</span>)}
              </div>
              <p className="text-2xl font-bold text-white mt-3">{weeklyEngagement.reduce((a, b) => a + b, 0)}</p>
              <p className="text-xs text-gray-500">Total engagements</p>
            </div>
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
              <h4 className="text-white text-sm font-semibold mb-4">Follower Growth</h4>
              <MiniChart data={weeklyFollowers.map((v, i) => i === 0 ? 0 : v - weeklyFollowers[i - 1])} color="#16a34a" />
              <div className="flex justify-between mt-2">
                {DAYS_SHORT.map(d => <span key={d} className="flex-1 text-center text-[10px] text-gray-600">{d}</span>)}
              </div>
              <p className="text-2xl font-bold text-white mt-3">
                +{(weeklyFollowers[6] - weeklyFollowers[0]).toLocaleString()}
              </p>
              <p className="text-xs text-gray-500">New followers this week</p>
            </div>
          </div>
        </div>

        {/* Platform breakdown */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
          <h3 className="text-white font-semibold mb-5">Platform Breakdown</h3>
          {platformBreakdown.length > 0 ? (
            <div className="space-y-4">
              {platformBreakdown.map(pb => (
                <div key={pb.platform}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-sm text-gray-300 capitalize">{PLATFORM_LABELS[pb.platform]}</span>
                    <span className="text-xs text-gray-400">{pb.followers.toLocaleString()}</span>
                  </div>
                  <div className="h-2 bg-gray-800 rounded-full overflow-hidden mb-1">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{
                        width: `${totalFollowers > 0 ? (pb.followers / totalFollowers) * 100 : 0}%`,
                        backgroundColor: PLATFORM_COLORS[pb.platform],
                      }}
                    />
                  </div>
                  <div className="flex justify-between text-[10px] text-gray-600">
                    <span>{pb.engagement}% engagement</span>
                    <span>{pb.posts} posts</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <BarChart2 className="w-8 h-8 text-gray-700 mx-auto mb-2" />
              <p className="text-gray-500 text-sm">Connect platforms to see breakdown</p>
            </div>
          )}

          {/* Engagement breakdown */}
          <div className="mt-6 pt-4 border-t border-gray-800">
            <h4 className="text-white text-sm font-semibold mb-4">Engagement Mix</h4>
            <div className="space-y-2">
              {[
                { label: 'Likes', value: totalLikes, icon: Heart, color: '#e11d48' },
                { label: 'Comments', value: totalComments, icon: MessageCircle, color: '#2563eb' },
                { label: 'Shares', value: totalShares, icon: Share2, color: '#16a34a' },
              ].map(item => {
                const total = totalLikes + totalComments + totalShares || 1;
                const Icon = item.icon;
                return (
                  <div key={item.label} className="flex items-center gap-3">
                    <Icon className="w-3.5 h-3.5 flex-shrink-0" style={{ color: item.color }} />
                    <div className="flex-1 h-1.5 bg-gray-800 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full"
                        style={{ width: `${(item.value / total) * 100}%`, backgroundColor: item.color }}
                      />
                    </div>
                    <span className="text-xs text-gray-400 w-10 text-right">{item.value}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Growth rate */}
          <div className="mt-4 pt-4 border-t border-gray-800">
            <div className="flex items-center justify-between">
              <span className="text-gray-400 text-sm">Avg Growth Rate</span>
              <div className="flex items-center gap-1 text-emerald-400 text-sm font-semibold">
                <TrendingUp className="w-4 h-4" />
                +{connected.length > 0 ? (connected.reduce((s, c) => s + c.avg_engagement_rate, 0) / connected.length).toFixed(1) : '0'}%
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Top posts */}
      {published.length > 0 && (
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
          <h3 className="text-white font-semibold mb-5">Top Performing Posts</h3>
          <div className="space-y-3">
            {published.sort((a, b) => (b.likes + b.comments + b.shares) - (a.likes + a.comments + a.shares)).slice(0, 5).map(post => (
              <div key={post.id} className="flex items-center gap-4 p-3 rounded-xl bg-gray-800/50 hover:bg-gray-800 transition-colors">
                {post.image_url && (
                  <img src={post.image_url} alt="" className="w-12 h-12 rounded-xl object-cover flex-shrink-0" />
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-gray-300 text-sm line-clamp-1">{post.content_text}</p>
                  <div className="flex items-center gap-1.5 mt-1">
                    <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: PLATFORM_COLORS[post.platform] }} />
                    <span className="text-gray-500 text-[11px] capitalize">{post.platform}</span>
                    {post.published_at && (
                      <span className="text-gray-600 text-[11px]">
                        &bull; {new Date(post.published_at).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-4 flex-shrink-0 text-sm">
                  <div className="text-center">
                    <p className="text-white font-semibold">{post.likes}</p>
                    <p className="text-gray-600 text-[10px]">likes</p>
                  </div>
                  <div className="text-center">
                    <p className="text-white font-semibold">{post.reach.toLocaleString()}</p>
                    <p className="text-gray-600 text-[10px]">reach</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
