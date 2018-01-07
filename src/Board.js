import React, { Component } from 'react';

class Board extends Component {
  square(r, c, props) {
    const inlineStyles = {};
    switch(props.type) {
      case 'empty':
      Object.assign(inlineStyles, {
        backgroundColor: props.color,
        borderWidth: '1px',
        borderStyle: 'solid',
        borderColor: 'lightgrey',
      });
      break;

      case 'played':
      inlineStyles['background'] = `radial-gradient(white, ${props.color})`;
      break;

      case 'ghost':
      inlineStyles['background'] = `radial-gradient(white, ${props.color})`;
      break;

      default:
      console.error(`Don't know how to render square of type ${props.type}`);
    }
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
      squares.push(this.square(r, c, this.props.board[r][c]));
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
      <div className="board" onContextMenu={this.props.rotateShape}>
        { rows }
      </div>
    );
  }
}

export default Board;
