<template>
    <div class="grid grid-cols-1 md:grid-cols-7 lg:grid-cols-10 gap-6">
        <div class="hidden md:col-span-2 md:block">
            <slot name="left" />
        </div>
        <div class="col-span-1 md:col-span-5 lg:col-span-5">
            <slot name="main" />
        </div>
        <div class="hidden lg:col-span-3 lg:block">
            <slot name="right" />
        </div>
    </div>
</template>
