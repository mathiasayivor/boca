<script setup>
import { ref } from 'vue';
import AppDialog from './AppDialog.vue';

const props = defineProps({
    close: {
        type: Boolean,
        default: true,
    },
    modelValue: Boolean,
    animation: {
        type: String,
        default: 'zoomIn',
    },
    titleText: {
        type: String,
        default: '',
    },
    footer: {
        type: Boolean,
        default: true,
    },
    width: {
        type: String,
        default: '600px',
    },
    persistent: {
        type: Boolean,
        default: false,
    },
});

const emit = defineEmits(['close', 'show', 'update:modelValue']);
const closingRefused = ref(false);
const modalBackdrop = ref(false);
function close() {
    emit('close');
    emit('update:modelValue', false);
}
function softClose(e) {
    if (props.persistent) {
        closingRefused.value = true;
        setTimeout(() => {
            closingRefused.value = false;
        }, 1500);
        return;
    }

    if (e.target !== modalBackdrop.value) {
        return;
    }

    close();
}
</script>
<template>
    <Teleport to="body">
        <div
            @click="softClose"
            ref="modalBackdrop"
            v-if="$props.modelValue"
            class="bg-dark-900/50 bg-blend-difference animate-fade-in w-screen h-screen fixed top-0 left-0 flex justify-center items-center"
        >
            <AppDialog
                :model-value="$props.modelValue"
                @show="emit('show')"
                @close="emit('close')"
                class="fast-dialog"
            >
                <div
                    class="shadow bg-white max-w-[100%] py-3 px-4 rounded"
                    :style="`width: ${$props.width}`"
                >
                    <slot name="header">
                        <div
                            v-if="$props.titleText || $props.close"
                            class="flex justify-end items-center py-2"
                        >
                            <div
                                v-if="$props.titleText"
                                class="w-[100%] text-xl"
                            >
                                {{ $props.titleText }}
                            </div>
                            <button
                                @click="close()"
                                class="flex items-center"
                                v-if="$props.close"
                            >
                                <span class="material-symbols-outlined"
                                    >close</span
                                >
                            </button>
                        </div>
                    </slot>
                    <slot></slot>
                    <slot name="footer">
                        <div
                            v-if="$props.footer && $props.close"
                            class="flex justify-end items-center gap-2"
                        >
                            <button
                                @click="close()"
                                class="btn text-primary py-0 px-2"
                            >
                                Close
                            </button>
                        </div>
                    </slot>
                </div>
            </AppDialog>
        </div>
    </Teleport>
</template>
