<script setup>
import AppDialog from './AppDialog.vue';

defineProps({
    message: String,
    close: {
        type: Boolean,
        default: true,
    },
    modelValue: Boolean,
    timeout: {
        type: Number,
        default: 5000,
    },
    animation: {
        type: String,
        default: 'zoomIn',
    },
    titleText: {
        type: String,
        default: '',
    },
    cancel: {
        type: [Boolean, String],
        default: false,
    },
    ok: {
        type: String,
        default: 'Ok',
    },
    html: {
        type: Boolean,
        default: false,
    },
});

const emit = defineEmits(['close', 'show', 'update:modelValue']);
function close(ok) {
    emit('close', ok);
    emit('update:modelValue', false);
}
</script>
<template>
    <div
        v-if="$props.modelValue"
        class="w-screen h-screen flex justify-center items-center animate-fade-in"
    >
        <AppDialog
            v-bind="{ ...$props, ...$attrs }"
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
                'bg-white',
                'flex',
                'flex-col',
                'gap-2',
                'fast-dialog',
            ]"
            overlay
        >
            <div class="flex justify-end items-center py-2">
                <div v-if="$props.titleText" class="w-[100%] text-xl">
                    {{ $props.titleText }}
                </div>
                <button
                    @click="close(false)"
                    class="flex items-center"
                    v-if="$props.close"
                >
                    <span class="material-symbols-outlined">close</span>
                </button>
            </div>
            <div class="min-h-[50px]">
                <div
                    v-if="$props.html"
                    class="h-[100%] flex items-center col-span-11 text-left"
                    v-html="$props.message"
                ></div>
                <div
                    v-else
                    class="h-[100%] flex items-center col-span-11 text-left"
                >
                    {{ $props.message }}
                </div>
            </div>
            <div class="flex justify-end items-center gap-2">
                <button
                    @click="close(false)"
                    class="btn text-primary py-0 px-2"
                    v-if="$props.cancel"
                >
                    {{
                        typeof $props.cancel == 'string'
                            ? $props.cancel
                            : 'Cancel'
                    }}
                </button>
                <button @click="close(true)" class="btn text-primary py-0 px-2">
                    {{ $props.ok }}
                </button>
            </div>
        </AppDialog>
    </div>
</template>
