const SHAPES = {
  '0': {
    color: 'darkgrey',
    footprint: { rows: 4, cols: 3 },
    squares: [
      [ true , true , true , ],
      [ true , false, true , ],
      [ true , false, true , ],
      [ true , true , true , ],
    ],
  },
  '1': {
    color: 'darkgoldenrod',
    footprint: { rows: 4, cols: 2 },
    footprint: [
      [ true , true, ],
      [ false, true, ],
      [ false, true, ],
      [ false, true, ],
    ],
  },
  '2': {
    color: 'darkorange',
    footprint: { rows: 4, cols: 3 },
    squares: [
      [ false, true , true , ],
      [ false, true , true , ],
      [ true , true , false, ],
      [ true , true , true , ],
    ],
  },
  '3': {
    color: 'gold',
    footprint: { rows: 4, cols: 3 },
    squares: [
      [ true , true , true , ],
      [ false, false, true , ],
      [ false, true , true , ],
      [ true , true , true , ],
    ],
  },
  '4': {
    color: 'darkgreen',
    footprint: { rows: 4, cols: 3 },
    squares: [
      [ false, true , true , ],
      [ false, true , false, ],
      [ true , true , true , ],
      [ false, true , true , ],
    ],
  },
  '5': {
    color: 'turqouise',
    footprint: { rows: 4, cols: 3 },
    squares: [
      [ true , true , true , ],
      [ true , true , true , ],
      [ false, false, true , ],
      [ true , true , true , ],
    ],
  },
  '6': {
    color: 'navy',
    footprint: { rows: 4, cols: 3 },
    squares: [
      [ true , true , false, ],
      [ true , false, false, ],
      [ true , true , true , ],
      [ true , true , true , ],
    ],
  },
  '7': {
    color: 'mediumvioletred',
    footprint: { rows: 4, cols: 3 },
    squares: [
      [ true , true , true , ],
      [ false, true , false, ],
      [ true , true , false, ],
      [ true , false, false, ],
    ],
  },
  '8': {
    color: 'salmon',
    footprint: { rows: 4, cols: 3 },
    squares: [
      [ false, true , true , ],
      [ false, true , true , ],
      [ true , true , false, ],
      [ true , true , false, ],
    ],
  },
  '9': {
    color: 'red',
    footprint: { rows: 4, cols: 3 },
    squares: [
      [ true , true , true , ],
      [ true , true , true , ],
      [ true , true , false, ],
      [ true , true , false, ],
    ],
  },
};



export default SHAPES;
