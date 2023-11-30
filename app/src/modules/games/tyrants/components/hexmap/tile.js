
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


function Tile(data, game) {
  this.data = data
  this.game = game

  this.cx = 0
  this.cy = 0

  this.rotation = 0
}

////////////////////////////////////////////////////////////////////////////////
// Setters

Tile.prototype.setCenterPoint = function(x, y) {
  this.cx = x
  this.cy = y
}

Tile.prototype.setRotation = function(r) {
  this.rotation = (r + 36) % 6
}


////////////////////////////////////////////////////////////////////////////////
// Getters

Tile.prototype.connectors = function() {
  return this.data.connectors
}

Tile.prototype.id = function() {
  return this.data._id
}

Tile.prototype.name = function() {
  return this.data.name
}

Tile.prototype.linksToSide = function(dir) {
  const sideName = 'hex' + dir
  return this.sitesAbsolute().filter(s => s.paths.includes(sideName))
}

Tile.prototype.layoutPos = function() {
  return {
    x: this.data.pos[0],
    y: this.data.pos[1],
  }
}

Tile.prototype.neighbors = function() {
  const candidates = Object
    .values(Translation)
    .map(([dx, dy]) => ({
      x: this.layoutPos().x + dx,
      y: this.layoutPos().y + dy,
    }))

  return candidates
    .map(c => this.game.tiles.find(t => t.layoutPos().x === c.x && t.layoutPos().y === c.y))
    .filter(h => h !== undefined)
}

Tile.prototype.sideTouching = function(other) {
  for (const [direction, delta] of Object.entries(Translation)) {
    const dx = this.layoutPos().x + delta[0]
    const dy = this.layoutPos().y + delta[1]

    if (other.layoutPos().x === dx && other.layoutPos().y === dy) {
      return (direction - this.rotation() + 6) % 6
    }
  }

  throw new Error('not touching')
}

Tile.prototype.sites = function() {
  return this.data.sites
}

Tile.prototype.sitesAbsolute = function() {
  const theta = this.rotation * ((2 * Math.PI) / 6)
  const cosTheta = Math.cos(theta)
  const sinTheta = Math.sin(theta)

  return this.sites().map(s => {
    const dx = s.dx * cosTheta - s.dy * sinTheta
    const dy = s.dy * cosTheta + s.dx * sinTheta

    return {
      ...s,
      cx: this.cx + dx,
      cy: this.cy + dy,
    }
  })
}


export default {
  Tile,
  Direction,
  Translation,

  rotate,
  rotateReverse,
}
