export type Platform = 'instagram' | 'tiktok' | 'twitter' | 'linkedin' | 'facebook';

export interface Campaign {
  id: string;
  user_id: string;
  business_url: string;
  business_name: string;
  business_description: string;
  industry: string;
  target_audience: string;
  brand_voice: string;
  logo_url: string;
  primary_color: string;
  status: 'onboarding' | 'connecting' | 'analyzing' | 'strategy' | 'active';
  created_at: string;
  updated_at: string;
}

export interface SocialConnection {
  id: string;
  campaign_id: string;
  platform: Platform;
  account_handle: string;
  account_name: string;
  profile_image: string;
  followers: number;
  following: number;
  posts_count: number;
  avg_engagement_rate: number;
  best_posting_times: string[];
  connected: boolean;
  status: 'disconnected' | 'connecting' | 'connected' | 'error';
}

export interface ContentPost {
  id: string;
  campaign_id: string;
  platform: Platform;
  content_text: string;
  image_url: string;
  image_prompt: string;
  hashtags: string[];
  caption: string;
  post_type: string;
  scheduled_at: string | null;
  published_at: string | null;
  status: 'draft' | 'scheduled' | 'published' | 'failed';
  likes: number;
  comments: number;
  shares: number;
  reach: number;
  impressions: number;
  created_at: string;
}

export interface Strategy {
  id: string;
  campaign_id: string;
  title: string;
  overview: string;
  strategy_json: StrategyData;
  posting_schedule: PostingSchedule;
  content_pillars: ContentPillar[];
  target_metrics: TargetMetrics;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
}

export interface StrategyData {
  goals: string[];
  platforms: PlatformStrategy[];
  contentMix: ContentMixItem[];
}

export interface PlatformStrategy {
  platform: Platform;
  frequency: string;
  contentTypes: string[];
  tone: string;
  cta: string;
}

export interface ContentMixItem {
  type: string;
  percentage: number;
  description: string;
}

export interface PostingSchedule {
  [platform: string]: {
    days: string[];
    times: string[];
    postsPerWeek: number;
  };
}

export interface ContentPillar {
  name: string;
  percentage: number;
  description: string;
  color: string;
}

export interface TargetMetrics {
  followerGrowth: string;
  engagementRate: string;
  reach: string;
  websiteTraffic: string;
}

export interface BusinessInsight {
  id: string;
  campaign_id: string;
  insight_type: string;
  title: string;
  content: string;
  source_url: string;
  metadata: Record<string, unknown>;
  created_at: string;
}
