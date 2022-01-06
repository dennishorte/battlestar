const base = require('../lib/gameBase.js')
const util = require('../lib/util.js')

const res = require('./resources.js')
const transitions = require('./transitions/transitions.js')

module.exports = {
  Game,
  factory,
  res: require('./resources.js'),
}

function Game() {}

function factory(lobby) {
  const state = base.stateFactory(lobby)

  ////////////////////////////////////////////////////////////////////////////////
  // Custom state

  // Monument Achievement tuck and score counts
  state.counters.cardsTucked = 0
  state.counters.cardsScored = 0

  // Information about the current dogma action
  // This includes whether anything was done by an opponent to trigger a share bonus,
  // as well as information that needs to propagate across effects in a single card,
  // such as Charitable Trust, whose dogma allows you to meld the card drawn due to its
  // echo effect.
  state.dogma = {}

  const game = new Game()
  game.load(transitions, state, contextEnricher)
  return game
}

function contextEnricher(context) {
  const game = context.state
  if (game.state.initialized) {
    context.game = game
    if (context.data.playerName) {
      context.actor = game.getPlayerByName(context.data.playerName)
    }
    if (context.response) {
      context.options = context.response.option.map(o => game.utilOptionName(o))
    }
  }
}


////////////////////////////////////////////////////////////////////////////////
// Prototype inheritance

Game.prototype = Object.create(base.GameBase.prototype)
Object.defineProperty(Game.prototype, 'constructor', {
  value: Game,
  enumerable: false,
  writable: true
})


////////////////////////////////////////////////////////////////////////////////
// Custom functions

Game.prototype.aChooseCards = function(context, options) {
  options.cards = options.cards.map(c => c.id || c)
  return context.push('choose-cards', options)
}

Game.prototype.aDogma = function(context, player, card) {
  player = this._adjustPlayerParam(player)
  card = this._adjustCardParam(card)
  return context.push('action-dogma', {
    playerName: player.name,
    card: card.id,
  })
}

Game.prototype.aDraw = function(context, player, age) {
  player = this._adjustPlayerParam(player)
  return context.push('raw-draw', {
    playerName: player.name,
    age,
  })
}

Game.prototype.aDrawShareBonus = function(context, player) {
  player = this._adjustPlayerParam(player)
  return context.push('raw-draw', {
    playerName: player.name,
    isShareBonus: true,
  })
}

Game.prototype.aListCardsForDogmaByColor = function(player, color) {
  player = this._adjustPlayerParam(player)
  const cards = this.getZoneColorByPlayer(player, color).cards
  const extraCards = this
    .getTriggers('list-echo')
    .flatMap(t => t(player, color, cards, this))
    .map(c => c.id || c)
  return util.array.distinct(cards.concat(extraCards))
}

Game.prototype.aMeld = function(context, player, card) {
  player = this._adjustPlayerParam(player)
  card = this._adjustCardParam(card)
  return context.push('raw-meld', {
    playerName: player.name,
    card: card.id,
  })
}

Game.prototype.checkCardIsTop = function(card) {
  card = this._adjustCardParam(card)
  const zone = this.getZoneByCard(card)
  util.assert(this.checkZoneIsColorStack(zone), `Card ${card.name} isn't even on a color stack`)
  return this.checkCardsEqual(card, zone.cards[zone.cards.length - 1])
}

Game.prototype.checkCardsEqual = function(c1, c2) {
  try {
    c1 = this._adjustCardParam(c1)
    c2 = this._adjustCardParam(c2)
  }
  catch {
    return false
  }

  if (c1.id && c2.id) {
    return c1.id === c2.id
  }
  else if (c1.id) {
    return c1.id === c2
  }
  else if (c2.id) {
    return c1 === c2.id
  }
  else {
    return c1 === c2
  }
}

Game.prototype.checkEchoIsVisibile = function(card) {
  card = this._adjustCardParam(card)

  if (this.checkCardIsTop(card)) {
    return card.checkHasEcho()
  }

  const { zoneName } = this.getZoneByCard(card)
  const zone = this.getZoneByName(zoneName)

  util.assert(this.checkZoneIsColorStack(zone), 'Card ${card.name} is not in a color stack')

  return card.echoIsVisible(zone.splay)
}

Game.prototype.checkPlayersAreTeammates = function(p1, p2) {
  p1 = this._adjustPlayerParam(p1)
  p2 = this._adjustPlayerParam(p2)
  const team1 = this.getTeam(p1)
  const team2 = this.getTeam(p2)

  return team1 === team2
}

Game.prototype.checkZoneIsColorStack = function(zone) {
  zone = this._adjustZoneParam(zone)
  return (
    zone.name.endsWith('red')
    || zone.name.endsWith('yellow')
    || zone.name.endsWith('green')
    || zone.name.endsWith('blue')
    || zone.name.endsWith('purple')
  )
}

