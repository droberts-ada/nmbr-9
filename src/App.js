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
    const board = Array(boardHeight).fill(Array(boardWidth).fill({color: 'black'}));
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

  validPlay(row, col) {
    return true;
  }

  squareClick() {
    if (!this.state.shapes.current) {
      return;
    }
    const anchor = this.getAnchor();
    console.log(`User click at ${anchor.row}, ${anchor.col}`);
    if (!this.validPlay(anchor.row, anchor.col)) {
      return;
    }

    // Record some extra facts about the current shape and save it to played
    const current = Object.assign({}, this.state.shapes.current);
    current.anchor = anchor;


    // Figure out the next shape
    let newCurrent = null;
    if (this.state.shapes.unplayed.length > 0) {
      newCurrent = this.state.shapes.unplayed[0];
    }
    this.setState({
      shapes: {
        played: this.state.shapes.played.concat([current]),
        current: newCurrent,
        unplayed: this.state.shapes.unplayed.slice(1),
      }
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

  buildBoard() {
    // TODO DPR: for perf, track board state and only update what's changed

    // Fill in the default (empty) board state
    const board = [];
    for (let r = 0; r < this.state.boardHeight; r++) {
      const row = [];
      for (let c = 0; c < this.state.boardWidth; c++) {
        row.push({
          color: 'white',
        });
      }
      board.push(row);
    }

    // Draw the ghost of the current piece
    if (this.state.mouse && this.state.shapes.current) {
      const current = this.state.shapes.current;
      const anchor = this.getAnchor();
      for (let r = 0; r < current.footprint.rows; r++) {
        for (let c = 0; c < current.footprint.cols; c++) {
          if (current.squares[r][c]) {
            board[anchor.row + r][anchor.col + c].color = current.color;
          }
        }
      }
    }

    return board;
  }

  render() {
    const board = this.buildBoard();
    return (
      <main>
        <Board
          width={this.state.boardWidth}
          height={this.state.boardHeight}
          board={board}
          setMouseLocation={this.setMouseLocation.bind(this)}
          squareClick={this.squareClick.bind(this)}
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
