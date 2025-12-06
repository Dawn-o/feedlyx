<script setup lang="ts">
import { useArticlesStore } from "@/stores/articlesStore";
import { useRoute, useRouter } from "vue-router";
import { computed, onMounted, watch } from "vue";
import { useInfiniteScroll } from "@vueuse/core";

import SkeletonCard from "@/components/SkeletonCard.vue";
import ArticleCard from "@/components/ArticleCard.vue";
import EmptyState from "@/components/EmptyState.vue";

const articlesStore = useArticlesStore();
const route = useRoute();
const router = useRouter();

const searchQuery = computed(() => (route.query.q as string) || "");
const tags = computed(() =>
    searchQuery.value
        .toLowerCase()
        .split(/\s+/)
        .filter((t) => t.trim()),
);

const fetchSearchResults = () => {
    articlesStore.fetchArticles(1, false, "articles", tags.value);
};

useInfiniteScroll(
    window,
    () => {
        articlesStore.loadMore("articles", tags.value);
    },
    {
        distance: 500,
        canLoadMore: () => articlesStore.hasMore,
    },
);

onMounted(() => {
    fetchSearchResults();
});

watch(searchQuery, () => {
    fetchSearchResults();
});

const goToArticle = (article: any) => {
    router.push(`/${article.username}/${article.slug}`);
};
</script>

<template>
    <div v-if="articlesStore.articles.length > 0" class="grid gap-6">
        <ArticleCard
            v-for="article in articlesStore.articles"
            :key="article.id"
            :article="article"
            @click="goToArticle"
        />
    </div>

    <div
        v-else-if="articlesStore.loading && articlesStore.hasMore"
        class="grid gap-6 mt-6"
    >
        <SkeletonCard v-for="n in 4" :key="'skeleton-' + n" />
    </div>

    <EmptyState
        v-else
        :title="'No Results Found'"
        :description="'No articles were found matching your search. This may be due to API limitations.'"
    />
</template>
