<script setup lang="ts">
import { Button } from "@/components/ui/button";

const props = defineProps<{
    searchQuery: string;
    currentTab: string;
    currentFilter: string;
    tabs: string[];
    filterOptions: { label: string; value: string }[];
}>();

const emit = defineEmits<{
    "tab-change": [tab: string];
    "filter-change": [filter: string];
}>();

const setTab = (tab: string) => {
    emit("tab-change", tab);
};

const setFilter = (filter: string) => {
    emit("filter-change", filter);
};
</script>

<template>
    <div class="mb-6">
        <h1 class="text-2xl font-bold mb-4">
            Search results for "{{ searchQuery }}"
        </h1>
        <div
            class="flex flex-col flex-wrap gap-2 md:flex-row justify-between items-start md:items-center mb-6"
        >
            <div class="flex gap-2">
                <Button
                    v-for="tab in props.tabs"
                    :key="tab"
                    :variant="currentTab === tab ? 'default' : 'outline'"
                    @click="setTab(tab)"
                >
                    {{ tab }}
                </Button>
            </div>

            <div class="flex gap-2">
                <Button
                    v-for="filter in props.filterOptions"
                    :key="filter.label"
                    :variant="
                        currentFilter === filter.label ? 'default' : 'outline'
                    "
                    @click="setFilter(filter.label)"
                >
                    {{ filter.label }}
                </Button>
            </div>
        </div>
    </div>
</template>
