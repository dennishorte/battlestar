const {
  Game,
  GameFactory,
  GameOverEvent,
  InputRequestEvent,
} = require('../lib/game.js')
const res = require('./resources.js')
const util = require('../lib/util.js')
const { Zone } = require('./zone.js')


module.exports = {
  GameOverEvent,
  Innovation,
  InnovationFactory,

  constructor: Innovation,
  factory: factoryFromLobby,
  res,
}

function Innovation(serialized_data, viewerName) {
  Game.call(this, serialized_data, viewerName)
}

util.inherit(Game, Innovation)

function InnovationFactory(settings, viewerName) {
  const data = GameFactory(settings)
  return new Innovation(data, viewerName)
}

function factoryFromLobby(lobby) {
  return GameFactory({
    game: 'Innovation',
    name: lobby.name,
    expansions: lobby.options.expansions,
    players: lobby.users,
    seed: lobby.seed,
  })
}

Innovation.prototype._mainProgram = function() {
  this.initialize()
  this.firstPicks()
  this.mainLoop()
}

Innovation.prototype._gameOver = function(event) {
  for (const player of this.getPlayerAll()) {
    try {
      this.state.wouldWinKarma = true
      this.aKarma(event.data.player, 'would-win')
    }
    catch (e) {
      if (e instanceof GameOverEvent) {
        event = e
      }
      else {
        throw e
      }
    }
  }

  this.mLog({
    template: '{player} wins due to {reason}',
    args: {
      player: event.data.player,
      reason: event.data.reason,
    }
  })

  return event
}


////////////////////////////////////////////////////////////////////////////////
// Initialization

Innovation.prototype.initialize = function() {
  this.mLog({ template: 'Initializing' })
  this.mLogIndent()

  this.cardData = res.generate()

  this.initializePlayers()
  this.initializeTeams()
  this.initializeZones()
  this.initializeStartingCards()
  this.initializeTransientState()

  this.mLogOutdent()

  this.state.initializationComplete = true
  this._breakpoint('initialization-complete')
}

Innovation.prototype.initializeTransientState = function() {
  this.mResetDogmaInfo()
  this.mResetMonumentCounts()
  this.mResetPeleCount()
  this.state.turn = 1
  this.state.round = 1
  this.state.karmaDepth = 0
  this.state.wouldWinKarma = false
  this.state.didInspire = false
  this.state.didEndorse = false
  this.stats = {
    melded: [],
    meldedBy: {},
    highestMelded: 1,
    firstToMeldOfAge: [],
    dogmaActions: {},
  }
}

Innovation.prototype.initializePlayers = function() {
  this.state.players = this.settings.players.map(p => ({
    _id: p._id,
    id: p.name,
    name: p.name,
    team: p.name,
  }))
  util.array.shuffle(this.state.players, this.random)
  this.state.players.forEach((player, index) => {
    player.index = index
  })
}

Innovation.prototype.initializeTeams = function() {
  const players = this.state.players
  let teamMod = players.length
  if (this.settings.teams) {
    util.assert(this.getPlayerAll().length === 4, 'Teams only supported with 4 players')
    teamMod = 2
  }
  for (let i = 0; i < players.length; i++) {
    const teamNumber = i % teamMod
    players[i].team = `team${teamNumber}`
  }
}

Innovation.prototype.initializeZones = function() {
  this.state.zones = {}
  this.initializeZonesDecks()

  // Set the home zone of all cards before moving them around.
  this._walkZones(this.state.zones, (zone, path) => {
    zone.id = path.join('.')
    for (const card of zone.cards()) {
      card.home = zone.id
    }
  })

  this.initializeZonesAchievements()
  this.initializeZonesPlayers()
  this.state.zones.junk = new Zone(this, 'junk', 'public')

  // Set an id that can be used to quickly fetch a zone.
  this._walkZones(this.state.zones, (zone, path) => {
    zone.id = path.join('.')
    for (const card of zone.cards()) {
      card.zone = zone.id
      card.visibility = []
    }
  })
}

Innovation.prototype.initializeZonesDecks = function() {
  const zones = this.state.zones
  zones.decks = {}
  for (const exp of ['base', 'echo', 'figs', 'city', 'arti']) {
    zones.decks[exp] = {}
    const data = this.cardData[exp]
    for (const [age, cards] of Object.entries(this.cardData[exp].byAge)) {
      if (!cards) {
        throw new Error(`Missing cards for ${exp}-${age}`)
      }
      else if (!Array.isArray(cards)) {
        throw new Error(`Cards for ${exp}-${age} is of type ${typeof cards}`)
      }
      util.array.shuffle(cards, this.random)
      zones.decks[exp][age] = new Zone(this, `decks.${exp}.${age}`, 'deck')
      zones.decks[exp][age].setCards(cards)
    }
  }
}

Innovation.prototype.initializeZonesAchievements = function() {
  const zones = this.state.zones

  zones.achievements = new Zone(this, 'achievements', 'achievements')

  // Standard achievements
  for (const age of [1,2,3,4,5,6,7,8,9]) {
    const ageZone = this.getZoneByDeck('base', age)
    const achZone = this.getZoneById('achievements')
    const card = this.mMoveTopCard(ageZone, achZone)
  }

  // Special achievements
  for (const exp of ['base', 'echo', 'figs', 'city', 'arti']) {
    if (this.getExpansionList().includes(exp)) {
      for (const ach of this.cardData[exp].achievements) {
        zones.achievements._cards.push(ach)
        ach.home = 'achievements'
      }
    }
  }
}

Innovation.prototype.initializeZonesPlayers = function() {
  const self = this
  const zones = this.state.zones
  zones.players = {}

  function _addPlayerZone(player, name, kind, root) {
    root[name] = new Zone(self, `players.${player.name}.${name}`, kind)
    root[name].owner = player.name
  }

  for (const player of this.getPlayerAll()) {
    const root = {}
    _addPlayerZone(player, 'hand', 'private', root)
    _addPlayerZone(player, 'score', 'private', root)
    _addPlayerZone(player, 'forecast', 'private', root)
    _addPlayerZone(player, 'achievements', 'achievements', root)
    _addPlayerZone(player, 'red', 'public', root)
    _addPlayerZone(player, 'blue', 'public', root)
    _addPlayerZone(player, 'green', 'public', root)
    _addPlayerZone(player, 'yellow', 'public', root)
    _addPlayerZone(player, 'purple', 'public', root)
    _addPlayerZone(player, 'artifact', 'public', root)
    _addPlayerZone(player, 'museum', 'public', root)
    _addPlayerZone(player, 'safe', 'hidden', root)
    zones.players[player.name] = root

    for (const color of this.utilColors()) {
      root[color].color = color
      root[color].splay = 'none'
    }
  }
}

Innovation.prototype.initializeStartingCards = function() {
  for (const player of this.getPlayerAll()) {
    this.mDraw(player, 'base', 1, { silent: true })

    if (this.getExpansionList().includes('echo')) {
      this.mDraw(player, 'echo', 1, { silent: true })
    }
    else {
      this.mDraw(player, 'base', 1, { silent: true })
    }
  }
}


////////////////////////////////////////////////////////////////////////////////
// Primary game logic

Innovation.prototype.firstPicks = function() {
  this.mLog({ template: 'Choosing starting cards' })
  this.mLogIndent()
  const requests = this
    .getPlayerAll()
    .map(p => ({
      actor: this.utilSerializeObject(p),
      title: 'Choose First Card',
      choices: this.getZoneByPlayer(p, 'hand').cards().map(this.utilSerializeObject),
    }))

  const picks = this
    .requestInputMany(requests)
    .map(resp => [
      this.getPlayerByName(resp.actor),
      this.getCardByName(resp.selection[0])
    ])
    .sort((l, r) => l[1].name.localeCompare(r[1].name))
  for (const [player, card] of picks) {
    this.mMeld(player, card)
  }

  this.state.currentPlayer = picks[0][0]

  this.mLogOutdent()

  this.state.firstPicksComplete = true

  this._breakpoint('before-first-player')
}

Innovation.prototype.mainLoop = function() {
  while (true) {
    this.mLog({
      template: "{player}'s turn {count}",
      classes: ['player-turn-start'],
      args: {
        player: this.getPlayerCurrent(),
        count: this.state.round,
      }
    })

    this.artifact()
    this.action(1)
    this.action(2)
    this.endTurn()
  }
}

Innovation.prototype.artifact = function() {
  const player = this.getPlayerCurrent()
  const artifact = this.getZoneByPlayer(player, 'artifact').cards()[0]
  if (artifact) {
    this.mLog({
      template: 'Free Artifact Action',
    })
    this.mLogIndent()

    const action = this.requestInputSingle({
      actor: player.name,
      title: 'Free Artifact Action',
      choices: ['dogma', 'return', 'skip']
    })[0]

    switch (action) {
      case 'dogma':
        const startingZone = artifact.zone
        this.aDogma(player, artifact, { artifact: true })
        if (startingZone === artifact.zone) {
          this.aReturn(player, artifact)
        }
        this.fadeFiguresCheck()
        break
      case 'return':
        this.aReturn(player, artifact)
        break
      case 'skip':
        this.mLog({
          template: '{player} skips the free artifact action',
          classes: ['action-header'],
          args: { player },
        })
        break
      default:
        throw new Error(`Unknown artifact action: ${action}`)
    }

    this.mLogOutdent()
  }
}

Innovation.prototype.action = function(count) {
  const player = this.getPlayerCurrent()

  // The first player (or two) only gets one action
  const numFirstPlayers = this.getPlayerAll().length >= 4 ? 2 : 1
  if (this.state.turn <= numFirstPlayers) {
    if (count === 1) {
      this.mLog({
        template: '{player} gets only 1 action for the first round',
        args: { player }
      })
    }
    else if (count === 2) {
      return
    }
  }

  const countTerm = count === 1 ? 'First' : 'Second'
  this.mLog({
    template: `${countTerm} action`,
    classes: ['action-header'],
  })
  this.mLogIndent()

  const chosenAction = this.requestInputSingle({
    actor: player.name,
    title: `Choose ${countTerm} Action`,
    choices: this._generateActionChoices(),
  })[0]

  const name = chosenAction.title
  const arg = chosenAction.selection[0]

  if (name === 'Achieve') {
    this.aAchieveAction(player, arg)
  }
  else if (name === 'Decree') {
    this.aDecree(player, arg)
  }
  else if (name === 'Dogma') {
    const card = this.getCardByName(arg)
    this.aDogma(player, card)
  }
  else if (name === 'Draw') {
    this.aDraw(player, { isAction: true })
  }
  else if (name === 'Endorse') {
    this.aEndorse(player, arg)
  }
  else if (name === 'Inspire') {
    this.aInspire(player, arg)
  }
  else if (name === 'Meld') {
    const card = this.getCardByName(arg)
    this.aMeld(player, card, { asAction: true })
  }
  else {
    throw new Error(`Unhandled action type ${name}`)
  }

  this.mLogOutdent()

  this.fadeFiguresCheck()
}

Innovation.prototype.fadeFiguresCheck = function() {
  for (const player of this.getPlayerAll()) {
    const topFiguresFn = () => this
      .getTopCards(player)
      .filter(card => card.checkIsFigure())

    if (topFiguresFn().length > 1) {
      this.mLog({
        template: '{player} has {count} figures and must fade some',
        args: { player, count: topFiguresFn().length }
      })
      this.mLogIndent()

      while (topFiguresFn().length > 1) {
        const karmaInfos = this.getInfoByKarmaTrigger(player, 'no-fade')
        if (karmaInfos.length > 0) {
          this.mLog({
            template: '{player} fades nothing due to {card}',
            args: { player, card: karmaInfos[0].card }
          })
          break
        }

        const toFade = this.aChooseCard(player, topFiguresFn())
        this.aScore(player, toFade)
      }

      this.mLogOutdent()
    }
  }
}

