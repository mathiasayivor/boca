import { io } from 'socket.io-client';
import { useChatStore } from '@/store/chat';
const state = useChatStore();

const eventStack = {};

function fireEvents(eventName, ...params) {
    if (!(eventStack[eventName] instanceof Array)) {
        return;
    }

    eventStack[eventName].forEach((callback) => {
        if (typeof callback !== 'function') {
            return;
        }

        callback(...params);
    });
}

export function useChatApp() {
    let connectionStarted = false;
    const socket = io(import.meta.env.VITE_SERVER_URL, {
        autoConnect: false,
    });

    socket.on('disconnect', () => {
        state.connected = false;

        fireEvents('disconnect');
    });

    socket.on('connect', () => {
        state.connected = true;

        fireEvents('connect');
    });

    socket.on('user.account-deleted', () => {
        state.connected = false;
        fireEvents('user.account-deleted');
    });

    return {
        socket,
        start() {
            if (!connectionStarted || socket.disconnected) {
                connectionStarted = true;
                socket.connect();
            }
        },
        stop() {
            socket.disconnect();
        },
        on(event, callback) {
            if (!eventStack[event] instanceof Array) {
                eventStack[event] = [];
            }

            eventStack[event].push(callback);
        },
        /**
         *
         * @param {String} message
         * @returns {Promise<{content: string, addedAt: Date}>}
         */
        sendMessage(message) {
            const addedAt = new Date();
            return new Promise((resolve, reject) => {
                socket.timeout(15000).emit(
                    'message.add',
                    {
                        content: message,
                        addedAt,
                    },
                    (err, sent) => {
                        if (err) {
                            reject('failed to send message: ' + message);
                            return;
                        }

                        resolve({
                            content: message,
                            addedAt,
                        });
                    }
                );
            });
        },
        /**
         *
         * @param {Boolean} enable
         * @returns {Promise<void>}
         */
        async setPairing(enable) {
            return new Promise((resolve, reject) => {
                socket.timeout(10000).emit(
                    enable ? 'user.pair-open' : 'user.pair-close',
                    {
                        loginId: state.loginId,
                    },
                    (err, done) => {
                        if (err) {
                            reject(err);
                            return;
                        }

                        resolve();
                    }
                );
            });
        },
    };
}
