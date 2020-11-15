# Matchmaker

This is the Java server that provides online head-to-head multiplayer for
the UI application.

All match data is transiently shuttled between the two opposing sides of any 
particular game match, so the server stores nothing
beyond the websocket connections of the players currently in-session.

The server's availability is detected by the client application. Whenever it is running,
multiplayer is enabled.

# Running locally

Run `yak.Main::main` with Java 8+, typically via your IDE. 

Then, running multiple browser windows with the same hash (identifying the baseball field ID)
will connect the first two to each other as home and away teams.

e.g. `http://localhost:4200/#Tsukuba33` where `Tusukuba33` is the field/match ID.

# Deployment

Run `gradle` build and the take the jar from `/build/libs`.

Chuck that into Elastic Beanstalk and call it a day.

    todo: GCP?

# Route overview

GET `/` (debugging)

responds with "OK".

GET `/healthcheck` (debugging)

responds with "OK".

GET `/status` (debugging)

Lists currently active sessions.

----

`/field_request` (client) param: field_id

Hit 1x per session to request assignment to the given field. 
If the field is empty the client is assigned the home side,
otherwise if there is one player the client becomes the 
second player and is assigned the away side.

If the field is full the client is ignored, not connected to anyone
else and plays as if in single player mode.

`/game_data` (client)

Used to initialize multiplayer by passing game data
to the second user. Called once per game, typically,
but may be used to synchronize sessions after rejoin etc.

`/swing` and `/pitch` (client)

These are hit steadily during gameplay, depending on which
side is on defense and offense. Used to transfer
pitch data over `/pitch` so the batting player can react via
`/swing`. These data transfer over the server and out to the
other player paired on the field. 