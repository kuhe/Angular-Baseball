const path = require('path');

module.exports = {
    entry: path.resolve(__dirname, 'scripts/application/application.js'),
    output: {
        path: path.resolve(__dirname, '../../public/js'),
        filename: 'application.bundle.js'
    }
};
