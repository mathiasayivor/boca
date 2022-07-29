<script setup>
import { computed } from 'vue';
import { notifications } from '@/service/notification';
import DialogNotification from './DialogNotification.vue';
import { camelCase } from 'lodash';
import { getAnimationForPosition } from '@/utils';

const stacks = computed(() => {
    const _stacks = {
        top: {
            styles: ['top-2', 'left-[50%]', 'translate-x-[-50%]'],
            items: [],
        },
        center: {
            styles: [
                'top-[50%]',
                'left-[50%]',
                'translate-x-[-50%]',
                'translate-y-[-50%]',
            ],
            items: [],
        },
        bottom: {
            styles: ['bottom-2', 'left-[50%]', 'translate-x-[-50%]'],
            items: [],
        },
        left: {
            styles: ['top-[50%]', 'left-2', 'translate-y-[-50%]'],
            items: [],
        },
        right: {
            styles: ['top-[50%]', 'right-2', 'translate-y-[-50%]'],
            items: [],
        },
        topLeft: {
            styles: ['top-2', 'left-2'],
            items: [],
        },
        topRight: {
            styles: ['top-2', 'right-2'],
            items: [],
        },
        bottomLeft: {
            styles: ['bottom-2', 'left-2'],
            items: [],
        },
        bottomRight: {
            styles: ['bottom-2', 'right-2'],
            items: [],
        },
    };

    notifications.value.forEach((notification, index) => {
        if (!notification.model) {
            return;
        }

        const stackName = camelCase(notification.config.position);
        _stacks[stackName].items = [notification, ..._stacks[stackName].items];
    });

    return Object.values(_stacks);
});
</script>
<template>
    <Teleport to="body">
        <div
            v-for="stack in stacks"
            :class="[
                'max-w-[500px]',
                'w-[100%]',
                'flex',
                'flex-col',
                'gap-2',
                'fixed',
                'transform',
                'z-60',
                ...stack.styles,
            ]"
        >
            <DialogNotification
                v-for="notification in stack.items"
                :key="notification.id"
                :message="notification.config.message"
                :timeout="notification.config.timeout"
                v-model="notification.model"
                :animation="
                    getAnimationForPosition(
                        notification.config.animation,
                        notification.config.position
                    ).entrance
                "
                @close="notification.onClose()"
            />
        </div>
    </Teleport>
</template>