Innovation.prototype.endTurn = function() {
  const players = this.getPlayerAll()

  // Set next player
  this.state.currentPlayer = this.getPlayerNext()

  // Track number of turns
  this.state.turn += 1
  this.state.round = Math.floor((this.state.turn + players.length - 1) / players.length)

  // Reset various turn-centric state
  this.state.didEndorse = false
  this.state.didInspire = false
  this.mResetDogmaInfo()
  this.mResetMonumentCounts()
  this.mResetPeleCount()
}


////////////////////////////////////////////////////////////////////////////////
// Actions

Innovation.prototype.aAchieveAction = function(player, arg, opts={}) {
  if (arg.startsWith('age ')) {
    const age = parseInt(arg.slice(4))
    const isStandard = opts.nonAction ? false : true
    this.aClaimAchievement(player, { age, isStandard })
  }
  else {
    const card = this.getCardByName(arg)
    this.aClaimAchievement(player, { card })
  }
}

Innovation.prototype.aCardEffect = function(player, info, opts={}) {
  const prevLeader = this.state.dogmaInfo.effectLeader
  if (opts.leader) {
    this.state.dogmaInfo.effectLeader = opts.leader
  }

  const fn = typeof info.impl === 'function' ? info.impl : info.impl.func
  const result = fn(this, player, opts)

  if (opts.leader) {
    this.state.dogmaInfo.effectLeader = prevLeader
  }

  return result
}

Innovation.prototype.aExecuteAsIf = function(player, card) {
  const { featuredBiscuit, biscuits } = this.state.dogmaInfo
  const { sharing, demanding } =
    this.getSharingAndDemanding(player, featuredBiscuit, biscuits)

  const effectOptions = {
    sharing,
    demanding,
    noShare: true,
  }

  this.mLogIndent()
  this.aCardEffects(player, card, 'echo', effectOptions)
  this.aCardEffects(player, card, 'dogma', effectOptions)
  this.mLogOutdent()
}

Innovation.prototype.aOneEffect = function(
  player,
  card,
  text,
  impl,
  opts={},
) {

  // Default opts
  opts = Object.assign({
    sharing: [],
    demanding: [],
    leader: player,
    endorsed: false,
  }, opts)

  const repeatCount = opts.endorsed ? 2 : 1

  const actors = [player]
    .concat(opts.sharing)
    .concat(opts.demanding)

  const actorsOrdered = this
    .getPlayersEnding(player)
    .filter(player => actors.includes(player))

  for (const actor of actorsOrdered) {
    this.state.dogmaInfo.acting = actor

    for (let z = 0; z < repeatCount; z++) {

      const isDemand = text.toLowerCase().startsWith('i demand')
      const isCompel = text.toLowerCase().startsWith('i compel')

      if (!isDemand && !isCompel) {
        this.state.couldShare = true
      }

      const demand = isDemand && opts.demanding.includes(actor)
      const compel = isCompel && opts.sharing.includes(actor) && actor !== player
      const share = !isDemand && !isCompel && !opts.noShare && opts.sharing.includes(actor) && z === 0
      const owner = !isDemand && !isCompel && actor === player

      if (compel || demand || share || owner) {
        this.mLog({
          template: `{player}, {card}: ${text}`,
          classes: ['card-effect'],
          args: { player: actor, card }
        })
        this.mLogIndent()

        const effectInfo = {
          card,
          text,
          impl,
        }

        if (demand || compel) {
          this.state.dogmaInfo.demanding = true

          const karmaKind = this.aKarma(actor, 'demand-success', {
            card,
            effectInfo,
            leader: opts.leader
          })
          if (karmaKind === 'would-instead') {
            this.state.dogmaInfo.demanding = false
            this.mActed(player)
            this.mLogOutdent()
            continue
          }
        }

        const result = this.aCardEffect(actor, effectInfo, {
          leader: opts.leader,
          self: card,
        })

        this.state.dogmaInfo.demanding = false
        this.mLogOutdent()

        if (this.state.dogmaInfo.earlyTerminate) {
          this.mLog({
            template: 'Dogma action is complete'
          })
          this.state.dogmaInfo.acting = undefined
          return
        }
      }
    }
    this.state.dogmaInfo.acting = undefined
  }
}

Innovation.prototype.aCardEffects = function(
  player,
  card,
  kind,
  opts={}
) {
  const effects = this.getVisibleEffects(card, kind, opts)
  if (!effects) {
    return
  }

  const { texts, impls } = effects

  for (let i = 0; i < texts.length; i++) {
    const result = this.aOneEffect(player, card, texts[i], impls[i], opts)
    if (this.state.dogmaInfo.earlyTerminate) {
      return
    }
  }
}

Innovation.prototype.aSelfExecute = function(player, card, opts={}) {
  const topCard = this.getTopCard(player, card.color)
  const isTopCard = topCard && topCard.name === card.name

  opts.selfExecutor = player

  // Do all visible echo effects in this color.
  if (isTopCard) {
    const cards = this.getCardsByZone(player, card.color).slice(1).reverse()
    for (const other of cards) {
      this.aCardEffects(player, other, 'echo', opts)
    }
  }

  // Do the card's echo effects.
  this.aCardEffects(player, card, 'echo', opts)

  // Do the card's dogma effects.
  if (opts.superExecute) {
    // Demand all opponents
    opts.demanding = this.getPlayerOpponents(player)
  }
  this.aCardEffects(player, card, 'dogma', opts)
}

Innovation.prototype.superExecute = function(player, card, opts={}) {
  this.selfExecute(player, card, { superExecute: true })
}

Innovation.prototype.aChooseAge = function(player, ages, opts={}) {
  if (!ages) {
    ages = [1,2,3,4,5,6,7,8,9,10,11]
  }
  else {
    ages = [...ages]
  }

  const selected = this.aChoose(player, ages, { ...opts, title: 'Choose Age' })
  if (selected) {
    return selected[0]
  }
}

Innovation.prototype.aChooseCard = function(player, cards, opts={}) {
  if (cards.length === 0) {
    this.mLogNoEffect()
    return undefined
  }

  if (!opts.title) {
    opts.title = 'Choose a Card'
  }

  const cardNames = this.aChoose(
    player,
    cards.map(c => c.id || c).sort(),
    opts
  )

  if (cardNames.length === 0) {
    this.mLogDoNothing(player)
    return undefined
  }
  else if (cardNames[0] === 'auto') {
    return 'auto'
  }
  else {
    return this.getCardByName(cardNames[0])
  }
}

Innovation.prototype.aChooseCards = function(player, cards, opts={}) {
  if (cards.length === 0) {
    this.mLogNoEffect()
    return undefined
  }

  if (opts.count === 0 || opts.max === 0) {
    return []
  }

  if (opts.lowest) {
    cards = this.utilLowestCards(cards)
  }

  const choiceMap = cards.map(card => {
    if (!card.id) {
      card = this.getCardByName(card)
    }

    if (opts.hidden) {
      return { name: this._getHiddenName(card), card }
    }
    else {
      return { name: card.id, card }
    }
  })

  opts.title = opts.title || 'Choose Cards(s)'
  const choices = choiceMap.map(x => x.name)
  const cardNames = this.aChoose(
    player,
    choices,
    opts
  )

  if (cardNames.length === 0) {
    this.mLogDoNothing(player)
    return undefined
  }

  // Card names were hidden. Convert back to arbitrary matching cards.
  else if (cardNames[0].startsWith('*')) {
    const output = []
    for (const name of cardNames) {
      const mapping = choiceMap.find(m => m.name === name && !output.includes(m.card))
      output.push(mapping.card)
    }
    return output
  }

  else {
    return cardNames.map(name => this.getCardByName(name))
  }
}

Innovation.prototype.aChoosePlayer = function(player, choices, opts={}) {
  if (choices.length === 0) {
    this.mLogNoEffect()
    return undefined
  }

  if (choices[0].name) {
    choices = choices.map(player => player.name)
  }

  const playerNames = this.aChoose(
    player,
    choices,
    { ...opts, title: 'Choose Player' }
  )
  if (playerNames.length === 0) {
    this.mLogDoNothing(player)
    return undefined
  }
  else {
    return this.getPlayerByName(playerNames[0])
  }
}

Innovation.prototype.aChooseAndAchieve = function(player, choices, opts={}) {
  if (choices.length === 0) {
    this.mLogNoEffect()
  }

  if (typeof choices[0] === 'object') {
    choices = this.formatAchievements(choices)
  }

  const selected = this.aChoose(
    player,
    choices,
    { ...opts, title: 'Choose Achievement' }
  )

  if (selected.length === 0) {
    this.mLogDoNothing(player)
  }
  else {
    this.aAchieveAction(player, selected[0], { ...opts, nonAction: true })
  }
}

Innovation.prototype.aChooseByPredicate = function(player, cards, count, pred) {
  let numRemaining = count
  let cardsRemaining = [...cards]
  let selected = []

  while (numRemaining > 0 && cardsRemaining.length > 0) {
    const choices = pred(cardsRemaining)
    cardsRemaining = cardsRemaining.filter(card => !choices.includes(card))

    if (choices.length <= numRemaining) {
      selected = selected.concat(choices)
      numRemaining -= choices.length
    }
    else {
      const chosen = this.aChooseCards(player, choices, { count: numRemaining })
      selected = selected.concat(chosen)
      numRemaining -= chosen.length
    }
  }

  return selected
}

Innovation.prototype.aChooseHighest = function(player, cards, count) {
  return this.aChooseByPredicate(player, cards, count, this.utilHighestCards)
}

Innovation.prototype.aChooseLowest = function(player, cards, count) {
  return this.aChooseByPredicate(player, cards, count, this.utilLowestCards)
}

function ChooseAndFactory(manyFuncName, numArgs) {
  return function(...args) {
    const player = args[0]
    const choices = args[1]
    const opts = args[numArgs] || {}

    const titleVerb = manyFuncName.slice(1, -4).toLowerCase()
    opts.title = opts.title || `Choose card(s) to ${titleVerb}`

    const cards = this.aChooseCards(player, choices, opts)
    if (cards) {
      const actionArgs = [...args]
      actionArgs[1] = cards
      return this[manyFuncName](...actionArgs)
    }
    else {
      return []
    }
  }
}

Innovation.prototype.aChooseAndMeld = ChooseAndFactory('aMeldMany', 2)
Innovation.prototype.aChooseAndReturn = ChooseAndFactory('aReturnMany', 2)
Innovation.prototype.aChooseAndReveal = ChooseAndFactory('aRevealMany', 2)
Innovation.prototype.aChooseAndScore = ChooseAndFactory('aScoreMany', 2)
Innovation.prototype.aChooseAndTransfer = ChooseAndFactory('aTransferMany', 3)
Innovation.prototype.aChooseAndTuck = ChooseAndFactory('aTuckMany', 2)

Innovation.prototype.aChooseAndSplay = function(player, choices, direction, opts={}) {
  util.assert(direction, 'No direction specified for splay')

  if (!choices) {
    choices = this.utilColors()
  }

  choices = choices
    .filter(color => this.getZoneByPlayer(player, color).splay !== direction)
    .filter(color => this.getZoneByPlayer(player, color).cards().length > 1)

  if (choices.length === 0) {
    this.mLogNoEffect()
    return
  }

  if (!opts.count && !opts.min && !opts.max) {
    opts.min = 0
    opts.max = 1
  }

  const colors = this.aChoose(
    player,
    choices,
    { ...opts, title: `Choose a color to splay ${direction}` }
  )
  if (colors.length === 0) {
    this.mLogDoNothing(player)
  }
  else {
    const splayed = []
    for (const color of colors) {
      splayed.push(this.aSplay(player, color, direction))
    }
    return splayed
  }
}

