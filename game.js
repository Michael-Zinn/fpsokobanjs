const R = require('ramda');
const __ = R.__

const includes = R.curry( (str, substr) => str.includes(substr))

const X = 0;
const Y = 1;



// Position -> Position -> Position
const addPos      = R.zipWith(R.add);
const subtractPos = R.zipWith(R.subtract);



// Position -> Level -> Cell
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
const containsCrate = R.curry(R.compose(includes("oO"), getCell));



//                          [Cell] -> Cell ->       Cell ->    Position -> Level -> Level
const adjustCell = R.curry( (matches, matchReplace, noMatchReplace, pos, level) => R.adjust(
	R.adjust(
		R.ifElse(
			includes(matches),
			R.always(matchReplace),
			R.always(noMatchReplace)
		),
		pos[X]
	),
	pos[Y],
	level
));



// Position -> Level -> Level
const addCrate = adjustCell("^O","O","o");



// Position -> Level -> Level
const removePlayer = adjustCell("&", "^", ".");



// Position -> Level -> Level
const addPlayer = adjustCell("^O", "&", "@");



// Level -> Bool
exports.won = R.pipe(
	R.unnest,
	R.none(R.equals("o"))
); 



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
	
	

// Level -> Position
const findPlayer = (level) => {

	const playerY = R.findIndex(R.any(isPlayer), level);
	const playerX = R.findIndex(isPlayer, level[playerY]);

	return [playerX, playerY];

}



// some exports for tests:
exports.addPos = addPos;
exports.getCell = getCell;
exports.findPlayer = findPlayer;
exports.hasRoom = hasRoom;
exports.containsCrate = containsCrate;

