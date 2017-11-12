[Yakyuu-Aikoukai（Baseball Club）](http://kuhe.github.io)
===============

A game of one of the top five bat-based sports, namely baseball! Now in JavaScript form.

Click on and around the strike zone to pitch/bat. Locate your pitches well to draw groundouts, easy pop flies,
and strikeouts from opposing batters, and use your batter's eye to hit the ball squarely in order to avoid the same.

Try looking for the rotation of the seams on the ball!

Hosted at [kuhe.github.io](http://kuhe.github.io)
So for the time being all distribution files are being versioned.

todo :

    送りバント
    
    観客席やら


## Code organization

    app (development source code)
        / client
            / baseball : game engine (ES6/ESM)
                / test : unit (ES6)
            / baseball-angular : TypeScript/Angular5 rendering front end
            / styles : less
        / server
            the websocket server for live head-2-head play
    public (end user runtime)
        index.html : the home page


## Development

Install npm somehow.

Install dependencies in each folder that contains a `package.json` file.

    > npm run install

## Test development

Incidentally, this is the CLI mode, and will run a test simulating the 10-year career of a random player.

See `app\client\baseball\test\CareerSpec.js` (es6)

    > npm test

Or simply run the file in Node.

## Project history

Circa 2014 I began writing this as a baseball game/simulator using Angular 1.x, hence the name.
I have since stopped using Angular in my day job, but I upgraded this to use Angular 2 (and then 5)
regardless, to stay true to its roots. And also because the core baseball simulation did not care what was
being used to render it.

However, as much as I like TypeScript and Angular, it's been kind of a pain to integrate the ESM portion of the
baseball engine to an `angular-cli` project.
