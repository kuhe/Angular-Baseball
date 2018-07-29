// rollup.config.js
import typescript from 'rollup-plugin-typescript2';

export default {
    input: './src/main.ts',
    output: {
        format: 'umd',
        name: 'yakyuu',
        file: '../../../public/ui.js'
    },
    plugins: [typescript({})]
};