Innovation.prototype.aClaimAchievement = function(player, opts={}) {
  let card
  if (opts.card) {
    card = opts.card
  }
  else if (opts.name) {
    card = this.getCardByName(opts.name)
  }
  else if (opts.age) {
    card = this
      .getZoneById('achievements')
      .cards()
      .filter(card => !card.isSpecialAchievement && !card.isDecree)
      .find(c => c.getAge() === opts.age)
  }

  if (!card) {
    throw new Error(`Unable to find achievement given opts: ${JSON.stringify(opts)}`)
  }

  const karmaKind = this.aKarma(player, 'achieve', { ...opts, card })
  if (karmaKind === 'would-instead') {
    this.mActed(player)
    return
  }

  this.mAchieve(player, card)

  if (opts.isStandard && this.getExpansionList().includes('figs')) {
    const others = this
      .getPlayersStarting(player)
      .filter(other => !this.checkSameTeam(player, other))

    for (const opp of others) {
      this.aDraw(opp, { exp: 'figs' })
    }
  }

  return card
}

Innovation.prototype.aDecree = function(player, name) {
  const card = this.getCardByName(name)
  const hand = this.getZoneByPlayer(player, 'hand')

  this.mLog({
    template: '{player} declares a {card} decree',
    args: { player, card }
  })
  this.mLogIndent()

  this.aRemoveMany(player, hand.cards(), { ordered: true })

  let doImpl = false
  if (card.zone === 'achievements') {
    this.aClaimAchievement(player, { card })
    doImpl = true
  }
  else if (card.zone === `players.${player.name}.achievements`) {
    doImpl = true
  }
  else {
    this.mMoveCardTo(card, this.getZoneById('achievements'))
    this.mLog({
      template: '{player} returns {card} to the achievements',
      args: { player, card }
    })
  }

  if (doImpl) {
    this.mLog({
      template: '{card}: {text}',
      args: {
        card,
        text: card.text
      }
    })
    this.mLogIndent()
    card.decreeImpl(this, player)
    this.mLogOutdent()
  }

  this.mLogOutdent()
}

Innovation.prototype.aDiscoverBiscuit = function(player, card) {
  const age = card.getAge()
  const biscuit = card.biscuits[4]
  const maxDraw = this.getZoneByDeck('base', age).cards().length
  const numDraw = Math.min(maxDraw, age)

  for (let i = 0; i < numDraw; i++) {
    const card = this.mDraw(player, 'base', age)
    this.mReveal(player, card)
    if (!card.checkHasBiscuit(biscuit)) {
      this.mReturn(player, card)
    }
  }
}

Innovation.prototype.getDogmaBiscuits = function(player, card, opts) {
  // Store the biscuits now because changes caused by the dogma action should
  // not affect the number of biscuits used for evaluting the effect.
  const biscuits = this.getBiscuits()
  const artifactBiscuits = opts.artifact ? this.getBiscuitsByCard(card, 'top') : this.utilEmptyBiscuits()
  biscuits[player.name] = this.utilCombineBiscuits(biscuits[player.name], artifactBiscuits)

  return biscuits
}

Innovation.prototype.getDogmaShareInfo = function(player, card, opts={}) {
  const biscuits = opts.biscuits || this.getDogmaBiscuits(player, card, opts)
  const featuredBiscuit = opts.featuredBiscuit || card.dogmaBiscuit

  const { sharing, demanding } = this.getSharingAndDemanding(player, featuredBiscuit, biscuits, opts)

  return {
    biscuits,
    featuredBiscuit,
    hasShare: card.checkHasShare(),
    hasDemand: card.checkHasDemandExplicit(),
    hasCompel: card.checkHasCompelExplicit(),
    sharing,
    demanding,
  }
}

Innovation.prototype._aDogmaHelper_logSharing = function(shareData) {
  if (shareData.sharing.length > 0) {
    this.mLog({
      template: 'Effects will share with {players}.',
      args: { players: shareData.sharing },
    })
  }

  if (shareData.demanding.length > 0) {
    this.mLog({
      template: 'Demands will be made of {players}.',
      args: { players: shareData.demanding },
    })
  }
}

Innovation.prototype._aDogmaHelper_executeEffects = function(player, card, shareData, opts) {
  // Store planned effects now, as changes to the stacks shouldn't affect them.
  const cardOwner = this.getPlayerByCard(card)
  const effects = [
    ...this.getVisibleEffectsByColor(cardOwner, card.color, 'echo'),
    this.getVisibleEffects(card, 'dogma')
  ].filter(e => e !== undefined)

  const effectOpts = {
    sharing: shareData.sharing,
    demanding: shareData.demanding,
    endorsed: opts.endorsed,
  }

  this.statsRecordDogmaActions(player, card, effectOpts)

  for (const e of effects) {
    for (let i = 0; i < e.texts.length; i++) {
      const result = this.aOneEffect(player, e.card, e.texts[i], e.impls[i], effectOpts)
      if (this.state.dogmaInfo.earlyTerminate) {
        return
      }
    }
  }
}

Innovation.prototype._aDogmaHelper_initializeGlobalContext = function(biscuits, featuredBiscuit) {
  this.state.shared = false
  this.state.couldShare = false

  this.state.dogmaInfo.biscuits = biscuits
  this.state.dogmaInfo.featuredBiscuit = featuredBiscuit
  this.state.dogmaInfo.earlyTerminate = false
}

Innovation.prototype._aDogmaHelper_shareBonus = function(player, card) {
  // Share bonus
  if (this.state.shared) {
    this.mLog({
      template: '{player} draws a sharing bonus',
      args: { player }
    })
    this.mLogIndent()
    const expansion = this.getExpansionList().includes('figs') ? 'figs' : ''
    this.aDraw(player, {
      exp: expansion,
      share: true,
      featuredBiscuit: this.state.dogmaInfo.featuredBiscuit
    })
    this.mLogOutdent()
  }

  // Grace Hopper and Susan Blackmore have "if your opponent didn't share" karma effects
  else if (this.state.couldShare) {
    for (const other of this.getPlayerOpponents(player)) {
      this.aKarma(other, 'no-share', { card, leader: player })
    }
  }
}

Innovation.prototype.aDogmaHelper = function(player, card, opts) {
  const karmaKind = this.aKarma(player, 'dogma', { ...opts, card })
  if (karmaKind === 'would-instead') {
    this.mActed(player)
    return
  }

  const shareData = this.getDogmaShareInfo(player, card, opts)

  this._aDogmaHelper_initializeGlobalContext(shareData.biscuits, shareData.featuredBiscuit)
  this._aDogmaHelper_logSharing(shareData)
  this._aDogmaHelper_executeEffects(player, card, shareData, opts)

  if (this.state.dogmaInfo.earlyTerminate) {
    return
  }

  this._aDogmaHelper_shareBonus(player, card)
}

Innovation.prototype.aDogma = function(player, card, opts={}) {
  this.mLog({
    template: '{player} activates the dogma effects of {card}',
    classes: ['player-action'],
    args: { player, card }
  })

  this.mLogIndent()
  this.aDogmaHelper(player, card, opts)
  this.mLogOutdent()
  this.mResetDogmaInfo()
}

Innovation.prototype._getAgeForDrawAction = function(player, isAction) {
  const karmaInfos = this.getInfoByKarmaTrigger(player, 'top-card-value', { isAction })

  if (karmaInfos.length > 1) {
    throw new Error('Too many karma infos for top-card-value. I do not know what to do.')
  }

  const ageValues = this
    .utilColors()
    .map(color => {
      const zone = this.getZoneByPlayer(player, color)
      if (zone.cards().length === 0) {
        return 1
      }

      const actionType = isAction ? 'draw' : 'other'
      const karmaMatches = (
        !this.checkInKarma()
        && karmaInfos.length === 1
        && karmaInfos[0].impl.matches(this, player, { action: actionType, color, isAction })
      )
      if (karmaMatches) {
        this._karmaIn()
        const result = karmaInfos[0].impl.func(this, player, { color })
        this._karmaOut()
        return result
      }
      else {
        return zone.cards()[0].getAge()
      }
    })

  return Math.max(...ageValues)
}

Innovation.prototype._getAgeForInspireAction = function(player, color) {
  const karmaInfos = this
    .getInfoByKarmaTrigger(player, 'top-card-value')
    .filter(info => info.impl.matches(this, player, { action: 'inspire', color }))
  const cards = this.getCardsByZone(player, color)

  if (karmaInfos.length === 1) {
    const info = karmaInfos[0]
    this._karmaIn()
    const result = info.impl.func(this, player, { color })
    this._karmaOut()
    return result
  }
  else if (cards.length === 0) {
    return 1
  }
  else {
    return cards[0].getAge()
  }
}

Innovation.prototype.aDraw = function(player, opts={}) {
  const { age, share, isAction } = opts

  if (isAction) {
    const karmaKind = this.aKarma(player, 'draw-action', opts)
    if (karmaKind === 'would-instead') {
      this.mActed(player)
      return
    }
  }

  // Expansion the user should draw from, before looking at empty decks.
  const baseExp = opts.exp || this._determineBaseDrawExpansion(player, share)

  // If age is not specified, draw based on player's current highest top card.
  const highestTopAge = this._getAgeForDrawAction(player, isAction)
  const baseAge = age !== undefined ? (age || 1) : (highestTopAge || 1)

  // Adjust age based on empty decks.
  const [ adjustedAge, adjustedExp ] = this._adjustedDrawDeck(baseAge, baseExp)

  const karmaKind = this.aKarma(player, 'draw', { ...opts, age: adjustedAge })
  if (karmaKind === 'would-instead') {
    this.mActed(player)
    return
  }

  return this.mDraw(player, adjustedExp, adjustedAge, opts)
}

Innovation.prototype.aDrawAndForeshadow = function(player, age, opts={}) {
  const card = this.aDraw(player, {...opts, age })
  if (card) {
    return this.aForeshadow(player, card, opts)
  }
}

Innovation.prototype.aDrawAndMeld = function(player, age, opts={}) {
  const card = this.aDraw(player, {...opts, age })
  if (card) {
    return this.aMeld(player, card, opts)
  }
}

Innovation.prototype.aDrawAndReveal = function(player, age, opts={}) {
  const card = this.aDraw(player, {...opts, age })
  if (card) {
    return this.mReveal(player, card, opts)
  }
}

Innovation.prototype.aDrawAndScore = function(player, age, opts={}) {
  const card = this.aDraw(player, {...opts, age })
  if (card) {
    return this.aScore(player, card, opts)
  }
}

Innovation.prototype.aDrawAndTuck = function(player, age, opts={}) {
  const card = this.aDraw(player, {...opts, age })
  if (card) {
    return this.aTuck(player, card, opts)
  }
}

Innovation.prototype.aEndorse = function(player, color, opts={}) {
  this.mLog({
    template: '{player} endorses {color}',
    args: { player, color }
  })
  this.mLogIndent()

  this.state.didEndorse = true

  // Tuck a card
  const featuredBiscuit = this
    .getZoneByPlayer(player, color)
    .cards()[0]
    .dogmaBiscuit
  const cities = this
    .getTopCards(player)
    .filter(card => card.checkIsCity())
    .filter(card => card.biscuits.includes(featuredBiscuit))
  const tuckChoices = this
    .getZoneByPlayer(player, 'hand')
    .cards()
    .filter(card => cities.some(city => card.getAge() <= city.getAge()))
    .map(card => card.id)

  this.aChooseAndTuck(player, tuckChoices)

  const card = this.getTopCard(player, color)
  this.aDogmaHelper(player, card, { ...opts, endorsed: true })

  this.mLogOutdent()
}

