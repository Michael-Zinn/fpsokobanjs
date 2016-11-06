const R = require('ramda');
const __ = R.__

const data = require('./data');
const Cell = data.Cell;
const X = data.Dimension.X;
const Y = data.Dimension.Y;



// Level -> Bool
exports.won = R.none(R.contains(Cell.MISPLACED_CRATE)); 



// Direction -> Level -> Bool
exports.canMove = R.curry( (dir, level) => {

	// Position
	const origin = findPlayer(level);
	const destination = addPos(origin, dir);
	const behindDestination = addPos(destination, dir);

	return positionHasRoom(destination, level) ||
		(positionContainsCrate(destination, level) && positionHasRoom(behindDestination, level));

});



// Direction -> Level -> Level
exports.move = R.curry( (dir, level) => {

	// Position
	const origin = findPlayer(level);
	const destination = addPos(origin, dir);
	const behindDestination = addPos(destination, dir);

	return R.pipe(
		R.ifElse(
			positionContainsCrate(destination),
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
const cellIsLike = R.flip(R.contains);



// Cell -> Bool
const isPlayer = cellIsLike([Cell.PLAYER_ON_EMPTY, Cell.PLAYER_ON_GOAL]);



// Position -> Level -> Cell
const cellAt = R.curry( (pos, level) => level[pos[Y]][pos[X]] );



// [Cell] -> Position -> Level -> Bool
const positionIsLike = (cells) => R.curry(R.pipe(
	cellAt,
	cellIsLike(cells)
));



// Cell -> Bool
const cellHasRoom       = cellIsLike([Cell.EMPTY, Cell.GOAL]);
const cellContainsCrate = cellIsLike([Cell.MISPLACED_CRATE, Cell.CRATE_ON_GOAL]);
const cellContainsGoal  = cellIsLike([Cell.GOAL, Cell.CRATE_ON_GOAL, Cell.PLAYER_ON_GOAL]);

// Position -> Level -> Bool
const positionHasRoom       = R.curry(R.pipe(cellAt, cellHasRoom));
const positionContainsCrate = R.curry(R.pipe(cellAt, cellContainsCrate));
const positionContainsGoal  = R.curry(R.pipe(cellAt, cellContainsGoal));



//                           (Cell -> Cell) -> Position -> Level  -> Level
const adjustCell = R.curry(( f              ,  pos      ,  level) => R.adjust(
	R.adjust(f, pos[X]),
	pos[Y]
)(level));	



//                           (Cell -> Bool) -> Cell -> Cell -> Position -> Level -> Level
const adjustCellIfElse = R.curry(( condition, thenCell, elseCell, pos, level) => adjustCell(
	R.ifElse(
		condition,
		R.always(thenCell),
		R.always(elseCell)
	),
	pos,
	level
));



// Position -> Level -> Level
const addPlayer    = adjustCellIfElse(cellContainsGoal, Cell.PLAYER_ON_GOAL, Cell.PLAYER_ON_EMPTY);
const removePlayer = adjustCellIfElse(cellContainsGoal, Cell.GOAL, Cell.EMPTY);
const addCrate     = adjustCellIfElse(cellContainsGoal, Cell.CRATE_ON_GOAL, Cell.MISPLACED_CRATE);



// some exports for tests:
exports.addPos = addPos;
exports.cellAt = cellAt;
exports.findPlayer = findPlayer;
exports.cellIsLike = cellIsLike;
exports.cellHasRoom = cellHasRoom;
exports.cellContainsCrate = cellContainsCrate;
exports.cellContainsGoal = cellContainsGoal;
exports.positionHasRoom = positionHasRoom;
exports.positionContainsCrate = positionContainsCrate;
exports.positionContainsGoal = positionContainsGoal;
exports.adjustCell = adjustCell;
exports.adjustCellIfElse = adjustCellIfElse;
exports.addPlayer = addPlayer;
exports.removePlayer = removePlayer;
exports.addCrate = addCrate;

