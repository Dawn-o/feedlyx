export interface Article {
  id: number;
  title: string;
  description: string;
  url: string;
  publishedAt: string;
  source: string;
  tags: string[];
  author: string;
  username: string;
  image?: string;
  profileImage?: string;
  readingTime?: number;
  reactionsCount?: number;
  commentsCount?: number;
  slug: string;
}

export interface FullArticle {
  id: number;
  title: string;
  body_markdown: string;
  body_html: string;
  published_at: string;
  user: {
    name: string;
    profile_image_90: string;
  };
  tags: string[];
  positive_reactions_count: number;
  comments_count: number;
  reading_time_minutes: number;
  url: string;
}
