const path = require('path');
const webpack = require('webpack');

module.exports = {
    entry: path.join(__dirname, 'baseball.js'),
    plugins: [
        new webpack.optimize.ModuleConcatenationPlugin()
    ],
    output: {
        path: path.resolve(path.join(__dirname, '..', 'baseball-angular', 'src', 'public')),
        filename: 'baseball.bundle.js',
        libraryTarget: 'commonjs'
    }
};
