import { defineStore } from "pinia";
import { ref } from "vue";

export const useSearchStore = defineStore("search", () => {
  const selectedTags = ref<string[]>([]);
  const searchQuery = ref("");
  const currentTags = ref<string[]>([]);
  const currentState = ref<string | null>(null);

  const setSelectedTags = (tags: string[]) => {
    selectedTags.value = tags;
  };

  const setSearchQuery = (query: string) => {
    searchQuery.value = query;
  };

  const setCurrentTags = (tags: string[]) => {
    currentTags.value = tags;
  };

  const clearFilters = () => {
    selectedTags.value = [];
    searchQuery.value = "";
    currentTags.value = [];
    currentState.value = null;
  };

  return {
    selectedTags,
    searchQuery,
    currentTags,
    currentState,
    setSelectedTags,
    setSearchQuery,
    setCurrentTags,
    clearFilters,
  };
});
