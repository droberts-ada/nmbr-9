import React, { Component } from 'react';

class Board extends Component {
  square(r, c, color) {
    const inlineStyles = {
      backgroundColor: color || 'black',
    };
    return (
      <div className="square"
        key={`square-${r}-${c}`}
        onMouseEnter={(e) => this.props.setMouseLocation(r, c)}
        onClick={(e) => this.props.squareClick()}
        style={inlineStyles}
      />
    );
  }

  row(r) {
    let squares = [];
    for (let c = 0; c < this.props.width; c++) {
      squares.push(this.square(r, c, this.props.board[r][c].color));
    }
    return (
      <div className="row" key={`row-${r}`}>
      { squares }
      </div>
    );
  }

  render() {
    let rows = [];
    for (let r = 0; r < this.props.height; r++) {
      rows.push(this.row(r));
    }
    return (
      <div className="board">
        { rows }
      </div>
    );
  }
}

export default Board;
