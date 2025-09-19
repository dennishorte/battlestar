const { BaseZone } = require('../lib/game/index.js')

class UltimateZone extends BaseZone {
  constructor(game, id, name, kind, owner=null) {
    super(game, id, name, kind, owner)

    this.color = undefined
    this.splay = undefined
  }

  biscuits() {
    return this
      .cardlist()
      .map(card => this.game.getBiscuitsRaw(card, this.splay))
      .map(biscuitString => this.game.util.parseBiscuits(biscuitString))
      .reduce((l, r) => this.game.util.combineBiscuits(l, r), this.game.util.emptyBiscuits())
  }

  cardlist() {
    for (const zoneName of ['hand', 'forecast', 'score']) {
      if (this.name().endsWith('.' + zoneName)) {
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

    return super.cardlist()
  }

  player() {
    return this.players.byZone(this)
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
