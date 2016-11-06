#! /usr/bin/env node
const R = require('ramda');
const __ = R.__;
const data = require('./data');
const Dir = data.Direction;
const game = require('./game');
const Promise = require('bluebird');
const readlineAsync = require('readline-async');



// Cell -> Emoji
const toEmoji = R.prop(__, {
	"@": "🕷 ",
	"&": "🕷 ",
	"#": "██",
	".": "  ",
	"^": "🕸 ",
	"o": "☻ ",
	"O": "💀 "
});



// [Cell] -> String
const cellsToString = R.pipe(
	R.map(toEmoji),
	R.join("")
);



// Level -> String
const emojify = R.pipe(
	R.map(cellsToString),
	R.join("\n")
);



// a -> (a | null | undefined ) -> a
const nilTo = R.curry( (fallback, value) => {
	if(R.isNil(value)) {
		return fallback;
	} else {
		return value;
	}
});



// String -> Direction
const toDir = R.pipe( R.prop(__, {

	// W A S D
	"w": Dir.UP,
	"a": Dir.LEFT,
	"s": Dir.DOWN,
	"d": Dir.RIGHT,

	// Nethack (Vi)
	"h": Dir.LEFT,
	"j": Dir.DOWN,
	"k": Dir.UP,
	"l": Dir.RIGHT,

	// Dvorak
	".": Dir.UP,
	"o": Dir.LEFT,
	"e": Dir.DOWN,
	"u": Dir.RIGHT

}), nilTo([0,0]));



// IO () 
const clearScreen = () => {
	R.forEach(() => console.log(),R.range(1,100));
}



// Level -> IO ()
const play = (level) => {

	clearScreen();

	if(game.won(level)) {
		console.log("   W I N!\n");
		console.log(emojify(level));
		return Promise.resolve();
	} else {
		console.log(emojify(level));
		console.log("");

		return readlineAsync()
		.then(toDir) // ".then" can mean map ...
		.then(dir => R.ifElse(
			game.canMove(dir),
			game.move(dir),
			R.identity
		)(level))
		.then(play); // ... but also >>= / bind / chain / flatMap
	}
}



// "main" : IO ()
play(data.levels[0])
.then( () => console.log("EOL"));
