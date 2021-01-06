class Cell extends App {
  constructor(fieldElement, game, savedValue) {
    super();
    this.game = game;
    this.fieldElement = fieldElement;
    this.element = super.createAndAppend({
      className: "game-field__cell",
      parentElement: fieldElement
    });
    if(savedValue != null){
      this.spawn(savedValue);
    } else{
      if (Math.random() > 0.8) {
      this.spawn();
      }
    }
  }
  get value() {
    return this._value || 0;
  }

  set value(value) {
    this._value = value;
    this.element.innerHTML = value == 0 ? "" : value;
    this.element.setAttribute("data-cell", value);
  }

  spawn(savedValue) {
    if(typeof savedValue == "number"){
      this.value = savedValue;
    } else {
      this.value = Math.random() > 0.85 ? 4 : 2;
    }
    this.highlight("game-field__cell-highlight-new");
  }

  clear() {
    this.value = "";
  }

  merge(cell) {
    if (this.value) {
      this.game.onCellMerge(this.value + cell.value);
    }
    new AnimateCell(cell, this);
    this.value += cell.value;
    this.highlight();
    cell.clear();
  }

  isSameTo(cell) {
    return this.value == cell.value;
  }

  get isEmpty() {
    return this.value == 0;
  }

  highlight(className = "game-field__cell-highlight") {
    this.element.className = "game-field__cell " + className;
    let highlightTime = 200;
    let highlightStartTime = new Date();
    this.highlightStartTime = highlightStartTime;
    setTimeout(
      function() {
        if (highlightStartTime == this.highlightStartTime) {
          this.element.className = "game-field__cell";
        }
      }.bind(this),
      highlightTime
    );
  }
}

class AnimateCell extends Cell {
  constructor(fromCell, toCell) {
    super();
    this.element = super.createAndAppend({
      className: "game-field__cell game-field__cell-animate"
    });
    this.element.setAttribute(
      "data-cell",
      fromCell.element.getAttribute("data-cell")
    );

    this.element.style.top = fromCell.element.offsetTop + "px";
    this.element.style.left = fromCell.element.offsetLeft + "px";

    fromCell.fieldElement.appendChild(this.element);

    this.element.style.top = toCell.element.offsetTop + "px";
    this.element.style.left = toCell.element.offsetLeft + "px";

    setTimeout(
      function() {
        fromCell.fieldElement.removeChild(this.element);
      }.bind(this),
      1000
    );
  }
}
