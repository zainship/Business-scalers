import { useState } from 'react';
import { Zap, Image, CreditCard as Edit3, RefreshCw, Plus, Trash2, Clock, CheckCircle, Instagram, Twitter, Linkedin, Facebook, Youtube, Loader2, Send, Hash } from 'lucide-react';
import { Campaign, ContentPost, Platform } from '../types';
import { PLATFORM_COLORS, PLATFORM_LABELS, generateMockPosts } from '../lib/mockData';
import { supabase } from '../lib/supabase';

interface ContentStudioProps {
  campaign: Campaign;
  posts: ContentPost[];
  onPostsUpdate: (posts: ContentPost[]) => void;
}

const PLATFORM_ICONS: Record<Platform, React.ReactNode> = {
  instagram: <Instagram className="w-4 h-4" />,
  tiktok: <Youtube className="w-4 h-4" />,
  twitter: <Twitter className="w-4 h-4" />,
  linkedin: <Linkedin className="w-4 h-4" />,
  facebook: <Facebook className="w-4 h-4" />,
};

const PEXELS_IMAGES = [
  'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=600',
  'https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=600',
  'https://images.pexels.com/photos/3184339/pexels-photo-3184339.jpeg?auto=compress&cs=tinysrgb&w=600',
  'https://images.pexels.com/photos/1181406/pexels-photo-1181406.jpeg?auto=compress&cs=tinysrgb&w=600',
  'https://images.pexels.com/photos/3182812/pexels-photo-3182812.jpeg?auto=compress&cs=tinysrgb&w=600',
  'https://images.pexels.com/photos/7688336/pexels-photo-7688336.jpeg?auto=compress&cs=tinysrgb&w=600',
  'https://images.pexels.com/photos/6476254/pexels-photo-6476254.jpeg?auto=compress&cs=tinysrgb&w=600',
  'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=600',
];

