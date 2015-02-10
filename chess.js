function Stack() {
	this.data = [];
	this.next = 0;
	this.push = function(value) {
		this.data[this.next++] = value;
	};
	this.pop = function() {
		return this.data[--this.next];
	};
	this.empty = function() {
		return this.next <= 0;
	};
}

function TheGame(size, debug) {

	this.chessboard = []; // 64 items
	this.history = [];
	this.size = size ? size : 8;
	// this.stack = new Stack();
	var max = this.size * this.size;

	this.print = function () {
		for(var j = 0; j<this.size; j++) {
			for(var i = 0; i<this.size; i++) {
				process.stdout.write(this.getPretty(i+1, j+1) + ", ");
			}
			console.log("");
		}
		console.log("");
	};

	this.set = function (x,y,order) {
		this.chessboard[x-1 + (y-1) * this.size] = order;
	};

	this.get = function (x,y) {
		var val = this.chessboard[x-1 + (y-1) * this.size];
		return val ? val : 0;

	};

	this.getPretty = function(x,y) {
		var val = this.get(x,y);
		return (val<10) ? " " + val : val;
	};

	this.moves = [
		[ 1, 2], [ 2, 1],
		[-1, 2], [ 2,-1],
		[ 1,-2], [-2, 1],
		[-1,-2], [-2,-1]
		];
	var movesCount = this.moves.length;	

	this.getMove = function(i,x,y) {
		return [x + this.moves[i][0], 
			y + this.moves[i][1]];
	};

	this.outOfBoard = function(x,y) {
		return (x<1) || (x>this.size) 
		    || (y<1) || (y>this.size);
	};

	this.solve = function(x,y,n) {
		if(this.get(x,y) !== 0) {
			return false;
		}
		this.set(x,y,n);
		if(n >= max) {
			return true;
		}
		if(this.debug)
			this.print();
		for(var i = 0; i< movesCount; i++) {
			var nextMove = this.getMove(i,x,y);
			var nx = nextMove[0];
			var ny = nextMove[1];
			if(!this.outOfBoard(nx,ny) && (this.get(nx,ny) === 0)) {
				if(this.debug) 
					console.log('' + (n+1) + ': trying ' + nx + ', ' + ny);
				if(this.solve(nx,ny,n+1)) {
					return true;
				}
			}
		}
		this.set(x,y, false);
		return false;
	};

	this.solveStack = function(x,y,n) {
		var n = 1;
		var total = 1;
		var stack = new Stack();
		stack.push([x,y,n]);
		this.history[n-1] = this.chessboard.slice();
		while(n<max && !stack.empty()) {
			if(this.debug)
				console.log("run " + total);
			total++;
			var thisMove = stack.pop();
			if(this.debug)
				console.log(thisMove.slice(0,3));
			// [x, y, n] = thisMove
			var x = thisMove[0];
			var y = thisMove[1];
			var n = thisMove[2];
			if(prevN > n) // clean
				this.chessboard = this.history[n-1];
			this.set(x,y,n);
			if(prevN <= n) // save
				this.history[n] = this.chessboard.slice();
			if(this.debug)
				this.print();
			if(n === max) break;
			// can move
			for(i = 0; i < movesCount; i++) {
				var nextMove = this.getMove(i,x,y);
				// [ax, ay] = nextMove
				var ax = nextMove[0];
				var ay = nextMove[1];
				if(!this.outOfBoard(ax,ay) && (this.get(ax,ay) === 0)) {
					stack.push([ax, ay, n+1]);
				}
			}
			var prevN = n;
		}
	};

	this.run = function() {
		this.solveStack(1,1,1);
		this.print();
	};

	this.test = function() {
		console.log("out of board tests");
		console.log("8,8 " + this.outOfBoard(8,8));
		console.log("0,8 " + this.outOfBoard(0,8));
		console.log("1,1 " + this.outOfBoard(1,1));
		console.log("1,9 " + this.outOfBoard(1,9));
		console.log("0,0 " + this.outOfBoard(0,0));
		console.log("9,9 " + this.outOfBoard(9,9));

		this.print();
		this.set(1,1,10);
		this.set(8,8,20);
		this.set(4,4,30);
		this.set(6,6,40);
		this.set(2,7,41);
		this.set(7,2,42);
		this.print();
	};
};

var game = new TheGame(8);
// game.test();
game.run();
	
