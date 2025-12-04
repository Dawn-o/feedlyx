import { defineStore } from "pinia";
import { ref } from "vue";
import type { FullArticle } from "@/types";

export const useArticleDetailStore = defineStore("articleDetail", () => {
  const articleDetailsCache = ref(new Map<number, FullArticle>());

  const fetchArticleDetail = async (
    id: number,
  ): Promise<FullArticle | null> => {
    if (articleDetailsCache.value.has(id)) {
      return articleDetailsCache.value.get(id)!;
    }
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/articles/${id}`,
      );
      if (!response.ok) return null;
      const article = await response.json();
      articleDetailsCache.value.set(id, article);
      return article;
    } catch {
      return null;
    }
  };

  const fetchArticleByUsernameSlug = async (
    username: string,
    slug: string,
  ): Promise<FullArticle | null> => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/articles?username=${username}&per_page=30`,
      );
      if (!response.ok) throw new Error("Failed to fetch user articles");
      const data = await response.json();
      const found = data.find((item: any) => item.slug === slug);
      if (found) {
        return await fetchArticleDetail(found.id);
      }
      return null;
    } catch {
      return null;
    }
  };

  return {
    articleDetailsCache,
    fetchArticleDetail,
    fetchArticleByUsernameSlug,
  };
});
