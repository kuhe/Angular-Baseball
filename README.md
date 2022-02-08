[野球愛好会（Baseball Club）](http://kuhe.github.io)
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

Baseball logic source code root: [app/client/baseball](https://github.com/kuhe/Angular-Baseball/tree/master/app/client/baseball)

    app (development source code)
        / client
            / baseball : game engine (TypeScript 3.7+)
                / Model : Object-oriented Baseball ;)
                / Services : Where most of the interesting math happens
                / Render : 3D meshes and stuff
                / test : unit test of the baseball engine
            / baseball-angular : Angular rendering front end (contains ported legacy code)
            / baseball-frontend : Possible WIP for a thinner Preact front end
            / styles : less
    matchmaker
        a Java implementation of the websocket head-2-head service
    public (end user runtime, hosted assets)
        index.html : the home page


## Development

You'll need `yarn` or `npm`, and a NodeJS runtime.

Install dependencies in each folder that contains a `package.json` file.

    > yarn
    
Run the client application by starting the Angular front end `npx ng serve`.

To watch for modifications to the baseball engine, run `npm run watch` in `app/client/baseball` as well.

If you opt for a full build, e.g. `make deploy`, you can run `make serve` in the repository
root to run the productionized version.

## Test development

Incidentally, this is the CLI mode, and will run a test simulating the 10-year career of a random player.
The test is: do the stats look realistic? If yes, then the baseball engine is functioning correctly :P.

See `app\client\baseball\test\CareerSpec.js` (es6)

    > npm test

Or simply run the file in Node.

## Project history

Circa 2014 I began writing this as a baseball game/simulator using Angular 1.x, hence the name,
out of a combination of personal interests, namely baseball and JavaScript.

I have since stopped using Angular in my day job, and stopped playing baseball,
but I upgraded this to use Angular 2 (and then 5) regardless, to stay true to its roots, and also
because the core baseball simulation did not care what was being used to render it.

However, as much as I like TypeScript and Angular, it's been kind of a pain to integrate the ESM portion of the
baseball engine to an `angular-cli` project.

This project was developed unironically on Microsoft Windows, and sometimes on Mac too.

##### Project milestones:

- 2014, started the project while working at my first job.
- 2016 or thereabouts, modified the rendering engine to use WebGL instead of just CSS.
- Wrote nodejs and Java versions of a live-play matchmaking back end.
- 2018 or so, upgraded to Angular 2+ (8)
- 2020, migration to TypeScript (baseball engine)
- 2022, revamped batted ball trajectory animation, added sounds

Future:

- migrate off Angular?

## Developer's Notes

#### Feb 6, 2022
Good news, I've reworked the batted ball animation frames. 
- Old system used on-rails animations according to either a parabola (fly ball) or a tapering sine-wave (ground ball bounces). This was often unrealistic looking at certain parts of the input envelope.
- New system (!) uses physics based trajectory for both fly and ground balls, initial vectoring with acceleration modeled. Ground balls still need some work, but overall looks much better.

Also added sounds for the mitt catching the ball and bat contact, heh. 