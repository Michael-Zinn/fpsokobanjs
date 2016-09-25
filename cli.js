const R = require('ramda');
const __ = R.__;
const data = require('./data.js');
const game = require('./game.js');
const readline = require('readline');


function toDir(input) { switch(input) {
	case "w":
	case ".":
	case "k":
		return [ 0,-1];
	case "a":
	case "o":
	case "h":
		return [-1, 0];
	case "s":
	case "e":
	case "j":
		return [ 0, 1];
	case "d":
	case "u":
	case "l":
		return [ 1, 0];
	default:
		return [0,0];
}}

const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout,
	prompt: '\n\nREADY.\n'
});


const emojiMap = {
	"@": "🕷 ",
	"&": "🕷 ",
	"#": "██",
	".": "  ",
	"^": "🕸 ",
	"o": "☻ ",
	"O": "💀 "
}


// Level -> String
const emojify = R.pipe(
	R.map(R.pipe(
		R.map(R.prop(__, emojiMap)),
		R.join("")
	)),
	R.join("\n")
);

function clearScreen() {
	R.forEach(() => console.log(),R.range(1,100));
}

var modifyingLevel = null;

function main(level) {
	modifyingLevel = level;
	clearScreen();

	console.log(emojify(level));


	rl.on('line', (line) => {
		const dir = toDir(line);
		if(game.canMove(dir,modifyingLevel)) {
			modifyingLevel = game.move(dir,modifyingLevel);
		} else {

		};
	
		clearScreen();
	
		if(game.won(modifyingLevel)) {
			console.log("   W I N !\n");
		}
		console.log(emojify(modifyingLevel));

	}).on('close', () => {
		process.exit(0);
	});
}


main(data.levels[0]);
