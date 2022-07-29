import { ref } from 'vue';
import { v4 as uuidv4 } from 'uuid';

export const notifications = ref([]);

export function useNotification() {
    return {
        /**
         *
         * @param {{ message: string, timeout: number, position: 'top' | 'right' | 'bottom' | 'left' | 'center' | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'}} config
         */
        create(config, onClose) {
            const _config = {
                timeout: 5000,
                position: 'bottom',
                animation: 'zoom',
                ...config,
            };

            return new Promise((resolve) => {
                notifications.value.push({
                    id: uuidv4(),
                    model: true,
                    config: _config,
                    onClose: () => {
                        if (onClose instanceof Function) {
                            onClose();
                        }

                        resolve();

                        const inQueue = notifications.value.filter(
                            (notification) => notification.model
                        );

                        if (!inQueue.length) {
                            notifications.value.splice(0);
                        }
                    },
                });
            });
        },
    };
}
