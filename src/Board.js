import React, { Component } from 'react';

const Square = function(props) {
  return (
    <div className="square">
    </div>
  );
};

const Row = function(props) {
  let squares = [];
  for (let c = 0; c < props.width; c++) {
    squares.push(Square());
  }
  return (
    <div className="row">
      { squares }
    </div>
  );
}

class Board extends Component {


  render() {
    let rows = [];
    for (let r = 0; r < this.props.height; r++) {
      rows.push(Row({ width: this.props.width }));
    }
    return (
      <div className="board">
        { rows }
      </div>
    );
  }
}

export default Board;
