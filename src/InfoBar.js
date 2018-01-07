import React, { Component } from 'react';




class InfoBar extends Component {
  mouseInfo() {
    if (this.props.mouse) {
      return (
        <p>
          Mouse:
          row {this.props.mouse.row},
          col {this.props.mouse.col},
        </p>
      );
    } else {
      return <p>Mouse: No Data</p>;
    }
  }
  currentShapeInfo() {
    if (this.props.shapes.current) {
      return (
        <p>
          Current shape: {this.props.shapes.current.text}
        </p>
      );
    } else {
      return <p>No current shape</p>;
    }
  }
  render() {
    return (
      <aside className="info-bar">
        <h2>
          Game Info:
        </h2>
        { this.mouseInfo() }
        { this.currentShapeInfo() }
      </aside>
    );
  }
}

export default InfoBar;