Innovation.prototype.aForeshadow = function(player, card, opts={}) {
  const karmaKind = this.aKarma(player, 'foreshadow', { ...opts, card })
  if (karmaKind === 'would-instead') {
    this.mActed(player)
    return
  }

  return this.mForeshadow(player, card, opts)
}

Innovation.prototype.aInspire = function(player, color, opts={}) {
  this.mLog({
    template: '{player} inspires {color}',
    args: { player, color }
  })
  this.mLogIndent()

  this.state.didInspire = true

  const zone = this.getZoneByPlayer(player, color)
  const biscuits = this.getBiscuits()

  const karmaKind = this.aKarma(player, 'inspire', { ...opts, color })
  if (karmaKind === 'would-instead') {
    this.mActed(player)
    return
  }

  // Gather effects
  const effectCards = this
    .getVisibleEffectsByColor(player, color, 'inspire')
    .map(effect => effect.card)

  // Execute effects
  for (const card of effectCards) {
    this.aCardEffects(
      player,
      card,
      'inspire',
    )
  }

  const drawAge = this._getAgeForInspireAction(player, color)
  this.aDraw(player, { age: drawAge })

  this.mLogOutdent()
}

Innovation.prototype._aKarmaHelper = function(player, infos, opts={}) {
  let info = infos[0]

  if (infos.length === 0) {
    return
  }
  else if (infos.length > 1) {
    if (info.impl.kind && info.impl.kind.startsWith('would')) {
      this.mLog({
        template: 'Multiple `would` karma effects would trigger, so {player} will choose one',
        args: { player: this.getPlayerCurrent() }
      })

      const infoChoices = infos.map(info => info.card)
      const chosenCard = this.aChooseCard(
        this.getPlayerCurrent(),
        infoChoices,
        { title: 'Choose a would karma to trigger' }
      )
      info = infos.find(info => info.card === chosenCard)
    }
    else {
      throw new Error('Multiple non-would Karmas not handled')
    }
  }

  opts = { ...opts, owner: info.owner, self: info.card }

  if (info.impl.kind && info.impl.kind.startsWith('would')) {
    if (opts.trigger === 'splay') {
      this.mLog({
        template: '{player} would splay {color}, triggering...',
        args: {
          player,
          color: opts.direction
        }
      })
    }
    else if (opts.trigger === 'no-share') {
      this.mLog({
        template: '{player} did not draw a sharing bonus, triggering...',
        args: {
          player,
        }
      })
    }
    else if (opts.trigger === 'dogma') {
      this.mLog({
        template: '{player} would take a Dogma action, triggering...',
        args: {
          player,
        }
      })
    }
    else if (opts.trigger === 'draw') {
      this.mLog({
        template: '{player} would draw a card, triggering...',
        args: {
          player,
        }
      })
    }
    else if (opts.trigger === 'draw-action') {
      this.mLog({
        template: '{player} would take a draw action, triggering...',
        args: {
          player,
        }
      })
    }
    else if (opts.trigger === 'inspire') {
      this.mLog({
        template: '{player} would inspire {color}, triggering...',
        args: {
          player,
          color: opts.color,
        }
      })
    }
    else {
      this.mLog({
        template: '{player} would {trigger} {card}, triggering...',
        args: {
          player,
          trigger: opts.trigger,
          card: opts.card,
        }
      })
    }
  }
  this.mLog({
    template: '{card} karma: {text}',
    args: {
      card: info.card,
      text: info.text
    }
  })
  this.mLogIndent()
  this._karmaIn()
  const result = this.aCardEffect(player, info, opts)
  this._karmaOut()
  this.mLogOutdent()

  if (info.impl.kind === 'variable') {
    return result
  }
  else {
    return info.impl.kind
  }
}

Innovation.prototype.aKarma = function(player, kind, opts={}) {
  const infos = this
    .getInfoByKarmaTrigger(player, kind)
    .filter(info => info.impl.matches)
    .filter(info => {
      return info.impl.matches(this, player, { ...opts, owner: info.owner, self: info.card })
    })
  return this._aKarmaHelper(player, infos, { ...opts, trigger: kind })
}

Innovation.prototype.aKarmaWhenMeld = function(player, card, opts={}) {
  const infos = card
    .getKarmaInfo('when-meld')
    .filter(info => {
      if (info.impl.matches) {
        return info.impl.matches(this, player, opts)
      }
      else {
        return true
      }
    })
  return this._aKarmaHelper(player, infos, opts)
}

Innovation.prototype._checkCityMeldAchievements = function(player, card) {
  if (
    card.checkHasBiscuit('<')
    && this.getZoneByPlayer(player, card.color).splay === 'left'
    && this.getCardByName('Legend').zone === 'achievements'
  ) {
    this.aClaimAchievement(player, { name: 'Legend' })
  }

  if (
    card.checkHasBiscuit('>')
    && this.getZoneByPlayer(player, card.color).splay === 'right'
    && this.getCardByName('Repute').zone === 'achievements'
  ) {
    this.aClaimAchievement(player, { name: 'Repute' })
  }

  if (
    card.checkHasBiscuit('^')
    && this.getZoneByPlayer(player, card.color).splay === 'up'
    && this.getCardByName('Fame').zone === 'achievements'
  ) {
    this.aClaimAchievement(player, { name: 'Fame' })
  }
}

Innovation.prototype.aDigArtifact = function(player, age) {
  if (age > 11 || this.getZoneByDeck('arti', age).cards().length === 0) {
    this.mLog({
      template: `Artifacts deck for age ${age} is empty.`
    })
    return
  }

  const card = this.aDraw(player, { age, exp: 'arti' })
  if (card) {
    this.mMoveCardTo(card, this.getZoneByPlayer(player, 'artifact'), { player })

    for (const ach of this.cardData['arti'].achievements) {
      if (ach.getAge() !== card.getAge()) {
        continue
      }

      if (this._checkCanSeizeRelic(ach)) {
        this.aSeizeRelic(player, ach)
      }
    }
  }
}

Innovation.prototype._checkCanSeizeRelic = function(card) {
  // A relic can be seized from the achievements pile or from another player's achievements.
  return card.zone.includes('achievement')
}

Innovation.prototype.aJunkAvailableAchievement = function(player, ages=[], opts={}) {
  const eligible = ages.filter(age => this.getAvailableAchievementsByAge(age).length > 0)
  if (eligible.length === 0) {
    this.mLogNoEffect()
    return
  }

  const age = this.aChooseAge(player, eligible, { title: 'Choose an achievement to junk', ...opts })
  if (age) {
    this.aRemove(player, this.getAvailableAchievementsByAge(age)[0])
  }
}

Innovation.prototype.aJunkDeck = function(player, age, opts={}) {
  const cards = this.getZoneByDeck('base', age).cards()
  if (cards.length === 0) {
    this.mLog({
      template: 'The {age} deck is already empty.',
      args: { age },
    })
    return
  }

  let doJunk = true
  if (opts.optional) {
    doJunk = this.aChooseYesNo(player, `Junk the ${age} deck?`)
  }

  if (doJunk) {
    this.mLog({
      template: '{player} junks all cards in the {age} deck',
      args: { player, age }
    })

    const cards = this.getZoneByDeck('base', age).cards()
    this.aRemoveMany(player, cards, { ordered: true })
  }
  else {
    this.mLog({
      template: '{player} chooses not to junk the {age} deck',
      args: { player, age }
    })
  }
}

Innovation.prototype.aSeizeRelic = function(player, card) {
  const relicSeizeOptions =
    this.getExpansionList().includes(card.relicExpansion) ?
      [
        'to my achievements',
        'to my hand',
        'do not seize',
      ] : [
        'to my achievements',
        'do not seize',
      ]

  const choice = this.aChoose(player, relicSeizeOptions, {
    title: `How would you like to seize ${card.name}`
  })[0]

  if (choice === 'to my achievements') {
    this.mMoveCardTo(card, this.getZoneByPlayer(player, 'achievements'), { player })
    this.mActed(player)
  }
  else if (choice === 'to my hand') {
    this.mMoveCardTo(card, this.getZoneByPlayer(player, 'hand'), { player })
    this.mActed(player)
  }
  else {
    this.mLogDoNothing(player)
  }
}

Innovation.prototype._maybeDigArtifact = function(player, card) {
  if (!this.getExpansionList().includes('arti')) {
    return
  }

  // Can only have one artifact on display at a time.
  if (this.getCardsByZone(player, 'artifact').length > 0) {
    return
  }

  const next = this.getCardsByZone(player, card.color)[1]

  // No card underneath, so no artifact dig possible.
  if (!next) {
    return
  }

  // Dig up an artifact if player melded a card of lesser or equal age of the previous top card.
  if (next.getAge() >= card.getAge()) {
    this.aDigArtifact(player, next.getAge())
    return
  }

  // Dig up an artifact if the melded card has its hex icon in the same position.
  if (next.getHexIndex() === card.getHexIndex()) {
    this.aDigArtifact(player, next.getAge())
    return
  }
}

Innovation.prototype._maybeDrawCity = function(player) {
  if (!this.getExpansionList().includes('city')) {
    return
  }

  if (this.getCardsByZone(player, 'hand').some(card => card.checkIsCity())) {
    return
  }

  this.aDraw(player, { exp: 'city' })
}

Innovation.prototype.aMeld = function(player, card, opts={}) {
  // Used for Ching Shih to make sure she is melded from the hand.
  opts.fromZone = card.zone

  const karmaKind = this.aKarma(player, 'meld', { ...opts, card })
  if (karmaKind === 'would-instead') {
    this.mActed(player)
    return
  }

  const isFirstCard = this.getCardsByZone(player, card.color).length === 0

  this.mMeld(player, card, opts)
  this.mLogIndent()

  this._checkCityMeldAchievements(player, card)

  if (opts.asAction) {
    // City biscuits
    const biscuits = card.getBiscuits('top')
    const plusses = biscuits.split('+').length - 1
    for (let i = 0; i < plusses; i++) {
      this.aDraw(player, { age: card.age + 1 })
    }
    if (biscuits.includes('<')) {
      this.aSplay(player, card.color, 'left')
    }
    if (biscuits.includes('>')) {
      this.aSplay(player, card.color, 'right')
    }
    if (biscuits.includes('^')) {
      this.aSplay(player, card.color, 'up')
    }

    // Discover biscuit
    if (card.checkHasDiscoverBiscuit()) {
      this.aDiscoverBiscuit(player, card)
    }

    // Draw a city
    if (isFirstCard) {
      this._maybeDrawCity(player)
    }

    // Dig an artifact
    this._maybeDigArtifact(player, card)

    // Promote a foreshadowed card
    const choices = this
      .getCardsByZone(player, 'forecast')
      .filter(other => other.getAge() <= card.getAge())
    if (choices.length > 0) {
      this.mLog({
        template: '{player} may promote a card from forecast',
        args: { player },
      })
      const cards = this.aChooseAndMeld(player, choices, { min: 0, max: 1 })
      if (cards && cards.length > 0) {
        const melded = cards[0]
        const doDogma = this.aYesNo(player, `Activate ${melded.name}?`)
        if (doDogma) {
          this.aDogma(player, melded)
        }
      }
    }
  }

  // When-meld karmas
  this.aKarmaWhenMeld(player, card, opts)

  this.mLogOutdent()
  return card
}

Innovation.prototype.aRemove = function(player, card, opts={}) {
  const karmaKind = this.aKarma(player, 'remove', { ...opts, card })
  if (karmaKind === 'would-instead') {
    this.mActed(player)
    return
  }

  return this.mRemove(player, card, opts)
}

Innovation.prototype.aReturn = function(player, card, opts={}) {
  const karmaKind = this.aKarma(player, 'return', { ...opts, card })
  if (karmaKind === 'would-instead') {
    this.mActed(player)
    return
  }

  return this.mReturn(player, card, opts)
}

