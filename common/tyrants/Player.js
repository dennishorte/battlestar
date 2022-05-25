function Player() {
  this._id = undefined
  this.game = undefined
  this.name = undefined

  this.points = 0
  this.influence = 0
  this.power = 0
}

module.exports = Player


Player.prototype.incrementInfluence = function(count) {
  this.influence += count

  const sign = count > 0 ? '+' : '-'
  this.game.mLog({
    template: '{player} adjusts influence {initial} {increment} = {final}',
    args: {
      player: this,
      initial: this.influence - count,
      sign,
      increment: Math.abs(count),
      final: this.influence
    }
  })
}

Player.prototype.incrementPoints = function(count) {
  this.points += count
}

Player.prototype.incrementPower = function(count) {
  this.power += count

  const sign = count > 0 ? '+' : '-'
  this.game.mLog({
    template: '{player} adjusts power {initial} {sign} {increment} = {final}',
    args: {
      player: this,
      initial: this.power - count,
      sign,
      increment: Math.abs(count),
      final: this.power
    }
  })
}
