const {
  Game,
  GameFactory,
  GameOverEvent,
} = require('../lib/game.js')
const res = require('./res/index.js')
const util = require('../lib/util.js')

const { AgricolaLogManager } = require('./AgricolaLogManager.js')
const { AgricolaPlayerManager } = require('./AgricolaPlayerManager.js')
const { AgricolaZone } = require('./AgricolaZone.js')


module.exports = {
  GameOverEvent,
  Agricola,
  AgricolaFactory,

  constructor: Agricola,
  factory: factoryFromLobby,
  res,
}


function Agricola(serialized_data, viewerName) {
  Game.call(this, serialized_data, viewerName, {
    LogManager: AgricolaLogManager,
    PlayerManager: AgricolaPlayerManager,
  })
}

util.inherit(Game, Agricola)

function AgricolaFactory(settings, viewerName) {
  const data = GameFactory(settings)
  return new Agricola(data, viewerName)
}

function factoryFromLobby(lobby) {
  return AgricolaFactory({
    game: 'Agricola',
    name: lobby.name,
    players: lobby.users,
    seed: lobby.seed,
    numPlayers: lobby.users.length,
  })
}


////////////////////////////////////////////////////////////////////////////////
// Main Program

Agricola.prototype._mainProgram = function() {
  this.initialize()
  this.mainLoop()
}


////////////////////////////////////////////////////////////////////////////////
// Initialization

Agricola.prototype.initialize = function() {
  this.log.add({ template: 'Initializing game' })
  this.log.indent()

  this.initializePlayers()
  this.initializeZones()
  this.initializeActionSpaces()
  this.initializeCards()

  this.log.outdent()

  this.state.round = 0
  this.state.initializationComplete = true
  this._breakpoint('initialization-complete')
}

Agricola.prototype.initializePlayers = function() {
  for (const player of this.players.all()) {
    player.initializeResources()
  }
}

Agricola.prototype.initializeZones = function() {
  // Create common zones
  this.zones.register(new AgricolaZone(this, 'common.actionSpaces', 'Action Spaces', 'public'))
  this.zones.register(new AgricolaZone(this, 'common.futureActions', 'Future Actions', 'public'))
  this.zones.register(new AgricolaZone(this, 'common.majorImprovements', 'Major Improvements', 'public'))

  // Create player zones
  for (const player of this.players.all()) {
    this.zones.register(new AgricolaZone(this, `players.${player.name}.hand`, 'Hand', 'private', player))
    this.zones.register(new AgricolaZone(this, `players.${player.name}.played`, 'Played', 'public', player))
    this.zones.register(new AgricolaZone(this, `players.${player.name}.farmyard`, 'Farmyard', 'public', player))
  }
}

Agricola.prototype.initializeActionSpaces = function() {
  // TODO: Set up the action board with basic action spaces
}

Agricola.prototype.initializeCards = function() {
  // TODO: Set up occupation and minor improvement decks
}


////////////////////////////////////////////////////////////////////////////////
// Main Loop

Agricola.prototype.mainLoop = function() {
  while (!this.gameOver) {
    this.state.round += 1

    if (this.state.round > 14) {
      this.endGame()
      break
    }

    this.log.add({
      template: '=== Round {round} ===',
      args: { round: this.state.round },
    })

    this.revealRoundAction()
    this.workPhase()
    this.returnHomePhase()
    this.harvestPhase()
  }
}

Agricola.prototype.revealRoundAction = function() {
  // TODO: Reveal the action card for this round
  this.log.add({ template: 'Revealing round action' })
}

Agricola.prototype.workPhase = function() {
  // TODO: Players take turns placing family members on action spaces
  this.log.add({ template: 'Work phase' })

  // Placeholder: each player gets one action per round for now
  for (const player of this.players.all()) {
    this.playerTurn(player)
  }
}

Agricola.prototype.playerTurn = function(player) {
  const choices = this.getAvailableActions(player)

  if (choices.length === 0) {
    this.log.add({
      template: '{player} has no available actions',
      args: { player },
    })
    return
  }

  const selection = this.actions.choose(player, choices, {
    title: 'Choose an action',
  })

  if (selection.length > 0) {
    this.executeAction(player, selection[0])
  }
}

// eslint-disable-next-line no-unused-vars
Agricola.prototype.getAvailableActions = function(player) {
  // TODO: Return list of available action spaces based on player state
  return ['Build Room', 'Plow Field', 'Take Grain', 'Take Wood']
}

Agricola.prototype.executeAction = function(player, action) {
  this.log.add({
    template: '{player} chooses {action}',
    args: { player, action },
  })

  // TODO: Implement action execution
}

Agricola.prototype.returnHomePhase = function() {
  // TODO: Return all family members home
  this.log.add({ template: 'Return home phase' })
}

Agricola.prototype.harvestPhase = function() {
  // Harvest happens at the end of rounds 4, 7, 9, 11, 13, 14
  const harvestRounds = [4, 7, 9, 11, 13, 14]

  if (harvestRounds.includes(this.state.round)) {
    this.log.add({ template: 'Harvest phase' })
    this.fieldPhase()
    this.feedingPhase()
    this.breedingPhase()
  }
}

Agricola.prototype.fieldPhase = function() {
  // TODO: Harvest grain and vegetables from fields
}

Agricola.prototype.feedingPhase = function() {
  // TODO: Feed family members
}

Agricola.prototype.breedingPhase = function() {
  // TODO: Animals breed
}


////////////////////////////////////////////////////////////////////////////////
// End Game

Agricola.prototype.endGame = function() {
  this.log.add({ template: 'Game Over - Calculating scores' })

  let highestScore = -Infinity
  let winner = null

  for (const player of this.players.all()) {
    const score = this.calculateScore(player)
    this.log.add({
      template: '{player} scores {score} points',
      args: { player, score },
    })

    if (score > highestScore) {
      highestScore = score
      winner = player
    }
  }

  this.youWin(winner, 'highest score')
}

Agricola.prototype.calculateScore = function(player) {
  // Use the player's calculateScore method
  return player.calculateScore()
}
