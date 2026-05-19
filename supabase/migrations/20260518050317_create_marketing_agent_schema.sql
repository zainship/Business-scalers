/*
  # AI Marketing Agent Schema

  1. New Tables
    - `campaigns`: Top-level business campaigns with URL and analysis data
      - id, user_id, business_url, business_name, business_description, industry, target_audience, brand_voice, status, created_at
    - `social_connections`: Connected social media accounts
      - id, campaign_id, platform, account_handle, access_token, followers, avg_engagement, best_posting_times, status
    - `strategies`: AI-generated marketing strategies
      - id, campaign_id, strategy_json, status (pending/approved/rejected), created_at
    - `content_posts`: Generated and scheduled posts
      - id, campaign_id, platform, content_text, image_url, image_prompt, hashtags, scheduled_at, published_at, status, engagement_data
    - `business_insights`: Scraped website and market data
      - id, campaign_id, insight_type, content, source_url, created_at

  2. Security
    - RLS enabled on all tables
    - Authenticated users can only access their own data
*/

CREATE TABLE IF NOT EXISTS campaigns (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  business_url text NOT NULL,
  business_name text DEFAULT '',
  business_description text DEFAULT '',
  industry text DEFAULT '',
  target_audience text DEFAULT '',
  brand_voice text DEFAULT '',
  logo_url text DEFAULT '',
  primary_color text DEFAULT '#2563eb',
  status text DEFAULT 'onboarding',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE campaigns ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own campaigns"
  ON campaigns FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own campaigns"
  ON campaigns FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own campaigns"
  ON campaigns FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE TABLE IF NOT EXISTS social_connections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id uuid REFERENCES campaigns(id) ON DELETE CASCADE,
  platform text NOT NULL,
  account_handle text DEFAULT '',
  account_name text DEFAULT '',
  profile_image text DEFAULT '',
  followers integer DEFAULT 0,
  following integer DEFAULT 0,
  posts_count integer DEFAULT 0,
  avg_engagement_rate numeric DEFAULT 0,
  best_posting_times jsonb DEFAULT '[]',
  connected boolean DEFAULT false,
  status text DEFAULT 'disconnected',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE social_connections ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own social connections"
  ON social_connections FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM campaigns
      WHERE campaigns.id = social_connections.campaign_id
      AND campaigns.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert own social connections"
  ON social_connections FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM campaigns
      WHERE campaigns.id = social_connections.campaign_id
      AND campaigns.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update own social connections"
  ON social_connections FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM campaigns
      WHERE campaigns.id = social_connections.campaign_id
      AND campaigns.user_id = auth.uid()
    )
  );

CREATE TABLE IF NOT EXISTS strategies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id uuid REFERENCES campaigns(id) ON DELETE CASCADE,
  title text DEFAULT '',
  overview text DEFAULT '',
  strategy_json jsonb DEFAULT '{}',
  posting_schedule jsonb DEFAULT '{}',
  content_pillars jsonb DEFAULT '[]',
  target_metrics jsonb DEFAULT '{}',
  status text DEFAULT 'pending',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE strategies ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own strategies"
  ON strategies FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM campaigns
      WHERE campaigns.id = strategies.campaign_id
      AND campaigns.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert own strategies"
  ON strategies FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM campaigns
      WHERE campaigns.id = strategies.campaign_id
      AND campaigns.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update own strategies"
  ON strategies FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM campaigns
      WHERE campaigns.id = strategies.campaign_id
      AND campaigns.user_id = auth.uid()
    )
  );

CREATE TABLE IF NOT EXISTS content_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id uuid REFERENCES campaigns(id) ON DELETE CASCADE,
  platform text NOT NULL,
  content_text text DEFAULT '',
  image_url text DEFAULT '',
  image_prompt text DEFAULT '',
  hashtags text[] DEFAULT '{}',
  caption text DEFAULT '',
  post_type text DEFAULT 'post',
  scheduled_at timestamptz,
  published_at timestamptz,
  status text DEFAULT 'draft',
  likes integer DEFAULT 0,
  comments integer DEFAULT 0,
  shares integer DEFAULT 0,
  reach integer DEFAULT 0,
  impressions integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE content_posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own posts"
  ON content_posts FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM campaigns
      WHERE campaigns.id = content_posts.campaign_id
      AND campaigns.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert own posts"
  ON content_posts FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM campaigns
      WHERE campaigns.id = content_posts.campaign_id
      AND campaigns.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update own posts"
  ON content_posts FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM campaigns
      WHERE campaigns.id = content_posts.campaign_id
      AND campaigns.user_id = auth.uid()
    )
  );

CREATE TABLE IF NOT EXISTS business_insights (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id uuid REFERENCES campaigns(id) ON DELETE CASCADE,
  insight_type text NOT NULL,
  title text DEFAULT '',
  content text DEFAULT '',
  source_url text DEFAULT '',
  metadata jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE business_insights ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own insights"
  ON business_insights FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM campaigns
      WHERE campaigns.id = business_insights.campaign_id
      AND campaigns.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert own insights"
  ON business_insights FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM campaigns
      WHERE campaigns.id = business_insights.campaign_id
      AND campaigns.user_id = auth.uid()
    )
  );

CREATE INDEX IF NOT EXISTS idx_campaigns_user_id ON campaigns(user_id);
CREATE INDEX IF NOT EXISTS idx_social_connections_campaign_id ON social_connections(campaign_id);
CREATE INDEX IF NOT EXISTS idx_content_posts_campaign_id ON content_posts(campaign_id);
CREATE INDEX IF NOT EXISTS idx_content_posts_scheduled_at ON content_posts(scheduled_at);
CREATE INDEX IF NOT EXISTS idx_content_posts_status ON content_posts(status);
CREATE INDEX IF NOT EXISTS idx_strategies_campaign_id ON strategies(campaign_id);
