const {
  Game,
  GameFactory,
  GameOverEvent,
} = require('../lib/game.js')
const res = require('./res/index.js')
const selector = require('../lib/selector.js')
const util = require('../lib/util.js')

const { UltimateLogManager } = require('./UltimateLogManager.js')
const { UltimateActionManager } = require('./UltimateActionManager.js')
const { UltimateCardManager } = require('./UltimateCardManager.js')
const { UltimatePlayerManager } = require('./UltimatePlayerManager.js')
const { UltimateUtils } = require('./UltimateUtils.js')
const { UltimateZone } = require('./UltimateZone.js')
const { UltimateZoneManager } = require('./UltimateZoneManager.js')

const { getDogmaShareInfo } = require('./actions/Dogma.js')
const { ActionChoicesMixin } = require('./mixins/ActionChoicesMixin.js')
const { EffectMixin } = require('./mixins/EffectMixin.js')
const { KarmaMixin } = require('./mixins/KarmaMixin.js')
const { QueryMixin } = require('./mixins/QueryMixin.js')

const SUPPORTED_EXPANSIONS = ['base', 'echo', 'figs', 'city', 'arti', 'usee']

module.exports = {
  GameOverEvent,
  Innovation,
  InnovationFactory,

  constructor: Innovation,
  factory: factoryFromLobby,
  res,
  SUPPORTED_EXPANSIONS,
}

function Innovation(serialized_data, viewerName) {
  Game.call(this, serialized_data, viewerName, {
    LogManager: UltimateLogManager,
    ActionManager: UltimateActionManager,
    CardManager: UltimateCardManager,
    PlayerManager: UltimatePlayerManager,
    ZoneManager: UltimateZoneManager,
  })

  this.util = new UltimateUtils(this)

  // Used in the UI for showing who will share/demand with an action
  this.getDogmaShareInfo = getDogmaShareInfo.bind(this.actions)
}

util.inherit(Game, Innovation)

function InnovationFactory(settings, viewerName) {
  const data = GameFactory(settings)
  return new Innovation(data, viewerName)
}

