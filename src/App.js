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

    const boardHeight = 12;
    const boardWidth = 12;
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

  setMouseLocation(row, col) {
    this.setState({
      mouse: {
        row: row,
        col: col,
      },
    });
  }

  buildBoard() {
    // Fill in the default (empty) board state
    const board = Array(this.state.boardHeight).fill(
      Array(this.state.boardWidth).fill({
        color: 'black',
      })
    );

    // Draw the ghost of the current piece
    

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
