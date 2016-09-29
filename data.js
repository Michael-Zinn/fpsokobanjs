const R = require('ramda');

/**
 * Informal data types and levels.
 *
 */



/*

type Position = [Number]
e.g. [3,4]

type Direction = Position
e.g. [1,0]

type Cell = "." | "^" | "o" | "O" | "@" | "&" | "#"

// .   empty
// ^   goal
// o   crate
// O   crate on goal (^ + o)
// @   player
// &   player on goal (^ + @)
// #   wall

type Level [[Cell]]
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
	       	[
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
