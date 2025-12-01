<script setup>
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
</script>

<template>
    <Card>
        <CardHeader>
            <div class="flex items-start gap-3 mb-4">
                <Skeleton class="h-10 w-10 rounded-full" />
                <div>
                    <Skeleton class="h-4 w-24 mb-1" />
                    <Skeleton class="h-3 w-20" />
                </div>
            </div>
            <Skeleton class="h-8 w-full mb-2" />
            <Skeleton class="h-8 w-4/5" />
            <div class="flex gap-2 flex-wrap mt-2">
                <Skeleton class="h-5 w-12" />
                <Skeleton class="h-5 w-14" />
                <Skeleton class="h-5 w-10" />
            </div>
            <div class="flex gap-4 mt-4">
                <div class="flex items-center gap-1">
                    <Skeleton class="h-4 w-4" />
                    <Skeleton class="h-4 w-6" />
                </div>
                <div class="flex items-center gap-1">
                    <Skeleton class="h-4 w-4" />
                    <Skeleton class="h-4 w-8" />
                </div>
                <div class="flex items-center gap-1">
                    <Skeleton class="h-4 w-4" />
                    <Skeleton class="h-4 w-10" />
                </div>
            </div>
        </CardHeader>
        <CardContent>
            <div v-for="n in 7" :key="n" :class="n < 7 ? 'mb-3' : ''">
                <Skeleton
                    :class="`h-4 w-${['full', 'full', '5/6', 'full', '4/5', 'full', '3/4'][n - 1]}`"
                />
            </div>
        </CardContent>
    </Card>
</template>
