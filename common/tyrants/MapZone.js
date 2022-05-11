function MapZone(game, data) {
  this.game = game

  this.name = data.name
  this.short = data.short
  this.region = data.region
  this.size = data.size
  this.neutrals = data.neutrals
  this.points = data.points
  this.start = data.start
  this.control = data.control
  this.totalControl = data.totalControl
  this.neighborNames = data.neighbors

  this.troops = []
  this.spies = []
}

MapZone.prototype.getController = function() {

}

MapZone.prototype.neighbors = function() {
  return this.neighbors.map(name => this.game.getZoneByName(name))
}
