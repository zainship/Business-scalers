import { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Onboarding from './components/Onboarding';
import Dashboard from './components/Dashboard';
import StrategyView from './components/StrategyView';
import ContentStudio from './components/ContentStudio';
import Scheduler from './components/Scheduler';
import Analytics from './components/Analytics';
import Connections from './components/Connections';
import Insights from './components/Insights';
import SettingsView from './components/SettingsView';
import { Campaign, SocialConnection, ContentPost, Strategy, BusinessInsight } from './types';
import { supabase } from './lib/supabase';

type View = 'dashboard' | 'strategy' | 'content' | 'schedule' | 'analytics' | 'connections' | 'insights' | 'settings';

export default function App() {
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [connections, setConnections] = useState<SocialConnection[]>([]);
  const [posts, setPosts] = useState<ContentPost[]>([]);
  const [strategy, setStrategy] = useState<Strategy | null>(null);
  const [insights, setInsights] = useState<BusinessInsight[]>([]);
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [loading, setLoading] = useState(false);

  async function loadCampaignData(campaignId: string) {
    try {
      const [connRes, postsRes, stratRes, insightsRes] = await Promise.all([
        supabase.from('social_connections').select('*').eq('campaign_id', campaignId),
        supabase.from('content_posts').select('*').eq('campaign_id', campaignId),
        supabase.from('strategies').select('*').eq('campaign_id', campaignId).order('created_at', { ascending: false }).limit(1),
        supabase.from('business_insights').select('*').eq('campaign_id', campaignId),
      ]);

      setConnections((connRes.data as SocialConnection[]) || []);
      setPosts((postsRes.data as ContentPost[]) || []);
      if (stratRes.data && stratRes.data.length > 0) setStrategy(stratRes.data[0] as Strategy);
      setInsights((insightsRes.data as BusinessInsight[]) || []);
    } catch (err) {
      console.error('Failed to load campaign data:', err);
    }
  }

  async function handleOnboardingComplete(newCampaign: Campaign, newConnections: SocialConnection[]) {
    setCampaign(newCampaign);
    setConnections(newConnections);
    setCurrentView('dashboard');
    await loadCampaignData(newCampaign.id);
  }

  function handleReset() {
    setCampaign(null);
    setConnections([]);
    setPosts([]);
    setStrategy(null);
    setInsights([]);
    setCurrentView('dashboard');
  }

  if (!campaign) {
    return <Onboarding onComplete={handleOnboardingComplete} />;
  }

  return (
    <div className="flex min-h-screen bg-gray-950">
      <Sidebar
        campaign={campaign}
        currentView={currentView}
        onViewChange={setCurrentView}
      />
      <main className="flex-1 ml-64 min-h-screen overflow-y-auto">
        {currentView === 'dashboard' && (
          <Dashboard
            campaign={campaign}
            connections={connections}
            posts={posts}
            strategy={strategy}
            onNavigate={v => setCurrentView(v as View)}
          />
        )}
        {currentView === 'strategy' && (
          <StrategyView
            campaign={campaign}
            strategy={strategy}
            onStrategyUpdate={setStrategy}
          />
        )}
        {currentView === 'content' && (
          <ContentStudio
            campaign={campaign}
            posts={posts}
            onPostsUpdate={setPosts}
          />
        )}
        {currentView === 'schedule' && (
          <Scheduler
            posts={posts}
            onPostsUpdate={setPosts}
          />
        )}
        {currentView === 'analytics' && (
          <Analytics
            campaign={campaign}
            connections={connections}
            posts={posts}
          />
        )}
        {currentView === 'connections' && (
          <Connections
            connections={connections}
            onConnectionsUpdate={setConnections}
          />
        )}
        {currentView === 'insights' && (
          <Insights
            campaign={campaign}
            insights={insights}
            onInsightsUpdate={setInsights}
          />
        )}
        {currentView === 'settings' && (
          <SettingsView
            campaign={campaign}
            onCampaignUpdate={setCampaign}
            onReset={handleReset}
          />
        )}
      </main>
    </div>
  );
}
