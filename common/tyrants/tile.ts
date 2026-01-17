
// The default orientation of Tiles is N.
// Using directions as a rotation value indicates the direction that original N should point.
// Thus, rotation = Direction.SW indicates that the N face of the hex will point SW.
const Direction: Record<string, number> = {
  N:  0,
  NE: 1,
  SE: 2,
  S:  3,
  SW: 4,
  NW: 5,
}

const Translation: Record<number, [number, number]> = {
  [Direction.N ]: [ 0, - 1],
  [Direction.NE]: [+1, -.5],
  [Direction.SE]: [+1, +.5],
  [Direction.S ]: [ 0, + 1],
  [Direction.SW]: [-1, +.5],
  [Direction.NW]: [-1, -.5],
}

function rotate(dir: number, rotation: number): number {
  return (dir + rotation) % 6
}

function rotateReverse(dir: number, rotation: number): number {
  return (dir - rotation + 6) % 6
}

interface TileData {
  name: string
  pos: [number, number]
  rotation: number
  sites: Site[]
}

interface Site {
  dx: number
  dy: number
  paths: string[]
  [key: string]: unknown
}

interface AbsoluteSite extends Site {
  cx: number
  cy: number
}

interface TileGame {
  tiles: Tile[]
}

interface Tile {
  data: TileData
  game: TileGame
  cx: number
  cy: number
  _rotation: number

  setCenterPoint(x: number, y: number): void
  setRotation(r: number): void
  name(): string
  linksToSide(dir: number): AbsoluteSite[]
  layoutPos(): { x: number; y: number }
  neighbors(): Tile[]
  rotation(): number
  sites(): Site[]
  sitesAbsolute(): AbsoluteSite[]
  sideTouching(other: Tile): number
}

function Tile(this: Tile, data: TileData, game: TileGame): void {
  this.data = data
  this.game = game

  this.cx = 0
  this.cy = 0
}

////////////////////////////////////////////////////////////////////////////////
// Setters

Tile.prototype.setCenterPoint = function(this: Tile, x: number, y: number): void {
  this.cx = x
  this.cy = y
}

Tile.prototype.setRotation = function(this: Tile, r: number): void {
  this._rotation = (r + 36) % 6
}


////////////////////////////////////////////////////////////////////////////////
// Getters

Tile.prototype.name = function(this: Tile): string {
  return this.data.name
}

Tile.prototype.linksToSide = function(this: Tile, dir: number): AbsoluteSite[] {
  const sideName = 'hex' + dir
  return this.sitesAbsolute().filter(s => s.paths.includes(sideName))
}

Tile.prototype.layoutPos = function(this: Tile): { x: number; y: number } {
  return {
    x: this.data.pos[0],
    y: this.data.pos[1],
  }
}

Tile.prototype.neighbors = function(this: Tile): Tile[] {
  const candidates = Object
    .values(Translation)
    .map(([dx, dy]) => ({
      x: this.layoutPos().x + dx,
      y: this.layoutPos().y + dy,
    }))

  return candidates
    .map(c => this.game.tiles.find(t => t.layoutPos().x === c.x && t.layoutPos().y === c.y))
    .filter((h): h is Tile => h !== undefined)
}

Tile.prototype.rotation = function(this: Tile): number {
  return this.data.rotation
}

Tile.prototype.sideTouching = function(this: Tile, other: Tile): number {
  for (const [direction, delta] of Object.entries(Translation)) {
    const dx = this.layoutPos().x + delta[0]
    const dy = this.layoutPos().y + delta[1]

    if (other.layoutPos().x === dx && other.layoutPos().y === dy) {
      return (parseInt(direction) - this.rotation() + 6) % 6
    }
  }

  throw new Error('not touching')
}

Tile.prototype.sites = function(this: Tile): Site[] {
  return this.data.sites
}

Tile.prototype.sitesAbsolute = function(this: Tile): AbsoluteSite[] {
  const theta = this.rotation() * ((2 * Math.PI) / 6)
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
