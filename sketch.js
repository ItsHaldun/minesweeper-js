let font;
let text_bounds = [];
let offsets = [];
let difficulty;
let settings;

let timeElapsed;
let counter = setInterval(timer, 1000);

function timer() {
	if (STATE==0) {
		timeElapsed[0] += 1;
	if (timeElapsed[0] % 60 == 0) {
		timeElapsed[0] = 0;
		timeElapsed[1] += 1;
	}
	}
}

function preload() {
  font = loadFont('Inconsolata.otf');
}

function setup() {
	// Disable right click menu
	for (let element of document.getElementsByClassName("p5Canvas")) {
    element.addEventListener("contextmenu", (e) => e.preventDefault());
  }

	timeElapsed = [0, 0];
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
  
    "numbers": [color(0,0,255), color(0,180,0), 
      					color(255,0,0), color(0,0,120), 
      					color(150,0,0), color(0,150,150), 
      					color(0), color(80)],
		
		"endCards": {
			gameOverColor: color(255,0,0),
			winColor: color(0,255,0),
			strokeSize: 5,
			heading_size: min(windowWidth, windowHeight)/7,
			subheading_size:  min(windowWidth, windowHeight)/24,
			backdrop: color(0,0,0, 128)
		}
		
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

	calculate_text_bounds();
}

function draw() {
  background(255);

	draw_header();
  board.draw();

	// Lose
	if (STATE == -1) {
		push();
		//Semi-transparent Backdrop
		fill(settings.endCards.backdrop);
		rect(board.x_offset, board.y_offset, board.width, board.height);
		
		textSize(settings.endCards.heading_size);
		textAlign(CENTER);
		fill(settings.endCards.gameOverColor);
		stroke(0);
		strokeWeight(settings.endCards.strokeSize);
		text("Game Over!", (board.width+board.x_offset)/2, (board.height+board.y_offset)/2);
		end_bound = font.textBounds("Game Over!", (board.width+board.x_offset/2), (board.height+board.y_offset)/2);
		textSize(settings.endCards.subheading_size);
		text("Click to try again", (board.width+board.x_offset)/2, (board.height+board.y_offset)/2 + end_bound.h);
		pop();
	}

	// Win
	if (STATE == 1) {
		push();
		//Semi-transparent Backdrop
		fill(settings.endCards.backdrop);
		rect(board.x_offset, board.y_offset, board.width, board.height);
		
		textSize(settings.endCards.heading_size);
		textAlign(CENTER);
		fill(settings.endCards.winColor);
		stroke(0);
		strokeWeight(settings.endCards.strokeSize);
		text("You Win!", (board.width+board.x_offset)/2, (board.height+board.y_offset)/2);
		end_bound = font.textBounds("You Win!", (board.width+board.x_offset/2), (board.height+board.y_offset)/2);
		textSize(settings.endCards.subheading_size);
		text("Click to try again", (board.width+board.x_offset)/2, (board.height+board.y_offset)/2 + end_bound.h);
		pop();
	}
}


function calculate_text_bounds() {
	push();
	textSize(board.y_offset);
	textAlign(LEFT, BOTTOM);
	stroke(0);
	strokeWeight(1);
	old_bounds = [font.textBounds("easy", 0, 0.98*board.y_offset),
								font.textBounds("medium", 0, 0.98*board.y_offset),
								font.textBounds("hard", 0, 0.98*board.y_offset)];

	offsets = [board.x_offset,
								1.37*old_bounds[0].w+board.x_offset,
								1.4*old_bounds[1].w+1.37*old_bounds[0].w+board.x_offset];
	
	text_bounds = [font.textBounds("easy", offsets[0], 0.98*board.y_offset),
						font.textBounds("medium", offsets[1], 0.98*board.y_offset),
						font.textBounds("hard", offsets[2], 0.98*board.y_offset)];
	pop();
}


function draw_header() {
	push();
	textSize(board.y_offset);
	textAlign(LEFT, BOTTOM);
	stroke(0);
	strokeWeight(1);

	if(difficulty == "easy") {
		fill(0,50,200);
		text("easy", offsets[0], 0.98*board.y_offset);
		fill(0);
		text("medium", offsets[1], 0.98*board.y_offset);
		text("hard", offsets[2], 0.98*board.y_offset);
	}
	else if(difficulty== "medium") {
		fill(0);
		text("easy", offsets[0], 0.98*board.y_offset);
		fill(0,50,200);
		text("medium", offsets[1], 0.98*board.y_offset);
		fill(0);
		text("hard", offsets[2], 0.98*board.y_offset);
	}
	else {
		fill(0);
		text("easy", offsets[0], 0.98*board.y_offset);
		text("medium", offsets[1], 0.98*board.y_offset);
		fill(0,50,200);
		text("hard", offsets[2], 0.98*board.y_offset);
	}
	pop();


	// Draw the timer
	push();
	textSize(board.y_offset);
	textAlign(RIGHT, BOTTOM);
	stroke(0);
	strokeWeight(1);
	fill(200,0,0);
	text(String(timeElapsed[1]).padStart(2, '0') + ":" + String(timeElapsed[0]).padStart(2, '0'), (1.2*board.width+offsets[2])/2, 0.98*board.y_offset);
	pop();
	
	// Draw the Remaining Bombs
	let remaining = floor(board.boardSettings.bombs - board.flags);
	push();
	textSize(board.y_offset);
	textAlign(RIGHT, BOTTOM);
	stroke(0);
	strokeWeight(1);
	fill(200,0,0);
	text(remaining, board.width, 0.98*board.y_offset);
	pop();
}


function mousePressed() {
	if ((mouseY < board.y_offset) && (mouseY > 0)) {
		if(mouseButton === LEFT) {
			if (mouseX<text_bounds[0].x+text_bounds[0].w && mouseX>text_bounds[0].x) {
				difficulty = storeItem("difficulty", "easy");
				setup();
			}
			else if (mouseX<text_bounds[1].x+text_bounds[1].w && mouseX>text_bounds[1].x) {
				difficulty = storeItem("difficulty", "medium");
				setup();
			}
			else if (mouseX<text_bounds[2].x+text_bounds[2].w && mouseX>text_bounds[2].x) {
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

		// Left Click reveals tile
		if(mouseButton === LEFT) {
			STATE = board.reveal(i, j);

			if (STATE == -1) {
				return -1;
			}

			// check win condition
			STATE = board.check_victory();
		}

		// Right Click plants flags
		if(mouseButton === RIGHT && STATE == 0) {
			let i = floor((mouseY-board.y_offset)/board.tileSize);
			let j = floor((mouseX-board.x_offset)/board.tileSize);

			if (i<0 || j < 0) {
				return 0;
			}

			if (STATE == -1) {
				return -1;
			}

			board.plant_flag(i, j);

			// check win condition
			STATE = board.check_victory();
		}
	}
	else {
		location.reload();
	}
}