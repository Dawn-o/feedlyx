<script setup lang="ts">
import { onMounted } from "vue";
import { useRouter } from "vue-router";
import { useInfiniteScroll } from "@vueuse/core";
import { useFeedStore } from "@/stores/feedStore";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import Header from "@/components/Header.vue";
import SkeletonCard from "@/components/SkeletonCard.vue";

import { RotateCw, Heart, MessageCircle, Clock } from "lucide-vue-next";

const feedStore = useFeedStore();
const router = useRouter();

useInfiniteScroll(window, () => feedStore.loadMore(), {
    distance: 1500,
    canLoadMore: () => feedStore.hasMore,
});

onMounted(() => {
    feedStore.fetchArticles(1, false);
});

const handleSearch = (event: Event) => {
    const target = event.target as HTMLInputElement;
    feedStore.setSearchQuery(target.value);
};

const goToArticle = (article: any) => {
    router.push(`/${article.username}/${article.slug}`);
};
</script>

<template>
    <div class="container">
        <Header />

        <div class="flex gap-4 mb-6">
            <Input
                placeholder="Search articles..."
                @input="handleSearch"
                class="flex-1"
            />
            <Button
                @click="feedStore.fetchArticles(1, false)"
                :disabled="feedStore.loading"
                aria-label="Refresh articles"
            >
                <RotateCw
                    class="h-4 w-4"
                    :class="{ 'animate-spin': feedStore.loading }"
                />
            </Button>
        </div>

        <div class="grid gap-6">
            <Card
                v-for="article in feedStore.filteredArticles"
                :key="article.id"
                class="cursor-pointer hover:shadow-md transition-shadow flex flex-col"
                @click="goToArticle(article)"
            >
                <CardHeader class="flex items-start gap-3">
                    <Avatar class="h-8 w-8">
                        <AvatarImage
                            :src="article.profileImage ?? ''"
                            :alt="article.author"
                            loading="lazy"
                        />
                        <AvatarFallback>{{
                            article.author.charAt(0).toUpperCase()
                        }}</AvatarFallback>
                    </Avatar>
                    <div class="flex-1">
                        <div class="flex flex-col text-sm mb-1">
                            <span class="font-medium">{{
                                article.author
                            }}</span>
                            <span class="text-muted-foreground">{{
                                new Date(
                                    article.publishedAt,
                                ).toLocaleDateString("en-US", {
                                    month: "short",
                                    day: "numeric",
                                })
                            }}</span>
                        </div>
                    </div>
                </CardHeader>
                <CardContent class="flex-1 min-h-[50px]">
                    <CardTitle class="text-lg">{{ article.title }}</CardTitle>
                </CardContent>
                <CardFooter>
                    <div
                        class="flex flex-col text-sm text-muted-foreground w-full"
                    >
                        <div class="flex justify-between items-center mb-4">
                            <div class="flex gap-2 flex-wrap">
                                <Badge
                                    v-for="tag in article.tags.slice(0, 3)"
                                    :key="tag"
                                    variant="outline"
                                    >#{{ tag }}</Badge
                                >
                            </div>
                        </div>
                        <div class="flex justify-between">
                            <div class="flex items-center gap-4">
                                <div class="flex items-center gap-1">
                                    <Heart class="h-3 w-3" />
                                    <span>{{
                                        article.reactionsCount || 0
                                    }}</span>
                                </div>
                                <div class="flex items-center gap-1">
                                    <MessageCircle class="h-3 w-3" />
                                    <span>{{
                                        article.commentsCount || 0
                                    }}</span>
                                </div>
                            </div>
                            <div class="flex items-center gap-1">
                                <Clock class="h-3 w-3" />
                                <span
                                    >{{ article.readingTime || 0 }} min
                                    read</span
                                >
                            </div>
                        </div>
                    </div>
                </CardFooter>
            </Card>
        </div>

        <div
            v-if="feedStore.loading && feedStore.hasMore"
            class="grid gap-6 mt-6"
        >
            <SkeletonCard v-for="n in 4" :key="'skeleton-' + n" />
        </div>
    </div>
</template>
