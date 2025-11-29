<script setup>
import { useRouter } from "vue-router";
import ModeToggle from "@/components/ModeToggle.vue";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-vue-next";

const router = useRouter();

const goBack = () => {
    router.push("/");
};
</script>

<template>
    <header class="flex justify-between items-center mb-8">
        <Button variant="ghost" @click="goBack">
            <ArrowLeft class="h-4 w-4 mr-2" />
            Back to Feed
        </Button>
        <ModeToggle />
    </header>
</template>