Game.prototype.getBiscuits = function(player) {
  let board = this.utilEmptyBiscuits()

  for (const color of this.utilColors()) {
    const zone = this.getZoneColorByPlayer(player, color)
    for (const cardName of zone.cards) {
      const card = this.getCardData(cardName)
      const cardBiscuits =
        this.checkCardIsTop(card)
        ? card.getBiscuits('top')
        : card.getBiscuits(zone.splay)
      board = this.utilCombineBiscuits(board, this.utilParseBiscuits(cardBiscuits))
    }
  }

  const final = this.utilCombineBiscuits(this.utilEmptyBiscuits(), board)

  for (const trigger of this.getTriggers(player, 'biscuit')) {
    this.utilAddBiscuits(final, trigger(board, this))
  }

  return {
    board,
    final
  }
}

Game.prototype.getCardData = function(card) {
  if (!card) {
    return undefined
  }
  else if (card.id) {
    return card
  }
  else {
    const data = res.all.byName[card]
    util.assert(!!data, `Unknown card name: ${card}`)
    return data
  }
}

Game.prototype.getArtifact = function(player) {
  player = this._adjustPlayerParam(player)
  const zone = this.getZoneByName(`players.${player.name}.artifact`)
  if (zone.cards.length > 0) {
    return this.getCardData(zone.cards[0])
  }
  else {
    return undefined
  }
}

Game.prototype.getAdjustedDeck = function(age, exp) {
  let baseDeck = this.getDeck('base', age)
  while (baseDeck.cards.length === 0) {
    age = age + 1
    if (age === 11) {
      throw new base.GameOverTrigger('draw an 11')
    }
    else {
      baseDeck = this.getDeck('base', age)
    }
  }

  const targetDeck = this.getDeck(exp, age)
  if (targetDeck.cards.length === 0) {
    return {
      adjustedAge: age,
      adjustedExp: 'base',
    }
  }
  else {
    return {
      adjustedAge: age,
      adjustedExp: exp
    }
  }
}

Game.prototype.getCardTop = function(player, color) {
  player = this._adjustPlayerParam(player)
  const zone = this.getZoneColorByPlayer(player, color)
  return this.getCardData(zone.cards[zone.cards.length - 1])
}

Game.prototype.getDogmaInfo = function() {
  return this.state.dogma
}

Game.prototype.getExpansionList = function() {
  return this.state.options.expansions
}

Game.prototype.getDeck = function(exp, age) {
  return this.getZoneByName(`decks.${exp}.${age}`)
}

Game.prototype.getHand = function(player) {
  player = this._adjustPlayerParam(player)
  return this.getZoneByName(`players.${player.name}.hand`)
}

Game.prototype.getHighestTopCard = function(player) {
  player = this._adjustPlayerParam(player)
  const topCards = this
    .utilColors()
    .map(color => this.getCardTop(player, color))
    .filter(card => card !== undefined)
    .sort((l, r) => r.age - l.age)

  if (topCards.length === 0) {
    return 1
  }
  else {
    return topCards[0].age
  }
}

Game.prototype.getTeam = function(player) {
  player = this._adjustPlayerParam(player)
  return player.team
}

Game.prototype.getTriggers = function(player, name) {
  return []
}

Game.prototype.getZoneArtifact = function(player) {
  player = this._adjustPlayerParam(player)
  return this.getZoneByName(`players.${player.name}.artifact`)
}

// Overload GameBase because that assumes cards are objects instead of just strings
Game.prototype.getZoneByCard = function(card) {
  card = this._adjustCardParam(card)
  const { zoneName } = this.getCardByPredicate(c => this.checkCardsEqual(c, card))
  util.assert(!!zoneName, `No zone found for card`)
  return this.getZoneByName(zoneName)
}

Game.prototype.getZoneColorByPlayer = function(player, color) {
  player = this._adjustPlayerParam(player)
  return this.getZoneByName(`players.${player.name}.${color}`)
}

Game.prototype.mSetVisibilityForZone = function(zone, card) {
  /* if (zone.kind === 'private') {
   *   this.rk.replace(card.visibility, [zone.owner])
   * }
   * else if (zone.kind === 'public') {
   *   this.rk.replace(card.visibility, this.getPlayerAll().map(p => p.name))
   * }
   * else if (zone.kind === 'deck') {
   *   this.rk.replace(card.visibility, [])
   * }
   * else {
   *   throw new Error(`Unhandled visibility type for zone: ${zone.kind}`)
   * } */
}

Game.prototype.mDraw = function(player, exp, age) {
  player = this._adjustPlayerParam(player)
  const base = this.getDeck('base', age)
  const deck = this.getDeck(exp, age)
  const hand = this.getHand(player)

  // Used for calculating share bonuses
  this.rk.put(this.getDogmaInfo()[player.name], 'acted', true)

  util.assert(
    this.getExpansionList().includes(exp),
    `Can't draw from ${deck.name} because ${exp} is not being used.`)
  util.assert(
    base.cards.length > 0,
    `Can't draw from ${deck.name} because ${base.name} is empty`)
  util.assert(
    deck.cards.length > 0,
    `Can't draw from ${deck.name} because it is empty`)

  const card = this.mMoveCard(deck, hand)
  this.mLog({
    template: '{player} draws {card}',
    args: {
      player,
      card
    }
  })
}

