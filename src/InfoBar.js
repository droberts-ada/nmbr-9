import React, { Component } from 'react';

const MouseInfo = function(props) {
  if (props.mouse) {
    return (
      <p>
        Mouse:
        row {props.mouse.row},
        col {props.mouse.col},
      </p>
    );
  } else {
    return <p>Mouse: No Data</p>;
  }
}

class InfoBar extends Component {
  render() {
    return (
      <aside className="info-bar">
        <h2>
          Game Info:
        </h2>
        { MouseInfo({mouse: this.props.mouse}) }
        <p>
          Current shape: {this.props.shapes.current.text}
        </p>
      </aside>
    );
  }
}

export default InfoBar;
