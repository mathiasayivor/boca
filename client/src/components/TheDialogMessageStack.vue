<script setup>
import { computed } from 'vue';
import { dialogs } from '@/service/dialog';
import DialogMessage from './DialogMessage.vue';
import { getAnimationForPosition } from '@/utils';

const stack = computed(() => dialogs.value.filter((dialog) => dialog.model));
</script>
<template>
    <Teleport to="body">
        <div
            v-if="stack.length"
            :class="[
                'w-screen',
                'h-screen',
                'grid',
                'grid-cols-1',
                'grid-rows-1',
                'gap-2',
                'fixed',
                'transform',
                'top-[50%]',
                'left-[50%]',
                'translate-x-[-50%]',
                'translate-y-[-50%]',
                'bg-dark-900/50',
                'animate-fade-in',
                'z-50',
            ]"
        >
            <DialogMessage
                v-for="dialog in stack"
                :key="dialog.id"
                :title-text="dialog.config.title"
                :message="dialog.config.message"
                :timeout="dialog.config.timeout"
                :cancel="dialog.config.cancel"
                v-model="dialog.model"
                :html="dialog.config.html"
                :animation="
                    getAnimationForPosition(
                        dialog.config.animation,
                        dialog.config.position
                    ).entrance
                "
                class="col-span-full row-span-full"
                @close="(res) => dialog.onClose(res)"
            />
        </div>
    </Teleport>
</template>
