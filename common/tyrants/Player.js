function Player() {
  this._id = undefined
  this.game = undefined
  this.name = undefined

  this.points = 0
  this.influnece = 0
  this.power = 0
}

module.exports = Player


Player.prototype.incrementInfluence = function(count) {
  this.influce += count
}

Player.prototype.incrementPoints = function(count) {
  this.points += count
}

Player.prototype.incrementPower = function(count) {
  this.power += count
}
