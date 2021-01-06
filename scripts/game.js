class Game extends App {
  constructor(parentElement, size = 4) {
    super();
    const lastGameField = super.gameFieldToArray(super.findItemInLocalStorage("savedGame") || "");
    const lastGameScore = super.findItemInLocalStorage("savedScore");
    this.size = lastGameField ? lastGameField.length : size;
    const gameFieldElement = super.createAndAppend({
      className: "game-container",
      parentElement
    });
    this.headerElement = super.createAndAppend({
      className: "game-header",
      parentElement: gameFieldElement
    });
    this.gameScoreContainer = super.createAndAppend({
      className: "game-score-container",
      parentElement: this.headerElement
    });
    this.gameScoreItem = super.createAndAppend({
      className: "game-score-item",
      parentElement: this.gameScoreContainer
    });
    this.bestGameScoreItem = super.createAndAppend({
      className: "game-best-score-item",
      parentElement: this.gameScoreContainer
    });
    const newGameBtn = super.createAndAppend({
      className: "new-game_btn",
      parentElement: this.headerElement
    });
    const previousStateBtn = super.createAndAppend({
      className: "previous-state_btn",
      parentElement: this.headerElement
    });
    this.score = +lastGameScore || 0;
    this.bestScore = super.findItemInLocalStorage("best_score") || 0;

    const fieldElement = super.createAndAppend({
      className: "game-field",
      parentElement: gameFieldElement
    });

    
    this.field = [];
    let i, k;
    for (i = 0; i < size; i += 1) {
      this.field[i] = [];
      for (k = 0; k < size; k += 1) {
        let value = lastGameField.length ? lastGameField[i][k][0] : null;
        this.field[i][k] = new Cell(fieldElement, this, value);
      }
    }
    
  
    

    addEventListener("keyup", event => {
      switch (event.keyCode) {
        case 38:
          this.moveUp();
          break;
        case 40:
          this.moveDown();
          break;
        case 37:
          this.moveLeft();
          break;
        case 39:
          this.moveRight();
          break;
      }
    });
    newGameBtn.addEventListener("click", () => {
      this.field = 0;
      this.score = 0;
      location.href = location.href;
    });
    previousStateBtn.addEventListener("click", () => {
      new Promise((resolve, reject) => {
        location.href = location.href;
        resolve();
    }).then(
        () => {
            localStorage.setItem("savedGame", localStorage.getItem("previousMove"));
            localStorage.setItem("savedScore", localStorage.getItem("previousMoveScore"));
        })
    })
    window.onbeforeunload = function() {
      localStorage.setItem("savedGame", App.gameFieldToString(game.field));
      localStorage.setItem("savedScore", game.score);
    };
  }

  set score(value) {
    this._score = value;
    this.gameScoreItem.innerHTML = "Score: " + value + "</br>";
  }

  get score() {
    return this._score;
  }

  set bestScore(value) {
    this._bestScore = value;
    this.bestGameScoreItem.innerHTML = "Best score: " + value;
  }

  get bestScore(){
    return this._bestScore;
  }

  spawnUnit() {
    let emptyCells = [],
      i,
      k;
    for (i = 0; i < this.field.length; i += 1) {
      for (k = 0; k < this.field.length; k += 1) {
        if (!this.field[i][k].value) {
          emptyCells.push(this.field[i][k]);
        }
      }
    }
    if (emptyCells.length) {
      let cell = emptyCells[super.getRandomInt(0, emptyCells.length - 1)];
      cell.spawn(cell);
    } else {
      alert("You lose!");
    }
  }

  moveRight() {
    this.saveCurrentField(this.field);
    this.saveCurrentScore(this.score);
    let i, k, nextCell, nextCellKey, hasMoved, currentCell;
    for (i = 0; i < this.size; i += 1) {
      for (k = this.size - 2; k >= 0; k -= 1) {
        currentCell = this.field[i][k];
        if (currentCell.isEmpty && this.field[i][k + 1].isEmpty) {
          continue;
        }

        nextCellKey = k + 1;
        while (nextCellKey < this.size) {
          nextCell = this.field[i][nextCellKey];
          if (!nextCell.isEmpty || this.isLastKey(nextCellKey)) {
            if (
              (nextCell.isEmpty && this.isLastKey(nextCellKey)) ||
              nextCell.isSameTo(currentCell)
            ) {
              this.field[i][nextCellKey].merge(currentCell);
              hasMoved = true;
            } else if (!nextCell.isEmpty && nextCellKey - 1 != k) {
              this.field[i][nextCellKey - 1].merge(currentCell);
              hasMoved = true;
            }
            break;
          }
          nextCellKey += 1;
          nextCell = this.field[i][nextCellKey];
        }
      }
    }
    hasMoved && this.spawnUnit();
  }
  isLastKey(key) {
    return key == this.size - 1;
  }
  isFirstKey(key) {
    return key == 0;
  }

  moveLeft() {
    this.saveCurrentField(this.field);
    this.saveCurrentScore(this.score);
    let i, k, nextCell, nextCellKey, hasMoved, currentCell;
    for (i = 0; i < this.size; i += 1) {
      for (k = 1; k < this.size; k += 1) {
        currentCell = this.field[i][k];
        if (currentCell.isEmpty) {
          continue;
        }

        nextCellKey = k - 1;
        while (nextCellKey >= 0) {
          nextCell = this.field[i][nextCellKey];
          if (!nextCell.isEmpty || this.isFirstKey(nextCellKey)) {
            if (
              (nextCell.isEmpty && this.isFirstKey(nextCellKey)) ||
              nextCell.isSameTo(currentCell)
            ) {
              this.field[i][nextCellKey].merge(currentCell);
              hasMoved = true;
            } else if (!nextCell.isEmpty && nextCellKey + 1 != k) {
              this.field[i][nextCellKey + 1].merge(currentCell);
              hasMoved = true;
            }
            break;
          }
          nextCellKey -= 1;
          nextCell = this.field[i][nextCellKey];
        }
      }
    }
    hasMoved && this.spawnUnit();
  }

  moveDown() {
    this.saveCurrentField(this.field);
    this.saveCurrentScore(this.score);
    let i, k, nextCell, nextCellKey, hasMoved, currentCell;
    for (k = 0; k < this.size; k += 1) {
      for (i = this.size - 2; i >= 0; i -= 1) {
        currentCell = this.field[i][k];
        if (currentCell.isEmpty) {
          continue;
        }

        nextCellKey = i + 1;
        while (nextCellKey < this.size) {
          nextCell = this.field[nextCellKey][k];
          if (!nextCell.isEmpty || this.isLastKey(nextCellKey)) {
            if (
              (nextCell.isEmpty && this.isLastKey(nextCellKey)) ||
              nextCell.isSameTo(currentCell)
            ) {
              this.field[nextCellKey][k].merge(currentCell);
              hasMoved = true;
            } else if (!nextCell.isEmpty && nextCellKey - 1 != i) {
              this.field[nextCellKey - 1][k].merge(currentCell);
              hasMoved = true;
            }
            break;
          }
          nextCellKey += 1;
          nextCell = this.field[nextCellKey][k];
        }
      }
    }
    hasMoved && this.spawnUnit();
  }

  moveUp() {
    this.saveCurrentField(this.field);
    this.saveCurrentScore(this.score);
    let i, k, nextCell, nextCellKey, hasMoved, currentCell;
    for (k = 0; k < this.size; k += 1) {
      for (i = 1; i < this.size; i += 1) {
        currentCell = this.field[i][k];
        if (currentCell.isEmpty) {
          continue;
        }

        nextCellKey = i - 1;
        while (nextCellKey >= 0) {
          nextCell = this.field[nextCellKey][k];
          if (!nextCell.isEmpty || this.isFirstKey(nextCellKey)) {
            if (
              (nextCell.isEmpty && this.isFirstKey(nextCellKey)) ||
              nextCell.isSameTo(currentCell)
            ) {
              this.field[nextCellKey][k].merge(currentCell);
              hasMoved = true;
            } else if (!nextCell.isEmpty && nextCellKey + 1 != i) {
              this.field[nextCellKey + 1][k].merge(currentCell);
              hasMoved = true;
            }
            break;
          }
          nextCellKey -= 1;
          nextCell = this.field[nextCellKey][k];
        }
      }
    }
    hasMoved && this.spawnUnit();
  }

  onCellMerge(value) {
    this.score += value;
    if(this.checkBestScore(this.score)){
      this.bestScore = this.score;
    }
  }

  saveCurrentField (field) {
    localStorage.setItem("previousMove", App.gameFieldToString(field));
  }

  saveCurrentScore (value) {
    localStorage.setItem("previousMoveScore", value);
  }

  checkBestScore(value) {
    if( super.findItemInLocalStorage("best_score") < value){
      localStorage.setItem("best_score", value);
      return true;
    }
  }
}
