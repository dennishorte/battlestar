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
  state.monument = {}

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

Game.prototype.aAchieve = function(context, player, achievement) {
  return context.push('action-achieve', {
    playerName: player.name,
    achievement,
  })
}

Game.prototype.aAchievementCheck = function(context) {
  return context.push('achievement-check')
}

Game.prototype.aCheckKarma = function(context, trigger, opts) {
  // Copy select parameters from context
  const data = {
    playerName: context.data.playerName,
    age: context.data.age || '',
    color: context.data.color || '',
    card: context.data.card || '',
    direction: context.data.direction || '',
    trigger,
    opts: opts || {},
  }

  return context.push('check-karma', data)
}

Game.prototype.aChoose = function(context, options) {
  options.cards = options.choices.map(c => c.id || c)
  return context.push('choose', options)
}

Game.prototype.aChooseAndSplay = function(context, options) {
  return context.push('choose-and-splay', options)
}

Game.prototype.aClaimAchievement = function(context, player, achievement, opts) {
  player = this._adjustPlayerParam(player)
  achievement = this._adjustCardParam(achievement)
  return context.push('claim-achievement', {
    playerName: player.name,
    card: achievement.name,
    opts: opts || {},
  })
}

Game.prototype.aClaimAchievementStandard = function(context, player, age, isAction) {
  player = this._adjustPlayerParam(player)
  return context.push('claim-achievement-standard', {
    playerName: player.name,
    age,
    isAction: isAction || false
  })
}

