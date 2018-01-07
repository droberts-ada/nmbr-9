import React, { Component } from 'react';

class BoardView extends Component {
  DIRECTIONS = [
    ['left', 'Left'],
    ['right', 'Right'],
    ['top', 'Top'],
    ['bottom', 'Bottom'],
  ]
  square(r, c, props) {
    const forEachDir = (fnWorker) => {
      this.DIRECTIONS.forEach((d) => {
        fnWorker(d[0], d[1]);
      });
    };

    const inlineStyles = {};

    // Type-specific styles
    switch(props.type) {
      case 'empty':
      forEachDir((low, cap) => {
        inlineStyles[`border${cap}Width`] = '1px';
        inlineStyles[`border${cap}Color`] = 'lightgrey';
      });
      break;

      case 'played':
      case 'ghost':
      inlineStyles['background'] = `radial-gradient(white, ${props.shape.color})`;
      inlineStyles['opacity'] = props.opacity;

      break;

      default:
      console.error(`Don't know how to render square of type ${props.type}`);
    }

    // Explicit borders apply to all squares and override defaults
    if (props.borders) {
      forEachDir((low, cap) => {
        if (props.borders[low] > 0) {
          inlineStyles[`border${cap}Width`] = '1px';
          inlineStyles[`border${cap}Color`] = props.borders.color || 'black';
        }
      });
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

export default BoardView;
