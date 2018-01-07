import React, { Component } from 'react';
import './App.css';

import Board from './Board';
import InfoBar from './InfoBar';

import SHAPES from './shapes.js';

const getGameShapes = function(names) {
  return names.map((name) => {
    return Object.assign({text: name}, SHAPES[name]);
  });
}

// Fisher-Yates algorithm, ala https://stackoverflow.com/a/6274381/1513338
Array.prototype.shuffle = function arrayShuffle() {
  for (let i = this.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [this[i], this[j]] = [this[j], this[i]];
  }
  return this;
}

class App extends Component {
  constructor(props) {
    super(props);

    const tiles = ['0', '0', '1', '1', '2', '2', '3', '3', '4', '4',
    '5', '5', '6', '6', '7', '7', '8', '8', '9', '9',];
    const shapes = getGameShapes(tiles);
    shapes.shuffle();
    const currentShape = shapes.pop();

    const boardHeight = 20;
    const boardWidth = 20;

    this.state = {
      shapes: {
        current: currentShape,
        unplayed: shapes,
        played: [],
      },
      boardHeight: boardHeight,
      boardWidth: boardWidth,
    }
  }

  // Check whether a play is valid, and set the level
  // at which it can be played.
  // TODO: Figure out how to test this
  checkPlay(current) {
    // First play is always valid, and always on level 0
    if (this.state.shapes.played.length === 0) {
      current.level = 0;
      return true;
    }

    // 3 rules for a valid play:
    // - Each tile in the shape must be supported by the level below
    // - A shape must be supported by two or more distinct shapes on
    //   the lower level
    // - If there's already a shape on this level, the current shape
    //   must be adjacent to a shape on this level
    const board = this.buildBoard(false);
    let level = null;
    const supports = new Set();

    for (let r = 0; r < current.footprint.rows; r++) {
      const boardRow = r + current.anchor.row;
      for (let c = 0; c < current.footprint.cols; c++) {
        if (!current.squares[r][c]) {
          continue;
        }

        const boardCol = c + current.anchor.col;
        const playedShape = board[boardRow][boardCol].shape;

        // console.log(`Comparing ghost ${r}-${c} to board ${boardRow}-${boardCol}`);
        // console.log(`ghost level ${level+1}`);
        // console.log(playedShape);

        if (level === null) {
          // First square for this shape
          if (playedShape) {
            level = playedShape.level;
          } else {
            level = -1;
          }

        } else if (level === -1 && playedShape) {
          console.debug(`Level mismatch: ground to support`);
          return false;

        } else if (level !== -1 && (!playedShape || level !== playedShape.level)) {
          // Level mismatch, rule 1 above has been violated
          console.debug(`Level mismatch`);
          return false;

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
    if (level !== 0 && supports.size < 2) {
      console.log('Not enough support shapes');
      return false;
    }

    // If one exists, our new shape must touch another shape on this level
    

    current.level = level;
    return true;
  }

  squareClick() {
    if (!this.state.shapes.current) {
      return;
    }
    const anchor = this.getAnchor();
    console.log(`User click at ${anchor.row}, ${anchor.col}`);

    const current = Object.assign({}, this.state.shapes.current);
    current.anchor = anchor;
    if (!this.checkPlay(current)) {
      console.log('Play validation failed');
      return;
    }

    console.log(`Playing tile at level ${current.level}`);

    // Figure out the next shape
    let newCurrent = null;
    if (this.state.shapes.unplayed.length > 0) {
      newCurrent = this.state.shapes.unplayed[0];
    }

    // Update the state
    this.setState({
      shapes: {
        played: this.state.shapes.played.concat([current]),
        current: newCurrent,
        unplayed: this.state.shapes.unplayed.slice(1),
      }
    });
  }

  rotateShape(event) {
    // clockwise (spin-down)

    // prevent the context menu from popping up
    event.preventDefault();

    // Create a copy to work with
    const current = this.state.shapes.current;
    const copy = {...current};

    // Rotate the footprint
    copy.footprint = {
      rows: current.footprint.cols,
      cols: current.footprint.rows,
    }

    // Copy over the squares themselves
    copy.squares = [];
    for (let c = 0; c < current.footprint.cols; c++) {
      const row = []
      for (let r = current.footprint.rows - 1; r >= 0; r--) {
        row.push(current.squares[r][c]);
      }
      copy.squares.push(row);
    }

    console.debug('Rotated shape to:');
    console.debug(copy);

    this.setState({
      shapes: {
        ...this.state.shapes,
        current: copy,
      },
    });
  }

  setMouseLocation(row, col) {
    this.setState({
      mouse: {
        row: row,
        col: col,
      },
    });
  }

  getAnchor() {
    const shape = this.state.shapes.current;
    const mouse = this.state.mouse;
    // Idea: mouse points at (1, 1) on the shape, anchor points at (0, 0)
    const anchor = {
      row: mouse.row - 1,
      col: mouse.col - 1,
    };

    if (anchor.row < 0) {
      anchor.row = 0;
    } else if (anchor.row + shape.footprint.rows > this.state.boardHeight) {
      anchor.row = this.state.boardHeight - shape.footprint.rows;
    }

    if (anchor.col < 0) {
      anchor.col = 0;
    } else if (anchor.col + shape.footprint.cols > this.state.boardWidth) {
      anchor.col = this.state.boardWidth - shape.footprint.cols;
    }

    return anchor;
  }

  buildBoard(drawGhost) {
    // TODO DPR: for perf, track board state and only update what's changed

    const drawShape = (board, shape, anchor, type) => {
      for (let r = 0; r < shape.footprint.rows; r++) {
        for (let c = 0; c < shape.footprint.cols; c++) {
          if (shape.squares[r][c]) {
            const square = board[anchor.row + r][anchor.col + c];
            square.color = shape.color;
            square.type = type;
            square.shape = shape;
          }
        }
      }
    };

    // Fill in the default (empty) board state
    const board = [];
    for (let r = 0; r < this.state.boardHeight; r++) {
      const row = [];
      for (let c = 0; c < this.state.boardWidth; c++) {
        row.push({
          color: 'white',
          type: 'empty',
        });
      }
      board.push(row);
    }

    // Draw all played pieces
    this.state.shapes.played.forEach((shape) => {
      drawShape(board, shape, shape.anchor, 'played');
    });

    // Draw the ghost of the current piece
    if (drawGhost && this.state.mouse && this.state.shapes.current) {
      const current = this.state.shapes.current;
      const anchor = this.getAnchor();
      drawShape(board, current, anchor, 'ghost');
    }

    return board;
  }

  render() {
    const board = this.buildBoard(true);
    return (
      <main>
        <Board
          width={this.state.boardWidth}
          height={this.state.boardHeight}
          board={board}
          setMouseLocation={this.setMouseLocation.bind(this)}
          squareClick={this.squareClick.bind(this)}
          rotateShape={this.rotateShape.bind(this)}
          />
        <InfoBar
          shapes={this.state.shapes}
          mouse={this.state.mouse}
          />
      </main>
    );
  }
}

export default App;
