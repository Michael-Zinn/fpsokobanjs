const R = require('ramda');
const __ = R.__;
const game = require('./game.js');
const readline = require('readline');


const level = [
	"######",
	"#..^^#",
	"#.#.##",
	"#....#",
	"#.o..#",
	"#.o###",
	"#..@.#",
	"#....#",
	"######"
];
const level2 = [
	".....####..",
	"######..#..",
	"#..o...@#..",
	"#..#.##.##.",
	"##.#^^...#.",
	".#..^^##o#.",
	".#o##.##.##",
	".#....o...#",
	".#..###...#",
	".####.#####"
].map(R.split(""));


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


// TODO pretty emoji.
const emojify = R.compose(
	R.join("\n"),
	R.map(R.compose(
		R.join(""),
		R.map((cell) => emojiMap[cell])
	))
);

function clearScreen() {
	R.forEach(() => console.log(),R.range(1,100));
}


var modifyingLevel = level;

function main(level) {
	clearScreen();
	console.log(emojify(level));


	rl.on('line', (line) => {
		const dir = toDir(line);
		if(game.canMove(dir,modifyingLevel)) {
			modifyingLevel = game.move(dir,modifyingLevel);
		} else {

		};
	
		clearScreen();
		console.log(emojify(modifyingLevel));

	}).on('close', () => {
		process.exit(0);
	});
}


main(level);
