import React, { Component } from 'react';




class InfoBar extends Component {
  score() {
    let score = 0;
    this.props.shapes.played.forEach((shape) => {
      score += shape.level * parseInt(shape.text);
    });
    return score;
  }
  shapeInfo() {
    const played = this.props.shapes.played.map(s => s.text).join(', ');
    const unplayed = this.props.shapes.unplayed.map(s => s.text).sort().join(', ');
    if (this.props.shapes.current) {
      return (
        <section>
          <p>Played shapes: {played}</p>
          <p>Current shape: {this.props.shapes.current.text}</p>
          <p>Remaining shapes: {unplayed}</p>
        </section>
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
        <p>Current Score: {this.score()}</p>
        { this.shapeInfo() }
      </aside>
    );
  }
}

export default InfoBar;
