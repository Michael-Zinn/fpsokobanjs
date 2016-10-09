# FP Sokoban

A Sokoban game written in the functional programming style.

![Commandline Screenshot](fpsokobanjs.png)

Makes heavy use of currying, mapping, pipes and other [Ramda.js features](ramdajs.com/docs/).

File | Content
-----|--------
data.js | data types
game.js | game logic
cli.js | command line "GUI"

## How to play

* Move around by entering a direction, either as WASD, HJKL or .OEU followed by the ENTER key, e.g. enter w to move up.
* You control the spider. The goal is to move the smileys onto the spider webs.
* You can only push one smiley at a time.