function factoryFromLobby(lobby) {
  return GameFactory({
    game: 'Innovation: Ultimate',
    version: 5,
    name: lobby.name,
    expansions: lobby.options.expansions,
    randomizeExpansions: lobby.options.randomizeExpansions,
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
  // Check for 'would-win' karmas.
  this.state.wouldWinKarma = true
  const result = this.triggerKarma(event.data.player, 'would-win', { event })
  this.state.wouldWinKarma = false

  if (result) {
    return result
  }

  return event
}


////////////////////////////////////////////////////////////////////////////////
// Initialization

Innovation.prototype.initialize = function() {
  this.log.add({ template: 'Initializing' })
  this.log.indent()

  this.state.useAgeZero = false

  this.initializeCards()
  this.initializeExpansions()
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

Innovation.prototype.initializeExpansions = function() {
  if (!this.settings.version || this.settings.version < 2) {
    return
  }


  if (this.settings.randomizeExpansions) {
    this.settings.expansions = ['base']

    const probability = .6
    this.log.add({
      template: 'Expansions will be randomly selected with probability {prob}.',
      args: { prob: probability },
    })

    const availableExpansions = SUPPORTED_EXPANSIONS.filter(exp => exp !== 'base')
    for (const exp of availableExpansions) {
      const randomNumber = this.random()
      const includeThisExpansion = randomNumber < probability
      this.log.add({
        template: '{expansion} rolled {number} {emoji}',
        args: {
          expansion: exp,
          number: randomNumber.toPrecision(2),
          emoji: includeThisExpansion ? '✅' : '❌',
        }
      })

      if (includeThisExpansion) {
        this.settings.expansions.push(exp)
      }
    }
  }

  this.log.add({
    template: 'The following expansions were selected: {expansions}',
    args: { expansions: this.settings.expansions.join() },
  })
}

Innovation.prototype.initializeTransientState = function() {
  this.mResetDogmaInfo()
  this.mResetPeleCount()
  this.mResetDrawInfo()
  this.state.turn = 1
  this.state.round = 1
  this.state.karmaDepth = 0
  this.state.actionNumber = null
  this.state.wouldWinKarma = false
  this.state.didEndorse = false
  this.state.tuckCount = Object.fromEntries(this.players.all().map(p => [p.name, 0]))
  this.state.scoreCount = Object.fromEntries(this.players.all().map(p => [p.name, 0]))
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

    for (const color of this.util.colors()) {
      const zone = this.zones.byPlayer(player, color)
      zone.color = color
      zone.splay = 'none'
    }
  }
}

Innovation.prototype.initializeStartingCards = function() {
  for (const player of this.players.all()) {
    this.actions.draw(player, { exp: 'base', age: 1 })
    if (this.settings.version < 3 && this.getExpansionList().includes('echo')) {
      this.actions.draw(player, { exp: 'echo', age: 1 })
    }
    else {
      this.actions.draw(player, { exp: 'base', age: 1 })
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
      actor: this.util.serializeObject(p),
      title: 'Choose First Card',
      choices: this.zones.byPlayer(p, 'hand').cardlist().map(this.util.serializeObject),
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
  const artifact = this.zones.byPlayer(player, 'artifact').cardlist()[0]
  if (artifact) {
    this.log.add({
      template: 'Free Artifact Action',
    })
    this.log.indent()

    // Build choices with subtitles for echo effects (version < 4 only)
    const choices = ['dogma', 'skip']
    const effects = this.getVisibleEffectsByColor(player, artifact.color, 'echo')
    if (effects.length > 0 && this.settings.version < 4) {
      choices[0] = {
        title: 'dogma',
        subtitles: [`${effects.length} echo effects will trigger`],
      }
    }

    const action = this.requestInputSingle({
      actor: player.name,
      title: 'Free Artifact Action',
      choices,
    })[0]

    switch (action) {
      case 'dogma': {
        this.actions.dogma(player, artifact, { artifact: true })
        this.actions.rotate(player, artifact)
        this.fadeFiguresCheck()
        break
      }

      case 'skip':
        this.log.add({
          template: '{player} skips the free artifact action',
          classes: ['action-header'],
          args: { player },
        })
        this.actions.rotate(player, artifact)
        break
      default:
        throw new Error(`Unknown artifact action: ${action}`)
    }

    this.log.outdent()
  }
}

Innovation.prototype.action = function(count) {
  const player = this.players.current()

  this.state.actionNumber = count

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

  const inputRequest = {
    actor: player.name,
    title: `Choose ${countTerm} Action`,
    choices: this._generateActionChoices(),
  }
  const chosenAction = this.requestInputSingle(inputRequest)[0]

  const validationResult = selector.validate(inputRequest, {
    title: inputRequest.title,
    selection: [chosenAction]
  })

  if (!validationResult.valid) {
    throw new Error(validationResult.mismatch)
  }

  if (!chosenAction.selection) {
    console.log(chosenAction)
    throw new Error('Invalid selection')
  }

  const name = chosenAction.title
  const arg = chosenAction.selection[0]

  if (name === 'Achieve') {
    this.actions.achieveAction(player, arg)
  }
  else if (name === 'Auspice') {
    const card = this.cards.byId(arg)
    this.actions.auspice(player, card)
  }
  else if (name === 'Decree') {
    this.aDecree(player, arg)
  }
  else if (name === 'Dogma') {
    const card = this.cards.byId(arg)
    this.actions.dogma(player, card)
  }
  else if (name === 'Draw') {
    this.actions.draw(player, { isAction: true })
  }
  else if (name === 'Endorse') {
    this.actions.endorse(player, arg)
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
  this.mResetDogmaInfo()
}

Innovation.prototype.fadeFiguresCheck = function() {
  for (const player of this.players.all()) {
    const topFiguresFn = () => this
      .cards.tops(player)
      .filter(card => card.checkIsFigure())

    if (topFiguresFn().length > 1) {
      this.log.add({
        template: '{player} has {count} figures and must fade some',
        args: { player, count: topFiguresFn().length }
      })
      this.log.indent()

      while (topFiguresFn().length > 1) {
        const karmaInfos = this.findKarmasByTrigger(player, 'no-fade')
        if (karmaInfos.length > 0) {
          this.log.add({
            template: '{player} fades nothing due to {card}',
            args: { player, card: karmaInfos[0].card }
          })
          break
        }

        const toFade = this.actions.chooseCard(player, topFiguresFn())
        this.actions.score(player, toFade)
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
  this.state.actionNumber = null
  this.state.didEndorse = false
  this.state.tuckCount = Object.fromEntries(this.players.all().map(p => [p.name, 0]))
  this.state.scoreCount = Object.fromEntries(this.players.all().map(p => [p.name, 0]))
  this.mResetDogmaInfo()
  this.mResetPeleCount()
  this.mResetDrawInfo()
}


////////////////////////////////////////////////////////////////////////////////
// Actions

Innovation.prototype.aDecree = function(player, name) {
  const card = this.cards.byId(name)
  const hand = this.zones.byPlayer(player, 'hand')

  this.log.add({
    template: '{player} declares a {card} decree',
    args: { player, card }
  })
  this.log.indent()

  // Handle karma
  const karmaKind = this.triggerKarma(player, 'decree')
  if (karmaKind === 'would-instead') {
    this.actions.acted(player)
    return
  }

  this.actions.junkMany(player, hand.cardlist(), { ordered: true })

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


////////////////////////////////////////////////////////////////////////////////
// Checkers

Innovation.prototype.checkAchievementAvailable = function(name) {
  return !!this.zones.byId('achievements').cardlist().find(ach => ach.name === name)
}

////////////////////////////////////////////////////////////////////////////////
// Getters

Innovation.prototype.getNumAchievementsToWin = function() {
  const base = 6
  const numPlayerAdjustment = 2 - this.players.all().length
  const numExpansionAdjustment = this.getExpansionList().length - 1

  return base + numPlayerAdjustment + numExpansionAdjustment
}



////////////////////////////////////////////////////////////////////////////////
// Setters

Innovation.prototype.mAchievementCheck = function() {
  const available = this.zones.byId('achievements').cardlist()
  for (const player of this.players.startingWithCurrent()) {
    const reduceCost = this.findKarmasByTrigger(
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

Innovation.prototype.mMoveByIndices = function(source, sourceIndex, target, targetIndex) {
  util.assert(sourceIndex >= 0 && sourceIndex <= source.cardlist().length - 1, `Invalid source index ${sourceIndex}`)
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
  const sourceIndex = source.cardlist().findIndex(c => c === card)
  const targetIndex = opts.index === undefined ? target.cardlist().length : opts.index

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
  return this.mMoveByIndices(source, 0, target, target.cardlist().length)
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


////////////////////////////////////////////////////////////////////////////////
// Private functions

Innovation.prototype.getAvailableMuseums = function() {
  return this
    .cards
    .byZone('achievements')
    .filter(c => c.isMuseum)
    .sort((l, r) => l.name.localeCompare(r.name))
}

Innovation.prototype.getAvailableSpecialAchievements = function() {
  return this
    .cards
    .byZone('achievements')
    .filter(c => c.isSpecialAchievement)
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

// Apply mixins
Object.assign(Innovation.prototype, ActionChoicesMixin)
Object.assign(Innovation.prototype, EffectMixin)
Object.assign(Innovation.prototype, KarmaMixin)
Object.assign(Innovation.prototype, QueryMixin)
