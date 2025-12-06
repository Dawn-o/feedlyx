<script setup lang="ts">
import { useRoute, useRouter } from "vue-router";
import { useArticlesStore } from "@/stores/articlesStore";
import { useArticleDetailStore } from "@/stores/articleDetailStore";
import type { FullArticle } from "@/types";
import { ref, computed, nextTick, watch, onMounted } from "vue";
import { processArticleHtml } from "@/utils/processArticleHtml";
import hljs from "highlight.js";
import "highlight.js/styles/base16/twilight.css";

import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-vue-next";
import SkeletonArticle from "@/components/SkeletonArticle.vue";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Heart, MessageCircle, Clock } from "lucide-vue-next";
import EmptyState from "@/components/EmptyState.vue";

const route = useRoute();
const router = useRouter();
const articlesStore = useArticlesStore();
const articleDetailStore = useArticleDetailStore();
const article = ref<FullArticle | null>(null);
const loading = ref(true);

const processedBodyHtml = computed(() => {
    if (!article.value) return "";
    return processArticleHtml(article.value.body_html);
});

watch(article, async () => {
    if (article.value) {
        await nextTick();
        hljs.highlightAll();
    }
});

onMounted(async () => {
    const username = route.params.username as string;
    const slug = route.params.slug as string;
    const key = `${username}-${slug}`;
    const id = articlesStore.fullSlugToId.get(key);
    if (id) {
        const fullArticle = await articleDetailStore.fetchArticleDetail(id);
        if (fullArticle) {
            article.value = fullArticle;
        }
        loading.value = false;
    } else {
        const fullArticle = await articleDetailStore.fetchArticleByUsernameSlug(
            username,
            slug,
        );
        if (fullArticle) {
            article.value = fullArticle;
        }
        loading.value = false;
    }
});
</script>

<template>
    <header class="flex justify-between items-center mb-6">
        <Button variant="ghost" @click="router.push('/')">
            <ArrowLeft class="h-4 w-4 mr-2" />
            Back to Feed
        </Button>
        <ModeToggle />
    </header>

    <SkeletonArticle v-if="loading" />
    <div v-else-if="article">
        <Card>
            <CardHeader>
                <div class="flex items-start gap-3 mb-4">
                    <Avatar class="h-10 w-10">
                        <AvatarImage
                            :src="article.user.profile_image_90"
                            :alt="article.user.name"
                        />
                        <AvatarFallback>{{
                            article.user.name.charAt(0).toUpperCase()
                        }}</AvatarFallback>
                    </Avatar>
                    <div>
                        <p class="font-medium">{{ article.user.name }}</p>
                        <p class="text-sm text-muted-foreground">
                            Posted on
                            {{
                                (() => {
                                    const currentYear =
                                        new Date().getFullYear();
                                    const articleDate = new Date(
                                        article.published_at,
                                    );
                                    const articleYear =
                                        articleDate.getFullYear();
                                    if (currentYear === articleYear) {
                                        return articleDate.toLocaleDateString(
                                            "en-US",
                                            {
                                                month: "long",
                                                day: "numeric",
                                            },
                                        );
                                    } else {
                                        return articleDate.toLocaleDateString(
                                            "en-US",
                                            {
                                                month: "long",
                                                day: "numeric",
                                                year: "numeric",
                                            },
                                        );
                                    }
                                })()
                            }}
                        </p>
                    </div>
                </div>
                <CardTitle class="text-2xl">{{ article.title }}</CardTitle>
                <div class="flex gap-2 flex-wrap mt-2">
                    <Badge
                        v-for="tag in article.tags"
                        :key="tag"
                        variant="outline"
                        >#{{ tag }}</Badge
                    >
                </div>
                <div class="flex gap-4 mt-4 text-sm text-muted-foreground">
                    <div class="flex items-center gap-1">
                        <Heart class="h-4 w-4" />
                        {{ article.positive_reactions_count }}
                    </div>
                    <div class="flex items-center gap-1">
                        <MessageCircle class="h-4 w-4" />
                        {{ article.comments_count }}
                    </div>
                    <div class="flex items-center gap-1">
                        <Clock class="h-4 w-4" />
                        {{ article.reading_time_minutes }} min read
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <div
                    ref="contentRef"
                    v-html="processedBodyHtml"
                    class="prose max-w-none article-content"
                ></div>
            </CardContent>
        </Card>
    </div>
    <EmptyState
        v-else
        :title="'No Results Found'"
        :description="'No articles were found matching your search.'"
    />
</template>
