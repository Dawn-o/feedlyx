<script setup>
import { RouterLink } from "vue-router";
import ModeToggle from "@/components/ModeToggle.vue";
</script>

<template>
    <header class="flex justify-between items-center mb-8">
        <RouterLink to="/">
            <h1
                class="text-3xl font-extrabold font-open-sans uppercase cursor-pointer select-none"
            >
                Feedlyx
            </h1>
        </RouterLink>
        <ModeToggle />
    </header>
</template>
