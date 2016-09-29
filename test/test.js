const assert = require('chai').assert;
const expect = require('chai').expect;
const R = require('ramda');
const __ = R.__;
const game = require('../game.js');

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



	describe("#addPos", () => {
		it('should add positions like vectors', () => {
			expect(game.addPos([2,3],[4,5])).to.eql([6,8]);
		});
	});

	

	describe("#hasRoom", () => {
		it('should have room in an empty space.', () => {
			expect(game.hasRoom([1,1], level.base)).to.be.true;
		});
		it('should have room in on a goal space.', () => {
			expect(game.hasRoom([3,1], level.base)).to.be.true;
		});
		it('should not have room in a wall', () => {
			expect(game.hasRoom([4,0], level.base)).to.be.false;
		});
	});



	describe("#containsCrate", () => {
		it('should contain a crate', () => {
			expect(game.containsCrate([2,3], level.down)).to.be.true;
		});

		it('should contain a crate on a goal', () => {
			expect(game.containsCrate([1,0], [[".","O","."]])).to.be.true;
		});

		it('should not contain a crate', () => {
			expect(game.containsCrate([2,0], level.down)).to.be.false;
		});
	});



	describe("#cellAt", () => {
		it('should find the bottom center cell', () => {
			expect(	game.cellAt([1,2], ["###","#..","o@."].map(R.split("")))).to.equal("@");
		});
	});



	describe('#findPlayer', () => {
		it('should find the player', () => {
			expect(game.findPlayer(level.base)).to.eql([2,1]);
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
});