Innovation.prototype.aScore = function(player, card, opts={}) {
  if (card === undefined) {
    return
  }
  const karmaKind = this.aKarma(player, 'score', { ...opts, card })
  if (karmaKind === 'would-instead') {
    this.mActed(player)
    return
  }

  return this.mScore(player, card, opts)
}

Innovation.prototype.aSplay = function(player, color, direction, opts={}) {
  util.assert(direction, 'No direction specified for splay')

  const owner = opts.owner || player

  const zone = this.getZoneByPlayer(owner, color)
  if (zone.cards().length < 2) {
    this.mLog({
      template: `Cannot splay ${color} ${direction}`
    })
    return
  }

  const newDirection = zone.splay !== direction

  // Karmas don't trigger if someone else is splaying your cards.
  if (owner === player) {
    const karmaKind = this.aKarma(player, 'splay', { ...opts, color, direction })
    if (karmaKind === 'would-instead') {
      this.mActed(player)
      return
    }
  }

  const result = this.mSplay(player, color, direction, opts)

  if (this.getExpansionList().includes('city') && newDirection) {
    this._maybeDrawCity(owner)
  }

  return result
}

Innovation.prototype.aTransfer = function(player, card, target, opts={}) {
  if (target.toBoard) {
    target = this.getZoneByPlayer(target.player, card.color)
  }

  const karmaKind = this.aKarma(player, 'transfer', { ...opts, card, target })
  if (karmaKind === 'would-instead') {
    this.mActed(player)
    return
  }
  return this.mTransfer(player, card, target, opts)
}

Innovation.prototype._checkCityTuckAchievements = function(player, card) {
  if (
    card.checkHasBiscuit(';')
    && this.getCardByName('Glory').zone === 'achievements'
  ) {
    this.aClaimAchievement(player, { name: 'Glory' })
  }

  if (
    card.checkHasBiscuit(':')
    && this.getCardByName('Victory').zone === 'achievements'
  ) {
    this.aClaimAchievement(player, { name: 'Victory' })
  }
}

Innovation.prototype.aTuck = function(player, card, opts={}) {
  const karmaKind = this.aKarma(player, 'tuck', { ...opts, card })
  if (karmaKind === 'would-instead') {
    this.mActed(player)
    return
  }

  const tucked = this.mTuck(player, card, opts)
  this._checkCityTuckAchievements(player, card)
  return tucked
}

Innovation.prototype.aUnsplay = function(player, color, opts={}) {
  const zone = this.getZoneByPlayer(player, color)

  if (zone.splay === 'none') {
    this.mLog({
      template: '{zone} is already unsplayed',
      args: { zone }
    })
  }
  else {
    this.mLog({
      template: '{player} unsplays {zone}',
      args: { player, zone }
    })
    zone.splay = 'none'
  }
}

Innovation.prototype.aYesNo = function(player, title) {
  return this.aChooseYesNo(player, title)
}

Innovation.prototype.aYouLose = function(player) {
  this.mLog({
    template: '{player} loses the game',
    args: { player },
  })
  player.dead = true
}

function ManyFactory(baseFuncName, extraArgCount=0) {
  const verb = baseFuncName.slice(1).toLowerCase()

  return function(...args) { //player, cards, opts={}) {
    const player = args[0]
    const cards = args[1]
    const opts = args[2 + extraArgCount] || {}

    const results = []
    let auto = opts.ordered || false
    let remaining = [...cards]
    const startZones = util.array.toDict(remaining.map(c => [c.id, c.zone]))

    while (remaining.length > 0) {
      // Check if any cards in 'remaining' have been acted on by some other force (karma effect).
      remaining = remaining.filter(c => c.zone === startZones[c.id])
      if (remaining.length === 0) {
        break
      }

      let next
      if (auto || remaining.length === 1) {
        next = remaining[0]
      }
      else {
        next = this.aChooseCard(
          player,
          remaining.concat(['auto']),
          { title: `Choose a card to ${verb} next.` },
        )
      }

      if (next === 'auto') {
        auto = true
        continue
      }

      remaining = remaining.filter(card => card !== next)
      const singleArgs = [...args]
      singleArgs[1] = next
      const result = this[baseFuncName](...singleArgs)
      if (result !== undefined) {
        results.push(result)
      }
    }
    return results
  }
}

Innovation.prototype.aMeldMany = ManyFactory('aMeld')
Innovation.prototype.aRemoveMany = ManyFactory('aRemove')
Innovation.prototype.aReturnMany = ManyFactory('aReturn')
Innovation.prototype.aRevealMany = ManyFactory('mReveal')
Innovation.prototype.aScoreMany = ManyFactory('aScore')
Innovation.prototype.aTransferMany = ManyFactory('aTransfer', 1)
Innovation.prototype.aTuckMany = ManyFactory('aTuck')


////////////////////////////////////////////////////////////////////////////////
// Checkers

Innovation.prototype.checkAchievementAvailable = function(name) {
  return !!this.getZoneById('achievements').cards().find(ach => ach.name === name)
}

Innovation.prototype.checkAchievementEligibility = function(player, card, opts={}) {
  const topCardAge = this.getHighestTopAge(player, { reason: 'achieve' })

  const ageRequirement = opts.ignoreAge || card.getAge() <= topCardAge
  const scoreRequirement = opts.ignoreScore || this.checkScoreRequirement(player, card, opts)
  return ageRequirement && scoreRequirement
}

Innovation.prototype.checkAgeZeroInPlay = function() {
  return false
}

Innovation.prototype.checkCardIsTop = function(card) {
  const re = /^players.[^.]*.(yellow|red|green|blue|purple)$/i
  const isOnBoard = card.zone.match(re) !== null
  const isTop = this.getZoneByCard(card).cards()[0] === card
  return isOnBoard && isTop
}

Innovation.prototype.checkEffectIsVisible = function(card) {
  return this.getVisibleEffects(card, 'dogma') || this.getVisibleEffects(card, 'echo')
}

Innovation.prototype.checkInspireIsVisible = function(card) {
  const splay = this.checkCardIsTop(card) ? 'top' : this.getZoneByCard(card).splay
  return card.checkInspireIsVisible(splay)
}

Innovation.prototype.checkInKarma = function() {
  return this.state.karmaDepth > 0
}

Innovation.prototype.checkScoreRequirement = function(player, card, opts={}) {
  return this.getScoreCost(player, card) <= this.getScore(player, opts)
}

Innovation.prototype.checkZoneHasVisibleDogmaOrEcho = function(player, zone) {
  return (
    this.getVisibleEffectsByColor(player, zone.color, 'dogma').length > 0
    || this.getVisibleEffectsByColor(player, zone.color, 'echo').length > 0
  )
}


////////////////////////////////////////////////////////////////////////////////
// Getters

Innovation.prototype.getAchievementsByPlayer = function(player) {
  const ach = {
    standard: [],
    special: [],
    other: [],
    total: 0
  }

  for (const card of this.getZoneByPlayer(player, 'achievements').cards()) {
    if (card.isSpecialAchievement || card.isDecree) {
      ach.special.push(card)
    }
    else {
      ach.standard.push(card)
    }
  }

  const karmaInfos = this.getInfoByKarmaTrigger(player, 'extra-achievements')
  for (const info of karmaInfos) {
    const count = info.impl.func(this, player)
    for (let i = 0; i < count; i++) {
      ach.other.push(info.card)
    }
  }

  // Flags
  this
    .utilColors()
    .flatMap(color => this.getCardsByZone(player, color))
    .map(card => {
      const splay = this.getSplayByCard(card)
      const biscuits = card.getBiscuits(splay)
      return {
        card,
        count: biscuits.split(';').length - 1
      }
    })
    .filter(x => x.count > 0)
    .filter(x => {
      const myCount = this.getVisibleCardsByZone(player, x.card.color)
      const otherCounts = this
        .getPlayerAll()
        .filter(other => other !== player)
        .map(other => this.getVisibleCardsByZone(other, x.card.color))
      return otherCounts.every(count => count <= myCount)
    })
    .forEach(x => {
      for (let i = 0; i < x.count; i++) {
        ach.other.push(x.card)
      }
    })

  // Fountains
  this
    .utilColors()
    .flatMap(color => this.getCardsByZone(player, color))
    .map(card => {
      const splay = this.getSplayByCard(card)
      const biscuits = card.getBiscuits(splay)
      return {
        card,
        count: biscuits.split(':').length - 1
      }
    })
    .filter(x => x.count > 0)
    .forEach(x => {
      for (let i = 0; i < x.count; i++) {
        ach.other.push(x.card)
      }
    })

  ach.total = ach.standard.length + ach.special.length + ach.other.length

  return ach
}

Innovation.prototype.getBiscuits = function() {
  const biscuits = this
    .getPlayerAll()
    .map(player => [player.name, this.getBiscuitsByPlayer(player)])
  return util.array.toDict(biscuits)
}

Innovation.prototype.getBiscuitsByPlayer = function(player) {
  const boardBiscuits = this
    .utilColors()
    .map(color => this.getZoneByPlayer(player, color))
    .map(zone => this.getBiscuitsByZone(zone))
    .reduce((l, r) => this.utilCombineBiscuits(l, r))

  return this
    .getInfoByKarmaTrigger(player, 'calculate-biscuits')
    .map(info => this.aCardEffect(player, info, { biscuits: boardBiscuits }))
    .reduce((l, r) => this.utilCombineBiscuits(l, r), boardBiscuits)
}

Innovation.prototype.getBiscuitsByCard = function(card, splay) {
  return this.utilParseBiscuits(card.getBiscuits(splay))
}

Innovation.prototype.getBiscuitsByColor = function(player) {
  const output = {}
  for (const color of this.utilColors()) {
    output[color] = this.getBiscuitsByZone(this.getZoneByPlayer(player, color))
  }
  return output
}

Innovation.prototype.getBiscuitsByZone = function(zone) {
  return zone
    .cards()
    .map(card => this.getBiscuitsRaw(card, zone.splay))
    .map(biscuitString => this.utilParseBiscuits(biscuitString))
    .reduce((l, r) => this.utilCombineBiscuits(l, r), this.utilEmptyBiscuits())
}

Innovation.prototype.getBiscuitsRaw = function(card, splay) {
  return this.checkCardIsTop(card)
       ? card.getBiscuits('top')
       : card.getBiscuits(splay)
}

Innovation.prototype.getBonuses = function(player) {
  const bonuses = this
    .utilColors()
    .flatMap(color => this.getZoneByPlayer(player, color))
    .flatMap(zone => zone.cards().flatMap(card => card.getBonuses(this.getSplayByCard(card))))

  const karmaBonuses = this
    .getInfoByKarmaTrigger(player, 'list-bonuses')
    .flatMap(info => info.impl.func(this, player))

  return bonuses
    .concat(karmaBonuses)
    .sort((l, r) => r - l)
}

Innovation.prototype.getCardByName = function(name, def) {
  if (!this.cardData.all.byName.hasOwnProperty(name)) {
    if (def !== undefined) {
      return def
    }
    else {
      throw new Error(`Unknown card: ${name}`)
    }
  }
  else {
    return this.cardData.all.byName[name]
  }
}

Innovation.prototype.getAgesByZone = function(player, zoneName) {
  const ages = this.getCardsByZone(player, zoneName).map(c => c.getAge())
  return util.array.distinct(ages).sort()
}

Innovation.prototype.getAvailableSpecialAchievements = function() {
  return this
    .getZoneById('achievements')
    .cards()
    .filter(c => c.isSpecialAchievement)
}

Innovation.prototype.getCardsByZone = function(player, zoneName) {
  return this.getZoneByPlayer(player, zoneName).cards()
}

