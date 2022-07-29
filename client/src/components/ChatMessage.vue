<script setup>
import { computed } from 'vue';

const props = defineProps({
    message: {
        type: String,
        required: true,
    },
    to: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        default: 'waiting',
    },
    addedAt: {
        type: Date,
        default: new Date(),
    },
});

const emit = defineEmits(['resend']);

const icon = computed(() => {
    switch (props.status) {
        case 'error':
            return 'error';

        case 'sent':
            return 'done';

        default:
            return 'schedule';
    }
});

function handleResend() {
    if (icon.value != 'error') {
        return;
    }

    emit('resend');
}
</script>
<template>
    <div :class="['flex', { 'justify-end': props.to == 'me' }, 'w-[100%]']">
        <div
            :class="[
                'chat-message',
                icon == 'error' ? 'bg-red-700' : 'bg-white',
                icon == 'error' ? 'text-gray-300' : 'text-primary',
                'min-w-[50px]',
                'max-w-[80%]',
                'flex',
                'flex-col',
                'justify-end',
                'rounded',
                'p-2',
                'hyphens-auto',
                'break-all',
                'animate__animated',
                'animate__zoomIn',
                'animate__faster',
                {'hover:cursor-pointer': icon == 'error'},
            ]"
            :title="
                icon != 'error' ? undefined : 'Send Failed, Click to Resend'
            "
            @click="handleResend"
        >
            <span class="hover:cursor-text">
                {{ props.message }}
            </span>
            <div class="text-right">
                <span
                    :class="['material-symbols-outlined', 'text-[20px]']"
                    :title="icon == 'done' ? 'sent' : icon"
                >
                    {{ icon }}
                </span>
                <span
                    class="material-symbols-outlined text-[20px]"
                    :title="`Sent on ${props.addedAt.getDate()}, ${props.addedAt.getMonth()} ${props.addedAt.getFullYear()} @ ${props.addedAt.getHours()}:${props.addedAt.getMinutes()}`"
                >
                    history
                </span>
            </div>
        </div>
    </div>
</template>
