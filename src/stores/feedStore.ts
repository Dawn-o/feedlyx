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

export const useFeedStore = defineStore("feed", () => {
  // State
  const articles = ref<Article[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);
  const selectedTags = ref<string[]>([]);
  const searchQuery = ref("");
  const currentPage = ref(1);
  const hasMore = ref(true);
  const fullSlugToId = ref(new Map<string, number>());

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
  const fetchArticles = async (page: number = 1, append: boolean = false) => {
    if (!append) {
      loading.value = true;
      articles.value = [];
      currentPage.value = 1;
    }
    error.value = null;

    try {
      const url = `https://dev.to/api/articles?per_page=16&page=${page}`;
      const response = await fetch(url);
      if (!response.ok) throw new Error("Failed to fetch articles");

      const data = await response.json();

      const transformedArticles: Article[] = data.map((item: any) => ({
        id: item.id,
        title: item.title,
        description: item.description || "",
        url: item.url,
        publishedAt: item.published_at,
        source: "devto",
        tags: item.tag_list || [],
        author: item.user?.name || "Unknown",
        username: item.user?.username || "unknown",
        image: item.cover_image,
        profileImage: item.user?.profile_image_90 || item.user?.profile_image,
        readingTime: item.reading_time_minutes,
        reactionsCount: item.positive_reactions_count,
        commentsCount: item.comments_count,
        slug: item.slug,
      }));

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

      hasMore.value = data.length === 16; // Assume more if full page
    } catch (err) {
      error.value = err instanceof Error ? err.message : "An error occurred";
    } finally {
      loading.value = false;
    }
  };

  const loadMore = async () => {
    if (hasMore.value && !loading.value) {
      loading.value = true;
      currentPage.value++;
      await fetchArticles(currentPage.value, true);
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
    setSelectedTags,
    setSearchQuery,
    clearFilters,
  };
});
