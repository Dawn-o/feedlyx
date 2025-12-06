<script setup lang="ts">
import { useRouter } from "vue-router";

import { Badge } from "@/components/ui/badge";
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
} from "@/components/ui/pagination";

const props = defineProps<{
    page: number;
    hasMore: boolean;
    tag: string;
}>();

const router = useRouter();

const goToPage = (newPage: number) => {
    if (newPage === 1) {
        router.push(`/t/${props.tag}`);
    } else {
        router.push(`/t/${props.tag}/page/${newPage}`);
    }
};
</script>

<template>
    <h4 class="text-center font-medium mb-2">
        Older
        <Badge variant="secondary" class="text-sm">#{{ tag }}</Badge> posts
    </h4>
    <Pagination
        v-slot="{ page }"
        :items-per-page="16"
        :total="10000"
        :default-page="props.page"
        @update:page="goToPage"
    >
        <PaginationContent v-slot="{ items }">
            <template v-for="(item, index) in items" :key="index">
                <PaginationItem
                    v-if="item.type === 'page'"
                    :value="item.value"
                    :is-active="item.value === page"
                >
                    {{ item.value }}
                </PaginationItem>
                <PaginationEllipsis
                    v-else-if="item.type === 'ellipsis'"
                    :index="index"
                />
            </template>
        </PaginationContent>
    </Pagination>
</template>
