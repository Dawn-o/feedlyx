<script setup lang="ts">
import { onMounted } from "vue";
import { useRouter } from "vue-router";
import { useInfiniteScroll } from "@vueuse/core";
import { useArticlesStore } from "@/stores/articlesStore";
import Header from "@/components/Header.vue";
import ArticleCard from "@/components/ArticleCard.vue";
import FeedNavigation from "@/components/FeedNavigation.vue";
import SkeletonCard from "@/components/SkeletonCard.vue";

const articlesStore = useArticlesStore();
const router = useRouter();

useInfiniteScroll(window, () => articlesStore.loadMore("articles?top=1"), {
    distance: 1500,
    canLoadMore: () => articlesStore.hasMore,
});

onMounted(() => {
    articlesStore.fetchArticles(1, false, "articles?top=1");
});

const goToArticle = (article: any) => {
    router.push(`/${article.username}/${article.slug}`);
};
</script>

<template>
    <div class="container">
        <Header />

        <FeedNavigation currentPage="top" />

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
    </div>
</template>