Game.prototype.mMeld = function(player, card) {
  player = this._adjustPlayerParam(player)
  card = this._adjustCardParam(card)

  // Used for calculating share bonuses
  this.rk.put(this.getDogmaInfo()[player.name], 'acted', true)

  const source = this.getZoneByCard(card)
  const target = this.getZoneColorByPlayer(player, card.color)
  this.mMoveCard(source, target, card)
  this.mLog({
    template: '{player} melds {card}',
    args: { player, card }
  })
}

Game.prototype.mMoveCard = function(source, target, card) {
  source = this._adjustZoneParam(source)
  target = this._adjustZoneParam(target)

  let cardIndex

  if (card) {
    cardIndex = source.cards.findIndex(c => this.checkCardsEqual(c, card))
  }
  else {
    card = source.cards[0]
    cardIndex = 0
  }
  card = this._adjustCardParam(card)

  util.assert(cardIndex !== -1, `${card.name} not found in ${source.name}`)

  this.mMoveByIndices(source, cardIndex, target, target.cards.length)
  this.mSetVisibilityForZone(target, card)

  return card
}

Game.prototype.mNextTurn = function() {
  const nextIndex = (this.state.turn.playerIndex + 1) % this.getPlayerAll().length
  this.rk.put(this.state.turn, 'playerIndex', nextIndex)
}

Game.prototype.mResetDogmaInfo = function() {
  this.rk.put(this.state, 'dogma', this.utilEmptyDogmaInfo())
}

Game.prototype.mReturnAll = function(player, zone) {
  player = this._adjustPlayerParam(player)
  zone = this._adjustZoneParam(zone)
  for (let i = zone.cards.length - 1; i >= 0; i--) {
    this.mReturnCard(player, zone.cards[i])
  }
}

Game.prototype.mReturnCard = function(player, card) {
  player = this._adjustPlayerParam(player)
  card = this._adjustCardParam(card)

  // Used for calculating share bonuses
  this.rk.put(this.getDogmaInfo()[player.name], 'acted', true)

  const zone = this.getZoneByCard(card)
  const homeDeck = this.getDeck(card.expansion, card.age)
  this.mMoveCard(zone, homeDeck, card)
}

Game.prototype.mSetStartingPlayer = function(player) {
  player = this._adjustPlayerParam(player)
  const index = this.getPlayerAll().findIndex(p => p.name === player.name)
  this.rk.put(this.state.turn, 'playerIndex', index)
}

Game.prototype.oDogma = function(card) {
  card = this._adjustCardParam(card)
  return {
    name: `${card.name}`,
    kind: 'dogma',
    card: card.id,
  }
}

Game.prototype.oMeld = function(card) {
  card = this._adjustCardParam(card)
  return {
    name: `${card.name}`,
    kind: 'meld',
    card: card.id,
  }
}

Game.prototype.utilColors = function() {
  return [
    'red',
    'yellow',
    'green',
    'blue',
    'purple',
  ]
}

Game.prototype.utilCombineBiscuits = function(left, right) {
  const combined = this.utilEmptyBiscuits()
  for (const biscuit of Object.keys(combined)) {
    combined[biscuit] += left[biscuit]
    combined[biscuit] += right[biscuit]
  }
  return combined
}

Game.prototype.utilEmptyDogmaInfo = function() {
  return util.array.toDict(this.getPlayerAll(), p => ({ [p.name]: {
    acted: false
  }}))
}

Game.prototype.utilEmptyBiscuits = function() {
  return {
    c: 0,
    f: 0,
    i: 0,
    k: 0,
    l: 0,
    s: 0,
  }
}

Game.prototype.utilEnrichLogArgs = function(msg) {
  for (const key of Object.keys(msg.args)) {
    if (key === 'player') {
      const player = this._adjustPlayerParam(msg.args[key])
      msg.args[key] = {
        value: player.name,
        classes: ['player-name']
      }
    }
    else if (key === 'card') {
      const card = this._adjustCardParam(msg.args[key])
      msg.args[key] = {
        value: card.name,
        classes: [`card`],
      }
    }
    else if (key === 'zone') {
      const zone = this._adjustZoneParam(msg.args[key])
      msg.args[key] = {
        value: zone.name,
        classes: ['zone-name']
      }
    }
    // Convert string args to a dict
    else if (typeof msg.args[key] !== 'object') {
      msg.args[key] = {
        value: msg.args[key],
      }
    }

    // Ensure the classes key is set for all entries.
    msg.args[key].classes = msg.args[key].classes || []
  }
}

Game.prototype.utilParseBiscuits = function(biscuitString) {
  const counts = this.utilEmptyBiscuits()
  for (const ch of biscuitString) {
    if (counts.hasOwnProperty(ch)) {
      counts[ch] += 1
    }
  }
  return counts
}

Game.prototype.utilOptionName = function(option) {
  return option.name || option
}

Game.prototype._adjustCardParam = function(card) {
  return this.getCardData(card)
}
