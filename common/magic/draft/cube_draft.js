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

function factoryFromLobby(lobby) {
  return GameFactory({
    game: 'CubeDraft',
    name: lobby.name,
    expansions: lobby.options.expansions,
    players: lobby.users,
    seed: lobby.seed,
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

  this.initializePlayers()
  this.initializePacks()

  this.mLogOutdent()
  this.state.initializationComplete = true
  this._breakpoint('initialization-complete')
}

CubeDraft.prototype.initializePlayers = function() {
  this.state.players = this.settings.players.map(p => ({
    _id: p._id,
    id: p.name,
    name: p.name,
    index: null,
    draftCompelete: false,
    picked: [],
    waitingPacks: [],
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

  this.mLog({ template: 'Passing out packs' })

  let packIndex = 0

  for (const player of this.getPlayerAll()) {
    for (let p_i = 0; p_i < this.settings.numPacks; p_i++) {
      const pack = this.state.packs[packIndex]
      pack.index = p_i
      pack.owner = player
      player.unopenedPacks.push(pack)
      packIndex += 1
    }
  }
}


////////////////////////////////////////////////////////////////////////////////
// Main

CubeDraft.prototype.mainLoop = function() {
  while (true) {
    const playerOptions = this
      .getPlayerAll()
      .filter(p => this.checkPlayerHasOption(p))
      .map(p => this.getPlayerOptions(p))

    const action = this.requestInputAny(playerOptions)
    const player = this.getPlayerByName(action.actor)

    switch (action.title) {
      case 'Draft Card':
        this.aDraftCard(player, this.getNextPackForPlayer(player), action.selection[0])
        break

      default:
        this.mLog({ template: `Unknown action: ${action.title}` })
        break
    }
  }
}

CubeDraft.prototype.aDraftCard = function(player, pack, cardId) {
  util.assert(this.getNextPackForPlayer(player) === pack, "This pack isn't ready for this player")

  const card = pack.getCardById(cardId)
  util.assert(pack.checkCardIsAvailable(card), "The selected card is not in the pack.")

  this.mLog({
    template: '{player} drafted {card}',
    args: { player, card },
  })
  pack.picked.push(card)
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
    nextPlayer.waitingPacks.push(pack)
    pack.waiting = nextPlayer
  }
}

CubeDraft.prototype.aOpenNextPack = function(player) {
  const pack = player.unopenedPacks.shift()
  if (pack) {
    this.mLog({
      template: '{player} opens a new pack',
      args: { player }
    })

    this.mPushWaitingPack(player, pack)
    for (const card of pack.cards) {
      this.mMakeCardVisible(card, player)
    }
  }

  // Player has no remaining packs.
  // They are done unless some draft matters event happens that affects them.
  else {
    player.draftComplete = true
  }
}

CubeDraft.prototype.checkPlayerHasOption = function(player) {
  return this.getWaitingPacksForPlayer(player).length > 0
}

CubeDraft.prototype.getPicksByPlayer = function(player) {
  return player.picked
}

CubeDraft.prototype.getNextPackForPlayer = function(player) {
  return this.getWaitingPacksForPlayer(player)[0]
}

CubeDraft.prototype.getWaitingPacksForPlayer = function(player) {
  return player.waitingPacks
}

CubeDraft.prototype.getPacks = function() {
  return this.state.packs
}

CubeDraft.prototype.getPlayerNextForPack = function(pack) {
  const direction = pack.index % 2
  if (direction === 0) {
    return this.getPlayerFollowing(pack.waiting)
  }
  else {
    return this.getPlayerPreceding(pack.waiting)
  }
}

CubeDraft.prototype.getPlayerOptions = function(player) {
  const pack = this.getWaitingPacksForPlayer(player)[0]
  if (pack) {
    return {
      actor: player.name,
      title: 'Draft Card',
      choices: pack.getRemainingCards().map(c => c.id)
    }
  }
  else {
    return []
  }
}

CubeDraft.prototype.mMakeCardVisible = function(card, player) {
  util.array.pushUnique(card.visibility, player)
}

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
      const isHidden = !card.visibility.find(p => p.name === this.viewerName)

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
