<script setup>
import AppDialog from './AppDialog.vue';

defineProps({
    message: String,
    close: Boolean,
    modelValue: Boolean,
    timeout: {
        type: Number,
        default: 5000,
    },
    animation: {
        type: String,
        default: 'zoom',
    },
});

const emit = defineEmits(['close', 'show', 'update:modelValue']);
</script>
<template>
    <AppDialog
        v-bind="$props"
        @update:model-value="(value) => $emit('update:modelValue', value)"
        @show="emit('show')"
        @close="emit('close')"
        :class="[
            'shadow-md',
            'py-3',
            'px-4',
            'rounded',
            'max-w-[500px]',
            'w-[100%]',
            'text-center',
            'bg-primary',
            'grid',
            'grid-cols-12',
        ]"
    >
        <div class="h-[100%] flex items-center col-span-11 text-left">
            {{ $props.message }}
        </div>
        <div class="h-[100%] col-span-1 flex justify-end items-center">
            <button
                @click="emit('update:modelValue', false)"
                class="flex items-center"
            >
                <span class="material-symbols-outlined">close</span>
            </button>
        </div>
    </AppDialog>
</template>