export default function ContentStudio({ campaign, posts, onPostsUpdate }: ContentStudioProps) {
  const [generating, setGenerating] = useState(false);
  const [selectedPost, setSelectedPost] = useState<ContentPost | null>(null);
  const [editingText, setEditingText] = useState('');
  const [generatingImage, setGeneratingImage] = useState<string | null>(null);
  const [filterPlatform, setFilterPlatform] = useState<Platform | 'all'>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  async function generateContent() {
    setGenerating(true);
    await new Promise(r => setTimeout(r, 1800));
    const newPosts = generateMockPosts(campaign.id, campaign.business_name);
    const created: ContentPost[] = [];

    for (const p of newPosts) {
      const { data, error } = await supabase.from('content_posts').insert({
        campaign_id: p.campaign_id,
        platform: p.platform,
        content_text: p.content_text,
        image_url: p.image_url,
        hashtags: p.hashtags,
        caption: p.caption,
        post_type: p.post_type,
        scheduled_at: p.scheduled_at,
        status: p.status,
      }).select().maybeSingle();

      if (!error && data) created.push(data as ContentPost);
    }

    setGenerating(false);
    onPostsUpdate([...posts, ...created]);
  }

  async function generateImageForPost(postId: string) {
    setGeneratingImage(postId);
    await new Promise(r => setTimeout(r, 1500));
    const randomImage = PEXELS_IMAGES[Math.floor(Math.random() * PEXELS_IMAGES.length)];
    const updated = posts.map(p => p.id === postId ? { ...p, image_url: randomImage } : p);
    setGeneratingImage(null);
    onPostsUpdate(updated);
    if (selectedPost?.id === postId) {
      setSelectedPost(prev => prev ? { ...prev, image_url: randomImage } : null);
    }
  }

  function startEdit(post: ContentPost) {
    setSelectedPost(post);
    setEditingText(post.content_text);
  }

  async function saveEdit() {
    if (!selectedPost) return;
    const { error } = await supabase.from('content_posts').update({ content_text: editingText }).eq('id', selectedPost.id);
    if (!error) {
      const updated = posts.map(p => p.id === selectedPost.id ? { ...p, content_text: editingText } : p);
      onPostsUpdate(updated);
      setSelectedPost({ ...selectedPost, content_text: editingText });
    }
  }

  async function schedulePost(postId: string) {
    const scheduledAt = new Date();
    scheduledAt.setDate(scheduledAt.getDate() + Math.floor(Math.random() * 5) + 1);
    scheduledAt.setHours(9, 0, 0, 0);

    const { error } = await supabase.from('content_posts').update({ status: 'scheduled', scheduled_at: scheduledAt.toISOString() }).eq('id', postId);
    if (!error) {
      const updated = posts.map(p => p.id === postId ? { ...p, status: 'scheduled' as const, scheduled_at: scheduledAt.toISOString() } : p);
      onPostsUpdate(updated);
    }
  }

  async function deletePost(postId: string) {
    const { error } = await supabase.from('content_posts').delete().eq('id', postId);
    if (!error) {
      onPostsUpdate(posts.filter(p => p.id !== postId));
      if (selectedPost?.id === postId) setSelectedPost(null);
    }
  }

  const filtered = posts.filter(p => {
    if (filterPlatform !== 'all' && p.platform !== filterPlatform) return false;
    if (filterStatus !== 'all' && p.status !== filterStatus) return false;
    return true;
  });

  const platforms: Platform[] = ['instagram', 'tiktok', 'twitter', 'linkedin', 'facebook'];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Content Studio</h1>
          <p className="text-gray-400 text-sm mt-1">AI-generated content for all your platforms</p>
        </div>
        <button
          onClick={generateContent}
          disabled={generating}
          className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-semibold rounded-xl transition-all shadow-lg shadow-blue-600/20 disabled:opacity-60"
        >
          {generating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}
          {generating ? 'Generating...' : 'Generate Content'}
        </button>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="flex items-center bg-gray-900 border border-gray-800 rounded-xl p-1">
          <button
            onClick={() => setFilterPlatform('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${filterPlatform === 'all' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'}`}
          >
            All
          </button>
          {platforms.map(p => (
            <button
              key={p}
              onClick={() => setFilterPlatform(p)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${filterPlatform === p ? 'text-white' : 'text-gray-400 hover:text-white'}`}
              style={filterPlatform === p ? { backgroundColor: PLATFORM_COLORS[p] } : {}}
            >
              {PLATFORM_LABELS[p].split(' ')[0]}
            </button>
          ))}
        </div>
        <div className="flex items-center bg-gray-900 border border-gray-800 rounded-xl p-1">
          {['all', 'draft', 'scheduled', 'published'].map(s => (
            <button
              key={s}
              onClick={() => setFilterStatus(s)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors capitalize ${filterStatus === s ? 'bg-gray-700 text-white' : 'text-gray-400 hover:text-white'}`}
            >
              {s}
            </button>
          ))}
        </div>
        <span className="text-gray-500 text-xs ml-auto">{filtered.length} posts</span>
      </div>

      {filtered.length === 0 ? (
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-16 flex flex-col items-center text-center">
          <div className="w-16 h-16 rounded-2xl bg-blue-600/10 border border-blue-500/20 flex items-center justify-center mb-6">
            <Zap className="w-8 h-8 text-blue-400" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">No Content Yet</h3>
          <p className="text-gray-400 text-sm mb-8 max-w-sm">Click "Generate Content" to have our AI create targeted posts for all your social platforms</p>
          <button onClick={generateContent} disabled={generating} className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl transition-colors">
            Generate Content Now
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filtered.map(post => (
            <div
              key={post.id}
              className={`bg-gray-900 border rounded-2xl overflow-hidden transition-all cursor-pointer hover:border-gray-600 ${selectedPost?.id === post.id ? 'border-blue-500/50 ring-1 ring-blue-500/20' : 'border-gray-800'}`}
              onClick={() => startEdit(post)}
            >
              {/* Post image */}
              {post.image_url ? (
                <div className="relative h-40 overflow-hidden bg-gray-800">
                  <img src={post.image_url} alt="" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 to-transparent" />
                  <div className="absolute bottom-2 left-3 right-3 flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: PLATFORM_COLORS[post.platform] }} />
                      <span className="text-white text-xs font-medium">{PLATFORM_LABELS[post.platform]}</span>
                    </div>
                    <button
                      onClick={e => { e.stopPropagation(); generateImageForPost(post.id); }}
                      className="p-1.5 bg-black/50 hover:bg-black/70 rounded-lg text-gray-300 hover:text-white transition-colors"
                    >
                      {generatingImage === post.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <RefreshCw className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="h-16 bg-gray-800 flex items-center justify-between px-4">
                  <div className="flex items-center gap-2">
                    <span style={{ color: PLATFORM_COLORS[post.platform] }}>{PLATFORM_ICONS[post.platform]}</span>
                    <span className="text-gray-300 text-sm">{PLATFORM_LABELS[post.platform]}</span>
                  </div>
                  <button
                    onClick={e => { e.stopPropagation(); generateImageForPost(post.id); }}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-700 hover:bg-gray-600 text-gray-300 text-xs rounded-lg transition-colors"
                  >
                    {generatingImage === post.id ? <Loader2 className="w-3 h-3 animate-spin" /> : <Image className="w-3 h-3" />}
                    {generatingImage === post.id ? 'Generating...' : 'Add Image'}
                  </button>
                </div>
              )}

              <div className="p-4">
                {/* Status badge */}
                <div className="flex items-center justify-between mb-3">
                  <span className={`text-[10px] font-semibold uppercase tracking-wide px-2 py-1 rounded-full ${
                    post.status === 'published' ? 'bg-emerald-500/10 text-emerald-400' :
                    post.status === 'scheduled' ? 'bg-blue-500/10 text-blue-400' :
                    'bg-gray-700 text-gray-400'
                  }`}>
                    {post.status}
                  </span>
                  {post.scheduled_at && (
                    <div className="flex items-center gap-1 text-gray-500 text-[10px]">
                      <Clock className="w-3 h-3" />
                      {new Date(post.scheduled_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </div>
                  )}
                </div>

                {/* Content */}
                {selectedPost?.id === post.id ? (
                  <textarea
                    value={editingText}
                    onChange={e => setEditingText(e.target.value)}
                    onClick={e => e.stopPropagation()}
                    className="w-full bg-gray-800 border border-gray-700 rounded-xl p-3 text-gray-300 text-sm outline-none focus:border-blue-500 resize-none"
                    rows={4}
                  />
                ) : (
                  <p className="text-gray-300 text-sm line-clamp-3 leading-relaxed">{post.content_text}</p>
                )}

                {/* Hashtags */}
                {post.hashtags.length > 0 && (
                  <div className="flex items-center gap-1.5 mt-2 flex-wrap">
                    <Hash className="w-3 h-3 text-gray-600" />
                    {post.hashtags.slice(0, 3).map(h => (
                      <span key={h} className="text-blue-400/70 text-[11px]">{h}</span>
                    ))}
                    {post.hashtags.length > 3 && <span className="text-gray-600 text-[11px]">+{post.hashtags.length - 3}</span>}
                  </div>
                )}

                {/* Actions */}
                <div className="flex items-center gap-2 mt-4 pt-3 border-t border-gray-800">
                  {selectedPost?.id === post.id ? (
                    <button
                      onClick={e => { e.stopPropagation(); saveEdit(); }}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium rounded-lg transition-colors"
                    >
                      <CheckCircle className="w-3.5 h-3.5" />
                      Save
                    </button>
                  ) : (
                    <button
                      onClick={e => { e.stopPropagation(); startEdit(post); }}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-800 hover:bg-gray-700 text-gray-300 text-xs font-medium rounded-lg transition-colors"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      Edit
                    </button>
                  )}
                  {post.status === 'draft' && (
                    <button
                      onClick={e => { e.stopPropagation(); schedulePost(post.id); }}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600/10 hover:bg-emerald-600/20 text-emerald-400 text-xs font-medium rounded-lg transition-colors border border-emerald-500/20"
                    >
                      <Send className="w-3.5 h-3.5" />
                      Schedule
                    </button>
                  )}
                  <button
                    onClick={e => { e.stopPropagation(); generateImageForPost(post.id); }}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-800 hover:bg-gray-700 text-gray-300 text-xs font-medium rounded-lg transition-colors"
                  >
                    <Image className="w-3.5 h-3.5" />
                    {generatingImage === post.id ? 'Generating...' : 'Image'}
                  </button>
                  <button
                    onClick={e => { e.stopPropagation(); deletePost(post.id); }}
                    className="ml-auto flex items-center gap-1.5 px-3 py-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs font-medium rounded-lg transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Published stats */}
                {post.status === 'published' && (
                  <div className="flex items-center gap-4 mt-3 pt-3 border-t border-gray-800">
                    <span className="text-xs text-gray-500">{post.likes} likes</span>
                    <span className="text-xs text-gray-500">{post.comments} comments</span>
                    <span className="text-xs text-gray-500">{post.shares} shares</span>
                    <span className="text-xs text-gray-500 ml-auto">{post.reach.toLocaleString()} reach</span>
                  </div>
                )}
              </div>
            </div>
          ))}

          {/* Add more */}
          <div
            onClick={generateContent}
            className="bg-gray-900/50 border border-dashed border-gray-700 rounded-2xl flex flex-col items-center justify-center p-10 cursor-pointer hover:border-gray-600 hover:bg-gray-900 transition-all min-h-48"
          >
            {generating ? (
              <Loader2 className="w-8 h-8 text-gray-500 animate-spin mb-3" />
            ) : (
              <Plus className="w-8 h-8 text-gray-600 mb-3" />
            )}
            <p className="text-gray-500 text-sm font-medium">{generating ? 'Generating...' : 'Generate More Content'}</p>
          </div>
        </div>
      )}
    </div>
  );
}
