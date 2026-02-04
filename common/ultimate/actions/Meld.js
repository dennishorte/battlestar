const util = require('../../lib/util.js')


function MeldAction(player, card, opts={}) {
  // TODO: Figure out how to convert this to use UltimateActionManager.insteadKarmaWrapper
  const karmaKind = this.game.triggerKarma(player, 'meld', { ...opts, card })
  if (karmaKind === 'would-instead') {
    this.acted(player)
    return
  }

  const isFirstCard = this.cards.byPlayer(player, card.color).length === 0

  // If this card is in a museum, a museum card must be returned.
  const fromMuseum = card.zone.isMuseumZone()

  card.moveTo(this.zones.byPlayer(player, card.color), 0)

  this.log.add({
    template: '{player} melds {card}',
    args: { player, card }
  })

  // sourceCard restricts when-meld karma to only the melded card's own karmas,
  // preventing other top cards' when-meld karmas from firing incorrectly.
  this.game.triggerKarma(player, 'when-meld', { ...opts, card, sourceCard: card })

  if (fromMuseum) {
    const museum = this.cards.byPlayer(player, 'museum').filter(card => card.isMuseum)[0]
    this.return(player, museum)
  }

  this.acted(player)

  // Stats
  _statsCardWasMelded.call(this, card)
  _statsCardWasMeldedBy.call(this, player, card)
  _statsFirstToMeldOfAge.call(this, player, card)

  this.log.indent()

  _maybeCityMeldAchievements.call(this, player, card)

  if (opts.asAction) {
    _maybeCityBiscuits.call(this, player, card)
    _maybeDiscoverBiscuit.call(this, player, card)
    if (isFirstCard) {
      this._maybeDrawCity(player, opts)
    }
    _maybeDigArtifact.call(this, player, card)
    _maybePromote.call(this, player, card)
  }

  this.log.outdent()
  return card
}

function _maybeCityBiscuits(player, card) {
  const biscuits = card.visibleBiscuits()

  for (const biscuit of biscuits) {
    switch (biscuit) {
      case '+':
        this.draw(player, { age: card.age + 1 })
        break
      case '<':
        this.splay(player, card.color, 'left')
        break
      case '>':
        this.splay(player, card.color, 'right')
        break
      case '^':
        this.splay(player, card.color, 'up')
        break
      case '=':
        for (const opp of this.players.opponents(player)) {
          this.game.actions.unsplay(opp, card.color)
        }
        break
      case '|':
        this.junkDeck(player, card.getAge() + 1)
        this.draw(player, { age: card.getAge() + 2 })
        break
      case 'x':
        this.junkAvailableAchievement(player, [card.getAge()])
        break
      default:
        // Most biscuits don't do anything special.
        break
    }
  }
}

function _maybeCityMeldAchievements(player, card) {
  if (
    card.checkHasBiscuit('<')
    && this.zones.byPlayer(player, card.color).splay === 'left'
    && this.cards.byId('Tradition').zone.id === 'achievements'
  ) {
    this.claimAchievement(player, { name: 'Tradition' })
  }

  if (
    card.checkHasBiscuit('>')
    && this.zones.byPlayer(player, card.color).splay === 'right'
    && this.cards.byId('Repute').zone.id === 'achievements'
  ) {
    this.claimAchievement(player, { name: 'Repute' })
  }

  if (
    card.checkHasBiscuit('^')
    && this.zones.byPlayer(player, card.color).splay === 'up'
    && this.cards.byId('Fame').zone.id === 'achievements'
  ) {
    this.claimAchievement(player, { name: 'Fame' })
  }
}

function _maybeDiscoverBiscuit(player, card) {
  if (card.checkHasDiscoverBiscuit()) {
    const age = card.getAge()
    const biscuit = card.biscuits[4]
    const maxDraw = this.cards.byDeck('base', age).length
    const numDraw = Math.min(maxDraw, age)

    for (let i = 0; i < numDraw; i++) {
      const card = this.draw(player, { exp: 'base', age })
      this.reveal(player, card)
      if (!card.checkHasBiscuit(biscuit)) {
        this.return(player, card)
      }
    }
  }
}

function _maybeDigArtifact(player, card) {
  if (!this.game.getExpansionList().includes('arti')) {
    return
  }

  const next = this.cards.byPlayer(player, card.color)[1]

  // No card underneath, so no artifact dig possible.
  if (!next) {
    return
  }

  // Dig up an artifact if player melded a card of lesser or equal age of the previous top card.
  if (next.getAge() >= card.getAge()) {
    this.game.actions.digArtifact(player, next.getAge())
    return
  }

  // Dig up an artifact if the melded card has its hex icon in the same position.
  if (next.getHexIndex() === card.getHexIndex()) {
    this.game.actions.digArtifact(player, next.getAge())
    return
  }
}

function _maybePromote(player, card) {
  const choices = this
    .game
    .cards
    .byPlayer(player, 'forecast')
    .filter(other => other.getAge() <= card.getAge())

  if (choices.length > 0) {
    this.log.add({
      template: '{player} must promote a card from forecast',
      args: { player },
    })
    const cards = this.chooseAndMeld(player, choices)
    if (cards && cards.length > 0) {
      const melded = cards[0]
      this.dogma(player, melded, { foreseen: true })
    }
  }
}

function _statsCardWasMelded(card) {
  util.array.pushUnique(this.game.stats.melded, card.name)

  // Also track card details (age, expansion) for richer stats
  if (!this.game.stats.cardDetails) {
    this.game.stats.cardDetails = {}
  }
  if (!(card.name in this.game.stats.cardDetails)) {
    this.game.stats.cardDetails[card.name] = {
      age: card.age,
      expansion: card.expansion,
    }
  }
}

function _statsCardWasMeldedBy(player, card) {
  if (card.name in this.game.stats.meldedBy) {
    return
  }
  else {
    this.game.stats.meldedBy[card.name] = player.name
  }
}

function _statsFirstToMeldOfAge(player, card) {
  if (card.age > this.game.stats.highestMelded) {
    this.game.stats.firstToMeldOfAge.push([card.age, player.name])
    this.game.stats.highestMelded = card.age
  }
}

module.exports = {
  MeldAction
}
