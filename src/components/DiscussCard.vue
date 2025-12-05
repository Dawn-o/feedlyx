<script setup lang="ts">
import { useRouter } from "vue-router";
import { useArticlesStore } from "@/stores/articlesStore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { MessageCircle } from "lucide-vue-next";

const articlesStore = useArticlesStore();
const router = useRouter();

const goToArticle = (article: any) => {
    router.push(`/${article.username}/${article.slug}`);
};
</script>

<template>
    <Card>
        <CardHeader>
            <CardTitle class="text-xl">#discuss</CardTitle>
            <p class="text-sm text-muted-foreground">
                Discussion threads targeting the whole community
            </p>
            <Separator class="mt-4" />
        </CardHeader>
        <CardContent class="space-y-4">
            <template v-if="articlesStore.discussArticles.length > 0">
                <div
                    v-for="(article, index) in articlesStore.discussArticles"
                    :key="article.id"
                >
                    <div
                        class="flex justify-between items-start cursor-pointer"
                        @click="goToArticle(article)"
                    >
                        <div class="flex flex-col">
                            <h3 class="text-base leading-tight">
                                {{ article.title }}
                            </h3>
                            <div
                                class="flex items-center gap-1 text-sm text-muted-foreground w-full mt-2"
                            >
                                <MessageCircle class="h-3 w-3" />
                                <span>{{ article.commentsCount || 0 }}</span>
                            </div>
                        </div>
                    </div>
                    <Separator
                        v-if="index < articlesStore.discussArticles.length - 1"
                        class="mt-4"
                    />
                </div>
            </template>
            <template v-else>
                <div
                    v-for="n in 5"
                    :key="'skeleton-discuss-' + n"
                    class="space-y-2"
                >
                    <Skeleton class="h-4 w-full" />
                    <Skeleton class="h-3 w-1/2" />
                    <Separator v-if="n < 5" class="mt-4" />
                </div>
            </template>
        </CardContent>
    </Card>
</template>
