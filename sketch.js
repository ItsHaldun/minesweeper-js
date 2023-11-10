// For it to run you need a local server (check: https://github.com/processing/p5.js/wiki/Local-server)

let font;
let text_bounds = [];
let difficulty;
let textWidth;

function preload() {
  font = loadFont('assets/inconsolata.otf');
}

function setup() {
	textWidth = windowWidth;
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

	difficulty = getItem("difficulty");
	if (difficulty === null) {
		difficulty = "easy";
	}
	settings.difficulty = difficulty;

	STATE = 0; // 0 -> playing; -1 -> game over; 1 -> won
  canvas = createCanvas(1+settings.canvas.width, 1+settings.canvas.height);
  board = new Board(settings);

	board.calculate_values();
}

function draw() {
  background(255);

	text_bounds = draw_difficulty_settings();
  board.draw();

	// Lose
	if (STATE == -1) {
		push();
		//Semi-transparent Backdrop
		fill(0,0,0, 90);
		rect(board.x_offset, board.y_offset, board.width, board.height);
		
		textSize(settings.canvas.width/12);
		textAlign(CENTER);
		fill(255,0,0);
		stroke(0);
		strokeWeight(3);
		text("Game Over!", (board.width+board.x_offset)/2, (board.height+board.y_offset)/2);
		pop();
	}

	// Win
	if (STATE == 1) {
		push();
		//Semi-transparent Backdrop
		fill(0,0,0, 90);
		rect(board.x_offset, board.y_offset, board.width, board.height);
		
		textSize(settings.canvas.width/12);
		textAlign(CENTER);
		fill(0,255,0);
		stroke(0);
		strokeWeight(3);
		text("You Win!", (board.width+board.x_offset)/2, (board.height+board.y_offset)/2);
		pop();
	}
}

function draw_difficulty_settings() {
	push();
	textSize(board.y_offset);
	textAlign(CENTER, BOTTOM);
	stroke(0);
	strokeWeight(1);

	old_bounds = [font.textBounds("easy", 1.1*board.x_offset, 0.98*board.y_offset),
						font.textBounds("medium", 0.3*board.width+1.1*board.x_offset, 0.9*board.y_offset),
						font.textBounds("hard", 0.55*board.width+board.x_offset, 0.9*board.y_offset)];

	if(difficulty == "easy") {
		fill(0,50,200);
		text("easy", 1.2*old_bounds[0].w/2+board.x_offset, 0.98*board.y_offset);
		fill(0);
		text("medium", 0.1*textWidth+1.2*old_bounds[1].w/2+board.x_offset, 0.98*board.y_offset);
		text("hard", 0.24*textWidth+1.2*old_bounds[2].w/2+board.x_offset, 0.98*board.y_offset);
	}
	else if(difficulty== "medium") {
		fill(0);
		text("easy", 1.2*old_bounds[0].w/2+board.x_offset, 0.98*board.y_offset);
		fill(0,50,200);
		text("medium", 0.1*textWidth+1.2*old_bounds[1].w/2+board.x_offset, 0.98*board.y_offset);
		fill(0);
		text("hard", 0.24*textWidth+1.2*old_bounds[2].w/2+board.x_offset, 0.98*board.y_offset);
	}
	else {
		fill(0);
		text("easy", 1.2*old_bounds[0].w/2+board.x_offset, 0.98*board.y_offset);
		text("medium", 0.1*textWidth+1.2*old_bounds[1].w/2+board.x_offset, 0.98*board.y_offset);
		fill(0,50,200);
		text("hard", 0.24*textWidth+1.2*old_bounds[2].w/2+board.x_offset, 0.98*board.y_offset);
	}
	pop();

	bounds = [font.textBounds("easy", 1.2*old_bounds[0].w/2+board.x_offset, 0.98*board.y_offset),
						font.textBounds("medium", 0.1*textWidth+1.2*old_bounds[1].w/2+board.x_offset, 0.98*board.y_offset),
						font.textBounds("hard", 0.24*textWidth+1.2*old_bounds[2].w/2+board.x_offset, 0.98*board.y_offset)];

	return bounds;
}

// For flags, unfortunately
function keyPressed() {
	if(keyCode === 70 && STATE == 0) {
		let i = floor((mouseY-board.y_offset)/board.tileSize);
		let j = floor((mouseX-board.x_offset)/board.tileSize);

		if (i<0 || j < 0) {
			return 0;
		}

		board.plant_flag(i, j);
		// check win condition
		STATE = board.check_victory();
	}
}

function mouseClicked() {
	if (mouseY < board.y_offset) {
		if(mouseButton === LEFT) {
			if (mouseX>text_bounds[0].x-2*text_bounds[0].w/2 && mouseX<text_bounds[0].x+2*text_bounds[0].w/2) {
				difficulty = storeItem("difficulty", "easy");
				setup();
			}
			else if (mouseX>text_bounds[1].x-2*text_bounds[1].w/2 && mouseX<text_bounds[1].x+2*text_bounds[1].w) {
				difficulty = storeItem("difficulty", "medium");
				setup();
			}
			else if (mouseX>text_bounds[2].x-2*text_bounds[2].w/2 && mouseX<text_bounds[2].x+2*text_bounds[2].w) {
				difficulty = storeItem("difficulty", "hard");
				setup();
			}
		}
	}

	if (STATE == 0) {
		let i = floor((mouseY-board.y_offset)/board.tileSize);
		let j = floor((mouseX-board.x_offset)/board.tileSize);

		if (i<0 || j < 0) {
			return 0;
		}

		if(mouseButton === LEFT) {
			STATE = board.reveal(i, j);

			if (STATE == -1) {
				return -1;
			}

			// check win condition
			STATE = board.check_victory();
		}
	}
}