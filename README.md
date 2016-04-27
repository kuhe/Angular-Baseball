[Yakyuu-Aikoukai（Baseball Club）](http://kuhe.github.io)
===============

A game of one of the top five bat-based sports! Namely, baseball! Now in JavaScript form.

Click on and around the strike zone to pitch/bat. Locate your pitches well to draw groundouts, easy pop flies,
and strikeouts from opposing batters, and use your batter's eye to hit the ball squarely in order to avoid the same.

Hosted at [kuhe.github.io](http://kuhe.github.io)

todo :

    スイングタイミング

    送りバント
    
    観客席やら


## Code organization

    app (development source code)
        / client
            / baseball : game engine (ES6)
                / test : mocha unit (ES6)
            / scripts : framework-specific js (ES5)
            / styles : less
            / tests : protractor E2E (unused, sadly)
            gulpfile.js : build control
        / server
            the websocket server for live head-2-head play
    public (server assets)
        / js
        / css
        / html
        / images
        index.html : the home page


## Development

Install npm, bower

Install dependencies

    > npm run install

This will run the start the file watchers. Use gulp build to just build once.

    app/client> gulp


## Test development

Incidentally, this is the CLI mode, and will run a test simulating the 10-year career of a random player.

See app\client\baseball\test\CareerSpec.js (es6)

    > npm test