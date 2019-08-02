import typescript from 'rollup-plugin-typescript2';
import resolve from 'rollup-plugin-node-resolve';

export default {
    input: './src/main.ts',
    output: {
        format: 'umd',
        name: 'yakyuu',
        file: '../../../public/ui.js'
    },
    plugins: [
        resolve({
            module: true,

            // not all files you want to resolve are .js files
            extensions: ['.ts', '.mjs', '.js', '.jsx', '.json'],
            // Default: [ '.mjs', '.js', '.json', '.node' ]

            // If true, inspect resolved files to check that they are
            // ES2015 modules
            modulesOnly: true // Default: false
        }),
        typescript({}),
    ]
};
