class Board {
  constructor(height, width, playedShapes) {
    this.height = height;
    this.width = width;

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

  // Prepare for rendering by adding visual effects
  augment(mouse, ghost, ghostAnchor) {
    this.drawBoundaries();

    // Draw the ghost
    this.drawShape(ghost, ghostAnchor, 'ghost');
  }
}

export default Board;
