const {
  Game,
  GameFactory,
  GameOverEvent,
} = require('../lib/game.js')
const res = require('./res/index.js')
const util = require('../lib/util.js')

const { UltimateLogManager } = require('./UltimateLogManager.js')
const { UltimateActionManager } = require('./UltimateActionManager.js')
const { UltimateCardManager } = require('./UltimateCardManager.js')
const { UltimateZone } = require('./UltimateZone.js')
const { UltimateZoneManager } = require('./UltimateZoneManager.js')

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

  this.log = new UltimateLogManager(this, serialized_data.chat, viewerName)
  this.actions = new UltimateActionManager(this)
  this.cards = new UltimateCardManager(this)
  this.zones = new UltimateZoneManager(this)
}

util.inherit(Game, Innovation)

function InnovationFactory(settings, viewerName) {
  const data = GameFactory(settings)
  return new Innovation(data, viewerName)
}

function factoryFromLobby(lobby) {
  return GameFactory({
    game: 'Innovation: Ultimate',
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
  // TODO (dennis): handle would-win karma effects
  return event
}


////////////////////////////////////////////////////////////////////////////////
// Initialization

const SUPPORTED_EXPANSIONS = ['base', 'city', 'usee']

Innovation.prototype.initialize = function() {
  this.log.add({ template: 'Initializing' })
  this.log.indent()

  this.initializeCards()
  this.initializeTeams()
  this.initializeZones()
  this.initializeStartingCards()
  this.initializeTransientState()

  this.log.outdent()

  this.state.initializationComplete = true
  this._breakpoint('initialization-complete')
}

Innovation.prototype.initializeCards = function() {
  const cardData = res.factory(this)

  for (const exp of res.ALL_EXPANSIONS) {
    this.cards.registerExpansion(exp, cardData[exp])
  }
}

Innovation.prototype.initializeTransientState = function() {
  this.mResetDogmaInfo()
  this.mResetPeleCount()
  this.mResetDrawInfo()
  this.state.turn = 1
  this.state.round = 1
  this.state.karmaDepth = 0
  this.state.wouldWinKarma = false
  this.state.didEndorse = false
  this.stats = {
    melded: [],
    meldedBy: {},
    highestMelded: 1,
    firstToMeldOfAge: [],
    dogmaActions: {},
  }
}

Innovation.prototype.initializeTeams = function() {
  const players = this.players.all()
  let teamMod = players.length
  if (this.settings.teams) {
    util.assert(this.players.all().length === 4, 'Teams only supported with 4 players')
    teamMod = 2
  }
  for (let i = 0; i < players.length; i++) {
    const teamNumber = i % teamMod
    players[i].team = `team${teamNumber}`
  }
}

Innovation.prototype.initializeZones = function() {
  this.initializeZonesDecks()
  this.initializeZonesAchievements()
  this.initializeZonesPlayers()
  this.zones.register(new UltimateZone(this, 'junk', 'junk', 'hidden'))
}

Innovation.prototype.initializeZonesDecks = function() {
  for (const exp of SUPPORTED_EXPANSIONS) {
    for (const [age, cards] of Object.entries(this.cards.byExp(exp).byAge)) {
      if (!cards) {
        throw new Error(`Missing cards for ${exp}-${age}`)
      }
      else if (!Array.isArray(cards)) {
        throw new Error(`Cards for ${exp}-${age} is of type ${typeof cards}`)
      }

      const id = `decks.${exp}.${age}`
      const zone = new UltimateZone(this, id, id, 'hidden')
      zone.initializeCards(cards)
      zone.shuffle()
      this.zones.register(zone)
    }
  }
}

Innovation.prototype.initializeZonesAchievements = function() {
  const achZone = new UltimateZone(this, 'achievements', 'achievements', 'hidden')
  this.zones.register(achZone)

  // Special achievements
  const specialAchievements = []
  for (const exp of SUPPORTED_EXPANSIONS) {
    if (this.getExpansionList().includes(exp)) {
      for (const ach of this.cards.byExp(exp).achievements) {
        specialAchievements.push(ach)
      }
    }
  }
  achZone.initializeCards(specialAchievements)

  // Standard achievements
  // These are just moved to the achievements zone because their home will remain as their original
  // decks. If, for some reason, they are 'returned', they will go back to their decks, not to the
  // achievements.
  for (const age of [1,2,3,4,5,6,7,8,9,10]) {
    const ageZone = this.zones.byDeck('base', age)
    ageZone.peek().moveTo(achZone)
  }
}

Innovation.prototype.initializeZonesPlayers = function() {
  const self = this

  const _addPlayerZone = function(player, name, kind) {
    const id = `players.${player.name}.${name}`
    const zone = new UltimateZone(self, id, id, kind, player)
    self.zones.register(zone)
  }

  for (const player of this.players.all()) {
    _addPlayerZone(player, 'hand', 'private')
    _addPlayerZone(player, 'score', 'private')
    _addPlayerZone(player, 'forecast', 'private')
    _addPlayerZone(player, 'achievements', 'hidden')
    _addPlayerZone(player, 'red', 'public')
    _addPlayerZone(player, 'blue', 'public')
    _addPlayerZone(player, 'green', 'public')
    _addPlayerZone(player, 'yellow', 'public')
    _addPlayerZone(player, 'purple', 'public')
    _addPlayerZone(player, 'artifact', 'public')
    _addPlayerZone(player, 'museum', 'public')
    _addPlayerZone(player, 'safe', 'hidden')

    for (const color of this.utilColors()) {
      const zone = this.zones.byPlayer(player, color)
      zone.color = color
      zone.splay = 'none'
    }
  }
}

Innovation.prototype.initializeStartingCards = function() {
  for (const player of this.players.all()) {
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
  this.log.add({ template: 'Choosing starting cards' })
  this.log.indent()
  const requests = this
    .players.all()
    .map(p => ({
      actor: this.utilSerializeObject(p),
      title: 'Choose First Card',
      choices: this.zones.byPlayer(p, 'hand').cards().map(this.utilSerializeObject),
    }))

  const picks = this
    .requestInputMany(requests)
    .map(resp => [
      this.players.byName(resp.actor),
      this.cards.byId(resp.selection[0])
    ])
    .sort((l, r) => l[1].name.localeCompare(r[1].name))
  for (const [player, card] of picks) {
    this.actions.meld(player, card)
  }

  this.players.passToPlayer(picks[0][0])

  this.log.outdent()

  this.state.firstPicksComplete = true

  this._breakpoint('before-first-player')
}

Innovation.prototype.mainLoop = function() {
  while (true) {
    this.log.add({
      template: "{player}'s turn {count}",
      classes: ['player-turn-start'],
      args: {
        player: this.players.current(),
        count: this.state.round,
      }
    })

    this.artifact()
    this.mAchievementCheck()

    this.action(1)
    this.mAchievementCheck()

    this.action(2)
    this.mAchievementCheck()

    this.endTurn()
  }
}

Innovation.prototype.artifact = function() {
  const player = this.players.current()
  const artifact = this.zones.byPlayer(player, 'artifact').cards()[0]
  if (artifact) {
    this.log.add({
      template: 'Free Artifact Action',
    })
    this.log.indent()

    const action = this.requestInputSingle({
      actor: player.name,
      title: 'Free Artifact Action',
      choices: ['dogma', 'return', 'skip']
    })[0]

    switch (action) {
      case 'dogma': {
        const startingZone = artifact.zone
        this.aDogma(player, artifact, { artifact: true })
        if (startingZone === artifact.zone) {
          this.actions.return(player, artifact)
        }
        this.fadeFiguresCheck()
        break
      }
      case 'return':
        this.actions.return(player, artifact)
        break
      case 'skip':
        this.log.add({
          template: '{player} skips the free artifact action',
          classes: ['action-header'],
          args: { player },
        })
        break
      default:
        throw new Error(`Unknown artifact action: ${action}`)
    }

    this.log.outdent()
  }
}

Innovation.prototype.action = function(count) {
  const player = this.players.current()

  // The first player (or two) only gets one action
  const numFirstPlayers = this.players.all().length >= 4 ? 2 : 1
  if (this.state.turn <= numFirstPlayers) {
    if (count === 1) {
      this.log.add({
        template: '{player} gets only 1 action for the first round',
        args: { player }
      })
    }
    else if (count === 2) {
      return
    }
  }

  const countTerm = count === 1 ? 'First' : 'Second'
  this.log.add({
    template: `${countTerm} action`,
    classes: ['action-header'],
  })
  this.log.indent()

  const chosenAction = this.requestInputSingle({
    actor: player.name,
    title: `Choose ${countTerm} Action`,
    choices: this._generateActionChoices(),
  })[0]

  if (!chosenAction.selection) {
    console.log(chosenAction)
    throw new Error('Invalid selection')
  }

  const name = chosenAction.title
  const arg = chosenAction.selection[0]

  if (name === 'Achieve') {
    this.aAchieveAction(player, arg)
  }
  else if (name === 'Decree') {
    this.aDecree(player, arg)
  }
  else if (name === 'Dogma') {
    const card = this.cards.byId(arg)
    this.aDogma(player, card)
  }
  else if (name === 'Draw') {
    this.aDraw(player, { isAction: true })
  }
  else if (name === 'Endorse') {
    this.aEndorse(player, arg)
  }
  else if (name === 'Meld') {
    const card = this.cards.byId(arg)
    this.actions.meld(player, card, { asAction: true })
  }
  else {
    throw new Error(`Unhandled action type ${name}`)
  }

  this.log.outdent()

  this.fadeFiguresCheck()
}

Innovation.prototype.fadeFiguresCheck = function() {
  for (const player of this.players.all()) {
    const topFiguresFn = () => this
      .getTopCards(player)
      .filter(card => card.checkIsFigure())

    if (topFiguresFn().length > 1) {
      this.log.add({
        template: '{player} has {count} figures and must fade some',
        args: { player, count: topFiguresFn().length }
      })
      this.log.indent()

      while (topFiguresFn().length > 1) {
        const karmaInfos = this.getInfoByKarmaTrigger(player, 'no-fade')
        if (karmaInfos.length > 0) {
          this.log.add({
            template: '{player} fades nothing due to {card}',
            args: { player, card: karmaInfos[0].card }
          })
          break
        }

        const toFade = this.actions.chooseCard(player, topFiguresFn())
        this.aScore(player, toFade)
      }

      this.log.outdent()
    }
  }
}

Innovation.prototype.endTurn = function() {
  const players = this.players.all()

  // Set next player
  this.players.advancePlayer()

  // Track number of turns
  this.state.turn += 1
  this.state.round = Math.floor((this.state.turn + players.length - 1) / players.length)

  // Reset various turn-centric state
  this.state.didEndorse = false
  this.mResetDogmaInfo()
  this.mResetPeleCount()
  this.mResetDrawInfo()
}


////////////////////////////////////////////////////////////////////////////////
// Actions

Innovation.prototype._parseHiddenCardName = function(name) {
  return {
    expansion: name.substr(1,4),
    age: parseInt(name.substr(6)),
  }
}

Innovation.prototype.aAchieveAction = function(player, arg, opts={}) {
  if (arg.startsWith('safe: ')) {
    const hiddenName = arg.substr(6)
    const { expansion, age } = this._parseHiddenCardName(hiddenName)
    const card = this
      .cards.byPlayer(player, 'safe')
      .find(c => c.expansion === expansion && c.getAge() === age)
    this.actions.claimAchievement(player, { card })
  }
  else if (arg.startsWith('*')) {
    const { expansion, age } = this._parseHiddenCardName(arg)
    const isStandard = opts.nonAction ? false : true
    this.actions.claimAchievement(player, { expansion, age, isStandard })
  }
  else {
    const card = this.cards.byId(arg)
    this.actions.claimAchievement(player, { card })
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

  this.log.indent()
  this.aCardEffects(player, card, 'echo', effectOptions)
  this.aCardEffects(player, card, 'dogma', effectOptions)
  this.log.outdent()
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
    .players.endingWith(player)
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
        this.log.add({
          template: `{player}, {card}: ${text}`,
          classes: ['card-effect'],
          args: { player: actor, card }
        })
        this.log.indent()

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
            this.actions.acted(player)
            this.log.outdent()
            continue
          }
        }

        const result = this.aCardEffect(actor, effectInfo, {
          leader: opts.leader,
          self: card,
        })

        if (demand || compel) {
          this.state.dogmaInfo.demanding = false
        }

        this.log.outdent()

        if (this.state.dogmaInfo.earlyTerminate) {
          this.log.add({
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

Innovation.prototype.aTrackChainRule = function(player, card) {
  if (!this.state.dogmaInfo.chainRule) {
    this.state.dogmaInfo.chainRule = {}
  }
  if (!this.state.dogmaInfo.chainRule[player.name]) {
    this.state.dogmaInfo.chainRule[player.name] = {}
  }

  const data = this.state.dogmaInfo.chainRule[player.name]

  // This is the first card in a potential chain event.
  if (!data.cardName) {
    data.cardName = card.name
  }

  // A second card is calling self-execute. Award the chain achievement.
  else if (data.cardName !== card.name) {
    this.log.add({
      template: '{player} achieves a Chain Achievement',
      args: { player }
    })
    const card = this.getZoneByDeck('base', 11).cards()[0]
    if (card) {
      this.actions.claimAchievement(player, card)
    }
    else {
      this.log.add({ template: 'There are no cards left in the 11 deck to achieve.' })
    }
  }
}

Innovation.prototype.aFinishChainEvent = function(player, card) {
  const data = this.state.dogmaInfo.chainRule[player.name]

  // Got to the end of the dogma action for the original chain card.
  if (data.cardName === card.name) {
    delete this.state.dogmaInfo.chainRule[player.name]
  }

  // This card is finished, but some earlier card is still executing.
  else {
    // do nothing
  }
}

Innovation.prototype.aSelfExecute = function(player, card, opts={}) {
  this.aTrackChainRule(player, card)

  const topCard = this.getTopCard(player, card.color)
  const isTopCard = topCard && topCard.name === card.name

  opts.selfExecutor = player

  this.log.add({
    template: '{player} will {kind}-execute {card}',
    args: {
      player,
      card,
      kind: (opts.superExecute ? 'super' : 'self'),
    }
  })

  // Do all visible echo effects in this color.
  if (isTopCard) {
    const cards = this
      .cards.byPlayer(player, card.color)
      .filter(other => other.id !== card.id)
      .reverse()
    for (const other of cards) {
      this.aCardEffects(player, other, 'echo', opts)
    }
  }

  // Do the card's echo effects.
  this.aCardEffects(player, card, 'echo', opts)

  // Do the card's dogma effects.
  if (opts.superExecute) {
    // Demand all opponents
    opts.demanding = this.players.opponentsOf(player)
  }
  this.aCardEffects(player, card, 'dogma', opts)

  this.aFinishChainEvent(player, card)
}

Innovation.prototype.aSuperExecute = function(player, card) {
  this.aSelfExecute(player, card, { superExecute: true })
}

Innovation.prototype.aChooseAge = function(player, ages, opts={}) {
  if (!ages) {
    ages = this.utilAges()
  }
  else {
    ages = [...ages]
  }

  const selected = this.actions.choose(player, ages, { ...opts, title: 'Choose Age' })
  if (selected) {
    return selected[0]
  }
}

Innovation.prototype.aChooseColor = function(player, opts={}) {
  return this.actions.choose(player, this.utilColors(), {
    title: 'Choose a color',
    ...opts
  })
}

Innovation.prototype.aChooseAndAchieve = function(player, choices, opts={}) {
  if (choices.length === 0) {
    this.log.addNoEffect()
  }

  if (typeof choices[0] === 'object') {
    choices = this.formatAchievements(choices)
  }

  const selected = this.actions.choose(
    player,
    choices,
    { ...opts, title: 'Choose Achievement' }
  )

  if (selected.length === 0) {
    this.log.addDoNothing(player)
  }
  else {
    this.aAchieveAction(player, selected[0], { ...opts, nonAction: true })
  }
}

Innovation.prototype.aChooseByPredicate = function(player, cards, count, pred, opts={}) {
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
      const chosen = this.actions.chooseCards(player, choices, { count: numRemaining, ...opts })
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

    const cards = this.actions.chooseCards(player, choices, opts)
    if (cards) {
      if (opts.reveal) {
        this.actions.revealMany(player, cards)
      }

      const actionArgs = [...args]
      actionArgs[1] = cards
      return this[manyFuncName](...actionArgs)
    }
    else {
      return []
    }
  }
}

Innovation.prototype.aChooseAndScore = ChooseAndFactory('aScoreMany', 2)
Innovation.prototype.aChooseAndTransfer = ChooseAndFactory('aTransferMany', 3)

Innovation.prototype.aChooseAndUnsplay = function(player, choices, opts={}) {
  const colors = this.actions.choose(player, choices, {
    title: 'Choose a color',
    ...opts
  })
  for (const color of colors) {
    this.aUnsplay(player, color)
  }
}

Innovation.prototype.aChooseAndSplay = function(player, choices, direction, opts={}) {
  util.assert(direction, 'No direction specified for splay')

  if (!choices) {
    choices = this.utilColors()
  }

  choices = choices
    .filter(color => this.zones.byPlayer(player, color).splay !== direction)
    .filter(color => this.zones.byPlayer(player, color).cards().length > 1)

  if (choices.length === 0) {
    this.log.addNoEffect()
    return []
  }

  if (!opts.count && !opts.min && !opts.max) {
    opts.min = 0
    opts.max = 1
  }

  const colors = this.actions.choose(
    player,
    choices,
    { ...opts, title: `Choose a color to splay ${direction}` }
  )
  if (colors.length === 0) {
    this.log.addDoNothing(player)
    return []
  }
  else {
    const splayed = []
    for (const color of colors) {
      splayed.push(this.aSplay(player, color, direction))
    }
    return splayed
  }
}

Innovation.prototype.aDecree = function(player, name) {
  const card = this.cards.byId(name)
  const hand = this.zones.byPlayer(player, 'hand')

  this.log.add({
    template: '{player} declares a {card} decree',
    args: { player, card }
  })
  this.log.indent()

  this.actions.junkMany(player, hand.cards(), { ordered: true })

  let doImpl = false
  if (card.zone.id === 'achievements') {
    this.actions.claimAchievement(player, { card })
    doImpl = true
  }
  else if (card.zone.id === `players.${player.name}.achievements`) {
    doImpl = true
  }
  else {
    card.moveTo('achievements')
    this.log.add({
      template: '{player} returns {card} to the achievements',
      args: { player, card }
    })
  }

  if (doImpl) {
    this.log.add({
      template: '{card}: {text}',
      args: {
        card,
        text: card.text
      }
    })
    this.log.indent()
    card.decreeImpl(this, player)
    this.log.outdent()
  }

  this.log.outdent()
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
    this.log.add({
      template: 'Effects will share with {players}.',
      args: { players: shareData.sharing },
    })
  }

  if (shareData.demanding.length > 0) {
    this.log.add({
      template: 'Demands will be made of {players}.',
      args: { players: shareData.demanding },
    })
  }
}

Innovation.prototype._aDogmaHelper_executeEffects = function(player, card, shareData, opts) {
  // Store planned effects now, as changes to the stacks shouldn't affect them.
  const effects = [
    ...this.getVisibleEffectsByColor(card.owner, card.color, 'echo'),
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
    this.log.add({
      template: '{player} draws a sharing bonus',
      args: { player }
    })
    this.log.indent()
    const expansion = this.getExpansionList().includes('figs') ? 'figs' : ''
    this.aDraw(player, {
      exp: expansion,
      share: true,
      featuredBiscuit: this.state.dogmaInfo.featuredBiscuit
    })
    this.log.outdent()
  }

  // Grace Hopper and Susan Blackmore have "if your opponent didn't share" karma effects
  else if (this.state.couldShare) {
    for (const other of this.players.opponentsOf(player)) {
      this.aKarma(other, 'no-share', { card, leader: player })
    }
  }
}

Innovation.prototype.aDogmaHelper = function(player, card, opts) {
  const karmaKind = this.aKarma(player, 'dogma', { ...opts, card })
  if (karmaKind === 'would-instead') {
    this.actions.acted(player)
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
  this.log.add({
    template: '{player} activates the dogma effects of {card}',
    classes: ['player-action'],
    args: { player, card }
  })

  this.log.indent()
  this.aDogmaHelper(player, card, opts)
  this.log.outdent()
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
      const zone = this.zones.byPlayer(player, color)
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

Innovation.prototype.aDraw = function(player, opts={}) {
  const { age, share, isAction } = opts

  if (isAction) {
    const karmaKind = this.aKarma(player, 'draw-action', opts)
    if (karmaKind === 'would-instead') {
      this.actions.acted(player)
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
    this.actions.acted(player)
    return
  }

  return this.mDraw(player, adjustedExp, adjustedAge, opts)
}

Innovation.prototype.aDrawAndScore = function(player, age, opts={}) {
  const card = this.aDraw(player, {...opts, age })
  if (card) {
    return this.aScore(player, card, opts)
  }
}

Innovation.prototype.aEndorse = function(player, color, opts={}) {
  this.log.add({
    template: '{player} endorses {color}',
    args: { player, color }
  })
  this.log.indent()

  this.state.didEndorse = true

  // Tuck a card
  const featuredBiscuit = this
    .zones.byPlayer(player, color)
    .cards()[0]
    .dogmaBiscuit
  const cities = this
    .getTopCards(player)
    .filter(card => card.checkIsCity())
    .filter(card => card.biscuits.includes(featuredBiscuit))
  const junkChoices = this
    .zones.byPlayer(player, 'hand')
    .cards()
    .filter(card => cities.some(city => card.getAge() <= city.getAge()))
    .map(card => card.id)

  this.actions.chooseAndJunk(player, junkChoices, {
    title: 'Junk a card to endorse'
  })

  const card = this.getTopCard(player, color)
  this.aDogmaHelper(player, card, { ...opts, endorsed: true })

  this.log.outdent()
}

Innovation.prototype.aExchangeCards = function(player, cards1, cards2, zone1, zone2) {
  this.log.add({
    template: '{player} exchanges {count1} cards for {count2} cards',
    args: {
      player,
      count1: cards1.length,
      count2: cards2.length,
    }
  })

  let acted = false

  for (const card of cards1) {
    acted = Boolean(card.moveTo(zone2)) || acted
  }
  for (const card of cards2) {
    acted = Boolean(card.moveTo(zone1)) || acted
  }

  if (acted) {
    this.actions.acted(player)
  }
}

Innovation.prototype.aExchangeZones = function(player, zone1, zone2) {
  const cards1 = zone1.cards()
  const cards2 = zone2.cards()

  this.aExchangeCards(player, cards1, cards2, zone1, zone2)

  this.log.add({
    template: '{player} exchanges {count1} cards from {zone1} for {count2} cards from {zone2}',
    args: { player, zone1, zone2, count1: cards1.length, count2: cards2.length }
  })

  this.actions.acted(player)
}

Innovation.prototype._aKarmaHelper = function(player, infos, opts={}) {
  let info = infos[0]

  if (infos.length === 0) {
    return
  }
  else if (infos.length > 1) {
    if (info.impl.kind && info.impl.kind.startsWith('would')) {
      this.log.add({
        template: 'Multiple `would` karma effects would trigger, so {player} will choose one',
        args: { player: this.players.current() }
      })

      const infoChoices = infos.map(info => info.card)
      const chosenCard = this.actions.chooseCard(
        this.players.current(),
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
      this.log.add({
        template: '{player} would splay {color}, triggering...',
        args: {
          player,
          color: opts.direction
        }
      })
    }
    else if (opts.trigger === 'no-share') {
      this.log.add({
        template: '{player} did not draw a sharing bonus, triggering...',
        args: {
          player,
        }
      })
    }
    else if (opts.trigger === 'dogma') {
      this.log.add({
        template: '{player} would take a Dogma action, triggering...',
        args: {
          player,
        }
      })
    }
    else if (opts.trigger === 'draw') {
      this.log.add({
        template: '{player} would draw a card, triggering...',
        args: {
          player,
        }
      })
    }
    else if (opts.trigger === 'draw-action') {
      this.log.add({
        template: '{player} would take a draw action, triggering...',
        args: {
          player,
        }
      })
    }
    else {
      this.log.add({
        template: '{player} would {trigger} {card}, triggering...',
        args: {
          player,
          trigger: opts.trigger,
          card: opts.card,
        }
      })
    }
  }
  this.log.add({
    template: '{card} karma: {text}',
    args: {
      card: info.card,
      text: info.text
    }
  })
  this.log.indent()
  this._karmaIn()
  const result = this.aCardEffect(player, info, opts)
  this._karmaOut()
  this.log.outdent()

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

Innovation.prototype.aDigArtifact = function(player, age) {
  if (age > 11 || this.getZoneByDeck('arti', age).cards().length === 0) {
    this.log.add({
      template: `Artifacts deck for age ${age} is empty.`
    })
    return
  }

  const card = this.aDraw(player, { age, exp: 'arti' })
  if (card) {
    this.log.add({
      template: '{player} digs {card}',
      args: { player, card },
    })
    card.moveTo(this.zones.byPlayer(player, 'artifact'))
    this.acted(player)
  }
}

Innovation.prototype.aJunkAvailableAchievement = function(player, ages, opts={}) {
  const eligible = ages.flatMap(age => this.getAvailableAchievementsByAge(player, age))

  const card = this.actions.chooseCards(player, eligible, {
    title: 'Choose an achievement to junk',
    hidden: true,
    ...opts
  })[0]

  if (card) {
    this.actions.junk(player, card)
  }
}

Innovation.prototype.aJunkDeck = function(player, age, opts={}) {
  const cards = this.getZoneByDeck('base', age).cards()
  if (cards.length === 0) {
    this.log.add({
      template: 'The {age} deck is already empty.',
      args: { age },
    })
    return
  }

  let doJunk = true
  if (opts.optional) {
    doJunk = this.actions.chooseYesNo(player, `Junk the ${age} deck?`)
  }

  if (doJunk) {
    this.log.add({
      template: '{player} moves all cards in {age} deck to the junk',
      args: { player, age }
    })

    const cards = this.getZoneByDeck('base', age).cards()
    this.actions.junkMany(player, cards, { ordered: true })
  }
  else {
    this.log.add({
      template: '{player} chooses not to junk the {age} deck',
      args: { player, age }
    })
  }
}

Innovation.prototype.aScore = function(player, card, opts={}) {
  if (card === undefined) {
    return
  }
  const karmaKind = this.aKarma(player, 'score', { ...opts, card })
  if (karmaKind === 'would-instead') {
    this.actions.acted(player)
    return
  }

  return this.mScore(player, card, opts)
}

Innovation.prototype.aSplay = function(player, color, direction, opts={}) {
  util.assert(direction, 'No direction specified for splay')

  const owner = opts.owner || player

  const zone = this.zones.byPlayer(owner, color)
  if (zone.cards().length < 2) {
    this.log.add({
      template: `Cannot splay ${color} ${direction}`
    })
    return
  }

  const newDirection = zone.splay !== direction

  // Karmas don't trigger if someone else is splaying your cards.
  if (owner === player) {
    const karmaKind = this.aKarma(player, 'splay', { ...opts, color, direction })
    if (karmaKind === 'would-instead') {
      this.actions.acted(player)
      return
    }
  }

  const result = this.mSplay(player, color, direction, opts)

  if (newDirection) {
    this._maybeDrawCity(owner)
  }

  return result
}

// Used in two cases:
//  1. Player melds a card onto an empty color stack.
//  2. Player splays a color in a new direction.
Innovation.prototype._maybeDrawCity = function(player) {
  if (!this.getExpansionList().includes('city')) {
    return
  }
  if (this.cards.byPlayer(player, 'hand').some(card => card.checkIsCity())) {
    return
  }

  this.aDraw(player, { exp: 'city' })
}

Innovation.prototype.aTransfer = function(player, card, target, opts={}) {
  if (target.toBoard) {
    target = this.zones.byPlayer(target.player, card.color)
  }

  const karmaKind = this.aKarma(player, 'transfer', { ...opts, card, target })
  if (karmaKind === 'would-instead') {
    this.actions.acted(player)
    return
  }
  return this.mTransfer(player, card, target, opts)
}

Innovation.prototype.aUnsplay = function(player, color) {
  const zone = this.zones.byPlayer(player, color)

  if (zone.splay === 'none') {
    this.log.add({
      template: '{zone} is already unsplayed',
      args: { zone }
    })
  }
  else {
    this.log.add({
      template: '{player} unsplays {zone}',
      args: { player, zone }
    })
    zone.splay = 'none'
    return color
  }
}

Innovation.prototype.aYouLose = function(player, card) {
  this.log.add({
    template: '{player} loses the game due to {card}',
    args: { player, card },
  })
  player.dead = true

  const livingPlayers = this.players.all().filter(player => !player.dead)

  if (livingPlayers.length === 1) {
    throw new GameOverEvent({
      player: livingPlayers[0],
      reason: card.name,
    })
  }

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
    const startZones = Object.fromEntries(remaining.map(c => [c.id, c.zone]))

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
        next = this.actions.chooseCard(
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

Innovation.prototype.aScoreMany = ManyFactory('aScore')
Innovation.prototype.aTransferMany = ManyFactory('aTransfer', 1)


////////////////////////////////////////////////////////////////////////////////
// Checkers

Innovation.prototype.checkAchievementAvailable = function(name) {
  return !!this.zones.byId('achievements').cards().find(ach => ach.name === name)
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
  const isOnBoard = card.zone.id.match(re) !== null
  const isTop = card.zone.peek() === card
  return isOnBoard && isTop
}

Innovation.prototype.checkColorIsSplayed = function(player, color) {
  return this.zones.byPlayer(player, color).splay !== 'none'
}

Innovation.prototype.checkEffectIsVisible = function(card) {
  return this.getVisibleEffects(card, 'dogma') || this.getVisibleEffects(card, 'echo')
}

Innovation.prototype.checkInKarma = function() {
  return this.state.karmaDepth > 0
}

Innovation.prototype.checkIsFirstBaseDraw = function(player) {
  return !this.state.drawInfo[player.name].drewFirstBaseCard
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

  for (const card of this.zones.byPlayer(player, 'achievements').cards()) {
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
    .flatMap(color => this.cards.byPlayer(player, color))
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
        .players.all()
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
    .flatMap(color => this.cards.byPlayer(player, color))
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
    .players.all()
    .map(player => [player.name, this.getBiscuitsByPlayer(player)])
  return Object.fromEntries(biscuits)
}

Innovation.prototype.getBiscuitsByPlayer = function(player) {
  const boardBiscuits = this
    .utilColors()
    .map(color => this.zones.byPlayer(player, color))
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
    output[color] = this.getBiscuitsByZone(this.zones.byPlayer(player, color))
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
    .flatMap(color => this.zones.byPlayer(player, color))
    .flatMap(zone => zone.cards().flatMap(card => card.getBonuses(this.getSplayByCard(card))))

  const karmaBonuses = this
    .getInfoByKarmaTrigger(player, 'list-bonuses')
    .flatMap(info => info.impl.func(this, player))

  return bonuses
    .concat(karmaBonuses)
    .sort((l, r) => r - l)
}

Innovation.prototype.getAgesByZone = function(player, zoneName) {
  const ages = this.cards.byPlayer(player, zoneName).map(c => c.getAge())
  return util.array.distinct(ages).sort()
}

Innovation.prototype.getAvailableSpecialAchievements = function() {
  return this
    .zones.byId('achievements')
    .cards()
    .filter(c => c.isSpecialAchievement)
}

Innovation.prototype.getBottomCards = function(player) {
  return this
    .utilColors()
    .map(color => this.cards.byPlayer(player, color))
    .map(cards => cards[cards.length - 1])
    .filter(card => card !== undefined)
}

Innovation.prototype.getEffectAge = function(card, age) {
  const player = this.players.byZone(card.zone)

  if (player) {
    const karmaInfos = this.getInfoByKarmaTrigger(player, 'effect-age')
    if (karmaInfos.length === 0) {
      // No karma, so use age as is
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
    .players.opponentsOf(player)
    .flatMap(opp => this.getTopCards(opp))
    .flatMap(card => card.getKarmaInfo(trigger))
    .filter(info => info.impl.triggerAll)

  const thisPlayer = this
    .getTopCards(player)
    .flatMap(card => card.getKarmaInfo(trigger))

  const all = [...thisPlayer, ...global]
    .map(info => ({ ...info, owner: this.players.byOwner(info.card) }))

  return all
}

Innovation.prototype.getEffectByText = function(card, text) {
  for (const kind of ['dogma', 'echo']) {
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
  return this
    .utilAges()
    .filter(age => this.getZoneByDeck('base', age).cards().length > 0)
}

Innovation.prototype.getNumAchievementsToWin = function() {
  const base = 6
  const numPlayerAdjustment = 2 - this.players.all().length
  const numExpansionAdjustment = this.getExpansionList().length - 1

  return base + numPlayerAdjustment + numExpansionAdjustment
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

  details.score = this.cards.byPlayer(player, 'score').map(card => card.getAge()).sort()
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
  const zone = card.zone
  const cards = zone.cards()
  return card === cards[0] ? 'top' : zone.splay
}

Innovation.prototype.getBottomCard = function(player, color) {
  return this
    .cards.byPlayer(player, color)
    .slice(-1)[0]
}

Innovation.prototype.getSplayedZones = function(player) {
  return this
    .utilColors()
    .map(color => this.zones.byPlayer(player, color))
    .filter(zone => zone.splay !== 'none')
}

Innovation.prototype.getTopCard = function(player, color) {
  return this.cards.byPlayer(player, color)[0]
}

Innovation.prototype.getTopCards = function(player) {
  return this
    .utilColors()
    .map(color => this.zones.byPlayer(player, color))
    .map(zone => zone.cards()[0])
    .filter(card => card !== undefined)
}

Innovation.prototype.getTopCardsAll = function() {
  return this
    .players.all()
    .flatMap(player => this.getTopCards(player))
}

Innovation.prototype.getUniquePlayerWithMostBiscuits = function(biscuit) {
  const biscuits = this.getBiscuits()

  let most = 0
  let mostPlayerNames = []
  for (const [playerName, bis] of Object.entries(biscuits)) {
    const count = bis[biscuit]
    if (count > most) {
      most = count
      mostPlayerNames = [playerName]
    }
    else if (count === most) {
      mostPlayerNames.push(playerName)
    }
  }

  if (most > 0 && mostPlayerNames.length === 1) {
    return this.players.byName(mostPlayerNames[0])
  }
}

Innovation.prototype.getVisibleCardsByZone = function(player, zoneName) {
  const zone = this.zones.byPlayer(player, zoneName)
  const cards = zone.cards()
  if (zone.splay === 'none') {
    return cards.length > 0 ? 1 : 0
  }
  else {
    return cards.length
  }
}

Innovation.prototype.getVisibleEffects = function(card, kind, opts={}) {
  const player = opts.selfExecutor || this.players.byOwner(card)
  const isTop = this.checkCardIsTop(card) || card.zone.id.endsWith('.artifact')
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
      .cards.byPlayer(player, color)
      .reverse()
      .map(card => this.getVisibleEffects(card, kind))
      .filter(effect => effect !== undefined)
  }
}

Innovation.prototype.getZoneByDeck = function(exp, age) {
  // TODO: deprecate
  return this.zones.byDeck(exp, age)
}

Innovation.prototype.getColorZonesByPlayer = function(player) {
  return this
    .utilColor()
    .map(color => this.zones.byPlayer(player, color))
}

Innovation.prototype.getSafeOpenings = function(player) {
  return Math.max(0, this.getSafeLimit(player) - this.cards.byPlayer(player, 'safe').length)
}

Innovation.prototype.getSafeLimit = function(player) {
  return this.getZoneLimit(player)
}

Innovation.prototype.getForecastLimit = function(player) {
  return this.getZoneLimit(player)
}

Innovation.prototype.getZoneLimit = function(player) {
  const splays = this
    .utilColors()
    .map(color => this.zones.byPlayer(player, color).splay)

  if (splays.includes('aslant')) {
    return 1
  }
  else if (splays.includes('up')) {
    return 2
  }
  else if (splays.includes('right')) {
    return 3
  }
  else if (splays.includes('left')) {
    return 4
  }
  else {
    return 5
  }
}


////////////////////////////////////////////////////////////////////////////////
// Setters

Innovation.prototype.mAchievementCheck = function() {
  const available = this.zones.byId('achievements').cards()
  for (const player of this.players.startingWithCurrent()) {
    const reduceCost = this.getInfoByKarmaTrigger(
      player,
      'reduce-special-achievement-requirements'
    ).length > 0
    for (const card of available) {
      if (
        card.zone.name() === 'achievements'
        && card.checkPlayerIsEligible
        && card.checkPlayerIsEligible(this, player, reduceCost)
      ) {
        this.actions.claimAchievement(player, { card })
      }
    }
  }
}

Innovation.prototype.mActed = function(player) {
  if (!this.state.initializationComplete || !this.state.firstPicksComplete) {
    return
  }

  if (
    !this.state.dogmaInfo.demanding
    && this.state.dogmaInfo.acting === player
    && !this.checkSameTeam(player, this.players.current())
  ) {
    this.state.shared = true
  }

  // Special handling for "The Big Bang"
  this.state.dogmaInfo.theBigBangChange = true

  this.mSplayCheck()

  this.mAchievementVictoryCheck()
}

Innovation.prototype.mAdjustCardVisibility = function(card) {
  if (!this.state.initializationComplete) {
    return
  }

  const zone = card.zone
  const kind = zone.kind()

  if (kind === 'public') {
    card.visibility = this.players.all().map(p => p.name)
  }

  else if (kind === 'private') {
    util.array.pushUnique(card.visibility, zone.owner.name)
  }

  else if (kind === 'hidden') {
    card.visibility = []
  }

  else {
    throw new Error(`Unknown zone kind ${kind} for zone ${zone.id}`)
  }
}

Innovation.prototype.mDraw = function(player, exp, age, opts={}) {
  if (age > 11) {
    const scores = this
      .players.all()
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
  const hand = this.zones.byPlayer(player, 'hand')
  const card = this.mMoveTopCard(source, hand)

  if (!opts.silent) {
    this.log.add({
      template: '{player} draws {card}',
      args: { player, card }
    })
  }

  this.actions.acted(player)
  return card
}

Innovation.prototype.mMoveByIndices = function(source, sourceIndex, target, targetIndex) {
  util.assert(sourceIndex >= 0 && sourceIndex <= source.cards().length - 1, `Invalid source index ${sourceIndex}`)
  const sourceCards = source._cards
  const targetCards = target._cards
  const card = sourceCards[sourceIndex]
  sourceCards.splice(sourceIndex, 1)
  targetCards.splice(targetIndex, 0, card)
  card.zone = target

  const zoneOwner = this.players.byZone(target)
  card.owner = zoneOwner ? zoneOwner : null

  this.mAdjustCardVisibility(card)
  return card
}

Innovation.prototype.mMoveCardTo = function(card, target, opts={}) {
  const source = card.zone
  const sourceIndex = source.cards().findIndex(c => c === card)
  const targetIndex = opts.index === undefined ? target.cards().length : opts.index

  if (source === target && sourceIndex === targetIndex) {
    // Card is already in the target zone.
    return
  }

  this.mMoveByIndices(source, sourceIndex, target, targetIndex)

  return card
}

Innovation.prototype.mMoveCardsTo = function(player, cards, target) {
  for (const card of cards) {
    this.log.add({
      template: '{player} moves {card} to {zone}',
      args: { player, card, zone: target }
    })
    card.moveTo(target)
  }

  if (cards.length > 0) {
    this.actions.acted(player)
  }
}

Innovation.prototype.mMoveTopCard = function(source, target) {
  return this.mMoveByIndices(source, 0, target, target.cards().length)
}

Innovation.prototype._attemptToCombineWithPreviousEntry = function(msg) {
  if (this.log.getLog().length === 0) {
    return false
  }

  const prev = this.log.getLog().slice(-1)[0]

  if (!prev.args) {
    return
  }

  const combinable = ['foreshadows', 'melds', 'returns', 'tucks', 'reveals', 'scores', 'safeguards']
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

Innovation.prototype.mRemove = function(card) {
  return card.moveTo(this.zones.byId('junk'))
}

Innovation.prototype.mResetDogmaInfo = function() {
  this.state.dogmaInfo = {}
}

Innovation.prototype.mResetDrawInfo = function() {
  this.state.drawInfo = {}
  for (const player of this.players.all()) {
    this.state.drawInfo[player.name] = {
      drewFirstBaseCard: false
    }
  }
}
Innovation.prototype.mResetPeleCount = function() {
  this.state.tuckedGreenForPele = []
}

Innovation.prototype.mSetFirstBaseDraw = function(player) {
  this.state.drawInfo[player.name].drewFirstBaseCard = true
}

Innovation.prototype.mScore = function(player, card) {
  const target = this.zones.byPlayer(player, 'score')
  card.moveTo(target)
  this.log.add({
    template: '{player} scores {card}',
    args: { player, card }
  })
  this.actions.acted(player)
  return card
}

Innovation.prototype.mSplay = function(player, color, direction, opts) {
  util.assert(direction, 'No direction specified for splay')

  const owner = opts.owner || player

  const target = this.zones.byPlayer(owner, color)
  if (target.splay !== direction) {
    target.splay = direction

    if (player === owner) {
      this.log.add({
        template: '{player} splays {color} {direction}',
        args: { player, color, direction }
      })
    }

    else {
      this.log.add({
        template: "{player} splays {player2}'s {color} {direction}",
        args: { player, player2: owner, color, direction }
      })
    }

    this.actions.acted(player)
    return color
  }
}

Innovation.prototype.mTake = function(player, card) {
  const hand = this.zones.byPlayer(player, 'hand')
  card.moveTo(hand)
  this.log.add({
    template: '{player} takes {card} into hand',
    args: { player, card }
  })
  this.actions.acted(player)
  return card
}

Innovation.prototype.mTransfer = function(player, card, target) {
  card.moveTo(target, 0)
  this.log.add({
    template: '{player} transfers {card} to {zone}',
    args: { player, card, zone: target }
  })
  this.actions.acted(player)
  return card
}


////////////////////////////////////////////////////////////////////////////////
// Utility Functions

Innovation.prototype.utilAges = function() {
  return [1,2,3,4,5,6,7,8,9,10,11]
}

Innovation.prototype.utilBiscuitNames = function() {
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

Innovation.prototype.utilBiscuitNameToIcon = function(name) {
  switch (name) {
    case 'castle': return 'k'
    case 'clock': return 'i'
    case 'coin': return 'c'
    case 'factory': return 'f'
    case 'leaf': return 'l'
    case 'lightbulb': return 's'
    case 'person': return 'p'
  }

  throw new Error('Unknown biscuit name: ' + name)
}

Innovation.prototype.utilColors = function() {
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
    case 'red': return 'War'
    case 'yellow': return 'Expansion'
    case 'green': return 'Trade'
    case 'blue': return 'Advancement'
    case 'purple': return 'Rivalry'
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
    p: 0,
  }
}

Innovation.prototype.utilHighestCards = function(cards) {
  const sorted = [...cards].sort((l, r) => r.getAge() - l.getAge())
  return util.array.takeWhile(sorted, card => card.getAge() === sorted[0].getAge())
}

Innovation.prototype.utilLowestCards = function(cards) {
  const sorted = [...cards].sort((l, r) => l.getAge() - r.getAge())
  return util.array.takeWhile(sorted, card => card.getAge() === sorted[0].getAge())
}

Innovation.prototype.utilParseBiscuits = function(biscuitString) {
  const counts = this.utilEmptyBiscuits()
  for (const ch of biscuitString) {
    if (Object.hasOwn(counts, ch)) {
      counts[ch] += 1
    }
  }
  return counts
}

Innovation.prototype.utilSeparateByAge = function(cards) {
  const byAge = {}
  for (const card of cards) {
    if (Object.hasOwn(byAge, card.age)) {
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
  // Whether the player ends up drawing echoes, unseen, or base, this counts as their
  // first base draw, and so following draws won't draw unseen cards.
  const isFirstBaseDraw = this.checkIsFirstBaseDraw(player)
  if (isFirstBaseDraw){
    this.mSetFirstBaseDraw(player)
  }
  if (this.getExpansionList().includes('echo')) {
    const topAges = this
      .getTopCards(player)
      .map(c => c.getAge())
      .sort()
      .reverse()

    if (topAges.length === 1 || (topAges.length > 1 && topAges[0] != topAges[1])) {
      return 'echo'
    }
  }
  if (this.getExpansionList().includes('usee')) {
    if (isFirstBaseDraw) {
      return 'usee'
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
  choices.push(this._generateActionChoicesMeld())
  return choices
}

Innovation.prototype.getScoreCost = function(player, card) {
  const sameAge = this
    .zones.byPlayer(player, 'achievements')
    .cards()
    .filter(c => c.getAge() === card.getAge())

  const karmaAdjustment = this
    .getInfoByKarmaTrigger(player, 'achievement-cost-discount')
    .map(info => info.impl.func(this, player, { card }))
    .reduce((l, r) => l + r, 0)

  return card.getAge() * 5 * (sameAge.length + 1) - karmaAdjustment
}

Innovation.prototype.getAvailableAchievementsByAge = function(player, age) {
  age = parseInt(age)
  return this.getAvailableStandardAchievements(player).filter(c => c.getAge() === age)
}

Innovation.prototype.getAvailableStandardAchievements = function(player) {
  const achievementsZone = this
    .zones.byId('achievements')
    .cards()
    .filter(c => !c.isSpecialAchievement && !c.isDecree)

  const fromKarma = this
    .getInfoByKarmaTrigger(player, 'list-achievements')
    .flatMap(info => info.impl.func(this, player))

  return [achievementsZone, fromKarma].flat()
}

Innovation.prototype.getAvailableAchievementsRaw = function(player) {
  return this.getAvailableStandardAchievements(player)
}

Innovation.prototype.getEligibleAchievementsRaw = function(player, opts={}) {
  return this
    .getAvailableAchievementsRaw(player, opts)
    .filter(card => this.checkAchievementEligibility(player, card, opts))
}

Innovation.prototype.formatAchievements = function(array) {
  return array
    .map(ach => {
      if (ach.zone.id === 'achievements') {
        return ach.getHiddenName()
      }
      else {
        return ach.id
      }
    })
    .sort()
}

Innovation.prototype.getEligibleAchievements = function(player, opts={}) {
  const formatted = this.formatAchievements(this.getEligibleAchievementsRaw(player, opts))
  const standard = util.array.distinct(formatted).sort((l, r) => {
    if (l.exp === r.exp) {
      return l.age < r.age
    }
    else {
      return l.exp.localeCompare(r.exp)
    }
  })

  const secrets = this
    .cards.byPlayer(player, 'safe')
    .filter(card => this.checkAchievementEligibility(player, card))
    .map(card => `safe: ${card.getHiddenName()}`)
    .sort()

  return [
    ...standard,
    ...secrets,
  ]
}

Innovation.prototype._generateActionChoicesAchieve = function() {
  const player = this.players.current()

  return {
    title: 'Achieve',
    choices: this.getEligibleAchievements(player),
    min: 0,
  }
}

Innovation.prototype._generateActionChoicesDecree = function() {
  const player = this.players.current()

  const figuresInHand = this
    .zones.byPlayer(player, 'hand')
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
    .map(color => this.zones.byPlayer(player, color))
    .filter(zone => this.checkZoneHasVisibleDogmaOrEcho(player, zone))
    .map(zone => zone.cards()[0])
}

Innovation.prototype._generateActionChoicesDogma = function() {
  const player = this.players.current()

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
  const player = this.players.current()

  const lowestHandAge = this
    .zones.byPlayer(player, 'hand')
    .cards()
    .map(card => card.getAge())
    .sort((l, r) => l - r)[0] || 99

  const cities = this
    .getTopCards(player)
    .filter(card => card.checkIsCity())
    .filter(city => city.getAge() >= lowestHandAge)

  const stacksWithEndorsableEffects = this
    .getTopCards(player)
    .map(card => this.zones.byPlayer(player, card.color))

  const colors = []

  if (!this.state.didEndorse) {
    for (const zone of stacksWithEndorsableEffects) {
      if (zone.cards().length === 0) {
        throw new Error('"Endorsable" stack has no cards: ' + zone.id)
      }

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

Innovation.prototype._generateActionChoicesMeld = function() {
  const player = this.players.current()
  const cards = this
    .zones.byPlayer(player, 'hand')
    .cards()
    .map(c => c.id)

  this
    .cards.byPlayer(player, 'artifact')
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
    .players.all()
    .filter(p => p !== player)
    .filter(p => biscuitComparator(p))

  const demanding = this
    .players.all()
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
    this.log.add({
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

Innovation.prototype.statsRecordDogmaActions = function(player, card) {
  if (card.name in this.stats.dogmaActions) {
    this.stats.dogmaActions[card.name] += 1
  }
  else {
    this.stats.dogmaActions[card.name] = 1
  }
}
