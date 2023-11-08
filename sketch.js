// For it to run you need a local server (check: https://github.com/processing/p5.js/wiki/Local-server)

function setup() {
  settings = {
    "difficulty": "easy",
  
    "canvas": {
      width: 480,
      height: 480
    },
  
    "bomb": {
      fillColor: color(255, 0, 0),
			bombColor: color(30),
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

	STATE = 0; // 0 -> playing; -1 -> game over
  createCanvas(1+settings.canvas.width, 1+settings.canvas.height);
  board = new Board(settings);

	board.calculate_values();
}

function draw() {
  background(255);
  board.draw();

	if (STATE == -1) {
		push();
		textSize(settings.canvas.width/10);
		textAlign(CENTER);
		fill(255,0,0);
		stroke(0);
		strokeWeight(3);
		text("Game Over!", settings.canvas.width/2, settings.canvas.width/2);
	}
}

function mouseClicked() {
	if (STATE != -1) {
		let i = floor(mouseY/board.tileSize);
		let j = floor(mouseX/board.tileSize);

		STATE = board.reveal(i, j);
	}
}