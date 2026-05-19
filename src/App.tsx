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
import { generateMockStrategy, generateMockPosts, generateMockInsights } from './lib/mockData';

type View = 'dashboard' | 'strategy' | 'content' | 'schedule' | 'analytics' | 'connections' | 'insights' | 'settings';

export default function App() {
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [connections, setConnections] = useState<SocialConnection[]>([]);
  const [posts, setPosts] = useState<ContentPost[]>([]);
  const [strategy, setStrategy] = useState<Strategy | null>(null);
  const [insights, setInsights] = useState<BusinessInsight[]>([]);
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [bootstrapped, setBootstrapped] = useState(false);

  useEffect(() => {
    if (campaign && connections.length > 0 && !bootstrapped) {
      setBootstrapped(true);

      const mockStrategy = generateMockStrategy(campaign.id, campaign.business_name, campaign.industry || 'Technology');
      const strat: Strategy = {
        ...mockStrategy,
        id: crypto.randomUUID(),
        created_at: new Date().toISOString(),
      } as Strategy;
      setStrategy(strat);

      const mockPosts = generateMockPosts(campaign.id, campaign.business_name);
      const initialPosts: ContentPost[] = mockPosts.map(p => ({
        ...p,
        id: crypto.randomUUID(),
        created_at: new Date().toISOString(),
      } as ContentPost));
      setPosts(initialPosts);

      const mockInsights = generateMockInsights(campaign.id, campaign.business_name, campaign.industry || 'Technology');
      const initialInsights: BusinessInsight[] = mockInsights.map(i => ({
        ...i,
        id: crypto.randomUUID(),
        created_at: new Date().toISOString(),
      }));
      setInsights(initialInsights);
    }
  }, [campaign, connections, bootstrapped]);

  function handleOnboardingComplete(newCampaign: Campaign, newConnections: SocialConnection[]) {
    setCampaign(newCampaign);
    setConnections(newConnections);
    setCurrentView('dashboard');
  }

  function handleReset() {
    setCampaign(null);
    setConnections([]);
    setPosts([]);
    setStrategy(null);
    setInsights([]);
    setBootstrapped(false);
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
