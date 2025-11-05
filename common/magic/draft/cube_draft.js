const {
  Game,
  GameFactory,
  GameOverEvent,
} = require('../../lib/game.js')

const { Pack } = require('./pack.js')
const util = require('../../lib/util.js')

const { CubeDraftPlayerManager } = require('./CubeDraftPlayerManager.js')


module.exports = {
  GameOverEvent,
  CubeDraft,
  CubeDraftFactory,

  constructor: CubeDraft,
  factory: factoryFromLobby,
}

function CubeDraft(serialized_data, viewerName) {
  Game.call(this, serialized_data, viewerName, {
    PlayerManager: CubeDraftPlayerManager,
  })
}

util.inherit(Game, CubeDraft)

function CubeDraftFactory(settings, viewerName) {
  const data = GameFactory(settings)
  return new CubeDraft(data, viewerName)
}

function factoryFromLobby(lobby) {
  return GameFactory({
    game: lobby.game,
    name: lobby.name,
    players: lobby.users,
    seed: lobby.seed,

    cubeId: lobby.options.cubeId,
    cubeName: lobby.options.cubeName,
    set: lobby.options.set,

    packSize: lobby.options.packSize,
    numPacks: lobby.options.numPacks,
    packs: lobby.packs,

    scarRounds: (lobby.options.scarRounds || '').split(',').filter(x => x).map(x => parseInt(x)),
    scars: [],
  })
}

CubeDraft.prototype.serialize = function() {
  const base = Game.prototype.serialize.call(this)

  // Include these because Magic doesn't run on the backend when saving,
  // so can't calculate these values.
  base.waiting = this.waiting
  base.gameOver = this.gameOver
  base.gameOverData = this.gameOverData

  return base
}

CubeDraft.prototype._mainProgram = function() {
  this.initialize()
  this.log.add({ template: "Draft Begins" })

  // Open the first pack for each player.
  this.log.indent()
  this
    .players.all()
    .forEach(player => this.aOpenNextPack(player))

  this.mainLoop()
}


////////////////////////////////////////////////////////////////////////////////
// Initialization

CubeDraft.prototype.initialize = function() {
  this.log.add({ template: 'Initializing' })
  this.log.indent()

  this.initializePacks()
  this.initializeScars()

  this.log.outdent()

  this.state.initializationComplete = true
  this._breakpoint('initialization-complete')
}

CubeDraft.prototype.initializePacks = function() {
  this.state.packs = this.settings.packs.map(packData => new Pack(this, packData))
  this.cardsById = {}

  this.log.add({ template: 'Passing out packs' })
  this.log.indent()

  if (this.settings.cubeName !== null) {
    this.log.add({ template: 'cube name: ' + this.settings.cubeName })
    this.log.add({ template: 'number of packs: ' + this.settings.numPacks })
    this.log.add({ template: 'cards per pack: ' + this.settings.packSize })
  }
  else if (this.settings.set) {
    this.log.add({ template: 'set name: ' + this.settings.set.name })
  }
  this.log.outdent()

  let packIndex = 0

  for (const player of this.players.all()) {
    for (let p_i = 0; p_i < this.settings.numPacks; p_i++) {
      const pack = this.state.packs[packIndex]
      pack.index = p_i
      pack.owner = player
      pack.id = player.name + '-' + p_i
      player.unopenedPacks.push(pack)
      packIndex += 1

      for (const card of pack.cards) {
        this.cardsById[card.id] = card
      }
    }
  }
}

CubeDraft.prototype.initializeScars = function() {
  if (!this.settings.scarRounds || !this.settings.scarRounds.length) {
    return
  }

  const scars = util.array.shuffle([...this.settings.scars], this.random)
  const pairs = util.array.chunk(scars, 2)

  for (const pack of this.state.packs) {
    if (this.settings.scarRounds.includes(pack.index + 1)) {
      if (pairs.length === 0) {
        console.log(0, this.settings.scars)
        console.log(1, pack)
        throw new Error('Not enough scars for all packs')
      }
      pack.scars = pairs.pop()
    }
  }
}


////////////////////////////////////////////////////////////////////////////////
// Main

CubeDraft.prototype.mainLoop = function() {
  while (!this.checkGameComplete()) {
    const playerOptions = this.players.all()
      .filter(p => this.checkPlayerHasOption(p))
      .map(p => this.getPlayerOptions(p))
    const action = this.requestInputAny(playerOptions)
    const player = this.players.byName(action.actor)

    switch (action.title) {
      case 'Apply Scar':
        this.aApplyScar(player, action.selection[0])
        break

      case 'Draft Card':
        this.aDraftCard(player, this.getNextPackForPlayer(player), action.selection[0])
        break

      default:
        this.log.add({ template: `Unknown action: ${action.title}` })
        break
    }
  }

  throw new GameOverEvent({
    player: 'everyone',
    reason: 'Draft is complete'
  })
}

CubeDraft.prototype.aApplyScar = function(player, data) {
  this.log.add({
    template: '{player} applied a scar',
    args: { player },
  })

  const pack = this.getNextPackForPlayer(player)
  const packRound = pack.index + 1

  // Mark that this player has applied scars for this round
  player.scarredRounds.push(packRound)

  // Mark the card so this player can't draft it this round
  player.scarredCardId = data.cardId
}

