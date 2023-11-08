class Board {
  constructor(settings) {
    this.settings = settings;
    this.width = settings.canvas.width;
    this.height = settings.canvas.height;
    this.boardSettings = this.get_board_settings(settings.difficulty);
        
    this.tileSize = min(floor(height/this.boardSettings.rows), floor(width/this.boardSettings.columns));
    this.tiles = this.create_tiles(this.boardSettings.rows, this.boardSettings.columns);
  }

  create_tiles() {
    let tiles = [];
    
    for (let i=0; i<this.boardSettings.rows; i++) {
      for (let j=0; j<this.boardSettings.columns; j++) {
        tiles.push(new Tile([i, j], this.tileSize, false, false));
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

		if (row<rows && column<columns) {
			// If it's a bomb, it's game over
			if (board.tiles[row*columns + column].isBomb) {
				// Reveal all the bombs
				for (let k = 0; k<this.tiles.length; k++) {
					if (this.tiles[k].isBomb) {
						this.tiles[k].revealed = true;
					}
				}
				return -1;
			}
			while (revealCache.length>0) {
				let i = revealCache[0][0];
				let j = revealCache[0][1];

				if(!board.tiles[i*columns + j].revealed && board.tiles[i*columns + j].value == 0 && !board.tiles[i*columns + j].isBomb) {
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
				board.tiles[i*columns + j].revealed = true;
				revealCache.splice(0, 1);
			}
		}
	return 0;
	}

  // Draws all the tiles based on their status
  draw() {
    for (let i=0; i<this.tiles.length; i++) {
      this.tiles[i].draw(this.settings);
    }
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