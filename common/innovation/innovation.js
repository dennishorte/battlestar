const {
  Game,
  GameFactory,
  GameOverEvent,
  InputRequestEvent,
} = require('./game.js')
const res = require('./resources.js')
const util = require('./util.js')
const { Zone } = require('./zone.js')


module.exports = {
  Innovation,
  InnovationFactory,
}


function Innovation(serialized_data, viewerName) {
  Game.call(this, serialized_data)
  this.viewerName = viewerName
}

util.inherit(Game, Innovation)

function InnovationFactory(settings, viewerName) {
  const data = GameFactory(settings)
  return new Innovation(data, viewerName)
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
      this.aKarma(player, 'would-win')
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
}

Innovation.prototype.initializePlayers = function() {
  this.state.players = this.settings.players.map(p => ({
    _id: p._id,
    id: p.name,
    name: p.name,
    team: p.name,
  }))
  util.array.shuffle(this.state.players)
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
  this.state.zones.exile = new Zone(this, 'exile', 'public')

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
    const data = res[exp]
    for (const [age, cards] of Object.entries(res[exp].byAge)) {
      if (!cards) {
        throw new Error(`Missing cards for ${exp}-${age}`)
      }
      else if (!Array.isArray(cards)) {
        throw new Error(`Cards for ${exp}-${age} is of type ${typeof cards}`)
      }
      const cardsCopy = [...cards]
      util.array.shuffle(cardsCopy)
      zones.decks[exp][age] = new Zone(this, `decks.${exp}.${age}`, 'deck')
      zones.decks[exp][age].setCards(cardsCopy)
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
      for (const ach of res[exp].achievements) {
        zones.achievements._cards.push(ach)
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
    zones.players[player.name] = root

    for (const color of ['red', 'yellow', 'green', 'blue', 'purple']) {
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
  this.mLog({
    template: 'Round 1',
  })

  this.state.firstPicksComplete = true

  this._breakpoint('before-first-player')
}

Innovation.prototype.mainLoop = function() {
  while (true) {
    this.mLog({
      template: "{player}'s turn",
      args: {
        player: this.getPlayerCurrent()
      }
    })

    this.mLogIndent()

    this.artifact()
    this.action(1)
    this.action(2)
    this.endTurn()

    this.mLogOutdent()
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
    })

    switch (action) {
      case 'dogma':
        this.aDogma(player, card, { artifact: true })
        break
      case 'return':
        this.aReturn(player, card)
        break
      case 'skip':
        this.mLog({
          template: '{player} skips the free artifact action',
          args: { player },
        })
        break
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
  this.mLog({ template: `${countTerm} action` })
  this.mLogIndent()

  const chosenAction = this.requestInputSingle({
    actor: player.name,
    title: `Choose ${countTerm} Action`,
    choices: this._generateActionChoices(),
  })[0]

  const name = chosenAction.name
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
    this.aDraw(player)
  }
  else if (name === 'Endorse') {
    this.aEndorse(player, arg)
  }
  else if (name === 'Inspire') {
    this.aInspire(player, arg)
  }
  else if (name === 'Meld') {
    const card = this.getCardByName(arg)
    this.aMeld(player, card)
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
      .filter(card => card.expansion === 'figs')

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
  const playerIndex = players.findIndex(p => this.getPlayerCurrent())
  const nextIndex = (playerIndex + 1) % players.length
  this.state.currentPlayer = players[nextIndex]

  // Track number of turns
  this.state.turn += 1
  this.state.round = Math.floor((this.state.turn + players.length - 1) / players.length)
  if (this.state.round % players.length === 0) {
    this.mLog({ template: `Round ${this.state.round}` })
  }

  // Reset various turn-centric state
  this.state.didEnsorse = false
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

Innovation.prototype.aCardEffect = function(player, info, opts) {
  const fn = typeof info.impl === 'function' ? info.impl : info.impl.func
  return fn(this, player, opts)
}

Innovation.prototype.aCardEffects = function(
  leader,
  player,
  card,
  kind,
  biscuits,
  sharing=[],
  demanding=[],
  endorsed=false
) {
  const effects = this.getVisibleEffects(card, kind)
  if (!effects) {
    return
  }

  const { texts, impls } = effects
  const repeatCount = endorsed ? 2 : 1

  for (let i = 0; i < texts.length; i++) {
    for (let z = 0; z < repeatCount; z++) {
      const effectText = texts[i]
      const effectImpl = impls[i]
      const isDemand = effectText.startsWith('I demand')

      if (!isDemand) {
        this.state.couldShare = true
      }

      const demand = isDemand && demanding.includes(player)
      const share = !isDemand && sharing.includes(player) && z === 0
      const owner = !isDemand && player === leader

      if (demand || share || owner) {
        this.mLog({
          template: `{player}, {card}: ${effectText}`,
          args: { player, card }
        })
        this.mLogIndent()

        const effectInfo = {
          card,
          text: effectText,
          impl: effectImpl,
          index: i,
        }

        if (demand) {
          this.state.dogmaInfo.demanding = true

          const karmaKind = this.aKarma(player, 'demand-success', { card, effectInfo, leader })
          if (karmaKind === 'would-instead') {
            this.state.dogmaInfo.demanding = false
            this.mLogOutdent()
            return
          }
        }

        const result = this.aCardEffect(player, effectInfo, {
          biscuits,
          leader,
        })

        this.state.dogmaInfo.demanding = false
        this.mLogOutdent()

        if (result === '__STOP__') {
          this.mLog({
            template: 'Dogma action is complete'
          })
          return result
        }
      }
    }
  }
}

Innovation.prototype.aChoose = function(player, choices, opts={}) {
  if (choices.length === 0) {
    this.mLogNoEffect()
    return undefined
  }

  const selected = this.requestInputSingle({
    actor: player.name,
    title: opts.title || 'Choose',
    choices: choices,
    ...opts
  })
  if (selected.length === 0) {
    this.mLogDoNothing(player)
    return undefined
  }
  else {
    return selected
  }

}

Innovation.prototype.aChooseAge = function(player, ages, opts={}) {
  if (!ages) {
    ages = [1,2,3,4,5,6,7,8,9,10]
  }

  const selected = this.aChoose(player, ages, { ...opts, title: 'Choose Age' })
  if (selected) {
    return selected[0]
  }
}

Innovation.prototype.aChooseCard = function(player, cards, opts) {
  if (cards.length === 0) {
    this.mLogNoEffect()
    return undefined
  }

  const cardNames = this.requestInputSingle({
    actor: player.name,
    title: 'Choose a Card',
    choices: cards.map(c => c.id || c),
    ...opts
  })
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

  const choices = choiceMap.map(x => x.name)

  const cardNames = this.requestInputSingle({
    actor: player.name,
    title: 'Choose a Card',
    choices,
    ...opts
  })

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

  const playerNames = this.requestInputSingle({
    actor: player.name,
    title: opts.title || 'Choose a Player',
    choices,
    ...opts,
  })
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

  const selected = this.requestInputSingle({
    actor: player.name,
    title: 'Choose Achievement',
    choices,
  })

  if (selected.length === 0) {
    this.mLogDoNothing(player)
  }
  else {
    this.aAchieveAction(player, selected[0], opts)
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

  const colors = this.requestInputSingle({
    actor: player.name,
    title: 'Choose a Color',
    choices,
    direction,
    ...opts
  })
  if (colors.length === 0) {
    this.mLogDoNothing(player)
  }
  else {
    return this.aSplay(player, colors[0], direction)
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
    card = this.getZoneById('achievements').cards().find(c => c.age === opts.age)
  }

  if (!card) {
    throw new Error(`Unable to find achievement given opts: ${JSON.stringify(opts)}`)
  }

  const karmaKind = this.aKarma(player, 'achieve', { ...opts, card })
  if (karmaKind === 'would-instead') {
    return
  }

  this.mAchieve(player, card)

  if (opts.isStandard && this.getExpansionList().includes('figs')) {
    for (const opp of this.getPlayerOpponents(player)) {
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

  this.aRemoveMany(player, hand.cards())

  let doImpl = false
  if (card.zone === 'achievements') {
    this.aClaimAchievement(player, { card })
    doImpl = true
  }
  else if (card.zone === `players.${player.name}.achievements`) {
    doImpl = true
  }
  else {
    this.mMoveCardTo(card, this.getZoneByName('achievements'))
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

Innovation.prototype.aDogmaHelper = function(player, card, opts) {
  this.state.shared = false
  this.state.couldShare = false

  // Store the biscuits now because changes caused by the dogma action should
  // not affect the number of biscuits used for evaluting the effect.
  const biscuits = this.getBiscuits()
  const featuredBiscuit = card.dogmaBiscuit
  const biscuitComparator = this._getBiscuitComparator(player, featuredBiscuit, biscuits)

  const sharing = this
    .getPlayerAll()
    .filter(p => p !== player)
    .filter(p => biscuitComparator(p))

  const demanding = this
    .getPlayerAll()
    .filter(p => p !== player)
    .filter(p => !biscuitComparator(p))

  // Store the planned effects now, because changes caused by the dogma action
  // should not affect which effects are executed.
  const echoCards = this.getVisibleEffectsByColor(player, card.color, 'echo')
  const dogmaCards = this.getVisibleEffectsByColor(player, card.color, 'dogma')

  const effectCards = [...echoCards, ...dogmaCards]
    .map(effect => effect.card)

  // Regardless of normal dogma or artifact dogma, the selected card is executed last.
  effectCards.push(card)

  const finalEffects = util.array.distinct(effectCards)

  const endorsed = opts.endorsed
  const leader = this.getPlayerCurrent()
  for (const ecard of finalEffects) {
    for (const player of this.getPlayersStartingNext()) {
      this.aCardEffects(leader, player, ecard, 'echo', biscuits, sharing, demanding, endorsed)

      // Only the top card (or the artifact card for free artifact dogma actions)
      // get to do their dogma effects.
      if (ecard === card) {
        const result = this.aCardEffects(leader, player, ecard, 'dogma', biscuits, sharing, demanding, endorsed)
        if (result === '__STOP__') {
          return result
        }
      }
    }
  }

  // Share bonus
  if (this.state.shared) {
    this.mLog({
      template: '{player} draws a sharing bonus',
      args: { player }
    })
    this.mLogIndent()
    const expansion = this.getExpansionList().includes('figs') ? 'figs' : ''
    this.aDraw(player, { exp: expansion, share: true, featuredBiscuit })
    this.mLogOutdent()
  }

  // Grace Hopper and Susan Blackmore have "if your opponent didn't share" karma effects
  else if (this.state.couldShare) {
    for (const other of this.getPlayerOpponents(player)) {
      this.aKarma(other, 'no-share', { card, leader: player })
    }
  }
}

Innovation.prototype.aDogma = function(player, card, opts={}) {
  this.mLog({
    template: '{player} activates the dogma effects of {card}',
    args: { player, card }
  })

  this.mLogIndent()

  const karmaKind = this.aKarma(player, 'dogma', { ...opts, card })
  if (karmaKind === 'would-instead') {
    return
  }

  this.aDogmaHelper(player, card, opts)
  this.mLogOutdent()
}

Innovation.prototype._getAgeForDrawAction = function(player) {
  const karmaInfos = this.getInfoByKarmaTrigger(player, 'top-card-value')

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

      const karmaMatches = (
        karmaInfos.length === 1
        && karmaInfos[0].impl.matches(this, player, { action: 'draw', color })
      )
      if (karmaMatches && !this.checkInKarma()) {
        this._karmaIn()
        const result = karmaInfos[0].impl.func(this, player, { color })
        this._karmaOut()
        return result
      }
      else {
        return zone.cards()[0].age
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
    return cards[0].age
  }
}

Innovation.prototype.aDraw = function(player, opts={}) {
  const { age, share } = opts

  // Expansion the user should draw from, before looking at empty decks.
  const baseExp = opts.exp || this._determineBaseDrawExpansion(player, share)

  // If age is not specified, draw based on player's current highest top card.
  const highestTopAge = this._getAgeForDrawAction(player)
  const baseAge = age !== undefined ? (age || 1) : (highestTopAge || 1)

  // Adjust age based on empty decks.
  const [ adjustedAge, adjustedExp ] = this._adjustedDrawDeck(baseAge, baseExp)

  const karmaKind = this.aKarma(player, 'draw', { ...opts, age: adjustedAge })
  if (karmaKind === 'would-instead') {
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

  // Tuck a card
  const featuredBiscuit = this
    .getZoneByPlayer(player, color)
    .cards()[0]
    .dogmaBiscuit
  const cities = this
    .getTopCards(player)
    .filter(card => card.expansion === 'city')
    .filter(card => card.biscuits.includes(featuredBiscuit))
  const tuckChoices = this
    .getZoneByPlayer(player, 'hand')
    .cards()
    .filter(card => cities.some(city => card.age <= city.age))
    .map(card => card.id)

  this.aChooseAndTuck(player, tuckChoices)

  const card = this.getTopCard(player, color)
  this.aDogmaHelper(player, card, { ...opts, endorsed: true })

  this.mLogOutdent()
}

Innovation.prototype.aForeshadow = function(player, card, opts={}) {
  const karmaKind = this.aKarma(player, 'foreshadow', { ...opts, card })
  if (karmaKind === 'would-instead') {
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

  const zone = this.getZoneByPlayer(player, color)
  const biscuits = this.getBiscuits()

  const karmaKind = this.aKarma(player, 'inspire', { ...opts, color })
  if (karmaKind === 'would-instead') {
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
      player,
      card,
      'inspire',
      biscuits
    )
  }

  const drawAge = this._getAgeForInspireAction(player, color)
  this.aDraw(player, { age: drawAge })

  this.mLogOutdent()
}

Innovation.prototype._aKarmaHelper = function(player, infos, opts={}) {
  if (infos.length === 0) {
    return
  }
  else if (infos.length > 1) {
    throw new Error('Multiple Karmas not handled')
  }

  const info = infos[0]
  opts = { ...opts, owner: info.owner }

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
      return info.impl.matches(this, player, { ...opts, owner: info.owner })
    })
  return this._aKarmaHelper(player, infos, { ...opts, trigger: kind })
}

Innovation.prototype.aKarmaWhenMeld = function(player, card, opts={}) {
  const infos = card.getKarmaInfo('when-meld')
  return this._aKarmaHelper(player, infos, opts)
}

Innovation.prototype.aMeld = function(player, card, opts={}) {
  const karmaKind = this.aKarma(player, 'meld', { ...opts, card })
  if (karmaKind === 'would-instead') {
    return
  }

  this.mMeld(player, card, opts)
  this.aKarmaWhenMeld(player, card, opts)

  return card
}

Innovation.prototype.aRemove = function(player, card, opts={}) {
  const karmaKind = this.aKarma(player, 'remove', { ...opts, card })
  if (karmaKind === 'would-instead') {
    return
  }

  return this.mRemove(player, card, opts)
}

Innovation.prototype.aReturn = function(player, card, opts={}) {
  const karmaKind = this.aKarma(player, 'return', { ...opts, card })
  if (karmaKind === 'would-instead') {
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
    return
  }

  return this.mScore(player, card, opts)
}

Innovation.prototype.aSplay = function(player, color, direction, opts={}) {
  util.assert(direction, 'No direction specified for splay')

  const karmaKind = this.aKarma(player, 'splay', { ...opts, color, direction })
  if (karmaKind === 'would-instead') {
    return
  }

  return this.mSplay(player, color, direction, opts)
}

Innovation.prototype.aTransfer = function(player, card, target, opts={}) {
  if (target.toBoard) {
    target = this.getZoneByPlayer(target.player, card.color)
  }

  const karmaKind = this.aKarma(player, 'transfer', { ...opts, card, target })
  if (karmaKind === 'would-instead') {
    return
  }
  return this.mTransfer(player, card, target, opts)
}

Innovation.prototype.aTuck = function(player, card, opts={}) {
  const karmaKind = this.aKarma(player, 'tuck', { ...opts, card })
  if (karmaKind === 'would-instead') {
    return
  }

  return this.mTuck(player, card, opts)
}

Innovation.prototype.aUnsplay = function(player, zone, opts={}) {
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
  const result = this.requestInputSingle({
    actor: player.name,
    title,
    choices: ['yes', 'no'],
  })[0]

  return result === 'yes'
}

function ManyFactory(baseFuncName, extraArgCount=0) {
  return function(...args) { //player, cards, opts={}) {
    const player = args[0]
    const cards = args[1]
    const opts = args[2 + extraArgCount] || {}

    const results = []
    let remaining = [...cards]
    let auto = opts.ordered || false
    while (remaining.length > 0) {
      let next
      if (auto || remaining.length === 1) {
        next = remaining[0]
      }
      else {
        next = this.aChooseCard(player, remaining.concat(['auto']))
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
Innovation.prototype.aScoreMany = ManyFactory('aScore')
Innovation.prototype.aTransferMany = ManyFactory('aTransfer', 1)
Innovation.prototype.aTuckMany = ManyFactory('aTuck')


////////////////////////////////////////////////////////////////////////////////
// Checkers

Innovation.prototype.checkAchievementAvailable = function(name) {
  return !!this.getZoneById('achievements').cards().find(ach => ach.name === name)
}

Innovation.prototype.checkAchievementEligibility = function(player, card, opts={}) {
  const playerScore = this.getScore(player)
  const topCardAge = this.getHighestTopAge(player, { reason: 'achieve' })

  const ageRequirement = opts.ignoreAge || card.age <= topCardAge
  const scoreRequirement = opts.ignoreScore || this.checkScoreRequirement(player, card)
  return ageRequirement && scoreRequirement
}

Innovation.prototype.checkCardIsTop = function(card) {
  return this.getZoneByCard(card).cards()[0] === card
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

Innovation.prototype.checkSameTeam = function(p1, p2) {
  return p1.team === p2.team
}

Innovation.prototype.checkScoreRequirement = function(player, card) {
  return this.getScoreCost(player, card) <= this.getScore(player)
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
    if (card.isSpecialAchievement) {
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

Innovation.prototype.getBiscuitsByCard = function(card) {
  return this.utilParseBiscuits(card.getBiscuits())
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
  const rx = /([ab1-9])/g
  const bonuses = this
    .utilColors()
    .map(color => this.getZoneByPlayer(player, color))
    .flatMap(zone => zone.cards().map(card => this.getBiscuitsRaw(card, zone.splay)))
    .flatMap(biscuits => biscuits.match(rx))
    .filter(bonus => bonus !== null)
    .map(bonus => {
      switch (bonus) {
        case 'a': return 10;
        case 'b': return 11;
        default: return parseInt(bonus)
      }
    })

  const karmaBonuses = this
    .getInfoByKarmaTrigger(player, 'list-bonuses')
    .flatMap(info => info.impl.func(this, player))

  return bonuses
    .concat(karmaBonuses)
    .sort((l, r) => r - l)
}

Innovation.prototype.getCardByName = function(name) {
  util.assert(res.all.byName.hasOwnProperty(name), `Unknown card: ${name}`)
  return res.all.byName[name]
}

Innovation.prototype.getCardsByZone = function(player, zoneName) {
  return this.getZoneByPlayer(player, zoneName).cards()
}

Innovation.prototype.getEffectAge = function(card, age) {
  const cardZone = this.getZoneByCard(card)
  const player = this.getPlayerByZone(cardZone)

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

  if (this.state.dogmaInfo.globalAgeIncrease) {
    age += this.state.dogmaInfo.globalAgeIncrease
  }

  return age
}

Innovation.prototype.getInfoByKarmaTrigger = function(player, trigger) {
  util.assert(typeof player.name === 'string', 'First parameter must be player object')
  util.assert(typeof trigger === 'string', 'Second parameter must be string.')

  // Karmas can't trigger while executing another karma.
  if (this.checkInKarma()) {
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
  const baseAge = card ? card.age : 0

  const karmaAdjustment = this
    .getInfoByKarmaTrigger(player, 'calculate-eligibility')
    .filter(info => info.impl.reason !== undefined)
    .filter(info => info.impl.reason === 'all' || info.impl.reason === opts.reason)
    .reduce((l, r) => l + r.impl.func(this, player), 0)

  return baseAge + karmaAdjustment
}

Innovation.prototype.getHighestTopCard = function(player) {
  const topCards = this
    .utilColors()
    .map(color => this.getZoneByPlayer(player, color).cards()[0])
    .filter(card => card !== undefined)
    .sort((l, r) => r.age - l.age)

  return topCards[0]
}

Innovation.prototype.getLog = function() {
  return this.state.log
}

Innovation.prototype.getLogIndent = function(msg) {
  let indent = 0
  for (const msg of this.getLog()) {
    if (msg === '__INDENT__') {
      indent += 1
    }
    else if (msg === '__OUTDENT__') {
      indent -= 1
    }
  }
  return indent
}

Innovation.prototype.getNonEmptyAges = function() {
  return [1,2,3,4,5,6,7,8,9,10]
    .filter(age => this.getZoneByDeck('base', age).cards().length > 0)
}

Innovation.prototype.getNumAchievementsToWin = function() {
  const base = 6
  const numPlayerAdjustment = 2 - this.getPlayerAll().length
  const numExpansionAdjustment = this.getExpansionList().length - 1

  return base + numPlayerAdjustment + numExpansionAdjustment
}

Innovation.prototype.getPlayerAll = function() {
  return this.state.players
}

Innovation.prototype.getPlayerOther = function(player) {
  return this
    .getPlayerAll()
    .filter(other => other !== player)
}

Innovation.prototype.getPlayerByCard = function(card) {
  const zone = this.getZoneById(card.zone)
  return this.getPlayerByZone(zone)
}

Innovation.prototype.getPlayerCurrent = function() {
  return this.state.currentPlayer
}

Innovation.prototype.getPlayerByName = function(name) {
  const player = this.getPlayerAll().find(p => p.name === name)
  util.assert(!!player, `Player with name '${name}' not found.`)
  return player
}

Innovation.prototype.getPlayerByZone = function(zone) {
  const regex = /players[.]([^.]+)[.]/
  const match = zone.id.match(regex)
  util.assert(match, `Couldn't get player name from zone id: ${zone.id}`)
  return this.getPlayerByName(match[1])
}

Innovation.prototype.getPlayerTeam = function(player) {
  return this
    .getPlayerAll()
    .filter(p => this.checkSameTeam(p, player))
}

Innovation.prototype.getPlayerOpponents = function(player) {
  return this
    .getPlayerAll()
    .filter(p => !this.checkSameTeam(p, player))
}

// Return an array of all players, starting with the current player.
Innovation.prototype.getPlayersStartingCurrent = function() {
  const players = [...this.getPlayerAll()]
  while (players[0] !== this.getPlayerCurrent()) {
    players.push(players.shift())
  }
  return players
}

// Return an array of all players, starting with the player who will follow the current player.
// Commonly used when evaluating effects
Innovation.prototype.getPlayersStartingNext = function() {
  const players = [...this.getPlayerAll()]
  while (players[players.length - 1] !== this.getPlayerCurrent()) {
    players.push(players.shift())
  }
  return players
}

Innovation.prototype.getResources = function() {
  return res
}

Innovation.prototype.getScore = function(player) {
  return this.getScoreDetails(player).total
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

  details.score = this.getCardsByZone(player, 'score').map(card => card.age).sort()
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

Innovation.prototype.getTopCard = function(player, color) {
  return this
    .getZoneByPlayer(player, color)
    .cards()[0]
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

Innovation.prototype.getVisibleEffects = function(card, kind) {
  const player = this.getPlayerByCard(card)
  const isTop = this.checkCardIsTop(card)
  const splay = this.getSplayByCard(card)

  if (kind === 'dogma') {
    if (isTop && card.dogma.length > 0) {
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

Innovation.prototype.getZoneByCard = function(card) {
  return this.getZoneById(card.zone)
}

Innovation.prototype.getZoneByCardHome = function(card) {
  return this.getZoneById(card.home)
}

Innovation.prototype.getZoneByDeck = function(exp, age) {
  return this.state.zones.decks[exp][age]
}

Innovation.prototype.getZoneById = function(id) {
  const tokens = id.split('.')
  let curr = this.state.zones
  for (const token of tokens) {
    util.assert(curr.hasOwnProperty(token), `Invalid zone id ${id} at token ${token}`)
    curr = curr[token]
  }
  return curr
}

Innovation.prototype.getZoneByPlayer = function(player, name) {
  return this.state.zones.players[player.name][name]
}


////////////////////////////////////////////////////////////////////////////////
// Setters

Innovation.prototype.mAchievementCheck = function() {
  const available = this.getZoneById('achievements').cards()
  for (const player of this.getPlayersStartingCurrent()) {
    const reduceCost = this.getInfoByKarmaTrigger(
      player,
      'reduce-special-achievement-requirements'
    ).length > 1
    for (const card of available) {
      if (card.checkPlayerIsEligible && card.checkPlayerIsEligible(this, player, reduceCost)) {
        // It is safe to return here. Claiming an achievement will retrigger this
        // function, allowing players to claim more than one achievement per turn.
        return this.aClaimAchievement(player, { card })
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

  if (!this.state.dogmaInfo.demanding && !this.checkSameTeam(player, this.getPlayerCurrent())) {
    this.state.shared = true
  }

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
  if (age > 10) {
    throw new GameOverEvent({
      reason: 'high draw',
      player,
      age,
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
  if (card.zone === target.id) {
    // Card is already in the target zone.
    return
  }
  const source = this.getZoneByCard(card)
  const sourceIndex = source.cards().findIndex(c => c === card)
  this.mMoveByIndices(source, sourceIndex, target, target.cards().length)

  if (opts.player) {
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

Innovation.prototype.mMoveCardToTop = function(card, target) {
  const source = this.getZoneByCard(card)
  const sourceIndex = source.cards().findIndex(c => c === card)
  return this.mMoveByIndices(source, sourceIndex, target, 0)
}

Innovation.prototype.mMoveTopCard = function(source, target) {
  return this.mMoveByIndices(source, 0, target, target.cards().length)
}

Innovation.prototype.mLog = function(msg) {
  if (!msg.template) {
    console.log(msg)
    throw new Error(`Invalid log entry; no template`)
  }

  if (!msg.classes) {
    msg.classes = []
  }
  if (!msg.args) {
    msg.args = {}
  }

  this.utilEnrichLogArgs(msg)
  msg.id = this.getLog().length
  msg.indent = this.getLogIndent(msg)

  // Making a copy here makes sure that the log items are always distinct from
  // wherever their original data came from.
  this.state.log.push(msg)

  return msg.id
}

Innovation.prototype.mLogDoNothing = function(player) {
  this.mLog({
    template: '{player} does nothing',
    args: { player }
  })
}

Innovation.prototype.mLogNoEffect = function() {
  this.mLog({ template: 'no effect' })
}

Innovation.prototype.mLogIndent = function() {
  this.state.log.push('__INDENT__')
}

Innovation.prototype.mLogOutdent = function() {
  this.state.log.push('__OUTDENT__')
}

Innovation.prototype.mRemove = function(player, card) {
  this.mMoveCardTo(card, this.getZoneById('exile'))
  this.mLog({
    template: '{player} exiles {card}',
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

Innovation.prototype.mSplay = function(player, color, direction) {
  util.assert(direction, 'No direction specified for splay')

  const target = this.getZoneByPlayer(player, color)
  if (target.splay !== direction) {
    target.splay = direction
    this.mLog({
      template: '{player} splays {color} {direction}',
      args: { player, color, direction }
    })
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
  if (card.isSpecialAchievement) {
    name = card.name
  }
  else {
    const hiddenName = this._getHiddenName(card)
    name = card.visibility.includes(this.viewerName) ? card.name : hiddenName
  }

  const classes = ['card']
  if (card.age) {
    classes.push(`card-age-${card.age}`)
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
  }
}

Innovation.prototype.utilEnrichLogArgs = function(msg) {
  for (const key of Object.keys(msg.args)) {
    if (key.startsWith('player')) {
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

    // Ensure the classes key is set for all entries.
    msg.args[key].classes = msg.args[key].classes || []
  }
}

Innovation.prototype.utilHighestCards = function(cards) {
  const sorted = [...cards].sort((l, r) => r.age - l.age)
  return util.array.takeWhile(sorted, card => card.age === sorted[0].age)
}

Innovation.prototype.utilLowestCards = function(cards) {
  const sorted = [...cards].sort((l, r) => l.age - r.age)
  return util.array.takeWhile(sorted, card => card.age === sorted[0].age)
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
  return `*${card.expansion}-${card.age}*`
}

Innovation.prototype._adjustedDrawDeck = function(age, exp) {
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
    const echoesCards = hand.cards().filter(c => c.expansion === 'echo')
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
    .filter(c => c.age === card.age)

  const karmaAdjustment = this
    .getInfoByKarmaTrigger(player, 'achievement-cost-discount')
    .map(info => info.impl.func(this, player, { card }))
    .reduce((l, r) => l + r, 0)

  return card.age * 5 * (sameAge.length + 1) - karmaAdjustment
}

Innovation.prototype.getAvailableAchievementsRaw = function(player) {
  const achievementsZone = this
    .getZoneById('achievements')
    .cards()
    .filter(c => !c.isSpecialAchievement)

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
        return `age ${ach.age}`
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
    name: 'Achieve',
    choices: this.getEligibleAchievements(player)
  }
}

Innovation.prototype._generateActionChoicesDecree = function() {
  const player = this.getPlayerCurrent()

  const figuresInHand = this
    .getZoneByPlayer(player, 'hand')
    .cards()
    .filter(c => c.expansion === 'figs')

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
    name: 'Decree',
    choices: availableDecrees.sort()
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

  const dogmaTargets = this.getDogmaTargets(player)

  const extraEffects = this
    .getInfoByKarmaTrigger(player, 'list-effects')
    .flatMap(info => info.impl.func(this, player))

  const allTargets = util
    .array
    .distinct([...dogmaTargets, ...extraEffects])
    .map(card => card.name)

  return {
    name: 'Dogma',
    choices: allTargets
  }
}

Innovation.prototype._generateActionChoicesDraw = function() {
  return {
    name: 'Draw',
    choices: ['draw a card']
  }
}

Innovation.prototype._generateActionChoicesEndorse = function() {
  const player = this.getPlayerCurrent()
  const endorseColors = []

  const lowestHandAge = this
    .getZoneByPlayer(player, 'hand')
    .cards()
    .map(card => card.age)
    .sort((l, r) => l - r)[0] || 99

  const cities = this
    .getTopCards(player)
    .filter(card => card.expansion === 'city')
    .filter(city => city.age >= lowestHandAge)

  const stacksWithEndorsableEffects = this
    .utilColors()
    .map(color => this.getZoneByPlayer(player, color))
    .filter(zone => this.checkZoneHasVisibleDogmaOrEcho(player, zone))

  const colors = []

  for (const zone of stacksWithEndorsableEffects) {
    const dogmaBiscuit = zone.cards()[0].dogmaBiscuit
    const canEndorse = cities.some(city => city.biscuits.includes(dogmaBiscuit))
    if (canEndorse) {
      colors.push(zone.color)
    }
  }

  return {
    name: 'Endorse',
    choices: colors
  }
}

Innovation.prototype._generateActionChoicesInspire = function() {
  const player = this.getPlayerCurrent()
  const inspireColors = []

  for (const color of this.utilColors()) {
    const effects = this.getVisibleEffectsByColor(player, color, 'inspire')
    if (effects.length > 0) {
      inspireColors.push(color)
    }
  }

  return {
    name: 'Inspire',
    choices: inspireColors,
  }
}

Innovation.prototype._generateActionChoicesMeld = function() {
  const player = this.getPlayerCurrent()
  const cards = this
    .getZoneByPlayer(player, 'hand')
    .cards()
    .map(c => c.id)
  return {
    name: 'Meld',
    choices: cards
  }
}

Innovation.prototype._getBiscuitComparator = function(player, featuredBiscuit, biscuits) {
  // Some karmas affect how sharing is calculated by adjusting the featured biscuit.
  const featuredBiscuitKarmas = this
    .getInfoByKarmaTrigger(player, 'featured-biscuit')
    .filter(info => info.impl.matches(this, player, { biscuit: featuredBiscuit }))

  let adjustedBiscuit

  if (featuredBiscuitKarmas.length === 0) {
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
