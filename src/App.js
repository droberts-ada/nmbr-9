import React, { Component } from 'react';
import './App.css';

// Components
import BoardView from './BoardView';
import InfoBar from './InfoBar';

// Other modules
import Board from './board';
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

  squareClick() {
    if (!this.state.shapes.current) {
      return;
    }
    const anchor = this.getAnchor();
    console.log(`User click at ${anchor.row}, ${anchor.col}`);

    const current = Object.assign({}, this.state.shapes.current);
    current.anchor = anchor;

    const board = new Board(
      this.state.boardHeight,
      this.state.boardWidth,
      this.state.shapes.played
    );
    if (!board.checkPlay(current, this.state.shapes.played)) {
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

  render() {
    const board = new Board(
      this.state.boardHeight,
      this.state.boardWidth,
      this.state.shapes.played
    );

    let squares;
    if (this.state.mouse && this.state.shapes.current) {
      squares = board.augment(
        this.state.mouse,
        this.state.shapes.current,
        this.getAnchor()
      );
    } else {
      squares = board.squares;
    }

    return (
      <main>
        <BoardView
          width={this.state.boardWidth}
          height={this.state.boardHeight}
          board={squares}
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
