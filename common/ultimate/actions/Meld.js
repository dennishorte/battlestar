const util = require('../../lib/util.js')


function MeldAction(player, card, opts={}) {
  // TODO: Figure out how to convert this to use UltimateActionManager.insteadKarmaWrapper
  const karmaKind = this.game.aKarma(player, 'meld', { ...opts, card })
  if (karmaKind === 'would-instead') {
    this.acted(player)
    return
  }

  const isFirstCard = this.game.cards.byPlayer(player, card.color).length === 0

  this.log.add({
    template: '{player} melds {card}',
    args: { player, card }
  })

  card.moveTo(this.game.zones.byPlayer(player, card.color), 0)
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
      this.game._maybeDrawCity(player, opts)
    }
    _maybeDigArtifact.call(this, player, card)
    _maybePromote.call(this, player, card)
  }

  _maybeWhenMeldKarma.call(this, player, card, opts)

  this.log.outdent()
  return card
}

function _maybeWhenMeldKarma(player, card, opts={}) {
  const infos = card
    .getKarmaInfo('when-meld')
    .filter(info => info.impl.matches ? info.impl.matches(this, player, opts) : true)
  this.game._aKarmaHelper(player, infos, opts)
}

function _maybeCityBiscuits(player, card) {
  const biscuits = card.getBiscuits('top')

  for (const biscuit of biscuits) {
    switch (biscuit) {
      case '+':
        this.game.actions.draw(player, { age: card.age + 1 })
        break
      case '<':
        this.game.aSplay(player, card.color, 'left')
        break
      case '>':
        this.game.aSplay(player, card.color, 'right')
        break
      case '^':
        this.game.aSplay(player, card.color, 'up')
        break
      case '=':
        for (const opp of this.game.players.opponentsOf(player)) {
          this.game.aUnsplay(opp, card.color)
        }
        break
      case '|':
        this.game.aJunkDeck(player, card.getAge() + 1)
        this.game.actions.draw(player, { age: card.getAge() + 2 })
        break
      case 'x':
        this.game.aJunkAvailableAchievement(player, [card.getAge()])
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
    && this.game.zones.byPlayer(player, card.color).splay === 'left'
    && this.game.cards.byId('Tradition').zone.id === 'achievements'
  ) {
    this.claimAchievement(player, { name: 'Tradition' })
  }

  if (
    card.checkHasBiscuit('>')
    && this.game.zones.byPlayer(player, card.color).splay === 'right'
    && this.game.cards.byId('Repute').zone.id === 'achievements'
  ) {
    this.claimAchievement(player, { name: 'Repute' })
  }

  if (
    card.checkHasBiscuit('^')
    && this.game.zones.byPlayer(player, card.color).splay === 'up'
    && this.game.cards.byId('Fame').zone.id === 'achievements'
  ) {
    this.claimAchievement(player, { name: 'Fame' })
  }
}

function _maybeDiscoverBiscuit(player, card) {
  if (card.checkHasDiscoverBiscuit()) {
    const age = card.getAge()
    const biscuit = card.biscuits[4]
    const maxDraw = this.game.cards.byDeck('base', age).length
    const numDraw = Math.min(maxDraw, age)

    for (let i = 0; i < numDraw; i++) {
      const card = this.game.actions.draw(player, { exp: 'base', age })
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

  // Can only have one artifact on display at a time.
  if (this.game.cards.byPlayer(player, 'artifact').length > 0) {
    return
  }

  const next = this.game.cards.byPlayer(player, card.color)[1]

  // No card underneath, so no artifact dig possible.
  if (!next) {
    return
  }

  // Dig up an artifact if player melded a card of lesser or equal age of the previous top card.
  if (next.getAge() >= card.getAge()) {
    this.game.aDigArtifact(player, next.getAge())
    return
  }

  // Dig up an artifact if the melded card has its hex icon in the same position.
  if (next.getHexIndex() === card.getHexIndex()) {
    this.game.aDigArtifact(player, next.getAge())
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
      template: '{player} muse promote a card from forecast',
      args: { player },
    })
    const cards = this.game.actions.chooseAndMeld(player, choices)
    if (cards && cards.length > 0) {
      const melded = cards[0]
      this.dogma(player, melded)
    }
  }
}

function _statsCardWasMelded(card) {
  util.array.pushUnique(this.game.stats.melded, card.name)
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
