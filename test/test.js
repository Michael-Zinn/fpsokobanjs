const assert = require('chai').assert;
const expect = require('chai').expect;
const R = require('ramda');
const __ = R.__;
const game = require('../game.js');
const data = require('../data.js');
const Cell = data.Cell;

describe('game', function() {

	const dir = {
		left:  [-1,  0],
		right: [ 1,  0],
		up:    [ 0, -1],
		down:  [ 0,  1]
	}

	const level = R.map(R.map(R.split("")), {
		base: [
			"#####",
			"#.@^#",
			"#.o.#",
			"#...#",
			"#####"],

		right: [
			"#####",
			"#..&#",
			"#.o.#",
			"#...#",
			"#####"],

		left: [
			"#####",
			"#@.^#",
			"#.o.#",
			"#...#",
			"#####"],

		down: [
			"#####",
			"#..^#",
			"#.@.#",
			"#.o.#",
			"#####"]
	});



	describe("#won", () => {
		it('should be won', () => {
			expect(game.won([["@","O"]])).to.be.true;
		});
		it('should not be won', () => {
			expect(game.won([["@","o","^"]])).to.be.false;
		});
	});



	describe('#canMove', () => {
		it('should not be allowed to move up', () => {
			expect(game.canMove(dir.up, level.base)).to.be.false;
		});
	});



	describe('#move', () => {
		['left', 'right', 'down'].map((direction) => {
			it('should move ' + direction, () => {
				expect(game.move(dir[direction],level.base)).to.eql(level[direction]);
			});
		});
	});



	describe("#addPos", () => {
		it('should add positions like vectors', () => {
			expect(game.addPos([2,3],[4,5])).to.eql([6,8]);
		});
	});



	describe('#findPlayer', () => {
		it('should find the player', () => {
			expect(game.findPlayer(level.base)).to.eql([2,1]);
		});
	});


	
	describe("#cellIsLike", () => {
		it('should be like', () => {
			expect(game.cellIsLike([Cell.EMPTY, Cell.WALL],Cell.EMPTY)).to.be.true;
		});
		it('should not be like', () => {
			expect(game.cellIsLike([Cell.EMPTY, Cell.Wall], Cell.MISPLACED_CRATE)).to.be.false;
		});
	});



	describe("#positionHasRoom", () => {
		it('should have room in an empty space.', () => {
			expect(game.positionHasRoom([1,1], level.base)).to.be.true;
		});
		it('should have room in on a goal space.', () => {
			expect(game.positionHasRoom([3,1], level.base)).to.be.true;
		});
		it('should not have room in a wall', () => {
			expect(game.positionHasRoom([4,0], level.base)).to.be.false;
		});
	});



	describe("#positionContainsCrate", () => {
		it('should contain a crate', () => {
			expect(game.positionContainsCrate([2,3], level.down)).to.be.true;
		});

		it('should contain a crate on a goal', () => {
			expect(game.positionContainsCrate([1,0], [[".","O","."]])).to.be.true;
		});

		it('should not contain a crate', () => {
			expect(game.positionContainsCrate([2,0], level.down)).to.be.false;
		});
	});



	describe("#positionContainsGoal", () => {
		const level = [["^","&"],["O","."]];
		it('should contain a goal', () => {
			expect(game.positionContainsGoal([0,0],level)).to.be.true;
			expect(game.positionContainsGoal([1,0],level)).to.be.true;
			expect(game.positionContainsGoal([0,1],level)).to.be.true;
		});
		it('should not contain a goal', () => {
			expect(game.positionContainsGoal([1,1],level)).to.be.false;
		});
	});



	describe("#cellAt", () => {
		it('should find the bottom center cell', () => {
			expect(	game.cellAt([1,2], ["###","#..","o@."].map(R.split("")))).to.equal("@");
		});
	});



	describe("#adjustCell", () => {
		it('should remove the wall', () => {
			const level = [["#"]];

			expect(game.adjustCell(R.always("."),[0,0],level)).to.eql([["."]]);
		});
	});



	describe("#adjustCellIfElse", () => {
		it('should remove the wall', () => {
			const level = [["#"]];

			expect(game.adjustCellIfElse(R.equals("#"), Cell.EMPTY, "@", [0,0], level)).to.eql([["."]]);
		});
	});


	
	describe('#addPlayer', () => {
		const level = [[".","^","O"]];

		it('should add a player on an empty cell', () => {
			expect(game.addPlayer([0,0],level)).to.eql([["@","^","O"]]);
		});

	});


	
	describe('#removePlayer', () => {


	});

	
	describe('#addCrate', () => {
		const level = [[".", "^"]];
		it('should add a crate to an empty field', () => {
			expect(game.addCrate([0,0],level)).to.eql([["o","^"]]);
		});
		it('should add a crate to a goal field', () => {
			expect(game.addCrate([1,0],level)).to.eql([[".","O"]]);
		});
	});
			
});
