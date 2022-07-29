import { defineConfig } from 'windicss/helpers';

export default defineConfig({
    safelist: ['top-2 right-2 bottom-2 left-2'],
    shortcuts: {
        btn: 'h-[40px] py-2 px-4 rounded-md flex justify-center items-center disabled:curser-not-allowed uppercase',
        'btn-primary': 'bg-[#541515] text-white disabled:bg-[#5415157d]',
        input: 'h-[40px] py-2 px-4 border outline-none appearance-none w-full text-sm leading-6 text-slate-900 placeholder-slate-400 rounded-md transition-all duration-200 disabled:curser-not-allowed',
        'input-primary': 'focus:border-[#541515]',
        'text-primary': 'text-[#541515]',
        'bg-primary': 'bg-[#541515] text-white',
    },
});
