class UltimateZone {
  constructor(game, name, kind) {
    this.id = name
    this.game = game
    this.name = name
    this.kind = kind
    this.color = undefined
    this.owner = undefined
    this.splay = undefined
    this._cards = []
  }

  cards() {
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

  player() {
    return this.game.players.byZone(this)
  }

  setCards(cards) {
    this._cards = cards
  }

  numVisibleCards() {
    if (this._cards.length === 0) {
      return 0
    }
    else if (this.splay === undefined || this.splay === 'none') {
      return 1
    }
    else {
      return this._cards.length
    }
  }
}

module.exports = {
  UltimateZone,
}