Innovation.prototype.getEffectAge = function(card, age) {
  const cardZone = this.getZoneByCard(card)
  const player = this.getPlayerByZone(cardZone)

  if (player) {
    const karmaInfos = this.getInfoByKarmaTrigger(player, 'effect-age')
    if (karmaInfos.length === 0) {
      age = age
    }
    else if (karmaInfos.length > 1) {
      throw new Error('Multiple effect-age karmas not supported')
    }
    else {
      age = karmaInfos[0].impl.func(this, player, card, age)
    }
  }

  if (this.state.dogmaInfo.globalAgeIncrease) {
    age += this.state.dogmaInfo.globalAgeIncrease
  }

  return age
}

Innovation.prototype.getInfoByKarmaTrigger = function(player, trigger) {
  util.assert(typeof player.name === 'string', 'First parameter must be player object')
  util.assert(typeof trigger === 'string', 'Second parameter must be string.')

  // Karmas can't trigger while executing another karma.
  const isTriggeredKarma = !trigger.startsWith('list-') || trigger.endsWith('-effects')

  if (isTriggeredKarma && this.checkInKarma()) {
    return []
  }

  const global = this
    .getPlayerOpponents(player)
    .flatMap(opp => this.getTopCards(opp))
    .flatMap(card => card.getKarmaInfo(trigger))
    .filter(info => info.impl.triggerAll)

  const thisPlayer = this
    .getTopCards(player)
    .flatMap(card => card.getKarmaInfo(trigger))

  const all = [...thisPlayer, ...global]
    .map(info => ({ ...info, owner: this.getPlayerByCard(info.card) }))

  return all
}

Innovation.prototype.getEffectByText = function(card, text) {
  for (const kind of ['dogma', 'echo', 'inspire']) {
    const effects = this.getVisibleEffects(card, kind)
    if (!effects) {
      continue
    }
    const { texts, impls } = effects
    const index = texts.indexOf(text)
    if (index !== -1) {
      return impls[index]
    }
  }

  throw new Error(`Effect not found on ${card.name} for text ${text}`)
}

Innovation.prototype.getExpansionList = function() {
  return this.settings.expansions
}

Innovation.prototype.getHighestTopAge = function(player, opts={}) {
  const card = this.getHighestTopCard(player)
  const baseAge = card ? card.getAge() : 0

  const karmaAdjustment = this
    .getInfoByKarmaTrigger(player, 'calculate-eligibility')
    .filter(info => info.impl.reason !== undefined)
    .filter(info => info.impl.reason === 'all' || info.impl.reason === opts.reason)
    .reduce((l, r) => l + r.impl.func(this, player), 0)

  return baseAge + karmaAdjustment
}

Innovation.prototype.getHighestTopCard = function(player) {
  return this.utilHighestCards(this.getTopCards(player), { visible: true })[0]
}

Innovation.prototype.getNonEmptyAges = function() {
  return [1,2,3,4,5,6,7,8,9,10,11]
    .filter(age => this.getZoneByDeck('base', age).cards().length > 0)
}

Innovation.prototype.getNumAchievementsToWin = function() {
  const base = 6
  const numPlayerAdjustment = 2 - this.getPlayerAll().length
  const numExpansionAdjustment = this.getExpansionList().length - 1

  return base + numPlayerAdjustment + numExpansionAdjustment
}

Innovation.prototype.getPlayerByCard = function(card) {
  try {
    const zone = this.getZoneById(card.zone)
    return this.getPlayerByZone(zone)
  }
  catch (e) {
    return undefined
  }
}

Innovation.prototype.getPlayerTeam = function(player) {
  return this
    .getPlayerAll()
    .filter(p => this.checkSameTeam(p, player))
}

Innovation.prototype.getResources = function() {
  return this.cardData
}

Innovation.prototype.getScore = function(player, opts={}) {
  return this.getScoreDetails(player).total * (opts.doubleScore ? 2 : 1)
}

Innovation.prototype.getScoreDetails = function(player) {
  const details = {
    score: [],
    bonuses: [],
    karma: [],

    scorePoints: 0,
    bonusPoints: 0,
    karmaPoints: 0,
    total: 0
  }

  details.score = this.getCardsByZone(player, 'score').map(card => card.getAge()).sort()
  details.bonuses = this.getBonuses(player)
  details.karma = this
    .getInfoByKarmaTrigger(player, 'calculate-score')
    .map(info => ({ name: info.card.name, points: this.aCardEffect(player, info) }))

  details.scorePoints = details.score.reduce((l, r) => l + r, 0)
  details.bonusPoints = (details.bonuses[0] || 0) + Math.max(details.bonuses.length - 1, 0)
  details.karmaPoints = details.karma.reduce((l, r) => l + r.points, 0)
  details.total = details.scorePoints + details.bonusPoints + details.karmaPoints

  return details
}

Innovation.prototype.getSplayByCard = function(card) {
  const zone = this.getZoneByCard(card)
  const cards = zone.cards()
  return card === cards[0] ? 'top' : zone.splay
}

Innovation.prototype.getBottomCard = function(player, color) {
  return this
    .getCardsByZone(player, color)
    .slice(-1)[0]
}

Innovation.prototype.getSplayedZones = function(player) {
  return this
    .utilColors()
    .map(color => this.getZoneByPlayer(player, color))
    .filter(zone => zone.splay !== 'none')
}

Innovation.prototype.getTopCard = function(player, color) {
  return this.getCardsByZone(player, color)[0]
}

Innovation.prototype.getTopCards = function(player) {
  return this
    .utilColors()
    .map(color => this.getZoneByPlayer(player, color))
    .map(zone => zone.cards()[0])
    .filter(card => card !== undefined)
}

Innovation.prototype.getTopCardsAll = function() {
  return this
    .getPlayerAll()
    .flatMap(player => this.getTopCards(player))
}

Innovation.prototype.getUniquePlayerWithMostBiscuits = function(biscuit) {
  const biscuits = this.getBiscuits()

  let most = 0
  let mostPlayerName = ''
  for (const [playerName, bis] of Object.entries(biscuits)) {
    const count = bis[biscuit]
    if (count > most) {
      most = count
      mostPlayerName = playerName
    }
    else if (count === most) {
      return null
    }
  }

  if (most > 0) {
    return this.getPlayerByName(mostPlayerName)
  }
}

Innovation.prototype.getVisibleCardsByZone = function(player, zoneName) {
  const zone = this.getZoneByPlayer(player, zoneName)
  const cards = zone.cards()
  if (zone.splay === 'none') {
    return cards.length > 0 ? 1 : 0
  }
  else {
    return cards.length
  }
}

Innovation.prototype.getVisibleEffects = function(card, kind, opts={}) {
  const player = opts.selfExecutor || this.getPlayerByCard(card)
  const isTop = this.checkCardIsTop(card) || card.zone.endsWith('.artifact')
  const splay = this.getSplayByCard(card)

  if (kind === 'dogma') {
    if ((opts.selfExecutor || isTop) && card.dogma.length > 0) {
      return {
        card,
        texts: card.dogma,
        impls: card.getImpl('dogma'),
      }
    }
  }

  else if (kind === 'echo') {
    const hexKarmas = this
      .getInfoByKarmaTrigger(player, 'hex-effect')
      .filter(info => info.impl.matches(this, player, { card }))
    const includeHexesAsEcho = hexKarmas.length > 0
    const echoIsVisible = card.checkEchoIsVisible(splay)
    const hexIsVisible = includeHexesAsEcho && card.checkBiscuitIsVisible('h', splay)

    const texts = []
    const impls = []

    if (echoIsVisible) {
      for (const text of util.getAsArray(card, 'echo')) {
        texts.push(text)
      }
      for (const impl of util.getAsArray(card, 'echoImpl')) {
        impls.push(impl)
      }
    }

    if (hexIsVisible) {
      const { text, impl } = hexKarmas[0].impl.func(this, player, { card })
      if (text) {
        texts.push(text)
        impls.push(impl)
      }
    }

    if (texts.length > 0) {
      return {
        card,
        texts,
        impls,
      }
    }
  }

  else if (kind === 'inspire') {
    if (card.checkBiscuitIsVisible('*', splay)) {
      return {
        card,
        texts: util.getAsArray(card, 'inspire'),
        impls: util.getAsArray(card, 'inspireImpl')
      }
    }
  }

  else {
    throw new Error(`Unknown effect type: ${kind}`)
  }

  return undefined
}

Innovation.prototype.getVisibleEffectsByColor = function(player, color, kind) {
  const karma = this
    .getInfoByKarmaTrigger(player, `list-${kind}-effects`)


  if (karma.length === 1) {
    this.state.karmaDepth += 1
    const result = karma.flatMap(info => info.impl.func(this, player, { color, kind }))
    this.state.karmaDepth -= 1
    return result
  }

  else if (karma.length === 2) {
    throw new Error(`Too many list-effect karmas`)
  }

  else {
    return this
      .getCardsByZone(player, color)
      .reverse()
      .map(card => this.getVisibleEffects(card, kind))
      .filter(effect => effect !== undefined)
  }
}

Innovation.prototype.getZoneByDeck = function(exp, age) {
  return this.state.zones.decks[exp][age]
}


////////////////////////////////////////////////////////////////////////////////
// Setters

Innovation.prototype.mAchievementCheck = function() {
  const available = this.getZoneById('achievements').cards()
  for (const player of this.getPlayersStartingCurrent()) {
    const reduceCost = this.getInfoByKarmaTrigger(
      player,
      'reduce-special-achievement-requirements'
    ).length > 0
    for (const card of available) {
      if (
        this.getZoneByCard(card).name === 'achievements'
        && card.checkPlayerIsEligible
        && card.checkPlayerIsEligible(this, player, reduceCost)
      ) {
        this.aClaimAchievement(player, { card })
      }
    }
  }
}

Innovation.prototype.mAchievementVictoryCheck = function() {
  if (this.state.wouldWinKarma) {
    return
  }

  for (const player of this.getPlayerAll()) {
    if (this.getAchievementsByPlayer(player).total >= this.getNumAchievementsToWin()) {
      throw new GameOverEvent({
        player,
        reason: 'achievements'
      })
    }
  }
}

Innovation.prototype.mAchieve = function(player, card) {
  const target = this.getZoneByPlayer(player, 'achievements')
  const source = this.getZoneById(card.zone)
  this.mLog({
    template: '{player} achieves {card} from {zone}',
    args: { player, card, zone: source }
  })
  this.mMoveCardTo(card, target)
  this.mActed(player)
  return card
}

Innovation.prototype.mActed = function(player) {
  if (!this.state.initializationComplete || !this.state.firstPicksComplete) {
    return
  }

  if (
    !this.state.dogmaInfo.demanding
    && this.state.dogmaInfo.acting === player
    && !this.checkSameTeam(player, this.getPlayerCurrent())
  ) {
    this.state.shared = true
  }

  // Special handling for "The Big Bang"
  this.state.dogmaInfo.theBigBangChange = true

  this.mSplayCheck()

  // Any time someone acts, there is the possibility that they should claim
  // a special achievement.
  this.mAchievementCheck()
  this.mAchievementVictoryCheck()
}

Innovation.prototype.mAdjustCardVisibility = function(card) {
  if (!this.state.initializationComplete) {
    return
  }

  const zone = this.getZoneByCard(card)

  // Achievements are always face down.
  if (zone.kind === 'achievements') {
    card.visibility = []
  }

  // Forget everything about a card if it is returned.
  else if (zone.kind === 'deck') {
    card.visibility = []
  }

  else if (zone.kind === 'public') {
    card.visibility = this.getPlayerAll().map(p => p.name)
  }

  else if (zone.kind === 'private') {
    util.array.pushUnique(card.visibility, zone.owner)
  }

  else {
    throw new Error(`Unknown zone kind ${zone.kind} for zone ${zone.id}`)
  }
}

