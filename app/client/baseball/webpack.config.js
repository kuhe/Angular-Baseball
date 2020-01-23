const path = require('path');
const webpack = require('webpack');

const appPublic = path.resolve(path.join(__dirname, '..', 'baseball-angular', 'src', 'public'));
const rootPublic = path.resolve(path.join(__dirname, '..', '..', '..', 'public'));

module.exports = {
    entry: path.join(__dirname, 'baseball.ts'),
    plugins: [new webpack.optimize.ModuleConcatenationPlugin()],
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
        ],
    },
    resolve: {
        extensions: [ '.tsx', '.ts', '.js' ],
    },
    devtool: 'source-map',
    output: {
        path: appPublic,
        filename: 'baseball.bundle.js',
        libraryTarget: 'commonjs'
    }
};
