<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useChatStore } from '@/store/chat';
import api from '@/service/api';
import { useNotification } from '@/service/notification';

const router = useRouter();
const state = useChatStore();
const email = ref('');
const loggingIn = ref(false);
const notification = useNotification();
const emailInput = ref(null);

async function handleLogin() {
    if (!email.value.length) {
        const input = emailInput.value
        if (input instanceof HTMLInputElement) {
            input.focus()
        }

        return;
    }
    
    try {
        loggingIn.value = true;
        const response = await api.post('/login', {
            email: email.value,
        });

        const { loginId, userId } = response.data;
        // Essential so we don't have cached chats from previous user displayed to current user
        // in situations where logout was not done properly (i.e User manipulating localStorage)
        state.logout();
        state.loginId = loginId;
        state.userId = userId;

        await router.push({ name: 'index' });
        notification.create({
            message: 'Login successful!',
        });
    } catch (e) {
        notification.create({
            message: e?.response?.data
                ? e.response.data.message ?? 'Login failed'
                : 'An error occured whiles logging in. Check your internet connection and try again',
        });
    } finally {
        loggingIn.value = false;
    }
}
</script>

<template>
    <div
        id="wrapper"
        class="w-[100%] h-[100%] flex flex-col justify-center items-center"
    >
        <form
            @submit.prevent="handleLogin"
            class="w-[500px] max-w-[100%] flex gap-2 justify-center items-center"
        >
            <input
                type="email"
                placeholder="Enter your email address"
                class="input input-primary"
                v-model="email"
                ref="emailInput"
            />
            <button type="submit" :disabled="loggingIn" class="btn btn-primary">
                Login
                <span class="material-symbols-outlined">login</span>
            </button>
        </form>
    </div>
</template>
