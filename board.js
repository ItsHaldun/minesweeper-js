class Board {
  constructor(settings) {
    this.settings = settings;
    this.boardSettings = this.get_board_settings(settings.difficulty);

		this.max_height = settings.canvas.height*0.92;
		this.max_width = settings.canvas.width*0.99;

		this.x_offset = settings.canvas.height*0.01;
		this.y_offset = settings.canvas.height*0.05;
        
    this.tileSize = min(floor(this.max_height/this.boardSettings.rows), 
												floor(this.max_width/this.boardSettings.columns));

		this.width = this.boardSettings.columns*this.tileSize;
		this.height = this.boardSettings.rows*this.tileSize;

    this.tiles = this.create_tiles(this.boardSettings.rows, this.boardSettings.columns);

		this.flags = 0;
  }

  create_tiles() {
    let tiles = [];
    
    for (let i=0; i<this.boardSettings.rows; i++) {
      for (let j=0; j<this.boardSettings.columns; j++) {
        tiles.push(new Tile([i, j], this.tileSize, false, false, false, this.x_offset, this.y_offset));
      }
    }

		// Plant the given number of bombs
		let lengthArray = [];
		for (let i=0; i<tiles.length; i++) {
			lengthArray.push(i);
		}

		let bombCounter = 0;
		while (bombCounter<this.boardSettings.bombs) {
			let index = floor(random(lengthArray.length));
			tiles[lengthArray[index]].isBomb = true;
			lengthArray.splice(index, 1);
			bombCounter++;
		}
    return tiles;
  }

	calculate_values() {
		let rows = this.boardSettings.rows;
		let columns = this.boardSettings.columns;
		for (let i=0; i<rows; i++) {
			for (let j=0; j<columns; j++) {
				// Pass calculation if it's a bomb
				if (this.tiles[((i)*columns) + j].isBomb) {
					continue;
				}

				let val = 0;
				if (j>0) {
					val += (this.tiles[((i)*columns) + j - 1].isBomb) ? 1:0;
				}
				if (j<columns-1) {
					val += (this.tiles[((i)*columns) + j + 1].isBomb) ? 1:0;
				}
				if (i<rows-1) {
					val += (this.tiles[((i+1)*columns) + j].isBomb) ? 1:0;
					if (j<columns-1) {
						val += (this.tiles[((i+1)*columns) + j + 1].isBomb) ? 1:0;
					}
					if (j>0) {
						val += (this.tiles[((i+1)*columns) + j - 1].isBomb) ? 1:0;
					}
				}
				if(i>0) {
					val += (this.tiles[((i-1)*columns) + j].isBomb) ? 1:0;
					if (j<columns-1) {
						val += (this.tiles[((i-1)*columns) + j + 1].isBomb) ? 1:0;
					}
					if (j>0) {
						val += (this.tiles[((i-1)*columns) + j - 1].isBomb) ? 1:0;
					}
				}

				this.tiles[(i*columns) + j].value = val;
			}
		}
	}

	reveal(row, column) {
		let revealCache = [[row, column]];
		let rows = this.boardSettings.rows;
		let columns = this.boardSettings.columns;
		let onClick = true;

		if (row<rows && column<columns) {
			// If the tile is flagged, do nothing
			if (this.tiles[row*columns + column].flagged) {
				return 0;
			}
			// If it's a bomb, it's game over
			else if (this.tiles[row*columns + column].isBomb) {
				// Reveal all the bombs
				return this.trigger_end();
			}

			while (revealCache.length>0) {
				let i = revealCache[0][0];
				let j = revealCache[0][1];

				// Chording
				if(this.tiles[i*columns + j].revealed && this.tiles[i*columns + j].value > 0 && !this.tiles[i*columns + j].isBomb && onClick) {
					onClick = false;
					let flag_count = 0;
					let bomb_count = 0;
					
					// Check if number of bombs and flags are equal
					for(let n=-1; n<=1; n++) {
						for (let m = -1; m<=1; m++) {
							if (n==0 && m==0) {
								continue;
							}
							// Check for edge cases
							if (i+n<rows && i+n>=0 && j+m<columns && j+m>=0) {
								flag_count += this.tiles[(i+n)*columns + (j+m)].flagged ? 1:0;
								bomb_count += this.tiles[(i+n)*columns + (j+m)].isBomb ? 1:0;
							}
						}
					}
					// Reveal the squares
					if (flag_count==bomb_count) {
						for(let n=-1; n<=1; n++) {
							for (let m = -1; m<=1; m++) {
								if (n==0 && m==0) {
									continue;
								}

								if (i+n<rows && i+n>=0 && j+m<columns && j+m>=0) {
									// If you had a unflagged bomb, game over
									if (this.tiles[(i+n)*columns + (j+m)].isBomb && !this.tiles[(i+n)*columns + (j+m)].flagged) {
										return this.trigger_end();
									}
									// If the square is not revealed and is not flagged, then reveal it
									if (!this.tiles[(i+n)*columns + (j+m)].revealed && !this.tiles[(i+n)*columns + (j+m)].flagged) {
										revealCache.push([i+n, j+m]);
									}
								}
							}
						}
					}
				}

				if(!this.tiles[i*columns + j].revealed && this.tiles[i*columns + j].value == 0 && !this.tiles[i*columns + j].isBomb) {
					onClick = false;
					if (j>0) {
						revealCache.push([i, j-1]);
					}
					if (j<columns-1) {
						revealCache.push([i, j+1]);
					}
					if (i<rows-1) {
						revealCache.push([i+1, j]);
						if (j<columns-1) {
							revealCache.push([i+1, j+1]);
						}
						if (j>0) {
							revealCache.push([i+1, j-1]);
						}
					}
					if(i>0) {
						revealCache.push([i-1, j]);
						if (j<columns-1) {
							revealCache.push([i-1, j+1]);
						}
						if (j>0) {
							revealCache.push([i-1, j-1]);
						}
					}
				}
				this.tiles[i*columns + j].revealed = true;
				if(this.tiles[i*columns + j].flagged) {
					this.flags += -1;
					this.tiles[i*columns + j].flagged = false;
				}
				revealCache.splice(0, 1);
			}
		}
	return 0;
	}

	plant_flag(row, column) {
		if(!this.tiles[row*this.boardSettings.columns + column].revealed) {
			// Flip flag status
			this.tiles[row*this.boardSettings.columns + column].flagged = 
			!this.tiles[row*this.boardSettings.columns + column].flagged;
		
			if (this.tiles[row*this.boardSettings.columns + column].flagged) {
				this.flags += 1;
			}
			else {
				if (this.flags > 0) {
					this.flags += -1;
				}
			}
		}
	}

	// Triggers all bombs and finishes the game
	trigger_end() {
		for (let k = 0; k<this.tiles.length; k++) {
			if (this.tiles[k].isBomb) {
				this.tiles[k].revealed = true;
			}
		}
		return -1;
	}

  // Draws all the tiles based on their status
  draw() {
    for (let i=0; i<this.tiles.length; i++) {
      this.tiles[i].draw(this.settings);
    }
  }

	check_victory() {
		for (let i=0; i<this.tiles.length; i++){
			if (!this.tiles[i].isBomb && !this.tiles[i].revealed) {
				return 0;
			}
			if (!this.tiles[i].isBomb && this.tiles[i].flagged) {
				return 0;
			}
		}
		return 1;
	}

  get_board_settings(difficulty) {
    let settings = {};

    switch (difficulty) {
      case "easy":
        settings = {
          rows: 9,
          columns: 9,
          bombs: 10,
          index: 0
        };
        break;
      case "medium":
        settings = {
          rows: 16,
          columns: 16,
          bombs: 40,
          index: 1
        };
        break;
      case "hard":
        settings = {
          rows: 16,
          columns: 30,
          bombs: 99,
          index: 2
        };
        break;
    }
    return settings;
  }
}