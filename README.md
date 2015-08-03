[Yakyuu-Aikoukai（Baseball Club）](htttp://georgefu.info/y)
===============

A game of one of the top five bat-based sports! Namely, baseball! Now in JavaScript form.

Click on and around the strike zone to pitch/bat (click on the outer edge to not swing). Locate your pitches well to draw groundouts, easy pop flies,
and strikeouts from opposing batters, and use your batter's eye to hit the ball squarely in order to avoid the same.

-George Fu

currently hosted at [georgefu.info/y/](htttp://georgefu.info/y)

todo :



    スイングタイミング

    ウェブソケット

    送りバント


## Code organization

    app (development source code)
        / client
            / node_modules
                / baseball : generic common js (ES6)
                    /test : mocha unit (ES6)
            / scripts : framework-specific js (ES5)
            / styles : less
            / tests : protractor E2E
            gulpfile.js : build control
        / server
            # nothing here yet
    public (server assets)
        / js
        / css
        / html
        / images
        index.html : the home page


## Development

Install npm, bower

Install node components

    app/client> npm install

Install bower components

    app/client> bower install

Install module dependencies

    app/client/node_modules/baseball> npm install

This will run the build once and start the file watchers

    app/client> gulp


## Test development

Install protractor, configure the test spec app/client/tests/* to point to the correct test URL.

    app/client> protractor protractor.conf.js

For mocha, see the node module 'baseball'

    app/client/node_modules/baseball> mocha (es5) // doesn't work at the moment since it's configured in ES6 mode
    app/client/node_modules/baseball> npm test (es6)