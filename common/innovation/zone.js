module.exports = {
  Zone
}


function Zone(game, name, kind) {
  this.game = game
  this.name = name
  this.kind = kind
  this.color = undefined
  this.owner = undefined
  this.splay = undefined
  this._cards = []
}

Zone.prototype.cards = function() {
  for (const zoneName of ['hand', 'forecast', 'score']) {
    if (this.name.endsWith('.' + zoneName)) {
      const karmaInfos = this.game.getInfoByKarmaTrigger(this.player(), `list-${zoneName}`)
      if (karmaInfos.length === 1) {
        return karmaInfos[0].impl.func(this.game, this.player())
      }
      else if (karmaInfos.length > 1) {
        throw new Error(`Multiple list-${zoneName} karmas`)
      }
      else {
        // Fall through
      }
    }
  }

  // Default implementation
  return [...this._cards]
}

Zone.prototype.player = function() {
  return this.game.getPlayerByZone(this)
}

Zone.prototype.setCards = function(cards) {
  this._cards = cards
}
