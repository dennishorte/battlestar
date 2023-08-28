const {
  Game,
  GameFactory,
  GameOverEvent,
  InputRequestEvent,
} = require('../../lib/game.js')

const Pack = require('./pack.js')
const util = require('../../lib/util.js')

module.exports = {
  GameOverEvent,
  CubeDraft,
  CubeDraftFactory,
  factory: factoryFromLobby,
}

function CubeDraft(serialized_data, viewerName) {
  Game.call(this, serialized_data, viewerName)

  this.cardLookupFunc = null
  this.cardsById = {}
}

util.inherit(Game, CubeDraft)

function CubeDraftFactory(settings, viewerName) {
  const data = GameFactory(settings)
  return new CubeDraft(data, viewerName)
}

function factoryFromLobby(lobby, db) {
  return GameFactory({
    game: 'CubeDraft',
    name: lobby.name,
    players: lobby.users,
    seed: lobby.seed,

    cubeId: lobby.options.cubeId,
    cubeName: lobby.options.cubeName,
    set: lobby.options.set,

    packSize: lobby.options.packSize,
    numPacks: lobby.options.numPacks,
    packs: lobby.packs,

    scars: lobby.scars,
    scarRounds: (lobby.options.scarRounds || '').split(',').map(x => parseInt(x)),
  })
}

CubeDraft.prototype._mainProgram = function() {
  this.initialize()
  this.mLog({ template: "Draft Begins" })

  // Open the first pack for each player.
  this.mLogIndent()
  this
    .getPlayerAll()
    .forEach(player => this.aOpenNextPack(player))

  this.mainLoop()
}

CubeDraft.prototype._gameOver = function(event) {
  this.mLogSetIndent(0)
  this.mLog({ template: 'Draft Complete' })
  return event
}

////////////////////////////////////////////////////////////////////////////////
// Initialization

CubeDraft.prototype.initialize = function() {
  this.mLog({ template: 'Initializing' })
  this.mLogIndent()

  this.state.usedScars = []

  this.initializePlayers()
  this.initializePacks()
  this.initializeScars()

  this.mLogOutdent()

  this.state.initializationComplete = true
  this._breakpoint('initialization-complete')
}

CubeDraft.prototype.initializePlayers = function() {
  this.state.players = this.settings.players.map(p => ({
    _id: p._id,
    id: p.name,
    name: p.name,
    deckId: p.deckId,
    index: null,
    draftCompelete: false,
    picked: [],
    waitingPacks: [],
    nextRoundPacks: [],
    unopenedPacks: [],
  }))
  this.mLog({ template: 'Randomizing player seating' })
  util.array.shuffle(this.state.players, this.random)
  this.state.players.forEach((player, index) => {
    player.index = index
  })
}

