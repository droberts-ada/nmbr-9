class Board {
  constructor(height, width, playedShapes) {
    this.height = height;
    this.width = width;
    this.playedShapes = playedShapes;

    // Fill in the default (empty) board state

    // We'll use a fake shape for empty space to keep other code
    // simple - it's safe to assume that every square has a shape
    const emptySpace = {
      color: 'white',
      level: -1,
    }

    this.squares = [];
    for (let r = 0; r < height; r++) {
      const row = [];
      for (let c = 0; c < width; c++) {
        row.push({
          type: 'empty',
          shape: emptySpace,
        });
      }
      this.squares.push(row);
    }

    // Draw all played pieces
    playedShapes.forEach((shape) => {
      this.drawShape(shape, shape.anchor, 'played');
    });
  }

  drawShape(shape, anchor, type) {
    for (let r = 0; r < shape.footprint.rows; r++) {
      for (let c = 0; c < shape.footprint.cols; c++) {
        if (shape.squares[r][c]) {
          this.squares[anchor.row + r][anchor.col + c] = {
            type: type,
            shape: shape,
          };
        }
      }
    }
  }

  // Borders between shapes on different levels
  drawBoundaries() {
    // left-right
    for (let r = 0; r < this.height; r++) {
      for (let c = 0; c < this.width - 1; c++) {
        const lSquare = this.squares[r][c];
        const rSquare = this.squares[r][c + 1];
        const difference = Math.abs(lSquare.shape.level - rSquare.shape.level);
        lSquare.borders = { ...lSquare.borders, right: difference };
        rSquare.borders = { ...rSquare.borders, left: difference };
      }
    }

    // Top-bottom
    for (let c = 0; c < this.width; c++) {
      for (let r = 0; r < this.height - 1; r++) {
        const tSquare = this.squares[r][c];
        const bSquare = this.squares[r + 1][c];
        const difference = Math.abs(tSquare.shape.level - bSquare.shape.level);
        tSquare.borders = { ...tSquare.borders, bottom: difference };
        bSquare.borders = { ...bSquare.borders, top: difference };
      }
    }
  }

  drawLevelOpacity() {
    const maxLevel = Math.max(...this.playedShapes.map(s => s.level));
    for (let r = 0; r < this.height; r++) {
      for (let c = 0; c < this.width; c++) {
        const square = this.squares[r][c];
        square.opacity = 1.0 - (.1 * (maxLevel - square.shape.level));
      }
    }
  }

  // Prepare for rendering by adding visual effects
  augment(mouse, ghost, ghostAnchor) {
    const unAugmented = JSON.parse(JSON.stringify(this.squares))

    this.drawBoundaries();

    this.drawLevelOpacity();

    // TODO: ghost validity

    // Draw the ghost
    this.drawShape(ghost, ghostAnchor, 'ghost');

    // Restore the unaugmented version
    const copy = this.squares;
    this.squares = unAugmented;
    return copy;
  }

  // -1 -> invalid placement
  // non-negative -> what level it will live at
  findLevel(current) {
    let level = null;
    const supports = new Set();

    // Look at supporting tiles (level below)
    for (let r = 0; r < current.footprint.rows; r++) {
      const boardRow = r + current.anchor.row;
      for (let c = 0; c < current.footprint.cols; c++) {
        if (!current.squares[r][c]) {
          continue;
        }

        const boardCol = c + current.anchor.col;
        const playedShape = this.squares[boardRow][boardCol].shape;

        if (level === null) {
          // First square for this shape
          if (playedShape) {
            level = playedShape.level;
          } else {
            level = -1;
          }

        } else if (level !== playedShape.level) {
          console.debug(`Level mismatch`);
          return -1;

        }

        if (playedShape) {
          supports.add(playedShape);
        }
      }
    }

    // The level we've recorded so far is the level of supporting shapes
    // on the board. Our new shape will be one above that.
    level += 1;

    // Level 0 shapes can be unsupported, otherwise we need
    // at least two unique support shapes.
    // Does this check make sense here?
    if (level !== 0 && supports.size < 2) {
      console.debug('Not enough support shapes');
      return -1;
    }

    return level;
  }

  checkAdjacent(current, level) {
    // For each square on the new shape...
    for (let r = 0; r < current.footprint.rows; r++) {
      const boardRow = r + current.anchor.row;
      for (let c = 0; c < current.footprint.cols; c++) {
        if (!current.squares[r][c]) {
          continue;
        }

        const boardCol = c + current.anchor.col;

        // Look at all the adjacent squares in the board
        // Since current has not been added to the board yet
        // we don't need to worry about avoiding our own squares.
        // If we've gotten this far we know any square that current
        // occupies will be level-1 in board.
        let found = false;
        // Above
        found = found || (
          boardRow > 0 &&
          this.squares[boardRow-1][boardCol].shape &&
          this.squares[boardRow-1][boardCol].shape.level >= level
        );

        // Below
        found = found || (
          boardRow < this.height - 1 &&
          this.squares[boardRow+1][boardCol].shape &&
          this.squares[boardRow+1][boardCol].shape.level >= level
        );

        // Left
        found = found || (
          boardCol > 0 &&
          this.squares[boardRow][boardCol-1].shape &&
          this.squares[boardRow][boardCol-1].shape.level >= level
        );

        // Right
        found = found || (
          boardCol < this.width - 1 &&
          this.squares[boardRow][boardCol+1].shape &&
          this.squares[boardRow][boardCol+1].shape.level >= level
        );

        if (found) {
          return true;
        }
      }
    }

    console.log(`No adjacent shape on this level`);
    return false;
  }

  // Check whether a play is valid, and set the level
  // at which it can be played.
  // TODO: Figure out how to test this
  checkPlay(current) {
    // First play is always valid, and always on level 0
    if (this.playedShapes.length === 0) {
      current.level = 0;
      return true;
    }

    // 3 rules for a valid play:
    // - Each tile in the shape must be supported by the level below
    // - A shape must be supported by two or more distinct shapes on
    //   the lower level
    // - If there's already a shape on this level, the current shape
    //   must be adjacent to a shape on this level
    const level = this.findLevel(current);
    if (level === -1) {
      return false;
    }

    // Look at adjacent tiles (same level)
    // If one exists, our new shape must touch another shape on this level
    if (this.playedShapes.some(s => s.level == level) &&
        !this.checkAdjacent(current, level)) {
      return false;
    }

    current.level = level;
    return true;
  }
}

export default Board;
