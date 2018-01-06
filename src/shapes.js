const Shapes = [
  {
    text: '0',
    color: 'darkgrey',
    footprint: { rows: 4, cols: 3 },
    squares: [
      [ true , true , true , ],
      [ true , false, true , ],
      [ true , false, true , ],
      [ true , true , true , ],
    ],
  }, {
    text: '1',
    color: 'darkgoldenrod',
    footprint: { rows: 4, cols: 2 },
    footprint: [
      [ true , true, ],
      [ false, true, ],
      [ false, true, ],
      [ false, true, ],
    ],
  }, {
    text: '2',
    color: 'darkorange',
    footprint: { rows: 4, cols: 3 },
    squares: [
      [ false, true , true , ],
      [ false, true , true , ],
      [ true , true , false, ],
      [ true , true , true , ],
    ],
  }, {
    text: '3',
    color: 'gold',
    footprint: { rows: 4, cols: 3 },
    squares: [
      [ true , true , true , ],
      [ false, false, true , ],
      [ false, true , true , ],
      [ true , true , true , ],
    ],
  }, {
    text: '4',
    color: 'darkgreen',
    footprint: { rows: 4, cols: 3 },
    squares: [
      [ false, true , true , ],
      [ false, true , false, ],
      [ true , true , true , ],
      [ false, true , true , ],
    ],
  }, {
    text: '5',
    color: 'turqouise',
    footprint: { rows: 4, cols: 3 },
    squares: [
      [ true , true , true , ],
      [ true , true , true , ],
      [ false, false, true , ],
      [ true , true , true , ],
    ],
  }, {
    text: '6',
    color: 'navy',
    footprint: { rows: 4, cols: 3 },
    squares: [
      [ true , true , false, ],
      [ true , false, false, ],
      [ true , true , true , ],
      [ true , true , true , ],
    ],
  }, {
    text: '7',
    color: 'mediumvioletred',
    footprint: { rows: 4, cols: 3 },
    squares: [
      [ true , true , true , ],
      [ false, true , false, ],
      [ true , true , false, ],
      [ true , false, false, ],
    ],
  }, {
    text: '8',
    color: 'salmon',
    footprint: { rows: 4, cols: 3 },
    squares: [
      [ false, true , true , ],
      [ false, true , true , ],
      [ true , true , false, ],
      [ true , true , false, ],
    ],
  }, {
    text: '9',
    color: 'red',
    footprint: { rows: 4, cols: 3 },
    squares: [
      [ true , true , true , ],
      [ true , true , true , ],
      [ true , true , false, ],
      [ true , true , false, ],
    ],
  },
];

export default Shapes;
