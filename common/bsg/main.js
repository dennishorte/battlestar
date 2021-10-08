const RecordKeeper = require('../lib/recordkeeper.js')
const StateMachine = require('../lib/statemachine.js')

const initialize = require('./initialize.js')

module.exports = {
  Game,
  factory: stateFactory,

  deckbuilder: require('./deckbuilder.js'),
  res: require('./resources.js'),
  util: require('./util.js'),
}

function Game(state) {
  this.actor = null
  this.state = null
  this.rk = null
  this.sm = null
}

function stateFactory(lobby) {
  const state = {
    game: lobby.game,
    name: lobby.name,
    options: lobby.options,
    users: lobby.users,
    createdTimestamp: Date.now(),
    saveKey: 0,
    initialized: false,
    sm: {
      stack: [],
      waiting: [],
    },
  }

  initialize(state)
  return state
}

Game.prototype.load = function(transitions, state, actor) {
  this.actor = actor
  this.state = state
  this.rk = new RecordKeeper(state)
  this.sm = new StateMachine(
    transitions,
    this,
    this.rk,
    this.state.sm.stack,
    this.state.sm.waiting,
  )
}

Game.prototype.run = function() {
  return this.sm.run()
}

Game.prototype.getActor = function() {
  return this.actor
}

Game.prototype.getLog = function() {
  return this.state.log
}

Game.prototype.getPlayerAll = function() {
  return this.state.players
}

Game.prototype.getPlayerByIndex = function(index) {
  return this.state.players[index]
}

Game.prototype.getPlayerHasCharacter = function(player) {
  const playerZone = this.getZoneByPlayerName(player.name)
  const characterCard = playerZone.cards.find(c => c.kind === 'character')
  return !!characterCard
}

Game.prototype.getWaiting = function(player) {
  return this.sm.waiting[0]
}

Game.prototype.getZoneByName = function(name) {
  const tokens = name.split('.')
  let zone = this.state.zones
  while (tokens.length) {
    const next = tokens.shift()
    zone = zone[next]
    if (!zone) {
      throw `Error loading ${next} of zone ${name}.`
    }
  }
  return zone
}

Game.prototype.getZoneByPlayerName = function(name) {
  return this.state.zones.players[name]
}

Game.prototype.mLog = function(msg) {
  if (!msg.classes) {
    msg.classes = []
  }
  if (!msg.args) {
    msg.args = {}
  }

  enrichLogArgs(msg)
  msg.actor = this.getactor().name
  msg.id = this.getlog().length

  this.rk.session.push(this.state.log, util.deepcopy(msg))
}

Game.prototype.mPlayerAssignCharacter = function(playerName, characterName) {
  this.mutations.log({
    template: "{player} chooses {character}",
    args: {
      player: playerName,
      character: characterName,
    }
  })

  // Put the character card into the player's hand
  const playerHand = this.getZonebyPlayerName(playerName)
  const characterZone = this.getZonebyName('character')
  const characterCard = characterZone.cards.find(c => c.name === characterName)
  this.rk.session.move(characterCard, playerHand, 0)

  // Put the player's pawn in the correct location
  const pawn = playerHand.cards.find(c => c.kind === 'player-token')
  const startingLocation = this.getZonebyLocationName(characterCard.setup)
  this.rk.session.move(pawn, startingLocation)
}


function enrichLogArgs(msg) {
  for (const key of Object.keys(msg.args)) {
    // Convert string args to a dict
    if (typeof msg.args[key] !== 'object') {
      msg.args[key] = {
        value: msg.args[key],
      }
    }

    // Ensure the dict has a classes entry
    const classes = msg.args[key].classes || []
    msg.args[key].classes = classes

    if (key === 'player') {
      util.array.pushUnique(classes, 'player-name')
    }
    else if (key === 'character') {
      util.array.pushUnique(classes, 'character-name')
      util.array.pushUnique(classes, bsg.util.characterNameToCssClass(msg.args[key].value))
    }
    else if (key === 'location') {
      util.array.pushUnique(classes, 'location-name')
    }
    else if (key === 'phase') {
      util.array.pushUnique(classes, 'phase-name')
    }
    else if (key === 'title') {
      util.array.pushUnique(classes, 'title-name')
    }
    else if (key === 'card') {
      const card = msg.args['card']
      if (typeof card !== 'object') {
        throw `Pass whole card object to log for better logging. Got: ${card}`
      }
      msg.args['card'] = {
        value: card.name,
        visibility: card.visibility,
        kind: card.kind,
        classes: [`card-${card.kind}`],
      }
    }
  }
}
