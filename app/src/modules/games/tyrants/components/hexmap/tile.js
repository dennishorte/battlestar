
// The default orientation of Tiles is N.
// Using directions as a rotation value indicates the direction that original N should point.
// Thus, rotation = Direction.SW indicates that the N face of the hex will point SW.
const Direction = {
  N:  0,
  NE: 1,
  SE: 2,
  S:  3,
  SW: 4,
  NW: 5,
}

const Translation = {
  [Direction.N ]: [ 0, - 1],
  [Direction.NE]: [+1, -.5],
  [Direction.SE]: [+1, +.5],
  [Direction.S ]: [ 0, + 1],
  [Direction.SW]: [-1, +.5],
  [Direction.NW]: [-1, -.5],
}

function rotate(dir, rotation) {
  return (dir + rotation) % 6
}

function rotateReverse(dir, rotation) {
  return (dir - rotation + 6) % 6
}


function Tile(data, context) {
  this.data = data
  this.context = context

  this.layoutId = data.layoutId

  this.layout = {
    x: data.pos[0],
    y: data.pos[1],
  }

  this.rotation = 0
}

Tile.prototype.connectionsAt = function(dir) {
}

Tile.prototype.neighbors = function() {
  const candidates = Object.values(Translation)
  return candidates
    .map(([x, y]) => this.context.tiles.find(h => t.layout.x === x && t.layout.y === y))
    .filter(h => h !== undefined)
}


export default {
  Tile,
  Direction,
  Translation,

  rotate,
  rotateReverse,
}
