<script setup lang="ts">
import { useArticlesStore } from "@/stores/articlesStore";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

const articlesStore = useArticlesStore();
</script>

<template>
    <div>
        <h3 class="text-lg font-semibold mb-4">Popular Tags</h3>
        <div class="max-h-96 overflow-y-auto space-y-2">
            <template v-if="articlesStore.popularTags.length > 0">
                <Button
                    v-for="tag in articlesStore.popularTags"
                    :key="tag.id"
                    variant="ghost"
                    class="w-full justify-start"
                >
                    #{{ tag.name }}
                </Button>
            </template>
            <template v-else>
                <Skeleton
                    v-for="n in 5"
                    :key="'skeleton-tag-' + n"
                    class="h-10 w-full"
                />
            </template>
        </div>
    </div>
</template>
