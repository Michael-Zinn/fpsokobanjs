const R = require('ramda');
const __ = R.__
//const Promise = require('bluebird');



const includes = R.curry((str, substr) => str.includes(substr))

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



// Position -> Position -> Position
const addPos      = R.zipWith(R.add);
const subtractPos = R.zipWith(R.subtract);



// pos -> level -> cell
const getCell = R.curry( (pos, level) => {
	return level[pos[Y]][pos[X]]
});



// [Cell] -> Position -> Level -> Bool
const cellIs = (cells) => R.compose(includes(cells), getCell);



// Position -> Level -> Bool
const hasRoom = cellIs(".^");



// Cell -> Bool
const isPlayer = includes("@&");



// Position -> Level -> Bool
const containsCrate = cellIs("oO");



// Position -> Level -> Level
const addCrate = R.curry( (pos, level) => R.adjust(
	R.adjust(
		R.ifElse(
			includes("^O"),
			R.always("O"),
			R.always("o")
		),
		pos[X]
	),
	pos[Y],
	level
));



// Position -> Level -> Level
const removePlayer = R.curry( (pos, level) => {
	return R.adjust(
		R.adjust(
			(cell) => (cell == "&") ? "^" : ".",
			pos[X]
		),
		pos[Y],
		level
	);
});



// Position -> Level -> Level
const addPlayer = R.curry( (pos, level) => {
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



// Direction -> Level -> Bool
exports.canMove = R.curry( (dir, level) => {

	const fromPos = findPlayer(level);
	const toPos = addPos(fromPos, dir);
	const behindPos = addPos(toPos, dir);

	return hasRoom(toPos, level) ||
		(containsCrate(toPos, level) && hasRoom(behindPos, level));

});



// Direction -> Level -> Level
exports.move = R.curry( (dir, level) => {

	const fromPos = findPlayer(level);
	const toPos = addPos(fromPos, dir);
	const behindPos = addPos(toPos, dir);

	return R.pipe(
		R.ifElse(
			containsCrate(toPos),
			addCrate(behindPos),
			R.identity
		),
		removePlayer(fromPos),
		addPlayer(toPos)
	)(level);

});
	
	

// Level -> Position
const findPlayer = (level) => {

	const playerY = R.findIndex(R.any(isPlayer), level);
	const playerX = R.findIndex(isPlayer, level[playerY]);

	return [playerX, playerY];

}