Innovation.prototype.mDraw = function(player, exp, age, opts={}) {
  if (age > 11) {
    const scores = this
      .getPlayerAll()
      .map(player => ({
        player,
        score: this.getScore(player),
        achs: this.getAchievementsByPlayer(player).total,
      }))
      .sort((l, r) => {
        if (r.score !== l.score) {
          r.reason = 'high draw'
          l.reason = 'high draw'
          return r.score - l.score
        }
        else if (r.achs !== l.achs) {
          r.reason = 'high draw - tie breaker (achievements)'
          l.reason = 'high draw - tie breaker (achievements)'
          return r.achs - l.achs
        }
        else {
          throw new GameOverEvent({
            player,
            reason: 'Tied for points and achievements; player who drew the big card wins!'
          })
        }
      })

    throw new GameOverEvent({
      reason: scores[0].reason,
      player: scores[0].player,
    })
  }

  const source = this.getZoneByDeck(exp, age)
  const hand = this.getZoneByPlayer(player, 'hand')
  const card = this.mMoveTopCard(source, hand)

  if (!opts.silent) {
    this.mLog({
      template: '{player} draws {card}',
      args: { player, card }
    })
  }

  this.mActed(player)
  return card
}

Innovation.prototype.mForeshadow = function(player, card) {
  const target = this.getZoneByPlayer(player, 'forecast')
  this.mMoveCardTo(card, target)
  this.mLog({
    template: '{player} foreshadows {card}',
    args: { player, card }
  })
  this.mActed(player)
  return card
}

Innovation.prototype.mMeld = function(player, card) {
  const source = this.getZoneByCard(card)
  const target = this.getZoneByPlayer(player, card.color)
  const sourceIndex = source.cards().indexOf(card)

  this.mMoveByIndices(source, sourceIndex, target, 0)
  this.mLog({
    template: '{player} melds {card}',
    args: { player, card }
  })

  // Stats
  this.statsCardWasMelded(card)
  this.statsCardWasMeldedBy(player, card)
  this.statsFirstToMeldOfAge(player, card)

  this.mActed(player)
  return card
}

Innovation.prototype.mMoveByIndices = function(source, sourceIndex, target, targetIndex) {
  util.assert(sourceIndex >= 0 && sourceIndex <= source.cards().length - 1, `Invalid source index ${sourceIndex}`)
  const sourceCards = source._cards
  const targetCards = target._cards
  const card = sourceCards[sourceIndex]
  sourceCards.splice(sourceIndex, 1)
  targetCards.splice(targetIndex, 0, card)
  card.zone = target.id
  this.mAdjustCardVisibility(card)
  return card
}

Innovation.prototype.mMoveCardTo = function(card, target, opts={}) {
  const source = this.getZoneByCard(card)
  const sourceIndex = source.cards().findIndex(c => c === card)
  const targetIndex = target.cards().length

  if (source === target && sourceIndex === targetIndex) {
    // Card is already in the target zone.
    return
  }

  this.mMoveByIndices(source, sourceIndex, target, targetIndex)

  if (opts.player) {
    this.mActed(opts.player)

    this.mLog({
      template: '{player} moves {card} to {zone}',
      args: {
        player: opts.player,
        card,
        zone: target
      }
    })
  }

  return card
}

Innovation.prototype.mMoveCardsTo = function(player, cards, target) {
  for (const card of cards) {
    this.mMoveCardTo(card, target, { player })
  }
}

Innovation.prototype.mMoveCardToTop = function(card, target, opts={}) {
  const source = this.getZoneByCard(card)
  const sourceIndex = source.cards().findIndex(c => c === card)

  if (opts.player) {
    this.mLog({
      template: '{player} moves {card} to the top of its deck',
      args: {
        player: opts.player,
        card,
      }
    })
  }

  return this.mMoveByIndices(source, sourceIndex, target, 0)
}

Innovation.prototype.mMoveTopCard = function(source, target) {
  return this.mMoveByIndices(source, 0, target, target.cards().length)
}

Innovation.prototype._attemptToCombineWithPreviousEntry = function(msg) {
  if (this.getLog().length === 0) {
    return false
  }

  const prev = this.getLog().slice(-1)[0]

  if (!prev.args) {
    return
  }

  const combinable = ['foreshadows', 'melds', 'returns', 'tucks', 'reveals', 'scores']
  const msgAction = msg.template.split(' ')[1]

  const msgIsCombinable = combinable.includes(msgAction)
  const prevWasDraw = (
    prev.template === '{player} draws {card}'
    || prev.template === '{player} draws and reveals {card}'
  )

  if (msgIsCombinable && prevWasDraw) {
    const argsMatch = (
      prev.args.player.value === msg.args.player.value
      && prev.args.card.card === msg.args.card.card
    )

    if (argsMatch) {
      prev.template = prev.template.slice(0, -6) + 'and ' + msgAction + ' {card}'
      prev.args.card = msg.args.card
      return true
    }
  }

  return false
}

Innovation.prototype.mRemove = function(player, card) {
  this.mMoveCardTo(card, this.getZoneById('junk'))
  this.mLog({
    template: '{player} junks {card}',
    args: { player, card }
  })
  this.mActed(player)
  return card
}

Innovation.prototype.mResetDogmaInfo = function() {
  this.state.dogmaInfo = {}
}

Innovation.prototype.mResetMonumentCounts = function() {
  const emptyInfo = this
    .getPlayerAll()
    .map(p => [p.name, { tuck: 0, score: 0 }])
  this.state.monument = util.array.toDict(emptyInfo)
}

Innovation.prototype.mResetPeleCount = function() {
  this.state.tuckedGreenForPele = []
}

Innovation.prototype.mReturn = function(player, card, opts) {
  opts = opts || {}
  const source = this.getZoneByCard(card)
  const target = this.getZoneByCardHome(card)
  const sourceIndex = source.cards().indexOf(card)
  const targetIndex = target.cards().length

  util.assert(sourceIndex !== -1, 'Did not find card in its supposed source.')

  if (!opts.silent) {
    this.mLog({
      template: '{player} returns {card}',
      args: { player, card }
    })
  }

  this.mMoveByIndices(source, sourceIndex, target, targetIndex)

  this.mActed(player)
  return card
}

Innovation.prototype.mReveal = function(player, card) {
  card.visibility = this.getPlayerAll().map(p => p.name)
  this.mLog({
    template: '{player} reveals {card}',
    args: { player, card }
  })
  this.mActed(player)
  return card
}

Innovation.prototype.mScore = function(player, card) {
  const target = this.getZoneByPlayer(player, 'score')
  this.mMoveCardTo(card, target)
  this.mLog({
    template: '{player} scores {card}',
    args: { player, card }
  })
  this.state.monument[player.name].score += 1
  this.mActed(player)
  return card
}

Innovation.prototype.mSplay = function(player, color, direction, opts) {
  util.assert(direction, 'No direction specified for splay')

  const owner = opts.owner || player

  const target = this.getZoneByPlayer(owner, color)
  if (target.splay !== direction) {
    target.splay = direction

    if (player === owner) {
      this.mLog({
        template: '{player} splays {color} {direction}',
        args: { player, color, direction }
      })
    }

    else {
      this.mLog({
        template: "{player} splays {player2}'s {color} {direction}",
        args: { player, player2: owner, color, direction }
      })
    }

    this.mActed(player)
    return color
  }
}

Innovation.prototype.mSplayCheck = function() {
  for (const player of this.getPlayerAll()) {
    for (const color of this.utilColors()) {
      const zone = this.getZoneByPlayer(player, color)
      if (zone.cards().length < 2) {
        zone.splay = 'none'
      }
    }
  }
}

Innovation.prototype.mTake = function(player, card) {
  const hand = this.getZoneByPlayer(player, 'hand')
  this.mMoveCardTo(card, hand)
  this.mLog({
    template: '{player} takes {card} into hand',
    args: { player, card }
  })
  this.mActed(player)
  return card
}

Innovation.prototype.mTransfer = function(player, card, target) {
  this.mMoveCardToTop(card, target)
  this.mLog({
    template: '{player} transfers {card} to {zone}',
    args: { player, card, zone: target }
  })
  this.mActed(player)
  return card
}

Innovation.prototype.mTuck = function(player, card) {
  const target = this.getZoneByPlayer(player, card.color)
  this.mMoveCardTo(card, target)
  this.mLog({
    template: '{player} tucks {card}',
    args: { player, card }
  })
  if (card.color === 'green') {
    util.array.pushUnique(this.state.tuckedGreenForPele, player)
  }
  this.state.monument[player.name].tuck += 1
  this.mActed(player)
  return card
}


////////////////////////////////////////////////////////////////////////////////
// Utility Functions

Game.prototype.utilBiscuits = function() {
  return [
    'castle',
    'clock',
    'coin',
    'factory',
    'leaf',
    'lightbulb',
    'person',
  ]
}

