const { transitionFactory2 } = require('../../lib/transitionFactory.js')
const util = require('../../lib/util.js')
const res = require('../resources.js')

module.exports = transitionFactory2({
  steps: [
    {
      name: 'initializePlayers',
      func: _initializePlayers,
    },
    {
      name: 'initializeZones',
      func: _initializeZones,
    },
    {
      name: 'shuffleDecks',
      func: _shuffleDecks,
    },
    {
      name: 'selectAchievements',
      func: _selectAchievements,
    },
    {
      name: 'dealStartingCards',
      func: _dealStartingCards
    },
  ]
})

function _initializePlayers(context) {
  const game = context.state
  game.state.players = game.users.map(user => ({
    _id: user._id,
    name: user.name,
  }))
  util.array.shuffle(game.state.players)
  game.state.players.forEach((player, index) => player.index = index)
}

function _initializeZones(context) {
  const game = context.state
  const state = game.state
  const zones = state.zones || {}

  _addDeckZones(zones)
  _addAchievementZones(zones)
  _addPlayerZones(state.players, zones)

  return context.wait({
    actor: 'dennis',
    name: 'wait',
    options: []
  })
}

function _addDeckZones(zones) {
  zones.decks = {}
  for (const exp of ['base', 'echo', 'figs', 'city', 'arti']) {
    zones.decks[exp] = {}
    const data = resources[exp]
    for (const [age, cards] of Object.entries(resources[exp].byName)) {
      zones.decks[exp][age] = {
        name: `decks-${exp}-${age}`,
        cards: cards.map(c => c.name),
        kind: 'deck',
      }
      util.array.shuffle(zone.decks[exp][age].cards)
    }
  }
}

function _addPlayerZones(players, zones) {
  zones.players = {}
  for (const player of players) {
    const root = {}
    _addPlayerZone(player, 'hand', 'private', root)
    _addPlayerZone(player, 'score', 'private', root)
    _addPlayerZone(player, 'forecast', 'private', root)
    _addPlayerZone(player, 'achievements', 'public', root)
    _addPlayerZone(player, 'red', 'public', root)
    _addPlayerZone(player, 'blue', 'public', root)
    _addPlayerZone(player, 'green', 'public', root)
    _addPlayerZone(player, 'yellow', 'public', root)
    _addPlayerZone(player, 'purple', 'public', root)
    _addPlayerZone(player, 'artifact', 'public', root)
    zones.players[player.name] = root
  }
}

function _addPlayerZone(player, name, kind, root) {
  root[name] = {
    name: `${player.name}-${name}`,
    cards: [],
    kind,
  }
}

function _shuffleDecks(context) {
  const game = context.state
  for (const age of [1,2,3,4,5,6,7,8,9,10]) {
    for (const exp of game.getExpansionList()) {
      game.mShuffleZone(game.getZoneByAge(exp, age))
    }
  }
}

function _selectAchievements(context) {
  const game = context.state
  for (const age of [1,2,3,4,5,6,7,8,9]) {
    game.mMoveCard(game.getDeckByAge('base', age), 'achievements')
  }
}

function _dealStartingCards(context) {
  const game = context.state
  for (const player of game.getPlayerAll()) {
    game.mDraw(player, 1)
    game.mDraw(player, 1)
  }
}
