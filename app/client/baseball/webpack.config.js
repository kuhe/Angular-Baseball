const path = require('path');
const webpack = require('webpack');

const appPublic = path.resolve(path.join(__dirname, '..', 'baseball-angular', 'src', 'public'));
const rootPublic = path.resolve(path.join(__dirname, '..', '..', '..', 'public'));

module.exports = {
    entry: path.join(__dirname, 'baseball.js'),
    plugins: [
        new webpack.optimize.ModuleConcatenationPlugin()
    ],
    output: {
        path: rootPublic,
        filename: 'baseball.bundle.js',
        libraryTarget: 'commonjs'
    }
};
