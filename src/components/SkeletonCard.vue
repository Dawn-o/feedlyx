<script setup>
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
</script>

<template>
    <Card class="flex flex-col">
        <CardHeader class="flex items-start gap-3">
            <Skeleton class="h-8 w-8 rounded-full" />
            <div class="flex-1">
                <Skeleton class="h-4 w-20 mb-1" />
                <Skeleton class="h-3 w-16" />
            </div>
        </CardHeader>
        <CardContent class="flex-1 min-h-[50px]">
            <Skeleton class="h-5 w-full mb-2" />
            <Skeleton class="h-5 w-3/4" />
        </CardContent>
        <CardFooter>
            <div class="flex flex-col w-full">
                <div class="flex justify-between items-center mb-4">
                    <div class="flex gap-2">
                        <Skeleton class="h-4 w-8" />
                        <Skeleton class="h-4 w-10" />
                        <Skeleton class="h-4 w-12" />
                    </div>
                </div>
                <div class="flex justify-between">
                    <div class="flex gap-4">
                        <Skeleton class="h-3 w-6" />
                        <Skeleton class="h-3 w-8" />
                    </div>
                    <Skeleton class="h-3 w-16" />
                </div>
            </div>
        </CardFooter>
    </Card>
</template>