Game.prototype.utilBiscuitNameToIcon = function(name) {
  switch (name) {
    case 'castle': return 'k';
    case 'clock': return 'i';
    case 'coin': return 'c';
    case 'factory': return 'f';
    case 'leaf': return 'l';
    case 'lightbulb': return 's';
    case 'person': return 'p';
  }

  throw new Error('Unknown biscuit name: ' + name)
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

Innovation.prototype.utilColorToDecree = function(color) {
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

Innovation.prototype.utilCombineBiscuits = function(left, right) {
  const combined = this.utilEmptyBiscuits()
  for (const biscuit of Object.keys(combined)) {
    combined[biscuit] += left[biscuit]
    combined[biscuit] += right[biscuit]
  }
  return combined
}

Innovation.prototype.utilEmptyBiscuits = function() {
  return {
    c: 0,
    f: 0,
    i: 0,
    k: 0,
    l: 0,
    s: 0,
  }
}

Innovation.prototype._cardLogData = function(card) {
  let name
  if (card.isSpecialAchievement || card.isDecree) {
    name = card.name
  }
  else {
    const hiddenName = this._getHiddenName(card)
    name = card.visibility.includes(this.viewerName) ? card.name : hiddenName
  }

  const classes = ['card']
  if (card.getAge()) {
    classes.push(`card-age-${card.visibleAge || card.getAge()}`)
  }
  if (card.expansion) {
    classes.push(`card-exp-${card.expansion}`)
  }
  if (name === 'hidden') {
    classes.push('card-hidden')
  }

  return {
    value: name,
    classes,
    card,
  }
}

Innovation.prototype._postEnrichArgs = function(msg) {
  return this._attemptToCombineWithPreviousEntry(msg)
}

Innovation.prototype._enrichLogArgs = function(msg) {
  for (const key of Object.keys(msg.args)) {
    if (key === 'players') {
      const players = msg.args[key]
      msg.args[key] = {
        value: players.map(p => p.name).join(', '),
        classes: ['player-names'],
      }
    }
    else if (key.startsWith('player')) {
      const player = msg.args[key]
      msg.args[key] = {
        value: player.name,
        classes: ['player-name']
      }
    }
    else if (key.startsWith('card')) {
      const card = msg.args[key]
      msg.args[key] = this._cardLogData(card)
    }
    else if (key.startsWith('zone')) {
      const zone = msg.args[key]
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
  }
}

Innovation.prototype.utilHighestCards = function(cards, opts={}) {
  const sorted = [...cards].sort((l, r) => r.getAge() - l.getAge())
  return util.array.takeWhile(sorted, card => card.getAge() === sorted[0].getAge())
}

Innovation.prototype.utilLowestCards = function(cards, opts={}) {
  const sorted = [...cards].sort((l, r) => l.getAge() - r.getAge())
 return util.array.takeWhile(sorted, card => card.getAge() === sorted[0].getAge())
}

Innovation.prototype.utilParseBiscuits = function(biscuitString) {
  const counts = this.utilEmptyBiscuits()
  for (const ch of biscuitString) {
    if (counts.hasOwnProperty(ch)) {
      counts[ch] += 1
    }
  }
  return counts
}

Innovation.prototype.utilSeparateByAge = function(cards) {
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

Innovation.prototype.utilSerializeObject = function(obj) {
  if (typeof obj === 'object') {
    util.assert(obj.id !== undefined, 'Object has no id. Cannot serialize.')
    return obj.id
  }
  else if (typeof obj === 'string') {
    return obj
  }
  else {
    throw new Error(`Cannot serialize element of type ${typeof obj}`)
  }
}

////////////////////////////////////////////////////////////////////////////////
// Private functions
Innovation.prototype._getHiddenName = function(card) {
  const owner = this.getPlayerByCard(card)
  if (owner) {
    return `*${card.expansion}-${card.age}* (${owner.name})`
  }
  else {
    return `*${card.expansion}-${card.age}*`
  }
}

Innovation.prototype._adjustedDrawDeck = function(age, exp) {
  if (age > 11) {
    return [12, 'base']
  }

  const baseDeck = this.getZoneByDeck('base', age)
  if (baseDeck.cards().length === 0) {
    return this._adjustedDrawDeck(age + 1, exp)
  }

  if (exp === 'base') {
    return [age, 'base']
  }

  const expDeck = this.getZoneByDeck(exp, age)
  if (expDeck.cards().length === 0) {
    return [age, 'base']
  }

  return [age, exp]
}

// Determine which expansion to draw from.
Innovation.prototype._determineBaseDrawExpansion = function(player) {
  if (this.getExpansionList().includes('echo')) {
    const hand = this.getZoneByPlayer(player, 'hand')
    const echoesCards = hand.cards().filter(c => c.checkIsEchoes())
    if (hand.cards().length > 0 && echoesCards.length === 0) {
      return 'echo'
    }
  }
  return 'base'
}

Innovation.prototype._generateActionChoices = function() {
  const choices = []
  choices.push(this._generateActionChoicesAchieve())
  choices.push(this._generateActionChoicesDecree())
  choices.push(this._generateActionChoicesDogma())
  choices.push(this._generateActionChoicesDraw())
  choices.push(this._generateActionChoicesEndorse())
  choices.push(this._generateActionChoicesInspire())
  choices.push(this._generateActionChoicesMeld())
  return choices
}

Innovation.prototype.getScoreCost = function(player, card) {
  const sameAge = this
    .getZoneByPlayer(player, 'achievements')
    .cards()
    .filter(c => c.getAge() === card.getAge())

  const karmaAdjustment = this
    .getInfoByKarmaTrigger(player, 'achievement-cost-discount')
    .map(info => info.impl.func(this, player, { card }))
    .reduce((l, r) => l + r, 0)

  return card.getAge() * 5 * (sameAge.length + 1) - karmaAdjustment
}

Innovation.prototype.getAvailableAchievementsByAge = function(age) {
  if (typeof age === 'string') {
    age = parseInt(age)
  }

  const available = this
    .getZoneById('achievements')
    .cards()
    .filter(c => !c.isSpecialAchievement && !c.isDecree)

  return available.filter(c => c.age === age)
}

Innovation.prototype.getAvailableAchievementsRaw = function(player) {
  const achievementsZone = this
    .getZoneById('achievements')
    .cards()
    .filter(c => !c.isSpecialAchievement && !c.isDecree)

  const fromKarma = this
    .getInfoByKarmaTrigger(player, 'list-achievements')
    .flatMap(info => info.impl.func(this, player))

  return [achievementsZone, fromKarma].flat()
}

Innovation.prototype.getEligibleAchievementsRaw = function(player, opts={}) {
  return this
    .getAvailableAchievementsRaw(player, opts)
    .filter(card => this.checkAchievementEligibility(player, card, opts))
}

Innovation.prototype.formatAchievements = function(array) {
  return array
    .map(ach => {
      if (ach.zone === 'achievements') {
        return `age ${ach.getAge()}`
      }
      else {
        return ach.id
      }
    })
    .sort()
}

Innovation.prototype.getEligibleAchievements = function(player, opts={}) {
  const formatted = this.formatAchievements(this.getEligibleAchievementsRaw(player, opts))
  const distinct = util.array.distinct(formatted).sort()
  return distinct
}

Innovation.prototype._generateActionChoicesAchieve = function() {
  const player = this.getPlayerCurrent()

  return {
    title: 'Achieve',
    choices: this.getEligibleAchievements(player),
    min: 0,
  }
}

Innovation.prototype._generateActionChoicesDecree = function() {
  const player = this.getPlayerCurrent()

  const figuresInHand = this
    .getZoneByPlayer(player, 'hand')
    .cards()
    .filter(c => c.checkIsFigure())

  const figuresByAge = this.utilSeparateByAge(figuresInHand)

  const availableDecrees = []

  if (Object.keys(figuresByAge).length >= 3) {
    figuresInHand
      .map(card => card.color)
      .map(color => this.utilColorToDecree(color))
      .forEach(decree => util.array.pushUnique(availableDecrees, decree))
  }

  if (figuresInHand.length >= 2) {
    this
      .getInfoByKarmaTrigger(player, 'decree-for-two')
      .map(info => info.impl.decree)
      .forEach(decree => util.array.pushUnique(availableDecrees, decree))
  }

  return {
    title: 'Decree',
    choices: availableDecrees.sort(),
    min: 0,
  }
}

Innovation.prototype.getDogmaTargets = function(player) {
  return this
    .utilColors()
    .map(color => this.getZoneByPlayer(player, color))
    .filter(zone => this.checkZoneHasVisibleDogmaOrEcho(player, zone))
    .map(zone => zone.cards()[0])
}

Innovation.prototype._generateActionChoicesDogma = function() {
  const player = this.getPlayerCurrent()

  const dogmaTargets = this.getTopCards(player)

  const extraEffects = this
    .getInfoByKarmaTrigger(player, 'list-effects')
    .flatMap(info => info.impl.func(this, player))

  const allTargets = util
    .array
    .distinct([...dogmaTargets, ...extraEffects])
    .map(card => card.name)

  return {
    title: 'Dogma',
    choices: allTargets,
    min: 0,
  }
}

Innovation.prototype._generateActionChoicesDraw = function() {
  return {
    title: 'Draw',
    choices: ['draw a card'],
    min: 0,
  }
}

Innovation.prototype._generateActionChoicesEndorse = function() {
  const player = this.getPlayerCurrent()
  const endorseColors = []

  const lowestHandAge = this
    .getZoneByPlayer(player, 'hand')
    .cards()
    .map(card => card.getAge())
    .sort((l, r) => l - r)[0] || 99

  const cities = this
    .getTopCards(player)
    .filter(card => card.checkIsCity())
    .filter(city => city.getAge() >= lowestHandAge)

  const stacksWithEndorsableEffects = this
    .getTopCards(player)
    .map(card => this.getZoneByPlayer(player, card.color))

  const colors = []

  if (!this.state.didEndorse) {
    for (const zone of stacksWithEndorsableEffects) {
      const dogmaBiscuit = zone.cards()[0].dogmaBiscuit
      const canEndorse = cities.some(city => city.biscuits.includes(dogmaBiscuit))
      if (canEndorse) {
        colors.push(zone.color)
      }
    }
  }

  return {
    title: 'Endorse',
    choices: colors,
    min: 0,
  }
}

Innovation.prototype._generateActionChoicesInspire = function() {
  const player = this.getPlayerCurrent()
  const inspireColors = []

  if (!this.state.didInspire) {
    for (const color of this.utilColors()) {
      const effects = this.getVisibleEffectsByColor(player, color, 'inspire')
      if (effects.length > 0) {
        inspireColors.push(color)
      }
    }
  }

  return {
    title: 'Inspire',
    choices: inspireColors,
    min: 0,
  }
}

Innovation.prototype._generateActionChoicesMeld = function() {
  const player = this.getPlayerCurrent()
  const cards = this
    .getZoneByPlayer(player, 'hand')
    .cards()
    .map(c => c.id)

  this
    .getCardsByZone(player, 'artifact')
    .forEach(card => cards.push(card.id))

  return {
    title: 'Meld',
    choices: cards,
    min: 0,
    max: 1,
  }
}

Innovation.prototype.getSharingAndDemanding = function(player, featuredBiscuit, biscuits, opts={}) {
  const biscuitComparator = this._getBiscuitComparator(player, featuredBiscuit, biscuits, opts)

  const sharing = this
    .getPlayerAll()
    .filter(p => p !== player)
    .filter(p => biscuitComparator(p))

  const demanding = this
    .getPlayerAll()
    .filter(p => p !== player)
    .filter(p => !biscuitComparator(p))

  return { sharing, demanding }
}

Innovation.prototype._getBiscuitComparator = function(player, featuredBiscuit, biscuits, opts) {

  // Some karmas affect how sharing is calculated by adjusting the featured biscuit.
  const featuredBiscuitKarmas = this
    .getInfoByKarmaTrigger(player, 'featured-biscuit')
    .filter(info => info.impl.matches(this, player, { biscuit: featuredBiscuit }))

  let adjustedBiscuit

  if (opts.noBiscuitKarma || featuredBiscuitKarmas.length === 0) {
    adjustedBiscuit = featuredBiscuit
  }
  else if (featuredBiscuitKarmas.length === 1) {
    const info = featuredBiscuitKarmas[0]
    this.mLog({
      template: '{card} karma: {text}',
      args: {
        card: info.card,
        text: info.text
      }
    })
    adjustedBiscuit = this.aCardEffect(player, info, { baseBiscuit: featuredBiscuit })
  }
  else {
    throw new Error('Multiple biscuit karmas are not supported')
  }

  return (other) => {
    if (adjustedBiscuit === 'score') {
      return this.getScore(other) >= this.getScore(player)
    }
    else if (this.state.dogmaInfo.soleMajority === other) {
      return true
    }
    else if (this.state.dogmaInfo.soleMajority === player) {
      return false
    }
    else {
      return biscuits[other.name][adjustedBiscuit] >= biscuits[player.name][adjustedBiscuit]
    }
  }
}

Innovation.prototype._karmaIn = function() {
  this.state.karmaDepth += 1
}

Innovation.prototype._karmaOut = function() {
  util.assert(this.state.karmaDepth > 0, "Stepping out of zero karma")
  this.state.karmaDepth -= 1
}

Innovation.prototype._walkZones = function(root, fn, path=[]) {
  for (const [key, obj] of Object.entries(root)) {
    const thisPath = [...path, key]
    if (obj._cards) {
      fn(obj, thisPath)
    }
    else {
      this._walkZones(obj, fn, thisPath)
    }
  }
}


////////////////////////////////////////////////////////////////////////////////
// Stats functions

Innovation.prototype.statsCardWasMelded = function(card) {
  util.array.pushUnique(this.stats.melded, card.name)
}

Innovation.prototype.statsCardWasMeldedBy = function(player, card) {
  if (card.name in this.stats.meldedBy) {
    return
  }
  else {
    this.stats.meldedBy[card.name] = player.name
  }
}

Innovation.prototype.statsFirstToMeldOfAge = function(player, card) {
  if (card.age > this.stats.highestMelded) {
    this.stats.firstToMeldOfAge.push([card.age, player.name])
    this.stats.highestMelded = card.age
  }
}

Innovation.prototype.statsRecordDogmaActions = function(player, card, opts) {
  if (card.name in this.stats.dogmaActions) {
    this.stats.dogmaActions[card.name] += 1
  }
  else {
    this.stats.dogmaActions[card.name] = 1
  }
}
