class Tile {
  constructor(index, size, isBomb=false, revealed=false, flagged=false, xoffset=0, yoffset=0) {
    this.index = index;
    this.x = index[1] * size + xoffset;
    this.y = index[0] * size + yoffset;
    this.size = size;
    this.isBomb = isBomb;
    this.revealed = revealed;
    this.flagged = flagged;
    this.value = 0;
    
    this.fontSize = this.size*0.8;
  }

  draw(settings) {
    push();
    // Draw the normal tile
    if (this.revealed && !this.isBomb) {
      fill(settings.tile.revealedFillColor);
    }
		else if (this.revealed && this.isBomb) {
      fill(settings.bomb.fillColor);
    }
    else {
      fill(settings.tile.hiddenFillColor);
    }
    stroke(settings.tile.strokeColor);
    strokeWeight(settings.tile.strokeWeight);
    rect(this.x, this.y, this.size, this.size);
    pop();

		
		// Draw the bomb
		if (this.revealed && this.isBomb) {
			push();
      fill(settings.bomb.bombColor);
			stroke(settings.bomb.strokeColor);
			strokeWeight(settings.bomb.strokeWeight);
			ellipseMode(CENTER);
			// Pins
			rect(this.x+this.size*0.45, this.y+this.size*0.1, this.size*0.1, this.size*0.1);
			rect(this.x+this.size*0.45, this.y+this.size*0.8, this.size*0.1, this.size*0.1);
			rect(this.x+this.size*0.1, this.y+this.size*0.45, this.size*0.1, this.size*0.1);
			rect(this.x+this.size*0.8, this.y+this.size*0.45, this.size*0.1, this.size*0.1);

			rect(this.x+this.size*0.23, this.y+this.size*0.23, this.size*0.1, this.size*0.1);
			rect(this.x+this.size*0.67, this.y+this.size*0.23, this.size*0.1, this.size*0.1);
			rect(this.x+this.size*0.23, this.y+this.size*0.67, this.size*0.1, this.size*0.1);
			rect(this.x+this.size*0.67, this.y+this.size*0.67, this.size*0.1, this.size*0.1);

			// Center
			circle(this.x+this.size*0.5, this.y+this.size*0.5, this.size*0.6);
			pop();
    }

		// Draw the flag
		if (!this.revealed && this.flagged) {
			push();
      fill(settings.flag.flagColor);
			stroke(settings.flag.strokeColor);
			strokeWeight(settings.bomb.strokeWeight);
			// The flag
			triangle(this.x+this.size*0.2, this.y+this.size*0.3, 
							this.x+this.size*0.5, this.y+this.size*0.1,
							this.x+this.size*0.5, this.y+this.size*0.5);
			stroke(0);
			fill(0);
			// The pole
			line(this.x+this.size*0.5, this.y+this.size*0.5, 
				this.x+this.size*0.5, this.y+this.size*0.7);
			// The base
			rect(this.x+this.size*0.25, this.y+this.size*0.7, this.size*0.5, this.size*0.1);
			pop();
    }

    // Draw the text
    if (this.revealed && !this.isBomb) {
      if (this.value>0) {
        push();
        fill(settings.numbers[this.value-1]);
        noStroke();
        textAlign(CENTER);
        textSize(this.fontSize);
        text(this.value, this.x+0.5*this.size, this.y+0.75*this.size);
        pop();
      }
    }
  }
}