import React, { Component } from 'react';
import logo from './logo.svg';
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

    const boardHeight = 12;
    const boardWidth = 12;
    const board = Array(boardHeight).fill(Array(boardWidth).fill({color: 'black'}))
    this.state = {
      unplayedShapes: shapes,
      playedShapes: [],
      boardHeight: boardHeight,
      boardWidth: boardWidth,
      board: board,
    }
  }
  render() {
    return (
      <main>
        <Board width={this.state.boardWidth} height={this.state.boardHeight} board={this.state.board} />
        <InfoBar playedShapes={this.state.playedShapes} unplayedShapes={this.state.unplayedShapes} />
      </main>
    );
  }
}

export default App;
