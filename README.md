[Yakyuu-Aikoukai（Baseball Club）](http://georgefu.info/y)
===============

A game of one of the top five bat-based sports! Namely, baseball! Now in JavaScript form.

Click on and around the strike zone to pitch/bat (click on the outer edge to not swing). Locate your pitches well to draw groundouts, easy pop flies,
and strikeouts from opposing batters, and use your batter's eye to hit the ball squarely in order to avoid the same.

Demo version with single player only at [kuhe.github.io](http://kuhe.github.io)

Full version with multi-player at [georgefu.info/y/](http://georgefu.info/y)

todo :

    スイングタイミング

    送りバント

    substitutions from bench
    
    観客席やら


## Code organization

    app (development source code)
        / client
            / node_modules
                / baseball : game engine (ES6)
                    /test : mocha unit (ES6)
            / scripts : framework-specific js (ES5)
            / styles : less
            / tests : protractor E2E (unused, sadly)
            gulpfile.js : build control
        / server
            the websocket server
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

This will run the start the file watchers. Use gulp build to just build once.

    app/client> gulp


## Test development

Install protractor, configure the test spec app/client/tests/* to point to the correct test URL.

    app/client> protractor protractor.conf.js

For mocha, see the node module 'baseball'

    app/client/node_modules/baseball> npm test (es6)

Incidentally, this is the CLI mode and equivalent to the above

    app/client> npm run career (es6)