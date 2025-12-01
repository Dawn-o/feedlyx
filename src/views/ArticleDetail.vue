<script setup lang="ts">
import { onMounted, ref, computed, nextTick, watch } from "vue";
import { useRoute } from "vue-router";
import hljs from "highlight.js";
import "highlight.js/styles/base16/twilight.css";
import { useFeedStore, type FullArticle } from "@/stores/feedStore";
import { processArticleHtml } from "@/utils/processArticleHtml";
import ArticleHeader from "@/components/ArticleHeader.vue";
import SkeletonArticle from "@/components/SkeletonArticle.vue";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Heart, MessageCircle, Clock } from "lucide-vue-next";

const route = useRoute();
const feedStore = useFeedStore();
const article = ref<FullArticle | null>(null);
const loading = ref(true);
const error = ref<string | null>(null);
const contentRef = ref<HTMLElement>();

const processedBodyHtml = computed(() => {
    if (!article.value) return "";
    return processArticleHtml(article.value.body_html);
});

const fetchUserArticles = async (username: string, slug: string) => {
    try {
        const response = await fetch(
            `https://dev.to/api/articles?username=${username}&per_page=30`,
        );
        if (!response.ok) throw new Error("Failed to fetch user articles");
        const data = await response.json();
        const found = data.find((item: any) => item.slug === slug);
        if (found) {
            const fullArticle = await feedStore.fetchArticleDetail(found.id);
            if (fullArticle) {
                article.value = fullArticle;
            } else {
                error.value = "Article not found.";
            }
        } else {
            error.value = "Article not found.";
        }
        loading.value = false;
    } catch (err) {
        error.value = err instanceof Error ? err.message : "An error occurred";
        loading.value = false;
    }
};

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
    const id = feedStore.fullSlugToId.get(key);
    if (id) {
        const fullArticle = await feedStore.fetchArticleDetail(id);
        if (fullArticle) {
            article.value = fullArticle;
        } else {
            error.value = "Article not found.";
        }
        loading.value = false;
    } else {
        fetchUserArticles(username, slug);
    }
});
</script>

<template>
    <div class="container">
        <ArticleHeader />

        <div v-if="error" class="text-destructive">{{ error }}</div>
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
    </div>
</template>
