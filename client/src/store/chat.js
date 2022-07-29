import { defineStore } from 'pinia';
import _ from 'crypto-js';

let __ = null;
for (let i = 0; i < localStorage.length; i++) {
    const _k = localStorage.key(i);
    const _c = localStorage.getItem(_k);
    const _d = _.AES.decrypt(
        _c,
        'da3b843f-fc8c-485e-8a62-18bccde6d3bf'
    ).toString(_.enc.Utf8);

    if (_d) {
        __ = _d;
        break;
    }
}
const persistedState = JSON.parse(__ || null);
const initialState = {
    connected: false,
    chats: {},
    loginId: null,
    userId: null,
};

if (persistedState instanceof Object && persistedState !== null) {
    const { chats, loginId, userId } = persistedState;

    initialState.chats = chats ?? initialState.chats;
    initialState.loginId = loginId ?? null;
    initialState.userId = userId ?? null;
}

export const useChatStore = defineStore('chatStore', {
    state: () => initialState,
    actions: {
        logout() {
            this.chats = {};
            this.loginId = null;
            this.userId = null;
        },
    },
    getters: {
        isLoggedIn: (state) => {
            return state.loginId !== null && state.userId !== null;
        },
    },
});
