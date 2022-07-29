<script setup>
import { ref, watch } from 'vue';
import { useDialog } from '@/service/dialog';
import { useNotification } from '@/service/notification';
import { useChatStore } from '@/store/chat';
import { useRouter } from 'vue-router';
import DialogModal from './DialogModal.vue';
import AppInputCheckbox from './AppInputCheckbox.vue';
import AppLoading from './AppLoading.vue';
import { useChatApp } from '@/service/chat';

// TODO: load labels from chats in the store
const labels = [];
const emit = defineEmits(['logout']);
const state = useChatStore();
const router = useRouter();
const dialog = useDialog();
const notification = useNotification();
const pairingDialog = ref(false);
const settingsDialog = ref(false);
const actions = [
    {
        title: 'Settings',
        icon: 'settings',
        onClick() {
            settingsDialog.value = true;
        },
    },
    {
        title: 'Logout',
        icon: 'logout',
        async onClick() {
            const proceed = await dialog.create({
                title: 'Confirm Logout',
                message: 'Are you sure you want to Logout?',
                cancel: true,
            });

            if (proceed) {
                emit('logout');
                state.logout();
                await router.push({
                    name: 'login',
                });

                notification.create({
                    message: 'Logout successful!',
                });
            }
        },
    },
    {
        title: 'New Chat',
        icon: 'chat_add_on',
        onClick() {
            pairingDialog.value = true;
        },
    },
];
const { socket, setPairing } = useChatApp();
const pairingEnabled = ref(false);
async function togglePairing(enabled) {
    try {
        await setPairing(enabled);
        pairingDialog.value = false;
        const action = enabled ? 'enabled' : 'disabled';
        await notification.create({
            message: 'Pairing was ' + action + ' successfully!',
        });
        pairingEnabled.value = enabled;
    } catch (e) {
        const action = enabled ? 'enabling' : 'disabling';
        notification.create({
            message: 'An error occured whiles ' + action + ' pairing.',
        });
        pairingEnabled.value = !enabled;
    }
}
const deletingAccount = ref(false);
async function deleteAccount() {
    const proceed = await dialog.create({
        title: 'Delete Account?',
        message: `Are you sure you want to <strong class="text-red-700">&nbsp;DELETE&nbsp;</strong> your account?`,
        html: true,
        cancel: true,
    });

    if (proceed) {
        deletingAccount.value = true;
        socket.emit('user.account-delete')
        emit('logout');
        state.logout();
        await router.push({
            name: 'login',
        });

        notification.create({
            message: 'Your account was removed successfully!',
        });
    }
}
</script>
<template>
    <DialogModal
        title-text="Account Settings"
        v-model="settingsDialog"
        :persistent="deletingAccount"
    >
        <div class="flex justify-center items-center flex-col py-10">
            <button
                @click="deleteAccount()"
                class="btn text-red-700 gap-2"
                :disabled="deletingAccount"
            >
                <span>Delete Account</span>
                <AppLoading v-if="deletingAccount" />
            </button>
        </div>
    </DialogModal>
    <DialogModal title-text="Start New Chat" v-model="pairingDialog">
        <div class="flex justify-center items-center flex-col py-10">
            <p>
                Start a new chat with a random user by enabling pairing below.
            </p>
            <div class="flex justify-center items-center gap-2">
                <AppInputCheckbox
                    :model-value="pairingEnabled"
                    @update:model-value="togglePairing($event)"
                    :label="`Status: ${
                        pairingEnabled
                            ? 'waiting for random user'
                            : 'pairing is off'
                    }`"
                />
                <AppLoading v-if="pairingEnabled" />
            </div>
        </div>
    </DialogModal>
    <div
        v-bind="$attrs"
        class="h-[100%] px-2 shadow-md flex flex-col items-center gap-5"
    >
        <ul
            class="w-[100%] py-2 divide-x border-b flex justify-center items-center"
        >
            <li v-for="(action, index) in actions" :key="index">
                <button
                    class="flex justify-center items-center px-2"
                    :title="action.title"
                    @click="action.onClick"
                >
                    <span class="text-[40px] material-symbols-outlined">
                        {{ action.icon }}
                    </span>
                </button>
            </li>
        </ul>
        <ul class="w-[100%] divide-y uppercase">
            <template v-if="labels.length">
                <li
                    v-for="label in labels"
                    :key="label.id"
                    :class="[
                        'py-2',
                        'px-5',
                        'cursor-pointer',
                        'transition-all',
                        'duration-75',
                        'rounded',
                        'truncate',
                        'hover:bg-primary',
                    ]"
                >
                    {{ label.label }}
                </li>
            </template>
            <template v-else>
                <li class="py-2 px-5 text-center uppercase">
                    You haven't started any chat yet
                </li>
            </template>
        </ul>
    </div>
</template>