Game.prototype.aDecree = function(context, player, decree) {
  player = this._adjustPlayerParam(player)
  decree = this._adjustCardParam(decree)
  return context.push('action-decree', {
    playerName: player.name,
    decree: decree.id,
  })
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

Game.prototype.aDrawMany = function(context, player, age, count) {
  player = this._adjustPlayerParam(player)
  return context.push('draw-many', {
    playerName: player.name,
    age: age || '',
    count,
  })
}

Game.prototype.aDrawAndForecast = function(context, player, age) {
  player = this._adjustPlayerParam(player)
  return context.push('draw-and-forecast', {
    playerName: player.name,
    age,
  })
}

Game.prototype.aDrawAndMeld = function(context, player, age) {
  player = this._adjustPlayerParam(player)
  return context.push('draw-and-meld', {
    playerName: player.name,
    age,
  })
}

Game.prototype.aDrawAndScore = function(context, player, age) {
  player = this._adjustPlayerParam(player)
  return context.push('draw-and-score', {
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

Game.prototype.aExecute = function(context, player, card) {
  player = this._adjustPlayerParam(player)
  card = this._adjustCardParam(card)
  return context.push('action-dogma', {
    playerName: player.name,
    card: card.id,
    noDemand: true,
    noShare: true,
  })
}

Game.prototype.aForecast = function(context, player, card) {
  player = this._adjustPlayerParam(player)
  card = this._adjustCardParam(card)
  return context.push('forecast', {
    playerName: player.name,
    card: card.id,
  })
}

Game.prototype.aInspire = function(context, player, color) {
  player = this._adjustPlayerParam(player)
  return context.push('action-inspire', {
    playerName: player.name,
    color,
  })
}

Game.prototype.aListCardsForDogmaByColor = function(player, color) {
  player = this._adjustPlayerParam(player)
  const cards = this.getZoneColorByPlayer(player, color).cards
  return cards
}

Game.prototype.aMeld = function(context, player, card) {
  player = this._adjustPlayerParam(player)
  card = this._adjustCardParam(card)
  return context.push('meld', {
    playerName: player.name,
    card: card.id,
  })
}

Game.prototype.aRemove = function(context, player, card) {
  player = this._adjustPlayerParam(player)
  card = this._adjustCardParam(card)
  return context.push('remove', {
    playerName: player.name,
    card: card.id,
  })
}

Game.prototype.aRemoveMany = function(context, player, cards) {
  player = this._adjustPlayerParam(player)
  cards = this._serializeCardList(cards)
  return context.push('remove-many', {
    playerName: player.name,
    cards,
  })
}

Game.prototype.aReturn = function(context, player, card) {
  player = this._adjustPlayerParam(player)
  card = this._adjustCardParam(card)
  return context.push('return', {
    playerName: player.name,
    card: card.id
  })
}

Game.prototype.aReturnAchievement = function(context, player, card) {
  player = this._adjustPlayerParam(player)
  card = this._adjustCardParam(card)
  return context.push('return-achievement', {
    playerName: player.name,
    card: card.id
  })
}

Game.prototype.aReturnMany = function(context, player, cards) {
  player = this._adjustPlayerParam(player)
  cards = this._serializeCardList(cards)
  return context.push('return-many', {
    playerName: player.name,
    cards,
  })
}

Game.prototype.aSplay = function(context, player, color, direction) {
  player = this._adjustPlayerParam(player)
  return context.push('splay', {
    playerName: player.name,
    color,
    direction,
  })
}

Game.prototype.aTransferCards = function(context, player, cards, dest) {
  player = this._adjustPlayerParam(player)
  cards = this._serializeCardList(cards)
  dest = this._adjustZoneParam(dest)
  return context.push('transfer-cards', {
    playerName: player.name,
    cards,
    dest: dest.name
  })
}

Game.prototype.aScore = function(context, player, card) {
  player = this._adjustPlayerParam(player)
  card = this._adjustCardParam(card)
  return context.push('score', {
    playerName: player.name,
    card: card.id,
  })
}

Game.prototype.checkAchievementAvailable = function(achievement) {
  achievement = this._adjustCardParam(achievement)
  const zone = this.getZoneByName('achievements')
  return zone.cards.find(c => c === achievement.name) !== undefined
}

Game.prototype.checkCanClaimAchievement = function(player, card) {
  player = this._adjustPlayerParam(player)
  card = this._adjustCardParam(card)

  const score = this.getScore(player)
  const currentAchievements = this.getAchievements(player).cards.map(this.getCardData)
  const baseCost = card.age * 5
  const multiplier = 1 + currentAchievements.filter(c => c.age === card.age).length
  const totalCost = baseCost * multiplier

  const highestCardValue = this.getHighestTopCard(player)

  const ageRequirement = card.age <= highestCardValue
  const scoreRequirement = totalCost <= score

  return ageRequirement && scoreRequirement
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

Game.prototype.checkEchoIsVisible = function(card) {
  card = this._adjustCardParam(card)

  if (this.checkCardIsTop(card)) {
    return card.checkHasEcho()
  }

  const zone = this.getZoneByCard(card)
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

Game.prototype.getAchievements = function(player) {
  player = this._adjustPlayerParam(player)
  return this.getZoneByName(`players.${player.name}.achievements`)
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

Game.prototype.getAvailableAchievements = function(player) {
  const highestCard = this.getHighestTopCard(player)
  const playerScore = this.getScore(player)

  const standard = this
    .getZoneByName('achievements')
    .cards
    .map(this.getCardData)
    .filter(c => c.age)  // Cards without ages are special achievements

  // Achievements due to karma
  const karmas = this
    .getCardsByKarmaTrigger(player, 'list-achievements')
    .flatMap(card => this.utilApplyKarma(card, 'list-achievements', this, player))
    .map(this.getCardData)

  return {
    standard,
    karmas
  }
}

Game.prototype.getBiscuits = function(player) {
  let board = this.utilEmptyBiscuits()

  for (const color of this.utilColors()) {
    const zone = this.getZoneColorByPlayer(player, color)
    board = this.utilCombineBiscuits(board, this.getBiscuitsInZone(zone))
  }

  const final = this.utilCombineBiscuits(this.utilEmptyBiscuits(), board)

  /* for (const karma of this.getKarma(player, 'biscuit')) {
   *   this.utilAddBiscuits(final, karma(board, this))
   * }
   */
  return {
    board,
    final
  }
}

Game.prototype.getBiscuitsInZone = function(zone) {
  zone = this._adjustZoneParam(zone)

  let count = this.utilEmptyBiscuits()

  for (const cardName of zone.cards) {
    const cardBiscuits = this.getBiscuitsRaw(cardName, zone.splay)
    count = this.utilCombineBiscuits(count, this.utilParseBiscuits(cardBiscuits))
  }
  return count
}

Game.prototype.getBiscuitsRaw = function(card, splay) {
  card = this._adjustCardParam(card)
  return this.checkCardIsTop(card)
       ? card.getBiscuits('top')
       : card.getBiscuits(splay)
}

Game.prototype.getBonuses = function(player) {
  const bonuses = []
  bonuses.sort((l, r) => r - l)
  return bonuses
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

Game.prototype.getCardTop = function(player, color) {
  player = this._adjustPlayerParam(player)
  const zone = this.getZoneColorByPlayer(player, color)
  return this.getCardData(zone.cards[zone.cards.length - 1])
}

Game.prototype.getCardsByKarmaTrigger = function(player, trigger, ...args) {
  player = this._adjustPlayerParam(player)
  return this
    .utilColors()
    .map(color => this.getCardTop(player, color))
    .filter(card => card !== undefined)
    .filter(card => {
      const impl = card.karmaImpl.find(t => t.trigger === trigger)
      return impl && impl.checkApplies(this, player, ...args)
    })
}

Game.prototype.getColorsForSplaying = function(player, direction) {
  player = this._adjustPlayerParam(player)
  return this
    .utilColors()
    .map(color => [color, this.getZoneColorByPlayer(player, color)])
    .filter(([color, zone]) => zone.cards.length > 1 && zone.splay !== direction)
    .map(([color, zone]) => color)
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

Game.prototype.getForecast = function(player) {
  player = this._adjustPlayerParam(player)
  return this.getZoneByName(`players.${player.name}.forecast`)
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

Game.prototype.getScore = function(player) {
  player = this._adjustPlayerParam(player)

  let total = 0

  // Cards in score
  for (const cardName of this.getZoneScore(player).cards) {
    total += this.getCardData(cardName).age
  }

  // Bonuses
  const bonuses = this.getBonuses(player)
  if (bonuses.length > 0) {
    // Highest bonus counts for full points
    total += bonuses[0]
    // Other bonuses count for one point each
    total += bonuses.length - 1
  }

  this
    .getCardsByKarmaTrigger(player, 'calculate-score')
    .map(card => this.utilApplyKarma(card, 'calculate-score', this, player))
    .forEach(points => total += points )

  return total
}

Game.prototype.getStacks = function(player) {
  player = this._adjustPlayerParam(player)
  return this
    .utilColors()
    .map(color => this.getZoneColorByPlayer(player,color))
}

Game.prototype.getTeam = function(player) {
  player = this._adjustPlayerParam(player)
  return player.team
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

Game.prototype.getZoneScore = function(player) {
  player = this._adjustPlayerParam(player)
  return this.getZoneByName(`players.${player.name}.score`)
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

Game.prototype.mClaimAchievement = function(player, card) {
  player = this._adjustPlayerParam(player)
  card = this._adjustCardParam(card)

  const sourceZone = this.getZoneByCard(card)
  const targetZone = this.getAchievements(player)
  return this.mMoveCard(sourceZone, targetZone, card)
}

Game.prototype.mDraw = function(player, exp, age) {
  player = this._adjustPlayerParam(player)
  const base = this.getDeck('base', age)
  const deck = this.getDeck(exp, age)
  const hand = this.getHand(player)

  this.mPlayerActed(player)

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

  return card
}

Game.prototype.mForecast = function(player, card) {
  player = this._adjustPlayerParam(player)
  card = this._adjustCardParam(card)

  this.mPlayerActed(player)

  const source = this.getZoneByCard(card)
  const target = this.getForecast(player)
  this.mLog({
    template: '{player} forecasts {card}',
    args: { player, card }
  })
  return this.mMoveCard(source, target, card)
}

Game.prototype.mMeld = function(player, card) {
  player = this._adjustPlayerParam(player)
  card = this._adjustCardParam(card)

  this.mPlayerActed(player)

  const source = this.getZoneByCard(card)
  const target = this.getZoneColorByPlayer(player, card.color)
  this.mMoveCard(source, target, card, { top: true })
  this.mLog({
    template: '{player} melds {card}',
    args: { player, card }
  })
  return card
}

Game.prototype.mMoveCard = function(source, target, card, options) {
  source = this._adjustZoneParam(source)
  target = this._adjustZoneParam(target)
  options = Object.assign({
    top: false,
  }, options)

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

  const destIndex = options.top ? 0 : target.cards.length

  this.mMoveByIndices(source, cardIndex, target, destIndex)
  this.mSetVisibilityForZone(target, card)

  return card
}

Game.prototype.mNextTurn = function() {
  const nextIndex = (this.state.turn.playerIndex + 1) % this.getPlayerAll().length
  this.rk.put(this.state.turn, 'playerIndex', nextIndex)
  this.mResetMonumentCounts()
}

Game.prototype.mPlayerActed = function(player) {
  player = this._adjustPlayerParam(player)
  // Used for calculating share bonuses
  this.rk.put(this.getDogmaInfo()[player.name], 'acted', true)
}

Game.prototype.mRemove = function(player, card) {
  player = this._adjustPlayerParam(player)
  card = this._adjustCardParam(card)

  const zone = this.getZoneByCard(card)
  return this.mMoveCard(zone, 'exile', card)
}

Game.prototype.mResetDogmaInfo = function() {
  this.rk.put(this.state, 'dogma', this.utilEmptyDogmaInfo())
}

Game.prototype.mResetMonumentCounts = function() {
  const counts = util.array.toDict(this.getPlayerAll(), p => {
    return { [p.name]: { tuck: 0, score: 0 } }
  })
  this.rk.put(this.state, 'monument', counts)
}

Game.prototype.mReturnAll = function(player, zone) {
  player = this._adjustPlayerParam(player)
  zone = this._adjustZoneParam(zone)
  for (let i = zone.cards.length - 1; i >= 0; i--) {
    this.mReturn(player, zone.cards[i])
  }
}

Game.prototype.mReturn = function(player, card) {
  player = this._adjustPlayerParam(player)
  card = this._adjustCardParam(card)

  this.mPlayerActed(player)

  const zone = this.getZoneByCard(card)
  const homeDeck = this.getDeck(card.expansion, card.age)
  return this.mMoveCard(zone, homeDeck, card)
}

Game.prototype.mReturnAchievement = function(player, card) {
  player = this._adjustPlayerParam(player)
  card = this._adjustCardParam(card)

  this.mPlayerActed(player)

  const zone = this.getZoneByCard(card)
  return this.mMoveCard(zone, 'achievements', card)
}

Game.prototype.mScore = function(player, card) {
  player = this._adjustPlayerParam(player)
  card = this._adjustCardParam(card)
  const cardZone = this.getZoneByCard(card)
  const scoreZone = this.getZoneScore(player)

  this.mPlayerActed(player)

  // Special case for Monument achievement
  this.rk.increment(this.state.monument[player.name], 'score')

  return this.mMoveCard(cardZone, scoreZone, card)
}

Game.prototype.mSetStartingPlayer = function(player) {
  player = this._adjustPlayerParam(player)
  const index = this.getPlayerAll().findIndex(p => p.name === player.name)
  this.rk.put(this.state.turn, 'playerIndex', index)
}

Game.prototype.mSplay = function(player, color, direction) {
  player = this._adjustPlayerParam(player)
  const zone = this.getZoneColorByPlayer(player, color)
  this.rk.put(zone, 'splay', direction)
  this.mPlayerActed(player)
}

Game.prototype.mTuck = function(player, card) {
  player = this._adjustPlayerParam(player)
  card = this._adjustCardParam(card)
  const cardZone = this.getZoneByCard(card)
  const tuckZone = this.getZoneColorByPlayer(player, card.color)

  this.mPlayerActed(player)

  // Special case for Monument achievement
  game.rk.increment(this.state.monument[player.name], 'score')

  return this.mMoveCard(cardZone, tuckZone, card)
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

Game.prototype.utilApplyKarma = function(card, trigger, ...args) {
  card = this._adjustCardParam(card)
  const impl = card.getImpl(`karma-${trigger}`)[0]
  return impl.func(...args)
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

Game.prototype.utilColorToDecree = function(color) {
  switch (color) {
    case 'red': return 'War';
    case 'yellow': return 'Expansion';
    case 'green': return 'Trade';
    case 'blue': return 'Advancement';
    case 'purple': return 'Rivalry';
    default:
      throw new Error(`Unknown color ${color}`)
  }
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
    if (key.startsWith('player')) {
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
    else if (key.startsWith('zone')) {
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

Game.prototype.utilSeparateByAge = function(cards) {
  cards = this._adjustCardsParam(cards)
  const byAge = {}
  for (const card of cards) {
    if (byAge.hasOwnProperty(card.age)) {
      byAge[card.age].push(card)
    }
    else {
      byAge[card.age] = [card]
    }
  }
  return byAge
}

Game.prototype._adjustCardParam = function(card) {
  return this.getCardData(card)
}

Game.prototype._adjustCardsParam = function(cards) {
  return cards.map(c => this.getCardData(c))
}

Game.prototype._serializeCardList = function(cards) {
  return cards.map(c => c.id || c)
}
