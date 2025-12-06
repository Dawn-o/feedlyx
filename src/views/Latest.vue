<script setup lang="ts">
import { useArticlesStore } from "@/stores/articlesStore";
import { useRouter } from "vue-router";
import { useInfiniteScroll } from "@vueuse/core";
import { onMounted } from "vue";

import HomeLayout from "@/components/HomeLayout.vue";
import PopularTags from "@/components/PopularTags.vue";
import FeedNavigation from "@/components/FeedNavigation.vue";
import ArticleCard from "@/components/ArticleCard.vue";
import SkeletonCard from "@/components/SkeletonCard.vue";
import DiscussCard from "@/components/DiscussCard.vue";
import TrendingGuides from "@/components/TrendingGuides.vue";

const articlesStore = useArticlesStore();
const router = useRouter();

useInfiniteScroll(window, () => articlesStore.loadMore("articles/latest"), {
    distance: 1500,
    canLoadMore: () => articlesStore.hasMore,
});

onMounted(() => {
    articlesStore.fetchArticles(1, false, "articles/latest");
    articlesStore.fetchPopularTags();
    articlesStore.fetchDiscuss();
    articlesStore.fetchTrendingGuides("webdev");
});

const goToArticle = (article: any) => {
    router.push(`/${article.username}/${article.slug}`);
};
</script>

<template>
    <HomeLayout>
        <template #left>
            <PopularTags />
        </template>
        <template #main>
            <FeedNavigation currentPage="latest" />

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
        <template #right>
            <DiscussCard />
            <TrendingGuides />
        </template>
    </HomeLayout>
</template>
