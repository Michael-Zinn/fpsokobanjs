const R = require('ramda');
const __ = R.__
const Promise = require('bluebird');
const readline = require('readline');

const empty = ".";
const player = "🕷";
const goal = "🕸";

const level = [
	"##########",
	"#........#",
	"#...^O^..#",
	"#........#",
	"#.o......#",//o
	"#........#",
	"#....o@..#",//&
	"##########"
].map(R.split(""));

const X = 0;
const Y = 1;



// pos -> pos -> pos
var addPos = R.curry((pos1, pos2) => {
	return [pos1[X] + pos2[X], pos1[Y] + pos2[Y]];
});


// pos -> pos -> pos
var subtractPos = R.curry((pos1, pos2) => {
	return addPos(pos1, pos2.map(R.multiply(-1)));
});



// pos -> level -> cell
var getCell = R.curry( (pos, level) => {
	console.log("Getting " + pos + " of " + level);
	return level[pos[Y]][pos[X]]
});



// pos -> level -> Bool
var hasRoom = R.curry((pos, level) => 
	".^".includes(getCell(pos, level))	
);

var isPlayer = (s) => (( s == "@" ) || ( s == "&" ));

// pos -> level -> Bool
var containsCrate = R.curry((pos, level) =>
	"oO".includes(getCell(pos, level))
);

var addCrate = R.curry((pos, level) => {
	return R.adjust(
		R.adjust(
			R.ifElse(
				R.contains(__, ["^","O"]),
				R.always("O"),
				R.always("o")
			),
			pos[X]
		),
		pos[Y],
		level
	);
});



// pos -> level -> level
var removePlayer = R.curry( (pos, level) => {
	return R.adjust(
		R.adjust(
			R.ifElse(
				R.equals("&"),
				R.always("^"),
				R.always(".")
			),
			pos[X]
		),
		pos[Y],
		level
	);
});



var addPlayer = R.curry( (pos, level) => {
	return R.adjust(
		R.adjust(
			R.ifElse(
				R.contains(__, ["^","O"]),
				R.always("&"),
				R.always("@")
			),
			pos[X]
		),
		pos[Y],
		level
	);
});


// dir -> level -> Bool
var canMove = R.curry((dir, level) => {

	const fromPos = findPlayer(level);
	const toPos = addPos(fromPos, dir);
	const behindPos = addPos(toPos, dir);

	console.log("can Move "+fromPos+" to " +toPos+ " behind "+behindPos);
	return hasRoom(toPos, level) ||
		(containsCrate(toPos, level) && hasRoom(behindPos, level));
});



// dir -> level -> level
var move = R.curry( (dir, level) => {

	console.log("Trying to move...");

	const fromPos = findPlayer(level);
	const toPos = addPos(fromPos, dir);
	const behindPos = addPos(toPos, dir);

	console.log("piping...");

	//const newLevel = R.pipe(
	const newLevel = R.pipe(
		 R.ifElse(
			containsCrate(toPos),
			addCrate(behindPos),
			R.identity
		),
		removePlayer(fromPos),
		addPlayer(toPos)
	)(level);

	return newLevel;
});

	
	

// level -> [x, y]
var findPlayer = R.pipe(	
	R.zip(R.range(0,100)),
	R.filter((tuple) => [tuple[0], R.any(isPlayer, tuple[1])]),
	R.map((tuple) => [tuple[0], R.zip(R.range(0,100),tuple[1])]),
	R.map((tuple) => [tuple[0], R.filter(isPlayer, tuple[1])]),
	R.map((tuple) => [tuple[1][0],tuple[0]])
)

function toDir(input) { switch(input) {
	case "w":
	case "k":
		return [ 0,-1];
	case "a":
	case "h":
		return [-1, 0];
	case "s":
	case "j":
		return [ 0, 1];
	case "d":
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

// TODO pretty emoji.
var emojify = R.identity;

console.log("Let's begin...");

function game(level) {
	console.log(emojify(level));

	rl.on('line', (line) => {
		console.log("You said "+line+", sweet!");
		const dir = toDir(line);
		if(canMove(dir,level)) {
			game(move(dir,level));
		} else {
			game(level);
		};
	

	}).on('close', () => {
		process.exit(0);
	});
}

game(level);
