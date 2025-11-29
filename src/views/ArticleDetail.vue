<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import { marked } from "marked";
import { useFeedStore } from "@/stores/feedStore";
import ArticleHeader from "@/components/ArticleHeader.vue";
import SkeletonArticle from "@/components/SkeletonArticle.vue";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Heart, MessageCircle, Clock } from "lucide-vue-next";

interface FullArticle {
    id: number;
    title: string;
    body_markdown: string;
    published_at: string;
    user: {
        name: string;
        profile_image_90: string;
    };
    tags: string[];
    positive_reactions_count: number;
    comments_count: number;
    reading_time_minutes: number;
    url: string;
}

const route = useRoute();
const feedStore = useFeedStore();
const article = ref<FullArticle | null>(null);
const loading = ref(true);
const error = ref<string | null>(null);

const fetchArticle = async (id: string) => {
    try {
        const response = await fetch(`https://dev.to/api/articles/${id}`);
        if (!response.ok) throw new Error("Failed to fetch article");
        article.value = await response.json();
    } catch (err) {
        error.value = err instanceof Error ? err.message : "An error occurred";
    } finally {
        loading.value = false;
    }
};

const fetchUserArticles = async (username: string, slug: string) => {
    try {
        const response = await fetch(
            `https://dev.to/api/articles?username=${username}&per_page=1000`,
        );
        if (!response.ok) throw new Error("Failed to fetch user articles");
        const data = await response.json();
        const found = data.find((item: any) => item.slug === slug);
        if (found) {
            fetchArticle(found.id.toString());
        } else {
            error.value = "Article not found.";
            loading.value = false;
        }
    } catch (err) {
        error.value = err instanceof Error ? err.message : "An error occurred";
        loading.value = false;
    }
};

onMounted(() => {
    const username = route.params.username as string;
    const slug = route.params.slug as string;
    const key = `${username}-${slug}`;
    const id = feedStore.fullSlugToId.get(key);
    if (id) {
        fetchArticle(id.toString());
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
                                {{
                                    new Date(
                                        article.published_at,
                                    ).toLocaleDateString()
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
                        v-html="marked(article.body_markdown)"
                        class="prose prose-sm max-w-none"
                    ></div>
                    <div class="mt-6 pt-6 border-t">
                        <a
                            :href="article.url"
                            target="_blank"
                            class="text-primary hover:underline"
                        >
                            Read on Dev.to →
                        </a>
                    </div>
                </CardContent>
            </Card>
        </div>
    </div>
</template>
