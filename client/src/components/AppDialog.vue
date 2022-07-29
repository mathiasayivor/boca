<script setup>
import { ref, watch } from 'vue';

const props = defineProps({
    modelValue: Boolean,
    timeout: {
        type: Number,
        default: 0,
    },
    animation: {
        type: String,
        default: 'zoomIn'
    }
});

const emit = defineEmits(['close', 'show', 'update:modelValue']);

const interval = ref(null);

function close() {
    emit('update:modelValue', false);
    emit('close');

    if (interval.value !== null) {
        clearTimeout(interval.value);
    }
}

watch(
    () => props.modelValue,
    (show) => {
        if (show) {
            emit('show');
            if (props.timeout > 0) {
                interval.value = setTimeout(() => {
                    close();
                }, props.timeout);
            }
        } else {
            emit('close');
        }
    },
    {
        immediate: true,
    }
);
</script>
<template>
    <div
        v-if="$props.modelValue"
        :class="[
            'dialog-box',
            'animate__animated',
            'animate__' + $props.animation,
            'animate__faster',
        ]"
    >
        <slot></slot>
    </div>
</template>
