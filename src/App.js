import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

import Board from './Board.js';
import Shapes from './shapes.js';

class App extends Component {
  render() {
    return (
      <Board width="10" height="10" />
    );
  }
}

export default App;
