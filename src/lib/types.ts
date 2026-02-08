export type Profile = {
  id: string;
  handle: string;
  display_name: string;
  bio: string;
  avatar_url: string | null;
  cover_url: string | null;
  community_label: string;
  community_href: string;
  is_admin: boolean;
};

export type SocialLink = {
  id: string;
  user_id: string;
  platform: string;
  label: string;
  href: string;
  sort: number;
  enabled: boolean;
};

export type Brand = {
  id: string;
  user_id: string;
  name: string;
  logo_url: string | null;
  sort: number;
  enabled: boolean;
};

export type Post = {
  id: string;
  user_id: string;
  title: string;
  slug: string;
  excerpt: string;
  content_md: string;
  cover_url: string | null;
  published_at: string | null;
  created_at: string;
  updated_at: string;
};
