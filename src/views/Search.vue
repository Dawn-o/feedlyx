<script setup lang="ts">
import { onMounted, ref, computed, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useInfiniteScroll } from "@vueuse/core";
import { useArticlesStore } from "@/stores/articlesStore";
import Header from "@/components/Header.vue";
import SkeletonCard from "@/components/SkeletonCard.vue";
import SearchNavigation from "@/components/SearchNavigation.vue";
import ArticleCard from "@/components/ArticleCard.vue";

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
const currentTab = ref("Posts");
const currentFilter = ref("Most relevant");

const filterOptions = [
    { label: "Most relevant", value: "" },
    { label: "Newest", value: "fresh" },
    { label: "Oldest", value: "all" },
];

const tabs = ["Posts", "People", "Organizations", "Tags", "Comments"];

const fetchSearchResults = () => {
    if (currentTab.value === "Posts") {
        const state = filterOptions.find(
            (f) => f.label === currentFilter.value,
        )?.value;
        articlesStore.fetchArticles(1, false, "articles", tags.value, state);
    } else {
        console.log(`Search for ${currentTab.value} not implemented yet`);
    }
};

useInfiniteScroll(
    window,
    () => {
        if (currentTab.value === "Posts") {
            const state = filterOptions.find(
                (f) => f.label === currentFilter.value,
            )?.value;
            articlesStore.loadMore("articles", tags.value, state);
        }
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

const handleTabChange = (tab: string) => {
    currentTab.value = tab;
    fetchSearchResults();
};

const handleFilterChange = (filter: string) => {
    currentFilter.value = filter;
    fetchSearchResults();
};

const goToArticle = (article: any) => {
    router.push(`/${article.username}/${article.slug}`);
};
</script>

<template>
    <div class="container">
        <Header />

        <div class="mb-6">
            <SearchNavigation
                :search-query="searchQuery"
                :current-tab="currentTab"
                :current-filter="currentFilter"
                :tabs="tabs"
                :filter-options="filterOptions"
                @tab-change="handleTabChange"
                @filter-change="handleFilterChange"
            />
        </div>

        <div v-if="currentTab === 'Posts'" class="grid gap-6">
            <ArticleCard
                v-for="article in articlesStore.articles"
                :key="article.id"
                :article="article"
                @click="goToArticle"
            />
        </div>

        <div v-else class="text-center py-8">
            <p class="text-muted-foreground">
                Search for {{ currentTab.toLowerCase() }} is not implemented
                yet.
            </p>
        </div>

        <div
            v-if="articlesStore.loading && articlesStore.hasMore"
            class="grid gap-6 mt-6"
        >
            <SkeletonCard v-for="n in 4" :key="'skeleton-' + n" />
        </div>
    </div>
</template>
