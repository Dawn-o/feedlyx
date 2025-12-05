<script setup lang="ts">
import { useRouter } from "vue-router";
import { Button } from "@/components/ui/button";

defineProps<{
    currentPage: "home" | "latest" | "top";
}>();

const router = useRouter();

const navItems = [
    { key: "home", label: "Relevant", path: "/" },
    { key: "latest", label: "Latest", path: "/latest" },
    { key: "top", label: "Top", path: "/top" },
];
</script>

<template>
    <div class="flex gap-2 mb-4">
        <Button
            v-for="item in navItems"
            :key="item.key"
            :variant="currentPage === item.key ? 'default' : 'ghost'"
            @click="router.push(item.path)"
        >
            {{ item.label }}
        </Button>
    </div>
</template>
