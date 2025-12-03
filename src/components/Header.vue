<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { RouterLink } from "vue-router";
import { Input } from "@/components/ui/input";
import ModeToggle from "@/components/ModeToggle.vue";

const router = useRouter();
const searchValue = ref("");

const handleSearch = () => {
    if (searchValue.value.trim()) {
        router.push(
            `/search?q=${encodeURIComponent(searchValue.value.trim())}`,
        );
    }
};
</script>

<template>
    <header class="flex justify-between items-center mb-8">
        <div class="flex items-center gap-4">
            <RouterLink to="/">
                <h1
                    class="text-3xl font-extrabold font-open-sans uppercase cursor-pointer select-none"
                >
                    Feedlyx
                </h1>
            </RouterLink>
            <Input
                v-model="searchValue"
                placeholder="Search..."
                @keydown.enter="handleSearch"
                class="w-64 lg:w-xl"
            />
        </div>
        <ModeToggle />
    </header>
</template>
