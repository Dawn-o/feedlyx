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
      const response = await fetch(`https://dev.to/api/articles/${id}`);
      if (!response.ok) return null;
      const article = await response.json();
      articleDetailsCache.value.set(id, article);
      return article;
    } catch {
      return null;
    }
  };

  return {
    articleDetailsCache,
    fetchArticleDetail,
  };
});
