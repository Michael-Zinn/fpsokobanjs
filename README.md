# FP Sokoban

A Sokoban game written in the functional programming style.

Makes heavy use of Ramda.js

Both data.js and game.js illustrate FP nicely. Cli.js on the other hand is more imperative than it needs to be: reading user input should be done with bluebird promises instead of event callbacks. Using promises with recursion would make the single variable obsolete.
