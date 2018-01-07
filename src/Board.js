import React, { Component } from 'react';

const Square = function(props) {
  const inlineStyles = {
    backgroundColor: props.color || 'black',
  };
  return (
    <div className="square"
      key={`square-${props.row}-${props.col}`}
      onMouseEnter={(e) => props.setMouseLocation(props.row, props.col)}
      style={inlineStyles}
    />
  );
};

const Row = function(props) {
  let squares = [];
  for (let c = 0; c < props.width; c++) {
    squares.push(Square({
      row: props.row,
      col: c,
      setMouseLocation: props.setMouseLocation,
      color: props.board[props.row][c].color,
    }));
  }
  return (
    <div className="row" key={`row${props.row}`}>
      { squares }
    </div>
  );
}

class Board extends Component {


  render() {
    let rows = [];
    for (let r = 0; r < this.props.height; r++) {
      rows.push(Row({
        row: r,
        width: this.props.width,
        setMouseLocation:
        this.props.setMouseLocation,
        board: this.props.board,
      }));
    }
    return (
      <div className="board">
        { rows }
      </div>
    );
  }
}

export default Board;
