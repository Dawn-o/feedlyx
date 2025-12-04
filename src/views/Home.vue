<script setup lang="ts">
import { onMounted } from "vue";
import { useRouter } from "vue-router";
import { useInfiniteScroll } from "@vueuse/core";
import { useArticlesStore } from "@/stores/articlesStore";

import ArticleCard from "@/components/ArticleCard.vue";
import FeedNavigation from "@/components/FeedNavigation.vue";
import SkeletonCard from "@/components/SkeletonCard.vue";

const articlesStore = useArticlesStore();
const router = useRouter();

useInfiniteScroll(window, () => articlesStore.loadMore("articles"), {
    distance: 1500,
    canLoadMore: () => articlesStore.hasMore,
});

onMounted(() => {
    articlesStore.fetchArticles(1, false, "articles");
});

const goToArticle = (article: any) => {
    router.push(`/${article.username}/${article.slug}`);
};
</script>

<template>
    <FeedNavigation currentPage="home" />

    <div class="grid gap-6">
        <ArticleCard
            v-for="article in articlesStore.filteredArticles"
            :key="article.id"
            :article="article"
            @click="goToArticle"
        />
    </div>

    <div
        v-if="articlesStore.loading && articlesStore.hasMore"
        class="grid gap-6 mt-6"
    >
        <SkeletonCard v-for="n in 4" :key="'skeleton-' + n" />
    </div>
</template>
