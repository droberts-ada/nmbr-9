import React, { Component } from 'react';

class BoardView extends Component {
  square(r, c, props) {
    const forEachDir = (fnWorker) => {
      ['left', 'right', 'top', 'bottom'].forEach((low) => {
        const cap = low.charAt(0).toUpperCase() + low.slice(1).toLowerCase();
        fnWorker(low, cap);
      });
    };

    const inlineStyles = {};

    // Type-specific styles
    switch(props.type) {
      case 'empty':
      inlineStyles['backgroundColor'] = props.shape.color;
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
