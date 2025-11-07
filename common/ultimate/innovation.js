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
const { UltimatePlayerManager } = require('./UltimatePlayerManager.js')
const { UltimateUtils } = require('./UltimateUtils.js')
const { UltimateZone } = require('./UltimateZone.js')
const { UltimateZoneManager } = require('./UltimateZoneManager.js')

const { getDogmaShareInfo } = require('./actions/Dogma.js')

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
  // TODO (dennis): handle would-win karma effects
  return event
}


////////////////////////////////////////////////////////////////////////////////
// Initialization

Innovation.prototype.initialize = function() {
  this.log.add({ template: 'Initializing' })
  this.log.indent()

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

    const action = this.requestInputSingle({
      actor: player.name,
      title: 'Free Artifact Action',
      choices: ['dogma', 'skip']
    })[0]

    switch (action) {
      case 'dogma': {
        const startingZone = artifact.zone
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
    this.actions.achieveAction(player, arg)
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
        const karmaInfos = this.getInfoByKarmaTrigger(player, 'no-fade')
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

Innovation.prototype.aCardEffect = function(player, info, opts={}) {
  const prevLeader = this.state.dogmaInfo.effectLeader
  if (opts.leader) {
    this.state.dogmaInfo.effectLeader = opts.leader
  }

  const fn = typeof info.impl === 'function' ? info.impl : info.impl.func
  const result = fn(this, player, { self: info.card, ...opts })

  if (opts.leader) {
    this.state.dogmaInfo.effectLeader = prevLeader
  }

  return result
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
    foreseen: false,
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
          foreseen: opts.foreseen,
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
  const effects = card.visibleEffects(kind, opts)
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
      template: '{player} achieves a Chain Achievement because {card} is recursively self-executing',
      args: { player, card }
    })
    const achievement = this.zones.byDeck('base', 11).cardlist()[0]
    if (achievement) {
      this.actions.claimAchievement(player, achievement)
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

Innovation.prototype.aSelfExecute = function(executingCard, player, card, opts={}) {
  this.aTrackChainRule(player, executingCard)

  const topCard = this.cards.top(player, card.color)
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
    opts.demanding = this.players.opponents(player)
  }
  this.aCardEffects(player, card, 'dogma', opts)

  this.aFinishChainEvent(player, card)
}

Innovation.prototype.aSuperExecute = function(executingCard, player, card) {
  this.aSelfExecute(executingCard, player, card, { superExecute: true })
}

Innovation.prototype.aDecree = function(player, name) {
  const card = this.cards.byId(name)
  const hand = this.zones.byPlayer(player, 'hand')

  this.log.add({
    template: '{player} declares a {card} decree',
    args: { player, card }
  })
  this.log.indent()

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
  const cards1 = zone1.cardlist()
  const cards2 = zone2.cardlist()

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

  /*
     from the rules:
     In the rare case that multiple “Would” karmas are triggered
     by the same game event, the current player decides which
     karma occurs and ignores the others.
   */
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

Innovation.prototype.aYouLose = function(player, card) {
  this.log.add({
    template: '{player} loses the game due to {card}',
    args: { player, card },
  })
  player.dead = true

  const livingPlayers = this.players.all().filter(player => !player.dead)

  if (livingPlayers.length === 1) {
    this.youWin(livingPlayers[0], card.name)
  }
}


////////////////////////////////////////////////////////////////////////////////
// Checkers

Innovation.prototype.checkAchievementAvailable = function(name) {
  return !!this.zones.byId('achievements').cardlist().find(ach => ach.name === name)
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

Innovation.prototype.checkColorIsSplayed = function(player, color) {
  return this.zones.byPlayer(player, color).splay !== 'none'
}

Innovation.prototype.checkEffectIsVisible = function(card) {
  return card.visibleEffects('dogma') || card.visibleEffects('echo')
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

  for (const card of this.zones.byPlayer(player, 'achievements').cardlist()) {
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

  // Flags and Fountains
  const cards = this.zones.colorStacks(player).flatMap(zone => zone.cardlist())
  const flags = cards.filter(card => card.checkBiscuitIsVisible(';'))
  const fountains = cards.filter(card => card.checkBiscuitIsVisible(':'))

  for (const card of flags) {
    // Player must have the most or tied for the most visible cards of that color to get the achievement.
    const myCount = card.zone.numVisibleCards()
    const otherCounts = this
      .players
      .other(player)
      .map(other => this.zones.byPlayer(other, card.color).numVisibleCards())

    if (otherCounts.every(otherCount => otherCount <= myCount)) {
      const count = card.visibleBiscuits().split(';').length - 1
      for (let i = 0; i < count; i++) {
        ach.other.push(card)
      }
    }
  }

  for (const card of fountains) {
    const count = card.visibleBiscuits().split(':').length - 1
    for (let i = 0; i < count; i++) {
      ach.other.push(card)
    }
  }

  ach.total = ach.standard.length + ach.special.length + ach.other.length

  return ach
}

Innovation.prototype.getBiscuits = function() {
  const biscuits = this
    .players
    .all()
    .map(player => [player.name, player.biscuits()])
  return Object.fromEntries(biscuits)
}

Innovation.prototype.getBonuses = function(player) {
  const bonuses = this
    .util.colors()
    .flatMap(color => this.zones.byPlayer(player, color))
    .flatMap(zone => zone.cardlist().flatMap(card => card.getBonuses()))

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

Innovation.prototype.getEffectAge = function(card, age) {
  const player = this.players.byOwner(card)

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
    .players
    .opponents(player)
    .flatMap(opp => this.cards.tops(opp))
    .flatMap(card => card.getKarmaInfo(trigger))
    .filter(info => info.impl.triggerAll)

  const thisPlayer = this
    .cards.tops(player)
    .flatMap(card => card.getKarmaInfo(trigger))

  const all = [...thisPlayer, ...global]
    .map(info => ({ ...info, owner: this.players.byOwner(info.card) }))

  return all
}

Innovation.prototype.getEffectByText = function(card, text) {
  for (const kind of ['dogma', 'echo']) {
    const effects = card.visibleEffects(kind)
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
  return this.util.highestCards(this.cards.tops(player), { visible: true })[0]
}

Innovation.prototype.getNonEmptyAges = function() {
  return this
    .util.ages()
    .filter(age => this.zones.byDeck('base', age).cardlist().length > 0)
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

Innovation.prototype.getSplayedZones = function(player) {
  return this
    .util.colors()
    .map(color => this.zones.byPlayer(player, color))
    .filter(zone => zone.splay !== 'none')
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
      .cards
      .byPlayer(player, color)
      .reverse()
      .map(card => card.visibleEffects(kind))
      .filter(effect => effect !== undefined)
  }
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
    .util.colors()
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
  const available = this.zones.byId('achievements').cardlist()
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
    .cardlist()
    .filter(c => c.getAge() === card.getAge())

  const karmaAdjustment = this
    .getInfoByKarmaTrigger(player, 'achievement-cost-discount')
    .map(info => info.impl.func(this, player, { card }))
    .reduce((l, r) => l + r, 0)

  return card.getAge() * 5 * (sameAge.length + 1) - karmaAdjustment
}

/**
   This one gets special achievements as well.
 */
Innovation.prototype.getAvailableAchievements = function(player) {
  return [
    ...this.getAvailableSpecialAchievements(player),
    ...this.getAvailableStandardAchievements(player),
  ]
}

Innovation.prototype.getAvailableAchievementsByAge = function(player, age) {
  age = parseInt(age)
  return this.getAvailableStandardAchievements(player).filter(c => c.getAge() === age)
}

Innovation.prototype.getAvailableMuseums = function() {
  return this
    .cards
    .byZone('achievements')
    .filter(c => c.isMuseum)
    .sort((l, r) => l.name.localeCompare(r.name))
}

Innovation.prototype.getAvailableStandardAchievements = function(player) {
  const achievementsZone = this
    .zones
    .byId('achievements')
    .cardlist()
    .filter(c => !c.isSpecialAchievement && !c.isDecree && !c.isMuseum)

  const fromKarma = this
    .getInfoByKarmaTrigger(player, 'list-achievements')
    .flatMap(info => info.impl.func(this, player))

  return [achievementsZone, fromKarma].flat()
}

Innovation.prototype.getAvailableSpecialAchievements = function() {
  return this
    .cards
    .byZone('achievements')
    .filter(c => c.isSpecialAchievement)
}

Innovation.prototype.getEligibleAchievementsRaw = function(player, opts={}) {
  return this
    .getAvailableStandardAchievements(player, opts)
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
    .cardlist()
    .filter(c => c.checkIsFigure())

  const figuresByAge = this.util.separateByAge(figuresInHand)

  const availableDecrees = []

  if (Object.keys(figuresByAge).length >= 3) {
    figuresInHand
      .map(card => card.color)
      .map(color => this.util.colorToDecree(color))
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
    .util.colors()
    .map(color => this.zones.byPlayer(player, color))
    .filter(zone => this.checkZoneHasVisibleDogmaOrEcho(player, zone))
    .map(zone => zone.cardlist()[0])
}

Innovation.prototype._generateActionChoicesDogma = function() {
  const player = this.players.current()

  const dogmaTargets = this.cards.tops(player)

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
    .cardlist()
    .map(card => card.getAge())
    .sort((l, r) => l - r)[0] || 99

  const cities = this
    .cards.tops(player)
    .filter(card => card.checkIsCity())
    .filter(city => city.getAge() >= lowestHandAge)

  const stacksWithEndorsableEffects = this
    .cards.tops(player)
    .map(card => this.zones.byPlayer(player, card.color))

  const colors = []

  if (!this.state.didEndorse) {
    for (const zone of stacksWithEndorsableEffects) {
      if (zone.cardlist().length === 0) {
        throw new Error('"Endorsable" stack has no cards: ' + zone.id)
      }

      const dogmaBiscuit = zone.cardlist()[0].dogmaBiscuit
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
    .zones
    .byPlayer(player, 'hand')
    .cardlist()

  this
    .cards
    .byPlayer(player, 'museum')
    .filter(card => !card.isMuseum)
    .forEach(card => cards.push(card))

  return {
    title: 'Meld',
    choices: cards.map(c => c.id),
    min: 0,
    max: 1,
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
