// For it to run you need a local server (check: https://github.com/processing/p5.js/wiki/Local-server)

function setup() {
  settings = {
    "difficulty": "easy",
  
    "canvas": {
      width: windowWidth,
      height: windowHeight
    },
  
    "bomb": {
      fillColor: color(255, 0, 0),
			bombColor: color(30),
      strokeColor: color(0),
      strokeWeight: 3
    },

		"flag": {
			flagColor: color(255,0,0),
      strokeColor: color(0),
      strokeWeight: 3
    },
  
    "tile": {
      hiddenFillColor: color(80),
      revealedFillColor: color(180),
      strokeColor: color(0),
      strokeWeight: 2
    },
  
    "text": [color(0,0,255), color(0,180,0), 
      color(255,0,0), color(0,0,120), 
      color(150,0,0), color(0,150,150), 
      color(0), color(80)]
  };

	STATE = 0; // 0 -> playing; -1 -> game over; 1 -> won
  canvas = createCanvas(1+settings.canvas.width, 1+settings.canvas.height);
  board = new Board(settings);

	board.calculate_values();
}

function draw() {
  background(255);
  board.draw();

	if (STATE == -1) {
		push();
		//Semi-transparent Backdrop
		fill(0,0,0, 90);
		rect(0, 0, board.width, board.height);
		
		textSize(settings.canvas.width/12);
		textAlign(CENTER);
		fill(255,0,0);
		stroke(0);
		strokeWeight(3);
		text("Game Over!", board.width/2, board.height/2);
		pop();
	}
}

// For flags, unfortunately
function keyPressed() {
	let i = floor(mouseY/board.tileSize);
	let j = floor(mouseX/board.tileSize);

	if(keyCode === 70) {
		board.plant_flag(i, j);
	}

	// TODO
	// check flag win condition
}

function mouseClicked() {
	// TODO
	// Check revealed win condition

	if (STATE != -1) {
		let i = floor(mouseY/board.tileSize);
		let j = floor(mouseX/board.tileSize);

		if(mouseButton === LEFT) {
			STATE = board.reveal(i, j);
		}
	}
}