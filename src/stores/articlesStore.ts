import { defineStore } from "pinia";
import { ref, computed } from "vue";
import type { Article, Tag } from "@/types";
import { useSearchStore } from "@/stores/searchStore";

export const useArticlesStore = defineStore("articles", () => {
  const searchStore = useSearchStore();

  // State
  const articles = ref<Article[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);
  const hasMore = ref(true);
  const fullSlugToId = ref(new Map<string, number>());
  const discussArticles = ref<Article[]>([]);
  const popularTags = ref<Tag[]>([]);

  // Getters
  const filteredArticles = computed(() => {
    let filtered = articles.value;

    if (searchStore.selectedTags.length > 0) {
      filtered = filtered.filter((article) =>
        searchStore.selectedTags.some((tag) => article.tags.includes(tag)),
      );
    }

    if (searchStore.searchQuery) {
      const query = searchStore.searchQuery.toLowerCase();
      filtered = filtered.filter(
        (article) =>
          article.title.toLowerCase().includes(query) ||
          article.description.toLowerCase().includes(query),
      );
    }

    return filtered;
  });

  // Actions
  const fetchArticles = async (
    page: number = 1,
    append: boolean = false,
    endpoint: string = "articles",
    tags?: string[],
    state?: string,
  ) => {
    if (!append) {
      loading.value = true;
      articles.value = [];
      searchStore.setCurrentTags(tags || []);
      searchStore.currentState = state || null;
    }
    error.value = null;

    try {
      let url = `${import.meta.env.VITE_API_BASE_URL}/${endpoint}?per_page=16&page=${page}`;
      if (tags && tags.length > 0) {
        url += `&tag=${encodeURIComponent(tags.join(","))}`;
      }
      if (state) {
        url += `&state=${state}`;
      }
      const response = await fetch(url);
      if (!response.ok) throw new Error(`API Error: ${response.status}`);

      const data = await response.json();

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
      if (!append)
        setTimeout(
          () => fetchArticles(page, append, endpoint, tags, state),
          1000,
        );
    } finally {
      loading.value = false;
    }
  };

  const loadMore = async (
    endpoint?: string,
    tags?: string[],
    state?: string,
  ) => {
    const useEndpoint = endpoint !== undefined ? endpoint : "articles";
    const useTags = tags !== undefined ? tags : searchStore.currentTags;
    const useState = state !== undefined ? state : searchStore.currentState;
    if (hasMore.value && !loading.value) {
      loading.value = true;
      const nextPage = articles.value.length / 16 + 1;
      await fetchArticles(
        nextPage,
        true,
        useEndpoint,
        useTags,
        useState || undefined,
      );
    }
  };

  const fetchDiscuss = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/articles?tag=discuss&top=1&per_page=5`,
      );
      if (response.ok) {
        const data = await response.json();
        discussArticles.value = data.map((item: any) => {
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
      }
    } catch (error) {
      console.error("Failed to fetch discuss articles:", error);
    }
  };

  const fetchPopularTags = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/tags?per_page=50`,
      );
      if (response.ok) {
        popularTags.value = await response.json();
      }
    } catch (error) {
      console.error("Failed to fetch popular tags:", error);
    }
  };

  return {
    articles,
    loading,
    error,
    hasMore,
    fullSlugToId,
    filteredArticles,
    discussArticles,
    popularTags,
    fetchArticles,
    loadMore,
    fetchDiscuss,
    fetchPopularTags,
  };
});
