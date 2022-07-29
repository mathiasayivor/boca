<script setup>
import { computed, onBeforeUnmount, ref, watch } from 'vue';
import { useChatApp } from '@/service/chat';
import { useChatStore } from '@/store/chat';
import { v4 as uuidv4 } from 'uuid';

import DialogModal from '@/components/DialogModal.vue';
import ChatMessage from '@/components/ChatMessage.vue';
import TheSideNav from '@/components/TheSideNav.vue';

const state = useChatStore();
const messagesContainer = ref(null);
const message = ref('');
/**
 * @typedef {{tmpId: string, content: string, addedAt: Date, status?: 'waiting' | 'sent' | 'error'}} ChatMessage
 *
 */
const _messages = ref({});
const messages = computed(() =>
    Object.values(_messages.value).map((message) => {
        const props = {
            status: 'sent',
            to: message.sender === state.userId ? 'me' : 'other',
        };

        return { ...props, ...message };
    })
);
const { start, stop, sendMessage } = useChatApp();
start();

async function doSend({ tmpId, content, addedAt, sender }, onSend) {
    _messages.value[tmpId] = {
        tmpId,
        content,
        addedAt,
        status: 'waiting',
        sender,
    };

    if (onSend instanceof Function) {
        onSend();
    }

    try {
        const { addedAt } = await sendMessage(message.value);
        // Message sent
        _messages.value[tmpId].status = 'sent';
        _messages.value[tmpId].addedAt = addedAt;
    } catch (e) {
        _messages.value[tmpId].status = 'error';
    }
}

async function handleSend() {
    if (!message.value) {
        return;
    }

    await doSend(
        {
            tmpId: uuidv4(),
            content: message.value,
            addedAt: new Date(),
            sender: state.userId,
        },
        () => {
            message.value = '';

            setTimeout(() => {
                const msgContainer = messagesContainer.value;
                if (msgContainer instanceof HTMLElement) {
                    msgContainer.scrollTop = msgContainer.scrollHeight;
                }
            });
        }
    );
}

async function handleResend(tmpId) {
    const message = _messages.value[tmpId];
    if (!message) {
        return;
    }

    await doSend({
        tmpId,
        content: message.content,
        addedAt: message.addedAt,
        sender: message.sender,
    });
}

watch(
    () => state.connected,
    () => {
        if (state.connected) {
            // sendMessage('hello');
        }
    }
);
onBeforeUnmount(() => {
    stop();
});
</script>
<template>
    <div class="w-[100%] h-[100%] grid grid-cols-12">
        <TheSideNav class="col-span-2" @logout="stop()" />
        <div
            id="content"
            class="h-[100%] max-h-[100%] overflow-auto col-span-10 bg-cover flex flex-col justify-between p-[25px] pb-0"
        >
            <div
                class="w-[100%] h-[calc(100%-60px)] overflow-auto scrollbar backdrop-filter backdrop-blur-md backdrop-brightness-200 text-white px-5 rounded-3xl flex flex-col gap-2"
                ref="messagesContainer"
            >
                <ChatMessage
                    v-for="message in messages"
                    :key="message.tmpId"
                    :status="message.status"
                    :message="message.content"
                    :to="message.to"
                    @resend="handleResend(message.tmpId)"
                />
            </div>
            <form
                @submit.prevent="handleSend"
                class="w-[100%] h-[50px] bg-white grid grid-cols-12 rounded-3xl pl-6 place-items-center"
            >
                <input
                    class="col-span-11 outline-none w-[100%]"
                    v-model="message"
                />
                <div class="col-span-1 flex justify-center items-center">
                    <button
                        type="submit"
                        class="p-0 outline-none w-auto flex justify-center items-center"
                        title="Send"
                    >
                        <span class="text-[40px] material-symbols-outlined">
                            send
                        </span>
                    </button>
                </div>
            </form>
        </div>
    </div>
</template>
<style scoped>
#content {
    background-image: url(@/assets/background.jpg);
}
</style>