CubeDraft.prototype.aDraftCard = function(player, pack, cardId) {
  util.assert(this.getNextPackForPlayer(player) === pack, "This pack isn't ready for this player")

  cardId = cardId.title ? cardId.title : cardId

  if (cardId === player.scarredCardId) {
    throw new Error('Player tried to draft the card they scarred')
  }

  const card = pack.getCardById(cardId)
  util.assert(pack.checkCardIsAvailable(card), "The selected card is not in the pack.")

  // Clear draft blocks caused by scarring
  player.scarredCardId = null

  this.log.add({
    template: '{player} drafted a card',
    args: { player },
  })
  pack.pickCardById(player, cardId)
  player.picked.push(card)
  player.waitingPacks.shift() // remove this pack from the front of the player queue

  if (pack.checkIsEmpty()) {
    // Do not pass this pack to the next player.
    // Open the next pack if one is available.
    pack.waiting = null
    this.aOpenNextPack(player)
  }
  else {
    // Pass this pack to the next player.
    const nextPlayer = this.getNextPlayerForPack(pack)
    const nextPlayerPackIndex = this.getPackIndexForPlayer(nextPlayer)

    if (nextPlayerPackIndex === pack.index) {
      nextPlayer.waitingPacks.push(pack)
    }
    else {
      nextPlayer.nextRoundPacks.push(pack)
    }

    pack.waiting = nextPlayer
    pack.viewPack(nextPlayer)
  }
}

CubeDraft.prototype.aOpenNextPack = function(player) {
  const pack = player.unopenedPacks.shift()
  const packNum = this.settings.numPacks - player.unopenedPacks.length

  if (pack) {
    this.log.add({
      template: '{player} opens pack {count}',
      args: { player, count: packNum }
    })

    player.waitingPacks.push(pack)
    pack.waiting = player
    pack.viewPack(player)

    // Move all the next round packs that piled up into the waiting packs queue
    while (player.nextRoundPacks.length > 0) {
      player.waitingPacks.push(player.nextRoundPacks.shift())
    }
  }

  // Player has no remaining packs.
  // They are done unless some draft matters event happens that affects them.
  else {
    player.draftComplete = true
  }
}


////////////////////////////////////////////////////////////////////////////////
// Checkers

CubeDraft.prototype.checkForWaitingPack = function(player) {
  return Boolean(this.getNextPackForPlayer(player))
}

CubeDraft.prototype.checkGameComplete = function() {
  return this
    .players.all()
    .every(player => !this.getNextPackForPlayer(player))
}

CubeDraft.prototype.checkIsScarAction = function(player) {
  const pack = this.getNextPackForPlayer(player)
  if (pack) {
    const packRound = pack.index + 1
    return (
      this.settings.scarRounds
      && this.settings.scarRounds.includes(packRound)
      && !player.scarredRounds.includes(packRound)
    )
  }
  else {
    return false
  }
}

CubeDraft.prototype.checkPlayerHasOption = function(player) {
  return (
    this.checkIsScarAction(player)
    || this.checkForWaitingPack(player)
  )
}


////////////////////////////////////////////////////////////////////////////////
// Getters

CubeDraft.prototype.getPicksByPlayer = function(player) {
  return player.picked
}

CubeDraft.prototype.getNextPackForPlayer = function(player) {
  const nextPack = this.getWaitingPacksForPlayer(player)[0]
  const playerPackIndex = this.getPackIndexForPlayer(player)

  if (nextPack && nextPack.index === playerPackIndex) {
    return nextPack
  }
  else {
    return undefined
  }
}

CubeDraft.prototype.getPacks = function() {
  return this.state.packs
}

CubeDraft.prototype.getPackIndexForPlayer = function(player) {
  return Math.floor(player.picked.length / this.settings.packSize)
}

CubeDraft.prototype.getNextPlayerForPack = function(pack) {
  util.assert(Boolean(pack.waiting), 'pack does not have a waiting player')

  const direction = pack.index % 2
  if (direction === 0) {
    return this.players.following(pack.waiting)
  }
  else {
    return this.players.preceding(pack.waiting)
  }
}

CubeDraft.prototype.getPlayerOptions = function(player) {
  if (this.checkIsScarAction(player)) {
    const pack = this.getNextPackForPlayer(player)
    pack.viewPack(player)

    return {
      actor: player.name,
      title: 'Apply Scar',
      choices: pack.scars,
    }
  }

  else if (this.checkForWaitingPack(player)) {
    const pack = this.getNextPackForPlayer(player)
    pack.viewPack(player)
    return {
      actor: player.name,
      title: 'Draft Card',
      choices: pack
        .getRemainingCards()
        .filter(c => c.id !== player.scarredCardId)
        .map(c => c.id)
    }
  }

  else {
    return []
  }
}

CubeDraft.prototype.getResultMessage = function() {
  if (this.checkGameIsOver()) {
    return 'Draft Complete'
  }
  else {
    return 'in progress'
  }
}

CubeDraft.prototype.getWaitingPacksForPlayer = function(player) {
  return player.waitingPacks
}

CubeDraft.prototype.getCardById = function(cardId) {
  return this.cardsById[cardId]
}


////////////////////////////////////////////////////////////////////////////////
// Private mutators

CubeDraft.prototype.mPushWaitingPack = function(player, pack) {
  player.waitingPacks.push(pack)
  pack.waiting = player
}


////////////////////////////////////////////////////////////////////////////////
// Utils

CubeDraft.prototype._enrichLogArgs = function(msg) {
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
      const isHidden = false

      if (isHidden) {
        msg.args[key] = {
          value: 'a card',
          classes: ['card-hidden'],
        }
      }
      else {
        msg.args[key] = {
          value: card.name,
          cardId: card.id,  // Important in some UI situations.
          classes: ['card-name'],
        }
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

CubeDraft.prototype._responseReceived = function(response) {
  if (response.title === 'Apply Scar') {
    response.noUndo = true
  }
}