CubeDraft.prototype.initializePacks = function() {
  this.state.packs = this.settings.packs.map(pack => new Pack(this, pack))
  this.cardsById = {}

  this.mLog({ template: 'Passing out packs' })
  this.mLogIndent()

  if (this.settings.cubeName !== null) {
    this.mLog({ template: 'cube name: ' + this.settings.cubeName })
    this.mLog({ template: 'number of packs: ' + this.settings.numPacks })
    this.mLog({ template: 'cards per pack: ' + this.settings.packSize })
  }
  else if (this.settings.set) {
    this.mLog({ template: 'set name: ' + this.settings.set.name })
  }
  this.mLogOutdent()

  let packIndex = 0

  for (const player of this.getPlayerAll()) {
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
  if (this.settings.scars) {
    this.mLog({ template: 'Assigning scars' })

    const players = this.getPlayerAll()
    const scars = this.settings.scars
    const scarRounds = this.settings.scarRounds
    const scarsPerPlayer = scarRounds.length * 2

    for (let i = 0; i < players.length; i++) {
      const player = players[i]
      player.scars = {}
      const playerScars = scars.slice(i * scarsPerPlayer, (i + 1) * scarsPerPlayer)

      for (let j = 0; j < scarRounds.length; j++) {
        const round = scarRounds[j]
        const roundScars = playerScars.slice(j * 2, (j + 1) * 2)
        player.scars[round] = roundScars
      }
    }
  }
}


////////////////////////////////////////////////////////////////////////////////
// Main

CubeDraft.prototype.mainLoop = function() {
  while (!this.checkGameComplete()) {
    const playerOptions = this
      .getPlayerAll()
      .filter(p => this.checkPlayerHasOption(p))
      .map(p => this.getPlayerOptions(p))

    const action = this.requestInputAny(playerOptions)
    const player = this.getPlayerByName(action.actor)

    switch (action.title) {
      case 'Apply Scar':
        this.aApplyScar(player, action.selection[0])
        break

      case 'Draft Card':
        this.aDraftCard(player, this.getNextPackForPlayer(player), action.selection[0])
        break

      default:
        this.mLog({ template: `Unknown action: ${action.title}` })
        break
    }
  }

  throw new GameOverEvent({
    player: 'everyone',
    reason: 'Draft is complete'
  })
}

CubeDraft.prototype.aApplyScar = function(player, data) {
  this.mLog({
    template: '{player} applied a scar',
    args: { player },
  })

  const scarIndex = data.scarIndex
  const originalId = data.originalId
  const newData = data.newData

  const pack = this.getNextPackForPlayer(player)
  const packRound = pack.index + 1

  // Remember which scars were actually used in this game.
  this.state.usedScars.push(player.scars[packRound][scarIndex])

  // Remove the used scars from the player
  player.scars[packRound] = null

  // Mark the card so this player can't draft it this round
  player.scarredCardId = originalId

  // Update the card in the pack to match the new, scarred data.
  const card = this.getCardById(originalId)
  card.name = newData.name
  card.set = newData.set
  card.collector_number = newData.collector_number
  card.custom_id = newData.custom_id
  card.data = newData
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

  /* this.mLog({
   *   template: '{player} drafted {card}',
   *   args: { player, card },
   * }) */
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
    const nextPlayer = this.getPlayerNextForPack(pack)
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
    this.mLog({
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

CubeDraft.prototype.checkForWaitingScar = function(player) {
  return this.getScarsForWaitingPack(player).length > 0
}

CubeDraft.prototype.checkForWaitingPack = function(player) {
  return Boolean(this.getNextPackForPlayer(player))
}

CubeDraft.prototype.checkGameComplete = function() {
  return this
    .getPlayerAll()
    .every(player => !this.getNextPackForPlayer(player))
}

CubeDraft.prototype.checkPlayerHasOption = function(player) {
  return (
    this.checkForWaitingScar(player)
    || this.checkForWaitingPack(player)
  )
}


////////////////////////////////////////////////////////////////////////////////
// Getters

CubeDraft.prototype.getCardById = function(cardId) {
  return this.cardsById[cardId]
}

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

CubeDraft.prototype.getPlayerNextForPack = function(pack) {
  util.assert(Boolean(pack.waiting), 'pack does not have a waiting player')

  const direction = pack.index % 2
  if (direction === 0) {
    return this.getPlayerFollowing(pack.waiting)
  }
  else {
    return this.getPlayerPreceding(pack.waiting)
  }
}

CubeDraft.prototype.getPlayerOptions = function(player) {
  if (this.checkForWaitingScar(player)) {
    // This is a special action, because it cannot be applied in-game; instead
    // it is handled on the UI, and the UI reports back which card was scarred and
    // how it was modified.

    const pack = this.getNextPackForPlayer(player)
    const scars = this.getScarsForWaitingPack(player)
    pack.viewPack(player)
    return {
      actor: player.name,
      title: 'Apply Scar',
      choices: '__UNSPECIFIED__',
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

CubeDraft.prototype.getScarsForWaitingPack = function(player) {
  // Not all games include scars.
  if (!player.scars) {
    return []
  }

  const pack = this.getNextPackForPlayer(player)
  if (pack) {
    const packRound = pack.index + 1
    return player.scars[packRound] || []
  }

  // No scars need to be applied to this pack.
  else {
    return []
  }
}

CubeDraft.prototype.getWaitingPacksForPlayer = function(player) {
  return player.waitingPacks
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
