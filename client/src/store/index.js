import { createPinia } from 'pinia';
import _ from 'crypto-js';
import { v4 as uuidv4 } from 'uuid';

let ___;

const store = createPinia();
store.use(({ store }) => {
    store.$subscribe((mutation, state) => {
        if (mutation.storeId === 'chatStore') {
            for (let i = 0; i < localStorage.length; i++) {
                const _k = localStorage.key(i);
                const _c = localStorage.getItem(_k);
                const _d = _.AES.decrypt(
                    _c,
                    'da3b843f-fc8c-485e-8a62-18bccde6d3bf'
                ).toString(_.enc.Utf8);

                if (_d) {
                    localStorage.removeItem(_k);
                    break;
                }
            }

            localStorage.setItem(
                (___ = ___ ?? uuidv4()),
                _.AES.encrypt(
                    JSON.stringify(state),
                    'da3b843f-fc8c-485e-8a62-18bccde6d3bf'
                ).toString()
            );
        }
    });
});

export default store;
