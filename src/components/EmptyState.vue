<script setup lang="ts">
import {
    Empty,
    EmptyDescription,
    EmptyHeader,
    EmptyTitle,
} from "@/components/ui/empty";

defineProps<{
    title: string;
    description: string;
}>();
</script>

<template>
    <Empty>
        <EmptyHeader>
            <EmptyTitle>{{ title }}</EmptyTitle>
            <EmptyDescription>
                {{ description }}
            </EmptyDescription>
        </EmptyHeader>
    </Empty>
</template>
