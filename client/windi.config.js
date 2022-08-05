import { defineConfig } from 'windicss/helpers';

export default defineConfig({
    safelist: ['top-2 right-2 bottom-2 left-2'],
    theme: {
        extend: {
            colors: {
                primary: '#541515'
            }
        }
    },
    shortcuts: {
        btn: 'h-[40px] py-2 px-4 rounded-md flex justify-center items-center disabled:curser-not-allowed uppercase',
        'btn-primary': 'bg-primary text-white disabled:bg-primary/50',
        input: 'h-[40px] py-2 px-4 border-1 outline-none appearance-none w-full text-sm leading-6 text-slate-900 placeholder-slate-400 rounded-md transition-all duration-200 disabled:curser-not-allowed',
        'input-primary': 'focus:border-primary',
        'text-primary': 'text-primary',
        'bg-primary': 'bg-primary text-white',
        'row': 'w-full grid grid-cols-12 gap-1'
    },
});
