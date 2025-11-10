import type { Post } from "../pages/AllDiscoveriesPage";

export function pickRandomPost(posts: Post[], category?: string): Post | null {
  if (!posts?.length) return null;

  let filtered = posts;
  if (category) {
    filtered = posts.filter(p => p.user?.username === category || p.title.includes(category));
  }

  return filtered.length > 0
    ? filtered[Math.floor(Math.random() * filtered.length)]
    : null;
}