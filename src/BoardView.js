import React, { Component } from 'react';

class BoardView extends Component {
  DIRECTIONS = [
    ['left', 'Left'],
    ['right', 'Right'],
    ['top', 'Top'],
    ['bottom', 'Bottom'],
  ]
  square(r, c, props) {
    // TODO: break this sucker out as a separate component
    const forEachDir = (fnWorker) => {
      this.DIRECTIONS.forEach((d) => {
        fnWorker(d[0], d[1]);
      });
    };

    const inlineStyles = {
      opacity: props.opacity || 1,
    };

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

      break;

      default:
      console.error(`Don't know how to render square of type ${props.type}`);
    }

    // Explicit borders apply to all squares and override defaults
    if (props.borders) {
      Object.assign(inlineStyles, props.borders);
    }

    const key = `square-${r}-${c}`;

    const result = (
      <div className="square"
      key={key}
      onMouseEnter={(e) => this.props.setMouseLocation(r, c)}
      onClick={(e) => this.props.squareClick()}
      style={inlineStyles}
      />
    );

    if (props.overlay) {
      const overlayStyles = {
        zIndex: 100,
        background: `radial-gradient(white, ${props.overlay.color})`,
      };
      return (
        <div className="overlay" style={overlayStyles} key={key}>
          {result}
        </div>
      );
    } else {
      return result;
    }

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
