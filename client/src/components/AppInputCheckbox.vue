<script setup>
const props = defineProps({
    label: {
        type: String,
        default: '',
    },
    labelPosition: {
        type: String,
        default: 'end',
    },
    modelValue: {
        type: Boolean,
        default: false,
    },
    disabled: {
        type: Boolean,
        default: false,
    },
});

const emit = defineEmits(['update:modelValue']);
function toggleStatus() {
    if (props.disabled) {
        return;
    }

    emit('update:modelValue', !props.modelValue);
}
</script>
<template>
    <div :class="['inline-flex', 'items-center', 'gap-2', 'justify-center']">
        <div
            :class="[
                'w-[50px]',
                'h-[25px]',
                'flex',
                'flex-wrap',
                'items-center',
                $props.disabled ? 'cursor-not-allowed' : 'cursor-pointer',
                'relative',
                $props.modelValue ? 'bg-green-700/50' : 'bg-gray-200',
                'rounded-full',
                'transition-all',
            ]"
            @click="toggleStatus"
        >
            <div
                :class="[
                    'w-[25px]',
                    'h-[100%]',
                    'absolute',
                    'transform',
                    'rounded-full',
                    $props.modelValue && !$props.disabled
                        ? 'bg-green-700'
                        : 'bg-gray-500',
                    { 'translate-x-full': $props.modelValue },
                    'transition-transform',
                ]"
            ></div>
        </div>
        <span
            :class="[
                { 'order-first': $props.labelPosition == 'sart' },
                'text-sm',
                'font-medium',
                'text-gray-900',
                'dark:text-gray-300',
            ]"
        >
            {{ label }}
        </span>
    </div>
</template>
