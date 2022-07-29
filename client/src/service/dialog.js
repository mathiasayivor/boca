import { ref } from 'vue';
import { v4 as uuidv4 } from 'uuid';

export const dialogs = ref([]);

export function useDialog() {
    return {
        /**
         *
         * @param {{ title?: string, message: string, cancel: boolean, timeout: number, html: Boolean, position: 'top' | 'right' | 'bottom' | 'left' | 'center' | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'}} config
         * @param {(response: boolean) => void} onClose
         * @returns {Promise<boolean>} `true`, if user clicks "OK", `false` otherwise
         */
        create(config, onClose) {
            const _config = {
                title: null,
                cancel: false,
                timeout: 0,
                position: 'center',
                animation: 'zoom',
                html: false,
                ...config,
            };

            return new Promise((resolve) => {
                dialogs.value.push({
                    id: uuidv4(),
                    model: true,
                    config: _config,
                    onClose: (response) => {
                        if (onClose instanceof Function) {
                            onClose(response);
                        }

                        resolve(response);

                        const inQueue = dialogs.value.filter(
                            (dialog) => dialog.model
                        );

                        if (!inQueue.length) {
                            dialogs.value.splice(0);
                        }
                    },
                });
            });
        },
    };
}
