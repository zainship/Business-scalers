import { useState } from 'react';
import { Calendar, Clock, ChevronLeft, ChevronRight, Instagram, Twitter, Linkedin, Facebook, Youtube, CheckCircle, Send } from 'lucide-react';
import { ContentPost, Platform } from '../types';
import { PLATFORM_COLORS, PLATFORM_LABELS } from '../lib/mockData';

interface SchedulerProps {
  posts: ContentPost[];
  onPostsUpdate: (posts: ContentPost[]) => void;
}

const PLATFORM_ICONS: Record<Platform, React.ReactNode> = {
  instagram: <Instagram className="w-3.5 h-3.5" />,
  tiktok: <Youtube className="w-3.5 h-3.5" />,
  twitter: <Twitter className="w-3.5 h-3.5" />,
  linkedin: <Linkedin className="w-3.5 h-3.5" />,
  facebook: <Facebook className="w-3.5 h-3.5" />,
};

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

export default function Scheduler({ posts, onPostsUpdate }: SchedulerProps) {
  const today = new Date();
  const [currentDate, setCurrentDate] = useState(new Date(today.getFullYear(), today.getMonth(), 1));
  const [selectedDay, setSelectedDay] = useState<number | null>(today.getDate());

  function prevMonth() {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    setSelectedDay(null);
  }

  function nextMonth() {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    setSelectedDay(null);
  }

  function getPostsForDay(day: number) {
    const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return posts.filter(p => p.scheduled_at?.startsWith(dateStr));
  }

  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();

  const selectedDayPosts = selectedDay ? getPostsForDay(selectedDay) : [];
  const scheduledPosts = posts.filter(p => p.status === 'scheduled').sort((a, b) =>
    new Date(a.scheduled_at!).getTime() - new Date(b.scheduled_at!).getTime()
  );

  async function publishPost(postId: string) {
    const updated = posts.map(p =>
      p.id === postId ? { ...p, status: 'published' as const, published_at: new Date().toISOString() } : p
    );
    onPostsUpdate(updated);
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Scheduler</h1>
          <p className="text-gray-400 text-sm mt-1">View and manage your posting schedule</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-400 bg-gray-900 border border-gray-800 rounded-xl px-4 py-2">
          <Clock className="w-4 h-4 text-blue-400" />
          <span>{scheduledPosts.length} scheduled</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar */}
        <div className="lg:col-span-2 bg-gray-900 border border-gray-800 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-white font-semibold text-lg">
              {MONTHS[currentDate.getMonth()]} {currentDate.getFullYear()}
            </h3>
            <div className="flex items-center gap-2">
              <button onClick={prevMonth} className="p-2 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-white transition-colors">
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button onClick={nextMonth} className="p-2 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-white transition-colors">
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Day headers */}
          <div className="grid grid-cols-7 mb-2">
            {DAYS.map(d => (
              <div key={d} className="text-center text-xs font-medium text-gray-500 py-2">{d}</div>
            ))}
          </div>

          {/* Days */}
          <div className="grid grid-cols-7 gap-1">
            {Array.from({ length: firstDayOfMonth }).map((_, i) => (
              <div key={`empty-${i}`} />
            ))}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1;
              const dayPosts = getPostsForDay(day);
              const isToday = day === today.getDate() && currentDate.getMonth() === today.getMonth() && currentDate.getFullYear() === today.getFullYear();
              const isSelected = day === selectedDay;
              const isPast = new Date(currentDate.getFullYear(), currentDate.getMonth(), day) < new Date(today.getFullYear(), today.getMonth(), today.getDate());

              return (
                <button
                  key={day}
                  onClick={() => setSelectedDay(day)}
                  className={`relative aspect-square rounded-xl flex flex-col items-center justify-start pt-1.5 transition-all text-sm font-medium ${
                    isSelected ? 'bg-blue-600 text-white' :
                    isToday ? 'bg-blue-600/20 text-blue-300 ring-1 ring-blue-500/50' :
                    isPast ? 'text-gray-600 hover:bg-gray-800' :
                    'text-gray-300 hover:bg-gray-800'
                  }`}
                >
                  <span>{day}</span>
                  {dayPosts.length > 0 && (
                    <div className="flex gap-0.5 mt-0.5 flex-wrap justify-center">
                      {dayPosts.slice(0, 3).map((p, idx) => (
                        <div
                          key={idx}
                          className="w-1.5 h-1.5 rounded-full"
                          style={{ backgroundColor: isSelected ? 'rgba(255,255,255,0.7)' : PLATFORM_COLORS[p.platform] }}
                        />
                      ))}
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Selected day posts */}
          {selectedDay && selectedDayPosts.length > 0 && (
            <div className="mt-5 pt-5 border-t border-gray-800">
              <h4 className="text-white text-sm font-semibold mb-3">
                Posts for {MONTHS[currentDate.getMonth()]} {selectedDay}
              </h4>
              <div className="space-y-2">
                {selectedDayPosts.map(post => (
                  <div key={post.id} className="flex items-start gap-3 p-3 rounded-xl bg-gray-800">
                    <div style={{ color: PLATFORM_COLORS[post.platform] }}>{PLATFORM_ICONS[post.platform]}</div>
                    <div className="flex-1 min-w-0">
                      <p className="text-gray-300 text-xs line-clamp-2">{post.content_text}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Clock className="w-3 h-3 text-gray-500" />
                        <span className="text-gray-500 text-[10px]">
                          {post.scheduled_at ? new Date(post.scheduled_at).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) : ''}
                        </span>
                      </div>
                    </div>
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                      post.status === 'published' ? 'bg-emerald-500/10 text-emerald-400' :
                      post.status === 'scheduled' ? 'bg-blue-500/10 text-blue-400' :
                      'bg-gray-700 text-gray-400'
                    }`}>
                      {post.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
          {selectedDay && selectedDayPosts.length === 0 && (
            <div className="mt-5 pt-5 border-t border-gray-800 text-center">
              <Calendar className="w-8 h-8 text-gray-700 mx-auto mb-2" />
              <p className="text-gray-600 text-sm">No posts scheduled for this day</p>
            </div>
          )}
        </div>

        {/* Scheduled queue */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
          <h3 className="text-white font-semibold mb-5 flex items-center gap-2">
            <Send className="w-4 h-4 text-blue-400" />
            Publishing Queue
          </h3>
          {scheduledPosts.length > 0 ? (
            <div className="space-y-3">
              {scheduledPosts.map(post => (
                <div key={post.id} className="bg-gray-800 rounded-xl p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <span style={{ color: PLATFORM_COLORS[post.platform] }}>{PLATFORM_ICONS[post.platform]}</span>
                    <span className="text-gray-300 text-xs font-medium">{PLATFORM_LABELS[post.platform]}</span>
                    <button
                      onClick={() => publishPost(post.id)}
                      className="ml-auto text-[10px] bg-blue-600/10 hover:bg-blue-600/20 text-blue-400 border border-blue-500/20 px-2 py-0.5 rounded-lg transition-colors"
                    >
                      Publish Now
                    </button>
                  </div>
                  <p className="text-gray-400 text-xs line-clamp-2 mb-2">{post.content_text}</p>
                  <div className="flex items-center gap-1.5 text-gray-500 text-[10px]">
                    <Clock className="w-3 h-3" />
                    {post.scheduled_at ? new Date(post.scheduled_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : ''}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Calendar className="w-8 h-8 text-gray-700 mx-auto mb-2" />
              <p className="text-gray-500 text-sm">No posts in queue</p>
            </div>
          )}

          {/* Published today */}
          <div className="mt-6 pt-4 border-t border-gray-800">
            <h4 className="text-white text-sm font-semibold mb-3 flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-400" />
              Published
            </h4>
            <div className="space-y-2">
              {posts.filter(p => p.status === 'published').slice(0, 3).map(post => (
                <div key={post.id} className="flex items-center gap-2 py-2 border-b border-gray-800 last:border-0">
                  <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: PLATFORM_COLORS[post.platform] }} />
                  <p className="text-gray-500 text-xs flex-1 truncate">{post.content_text}</p>
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                </div>
              ))}
              {posts.filter(p => p.status === 'published').length === 0 && (
                <p className="text-gray-600 text-xs">Nothing published yet</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
