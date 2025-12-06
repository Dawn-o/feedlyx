<script setup lang="ts">
import { useRouter } from "vue-router";
import { useArticlesStore } from "@/stores/articlesStore";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

const articlesStore = useArticlesStore();
const router = useRouter();

const goToArticle = (article: any) => {
    router.push(`/${article.username}/${article.slug}`);
};
</script>

<template>
    <div class="mt-6">
        <h3 class="text-lg font-semibold mb-4">Trending Guides/Resources</h3>
        <div class="space-y-2">
            <template v-if="articlesStore.trendingGuides.length > 0">
                <Button
                    v-for="article in articlesStore.trendingGuides"
                    :key="article.id"
                    variant="ghost"
                    class="w-full justify-start h-auto p-4"
                    @click="goToArticle(article)"
                >
                    <h4
                        class="text-base leading-tight text-wrap text-left text-foreground/80"
                    >
                        {{ article.title }}
                    </h4>
                </Button>
            </template>
            <template v-else>
                <Skeleton
                    v-for="n in 5"
                    :key="`skeleton-guide-${n}`"
                    class="h-16 w-full"
                />
            </template>
        </div>
    </div>
</template>
