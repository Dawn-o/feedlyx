<script setup lang="ts">
import type { Article } from "@/types";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Heart, MessageCircle, Clock } from "lucide-vue-next";

const props = defineProps<{
    article: Article;
}>();

const emit = defineEmits<{
    click: [article: Article];
}>();

const handleClick = () => {
    emit("click", props.article);
};
</script>

<template>
    <Card
        class="cursor-pointer hover:shadow-md transition-shadow flex flex-col"
        @click="handleClick"
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
                    <span class="font-medium">{{ article.author }}</span>
                    <span class="text-muted-foreground">{{
                        new Date(article.publishedAt).toLocaleDateString(
                            "en-US",
                            {
                                month: "short",
                                day: "numeric",
                            },
                        )
                    }}</span>
                </div>
            </div>
        </CardHeader>
        <CardContent class="flex-1 min-h-[50px]">
            <CardTitle class="text-lg">{{ article.title }}</CardTitle>
        </CardContent>
        <CardFooter>
            <div class="flex flex-col text-sm text-muted-foreground w-full">
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
                            <span>{{ article.reactionsCount || 0 }}</span>
                        </div>
                        <div class="flex items-center gap-1">
                            <MessageCircle class="h-3 w-3" />
                            <span>{{ article.commentsCount || 0 }}</span>
                        </div>
                    </div>
                    <div class="flex items-center gap-1">
                        <Clock class="h-3 w-3" />
                        <span>{{ article.readingTime || 0 }} min read</span>
                    </div>
                </div>
            </div>
        </CardFooter>
    </Card>
</template>
