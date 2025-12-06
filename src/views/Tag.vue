<script setup lang="ts">
import { useArticlesStore } from "@/stores/articlesStore";
import { useRoute, useRouter } from "vue-router";
import { onMounted, computed, watch } from "vue";

import ArticleCard from "@/components/ArticleCard.vue";
import HomeLayout from "@/components/HomeLayout.vue";
import PopularTags from "@/components/PopularTags.vue";
import { Separator } from "@/components/ui/separator";
import SkeletonCard from "@/components/SkeletonCard.vue";
import TagPagination from "@/components/TagPagination.vue";
import TrendingGuides from "@/components/TrendingGuides.vue";

const articlesStore = useArticlesStore();
const route = useRoute();
const router = useRouter();

const tag = computed(() => route.params.tags as string);
const page = computed(() => parseInt(route.params.page as string) || 1);

onMounted(() => {
    articlesStore.fetchArticles(page.value, false, "articles", [tag.value]);
    articlesStore.fetchPopularTags();
    articlesStore.fetchDiscuss();
    articlesStore.fetchTrendingGuides(tag.value);
});

watch([tag, page], ([newTag, newPage]) => {
    articlesStore.fetchArticles(newPage, false, "articles", [newTag]);
    articlesStore.fetchTrendingGuides(newTag);
});

const goToArticle = (article: any) => {
    router.push(`/${article.username}/${article.slug}`);
};
</script>

<template>
    <div>
        <HomeLayout>
            <template #left>
                <PopularTags />
                <Separator class="my-4" />
                <TagPagination
                    :page="page"
                    :has-more="articlesStore.hasMore"
                    :tag="tag"
                />
            </template>
            <template #main>
                <div class="mb-4">
                    <h1 class="text-2xl font-bold">#{{ tag }}</h1>
                </div>

                <div class="grid gap-6">
                    <ArticleCard
                        v-for="article in articlesStore.filteredArticles"
                        :key="article.id"
                        :article="article"
                        @click="goToArticle"
                    />
                </div>

                <div v-if="articlesStore.loading" class="grid gap-6 mt-6">
                    <SkeletonCard v-for="n in 4" :key="'skeleton-' + n" />
                </div>
            </template>
            <template #right>
                <TrendingGuides />
            </template>
        </HomeLayout>
    </div>
</template>
