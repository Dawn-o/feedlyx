import { defineStore } from "pinia";
import { ref, computed } from "vue";

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

export const useFeedStore = defineStore("feed", () => {
  // State
  const articles = ref<Article[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);
  const selectedTags = ref<string[]>([]);
  const searchQuery = ref("");
  const hasMore = ref(true);
  const fullSlugToId = ref(new Map<string, number>());
  const articleDetailsCache = ref(new Map<number, FullArticle>());

  // Getters
  const filteredArticles = computed(() => {
    let filtered = articles.value;

    if (selectedTags.value.length > 0) {
      filtered = filtered.filter((article) =>
        selectedTags.value.some((tag) => article.tags.includes(tag)),
      );
    }

    if (searchQuery.value) {
      const query = searchQuery.value.toLowerCase();
      filtered = filtered.filter(
        (article) =>
          article.title.toLowerCase().includes(query) ||
          article.description.toLowerCase().includes(query),
      );
    }

    return filtered;
  });

  // Actions
  const fetchArticleDetail = async (
    id: number,
  ): Promise<FullArticle | null> => {
    if (articleDetailsCache.value.has(id)) {
      return articleDetailsCache.value.get(id)!;
    }
    try {
      const response = await fetch(`https://dev.to/api/articles/${id}`);
      if (!response.ok) return null;
      const article = await response.json();
      articleDetailsCache.value.set(id, article);
      return article;
    } catch {
      return null;
    }
  };

  // Actions
  const fetchArticles = async (page: number = 1, append: boolean = false) => {
    if (!append) {
      loading.value = true;
      articles.value = [];
    }
    error.value = null;

    try {
      const url = `https://dev.to/api/articles?per_page=16&page=${page}`;
      const response = await fetch(url);
      if (!response.ok) throw new Error(`API Error: ${response.status}`);

      const data = await response.json();

      await new Promise((resolve) => setTimeout(resolve, 10000));

      const transformedArticles: Article[] = data.map((item: any) => {
        const {
          id,
          title,
          description,
          url,
          published_at: publishedAt,
          tag_list: tags,
          user,
          cover_image: image,
          reading_time_minutes: readingTime,
          positive_reactions_count: reactionsCount,
          comments_count: commentsCount,
        } = item;
        return {
          id,
          title,
          description: description || "",
          url,
          publishedAt,
          source: "devto",
          tags: tags || [],
          author: user?.name || "Unknown",
          username: user?.username || "unknown",
          image,
          profileImage: user?.profile_image_90 || user?.profile_image,
          readingTime,
          reactionsCount,
          commentsCount,
          slug: item.slug,
        };
      });

      transformedArticles.forEach((article) => {
        fullSlugToId.value.set(
          `${article.username}-${article.slug}`,
          article.id,
        );
      });

      if (append) {
        articles.value.push(...transformedArticles);
      } else {
        articles.value = transformedArticles;
      }

      hasMore.value = data.length === 16;
    } catch (err) {
      error.value = err instanceof Error ? err.message : "Network error";
      // Retry once after 1s
      if (!append) setTimeout(() => fetchArticles(page, append), 1000);
    } finally {
      loading.value = false;
    }
  };

  const loadMore = async () => {
    if (hasMore.value && !loading.value) {
      loading.value = true;
      const nextPage = articles.value.length / 16 + 1;
      await fetchArticles(nextPage, true);
    }
  };

  const setSelectedTags = (tags: string[]) => {
    selectedTags.value = tags;
  };

  const setSearchQuery = (query: string) => {
    searchQuery.value = query;
  };

  const clearFilters = () => {
    selectedTags.value = [];
    searchQuery.value = "";
  };

  return {
    // State
    articles,
    loading,
    error,
    selectedTags,
    searchQuery,
    hasMore,
    fullSlugToId,
    // Getters
    filteredArticles,
    // Actions
    fetchArticles,
    loadMore,
    fetchArticleDetail,
    setSelectedTags,
    setSearchQuery,
    clearFilters,
  };
});
