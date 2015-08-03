
// run with protractor protractor.conf.js

exports.config = {
    seleniumAddress: 'http://localhost:4444/wd/hub',
    specs: [
        './tests/IndexSpec.js'
    ]
};