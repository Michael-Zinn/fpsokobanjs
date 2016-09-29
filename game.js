const R = require('ramda');
const __ = R.__
const data = require('./data');



// Dimension
const X = data.Dimension.X;
const Y = data.Dimension.Y;



// Level -> Bool
exports.won = R.none(R.any(R.equals("o"))); 



// Direction -> Level -> Bool
exports.canMove = R.curry( (dir, level) => {

	// Position
	const origin = findPlayer(level);
	const destination = addPos(origin, dir);
	const behindDestination = addPos(destination, dir);

	return hasRoom(destination, level) ||
		(containsCrate(destination, level) && hasRoom(behindDestination, level));

});



// Direction -> Level -> Level
exports.move = R.curry( (dir, level) => {

	// Position
	const origin = findPlayer(level);
	const destination = addPos(origin, dir);
	const behindDestination = addPos(destination, dir);

	return R.pipe(
		R.ifElse(
			containsCrate(destination),
			addCrate(behindDestination),
			R.identity
		),
		removePlayer(origin),
		addPlayer(destination)
	)(level);

});
	


// Position -> Position -> Position
const addPos = R.zipWith(R.add);



// Level -> Position
const findPlayer = (level) => {

	// Number
	const playerY = R.findIndex(R.any(isPlayer), level);
	const playerX = R.findIndex(isPlayer, level[playerY]);

	return [playerX, playerY];

}



// [Cell] -> Cell -> Bool
const cellIsLike = R.curry( (str, substr) => str.includes(substr) )



// Cell -> Bool
const isPlayer = cellIsLike("@&");



// Position -> Level -> Cell
const cellAt = R.curry( (pos, level) => level[pos[Y]][pos[X]] );



// [Cell] -> Position -> Level -> Bool
const positionIsLike = (cells) => R.curry(R.pipe(
	cellAt,
	cellIsLike(cells)
));



// Position -> Level -> Bool
const hasRoom       = positionIsLike(".^");
const containsCrate = positionIsLike("oO");



//                           (Cell -> Cell) -> Position -> Level  -> Level
const adjustCell = R.curry(( f              ,  pos      ,  level) => R.adjust(
	R.adjust(f, pos[X]),
	pos[Y]
)(level));	



//                              [Cell] -> Cell ->       Cell ->  Position -> Level  -> Level
const adjustCellLike = R.curry( (matches, matchReplace, noMatchReplace, pos, level) => adjustCell(
	R.ifElse(
		cellIsLike(matches),
		R.always(matchReplace),
		R.always(noMatchReplace)
	),
       	pos,
       	level
));



// Position -> Level -> Level
const addPlayer    = adjustCellLike("^O", "&", "@");
const removePlayer = adjustCellLike("&" , "^", ".");
const addCrate     = adjustCellLike("^" , "O", "o");



// some exports for tests:
exports.addPos = addPos;
exports.cellAt = cellAt;
exports.findPlayer = findPlayer;
exports.hasRoom = hasRoom;
exports.containsCrate = containsCrate;

