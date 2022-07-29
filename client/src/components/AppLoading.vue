<script setup>
const props = defineProps({
    color: {
        type: String,
        default: 'primary',
    },
    size: {
        type: String,
        default: 'md',
    },
});
</script>
<template>
    <div
        :class="[
            $props.color == 'primary' ? 'bg-primary' : 'bg-white',
            'loader',
            'animate__animated',
            'animate__bounceOut',
            'animate__infinite',
            'rounded-full',
            'inline-block',
            { 'w-5 h-5': $props.size == 'sm' },
            { 'w-6 h-6': $props.size == 'md' },
            { 'w-7 h-7': $props.size == 'lg' },
        ]"
    ></div>
</template>
