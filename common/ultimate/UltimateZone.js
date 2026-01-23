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
      .map(card => card.visibleBiscuits())
      .map(biscuitString => this.game.util.parseBiscuits(biscuitString))
      .reduce((l, r) => this.game.util.combineBiscuits(l, r), this.util.emptyBiscuits())
  }

  cardlist(opts={}) {
    for (const zoneName of ['hand', 'forecast', 'score']) {
      if (this.name().endsWith('.' + zoneName) && !opts.noKarma) {
        const karmaInfos = this.game.findKarmasByTrigger(this.player(), `list-${zoneName}`)
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

  isPlayerAchievementsZone() {
    return Boolean(this.owner) && this.id.endsWith('.achievements')
  }

  isArtifactZone() {
    return Boolean(this.owner) && this.id.endsWith('.artifact')
  }

  isColorZone() {
    return Boolean(this.color)
  }

  isHandZone() {
    return Boolean(this.owner) && this.id.endsWith('.hand')
  }

  isMuseumZone() {
    return Boolean(this.owner) && this.id.endsWith('.museum')
  }

  player() {
    return this.players.byZone(this)
  }

  setCards(cards) {
    this._cards = cards
  }

  numVisibleCards() {
    return this.visibleCards().length
  }

  visibleCards() {
    if (this._cards.length === 0) {
      return []
    }
    else if (this.splay === 'none') {
      return this._cards.slice(0, 1)
    }
    else {
      return this.cardlist()
    }
  }

  /**
   * Check if this zone has visible dogma or echo effects.
   */
  hasVisibleDogmaOrEcho() {
    const player = this.player()
    return (
      this.game.getVisibleEffectsByColor(player, this.color, 'dogma').length > 0
      || this.game.getVisibleEffectsByColor(player, this.color, 'echo').length > 0
    )
  }
}

module.exports = {
  UltimateZone,
}
