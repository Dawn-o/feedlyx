<script setup lang="ts">
import { onMounted, ref, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
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
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import Header from "@/components/Header.vue";
import SkeletonCard from "@/components/SkeletonCard.vue";

import { Heart, MessageCircle, Clock } from "lucide-vue-next";

const feedStore = useFeedStore();
const route = useRoute();
const router = useRouter();

const searchQuery = computed(() => (route.query.q as string) || "");
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
        feedStore.fetchArticles(1, false, searchQuery.value, state);
    } else {
        // Placeholder for other tabs
        console.log(`Search for ${currentTab.value} not implemented yet`);
    }
};

useInfiniteScroll(
    window,
    () => {
        if (currentTab.value === "Posts") {
            feedStore.loadMore(
                searchQuery.value,
                filterOptions.find((f) => f.label === currentFilter.value)
                    ?.value,
            );
        }
    },
    {
        distance: 1500,
        canLoadMore: () => feedStore.hasMore,
    },
);

onMounted(() => {
    fetchSearchResults();
});

const setTab = (tab: string) => {
    currentTab.value = tab;
    fetchSearchResults();
};

const setFilter = (filter: string) => {
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
            <h1 class="text-2xl font-bold mb-4">
                Search results for "{{ searchQuery }}"
            </h1>

            <div class="flex gap-2 mb-4">
                <Button
                    v-for="tab in tabs"
                    :key="tab"
                    :variant="currentTab === tab ? 'default' : 'outline'"
                    @click="setTab(tab)"
                >
                    {{ tab }}
                </Button>
            </div>

            <div class="flex gap-2 mb-4">
                <Button
                    v-for="filter in filterOptions"
                    :key="filter.label"
                    :variant="
                        currentFilter === filter.label ? 'default' : 'outline'
                    "
                    @click="setFilter(filter.label)"
                >
                    {{ filter.label }}
                </Button>
            </div>
        </div>

        <div v-if="currentTab === 'Posts'" class="grid gap-6">
            <Card
                v-for="article in feedStore.articles"
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

        <div v-else class="text-center py-8">
            <p class="text-muted-foreground">
                Search for {{ currentTab.toLowerCase() }} is not implemented
                yet.
            </p>
        </div>

        <div
            v-if="feedStore.loading && feedStore.hasMore"
            class="grid gap-6 mt-6"
        >
            <SkeletonCard v-for="n in 4" :key="'skeleton-' + n" />
        </div>
    </div>
</template>
