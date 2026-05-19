import { Platform, SocialConnection, ContentPost, Strategy, BusinessInsight } from '../types';

export const PLATFORM_COLORS: Record<Platform, string> = {
  instagram: '#E1306C',
  tiktok: '#010101',
  twitter: '#1DA1F2',
  linkedin: '#0A66C2',
  facebook: '#1877F2',
};

export const PLATFORM_LABELS: Record<Platform, string> = {
  instagram: 'Instagram',
  tiktok: 'TikTok',
  twitter: 'Twitter / X',
  linkedin: 'LinkedIn',
  facebook: 'Facebook',
};

export function generateMockConnections(campaignId: string): Omit<SocialConnection, 'id'>[] {
  const platforms: Platform[] = ['instagram', 'tiktok', 'twitter', 'linkedin', 'facebook'];
  return platforms.map(platform => ({
    campaign_id: campaignId,
    platform,
    account_handle: '',
    account_name: '',
    profile_image: '',
    followers: 0,
    following: 0,
    posts_count: 0,
    avg_engagement_rate: 0,
    best_posting_times: [],
    connected: false,
    status: 'disconnected' as const,
  }));
}

export function generateMockStrategy(campaignId: string, businessName: string, industry: string): Omit<Strategy, 'id' | 'created_at'> {
  return {
    campaign_id: campaignId,
    title: `${businessName} Growth Accelerator Strategy`,
    overview: `A comprehensive 90-day social media scaling strategy for ${businessName} in the ${industry} space. This strategy focuses on building authentic brand presence, driving qualified traffic, and converting followers into customers through data-driven content.`,
    strategy_json: {
      goals: [
        'Grow social following by 40% across all platforms in 90 days',
        'Achieve 5-8% average engagement rate',
        'Drive 30% increase in website traffic from social',
        'Generate 50+ qualified leads per month',
      ],
      platforms: [
        { platform: 'instagram', frequency: 'Daily', contentTypes: ['Reels', 'Stories', 'Carousels'], tone: 'Inspiring & Visual', cta: 'Shop Now / Learn More' },
        { platform: 'tiktok', frequency: '5x per week', contentTypes: ['Short Videos', 'Trends', 'Behind-the-Scenes'], tone: 'Authentic & Entertaining', cta: 'Follow for More' },
        { platform: 'twitter', frequency: '3x daily', contentTypes: ['Threads', 'Quick Tips', 'Engagement Bait'], tone: 'Conversational & Witty', cta: 'Retweet & Reply' },
        { platform: 'linkedin', frequency: '3x per week', contentTypes: ['Articles', 'Case Studies', 'Industry News'], tone: 'Professional & Authoritative', cta: 'Connect & Collaborate' },
        { platform: 'facebook', frequency: '4x per week', contentTypes: ['Videos', 'Live Sessions', 'Community Posts'], tone: 'Warm & Community-Focused', cta: 'Join the Community' },
      ],
      contentMix: [
        { type: 'Educational', percentage: 30, description: 'How-tos, tips, industry insights' },
        { type: 'Promotional', percentage: 20, description: 'Product/service highlights, offers' },
        { type: 'Engagement', percentage: 25, description: 'Polls, Q&As, UGC reposts' },
        { type: 'Entertainment', percentage: 15, description: 'Behind-the-scenes, humor, trends' },
        { type: 'Inspirational', percentage: 10, description: 'Success stories, testimonials' },
      ],
    },
    posting_schedule: {
      instagram: { days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'], times: ['9:00 AM', '12:00 PM', '6:00 PM'], postsPerWeek: 7 },
      tiktok: { days: ['Mon', 'Tue', 'Thu', 'Fri', 'Sat'], times: ['7:00 PM', '9:00 PM'], postsPerWeek: 5 },
      twitter: { days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'], times: ['8:00 AM', '12:00 PM', '5:00 PM'], postsPerWeek: 15 },
      linkedin: { days: ['Tue', 'Wed', 'Thu'], times: ['8:00 AM', '12:00 PM'], postsPerWeek: 3 },
      facebook: { days: ['Mon', 'Wed', 'Fri', 'Sun'], times: ['10:00 AM', '3:00 PM'], postsPerWeek: 4 },
    },
    content_pillars: [
      { name: 'Brand Story', percentage: 20, description: 'Who you are, your mission and values', color: '#2563eb' },
      { name: 'Product Showcase', percentage: 25, description: 'Features, benefits, demos', color: '#16a34a' },
      { name: 'Customer Success', percentage: 20, description: 'Testimonials, case studies, UGC', color: '#d97706' },
      { name: 'Industry Insights', percentage: 20, description: 'Trends, tips, thought leadership', color: '#dc2626' },
      { name: 'Community', percentage: 15, description: 'Engagement, conversations, culture', color: '#7c3aed' },
    ],
    target_metrics: {
      followerGrowth: '+40% in 90 days',
      engagementRate: '5-8% average',
      reach: '10x current reach',
      websiteTraffic: '+30% from social',
    },
    status: 'pending',
  };
}

export function generateMockPosts(campaignId: string, businessName: string): Omit<ContentPost, 'id' | 'created_at'>[] {
  const now = new Date();
  const posts: Omit<ContentPost, 'id' | 'created_at'>[] = [];

  const templates = [
    {
      platform: 'instagram' as Platform,
      content_text: `Transforming the way you experience ${businessName}. Our latest drop is here and it's everything you've been waiting for. Tap the link in bio to explore.`,
      hashtags: ['#innovation', '#newlaunch', '#lifestyle', '#brand', '#quality'],
      image_url: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=800',
      post_type: 'image',
    },
    {
      platform: 'twitter' as Platform,
      content_text: `Hot take: Most businesses don't fail because of the product. They fail because nobody knows about them. That's why we built ${businessName}. Thread on how we cracked the code on growth ->`,
      hashtags: ['#startup', '#growth', '#business'],
      image_url: '',
      post_type: 'thread',
    },
    {
      platform: 'linkedin' as Platform,
      content_text: `The biggest lesson from scaling ${businessName} to where it is today:\n\nIt's not about working harder. It's about working smarter.\n\nHere are the 5 frameworks we use to stay ahead of the curve in a competitive market...`,
      hashtags: ['#leadership', '#entrepreneurship', '#businessgrowth', '#innovation'],
      image_url: 'https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=800',
      post_type: 'article',
    },
    {
      platform: 'facebook' as Platform,
      content_text: `We just hit a major milestone and we couldn't have done it without this community. A huge THANK YOU to everyone who has supported ${businessName} on this journey. Drop a comment below with your favorite memory with us!`,
      hashtags: ['#milestone', '#grateful', '#community', '#thankyou'],
      image_url: 'https://images.pexels.com/photos/1181406/pexels-photo-1181406.jpeg?auto=compress&cs=tinysrgb&w=800',
      post_type: 'image',
    },
    {
      platform: 'tiktok' as Platform,
      content_text: `POV: You discover ${businessName} for the first time and can't stop telling everyone about it #fyp #viral #trending`,
      hashtags: ['#fyp', '#viral', '#trending', '#mustwatch'],
      image_url: '',
      post_type: 'video',
    },
    {
      platform: 'instagram' as Platform,
      content_text: `Behind the scenes of how we make the magic happen. Every detail matters. Every decision is intentional. This is ${businessName}.`,
      hashtags: ['#bts', '#behindthescenes', '#process', '#craftsmanship'],
      image_url: 'https://images.pexels.com/photos/3184339/pexels-photo-3184339.jpeg?auto=compress&cs=tinysrgb&w=800',
      post_type: 'carousel',
    },
  ];

  templates.forEach((t, i) => {
    const scheduledDate = new Date(now);
    scheduledDate.setDate(now.getDate() + i);
    scheduledDate.setHours(9 + (i % 3) * 3, 0, 0, 0);

    posts.push({
      campaign_id: campaignId,
      ...t,
      caption: t.content_text,
      image_prompt: '',
      scheduled_at: scheduledDate.toISOString(),
      published_at: i < 2 ? new Date(now.getTime() - 86400000 * (2 - i)).toISOString() : null,
      status: i < 2 ? 'published' : 'scheduled',
      likes: i < 2 ? Math.floor(Math.random() * 500) + 50 : 0,
      comments: i < 2 ? Math.floor(Math.random() * 80) + 10 : 0,
      shares: i < 2 ? Math.floor(Math.random() * 100) + 5 : 0,
      reach: i < 2 ? Math.floor(Math.random() * 5000) + 500 : 0,
      impressions: i < 2 ? Math.floor(Math.random() * 8000) + 800 : 0,
    });
  });

  return posts;
}

export function generateMockInsights(campaignId: string, businessName: string, industry: string): Omit<BusinessInsight, 'id' | 'created_at'>[] {
  return [
    {
      campaign_id: campaignId,
      insight_type: 'competitor',
      title: 'Top Competitors Identified',
      content: `Found 5 main competitors in the ${industry} space. Top performers are posting 2-3x daily with high video content ratio.`,
      source_url: '',
      metadata: { competitors: 5, avgFollowers: 45000 },
    },
    {
      campaign_id: campaignId,
      insight_type: 'audience',
      title: 'Target Audience Profile',
      content: `Primary audience: 25-40 year olds interested in ${industry}. Most active between 7-9 PM weekdays and 10 AM-2 PM weekends.`,
      source_url: '',
      metadata: { primaryAge: '25-40', peakTime: '7-9 PM' },
    },
    {
      campaign_id: campaignId,
      insight_type: 'trend',
      title: 'Rising Content Trends',
      content: `Short-form video content is 3.4x more engaging than static posts in the ${industry} category. Authentic behind-the-scenes content drives 2x engagement.`,
      source_url: '',
      metadata: { videoBoost: 3.4, btsBoost: 2.0 },
    },
    {
      campaign_id: campaignId,
      insight_type: 'website',
      title: `${businessName} Website Analysis`,
      content: `Website analyzed. Key products/services identified. USPs extracted. Brand voice: Professional yet approachable. Strong value propositions detected.`,
      source_url: '',
      metadata: { pagesScanned: 12, keywordsFound: 47 },
    },
  ];
}
