const R = require('ramda');

/**
 * Informal data types and levels.
 *
 */



/*

type Position = [Number]
e.g. [3,4]

type Direction = Position // this makes it possible to implement movement as addition.
e.g. [1,0]

type Level = [[Cell]]
e.g. [["#","#"],["@","."]]

*/
module.exports = {

	Direction: {
		LEFT:  [-1,  0],
		RIGHT: [ 1,  0],
		UP:    [ 0, -1],
		DOWN:  [ 0,  1]
	},

	Dimension: {
		X: 0,
		Y: 1
	},

	Cell: {
		EMPTY:           ".",
		GOAL:            "^",
		MISPLACED_CRATE: "o",
		CRATE_ON_GOAL:   "O",
		PLAYER_ON_EMPTY: "@",
		PLAYER_ON_GOAL:  "&",
		WALL:            "#"
	},

	// [Level]
	levels: [
		[
			"######",
			"#..^^#",
			"#.#.##",
			"#....#",
			"#.o..#",
			"#.o###",
			"#..@.#",
			"#....#",
			"######"
		],
	       	[
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
		],
	       	[ // not really a level
			"^O^O^O^O^O^O^O^O^O",
			"O################^",
			"^#...#....#.O..^#O",
			"O#.o..........OO#^",
			"^#...#....#O..OO#O",
			"O#####..#########^",
			"^#^..#..#########O",
			"O#...#..#########^",
			"^#o.....####....#O",
			"O#o..#....o...@.#^",
			"^#...#..........#O",
			"O################^",
			"^O^O^O^O^O^O^O^O^O"
		]
	].map(R.map(R.split("")))
}
