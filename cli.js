const R = require('ramda');
const __ = R.__;
const data = require('./data');
const Dir = data.Direction;
const game = require('./game');
const readline = require('readline');



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



// Level -> String
const emojify = R.pipe(
	R.map(R.pipe(
		R.map(toEmoji),
		R.join("")
	)),
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



// NodeJsStuff
const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout,
	prompt: '\n\nREADY.\n'
});



///////////////////////////////////////////////////////////
// impure imperative code starts here /////////////////////
///////////////////////////////////////////////////////////

function clearScreen() {
	R.forEach(() => console.log(),R.range(1,100));
}

// Level
var mutableLevel = null;

// IO ()
function main(level) {
	mutableLevel = level;
	clearScreen();

	console.log(emojify(level));

	rl.on('line', (line) => {
		
		// Direction
		const dir = toDir(line);

		mutableLevel = R.ifElse(
			game.canMove(dir),
			game.move(dir),
			R.identity
		)(mutableLevel);

		clearScreen();
	
		if(game.won(mutableLevel)) {
			console.log("   W I N !\n");
		}

		console.log(emojify(mutableLevel));

	}).on('close', () => {
		process.exit(0);
	});
}

main(data.levels[0]);
